// engines/filter/renderer.js
// 滤镜渲染引擎（Canvas像素处理）V1.1

const { FILTER_PRESETS } = require('./presets.js');

class FilterRenderer {
  /**
   * 应用滤镜到图片，返回处理后的临时文件路径（用于保存）
   * @param {string} imagePath
   * @param {string|Object} filterIdOrParams - 滤镜ID 或 直接传入参数对象
   * @param {number} intensity - 0-100
   */
  static async applyFilterToImage(imagePath, filterIdOrParams, intensity = 100) {
    let params;
    if (typeof filterIdOrParams === 'string') {
      if (filterIdOrParams === 'original' || intensity === 0) return imagePath;
      const preset = FILTER_PRESETS.find(p => p.id === filterIdOrParams);
      if (!preset) return imagePath;
      params = preset.params;
    } else {
      params = filterIdOrParams;
      if (!params) return imagePath;
    }

    try {
      const info = await new Promise((resolve, reject) => {
        wx.getImageInfo({ src: imagePath, success: resolve, fail: reject });
      });
      const { width, height } = info;

      const canvas = wx.createOffscreenCanvas({ type: '2d', width, height });
      const ctx = canvas.getContext('2d');
      const img = canvas.createImage();

      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = imagePath;
      });
      ctx.drawImage(img, 0, 0, width, height);

      const imageData = ctx.getImageData(0, 0, width, height);
      FilterRenderer.applyFilter(imageData, params, intensity);
      ctx.putImageData(imageData, 0, 0);

      return await new Promise((resolve, reject) => {
        wx.canvasToTempFilePath({
          canvas,
          fileType: 'jpg',
          quality: 0.92,
          success: res => resolve(res.tempFilePath),
          fail: reject
        });
      });
    } catch (e) {
      console.error('滤镜处理失败，使用原图:', e);
      return imagePath;
    }
  }

  /**
   * 对 ImageData 应用滤镜 —— 原地修改，返回同一对象
   * 不使用 new ImageData()，兼容所有小程序版本
   *
   * @param {ImageData} imageData
   * @param {Object}    params
   * @param {number}    intensity  0-100
   */
  static applyFilter(imageData, params, intensity = 100) {
    const data = imageData.data;
    const original = new Uint8ClampedArray(data);
    const processed = new Uint8ClampedArray(data);
    const w = imageData.width;
    const h = imageData.height;

    if (params.brightness !== 0)
      FilterRenderer.processBrightness(processed, params.brightness);
    if (params.contrast !== 0)
      FilterRenderer.processContrast(processed, params.contrast);
    if (params.saturation !== undefined && params.saturation !== 0)
      FilterRenderer.processSaturation(processed, params.saturation);
    if (params.temperature !== 0 || params.tint !== 0)
      FilterRenderer.processTemperature(processed, params.temperature || 0, params.tint || 0);
    if (params.vibrance)
      FilterRenderer.processVibrance(processed, params.vibrance);
    if (params.highlights !== 0 || params.shadows !== 0)
      FilterRenderer.processHighlightsShadows(processed, params.highlights || 0, params.shadows || 0);
    if (params.sharpen)
      FilterRenderer.processSharpen(processed, params.sharpen);
    if (params.fade)
      FilterRenderer.processFade(processed, params.fade);
    if (params.grain)
      FilterRenderer.processGrain(processed, params.grain);
    if (params.vignetteIntensity && w && h)
      FilterRenderer.processVignette(processed, w, h, params.vignetteIntensity);

    // 按强度混合，写回 data
    const a = intensity / 100;
    const ia = 1 - a;
    for (let i = 0; i < data.length; i += 4) {
      data[i]     = (original[i]     * ia + processed[i]     * a) | 0;
      data[i + 1] = (original[i + 1] * ia + processed[i + 1] * a) | 0;
      data[i + 2] = (original[i + 2] * ia + processed[i + 2] * a) | 0;
    }
    return imageData;
  }

  // ── 亮度（-100 ~ 100） ──
  static processBrightness(data, value) {
    const f = value * 2.55;
    for (let i = 0; i < data.length; i += 4) {
      data[i]     = Math.max(0, Math.min(255, data[i]     + f));
      data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + f));
      data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + f));
    }
  }

  // ── 对比度（-100 ~ 100） ──
  static processContrast(data, value) {
    const f = (259 * (value + 255)) / (255 * (259 - value));
    for (let i = 0; i < data.length; i += 4) {
      data[i]     = Math.max(0, Math.min(255, f * (data[i]     - 128) + 128));
      data[i + 1] = Math.max(0, Math.min(255, f * (data[i + 1] - 128) + 128));
      data[i + 2] = Math.max(0, Math.min(255, f * (data[i + 2] - 128) + 128));
    }
  }

  // ── 饱和度（-100 全灰 ~ 100 高饱） ──
  static processSaturation(data, value) {
    const f = (value + 100) / 100;
    for (let i = 0; i < data.length; i += 4) {
      const g = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
      data[i]     = Math.max(0, Math.min(255, g + f * (data[i]     - g)));
      data[i + 1] = Math.max(0, Math.min(255, g + f * (data[i + 1] - g)));
      data[i + 2] = Math.max(0, Math.min(255, g + f * (data[i + 2] - g)));
    }
  }

  // ── 色温（暖/冷）+ 色调（绿/品） ──
  static processTemperature(data, temp, tint) {
    const tf = temp / 100;
    const nf = tint / 100;
    for (let i = 0; i < data.length; i += 4) {
      data[i]     = Math.max(0, Math.min(255, data[i]     + tf * 30 - nf * 15));
      data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + nf * 30));
      data[i + 2] = Math.max(0, Math.min(255, data[i + 2] - tf * 30 + nf * 15));
    }
  }

  // ── 自然饱和度（保护高饱区域） ──
  static processVibrance(data, value) {
    const f = value / 100;
    for (let i = 0; i < data.length; i += 4) {
      const max = Math.max(data[i], data[i + 1], data[i + 2]);
      const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
      const amt = ((Math.abs(max - avg) * 2 / 255) * f) / 2;
      if (data[i]     !== max) data[i]     = Math.min(255, data[i]     + (max - data[i])     * amt);
      if (data[i + 1] !== max) data[i + 1] = Math.min(255, data[i + 1] + (max - data[i + 1]) * amt);
      if (data[i + 2] !== max) data[i + 2] = Math.min(255, data[i + 2] + (max - data[i + 2]) * amt);
    }
  }

  // ── 高光/阴影分区调节 ──
  static processHighlightsShadows(data, highlights, shadows) {
    for (let i = 0; i < data.length; i += 4) {
      const lum = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
      if (highlights !== 0 && lum > 128) {
        const factor = (lum - 128) / 127;
        const adj = highlights * factor / 100 * 2.55;
        data[i]     = Math.max(0, Math.min(255, data[i]     + adj));
        data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + adj));
        data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + adj));
      }
      if (shadows !== 0 && lum < 128) {
        const factor = (128 - lum) / 128;
        const adj = shadows * factor / 100 * 2.55;
        data[i]     = Math.max(0, Math.min(255, data[i]     + adj));
        data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + adj));
        data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + adj));
      }
    }
  }

  // ── 清晰度（局部对比增强，-50 ~ +50） ──
  static processSharpen(data, value) {
    if (!value) return;
    const amount = value / 100;
    for (let i = 0; i < data.length; i += 4) {
      const lum = (0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]) / 255;
      // 正弦曲线权重：中间调最受影响
      const mask = Math.sin(lum * Math.PI) * amount * 25;
      for (let c = 0; c < 3; c++) {
        const v = data[i + c];
        data[i + c] = Math.max(0, Math.min(255, v + (v > 128 ? mask : -mask)));
      }
    }
  }

  // ── 褪色（提升暗部，模拟胶片） ──
  static processFade(data, value) {
    const f = value / 100;
    for (let i = 0; i < data.length; i += 4) {
      if (data[i]     < 128) data[i]     = Math.min(255, data[i]     + (128 - data[i])     * f * 0.5);
      if (data[i + 1] < 128) data[i + 1] = Math.min(255, data[i + 1] + (128 - data[i + 1]) * f * 0.5);
      if (data[i + 2] < 128) data[i + 2] = Math.min(255, data[i + 2] + (128 - data[i + 2]) * f * 0.5);
    }
  }

  // ── 颗粒（胶片噪点） ──
  static processGrain(data, value) {
    const amount = value / 30;
    for (let i = 0; i < data.length; i += 4) {
      const n = (Math.random() - 0.5) * 255 * amount;
      data[i]     = Math.max(0, Math.min(255, data[i]     + n));
      data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + n));
      data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + n));
    }
  }

  // ── 暗角（0 ~ 100） ──
  static processVignette(data, width, height, intensity) {
    if (!intensity) return;
    const centerX = width / 2;
    const centerY = height / 2;
    const maxDist = Math.sqrt(centerX * centerX + centerY * centerY);
    const radius  = 0.62;     // 开始变暗的距离（相对于最大距离）
    const strength = intensity / 100;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const dx = (x - centerX) / maxDist;
        const dy = (y - centerY) / maxDist;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist > radius) {
          const t = Math.min(1, (dist - radius) / (1 - radius));
          // smoothstep
          const smooth = t * t * (3 - 2 * t);
          const dark = 1 - smooth * strength;
          const idx = (y * width + x) * 4;
          data[idx]     = (data[idx]     * dark) | 0;
          data[idx + 1] = (data[idx + 1] * dark) | 0;
          data[idx + 2] = (data[idx + 2] * dark) | 0;
        }
      }
    }
  }

  static getPresets()      { return FILTER_PRESETS; }
  static getPresetById(id) { return FILTER_PRESETS.find(p => p.id === id) || FILTER_PRESETS[0]; }
}

module.exports = { FilterRenderer };
