// utils/statistics.js
// 使用数据统计（V1.2 基础版）

const STATS_KEY = 'pickcam_stats';

class StatisticsManager {
  constructor() {
    this._data = null;
  }

  _load() {
    if (!this._data) {
      this._data = wx.getStorageSync(STATS_KEY) || {
        totalPhotos: 0,
        filterUsage: {},       // { filterId: count }
        templateUsage: {},     // { templateId: count }
        locations: [],         // [{ name, count }]
        firstUseDate: new Date().toISOString(),
        lastUseDate: new Date().toISOString()
      };
    }
    return this._data;
  }

  _save() {
    if (this._data) {
      this._data.lastUseDate = new Date().toISOString();
      try { wx.setStorageSync(STATS_KEY, this._data); } catch (e) {}
    }
  }

  /** 记录一次照片处理 */
  recordPhotoProcess(filterId, templateId, location) {
    const d = this._load();
    d.totalPhotos++;
    if (filterId && filterId !== 'original') {
      d.filterUsage[filterId] = (d.filterUsage[filterId] || 0) + 1;
    }
    if (templateId) {
      d.templateUsage[templateId] = (d.templateUsage[templateId] || 0) + 1;
    }
    if (location) {
      const existing = d.locations.find(l => l.name === location);
      if (existing) existing.count++;
      else d.locations.push({ name: location, count: 1 });
      // 只保留最近50个地点
      d.locations.sort((a, b) => b.count - a.count);
      if (d.locations.length > 50) d.locations = d.locations.slice(0, 50);
    }
    this._save();
  }

  /** 获取最常用滤镜（前5） */
  getTopFilters(limit = 5) {
    const d = this._load();
    return Object.entries(d.filterUsage)
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit)
      .map(([id, count]) => ({ id, count }));
  }

  /** 获取最常用模板（前3） */
  getTopTemplates(limit = 3) {
    const d = this._load();
    return Object.entries(d.templateUsage)
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit)
      .map(([id, count]) => ({ id, count }));
  }

  /** 获取总处理张数 */
  getTotalPhotos() {
    return this._load().totalPhotos;
  }

  /** 获取常去地点（前10） */
  getTopLocations(limit = 10) {
    return this._load().locations.slice(0, limit);
  }

  /** 获取全部统计 */
  getSummary() {
    const d = this._load();
    return {
      totalPhotos: d.totalPhotos,
      topFilters: this.getTopFilters(5),
      topTemplates: this.getTopTemplates(3),
      topLocations: this.getTopLocations(5),
      firstUseDate: d.firstUseDate,
      lastUseDate: d.lastUseDate
    };
  }

  /** 清空所有统计 */
  clear() {
    this._data = null;
    try { wx.removeStorageSync(STATS_KEY); } catch (e) {}
  }
}

module.exports = { StatisticsManager };
