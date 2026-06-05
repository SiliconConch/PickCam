// engines/watermark/renderer.js
// 水印渲染引擎（Canvas绘制）V1.1

const { ExifReader } = require('../../utils/exif.js');
const { CaptionManager } = require('../../config/captions.js');

class WatermarkRenderer {
  /**
   * 将水印合成到图片，返回临时文件路径
   */
  static async applyWatermark(imagePath, watermarkConfig, meta = {}) {
    if (!watermarkConfig || !watermarkConfig.elements || watermarkConfig.elements.length === 0) {
      return imagePath;
    }

    try {
      const info = await new Promise((resolve, reject) => {
        wx.getImageInfo({ src: imagePath, success: resolve, fail: reject });
      });
      const imgWidth = info.width;
      const imgHeight = info.height;

      const canvas = wx.createOffscreenCanvas({ type: '2d', width: imgWidth, height: imgHeight });
      const ctx = canvas.getContext('2d');

      const img = canvas.createImage();
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = imagePath;
      });
      ctx.drawImage(img, 0, 0, imgWidth, imgHeight);

      const textLines = WatermarkRenderer._resolveTextLines(watermarkConfig, meta);
      if (textLines.length === 0) return imagePath;

      const layout = WatermarkRenderer._calculateLayout(ctx, watermarkConfig, textLines, imgWidth, imgHeight);

      // 绘制背景（含渐变晕影）
      const bg = watermarkConfig.background;
      if (bg && (bg.show || bg.type === 'gradient')) {
        WatermarkRenderer._drawBackground(ctx, bg, layout);
      }

      // 绘制文字
      WatermarkRenderer._drawTextLines(ctx, watermarkConfig, textLines, layout);

      return await new Promise((resolve, reject) => {
        wx.canvasToTempFilePath({
          canvas,
          fileType: 'jpg',
          quality: 0.95,
          success: res => resolve(res.tempFilePath),
          fail: reject
        });
      });
    } catch (e) {
      console.error('水印渲染失败，使用原图:', e);
      return imagePath;
    }
  }

  // ── 解析水印元素为文本行 ──
  static _resolveTextLines(config, meta) {
    const lines = [];
    const isVertical = config.layout === 'vertical';
    const captionMgr = new CaptionManager();

    if (isVertical) {
      for (const el of config.elements) {
        const text = WatermarkRenderer._resolveElementText(el, meta, captionMgr);
        if (text) lines.push({ text, element: el });
      }
    } else {
      const parts = [];
      const mainEl = config.elements[0];
      for (const el of config.elements) {
        const text = WatermarkRenderer._resolveElementText(el, meta, captionMgr);
        if (text) parts.push({ text, element: el });
      }
      if (parts.length > 0) lines.push({ parts, element: mainEl, isHorizontal: true });
    }
    return lines;
  }

  static _resolveElementText(element, meta, captionMgr) {
    switch (element.type) {
      case 'date': {
        const date = meta.datetime || new Date();
        return ExifReader.formatDate(date, element.format || 'YYYY/MM/DD');
      }
      case 'location': return meta.location || '';
      case 'device':   return meta.device || '';
      case 'caption': {
        if (element.mode === 'daily')  return captionMgr.getDailyCaption();
        if (element.mode === 'random') return captionMgr.getRandomCaption();
        return element.value || captionMgr.getDailyCaption();
      }
      case 'custom':    return element.value || '';
      case 'emoji':     return element.value || '';
      case 'separator': return element.value || '·';
      default: return '';
    }
  }

  // ── 计算水印布局 ──
  static _calculateLayout(ctx, config, textLines, imgWidth, imgHeight) {
    const padding = config.background && config.background.padding
      ? config.background.padding : { x: 0, y: 0 };

    let maxLineWidth = 0;
    let totalHeight = 0;
    const lineHeights = [];

    for (const line of textLines) {
      const fontSize = WatermarkRenderer._getFontSize(line, config, imgWidth);
      ctx.font = WatermarkRenderer._buildFont(line.element, fontSize);
      let lineWidth = 0;

      if (line.isHorizontal && line.parts) {
        for (const part of line.parts) {
          const pfs = WatermarkRenderer._getFontSize({ element: part.element }, config, imgWidth);
          ctx.font = WatermarkRenderer._buildFont(part.element, pfs);
          lineWidth += ctx.measureText(part.text).width + 8;
        }
      } else {
        lineWidth = ctx.measureText(line.text).width;
      }

      maxLineWidth = Math.max(maxLineWidth, lineWidth);
      const lineH = fontSize * 1.4;
      lineHeights.push(lineH);
      totalHeight += lineH;
    }

    if (textLines.length > 1) totalHeight += (textLines.length - 1) * 4;

    const blockWidth  = maxLineWidth + padding.x * 2;
    const blockHeight = totalHeight  + padding.y * 2;

    const pos = config.position || { preset: 'bottom-left', x: 24, y: -24 };
    const { drawX, drawY } = WatermarkRenderer._calcDrawPosition(pos, blockWidth, blockHeight, imgWidth, imgHeight);

    return { drawX, drawY, blockWidth, blockHeight, lineHeights, padding, maxLineWidth, totalHeight, imgWidth, imgHeight };
  }

  static _calcDrawPosition(pos, blockW, blockH, imgW, imgH) {
    const MARGIN = 24;
    const preset  = pos.preset || 'bottom-left';
    const offsetX = pos.x || 0;
    const offsetY = pos.y || 0;
    let x = 0, y = 0;

    switch (preset) {
      case 'top-left':      x = MARGIN + offsetX;                    y = MARGIN + offsetY; break;
      case 'top-center':    x = (imgW - blockW) / 2 + offsetX;       y = MARGIN + offsetY; break;
      case 'top-right':     x = imgW - blockW - MARGIN + offsetX;    y = MARGIN + offsetY; break;
      case 'middle-left':   x = MARGIN + offsetX;                    y = (imgH - blockH) / 2 + offsetY; break;
      case 'center':        x = (imgW - blockW) / 2 + offsetX;       y = (imgH - blockH) / 2 + offsetY; break;
      case 'middle-right':  x = imgW - blockW - MARGIN + offsetX;    y = (imgH - blockH) / 2 + offsetY; break;
      case 'bottom-left':   x = MARGIN + offsetX;                    y = imgH - blockH + offsetY - MARGIN; break;
      case 'bottom-center': x = (imgW - blockW) / 2 + offsetX;       y = imgH - blockH + offsetY - MARGIN; break;
      case 'bottom-right':  x = imgW - blockW - MARGIN + offsetX;    y = imgH - blockH + offsetY - MARGIN; break;
      default:              x = MARGIN;                               y = imgH - blockH - MARGIN;
    }

    return { drawX: Math.max(0, x), drawY: Math.max(0, y) };
  }

  // ── 绘制背景 ──
  static _drawBackground(ctx, bg, layout) {
    if (bg.type === 'gradient') {
      // 全宽渐变晕影
      const imgW  = layout.imgWidth;
      const imgH  = layout.imgHeight;
      const gradH = imgH * (bg.height || 0.40);
      const startY = imgH - gradH;
      const grd = ctx.createLinearGradient(0, startY, 0, imgH);
      grd.addColorStop(0, 'rgba(0,0,0,0)');
      grd.addColorStop(1, `rgba(0,0,0,${bg.opacity || 0.7})`);
      ctx.globalAlpha = 1;
      ctx.fillStyle = grd;
      ctx.fillRect(0, startY, imgW, gradH);
      return;
    }

    const opacity = bg.opacity !== undefined ? bg.opacity : 0.6;
    ctx.globalAlpha = opacity;
    ctx.fillStyle = bg.color || '#000000';

    if (bg.type === 'rounded-rect' && bg.radius) {
      WatermarkRenderer._drawRoundRect(ctx, layout.drawX, layout.drawY, layout.blockWidth, layout.blockHeight, bg.radius);
      ctx.fill();
    } else {
      ctx.fillRect(layout.drawX, layout.drawY, layout.blockWidth, layout.blockHeight);
    }
    ctx.globalAlpha = 1;
  }

  static _drawRoundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  // ── 绘制文字行 ──
  static _drawTextLines(ctx, config, textLines, layout) {
    let currentY = layout.drawY + layout.padding.y;

    for (let i = 0; i < textLines.length; i++) {
      const line   = textLines[i];
      const lineH  = layout.lineHeights[i];
      const textY  = currentY + lineH * 0.8;
      const opacity = (line.element.opacity !== undefined ? line.element.opacity : 100) / 100;
      ctx.globalAlpha = opacity;

      if (line.isHorizontal && line.parts) {
        let currentX = layout.drawX + layout.padding.x;
        for (const part of line.parts) {
          const pfs = WatermarkRenderer._getFontSizeValue(part.element, layout.imgWidth);
          ctx.font      = WatermarkRenderer._buildFont(part.element, pfs);
          ctx.fillStyle = part.element.color || '#FFFFFF';
          WatermarkRenderer._applyShadow(ctx, part.element.shadow);
          if (part.element.stroke && part.element.stroke.show) {
            ctx.strokeStyle = part.element.stroke.color || '#000000';
            ctx.lineWidth   = part.element.stroke.width || 1;
            ctx.strokeText(part.text, currentX, textY);
          }
          ctx.fillText(part.text, currentX, textY);
          WatermarkRenderer._clearShadow(ctx);
          currentX += ctx.measureText(part.text).width + 8;
        }
      } else {
        const fontSize = WatermarkRenderer._getFontSizeValue(line.element, layout.imgWidth);
        ctx.font      = WatermarkRenderer._buildFont(line.element, fontSize);
        ctx.fillStyle = line.element.color || '#FFFFFF';
        const textX   = layout.drawX + layout.padding.x;
        WatermarkRenderer._applyShadow(ctx, line.element.shadow);
        if (line.element.stroke && line.element.stroke.show) {
          ctx.strokeStyle = line.element.stroke.color || '#000000';
          ctx.lineWidth   = line.element.stroke.width || 1;
          ctx.strokeText(line.text, textX, textY);
        }
        ctx.fillText(line.text, textX, textY);
        WatermarkRenderer._clearShadow(ctx);
      }

      ctx.globalAlpha = 1;
      currentY += lineH + 4;
    }
  }

  static _applyShadow(ctx, shadow) {
    if (!shadow) return;
    ctx.shadowColor   = shadow.color  || 'rgba(0,0,0,0.85)';
    ctx.shadowBlur    = shadow.blur   || 8;
    ctx.shadowOffsetX = shadow.x      || 0;
    ctx.shadowOffsetY = shadow.y      || 1;
  }

  static _clearShadow(ctx) {
    ctx.shadowColor   = 'transparent';
    ctx.shadowBlur    = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
  }

  static _getFontSizeValue(element, imgWidth) {
    return Math.round((element.size || 28) * (imgWidth || 1080) / 1080);
  }

  static _getFontSize(line, config, imgWidth) {
    const el = line.element || (line.parts && line.parts[0] && line.parts[0].element) || {};
    return Math.round((el.size || 28) * imgWidth / 1080);
  }

  static _buildFont(element, fontSize) {
    const weight = element.bold ? 'bold' : 'normal';
    const family = element.font || 'PingFang SC';
    return `${weight} ${fontSize}px ${family}, sans-serif`;
  }
}

module.exports = { WatermarkRenderer };
