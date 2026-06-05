// engines/watermark/config.js
// 水印配置管理

const { WATERMARK_TEMPLATES } = require('../../config/watermark-templates.js');
const { WatermarkTemplateStorage, RecentUsageStorage } = require('../../utils/storage.js');

class WatermarkConfig {
  constructor() {
    this._builtinTemplates = WATERMARK_TEMPLATES;
  }

  /**
   * 获取所有模板（内置 + 用户自定义）
   */
  getAllTemplates() {
    const userTemplates = WatermarkTemplateStorage.getAll();
    return [...this._builtinTemplates, ...userTemplates];
  }

  /**
   * 获取内置模板
   */
  getBuiltinTemplates() {
    return this._builtinTemplates;
  }

  /**
   * 按ID获取模板
   */
  getTemplateById(id) {
    const all = this.getAllTemplates();
    return all.find(t => t.id === id) || this._builtinTemplates[0];
  }

  /**
   * 获取最近使用的模板配置
   */
  getRecentConfig() {
    const templateId = RecentUsageStorage.getRecentTemplate();
    return this.getTemplateById(templateId);
  }

  /**
   * 保存用户自定义模板
   */
  saveUserTemplate(name, config) {
    const template = {
      name,
      config,
      isUserDefined: true
    };
    WatermarkTemplateStorage.save(template);
    return template;
  }

  /**
   * 删除用户模板
   */
  deleteUserTemplate(id) {
    WatermarkTemplateStorage.delete(id);
  }

  /**
   * 生成默认水印配置（可直接使用）
   */
  getDefaultConfig() {
    return this._builtinTemplates[0].config;
  }

  /**
   * 深拷贝配置（避免修改原始模板）
   */
  cloneConfig(config) {
    return JSON.parse(JSON.stringify(config));
  }
}

module.exports = { WatermarkConfig };
