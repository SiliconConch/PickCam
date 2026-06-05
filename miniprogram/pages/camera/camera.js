// pages/camera/camera.js
const { FILTER_PRESETS, FILTER_THUMBNAILS } = require('../../engines/filter/presets.js');
const APP_CONFIG = require('../../config/app.config.js');

// C3: 相机滤镜条扩展至全部 15 款
const CAMERA_STRIP_IDS = [
  'original', 'restore', 'soft-portrait', 'film-memory', 'bw-narrative',
  'morning-light', 'warm-nostalgia', 'cinematic', 'cool-crisp', 'dark-mood',
  'urban-street', 'natural-vivid', 'dreamy', 'pink-soft', 'vintage-oil'
];

const FLASH_CYCLE = ['off', 'on', 'auto'];
// D1: TIMER_CYCLE 已废弃（改用自定义滑杆），已移除

Page({
  data: {
    devicePosition: 'back',
    flashMode: 'off',
    timerMode: 0,
    filterStripList: [],
    selectedFilterId: 'original',
    currentFilterName: '原片',
    // D2: currentSwatchA/B 已移除（camera.wxml 中从未使用）
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
    // B4/B5: 移除不可实现的 HDR/夜景/RAW/专业 条目；D3: 统一图标风格
    moreFunctions: [
      { id: 'timer',  name: '定时',  icon: '⏱' },
      { id: 'grid',   name: '网格',  icon: '⊞' },
      { id: 'level',  name: '水平仪', icon: '◎' },
      { id: 'ratio',  name: '画幅',  icon: '▭' },
      { id: 'settings', name: '设置', icon: '⚙' }
    ],
    showTimerPicker: false,
    customTimerValue: 3,

    // B1: 网格线
    showGrid: false,
    // B2: 水平仪
    showLevel: false,
    levelTilt: 0,
    levelOk: false,
    // B3: 画幅比例（F2: thumbClass 使用安全 CSS 类名）
    aspectRatio: 'full',
    showRatioPicker: false,
    ratioOptions: [
      { id: 'full', label: 'Full',  thumbClass: 'rt-full'  },
      { id: '1:1',  label: '1:1',   thumbClass: 'rt-1-1'   },
      { id: '4:3',  label: '4:3',   thumbClass: 'rt-4-3'   },
      { id: '3:2',  label: '3:2',   thumbClass: 'rt-3-2'   },
      { id: '16:9', label: '16:9',  thumbClass: 'rt-16-9'  },
    ],
    // C1: 对焦圈
    showFocusRing: false,
    focusX: 0,
    focusY: 0,
    // C2: 缩放
    showZoomBar: false,
    zoomValue: '1.0',
    // B2: 水平仪像素偏移（F3: 修正 rpx→px）
    levelTiltPx: 0,
    // E1: 快门声音
    soundFeedback: false,
    // F2: 滤镜名标注
    showFilterBadge: false
  },

  _cameraCtx: null,
  _recordTimer: null,
  _countdownTimer: null,
  _focusTimer: null,
  _zoomTimer: null,
  _badgeTimer: null,
  _pinchStartDist: 0,
  _pinchStartZoom: 1,
  _currentZoom: 1,

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

    const profile  = wx.getStorageSync('pickcam_user_profile') || {};
    const settings = wx.getStorageSync('pickcam_settings') || {};

    this.setData({
      filterStripList: stripList,
      selectedFilterId: lastFilterId,
      currentFilterName: selectedFilter.name,
      userAvatar: profile.avatar || '',
      soundFeedback: !!settings.soundFeedback   // E1: 读取快门声设置
    });

    // 读取或初始化布局模式（默认沉浸式）
    this._initLayoutMode();
    // E1: 初始化快门音效
    this._initShutterAudio();

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
    if (this._recordTimer)    clearInterval(this._recordTimer);
    if (this._countdownTimer) clearInterval(this._countdownTimer);
    if (this._focusTimer)     clearTimeout(this._focusTimer);
    if (this._zoomTimer)      clearTimeout(this._zoomTimer);
    if (this.data.showLevel) {
      try { wx.stopDeviceMotionListening(); wx.offDeviceMotionChange(); } catch (e) {}
    }
    if (this._shutterAudio) {
      try { this._shutterAudio.destroy(); } catch (e) {}
    }
    if (this._badgeTimer) clearTimeout(this._badgeTimer);
  },

  // ── C1: 点击对焦（显示对焦圈 + 调用 setFocusPoint API） ────────
  onCameraFocusTap(e) {
    const { x, y } = e.detail;
    this.setData({ showFocusRing: true, focusX: x - 44, focusY: y - 44 });
    if (this._cameraCtx) {
      const info = wx.getWindowInfo();
      try {
        this._cameraCtx.setFocusPoint({
          x: x / info.windowWidth,
          y: y / info.windowHeight,
          complete: () => {}
        });
      } catch (err) {}
    }
    clearTimeout(this._focusTimer);
    this._focusTimer = setTimeout(() => this.setData({ showFocusRing: false }), 1500);
  },

  // ── C2: 捏合缩放（双指手势 → setZoom API） ──────────────────────
  onPinchStart(e) {
    if (e.touches.length !== 2) return;
    const dx = e.touches[0].clientX - e.touches[1].clientX;
    const dy = e.touches[0].clientY - e.touches[1].clientY;
    this._pinchStartDist  = Math.sqrt(dx * dx + dy * dy);
    this._pinchStartZoom  = this._currentZoom;
  },

  onPinchMove(e) {
    if (e.touches.length !== 2) return;
    const dx   = e.touches[0].clientX - e.touches[1].clientX;
    const dy   = e.touches[0].clientY - e.touches[1].clientY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const zoom = Math.max(1, Math.min(4, this._pinchStartZoom * dist / (this._pinchStartDist || 1)));
    if (Math.abs(zoom - this._currentZoom) < 0.03) return;
    this._currentZoom = zoom;
    this.setData({ zoomValue: zoom.toFixed(1), showZoomBar: true });
    if (this._cameraCtx) {
      try { this._cameraCtx.setZoom({ zoom, complete: () => {} }); } catch (err) {}
    }
  },

  onPinchEnd() {
    clearTimeout(this._zoomTimer);
    this._zoomTimer = setTimeout(() => this.setData({ showZoomBar: false }), 2000);
  },

  // ── 选择滤镜 ──────────────────────────────────────────────────
  selectFilter(e) {
    const id = e.currentTarget.dataset.id;
    const filter = FILTER_PRESETS.find(f => f.id === id);
    if (!filter) return;
    this.setData({ selectedFilterId: id, currentFilterName: filter.name, showFilterBadge: true });
    wx.setStorageSync('last_capture_filter', id);
    // F2: 1.6s 后自动隐藏标注
    clearTimeout(this._badgeTimer);
    this._badgeTimer = setTimeout(() => this.setData({ showFilterBadge: false }), 1600);
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
    this.toggleMorePanel();

    if (id === 'settings') {
      wx.navigateTo({ url: '/pages/settings/settings' });
      return;
    }
    if (id === 'timer') {
      this.setData({ showTimerPicker: true });
      return;
    }
    // B1: 网格线切换
    if (id === 'grid') {
      this.setData({ showGrid: !this.data.showGrid });
      wx.showToast({ title: this.data.showGrid ? '网格线已开启' : '网格线已关闭', icon: 'none', duration: 800 });
      if (wx.vibrateShort) wx.vibrateShort({ type: 'light' });
      return;
    }
    // B2: 水平仪切换
    if (id === 'level') {
      const show = !this.data.showLevel;
      this.setData({ showLevel: show });
      if (show) {
        try {
          wx.startDeviceMotionListening({ interval: 'ui' });
          wx.onDeviceMotionChange(res => {
            const gamma   = Math.max(-45, Math.min(45, res.gamma || 0));
            // F3: inline style 不支持 rpx，转换为 px（120rpx ≈ windowWidth*0.16）
            const rpxBase = wx.getWindowInfo().windowWidth / 750;
            const tiltPx  = Math.round(gamma / 45 * 120 * rpxBase);
            this.setData({ levelTilt: gamma / 45, levelOk: Math.abs(gamma) < 3, levelTiltPx: tiltPx });
          });
        } catch (e) {}
        wx.showToast({ title: '水平仪已开启', icon: 'none', duration: 800 });
      } else {
        try { wx.stopDeviceMotionListening(); wx.offDeviceMotionChange(); } catch (e) {}
      }
      if (wx.vibrateShort) wx.vibrateShort({ type: 'light' });
      return;
    }
    // B3: 画幅比例选择
    if (id === 'ratio') {
      this.setData({ showRatioPicker: true });
      return;
    }
    if (wx.vibrateShort) wx.vibrateShort({ type: 'light' });
  },

  // B3: 选择画幅
  selectRatio(e) {
    const ratio = e.currentTarget.dataset.ratio;
    this.setData({ aspectRatio: ratio, showRatioPicker: false });
    // 传递给编辑页
    getApp().globalData.captureAspectRatio = ratio;
    if (wx.vibrateShort) wx.vibrateShort({ type: 'light' });
  },

  closeRatioPicker() {
    this.setData({ showRatioPicker: false });
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

  // ── E1: 快门音效初始化 ────────────────────────────────────────
  _initShutterAudio() {
    // R5: 文件缺失时静默降级，不影响其他功能
    // 需在项目中放置 miniprogram/assets/audio/shutter.mp3
    try {
      this._shutterAudio = wx.createInnerAudioContext();
      this._shutterAudio.obeyMuteSwitch = false;
      this._shutterAudio.src = '/assets/audio/shutter.mp3';
      this._shutterAudio.onError(() => {
        this._shutterAudio = null; // 文件不存在时置空，_playShutterSound 静默跳过
      });
    } catch (e) {
      this._shutterAudio = null;
    }
  },

  _playShutterSound() {
    if (!this.data.soundFeedback || !this._shutterAudio) return;
    try { this._shutterAudio.stop(); this._shutterAudio.play(); } catch (e) {}
  },

  // ── 拍照 ──────────────────────────────────────────────────────
  _capturePhoto() {
    if (!this._cameraCtx) this._cameraCtx = wx.createCameraContext();

    // 触觉 + 音效反馈
    if (wx.vibrateShort) wx.vibrateShort({ type: 'light' });
    this._playShutterSound();   // E1: 快门声

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
    this.setData({ cameraError: true });
    console.error('[Camera] error:', e.detail.errMsg);
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
