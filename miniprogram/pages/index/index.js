// pages/index/index.js
const APP_CONFIG = require('../../config/app.config.js');

Page({
  data: {
    maxPhotos: APP_CONFIG.MAX_PHOTOS
  },

  onShow() {
    const app = getApp();
    if (app.globalData.clearSelection) {
      app.globalData.selectedPhotos = [];
      app.globalData.captureFilterId = null;
      app.globalData.clearSelection = false;
    }
  },

  /**
   * 跳转相机页
   */
  goCamera() {
    wx.navigateTo({ url: '/pages/camera/camera' });
  },

  /**
   * 从相册选照片
   */
  async choosePhotos() {
    try {
      const res = await new Promise((resolve, reject) => {
        wx.chooseMedia({
          count: this.data.maxPhotos,
          mediaType: ['image'],
          sizeType: ['original', 'compressed'],
          sourceType: ['album'],
          success: resolve,
          fail: reject
        });
      });

      const photos = res.tempFiles;
      if (!photos.length) return;

      const app = getApp();
      app.globalData.selectedPhotos = photos;
      app.globalData.captureFilterId = null;
      wx.navigateTo({ url: '/pages/edit/edit' });

    } catch (err) {
      if (err.errMsg && err.errMsg.includes('cancel')) return;
      wx.showToast({ title: '选择失败，请重试', icon: 'none' });
    }
  },

  onShareAppMessage() {
    return { title: APP_CONFIG.SHARE.title, path: '/pages/camera/camera' };
  }
});
