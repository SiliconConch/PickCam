// pages/about/about.js
Page({
  data: {
    version: '1.2.0'
  },

  goBack() {
    wx.navigateBack();
  },

  // R10: shareApp() 已移除，改为 button open-type="share" 触发 onShareAppMessage
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
