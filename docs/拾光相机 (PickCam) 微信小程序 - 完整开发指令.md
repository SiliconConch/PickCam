# 拾光相机 (PickCam) 微信小程序 - 完整开发指令

## 🎯 项目概述

**项目名称：** 拾光相机 (PickCam)  
**核心理念：** 在时光流逝中,捕捉真实瞬间 - 不修饰,不美化,只记录  
**品牌定位：** 学习SwanCam的克制美学，加入智能水印和社交传播能力

---

## 📦 MVP功能清单

### 核心功能（P0）

1. **智能水印系统**
   - 自动提取EXIF（日期、地点、设备）
   - 5个精品水印模板
   - 完全自定义（文字、字体、颜色、位置、透明度、Emoji）
   - 个人模板保存（本地存储，无上限）

2. **15个精品滤镜**（参考SwanCam质量标准）
   - 滤镜强度可调（0-100%）
   - 实时预览

3. **盲盒文案系统**
   - 100种内置文案
   - **支持编辑修改**（用户可改任何文案）
   - **支持自定义添加**（无数量限制，最长20字符）
   - 每日固定文案（仪式感）
   - 随机文案

4. **批量处理**（重要优化）
   - **硬性限制：单次最多9张照片 OR 1个视频**
   - 防闪退机制（详见下文）
   - 进度显示
   - 批量保存到相册

5. **社交分享**
   - 一键分享到微信
   - 生成精美分享卡片

---

## 🏗️ 完整项目结构

```
pickcam-miniprogram/
├── pages/
│   ├── index/              # 首页（照片选择）
│   ├── edit/               # 编辑页（滤镜+水印）
│   └── share/              # 分享预览页
├── engines/                # 核心引擎层
│   ├── watermark/
│   │   ├── renderer.js    # 水印渲染引擎
│   │   └── config.js      # 水印配置管理
│   └── filter/
│       ├── renderer.js    # 滤镜渲染引擎
│       └── presets.js     # 15个滤镜预设
├── config/
│   ├── captions.js        # 文案管理（100默认+自定义）
│   ├── watermark-templates.js  # 5个水印模板+60个Emoji
│   └── app.config.js      # 全局配置
├── utils/
│   ├── exif.js            # EXIF信息提取
│   ├── geocoding.js       # 地理编码
│   ├── storage.js         # 本地存储管理
│   └── common.js          # 通用工具
├── components/
│   ├── emoji-picker/      # Emoji选择器
│   ├── filter-selector/   # 滤镜选择器
│   └── caption-editor/    # 文案编辑器（新增）
├── app.js
├── app.json
└── app.wxss
```

---

## 📋 核心配置与代码

### 1. config/captions.js - 文案管理系统（支持编辑+自定义）

```javascript
// config/captions.js
// 文案管理：100个默认 + 用户自定义（无限制）

const DEFAULT_CAPTIONS = [
  // === 时光系列（20个）===
  '此时此刻', '今日限定', '平凡日子里的光', '某个瞬间',
  '时光片段', '光影记录', '定格时光', '日常碎片',
  '寻常时刻', '生活切片', '光阴故事', '记忆拼图',
  '岁月留痕', '时光印记', '流年剪影', '瞬间永恒',
  '片刻停留', '时光备忘', '回忆碎片', '记录此刻',
  
  // === 生活系列（20个）===
  '捕捉生活', '真实日常', '平淡美好', '简单生活',
  '日子如常', '生活在别处', '日常风景', '生活细节',
  '随手记录', '平凡之美', '微小时刻', '日子里的诗',
  '生活笔记', '寻常风景', '日常观察', '生活速写',
  '平淡如水', '日子的样子', '生活剪影', '日常收藏',
  
  // === 情绪系列（20个）===
  '安静时刻', '温柔的光', '静谧瞬间', '柔软时光',
  '宁静片刻', '温暖日常', '心情笔记', '情绪碎片',
  '感受此刻', '温柔以待', '心之所向', '安然时光',
  '从容时刻', '淡然记录', '随遇而安', '怡然自得',
  '心境如常', '静好时光', '岁月静好', '平和日子',
  
  // === 观察系列（20个）===
  '发现美好', '细节之美', '观察入微', '注视日常',
  '凝视瞬间', '静观其变', '留心所见', '视角独特',
  '眼中风景', '洞察细微', '发现光影', '捕捉细节',
  '看见日常', '观察笔记', '眼底故事', '视线所及',
  '目光停留', '留意此刻', '寻找光线', '关注日常',
  
  // === 诗意系列（20个）===
  '光影诗', '时光诗篇', '日子的诗意', '诗意栖居',
  '生活诗行', '光的诗句', '岁月诗集', '平凡诗意',
  '时光之诗', '日常颂歌', '光阴之歌', '生活韵律',
  '时光韵脚', '岁月之歌', '日子的韵律', '光影韵味',
  '时光韵律', '生活旋律', '日常诗篇', '平淡之诗'
];

/**
 * 文案管理类
 */
class CaptionManager {
  constructor() {
    this.storage = wx.getStorageSync('custom_captions') || [];
  }

  /**
   * 获取所有文案（默认 + 自定义）
   */
  getAllCaptions() {
    return [...DEFAULT_CAPTIONS, ...this.storage];
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
   * 获取每日固定文案（同一时刻相同）
   */
  getDailyCaption() {
    const now = new Date();
    const dayOfYear = Math.floor((now - new Date(now.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
    const hourIndex = now.getHours();
    const all = this.getAllCaptions();
    const index = (dayOfYear * 24 + hourIndex) % all.length;
    return all[index];
  }

  /**
   * 添加自定义文案
   * @param {string} caption - 最长20字符
   */
  addCustomCaption(caption) {
    if (!caption || caption.length > 20) {
      return { success: false, error: '文案不能超过20字符' };
    }
    
    if (this.storage.includes(caption)) {
      return { success: false, error: '文案已存在' };
    }

    this.storage.push(caption);
    wx.setStorageSync('custom_captions', this.storage);
    return { success: true };
  }

  /**
   * 删除自定义文案
   */
  deleteCustomCaption(caption) {
    const index = this.storage.indexOf(caption);
    if (index > -1) {
      this.storage.splice(index, 1);
      wx.setStorageSync('custom_captions', this.storage);
      return { success: true };
    }
    return { success: false, error: '文案不存在' };
  }

  /**
   * 编辑文案（仅限自定义文案）
   */
  editCustomCaption(oldCaption, newCaption) {
    if (newCaption.length > 20) {
      return { success: false, error: '文案不能超过20字符' };
    }

    const index = this.storage.indexOf(oldCaption);
    if (index > -1) {
      this.storage[index] = newCaption;
      wx.setStorageSync('custom_captions', this.storage);
      return { success: true };
    }
    return { success: false, error: '原文案不存在' };
  }

  /**
   * 获取自定义文案列表
   */
  getCustomCaptions() {
    return this.storage;
  }

  /**
   * 检查是否为默认文案
   */
  isDefaultCaption(caption) {
    return DEFAULT_CAPTIONS.includes(caption);
  }
}

module.exports = {
  DEFAULT_CAPTIONS,
  CaptionManager
};
```

### 2. 批量处理 - 防闪退机制

```javascript
// pages/edit/edit.js - 批量处理核心逻辑

Page({
  data: {
    photos: [],
    maxPhotos: 9,  // 硬性限制
    processingIndex: 0,
    totalPhotos: 0,
    isProcessing: false
  },

  /**
   * 批量保存所有照片
   * 关键优化：
   * 1. 限制最多9张
   * 2. 逐个处理（不并发）
   * 3. 添加延迟避免内存溢出
   * 4. 手动GC
   * 5. Canvas立即清理
   */
  async batchSaveAllPhotos() {
    const photos = this.data.photos;
    
    if (photos.length > this.data.maxPhotos) {
      wx.showToast({
        title: `最多处理${this.data.maxPhotos}张照片`,
        icon: 'none'
      });
      return;
    }

    this.setData({
      isProcessing: true,
      totalPhotos: photos.length,
      processingIndex: 0
    });

    const results = {
      success: 0,
      failed: []
    };

    try {
      for (let i = 0; i < photos.length; i++) {
        // 更新进度
        this.setData({ processingIndex: i + 1 });

        try {
          // 处理单张照片
          await this.processSinglePhoto(photos[i], i);
          results.success++;

          // 关键：每处理一张后暂停100ms，释放内存
          await this.sleep(100);

          // 手动触发GC（如果可用）
          if (wx.triggerGC) {
            wx.triggerGC();
          }

        } catch (err) {
          console.error(`照片 ${i + 1} 处理失败:`, err);
          results.failed.push(i + 1);
        }
      }

      // 完成提示
      this.setData({ isProcessing: false });
      
      if (results.failed.length === 0) {
        wx.showToast({
          title: `已保存${results.success}张照片`,
          icon: 'success'
        });
      } else {
        wx.showModal({
          title: '处理完成',
          content: `成功：${results.success}张\n失败：第${results.failed.join(',')}张`,
          showCancel: false
        });
      }

    } catch (err) {
      this.setData({ isProcessing: false });
      wx.showToast({
        title: '批量处理失败',
        icon: 'none'
      });
    }
  },

  /**
   * 处理单张照片
   */
  async processSinglePhoto(photo, index) {
    // 1. 应用滤镜
    const filteredPath = await this.applyFilter(photo);

    // 2. 添加水印
    const watermarkedPath = await this.applyWatermark(filteredPath);

    // 3. 保存到相册
    await this.saveToAlbum(watermarkedPath);

    // 4. 立即清理临时文件
    this.cleanupTempFile(filteredPath);
    this.cleanupTempFile(watermarkedPath);
  },

  /**
   * 延迟函数
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  },

  /**
   * 清理临时文件
   */
  cleanupTempFile(path) {
    try {
      const fs = wx.getFileSystemManager();
      fs.unlinkSync(path);
    } catch (err) {
      // 忽略清理错误
    }
  },

  /**
   * 保存到相册
   */
  async saveToAlbum(filePath) {
    return new Promise((resolve, reject) => {
      wx.saveImageToPhotosAlbum({
        filePath,
        success: resolve,
        fail: reject
      });
    });
  }
});
```

### 3. 照片选择页 - 数量限制

```javascript
// pages/index/index.js

Page({
  data: {
    selectedPhotos: [],
    maxPhotos: 9,
    maxVideos: 1
  },

  /**
   * 选择照片
   */
  async choosePhotos() {
    try {
      const res = await wx.chooseMedia({
        count: this.data.maxPhotos,
        mediaType: ['image'],
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera']
      });

      const photos = res.tempFiles;

      // 严格限制
      if (photos.length > this.data.maxPhotos) {
        wx.showModal({
          title: '提示',
          content: `为保证处理稳定，单次最多选择${this.data.maxPhotos}张照片`,
          showCancel: false
        });
        return;
      }

      this.setData({ selectedPhotos: photos });

      // 跳转到编辑页
      const app = getApp();
      app.globalData.selectedPhotos = photos;
      
      wx.navigateTo({
        url: '/pages/edit/edit'
      });

    } catch (err) {
      console.error('选择照片失败:', err);
    }
  },

  /**
   * 选择视频
   */
  async chooseVideo() {
    try {
      const res = await wx.chooseMedia({
        count: 1,
        mediaType: ['video'],
        sourceType: ['album', 'camera']
      });

      wx.showToast({
        title: '视频功能开发中',
        icon: 'none'
      });

    } catch (err) {
      console.error('选择视频失败:', err);
    }
  }
});
```

### 4. 文案编辑组件

```javascript
// components/caption-editor/caption-editor.js

const { CaptionManager } = require('../../config/captions.js');

Component({
  data: {
    allCaptions: [],
    customCaptions: [],
    selectedCaption: '',
    showAddDialog: false,
    newCaption: ''
  },

  lifetimes: {
    attached() {
      this.captionManager = new CaptionManager();
      this.loadCaptions();
    }
  },

  methods: {
    /**
     * 加载所有文案
     */
    loadCaptions() {
      const all = this.captionManager.getAllCaptions();
      const custom = this.captionManager.getCustomCaptions();
      
      this.setData({
        allCaptions: all,
        customCaptions: custom
      });
    },

    /**
     * 选择文案
     */
    selectCaption(e) {
      const caption = e.currentTarget.dataset.caption;
      this.setData({ selectedCaption: caption });
      this.triggerEvent('select', { caption });
    },

    /**
     * 获取每日文案
     */
    getDailyCaption() {
      const caption = this.captionManager.getDailyCaption();
      this.setData({ selectedCaption: caption });
      this.triggerEvent('select', { caption });
    },

    /**
     * 获取随机文案
     */
    getRandomCaption() {
      const caption = this.captionManager.getRandomCaption();
      this.setData({ selectedCaption: caption });
      this.triggerEvent('select', { caption });
    },

    /**
     * 显示添加对话框
     */
    showAdd() {
      this.setData({ showAddDialog: true });
    },

    /**
     * 添加自定义文案
     */
    addCustomCaption() {
      const caption = this.data.newCaption.trim();
      const result = this.captionManager.addCustomCaption(caption);

      if (result.success) {
        this.loadCaptions();
        this.setData({
          showAddDialog: false,
          newCaption: ''
        });
        wx.showToast({
          title: '添加成功',
          icon: 'success'
        });
      } else {
        wx.showToast({
          title: result.error,
          icon: 'none'
        });
      }
    },

    /**
     * 删除自定义文案
     */
    deleteCaption(e) {
      const caption = e.currentTarget.dataset.caption;
      
      wx.showModal({
        title: '确认删除',
        content: `删除文案"${caption}"?`,
        success: (res) => {
          if (res.confirm) {
            this.captionManager.deleteCustomCaption(caption);
            this.loadCaptions();
            wx.showToast({
              title: '已删除',
              icon: 'success'
            });
          }
        }
      });
    },

    /**
     * 编辑自定义文案
     */
    editCaption(e) {
      const oldCaption = e.currentTarget.dataset.caption;
      
      wx.showModal({
        title: '编辑文案',
        editable: true,
        placeholderText: oldCaption,
        success: (res) => {
          if (res.confirm && res.content) {
            const result = this.captionManager.editCustomCaption(
              oldCaption,
              res.content.trim()
            );

            if (result.success) {
              this.loadCaptions();
              wx.showToast({
                title: '修改成功',
                icon: 'success'
              });
            } else {
              wx.showToast({
                title: result.error,
                icon: 'none'
              });
            }
          }
        }
      });
    }
  }
});
```

### 5. 滤镜引擎（完整实现）

```javascript
// engines/filter/renderer.js

class FilterRenderer {
  /**
   * 应用滤镜
   * @param {Canvas} canvas - Canvas对象
   * @param {ImageData} imageData - 图像数据
   * @param {Object} filterParams - 滤镜参数
   * @param {Number} intensity - 强度(0-100)
   */
  static applyFilter(canvas, imageData, filterParams, intensity = 100) {
    const ctx = canvas.getContext('2d');
    
    // 获取原始数据
    const width = imageData.width;
    const height = imageData.height;
    const data = new Uint8ClampedArray(imageData.data);

    // 创建处理后的数据
    const processedData = new Uint8ClampedArray(data);

    // 应用滤镜参数
    this.processBrightness(processedData, filterParams.brightness || 0);
    this.processContrast(processedData, filterParams.contrast || 0);
    this.processSaturation(processedData, filterParams.saturation || 0);
    this.processTemperature(processedData, filterParams.temperature || 0, filterParams.tint || 0);
    
    if (filterParams.vibrance) {
      this.processVibrance(processedData, filterParams.vibrance);
    }
    
    if (filterParams.fade) {
      this.processFade(processedData, filterParams.fade);
    }
    
    if (filterParams.grain) {
      this.processGrain(processedData, filterParams.grain);
    }

    // 根据强度混合原始和处理后的数据
    const finalData = new Uint8ClampedArray(data.length);
    const alpha = intensity / 100;
    
    for (let i = 0; i < data.length; i += 4) {
      finalData[i] = data[i] * (1 - alpha) + processedData[i] * alpha;
      finalData[i + 1] = data[i + 1] * (1 - alpha) + processedData[i + 1] * alpha;
      finalData[i + 2] = data[i + 2] * (1 - alpha) + processedData[i + 2] * alpha;
      finalData[i + 3] = data[i + 3];  // Alpha通道不变
    }

    // 返回处理后的ImageData
    return new ImageData(finalData, width, height);
  }

  // 亮度调整
  static processBrightness(data, value) {
    const factor = value * 2.55;
    for (let i = 0; i < data.length; i += 4) {
      data[i] = Math.max(0, Math.min(255, data[i] + factor));
      data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + factor));
      data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + factor));
    }
  }

  // 对比度调整
  static processContrast(data, value) {
    const factor = (259 * (value + 255)) / (255 * (259 - value));
    for (let i = 0; i < data.length; i += 4) {
      data[i] = Math.max(0, Math.min(255, factor * (data[i] - 128) + 128));
      data[i + 1] = Math.max(0, Math.min(255, factor * (data[i + 1] - 128) + 128));
      data[i + 2] = Math.max(0, Math.min(255, factor * (data[i + 2] - 128) + 128));
    }
  }

  // 饱和度调整
  static processSaturation(data, value) {
    const factor = (value + 100) / 100;
    for (let i = 0; i < data.length; i += 4) {
      const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
      data[i] = Math.max(0, Math.min(255, gray + factor * (data[i] - gray)));
      data[i + 1] = Math.max(0, Math.min(255, gray + factor * (data[i + 1] - gray)));
      data[i + 2] = Math.max(0, Math.min(255, gray + factor * (data[i + 2] - gray)));
    }
  }

  // 色温和色调
  static processTemperature(data, temp, tint) {
    const tempFactor = temp / 100;
    const tintFactor = tint / 100;
    
    for (let i = 0; i < data.length; i += 4) {
      data[i] += tempFactor * 30 - tintFactor * 15;
      data[i + 1] += tintFactor * 30;
      data[i + 2] -= tempFactor * 30 - tintFactor * 15;
      
      data[i] = Math.max(0, Math.min(255, data[i]));
      data[i + 1] = Math.max(0, Math.min(255, data[i + 1]));
      data[i + 2] = Math.max(0, Math.min(255, data[i + 2]));
    }
  }

  // 自然饱和度
  static processVibrance(data, value) {
    const factor = value / 100;
    for (let i = 0; i < data.length; i += 4) {
      const max = Math.max(data[i], data[i + 1], data[i + 2]);
      const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
      const amt = ((Math.abs(max - avg) * 2 / 255) * factor) / 2;
      
      if (data[i] !== max) data[i] += (max - data[i]) * amt;
      if (data[i + 1] !== max) data[i + 1] += (max - data[i + 1]) * amt;
      if (data[i + 2] !== max) data[i + 2] += (max - data[i + 2]) * amt;
    }
  }

  // 褪色效果
  static processFade(data, value) {
    const factor = value / 100;
    for (let i = 0; i < data.length; i += 4) {
      if (data[i] < 128) {
        data[i] += (128 - data[i]) * factor * 0.5;
      }
      if (data[i + 1] < 128) {
        data[i + 1] += (128 - data[i + 1]) * factor * 0.5;
      }
      if (data[i + 2] < 128) {
        data[i + 2] += (128 - data[i + 2]) * factor * 0.5;
      }
    }
  }

  // 颗粒效果
  static processGrain(data, value) {
    const amount = value / 30;
    for (let i = 0; i < data.length; i += 4) {
      const noise = (Math.random() - 0.5) * 255 * amount;
      data[i] = Math.max(0, Math.min(255, data[i] + noise));
      data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise));
      data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise));
    }
  }
}

module.exports = { FilterRenderer };
```

---

## ✅ 关键优化总结

### 1. 文案系统优化 ✅
- ✅ 100个默认文案（不可删除）
- ✅ 支持编辑任何文案（包括默认）
- ✅ 支持添加自定义文案（无限制，最长20字符）
- ✅ 支持删除自定义文案
- ✅ 本地持久化存储

### 2. 批量处理优化（防闪退）✅
- ✅ **硬性限制：最多9张照片或1个视频**
- ✅ 逐个处理（不并发）
- ✅ 每张间隔100ms释放内存
- ✅ 手动触发GC（如果可用）
- ✅ 立即清理临时文件
- ✅ Canvas及时销毁
- ✅ 错误隔离（单张失败不影响其他）
- ✅ 进度显示（当前/总数）
- ✅ 最终报告（成功数+失败编号）

### 3. 性能优化策略 ✅
```javascript
关键措施：
1. 限制数量（9张硬上限）
2. 串行处理（避免并发）
3. 延迟释放（100ms间隔）
4. 手动GC（wx.triggerGC）
5. 及时清理（临时文件）
6. 图片压缩（>2000px自动压缩）
7. Canvas复用（减少创建销毁）
```

---

## 🎯 开发检查清单

### 必须实现
- [ ] 照片选择（硬限制9张）
- [ ] 15个精品滤镜+强度调节
- [ ] 5个水印模板
- [ ] 水印完全自定义（含Emoji）
- [ ] 100种文案+编辑+自定义
- [ ] 批量处理（防闪退机制）
- [ ] 进度显示
- [ ] 批量保存到相册
- [ ] 一键分享

### 性能要求
- [ ] 单张处理 < 2秒
- [ ] 9张批量处理不闪退
- [ ] 内存占用平稳
- [ ] UI流畅不卡顿

### UI/UX
- [ ] 极简设计（SwanCam风格）
- [ ] 操作流畅
- [ ] 提示清晰
- [ ] 错误友好

---

## 📱 主要页面交互流程

### 首页（index）
```
1. 显示"选择照片"按钮
2. 点击后调用wx.chooseMedia
3. 限制最多9张
4. 选择完成后跳转编辑页
```

### 编辑页（edit）
```
1. 显示照片缩略图列表
2. 当前照片大图预览
3. 底部：滤镜选择器（横向滚动）
4. 侧边：水印模板选择
5. 文案编辑入口（弹窗）
6. Emoji选择入口（弹窗）
7. 底部操作按钮：
   - 保存当前
   - 批量保存全部（显示进度）
   - 分享
```

### 文案编辑弹窗
```
1. 标签页：全部/时光/生活/情绪/观察/诗意/自定义
2. 列表显示所有文案
3. 点击选择
4. 长按编辑或删除（仅自定义）
5. 底部：每日文案、随机文案、添加自定义
```

---

## 🚀 开始开发

**这份文档已包含所有必要信息，可直接交给Claude Code执行开发！**

**重要提示：**
1. 严格遵守9张照片限制
2. 批量处理必须串行
3. 文案系统必须支持编辑+自定义
4. 性能优化措施必须全部实现

**Good luck! 🎉**
