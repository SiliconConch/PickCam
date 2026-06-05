// pages/profile/profile.js
const PROFILE_KEY  = 'pickcam_user_profile';
const STATS_KEY    = 'pickcam_stats';
const SETTINGS_KEY = 'pickcam_settings';

const { FILTER_PRESETS } = require('../../engines/filter/presets.js');
const { WATERMARK_TEMPLATES } = require('../../config/watermark-templates.js');

// 9宫格位置选项（用于UI）
const POSITION_OPTIONS = [
  { id: 'top-left',      label: '↖' },
  { id: 'top-center',    label: '↑' },
  { id: 'top-right',     label: '↗' },
  { id: 'middle-left',   label: '←' },
  { id: 'center',        label: '●' },
  { id: 'middle-right',  label: '→' },
  { id: 'bottom-left',   label: '↙' },
  { id: 'bottom-center', label: '↓' },
  { id: 'bottom-right',  label: '↘' }
];

Page({
  data: {
    profile: null,
    stats: { photos: 0, filters: 0, watermarks: 0 },

    // 滤镜预设列表（用于默认选择）
    filterPresets: [],
    watermarkTemplates: [],
    positionOptions: POSITION_OPTIONS,

    // 批量默认设置
    settings: {
      // 拍摄设置
      autoLocation:   true,
      autoTimestamp:  true,
      hapticFeedback: true,
      soundFeedback:  false,
      saveOriginal:   false,
      // 水印默认
      defaultTemplateId: 'classic',
      defaultWmPosition: 'bottom-left',
      defaultWmOpacity:  80,
      // 滤镜默认
      defaultFilterId: 'original'
    }
  },

  onShow() {
    this._loadData();
  },

  _loadData() {
    const profile  = wx.getStorageSync(PROFILE_KEY) || null;
    const stats    = wx.getStorageSync(STATS_KEY)   || { photos: 0, filters: 0, watermarks: 0 };
    const saved    = wx.getStorageSync(SETTINGS_KEY) || {};
    const settings = Object.assign({
      autoLocation:      true,
      autoTimestamp:     true,
      hapticFeedback:    true,
      soundFeedback:     false,
      saveOriginal:      false,
      defaultTemplateId: 'classic',
      defaultWmPosition: 'bottom-left',
      defaultWmOpacity:  80,
      defaultFilterId:   'original'
    }, saved);

    // 准备滤镜条数据（带色块）
    const filterPresets = FILTER_PRESETS.map(f => ({
      id: f.id,
      name: f.name,
      swatch: f.swatch || ['#B8B8B8', '#606060']
    }));

    this.setData({ profile, stats, settings, filterPresets, watermarkTemplates: WATERMARK_TEMPLATES });

    // 同步到 app.globalData，让 edit 页可直接读取
    const app = getApp();
    app.globalData.appSettings = settings;
  },

  _saveSettings(patch) {
    const settings = Object.assign({}, this.data.settings, patch);
    wx.setStorageSync(SETTINGS_KEY, settings);
    this.setData({ settings });
    // 同步 app globalData
    const app = getApp();
    app.globalData.appSettings = settings;
  },

  // ── 拍摄开关 ──
  onToggle(e) {
    const key = e.currentTarget.dataset.key;
    this._saveSettings({ [key]: e.detail.value });
  },

  // ── 默认滤镜 ──
  selectDefaultFilter(e) {
    this._saveSettings({ defaultFilterId: e.currentTarget.dataset.id });
  },

  // ── 默认水印模板 ──
  selectDefaultTemplate(e) {
    this._saveSettings({ defaultTemplateId: e.currentTarget.dataset.id });
  },

  // ── 默认水印位置 ──
  selectDefaultWmPos(e) {
    this._saveSettings({ defaultWmPosition: e.currentTarget.dataset.pos });
  },

  // ── 默认水印透明度 ──
  onDefaultOpacityChange(e) {
    this._saveSettings({ defaultWmOpacity: parseInt(e.detail.value) });
  },

  // ── 导航 ──
  goBack()      { wx.navigateBack(); },
  editProfile() { wx.navigateTo({ url: '/pages/auth/auth' }); },
  goSettings()  { wx.navigateTo({ url: '/pages/settings/settings' }); },
  goAbout()     { wx.navigateTo({ url: '/pages/about/about' }); },

  clearData() {
    wx.showModal({
      title: '清除数据',
      content: '将清除所有使用记录，个人资料和设置保留。确定？',
      confirmText: '清除',
      confirmColor: '#E74C3C',
      success: (res) => {
        if (res.confirm) {
          wx.removeStorageSync(STATS_KEY);
          wx.showToast({ title: '已清除', icon: 'success' });
          this._loadData();
        }
      }
    });
  },

  logout() {
    wx.showModal({
      title: '退出登录',
      content: '退出后将清除个人资料，确定？',
      confirmText: '退出',
      confirmColor: '#E74C3C',
      success: (res) => {
        if (res.confirm) {
          wx.removeStorageSync(PROFILE_KEY);
          wx.reLaunch({ url: '/pages/auth/auth' });
        }
      }
    });
  }
});
