// pages/edit/edit.js  V1.1
const APP_CONFIG       = require('../../config/app.config.js');
const { FilterRenderer }        = require('../../engines/filter/renderer.js');
const { FILTER_PRESETS }        = require('../../engines/filter/presets.js');
const { AdvancedFilterEditor, DEFAULT_PRO_PARAMS, PRO_PARAM_CONFIG } = require('../../engines/filter/advanced.js');
const { WatermarkRenderer }     = require('../../engines/watermark/renderer.js');
const { WatermarkConfig }       = require('../../engines/watermark/config.js');
const { WATERMARK_TEMPLATES, WATERMARK_CATEGORIES } = require('../../config/watermark-templates.js');
const { FILTER_CATEGORIES, getFiltersByCategory } = require('../../config/filter-categories.js');
const { CaptionManager }        = require('../../config/captions.js');
const { ExifReader }            = require('../../utils/exif.js');
const { GeoManager }            = require('../../utils/geocoding.js');
const { RecentUsageStorage }    = require('../../utils/storage.js');
const { StatisticsManager }     = require('../../utils/statistics.js');
const {
  sleep, cleanupTempFile, compressImageIfNeeded,
  saveToAlbum, showError, showSuccess
} = require('../../utils/common.js');

// 九宫格位置配置
const POSITION_OPTIONS = [
  { id: 'top-left',      label: '↖', offsetY:  24 },
  { id: 'top-center',    label: '↑', offsetY:  24 },
  { id: 'top-right',     label: '↗', offsetY:  24 },
  { id: 'middle-left',   label: '←', offsetY:   0 },
  { id: 'center',        label: '●', offsetY:   0 },
  { id: 'middle-right',  label: '→', offsetY:   0 },
  { id: 'bottom-left',   label: '↙', offsetY: -24 },
  { id: 'bottom-center', label: '↓', offsetY: -24 },
  { id: 'bottom-right',  label: '↘', offsetY: -24 }
];

Page({
  data: {
    photos: [],
    currentIndex: 0,
    maxPhotos: APP_CONFIG.MAX_PHOTOS,

    // Canvas 预览尺寸（px）
    previewWidth: 375,
    previewHeight: 280,

    // 滤镜
    filters: [],
    filteredFilters: [],
    selectedFilterId: 'original',
    filterIntensity: 100,
    filterCategories: FILTER_CATEGORIES,
    selectedFilterCategory: 'all',
    favoritedFilters: [],

    // 专业模式
    showProPanel: false,
    proParams: { ...DEFAULT_PRO_PARAMS },
    proParamConfig: PRO_PARAM_CONFIG,
    proParamsDirty: false,

    // 水印
    watermarkTemplates: WATERMARK_TEMPLATES,
    filteredTemplates: [],
    wmCategories: WATERMARK_CATEGORIES,
    selectedWmCategory: 'minimal',
    selectedTemplateId: 'classic',
    watermarkEnabled: true,
    watermarkConfig: null,
    wmFontSize: 28,
    wmPosition: 'bottom-left',
    wmOpacity: 80,
    positionOptions: POSITION_OPTIONS,

    // 元数据
    photoMeta: { datetime: null, location: '', device: '' },
    locationLoading: false,

    // 智能位置
    autoWmPosition: false,

    // 批量处理
    isProcessing: false,
    processingIndex: 0,
    totalPhotos: 0,

    // 面板
    activeTab: 'filter',
    showCaptionPanel: false,
    showEmojiPanel: false,
    showCustomizePanel: false,

    // 对比模式
    compareMode: false,
    compareDividerRatio: 0.5,

    // 当前滤镜名（预计算，供显示用）
    currentFilterName: '原片'
  },

  _watermarkConfigMgr: null,
  _captionMgr: null,
  _statsMgr: null,
  _renderTimer: null,
  _tempFiles: [],

  // ============================================================
  // 生命周期
  // ============================================================

  onLoad() {
    const app    = getApp();
    const photos = app.globalData.selectedPhotos || [];

    if (!photos.length) {
      wx.showToast({ title: '未选择照片', icon: 'none' });
      setTimeout(() => wx.navigateBack(), 1500);
      return;
    }

    this._watermarkConfigMgr = new WatermarkConfig();
    this._captionMgr  = new CaptionManager();
    this._statsMgr    = new StatisticsManager();

    const info = wx.getWindowInfo();
    const previewWidth  = info.windowWidth;
    const previewHeight = Math.min(
      Math.round(previewWidth * 0.75),
      Math.round(info.windowHeight * 0.52)
    );

    // 拍摄时预选的滤镜优先，否则用个人默认 → 最近记录
    const captureFilterId = app.globalData.captureFilterId || null;
    app.globalData.captureFilterId = null; // 清除，避免重复使用

    const appSettings = app.globalData.appSettings || {};
    const lastTemplateId = captureFilterId
      ? (RecentUsageStorage.getRecentTemplate() || appSettings.defaultTemplateId || 'classic')
      : (appSettings.defaultTemplateId || RecentUsageStorage.getRecentTemplate() || 'classic');
    const lastFilterId = captureFilterId || appSettings.defaultFilterId || RecentUsageStorage.getRecentFilter() || 'original';
    const favoritedFilters = wx.getStorageSync('pickcam_favorites') || [];

    const template = this._watermarkConfigMgr.getTemplateById(lastTemplateId);
    const watermarkConfig = this._watermarkConfigMgr.cloneConfig(template.config);

    // 若用户设置了默认位置，覆盖模板默认值
    const defaultPos = appSettings.defaultWmPosition;
    if (defaultPos && watermarkConfig.position) {
      watermarkConfig.position.preset = defaultPos;
    }
    const defaultOpacity = appSettings.defaultWmOpacity;
    if (typeof defaultOpacity === 'number' && watermarkConfig.background) {
      watermarkConfig.background.opacity = defaultOpacity / 100;
    }

    const pos      = (watermarkConfig.position && watermarkConfig.position.preset) || 'bottom-left';
    const firstEl  = watermarkConfig.elements && watermarkConfig.elements[0];
    const fontSize = firstEl ? (firstEl.size || 28) : 28;
    const wmOpacity = typeof defaultOpacity === 'number' ? defaultOpacity : 80;

    const allFilters = FilterRenderer.getPresets();

    const currentFilter = allFilters.find(f => f.id === lastFilterId);
    const currentFilterName = currentFilter ? currentFilter.name : '原片';

    this.setData({
      photos, filters: allFilters, filteredFilters: allFilters,
      selectedFilterId: lastFilterId, currentFilterName,
      selectedTemplateId: lastTemplateId,
      watermarkConfig,
      previewWidth, previewHeight,
      wmPosition: pos, wmFontSize: fontSize, wmOpacity,
      favoritedFilters
    });

    this._loadPhotoMeta(photos[0]);
  },

  onReady() {
    setTimeout(() => this._drawPreviewToCanvas(), 200);
  },

  onUnload() {
    if (this._renderTimer) clearTimeout(this._renderTimer);
    this._tempFiles.forEach(p => cleanupTempFile(p));
    this._tempFiles = [];
  },

  // ── 辅助：猜测模板分类 ──
  _guessInitialWmCategory(templateId) {
    const t = WATERMARK_TEMPLATES.find(t => t.id === templateId);
    return t ? t.category : 'minimal';
  },

  _filterTemplatesByCategory(category) {
    return WATERMARK_TEMPLATES.filter(t => t.category === category);
  },

  // ============================================================
  // 元数据加载
  // ============================================================

  async _loadPhotoMeta(photo) {
    const app = getApp();
    const settings = app.globalData.appSettings || {};
    // 仅在用户开启"自动位置"时请求定位
    const useLocation = settings.autoLocation !== false;

    this.setData({ locationLoading: useLocation });
    try {
      const exifInfo = await ExifReader.getInfo(photo.tempFilePath);
      let locationText = '';
      
      if (useLocation) {
        // 如果是刚刚拍照生成的，优先使用当前 GPS 
        const geoResult = await GeoManager.getCurrentLocation().catch(() => ({ address: '' }));
        locationText = geoResult.address || '';
        
        // 如果 GeoManager 没拿到地址且有 EXIF 经纬度（此处为演示逻辑，微信 getImageInfo 不返回经纬度，需二进制解析）
        if (!locationText && exifInfo.latitude && exifInfo.longitude) {
          locationText = await GeoManager._reverseGeocode(exifInfo.latitude, exifInfo.longitude);
        }
      }
      
      const meta = {
        datetime: exifInfo.datetime || new Date(),
        location: locationText,
        device:   exifInfo.device || ''
      };
      this.setData({ photoMeta: meta, locationLoading: false });
      this._renderPreview();
    } catch (e) {
      console.error('Meta loading error:', e);
      this.setData({ locationLoading: false });
    }
  },

  // ============================================================
  // 实时预览
  // ============================================================

  _renderPreview() {
    if (this._renderTimer) clearTimeout(this._renderTimer);
    this._renderTimer = setTimeout(() => this._drawPreviewToCanvas(), 180);
  },

  async _drawPreviewToCanvas() {
    const photos = this.data.photos;
    if (!photos || !photos.length) return;
    const photo = photos[this.data.currentIndex];

    const query = await this._queryCanvas();
    if (!query) return;

    const canvas = query.node;
    const dpr    = wx.getWindowInfo().pixelRatio;
    const W      = query.width;
    const H      = query.height;

    canvas.width  = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);

    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    ctx.fillStyle = '#111111';
    ctx.fillRect(0, 0, W, H);

    const img = canvas.createImage();
    try {
      await new Promise((resolve, reject) => {
        img.onload  = resolve;
        img.onerror = reject;
        img.src     = photo.tempFilePath;
      });
    } catch (e) { return; }

    const { x, y, w, h } = this._calcFit(img.width, img.height, W, H);
    ctx.drawImage(img, x, y, w, h);

    // 应用滤镜（使用合并参数）
    const combinedParams = this._getCombinedFilterParams();
    const hasEffect = this.data.selectedFilterId !== 'original' ||
                      AdvancedFilterEditor.isDirty(this.data.proParams);

    const physX = Math.round(x * dpr);
    const physY = Math.round(y * dpr);
    const physW = Math.round(w * dpr);
    const physH = Math.round(h * dpr);

    if (this.data.compareMode) {
      // 对比模式：右侧显示滤镜，左侧还原原图
      if (hasEffect && this.data.filterIntensity > 0) {
        try {
          const imageData = ctx.getImageData(physX, physY, physW, physH);
          FilterRenderer.applyFilter(imageData, combinedParams, this.data.filterIntensity);
          ctx.putImageData(imageData, physX, physY);
        } catch (e) {}
      }
      const dividerX = this.data.compareDividerRatio * W;
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, 0, dividerX, H);
      ctx.clip();
      ctx.drawImage(img, x, y, w, h); // 左半部分还原原图
      ctx.restore();
      this._drawCompareDivider(ctx, dividerX, x, y, w, h);
      return;
    }

    if (hasEffect && this.data.filterIntensity > 0) {
      try {
        // getImageData/putImageData 使用物理像素坐标
        const imageData = ctx.getImageData(physX, physY, physW, physH);
        FilterRenderer.applyFilter(imageData, combinedParams, this.data.filterIntensity);
        ctx.putImageData(imageData, physX, physY);
      } catch (e) { /* 部分低端机不支持 getImageData，忽略 */ }
    }

    // 绘制水印
    if (this.data.watermarkEnabled && this.data.watermarkConfig) {
      this._drawWatermarkOnCanvas(ctx, W, H, x, y, w, h);
    }
  },

  _queryCanvas() {
    return new Promise(resolve => {
      wx.createSelectorQuery()
        .select('#preview-canvas')
        .fields({ node: true, size: true })
        .exec(res => resolve(res && res[0] ? res[0] : null));
    });
  },

  _calcFit(imgW, imgH, canvasW, canvasH) {
    const ir = imgW / imgH;
    const cr = canvasW / canvasH;
    let w, h;
    if (ir > cr) { w = canvasW; h = canvasW / ir; }
    else          { h = canvasH; w = canvasH * ir; }
    return { x: (canvasW - w) / 2, y: (canvasH - h) / 2, w, h };
  },

  // ── 获取合并的滤镜参数（预设 + 专业调整） ──
  _getCombinedFilterParams() {
    const preset = FILTER_PRESETS.find(p => p.id === this.data.selectedFilterId);
    const base   = preset ? preset.params : null;
    return AdvancedFilterEditor.mergeParams(base, this.data.proParams);
  },

  // ============================================================
  // 水印 Canvas 绘制（预览）
  // ============================================================

  _drawWatermarkOnCanvas(ctx, W, H, imgX, imgY, imgW, imgH) {
    const config = this.data.watermarkConfig;
    const meta   = this.data.photoMeta;
    if (!config || !config.elements) return;

    const lines = [];
    const isHorizontal = config.layout !== 'vertical';

    if (isHorizontal) {
      const parts = config.elements
        .map(el => ({ text: this._resolveElementText(el, meta), el }))
        .filter(p => p.text);
      if (parts.length) lines.push({ parts, isHorizontal: true, el: config.elements[0] });
    } else {
      config.elements.forEach(el => {
        const text = this._resolveElementText(el, meta);
        if (text) lines.push({ text, el });
      });
    }
    if (!lines.length) return;

    const scale   = imgW / 1080;
    const bg      = config.background;
    const padding = {
      x: (bg && bg.padding ? bg.padding.x : 20) * scale,
      y: (bg && bg.padding ? bg.padding.y : 12) * scale
    };

    // 测量文本
    const lineData = lines.map(line => {
      if (line.isHorizontal) {
        let totalW = 0, maxH = 0;
        const partData = line.parts.map(({ text, el }) => {
          const fs = Math.max(12, Math.round((el.size || 26) * scale));
          ctx.font = `${fs}px ${el.font || 'PingFang SC'}, sans-serif`;
          const tw = ctx.measureText(text).width;
          const lh = fs * 1.4;
          totalW += tw + 8;
          maxH = Math.max(maxH, lh);
          return { text, el, fontSize: fs, tw, lh };
        });
        return { isHorizontal: true, partData, lineW: totalW, lineH: maxH };
      } else {
        const fs = Math.max(12, Math.round((line.el.size || 26) * scale));
        ctx.font = `${fs}px ${line.el.font || 'PingFang SC'}, sans-serif`;
        const lw = ctx.measureText(line.text).width;
        const lh = fs * 1.4;
        return { text: line.text, el: line.el, fontSize: fs, lineW: lw, lineH: lh };
      }
    });

    const maxLineW = Math.max(...lineData.map(l => l.lineW || 0));
    const totalH   = lineData.reduce((s, l) => s + l.lineH, 0) + (lineData.length - 1) * 4;
    const blockW   = maxLineW + padding.x * 2;
    const blockH   = totalH  + padding.y * 2;

    const { bx, by } = this._calcWatermarkPos(config.position, blockW, blockH, imgX, imgY, imgW, imgH, scale);

    // 绘制背景
    if (bg && bg.type === 'gradient') {
      const gradH = imgH * (bg.height || 0.40);
      const grd   = ctx.createLinearGradient(imgX, imgY + imgH - gradH, imgX, imgY + imgH);
      grd.addColorStop(0, 'rgba(0,0,0,0)');
      grd.addColorStop(1, `rgba(0,0,0,${bg.opacity || 0.70})`);
      ctx.globalAlpha = 1;
      ctx.fillStyle = grd;
      ctx.fillRect(imgX, imgY + imgH - gradH, imgW, gradH);
    } else if (bg && bg.show) {
      ctx.globalAlpha = typeof bg.opacity === 'number' ? bg.opacity : 0.6;
      ctx.fillStyle   = bg.color || '#000000';
      if (bg.type === 'rounded-rect' && bg.radius) {
        this._roundRectPath(ctx, bx, by, blockW, blockH, bg.radius * scale);
        ctx.fill();
      } else {
        ctx.fillRect(bx, by, blockW, blockH);
      }
      ctx.globalAlpha = 1;
    }

    // 绘制文字
    let curY = by + padding.y;
    for (const ld of lineData) {
      const baseline = curY + ld.lineH * 0.78;
      if (ld.isHorizontal) {
        let curX = bx + padding.x;
        for (const { text, el, fontSize, tw } of ld.partData) {
          ctx.globalAlpha = (el.opacity || 100) / 100;
          ctx.font        = `${fontSize}px ${el.font || 'PingFang SC'}, sans-serif`;
          ctx.fillStyle   = el.color || '#FFFFFF';
          this._applyShadow(ctx, el.shadow);
          if (el.stroke && el.stroke.show) {
            ctx.strokeStyle = el.stroke.color || '#000';
            ctx.lineWidth   = el.stroke.width || 1;
            ctx.strokeText(text, curX, baseline);
          }
          ctx.fillText(text, curX, baseline);
          this._clearShadow(ctx);
          curX += tw + 8;
        }
      } else {
        ctx.globalAlpha = (ld.el.opacity || 100) / 100;
        ctx.font        = `${ld.fontSize}px ${ld.el.font || 'PingFang SC'}, sans-serif`;
        ctx.fillStyle   = ld.el.color || '#FFFFFF';
        this._applyShadow(ctx, ld.el.shadow);
        if (ld.el.stroke && ld.el.stroke.show) {
          ctx.strokeStyle = ld.el.stroke.color || '#000';
          ctx.lineWidth   = ld.el.stroke.width || 1;
          ctx.strokeText(ld.text, bx + padding.x, baseline);
        }
        ctx.fillText(ld.text, bx + padding.x, baseline);
        this._clearShadow(ctx);
      }
      ctx.globalAlpha = 1;
      curY += ld.lineH + 4;
    }
  },

  _applyShadow(ctx, shadow) {
    if (!shadow) return;
    ctx.shadowColor   = shadow.color || 'rgba(0,0,0,0.85)';
    ctx.shadowBlur    = shadow.blur  || 8;
    ctx.shadowOffsetX = shadow.x     || 0;
    ctx.shadowOffsetY = shadow.y     || 1;
  },

  _clearShadow(ctx) {
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur  = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
  },

  // ============================================================
  // 滤镜对比模式
  // ============================================================

  toggleCompare() {
    const next = !this.data.compareMode;
    this.setData({ compareMode: next, compareDividerRatio: 0.5 });
    this._drawPreviewToCanvas();
  },

  onPreviewTouchStart(e) {
    if (!this.data.compareMode) return;
    const ratio = Math.max(0.05, Math.min(0.95, e.touches[0].clientX / this.data.previewWidth));
    this.setData({ compareDividerRatio: ratio });
    this._drawPreviewToCanvas();
  },

  onPreviewTouchMove(e) {
    if (!this.data.compareMode) return;
    const ratio = Math.max(0.05, Math.min(0.95, e.touches[0].clientX / this.data.previewWidth));
    if (Math.abs(ratio - this.data.compareDividerRatio) < 0.004) return;
    this.setData({ compareDividerRatio: ratio });
    this._drawPreviewToCanvas();
  },

  _drawCompareDivider(ctx, dividerX, imgX, imgY, imgW, imgH) {
    ctx.save();

    // 分割线
    ctx.strokeStyle = 'rgba(255,255,255,0.9)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(dividerX, imgY);
    ctx.lineTo(dividerX, imgY + imgH);
    ctx.stroke();

    // 拖动把手
    const handleY = imgY + imgH / 2;
    ctx.shadowColor = 'rgba(0,0,0,0.3)';
    ctx.shadowBlur = 10;
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(dividerX, handleY, 18, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.shadowColor = 'transparent';
    ctx.strokeStyle = 'rgba(180,180,180,0.5)';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.fillStyle = '#888888';
    ctx.font = 'bold 13px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('< >', dividerX, handleY);

    // 标签
    const lblY = imgY + 12;
    const lblH = 24;
    ctx.font = '13px PingFang SC, sans-serif';
    ctx.textBaseline = 'middle';

    ctx.fillStyle = 'rgba(0,0,0,0.52)';
    ctx.fillRect(imgX + 8, lblY, 48, lblH);
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'center';
    ctx.fillText('原图', imgX + 8 + 24, lblY + lblH / 2);

    ctx.fillStyle = 'rgba(255,45,85,0.72)';
    ctx.fillRect(imgX + imgW - 56, lblY, 48, lblH);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText('滤镜', imgX + imgW - 56 + 24, lblY + lblH / 2);

    ctx.restore();
  },

  _calcWatermarkPos(pos, blockW, blockH, imgX, imgY, imgW, imgH, scale) {
    const MARGIN = 20 * scale;
    const preset  = (pos && pos.preset) || 'bottom-left';
    const offsetX = (pos && pos.x) || 0;
    const offsetY = (pos && pos.y) || 0;
    let bx, by;

    if (preset.includes('right'))  bx = imgX + imgW - blockW - MARGIN + offsetX;
    else if (preset.includes('center') && !preset.includes('middle')) bx = imgX + (imgW - blockW) / 2 + offsetX;
    else bx = imgX + MARGIN + offsetX;

    if (preset.includes('top'))    by = imgY + MARGIN + offsetY;
    else if (preset === 'center' || preset.includes('middle')) by = imgY + (imgH - blockH) / 2 + offsetY;
    else by = imgY + imgH - blockH - MARGIN + offsetY;

    return { bx: Math.max(imgX, bx), by: Math.max(imgY, by) };
  },

  _roundRectPath(ctx, x, y, w, h, r) {
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
  },

  _resolveElementText(element, meta) {
    switch (element.type) {
      case 'date': {
        const date = meta.datetime || new Date();
        return ExifReader.formatDate(date, element.format || 'YYYY/MM/DD');
      }
      case 'location': return meta.location || '';
      case 'device':   return meta.device   || '';
      case 'caption': {
        if (!this._captionMgr) this._captionMgr = new CaptionManager();
        if (element.mode === 'daily')  return this._captionMgr.getDailyCaption();
        if (element.mode === 'random') return this._captionMgr.getRandomCaption();
        return element.value || this._captionMgr.getDailyCaption();
      }
      case 'custom':    return element.value || '';
      case 'emoji':     return element.value || '';
      case 'separator': return element.value || '·';
      default: return '';
    }
  },

  // ============================================================
  // 照片切换
  // ============================================================

  switchPhoto(e) {
    const index = parseInt(e.currentTarget.dataset.index);
    if (index === this.data.currentIndex) return;
    this.setData({ currentIndex: index });
    this._loadPhotoMeta(this.data.photos[index]);
    this._renderPreview();
  },

  // ============================================================
  // 滤镜操作
  // ============================================================

  selectFilter(e) {
    const filterId = e.currentTarget.dataset.id;
    if (filterId === this.data.selectedFilterId) return;
    const f = this.data.filters.find(x => x.id === filterId);
    const currentFilterName = f ? f.name : '原片';
    this.setData({ selectedFilterId: filterId, currentFilterName });
    RecentUsageStorage.setRecentFilter(filterId);
    this._renderPreview();
  },

  onIntensityChange(e) {
    this.setData({ filterIntensity: parseInt(e.detail.value) });
    this._renderPreview();
  },

  // ── 切换滤镜分类 ──
  onSelectFilterCategory(e) {
    const category = e.currentTarget.dataset.category;
    if (category === this.data.selectedFilterCategory) return;
    const allFilters = FilterRenderer.getPresets();
    const ids = getFiltersByCategory(category, this.data.favoritedFilters);
    const filteredFilters = allFilters.filter(f => ids.includes(f.id));
    this.setData({ selectedFilterCategory: category, filteredFilters });
  },

  // ── 收藏/取消收藏滤镜 ──
  onToggleFavorite(e) {
    const filterId = e.currentTarget.dataset.id;
    const favs = [...this.data.favoritedFilters];
    const idx = favs.indexOf(filterId);
    if (idx > -1) favs.splice(idx, 1);
    else favs.unshift(filterId);
    wx.setStorageSync('pickcam_favorites', favs);
    this.setData({ favoritedFilters: favs });
    // 如果当前在收藏分类，刷新列表
    if (this.data.selectedFilterCategory === 'favorites') {
      const allFilters = FilterRenderer.getPresets();
      this.setData({ filteredFilters: allFilters.filter(f => favs.includes(f.id)) });
    }
  },

  isFavorited(filterId) {
    return this.data.favoritedFilters.includes(filterId);
  },

  // ============================================================
  // 专业模式
  // ============================================================

  toggleProPanel() {
    this.setData({ showProPanel: !this.data.showProPanel });
  },

  closeProPanel() {
    this.setData({ showProPanel: false });
  },

  onProParamChange(e) {
    const key   = e.currentTarget.dataset.key;
    const value = parseInt(e.detail.value);
    const proParams = { ...this.data.proParams, [key]: value };
    const dirty = AdvancedFilterEditor.isDirty(proParams);
    this.setData({ proParams, proParamsDirty: dirty });
    this._renderPreview();
  },

  resetProParams() {
    const proParams = AdvancedFilterEditor.getDefaultParams();
    this.setData({ proParams, proParamsDirty: false });
    this._renderPreview();
  },

  saveProAsCustomFilter() {
    wx.showModal({
      title: '保存自定义滤镜',
      editable: true,
      placeholderText: '输入滤镜名称...',
      success: (res) => {
        if (res.confirm && res.content) {
          const merged = this._getCombinedFilterParams();
          const custom = AdvancedFilterEditor.saveAsCustom(res.content, merged);
          showSuccess(`已保存：${custom.name}`);
        }
      }
    });
  },

  // ============================================================
  // 水印模板分类
  // ============================================================

  onSelectWmCategory(e) {
    const category = e.currentTarget.dataset.category;
    if (category === this.data.selectedWmCategory) return;
    const filteredTemplates = this._filterTemplatesByCategory(category);
    this.setData({ selectedWmCategory: category, filteredTemplates });
  },

  // ============================================================
  // 水印模板选择
  // ============================================================

  selectTemplate(e) {
    const templateId = e.currentTarget.dataset.id;
    if (templateId === this.data.selectedTemplateId) return;
    const template = this._watermarkConfigMgr.getTemplateById(templateId);
    const watermarkConfig = this._watermarkConfigMgr.cloneConfig(template.config);
    const pos     = (watermarkConfig.position && watermarkConfig.position.preset) || 'bottom-left';
    const firstEl = watermarkConfig.elements && watermarkConfig.elements[0];
    this.setData({
      selectedTemplateId: templateId,
      watermarkConfig,
      wmPosition: pos,
      wmFontSize: firstEl ? (firstEl.size || 28) : 28
    });
    RecentUsageStorage.setRecentTemplate(templateId);
    this._renderPreview();
  },

  toggleWatermark(e) {
    this.setData({ watermarkEnabled: e.detail.value });
    this._renderPreview();
  },

  setWatermarkPos(e) {
    const pos = e.currentTarget.dataset.pos;
    const posOption = POSITION_OPTIONS.find(p => p.id === pos);
    const config = JSON.parse(JSON.stringify(this.data.watermarkConfig));
    config.position = { preset: pos, x: 0, y: posOption ? posOption.offsetY : 0 };
    this.setData({ watermarkConfig: config, wmPosition: pos });
    this._renderPreview();
  },

  // ── 智能水印位置：分析图片角落亮度，选最暗角落放水印 ──
  toggleAutoWmPosition() {
    this.setData({ autoWmPosition: !this.data.autoWmPosition });
    if (this.data.autoWmPosition) {
      this.autoSelectWatermarkPosition();
    }
  },

  async autoSelectWatermarkPosition() {
    const photo = this.data.photos[this.data.currentIndex];
    if (!photo) return;
    wx.showLoading({ title: '智能分析中…', mask: false });
    const posId = await this._detectBestPositionForImage(photo.tempFilePath);
    wx.hideLoading();
    const posOption = POSITION_OPTIONS.find(p => p.id === posId);
    const config = JSON.parse(JSON.stringify(this.data.watermarkConfig));
    config.position = { preset: posId, x: 0, y: posOption ? posOption.offsetY : 0 };
    this.setData({ watermarkConfig: config, wmPosition: posId });
    this._renderPreview();
    wx.showToast({ title: '已智能选位', icon: 'success', duration: 1200 });
  },

  async _detectBestPositionForImage(filePath) {
    try {
      const S = 160; // 缩略采样尺寸
      const ZONE = Math.floor(S * 0.22); // 角落采样区域（22%边长）
      const offCanvas = wx.createOffscreenCanvas({ type: '2d', width: S, height: S });
      const ctx = offCanvas.getContext('2d');
      const img = offCanvas.createImage();
      await new Promise((resolve, reject) => { img.onload = resolve; img.onerror = reject; img.src = filePath; });
      ctx.drawImage(img, 0, 0, S, S);

      const corners = [
        { id: 'top-left',     x: 0,      y: 0 },
        { id: 'top-right',    x: S-ZONE, y: 0 },
        { id: 'bottom-left',  x: 0,      y: S-ZONE },
        { id: 'bottom-right', x: S-ZONE, y: S-ZONE }
      ];

      let bestId = 'bottom-left', minLum = Infinity;
      for (const c of corners) {
        const d = ctx.getImageData(c.x, c.y, ZONE, ZONE).data;
        let lum = 0;
        for (let i = 0; i < d.length; i += 4) {
          lum += 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
        }
        lum /= (ZONE * ZONE);
        if (lum < minLum) { minLum = lum; bestId = c.id; }
      }
      return bestId;
    } catch (e) {
      return 'bottom-left';
    }
  },

  // ── 刷新当前位置（水印面板快捷按钮）──
  async refreshLocation() {
    if (this.data.locationLoading) return;
    this.setData({ locationLoading: true });
    try {
      const geoResult = await GeoManager.getCurrentLocation().catch(() => ({ address: '' }));
      const location  = geoResult.address || '';
      const meta = Object.assign({}, this.data.photoMeta, { location });
      this.setData({ photoMeta: meta, locationLoading: false });
      this._renderPreview();
      wx.showToast({ title: location ? '位置已更新' : '未能获取位置', icon: location ? 'success' : 'none', duration: 1200 });
    } catch (e) {
      this.setData({ locationLoading: false });
      wx.showToast({ title: '获取位置失败', icon: 'none' });
    }
  },

  onFontSizeChange(e) {
    const size   = parseInt(e.detail.value);
    const config = JSON.parse(JSON.stringify(this.data.watermarkConfig));
    if (config.elements) {
      config.elements.forEach((el, i) => {
        if (el.size !== undefined) el.size = Math.max(14, size - i * 2);
      });
    }
    this.setData({ watermarkConfig: config, wmFontSize: size });
    this._renderPreview();
  },

  onOpacityChange(e) {
    const opacity = parseInt(e.detail.value);
    const config  = JSON.parse(JSON.stringify(this.data.watermarkConfig));
    if (config.background) config.background.opacity = opacity / 100;
    this.setData({ watermarkConfig: config, wmOpacity: opacity });
    this._renderPreview();
  },

  onLocationInput(e) {
    const location = e.detail.value;
    const meta = Object.assign({}, this.data.photoMeta, { location });
    this.setData({ photoMeta: meta });
    this._renderPreview();
  },

  // ============================================================
  // 面板控制
  // ============================================================

  showPanel(e) {
    const panel = e.currentTarget.dataset.panel;
    const updates = {
      showCaptionPanel:   panel === 'caption',
      showEmojiPanel:     panel === 'emoji',
      showCustomizePanel: panel === 'customize'
    };
    if (panel === 'filter' || panel === 'watermark') {
      updates.activeTab = panel;
    } else {
      // caption/emoji/customize 是弹窗，不属于 Tab 切换，清除 activeTab 高亮
      updates.activeTab = '';
    }
    this.setData(updates);
  },

  closeAllPanels() {
    // 关闭弹窗后，若当前无 Tab 激活（如从 caption 弹窗返回），恢复到滤镜 Tab
    const activeTab = this.data.activeTab || 'filter';
    this.setData({
      showCaptionPanel:   false,
      showEmojiPanel:     false,
      showCustomizePanel: false,
      activeTab
    });
  },

  // ============================================================
  // 文案选择
  // ============================================================

  onCaptionSelect(e) {
    const caption = e.detail.caption;
    const config  = JSON.parse(JSON.stringify(this.data.watermarkConfig));
    if (config.elements) {
      const captionEl = config.elements.find(el => el.type === 'caption');
      if (captionEl) { captionEl.value = caption; captionEl.mode = 'custom'; }
    }
    this.setData({ watermarkConfig: config, showCaptionPanel: false });
    this._renderPreview();
  },

  // ============================================================
  // Emoji 选择
  // ============================================================

  onEmojiSelect(e) {
    const emoji = e.detail.emoji;
    const config = JSON.parse(JSON.stringify(this.data.watermarkConfig));
    if (config.elements) {
      const emojiEl = config.elements.find(el => el.type === 'emoji');
      if (emojiEl) emojiEl.value = emoji;
    }
    this.setData({ watermarkConfig: config, showEmojiPanel: false });
    this._renderPreview();
  },

  // ============================================================
  // 保存单张
  // ============================================================

  async saveCurrent() {
    if (this.data.isProcessing) return;
    const photo = this.data.photos[this.data.currentIndex];
    if (!photo) return;
    wx.showLoading({ title: '处理中...', mask: true });
    try {
      const path = await this._processPhotoFull(photo);
      await saveToAlbum(path);
      cleanupTempFile(path);
      wx.hideLoading();
      showSuccess('已保存到相册');
      this._recordStats();
    } catch (e) {
      wx.hideLoading();
      showError(e.message || '保存失败');
    }
  },

  // ============================================================
  // 批量保存（防闪退）
  // ============================================================

  async batchSaveAll() {
    const photos = this.data.photos;
    if (photos.length > this.data.maxPhotos) {
      wx.showModal({ title: '照片过多', content: `最多处理 ${this.data.maxPhotos} 张`, showCancel: false });
      return;
    }

    this.setData({ isProcessing: true, totalPhotos: photos.length, processingIndex: 0 });
    const results = { success: 0, failed: [] };

    try {
      for (let i = 0; i < photos.length; i++) {
        this.setData({ processingIndex: i + 1 });
        try {
          // 智能位置：批量处理时为每张照片单独检测最佳水印位置
          let configOverride = null;
          if (this.data.autoWmPosition && this.data.watermarkEnabled) {
            const posId = await this._detectBestPositionForImage(photos[i].tempFilePath);
            const posOption = POSITION_OPTIONS.find(p => p.id === posId);
            configOverride = JSON.parse(JSON.stringify(this.data.watermarkConfig));
            configOverride.position = { preset: posId, x: 0, y: posOption ? posOption.offsetY : 0 };
          }
          const outputPath = await this._processPhotoFull(photos[i], configOverride);
          await saveToAlbum(outputPath);
          cleanupTempFile(outputPath);
          results.success++;
          this._recordStats();
        } catch (err) {
          results.failed.push(i + 1);
        }
        await sleep(APP_CONFIG.BATCH_DELAY);
        if (wx.triggerGC) wx.triggerGC();
      }

      this.setData({ isProcessing: false });
      if (!results.failed.length) {
        showSuccess(`已保存 ${results.success} 张`);
      } else {
        wx.showModal({
          title: '处理完成',
          content: `成功：${results.success} 张\n失败：第 ${results.failed.join(', ')} 张`,
          showCancel: false
        });
      }
    } catch (e) {
      this.setData({ isProcessing: false });
      showError('批量处理异常，请重试');
    }
  },

  // ── 完整质量处理单张（用于保存） ──
  async _processPhotoFull(photo, wmConfigOverride) {
    let path = photo.tempFilePath;

    const compressed = await compressImageIfNeeded(path, APP_CONFIG.MAX_IMAGE_SIZE);
    if (compressed !== path) path = compressed;

    // 使用合并参数（预设 + 专业调整）
    const combinedParams = this._getCombinedFilterParams();
    const hasFilter = this.data.selectedFilterId !== 'original' ||
                      AdvancedFilterEditor.isDirty(this.data.proParams);
    if (hasFilter && this.data.filterIntensity > 0) {
      const filteredPath = await FilterRenderer.applyFilterToImage(
        path, combinedParams, this.data.filterIntensity
      );
      if (filteredPath !== path) { cleanupTempFile(path); path = filteredPath; }
    }

    const wmConfig = wmConfigOverride || this.data.watermarkConfig;
    if (this.data.watermarkEnabled && wmConfig) {
      const watermarkedPath = await WatermarkRenderer.applyWatermark(
        path, wmConfig, this.data.photoMeta
      );
      if (watermarkedPath !== path) { cleanupTempFile(path); path = watermarkedPath; }
    }

    return path;
  },

  // ── 记录统计 ──
  _recordStats() {
    try {
      this._statsMgr.recordPhotoProcess(
        this.data.selectedFilterId,
        this.data.selectedTemplateId,
        this.data.photoMeta.location
      );
    } catch (e) {}
  },

  // ============================================================
  // 分享
  // ============================================================

  async goShare() {
    if (this.data.isProcessing) return;
    wx.showLoading({ title: '生成分享图...', mask: true });
    try {
      const photo = this.data.photos[this.data.currentIndex];
      const outputPath = await this._processPhotoFull(photo);
      wx.hideLoading();
      const app = getApp();
      app.globalData.shareImagePath = outputPath;
      wx.navigateTo({ url: '/pages/share/share' });
    } catch (e) {
      wx.hideLoading();
      showError('生成分享图失败');
    }
  },

  onShareAppMessage() {
    return { title: '拾光相机 - 真实记录每个瞬间', path: '/pages/index/index' };
  }
});
