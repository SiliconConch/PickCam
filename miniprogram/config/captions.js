// config/captions.js
// 时光语：20个精选 + 用户自定义（无限制）

const DEFAULT_CAPTIONS = [
  '📸 此时此刻', '✨ 今日限定', '🌅 清晨微光', '🎞 某个瞬间',
  '🌿 温柔时光', '🌙 静谧时分', '🕊 柔软光阴', '🌸 发现美好',
  '🔍 细节之美', '📷 随手记录', '🍃 平凡之美', '📌 定格时光',
  '📝 记录此刻', '🎬 光影故事', '🌾 日常碎片', '📖 生活笔记',
  '☁ 寻常时刻', '🌈 光的诗意', '🍂 岁月静好', '💫 遇见美好'
];

// 保留分类结构供 getCaptionsByCategory 兼容调用，无实际分类
const CAPTION_CATEGORIES = [
  { id: 'all', name: '全部' },
  { id: 'custom', name: '我的' }
];

/**
 * 文案管理类
 */
class CaptionManager {
  constructor() {
    this._loadStorage();
  }

  _loadStorage() {
    try {
      this.storage = wx.getStorageSync('custom_captions') || [];
    } catch (e) {
      this.storage = [];
    }
  }

  _saveStorage() {
    try {
      wx.setStorageSync('custom_captions', this.storage);
    } catch (e) {
      console.error('保存文案失败:', e);
    }
  }

  /**
   * 获取所有文案（默认 + 自定义）
   */
  getAllCaptions() {
    return [...DEFAULT_CAPTIONS, ...this.storage];
  }

  /**
   * 按分类获取文案
   */
  getCaptionsByCategory(categoryId) {
    if (categoryId === 'custom') return this.storage;
    return this.getAllCaptions();
  }

  /**
   * 获取随机文案
   */
  getRandomCaption() {
    const all = this.getAllCaptions();
    const index = Math.floor(Math.random() * all.length);
    return all[index];
  }

  /**
   * 获取每日固定文案（同一时刻相同，保持仪式感）
   */
  getDailyCaption() {
    const now = new Date();
    const dayOfYear = Math.floor(
      (now - new Date(now.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24)
    );
    const hourIndex = now.getHours();
    const all = this.getAllCaptions();
    const index = (dayOfYear * 24 + hourIndex) % all.length;
    return all[index];
  }

  /**
   * 添加自定义文案（最长20字符，无数量限制）
   */
  addCustomCaption(caption) {
    if (!caption || !caption.trim()) {
      return { success: false, error: '文案不能为空' };
    }
    const trimmed = caption.trim();
    if (trimmed.length > 20) {
      return { success: false, error: '文案不能超过20字符' };
    }
    if (this.storage.includes(trimmed)) {
      return { success: false, error: '文案已存在' };
    }
    this.storage.push(trimmed);
    this._saveStorage();
    return { success: true };
  }

  /**
   * 删除自定义文案
   */
  deleteCustomCaption(caption) {
    const index = this.storage.indexOf(caption);
    if (index > -1) {
      this.storage.splice(index, 1);
      this._saveStorage();
      return { success: true };
    }
    return { success: false, error: '文案不存在' };
  }

  /**
   * 编辑自定义文案
   */
  editCustomCaption(oldCaption, newCaption) {
    if (!newCaption || !newCaption.trim()) {
      return { success: false, error: '文案不能为空' };
    }
    const trimmed = newCaption.trim();
    if (trimmed.length > 20) {
      return { success: false, error: '文案不能超过20字符' };
    }
    const index = this.storage.indexOf(oldCaption);
    if (index > -1) {
      this.storage[index] = trimmed;
      this._saveStorage();
      return { success: true };
    }
    return { success: false, error: '原文案不存在' };
  }

  /**
   * 获取自定义文案列表
   */
  getCustomCaptions() {
    return [...this.storage];
  }

  /**
   * 检查是否为默认文案
   */
  isDefaultCaption(caption) {
    return DEFAULT_CAPTIONS.includes(caption);
  }

  /**
   * 获取分类列表
   */
  getCategories() {
    return CAPTION_CATEGORIES;
  }
}

module.exports = {
  DEFAULT_CAPTIONS,
  CAPTION_CATEGORIES,
  CaptionManager
};
