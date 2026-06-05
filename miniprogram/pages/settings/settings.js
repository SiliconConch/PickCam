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
      content: '将清除临时文件和图片缓存，不影响个人资料、偏好设置和照片。',
      confirmText: '清除',
      success: (res) => {
        if (!res.confirm) return;
        // 仅清除非核心 key，保留用户数据
        const PRESERVE = [
          'pickcam_user_profile', 'pickcam_settings', 'pickcam_stats',
          'pickcam_favorites', 'pickcam_guided_v1', 'pickcam_layout_mode',
          'last_capture_filter', 'is_pro'
        ];
        try {
          const { keys } = wx.getStorageInfoSync();
          keys.forEach(key => { if (!PRESERVE.includes(key)) wx.removeStorageSync(key); });
        } catch (e) {}
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
    // E3: 使用微信客服消息或复制邮箱方式收集反馈
    wx.showModal({
      title: '意见反馈',
      content: '感谢您的使用！\n如有问题或建议，请发送邮件至：\npickcam@siliconconch.com',
      confirmText: '复制邮箱',
      cancelText: '关闭',
      success: (res) => {
        if (res.confirm) {
          wx.setClipboardData({
            data: 'pickcam@siliconconch.com',
            success: () => wx.showToast({ title: '邮箱已复制', icon: 'success' })
          });
        }
      }
    });
  },

  openPrivacy() {
    wx.showToast({ title: '暂未上线', icon: 'none' });
  }
});
