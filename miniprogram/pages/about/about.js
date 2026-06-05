// pages/about/about.js
Page({
  data: {
    version: '1.2.0'
  },

  goBack() {
    wx.navigateBack();
  },

  shareApp() {
    wx.showShareMenu({ withShareTicket: false, menus: ['shareAppMessage', 'shareTimeline'] });
  },

  onShareAppMessage() {
    return {
      title: '拾光相机 — 用光影，讲述属于你的故事',
      path: '/pages/camera/camera'
    };
  },

  openFeedback() {
    wx.showToast({ title: '感谢反馈，即将上线', icon: 'none' });
  },

  openPrivacy() {
    wx.showToast({ title: '暂未上线', icon: 'none' });
  }
});
