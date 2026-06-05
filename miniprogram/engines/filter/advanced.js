// engines/filter/advanced.js
// 专业模式：11参数精调（V1.1）

const STORAGE_KEY = 'pickcam_custom_filters';

/**
 * 默认专业参数（全部归零表示无调整）
 */
const DEFAULT_PRO_PARAMS = {
  brightness:       0,   // -50 ~ +50
  contrast:         0,   // -50 ~ +50
  saturation:       0,   // -100 ~ +100
  temperature:      0,   // -50 ~ +50
  tint:             0,   // -50 ~ +50
  vibrance:         0,   // -50 ~ +50
  sharpen:          0,   // -50 ~ +50（实为清晰度/clarity）
  highlights:       0,   // -100 ~ +100
  shadows:          0,   // -100 ~ +100
  vignetteIntensity:0,   // 0 ~ 100
  grain:            0,   // 0 ~ 50
  fade:             0    // 0 ~ 50
};

/**
 * 专业参数的UI配置（滑块范围 + 显示名）
 */
const PRO_PARAM_CONFIG = [
  { key: 'brightness',        name: '亮度',     min: -50,  max: 50,  icon: '☀️' },
  { key: 'contrast',          name: '对比度',   min: -50,  max: 50,  icon: '◑' },
  { key: 'saturation',        name: '饱和度',   min: -100, max: 100, icon: '🎨' },
  { key: 'temperature',       name: '色温',     min: -50,  max: 50,  icon: '🌡️' },
  { key: 'tint',              name: '色调',     min: -50,  max: 50,  icon: '🌿' },
  { key: 'vibrance',          name: '自然饱和', min: -50,  max: 50,  icon: '✨' },
  { key: 'sharpen',           name: '清晰度',   min: -50,  max: 50,  icon: '🔍' },
  { key: 'highlights',        name: '高光',     min: -100, max: 100, icon: '🔆' },
  { key: 'shadows',           name: '阴影',     min: -100, max: 100, icon: '🔅' },
  { key: 'vignetteIntensity', name: '暗角',     min: 0,    max: 100, icon: '⬛' },
  { key: 'grain',             name: '颗粒',     min: 0,    max: 50,  icon: '🌾' },
  { key: 'fade',              name: '褪色',     min: 0,    max: 50,  icon: '📷' }
];

class AdvancedFilterEditor {
  /**
   * 将专业参数叠加到基础滤镜参数上，返回合并结果
   * @param {Object} baseParams - 来自 FILTER_PRESETS 的参数
   * @param {Object} proParams  - 用户手动调整的参数
   * @returns {Object} 合并后的完整参数
   */
  static mergeParams(baseParams, proParams) {
    if (!baseParams && !proParams) return { ...DEFAULT_PRO_PARAMS };
    const base = baseParams || {};
    const pro  = proParams  || {};

    return {
      brightness:        clamp((base.brightness        || 0) + (pro.brightness        || 0), -100, 100),
      contrast:          clamp((base.contrast          || 0) + (pro.contrast          || 0), -100, 100),
      saturation:        clamp((base.saturation        || 0) + (pro.saturation        || 0), -100, 100),
      temperature:       clamp((base.temperature       || 0) + (pro.temperature       || 0), -100, 100),
      tint:              clamp((base.tint              || 0) + (pro.tint              || 0), -100, 100),
      vibrance:          clamp((base.vibrance          || 0) + (pro.vibrance          || 0), -100, 100),
      sharpen:           clamp((base.sharpen           || 0) + (pro.sharpen           || 0), -100, 100),
      highlights:        clamp((base.highlights        || 0) + (pro.highlights        || 0), -100, 100),
      shadows:           clamp((base.shadows           || 0) + (pro.shadows           || 0), -100, 100),
      vignetteIntensity: clamp((base.vignetteIntensity || 0) + (pro.vignetteIntensity || 0),    0, 100),
      grain:             clamp((base.grain             || 0) + (pro.grain             || 0),    0, 100),
      fade:              clamp((base.fade              || 0) + (pro.fade              || 0),    0, 100)
    };
  }

  /**
   * 判断专业参数是否有任何非零调整
   */
  static isDirty(proParams) {
    if (!proParams) return false;
    return Object.values(proParams).some(v => v !== 0);
  }

  /**
   * 保存当前参数为自定义滤镜
   * @param {string} name - 自定义滤镜名称
   * @param {Object} mergedParams - 合并后的参数
   * @returns {{ id, name, params }}
   */
  static saveAsCustom(name, mergedParams) {
    const custom = {
      id: `custom_${Date.now()}`,
      name: name || `自定义${Date.now()}`,
      isCustom: true,
      params: { ...mergedParams },
      createdAt: new Date().toISOString()
    };
    const list = (wx.getStorageSync(STORAGE_KEY) || []);
    list.unshift(custom);
    try { wx.setStorageSync(STORAGE_KEY, list); } catch (e) {}
    return custom;
  }

  /**
   * 获取所有自定义滤镜
   */
  static getCustomFilters() {
    return wx.getStorageSync(STORAGE_KEY) || [];
  }

  /**
   * 删除自定义滤镜
   */
  static deleteCustomFilter(id) {
    const list = (wx.getStorageSync(STORAGE_KEY) || []).filter(f => f.id !== id);
    try { wx.setStorageSync(STORAGE_KEY, list); } catch (e) {}
  }

  static getDefaultParams() {
    return { ...DEFAULT_PRO_PARAMS };
  }

  static getParamConfig() {
    return PRO_PARAM_CONFIG;
  }
}

function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }

module.exports = { AdvancedFilterEditor, DEFAULT_PRO_PARAMS, PRO_PARAM_CONFIG };
