// app.js
const PROFILE_KEY  = 'pickcam_user_profile';
const SETTINGS_KEY = 'pickcam_settings';
const STATS_KEY    = 'pickcam_stats';

App({
  globalData: {
    selectedPhotos:  [],
    captureFilterId: null,
    clearSelection:  false,
    shareImagePath:  null,
    isPro:           false,
    userProfile:     null,   // {nickname, avatar, userId, createdAt}
    appSettings:     null    // {autoLocation, autoTimestamp, hapticFeedback, ...}
  },

  onLaunch() {
    const { StorageManager } = require('./utils/storage.js');
    this.globalData.isPro = StorageManager.get('is_pro', false);

    // 加载用户资料
    try {
      const profile = wx.getStorageSync(PROFILE_KEY) || null;
      this.globalData.userProfile = profile;
    } catch (e) {}

    // 加载应用设置
    try {
      const settings = wx.getStorageSync(SETTINGS_KEY) || {};
      this.globalData.appSettings = settings;
    } catch (e) {}
  },

  // 统计数据增量工具（供 edit.js 保存后调用）
  incrementStat(key) {
    try {
      const stats = wx.getStorageSync(STATS_KEY) || { photos: 0, filters: 0, watermarks: 0 };
      stats[key] = (stats[key] || 0) + 1;
      wx.setStorageSync(STATS_KEY, stats);
    } catch (e) {}
  }
});
