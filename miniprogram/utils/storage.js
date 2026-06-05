// utils/storage.js
// 本地存储管理

const StorageManager = {
  /**
   * 获取存储值
   */
  get(key, defaultValue = null) {
    try {
      const val = wx.getStorageSync(key);
      return val !== '' && val !== undefined && val !== null ? val : defaultValue;
    } catch (e) {
      return defaultValue;
    }
  },

  /**
   * 设置存储值
   */
  set(key, value) {
    try {
      wx.setStorageSync(key, value);
      return true;
    } catch (e) {
      console.error('Storage set failed:', key, e);
      return false;
    }
  },

  /**
   * 删除存储值
   */
  remove(key) {
    try {
      wx.removeStorageSync(key);
      return true;
    } catch (e) {
      return false;
    }
  },

  /**
   * 清空所有存储
   */
  clear() {
    try {
      wx.clearStorageSync();
      return true;
    } catch (e) {
      return false;
    }
  }
};

// ============================================================
// 水印模板存储管理
// ============================================================
const WatermarkTemplateStorage = {
  KEY: 'user_watermark_templates',

  getAll() {
    return StorageManager.get(this.KEY, []);
  },

  save(template) {
    const templates = this.getAll();
    const idx = templates.findIndex(t => t.id === template.id);
    if (idx > -1) {
      templates[idx] = template;
    } else {
      templates.push({
        ...template,
        id: `user_${Date.now()}`,
        createdAt: Date.now()
      });
    }
    StorageManager.set(this.KEY, templates);
  },

  delete(templateId) {
    const templates = this.getAll().filter(t => t.id !== templateId);
    StorageManager.set(this.KEY, templates);
  }
};

// ============================================================
// 最近使用记录
// ============================================================
const RecentUsageStorage = {
  KEY_FILTER: 'recent_filter',
  KEY_WATERMARK: 'recent_watermark',
  KEY_TEMPLATE: 'recent_template',

  getRecentFilter() {
    return StorageManager.get(this.KEY_FILTER, null);
  },

  setRecentFilter(filterId) {
    StorageManager.set(this.KEY_FILTER, filterId);
  },

  getRecentWatermark() {
    return StorageManager.get(this.KEY_WATERMARK, null);
  },

  setRecentWatermark(config) {
    StorageManager.set(this.KEY_WATERMARK, config);
  },

  getRecentTemplate() {
    return StorageManager.get(this.KEY_TEMPLATE, 'classic');
  },

  setRecentTemplate(templateId) {
    StorageManager.set(this.KEY_TEMPLATE, templateId);
  }
};

module.exports = {
  StorageManager,
  WatermarkTemplateStorage,
  RecentUsageStorage
};
