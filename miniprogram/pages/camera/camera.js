// pages/camera/camera.js
const { FILTER_PRESETS, FILTER_THUMBNAILS } = require('../../engines/filter/presets.js');
const APP_CONFIG = require('../../config/app.config.js');

// 相机快速滤镜条：8个代表性滤镜
const CAMERA_STRIP_IDS = [
  'original', 'soft-portrait', 'film-memory', 'cinematic',
  'bw-narrative', 'warm-nostalgia', 'cool-crisp', 'dark-mood'
];

const FLASH_CYCLE = ['off', 'on', 'auto'];
const TIMER_CYCLE = [0, 3, 10];

Page({
  data: {
    devicePosition: 'back',
    flashMode: 'off',
    timerMode: 0,
    filterStripList: [],
    selectedFilterId: 'original',
    currentFilterName: '原片',
    currentSwatchA: '#B8B8B8',
    currentSwatchB: '#606060',
    isRecording: false,
    recordDuration: 0,
    isCountingDown: false,
    countdownValue: 0,
    cameraError: false,
    userAvatar: '',
    isMorePanelOpen: false,
    layoutMode: 'immersive',
    showParamTips: false,
    topParams: [
      { id: 'iso', label: 'ISO', value: '100', tip: '感光度：低感光度画面更纯净' },
      { id: 'ev', label: 'EV', value: '+0.3', tip: '曝光补偿：调整画面明暗' },
      { id: 'f', label: 'F', value: '1.8', tip: '光圈：大光圈虚化背景' },
      { id: 'wb', label: 'WB', value: 'Auto', tip: '白平衡：矫正环境色偏' }
    ],
    moreFunctions: [
      { id: 'timer', name: '定时', icon: '⏲️' },
      { id: 'grid', name: '网格', icon: '▦' },
      { id: 'level', name: '水平仪', icon: '—' },
      { id: 'ratio', name: '画幅', icon: '⧈' },
      { id: 'hdr', name: 'HDR', icon: '☀' },
      { id: 'night', name: '夜景', icon: '☾' },
      { id: 'pro', name: '专业', icon: 'P' },
      { id: 'raw', name: 'RAW', icon: 'R' },
      { id: 'settings', name: '设置', icon: '⚙' }
    ],
    showTimerPicker: false,
    customTimerValue: 3
  },

  _cameraCtx: null,
  _recordTimer: null,
  _countdownTimer: null,

  onLoad() {
    // 初始化滤镜条，加入样张隐喻配置
    const stripList = CAMERA_STRIP_IDS
      .map(id => {
        const f = FILTER_PRESETS.find(p => p.id === id);
        if (!f) return null;
        return {
          ...f,
          meta: FILTER_THUMBNAILS[id] || { thumb: '', icon: '🖼️', tag: '滤镜' }
        };
      })
      .filter(Boolean);

    const lastFilterId = wx.getStorageSync('last_capture_filter') || 'original';
    const selectedFilter = FILTER_PRESETS.find(f => f.id === lastFilterId) || FILTER_PRESETS[0];

    const profile = wx.getStorageSync('pickcam_user_profile') || {};
    const swatch = selectedFilter.swatch || ['#B8B8B8', '#606060'];

    this.setData({
      filterStripList: stripList,
      selectedFilterId: lastFilterId,
      currentFilterName: selectedFilter.name,
      currentSwatchA: swatch[0],
      currentSwatchB: swatch[1],
      userAvatar: profile.avatar || ''
    });

    // 读取或初始化布局模式（默认沉浸式）
    this._initLayoutMode();

  },

  _initLayoutMode() {
    // 优先读取用户上次手动切换的偏好，否则默认沉浸式
    const saved = wx.getStorageSync('pickcam_layout_mode');
    this.setData({ layoutMode: saved || 'immersive' });
  },

  onReady() {
    this._cameraCtx = wx.createCameraContext();
  },

  onShow() {
    // 从编辑页返回时清理全局状态
    const app = getApp();
    if (app.globalData.clearSelection) {
      app.globalData.selectedPhotos = [];
      app.globalData.captureFilterId = null;
      app.globalData.clearSelection = false;
    }
  },

  onUnload() {
    if (this._recordTimer) clearInterval(this._recordTimer);
    if (this._countdownTimer) clearInterval(this._countdownTimer);
  },

  // ── 选择滤镜 ──────────────────────────────────────────────────
  selectFilter(e) {
    const id = e.currentTarget.dataset.id;
    const filter = FILTER_PRESETS.find(f => f.id === id);
    if (!filter) return;
    const swatch = filter.swatch || ['#B8B8B8', '#606060'];
    this.setData({
      selectedFilterId: id,
      currentFilterName: filter.name,
      currentSwatchA: swatch[0],
      currentSwatchB: swatch[1]
    });
    wx.setStorageSync('last_capture_filter', id);
  },

  goProfile() {
    wx.navigateTo({ url: '/pages/profile/profile' });
  },

  toggleParamTips() {
    this.setData({ showParamTips: !this.data.showParamTips });
  },

  resetTopParams() {
    this.setData({
      topParams: [
        { id: 'iso', label: 'ISO', value: '100', tip: '感光度：低感光度画面更纯净' },
        { id: 'ev', label: 'EV', value: '0', tip: '曝光补偿：调整画面明暗' },
        { id: 'f', label: 'F', value: '1.8', tip: '光圈：大光圈虚化背景' },
        { id: 'wb', label: 'WB', value: 'Auto', tip: '白平衡：矫正环境色偏' }
      ]
    });
    wx.showToast({ title: '参数已重置', icon: 'none' });
  },

  toggleMorePanel() {
    this.setData({ isMorePanelOpen: !this.data.isMorePanelOpen });
    if (wx.vibrateShort) wx.vibrateShort({ type: 'light' });
  },

  onSidebarSettingsTap() {
    wx.navigateTo({ url: '/pages/settings/settings' });
    if (wx.vibrateShort) wx.vibrateShort({ type: 'light' });
  },

  toggleLayoutMode() {
    const next = this.data.layoutMode === 'immersive' ? 'classic' : 'immersive';
    this.setData({ layoutMode: next });
    wx.setStorageSync('pickcam_layout_mode', next);
    wx.showToast({ title: `切换至${next === 'immersive' ? '沉浸' : '经典'}布局`, icon: 'none' });
    if (wx.vibrateShort) wx.vibrateShort({ type: 'medium' });
  },

  onMoreFuncTap(e) {
    const id = e.currentTarget.dataset.id;
    if (id === 'settings') {
      wx.navigateTo({ url: '/pages/settings/settings' });
      this.toggleMorePanel();
      return;
    }
    if (id === 'timer') {
      this.setData({ showTimerPicker: true });
      this.toggleMorePanel();
      return;
    }
    wx.showToast({ title: `功能 ${id} 敬请期待`, icon: 'none' });
    this.toggleMorePanel();
    if (wx.vibrateShort) wx.vibrateShort({ type: 'light' });
  },

  onTimerSliderChange(e) {
    const val = parseInt(e.detail.value);
    this.setData({ customTimerValue: val });
  },

  confirmTimer() {
    this.setData({ timerMode: this.data.customTimerValue, showTimerPicker: false });
    wx.showToast({ title: `定时已设为 ${this.data.timerMode}s`, icon: 'none' });
    if (wx.vibrateShort) wx.vibrateShort({ type: 'medium' });
  },

  closeTimerPicker() {
    this.setData({ showTimerPicker: false });
  },

  preventTouchMove() {
    // 阻止面板下方滚动
  },

  // ── 闪光灯循环 ────────────────────────────────────────────────
  cycleFlash() {
    const idx = FLASH_CYCLE.indexOf(this.data.flashMode);
    const next = FLASH_CYCLE[(idx + 1) % FLASH_CYCLE.length];
    this.setData({ flashMode: next });
    if (wx.vibrateShort) wx.vibrateShort({ type: 'light' });
  },

  // ── 计时器循环 ────────────────────────────────────────────────
  cycleTimer() {
    // 侧边栏定时按钮现在直接打开自定义选择器，或者如果已经有值则关闭定时
    if (this.data.timerMode > 0) {
      this.setData({ timerMode: 0 });
      wx.showToast({ title: '定时已关闭', icon: 'none' });
    } else {
      this.setData({ showTimerPicker: true });
    }
    if (wx.vibrateShort) wx.vibrateShort({ type: 'light' });
  },

  // ── 翻转摄像头 ────────────────────────────────────────────────
  flipCamera() {
    const pos = this.data.devicePosition === 'back' ? 'front' : 'back';
    this.setData({ devicePosition: pos });
  },

  // ── 快门点击 ──────────────────────────────────────────────────
  onShutterTap() {
    if (this.data.isRecording) {
      this._stopRecording();
      return;
    }
    if (this.data.isCountingDown) return;

    if (this.data.timerMode > 0) {
      this._startCountdown(this.data.timerMode);
    } else {
      this._capturePhoto();
    }
  },

  // ── 长按快门：开始录像 ─────────────────────────────────────────
  onShutterLongPress() {
    if (this.data.isCountingDown || this.data.timerMode > 0) return;
    this._startRecording();
  },

  // ── 拍照 ──────────────────────────────────────────────────────
  _capturePhoto() {
    if (!this._cameraCtx) this._cameraCtx = wx.createCameraContext();
    
    // 触觉反馈：轻微震动
    if (wx.vibrateShort) {
      wx.vibrateShort({ type: 'light' });
    }

    // 设置预选滤镜，传递给编辑页
    const app = getApp();
    app.globalData.captureFilterId = this.data.selectedFilterId;

    this._cameraCtx.takePhoto({
      quality: 'high',
      success: (res) => {
        this._goToEdit([{ tempFilePath: res.tempImagePath }]);
      },
      fail: () => {
        wx.showToast({ title: '拍照失败，请重试', icon: 'none' });
      }
    });
  },

  // ── 倒计时拍照 ────────────────────────────────────────────────
  _startCountdown(seconds) {
    this.setData({ isCountingDown: true, countdownValue: seconds });
    
    // 触觉反馈：每次跳秒震动
    this._countdownTimer = setInterval(() => {
      const val = this.data.countdownValue - 1;
      if (wx.vibrateShort) wx.vibrateShort({ type: 'light' });
      
      if (val <= 0) {
        clearInterval(this._countdownTimer);
        this._countdownTimer = null;
        this.setData({ isCountingDown: false, countdownValue: 0 });
        this._capturePhoto();
      } else {
        this.setData({ countdownValue: val });
      }
    }, 1000);
  },

  // ── 开始录像 ──────────────────────────────────────────────────
  _startRecording() {
    if (!this._cameraCtx) this._cameraCtx = wx.createCameraContext();
    
    // 触觉反馈：中等震动提示开始
    if (wx.vibrateShort) {
      wx.vibrateShort({ type: 'medium' });
    }

    this._cameraCtx.startRecord({
      timeoutCallback: () => this._stopRecording(),
      success: () => {
        this.setData({ isRecording: true, recordDuration: 0 });
        this._recordTimer = setInterval(() => {
          this.setData({ recordDuration: this.data.recordDuration + 1 });
        }, 1000);
      },
      fail: () => {
        wx.showToast({ title: '录像失败，请重试', icon: 'none' });
      }
    });
  },

  // ── 停止录像 ──────────────────────────────────────────────────
  _stopRecording() {
    if (this._recordTimer) { clearInterval(this._recordTimer); this._recordTimer = null; }
    if (!this._cameraCtx) return;

    // 触觉反馈：两次轻微震动提示停止
    if (wx.vibrateShort) {
      wx.vibrateShort({ type: 'light' });
    }

    this._cameraCtx.stopRecord({
      compressed: true,
      success: (res) => {
        this.setData({ isRecording: false, recordDuration: 0 });
        // 视频编辑 V1.2 实现，当前先保存到相册
        wx.saveVideoToPhotosAlbum({
          filePath: res.tempVideoPath,
          success: () => wx.showToast({ title: '视频已保存', icon: 'success' }),
          fail: () => wx.showToast({ title: '保存失败', icon: 'none' })
        });
      },
      fail: () => {
        this.setData({ isRecording: false, recordDuration: 0 });
      }
    });
  },

  // ── 从相册选择 ────────────────────────────────────────────────
  goToAlbum() {
    wx.chooseMedia({
      count: APP_CONFIG.MAX_PHOTOS,
      mediaType: ['image'],
      sizeType: ['original', 'compressed'],
      sourceType: ['album'],
      success: (res) => {
        if (!res.tempFiles || !res.tempFiles.length) return;
        this._goToEdit(res.tempFiles);
      },
      fail: (err) => {
        if (err.errMsg && err.errMsg.includes('cancel')) return;
        wx.showToast({ title: '选择失败', icon: 'none' });
      }
    });
  },

  // ── 跳转编辑页 ────────────────────────────────────────────────
  _goToEdit(photos) {
    const app = getApp();
    app.globalData.selectedPhotos = photos;
    app.globalData.captureFilterId = this.data.selectedFilterId;
    wx.navigateTo({ url: '/pages/edit/edit' });
  },

  // ── 相机错误处理 ──────────────────────────────────────────────
  onCameraError(e) {
    this.setData({ cameraError: true, cameraErrorMsg: e.detail.errMsg || '' });
  },

  openSettings() {
    wx.openSetting({
      success: (res) => {
        if (res.authSetting['scope.camera']) {
          this.setData({ cameraError: false });
        }
      }
    });
  },

  onShareAppMessage() {
    return { title: APP_CONFIG.SHARE.title, path: '/pages/camera/camera' };
  }
});
