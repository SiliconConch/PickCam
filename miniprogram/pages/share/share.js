// pages/share/share.js
const APP_CONFIG = require('../../config/app.config.js');
const { saveToAlbum, showSuccess, showError } = require('../../utils/common.js');

Page({
  data: {
    imagePath: '',
    isPro: false
  },

  onLoad() {
    const app = getApp();
    const imagePath = app.globalData.shareImagePath || '';
    const isPro = app.globalData.isPro || false;

    if (!imagePath) {
      wx.showToast({ title: '分享图生成失败', icon: 'none' });
      setTimeout(() => wx.navigateBack(), 1500);
      return;
    }

    this.setData({ imagePath, isPro });
  },

  /**
   * 保存到相册
   */
  async saveImage() {
    try {
      await saveToAlbum(this.data.imagePath);
      showSuccess('已保存到相册');
    } catch (e) {
      showError('保存失败，请检查相册权限');
    }
  },

  /**
   * 分享给朋友
   */
  onShareAppMessage() {
    return {
      title: APP_CONFIG.SHARE.title,
      path: APP_CONFIG.SHARE.path,
      imageUrl: this.data.imagePath
    };
  },

  /**
   * 分享到朋友圈
   */
  onShareTimeline() {
    return {
      title: APP_CONFIG.SHARE.title,
      imageUrl: this.data.imagePath
    };
  },

  /**
   * 返回编辑
   */
  goBack() {
    wx.navigateBack();
  },

  /**
   * 返回首页
   */
  goHome() {
    const app = getApp();
    app.globalData.clearSelection = true;
    wx.reLaunch({ url: '/pages/camera/camera' });
  }
});
