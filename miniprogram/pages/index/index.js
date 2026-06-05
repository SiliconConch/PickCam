// pages/index/index.js  V2 Fresh
const APP_CONFIG = require('../../config/app.config.js');
const { SimpleStats, StreakTracker } = require('../../utils/statistics.js');
const GUIDED_KEY = 'pickcam_guided_v1';

// 根据小时生成打招呼文案
function getGreeting() {
  const h = new Date().getHours();
  if (h < 6)  return '深夜';
  if (h < 11) return '早上好';
  if (h < 14) return '午间';
  if (h < 18) return '下午好';
  if (h < 22) return '晚上好';
  return '夜深了';
}

// 格式化今日日期
function getTodayStr() {
  const d = new Date();
  const week = ['周日','周一','周二','周三','周四','周五','周六'][d.getDay()];
  return `${d.getMonth() + 1}月${d.getDate()}日 ${week}`;
}

Page({
  data: {
    maxPhotos: APP_CONFIG.MAX_PHOTOS,
    greeting:  '',
    todayStr:  '',
    streak:    0,
    stats:     { photos: 0, filters: 0, watermarks: 0 },
    features:  ['15款精品滤镜', '智能水印', '时光语', '批量处理', '专业调色', '滤镜对比']
  },

  onShow() {
    const app = getApp();
    // 从分享/编辑页返回时清理全局状态
    if (app.globalData.clearSelection) {
      app.globalData.selectedPhotos = [];
      app.globalData.captureFilterId = null;
      app.globalData.clearSelection  = false;
    }
    this._refreshData();
  },

  _refreshData() {
    const stats  = SimpleStats.get();                       // R2
    const streak = wx.getStorageSync('pickcam_streak') || 0; // R1: 由 StreakTracker.update() 写入
    this.setData({
      greeting: getGreeting(),
      todayStr: getTodayStr(),
      stats,
      streak
    });
  },

  /** 跳转相机页 */
  goCamera() {
    wx.navigateTo({ url: '/pages/camera/camera' });
  },

  /** 从相册选照片 */
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
