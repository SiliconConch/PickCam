// utils/exif.js
// EXIF信息提取工具

/**
 * 从图片路径提取EXIF信息
 * 微信小程序通过 wx.getImageInfo 获取基础信息
 * 更详细的EXIF需要读取二进制数据
 */
const ExifReader = {
  /**
   * 获取图片基本信息（包含部分EXIF）
   * @param {string} filePath - 图片临时路径
   * @returns {Promise<Object>} EXIF信息对象
   */
  async getInfo(filePath) {
    try {
      const info = await new Promise((resolve, reject) => {
        wx.getImageInfo({
          src: filePath,
          success: resolve,
          fail: reject
        });
      });

      return {
        width: info.width,
        height: info.height,
        orientation: info.orientation || 'up',
        type: info.type,
        // 从路径推断拍摄时间（若无EXIF则使用当前时间）
        datetime: this._extractDateFromPath(filePath) || new Date(),
        device: this._extractDevice()
      };
    } catch (e) {
      console.error('获取图片信息失败:', e);
      return {
        datetime: new Date(),
        device: this._extractDevice()
      };
    }
  },

  /**
   * 从微信临时文件路径尝试提取日期信息
   */
  _extractDateFromPath(filePath) {
    // 微信图片临时路径通常包含时间戳
    const tsMatch = filePath.match(/(\d{10,13})/);
    if (tsMatch) {
      const ts = parseInt(tsMatch[1]);
      const date = new Date(ts > 1e12 ? ts : ts * 1000);
      if (date.getFullYear() > 2000 && date.getFullYear() <= new Date().getFullYear() + 1) {
        return date;
      }
    }
    return null;
  },

  /**
   * 获取设备型号
   */
  _extractDevice() {
    try {
      const info = wx.getDeviceInfo();
      // 微信不暴露具体相机型号，返回设备型号
      return info.model || '未知设备';
    } catch (e) {
      return '未知设备';
    }
  },

  /**
   * 格式化日期
   * @param {Date} date
   * @param {string} format - 'YYYY/MM/DD', 'MM/DD', 'YYYY/MM/DD HH:mm'
   */
  formatDate(date, format = 'YYYY/MM/DD') {
    if (!date) date = new Date();
    const d = date instanceof Date ? date : new Date(date);
    const pad = (n) => String(n).padStart(2, '0');

    const replacements = {
      'YYYY': d.getFullYear(),
      'MM': pad(d.getMonth() + 1),
      'DD': pad(d.getDate()),
      'HH': pad(d.getHours()),
      'mm': pad(d.getMinutes()),
      'SS': pad(d.getSeconds())
    };

    return format.replace(/YYYY|MM|DD|HH|mm|SS/g, match => replacements[match]);
  }
};

module.exports = { ExifReader };
