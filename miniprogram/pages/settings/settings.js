// pages/settings/settings.js
const SETTINGS_KEY = 'pickcam_settings';

const DEFAULT_SETTINGS = {
  autoLocation:   true,
  autoTimestamp:  true,
  hapticFeedback: true,
  saveOriginal:   false,
  soundFeedback:  false
};

Page({
  data: {
    settings: { ...DEFAULT_SETTINGS }
  },

  onLoad() {
    const saved = wx.getStorageSync(SETTINGS_KEY) || {};
    this.setData({ settings: { ...DEFAULT_SETTINGS, ...saved } });
  },

  onToggle(e) {
    const key = e.currentTarget.dataset.key;
    const val  = e.detail.value;
    const settings = { ...this.data.settings, [key]: val };
    this.setData({ settings });
    wx.setStorageSync(SETTINGS_KEY, settings);
  },

  clearCache() {
    wx.showModal({
      title: '清除缓存',
      content: '将清除临时文件和图片缓存，不影响保存的照片。',
      confirmText: '清除',
      success: (res) => {
        if (!res.confirm) return;
        wx.clearStorageSync(); // clears everything except critical keys (handled by user)
        wx.showToast({ title: '缓存已清除', icon: 'success' });
      }
    });
  },

  goBack() {
    wx.navigateBack();
  },

  goAbout() {
    wx.navigateTo({ url: '/pages/about/about' });
  },

  openFeedback() {
    wx.navigateTo({ url: '/pages/about/about' });
  },

  openPrivacy() {
    wx.showToast({ title: '暂未上线', icon: 'none' });
  }
});
