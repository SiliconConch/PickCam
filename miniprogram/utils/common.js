// utils/common.js
// 通用工具函数

/**
 * 延迟函数
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 清理临时文件
 */
function cleanupTempFile(path) {
  if (!path) return;
  try {
    const fs = wx.getFileSystemManager();
    fs.unlinkSync(path);
  } catch (e) {
    // 忽略清理错误（文件可能已不存在）
  }
}

/**
 * 压缩图片（超过阈值自动压缩）
 * @param {string} src - 图片路径
 * @param {number} maxSize - 最大边长（px）
 * @returns {Promise<string>} 压缩后的路径
 */
async function compressImageIfNeeded(src, maxSize = 2000) {
  try {
    const info = await new Promise((resolve, reject) => {
      wx.getImageInfo({ src, success: resolve, fail: reject });
    });

    if (info.width <= maxSize && info.height <= maxSize) {
      return src; // 不需要压缩
    }

    // 计算压缩比
    const ratio = maxSize / Math.max(info.width, info.height);
    const targetWidth = Math.round(info.width * ratio);
    const targetHeight = Math.round(info.height * ratio);

    // 使用Canvas压缩
    const offscreenCanvas = wx.createOffscreenCanvas({
      type: '2d',
      width: targetWidth,
      height: targetHeight
    });

    const ctx = offscreenCanvas.getContext('2d');
    const img = offscreenCanvas.createImage();

    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
      img.src = src;
    });

    ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

    const compressedPath = await new Promise((resolve, reject) => {
      wx.canvasToTempFilePath({
        canvas: offscreenCanvas,
        fileType: 'jpg',
        quality: 0.9,
        success: (res) => resolve(res.tempFilePath),
        fail: reject
      });
    });

    return compressedPath;
  } catch (e) {
    console.error('图片压缩失败，使用原图:', e);
    return src;
  }
}

/**
 * 保存图片到相册（带权限检查）
 * @param {string} filePath - 图片路径
 * @returns {Promise<void>}
 */
async function saveToAlbum(filePath) {
  // 先检查权限
  const granted = await checkAlbumPermission();
  if (!granted) {
    throw new Error('相册权限未授权');
  }

  return new Promise((resolve, reject) => {
    wx.saveImageToPhotosAlbum({
      filePath,
      success: resolve,
      fail: reject
    });
  });
}

/**
 * 检查相册写入权限
 */
async function checkAlbumPermission() {
  return new Promise((resolve) => {
    wx.getSetting({
      success: (res) => {
        if (res.authSetting['scope.writePhotosAlbum']) {
          resolve(true);
        } else {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success: () => resolve(true),
            fail: () => {
              wx.showModal({
                title: '需要相册权限',
                content: '保存照片需要访问您的相册，请在设置中开启',
                confirmText: '去设置',
                success: (res) => {
                  if (res.confirm) {
                    wx.openSetting({
                      success: (settingRes) => {
                        resolve(settingRes.authSetting['scope.writePhotosAlbum'] || false);
                      }
                    });
                  } else {
                    resolve(false);
                  }
                }
              });
            }
          });
        }
      },
      fail: () => resolve(false)
    });
  });
}

/**
 * 显示加载提示
 */
function showLoading(title = '处理中...') {
  wx.showLoading({ title, mask: true });
}

/**
 * 隐藏加载提示
 */
function hideLoading() {
  wx.hideLoading();
}

/**
 * 显示成功提示
 */
function showSuccess(title) {
  wx.showToast({ title, icon: 'success', duration: 2000 });
}

/**
 * 显示错误提示
 */
function showError(title) {
  wx.showToast({ title, icon: 'none', duration: 2500 });
}

/**
 * 获取窗口信息（缓存）— 替代废弃的 wx.getSystemInfoSync()
 */
let _windowInfo = null;
function getSystemInfo() {
  if (!_windowInfo) {
    try {
      _windowInfo = wx.getWindowInfo();
    } catch (e) {
      _windowInfo = wx.getSystemInfoSync(); // 旧版基础库兜底
    }
  }
  return _windowInfo;
}

/**
 * rpx转px
 */
function rpxToPx(rpx) {
  const info = getSystemInfo();
  return rpx * info.windowWidth / 750;
}

/**
 * 生成唯一ID
 */
function generateId() {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

module.exports = {
  sleep,
  cleanupTempFile,
  compressImageIfNeeded,
  saveToAlbum,
  checkAlbumPermission,
  showLoading,
  hideLoading,
  showSuccess,
  showError,
  getSystemInfo,
  rpxToPx,
  generateId
};
