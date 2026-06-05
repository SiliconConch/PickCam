// pages/splash/splash.js
const GUIDED_KEY = 'pickcam_guided_v1';

Page({
  data: {
    logoIn:    false,
    textIn:    false,
    taglineIn: false,
    dotsIn:    false
  },

  onLoad() {
    setTimeout(() => this.setData({ logoIn:    true }), 120);
    setTimeout(() => this.setData({ textIn:    true }), 520);
    setTimeout(() => this.setData({ taglineIn: true }), 780);
    setTimeout(() => this.setData({ dotsIn:    true }), 980);

    setTimeout(() => {
      const guided = wx.getStorageSync(GUIDED_KEY);
      wx.redirectTo({ url: guided ? '/pages/camera/camera' : '/pages/guide/guide' });
    }, 2400);
  }
});
