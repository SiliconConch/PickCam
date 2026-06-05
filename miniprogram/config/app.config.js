// config/app.config.js
// 全局配置

module.exports = {
  // 批量处理限制
  MAX_PHOTOS: 9,
  MAX_VIDEOS: 1,

  // 图片压缩阈值（超过此宽度自动压缩）
  MAX_IMAGE_SIZE: 2000,

  // 批量处理间隔（毫秒）
  BATCH_DELAY: 100,

  // 品牌信息
  BRAND: {
    name: '拾光相机',
    nameEn: 'PickCam',
    slogan: '在时光流逝中，捕捉真实瞬间',
    watermarkText: '来自拾光相机',
    publicAccount: '硅基拾贝'
  },

  // 商业模式
  PRO_PRICE: 68,

  // 分享配置
  SHARE: {
    title: '拾光相机 - 真实记录每个瞬间',
    path: '/pages/index/index',
    imageUrl: '/assets/share-cover.png'
  },

  // 颜色令牌已迁移至 app.wxss 的 Swancam / Fresh CSS 变量系统
  // 请勿在此添加颜色配置，统一使用 var(--swancam-*) 或 var(--fresh-*)
};
