# 拾光相机 (PickCam) 完整开发指令文档
# 包含 MVP + V1.1 + V1.2 + V2.0 所有功能

## 🎯 项目概述

**项目名称：** 拾光相机 (PickCam)  
**核心理念：** 在时光流逝中,捕捉真实瞬间 - 不修饰,不美化,只记录  
**品牌定位：** 学习SwanCam克制美学，超越其功能完整性

**开发分期：**
- MVP：核心功能（2周）
- V1.1：滤镜+水印升级（+2周）
- V1.2：智能化+体验优化（+4周）
- V2.0：高级功能（+8周）

---

## 📦 完整项目结构

```
pickcam-miniprogram/
├── pages/
│   ├── index/              # 首页
│   ├── edit/               # 编辑页
│   ├── share/              # 分享页
│   ├── filter-detail/      # V1.1 滤镜详情页
│   ├── stats/              # V1.2 数据统计页
│   └── yearly-report/      # V2.0 年度报告页
├── engines/
│   ├── watermark/
│   │   ├── renderer.js    # 水印渲染引擎
│   │   ├── config.js      # 水印配置
│   │   └── smart-layout.js # V1.2 智能布局
│   ├── filter/
│   │   ├── renderer.js    # 滤镜渲染引擎
│   │   ├── presets.js     # 滤镜预设
│   │   ├── advanced.js    # V1.1 专业模式
│   │   └── recommend.js   # V1.2 智能推荐
│   └── ai/
│       └── scene-detect.js # V1.2 场景识别
├── config/
│   ├── captions.js        # 文案管理
│   ├── watermark-templates.js  # 水印模板
│   ├── filter-categories.js    # V1.1 滤镜分类
│   ├── filter-stories.js       # V2.0 滤镜故事
│   └── app.config.js
├── utils/
│   ├── exif.js
│   ├── geocoding.js
│   ├── weather.js         # V1.1 天气API
│   ├── storage.js
│   ├── statistics.js      # V1.2 数据统计
│   └── common.js
├── components/
│   ├── emoji-picker/
│   ├── filter-selector/
│   ├── caption-editor/
│   ├── filter-compare/    # V1.1 滤镜对比
│   ├── advanced-editor/   # V1.1 专业编辑器
│   ├── guide-overlay/     # V1.2 新手引导
│   └── daily-recommend/   # V2.0 每日推荐
├── app.js
├── app.json
└── app.wxss
```

---

## 🎨 MVP 版本（2周）

### 核心功能清单

#### 1. 智能水印系统
```javascript
// 5个基础模板
const BASE_TEMPLATES = [
  'classic',      // 经典
  'minimal',      // 极简
  'emoji',        // Emoji
  'caption',      // 文案
  'full'          // 完整
];

// 自动提取
- EXIF日期时间
- GPS地理位置
- 设备信息

// 自定义能力
- 文字、字体、颜色
- 位置、透明度
- Emoji支持（60+）
- 个人模板保存
```

#### 2. 15个精品滤镜
```javascript
// engines/filter/presets.js
const MVP_FILTERS = [
  'original',        // 原片
  'true_tone',       // 真实还原
  'film_superia',    // 胶片记忆
  'bw_story',        // 黑白叙事
  'morning_glow',    // 清晨微光
  'vintage_oil',     // 复古油画
  'portra_400',      // 柔光人像
  'urban_street',    // 城市街拍
  'nature_vivid',    // 自然鲜活
  'soft_dream',      // 柔梦
  'cinematic',       // 电影感
  'moody_dark',      // 暗调情绪
  'pastel_soft',     // 粉调柔和
  'cool_tone',       // 冷调清冽
  'warm_nostalgia'   // 暖调怀旧
];

// 滤镜强度可调（0-100%）
```

#### 3. 盲盒文案系统
```javascript
// 100种内置 + 可编辑 + 自定义
// 详见 config/captions.js
```

#### 4. 批量处理（防闪退）
```javascript
// 硬限制：9张照片 OR 1个视频
// 串行处理 + 100ms间隔 + 手动GC
```

#### 5. 社交分享
```javascript
// 一键分享到微信
// 精美分享卡片
```

---

## 🚀 V1.1 版本（+2周）

### 滤镜系统升级

#### 1.1 三级滤镜分类

```javascript
// config/filter-categories.js

const FILTER_CATEGORIES = {
  // 一级分类：场景
  scene: {
    portrait: {      // 人像（5个）
      name: '人像',
      filters: [
        'portra_400',      // 柔光人像
        'natural_skin',    // 自然肤色
        'warm_portrait',   // 暖调人像
        'cool_portrait',   // 冷调人像
        'bw_portrait'      // 黑白人像
      ],
      icon: '👤'
    },
    landscape: {     // 风景（5个）
      name: '风景',
      filters: [
        'nature_vivid',    // 自然鲜活
        'morning_glow',    // 清晨微光
        'golden_hour',     // 黄昏暖阳
        'rainy_mood',      // 雨天灰调
        'snow_pure'        // 雪景纯净
      ],
      icon: '🏔️'
    },
    street: {        // 街拍（3个）
      name: '街拍',
      filters: [
        'urban_street',    // 城市街拍
        'night_vibe',      // 夜景氛围
        'architecture'     // 建筑几何
      ],
      icon: '🏙️'
    },
    film: {          // 胶片（7个）
      name: '胶片',
      filters: [
        'film_superia',    // 富士Superia 400
        'portra_400',      // 柯达Portra 400
        'pro_400h',        // 富士Pro 400H
        'kodak_gold',      // 柯达Gold 200
        'velvia_50',       // 富士Velvia 50
        'ilford_hp5',      // Ilford HP5
        'lucky_color'      // 乐凯彩卷
      ],
      icon: '📷'
    }
  },

  // 二级分类：风格
  style: {
    realistic: {     // 真实系（5个）
      name: '真实',
      filters: ['original', 'true_tone', 'natural_skin', 'nature_vivid', 'architecture'],
      icon: '✨'
    },
    vintage: {       // 复古系（5个）
      name: '复古',
      filters: ['vintage_oil', 'kodak_gold', 'lucky_color', 'warm_nostalgia', 'sepia'],
      icon: '📼'
    },
    cinematic: {     // 电影系（3个）
      name: '电影',
      filters: ['cinematic', 'moody_dark', 'film_noir'],
      icon: '🎬'
    },
    artistic: {      // 艺术系（2个）
      name: '艺术',
      filters: ['soft_dream', 'pastel_soft'],
      icon: '🎨'
    }
  },

  // 三级分类：收藏夹（用户自定义）
  favorites: {
    name: '收藏',
    filters: [],  // 用户添加
    icon: '⭐'
  },

  // 最近使用（自动记录）
  recent: {
    name: '最近',
    filters: [],  // 自动记录最近10个
    icon: '🕐'
  }
};

module.exports = { FILTER_CATEGORIES };
```

#### 1.2 滤镜对比模式

```javascript
// components/filter-compare/filter-compare.js

Component({
  data: {
    compareMode: 'ab',  // ab | triple | grid | slider
    filters: []
  },

  methods: {
    // AB对比（左右分屏）
    renderABCompare() {
      // 左边：原图/滤镜A
      // 右边：滤镜B
    },

    // 三联对比
    renderTripleCompare() {
      // 左：原图 | 中：滤镜A | 右：滤镜B
    },

    // 网格对比（2x2）
    renderGridCompare() {
      // 同时展示4个滤镜
    },

    // 滑动对比
    renderSliderCompare() {
      // 滑块控制显示原图/滤镜
      const slider = this.createSlider();
      slider.onChange((value) => {
        // value: 0-100
        // 控制两张图片的显示比例
      });
    }
  }
});
```

#### 1.3 专业模式（参数精调）

```javascript
// engines/filter/advanced.js

class AdvancedFilterEditor {
  constructor() {
    this.params = {
      brightness: 0,      // -50 ~ +50
      contrast: 0,        // -50 ~ +50
      saturation: 0,      // -100 ~ +100
      temperature: 0,     // -50 ~ +50
      tint: 0,            // -50 ~ +50
      vibrance: 0,        // -50 ~ +50
      sharpen: 0,         // -50 ~ +50
      grain: 0,           // 0 ~ 30
      fade: 0,            // 0 ~ 30
      
      // V1.1 新增参数
      vignette: {         // 暗角
        intensity: 0,     // 0 ~ 100
        radius: 60,       // 0 ~ 100
        feather: 50       // 0 ~ 100
      },
      highlights: 0,      // -100 ~ +100
      shadows: 0,         // -100 ~ +100
      colorSplit: {       // 色彩分离
        enable: false,
        amount: 0         // 0 ~ 100
      }
    };
  }

  // 应用暗角效果
  applyVignette(imageData, config) {
    const { intensity, radius, feather } = config;
    const width = imageData.width;
    const height = imageData.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const maxDistance = Math.sqrt(centerX * centerX + centerY * centerY);

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const dx = x - centerX;
        const dy = y - centerY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // 计算暗角强度
        const normalizedDistance = distance / maxDistance;
        const vignetteRadius = radius / 100;
        
        if (normalizedDistance > vignetteRadius) {
          const vignetteStrength = (normalizedDistance - vignetteRadius) / (1 - vignetteRadius);
          const smoothedStrength = this.smoothstep(0, 1, vignetteStrength);
          const darkening = 1 - (smoothedStrength * intensity / 100);
          
          const idx = (y * width + x) * 4;
          imageData.data[idx] *= darkening;
          imageData.data[idx + 1] *= darkening;
          imageData.data[idx + 2] *= darkening;
        }
      }
    }
  }

  // 高光/阴影单独调节
  applyHighlightsShadows(imageData, highlights, shadows) {
    const data = imageData.data;
    
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      
      // 计算亮度
      const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
      
      // 高光调节（亮部）
      if (luminance > 128) {
        const factor = (luminance - 128) / 127;
        const adjustment = highlights * factor / 100;
        data[i] = Math.max(0, Math.min(255, r + adjustment * 2.55));
        data[i + 1] = Math.max(0, Math.min(255, g + adjustment * 2.55));
        data[i + 2] = Math.max(0, Math.min(255, b + adjustment * 2.55));
      }
      
      // 阴影调节（暗部）
      if (luminance < 128) {
        const factor = (128 - luminance) / 128;
        const adjustment = shadows * factor / 100;
        data[i] = Math.max(0, Math.min(255, r + adjustment * 2.55));
        data[i + 1] = Math.max(0, Math.min(255, g + adjustment * 2.55));
        data[i + 2] = Math.max(0, Math.min(255, b + adjustment * 2.55));
      }
    }
  }

  // 平滑过渡函数
  smoothstep(edge0, edge1, x) {
    const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
    return t * t * (3 - 2 * t);
  }

  // 保存为自定义滤镜
  saveAsCustomFilter(name) {
    const customFilter = {
      id: `custom_${Date.now()}`,
      name: name,
      params: { ...this.params },
      createdAt: new Date().toISOString()
    };

    const customFilters = wx.getStorageSync('custom_filters') || [];
    customFilters.push(customFilter);
    wx.setStorageSync('custom_filters', customFilters);

    return customFilter;
  }
}

module.exports = { AdvancedFilterEditor };
```

### 水印系统升级

#### 1.4 扩展到15个精品模板

```javascript
// config/watermark-templates.js (V1.1扩展版)

const WATERMARK_TEMPLATES_V11 = [
  // === 极简系（5个）===
  {
    id: 'classic_minimal',
    name: '经典极简',
    category: 'minimal',
    position: 'bottomLeft',
    config: {
      text: {
        font: '28px sans-serif',
        color: '#FFFFFF',
        stroke: { color: '#000000', width: 2 },
        format: '{date}\n{location}'
      }
    }
  },
  {
    id: 'right_minimal',
    name: '右下极简',
    category: 'minimal',
    position: 'bottomRight',
    config: {
      text: {
        font: '26px sans-serif',
        color: '#FFFFFF',
        stroke: { color: '#000000', width: 2.5 },
        format: '{date} · {location}'
      }
    }
  },
  {
    id: 'center_minimal',
    name: '居中极简',
    category: 'minimal',
    position: 'bottomCenter',
    config: {
      text: {
        font: '30px sans-serif',
        color: '#FFFFFF',
        stroke: { color: '#000000', width: 2 },
        align: 'center',
        format: '{location} · {date}'
      }
    }
  },
  {
    id: 'top_minimal',
    name: '顶部极简',
    category: 'minimal',
    position: 'topLeft',
    config: {
      text: {
        font: '24px sans-serif',
        color: '#FFFFFF',
        stroke: { color: '#000000', width: 2 },
        format: '{date}'
      }
    }
  },
  {
    id: 'no_bg_minimal',
    name: '无背景极简',
    category: 'minimal',
    position: 'bottomRight',
    config: {
      background: { type: 'none' },
      text: {
        font: 'bold 32px sans-serif',
        color: '#FFFFFF',
        stroke: { color: '#000000', width: 3 },
        shadow: {
          blur: 10,
          color: 'rgba(0,0,0,0.5)',
          offsetX: 2,
          offsetY: 2
        },
        format: '{date}\n{location}'
      }
    }
  },

  // === 装饰系（5个）===
  {
    id: 'rounded_card',
    name: '圆角卡片',
    category: 'decorative',
    position: 'bottomLeft',
    config: {
      background: {
        type: 'rect',
        color: 'rgba(0, 0, 0, 0.7)',
        borderRadius: 12,
        padding: { x: 20, y: 15 }
      },
      text: {
        font: '28px sans-serif',
        color: '#FFFFFF',
        format: '{emoji} {caption}\n{date} · {location}'
      }
    }
  },
  {
    id: 'frame_decorative',
    name: '线框装饰',
    category: 'decorative',
    position: 'bottomRight',
    config: {
      background: {
        type: 'frame',
        color: 'rgba(255, 255, 255, 0.9)',
        borderColor: '#333333',
        borderWidth: 2,
        padding: { x: 18, y: 12 }
      },
      text: {
        font: '26px sans-serif',
        color: '#333333',
        format: '{date}\n{location}'
      }
    }
  },
  {
    id: 'corner_decorative',
    name: '角标装饰',
    category: 'decorative',
    position: 'bottomLeft',
    config: {
      decoration: {
        type: 'corner',
        size: 40,
        color: '#D4A574'
      },
      text: {
        font: '28px sans-serif',
        color: '#FFFFFF',
        stroke: { color: '#000000', width: 2 },
        format: '{date} · {location}'
      }
    }
  },
  {
    id: 'gradient_bg',
    name: '渐变背景',
    category: 'decorative',
    position: 'bottomCenter',
    config: {
      background: {
        type: 'gradient',
        gradient: {
          type: 'linear',
          direction: 'to top',
          colors: ['rgba(0,0,0,0.8)', 'rgba(0,0,0,0)']
        },
        padding: { x: 25, y: 20 }
      },
      text: {
        font: '30px sans-serif',
        color: '#FFFFFF',
        align: 'center',
        format: '{caption}\n{date}'
      }
    }
  },
  {
    id: 'glass_bg',
    name: '毛玻璃',
    category: 'decorative',
    position: 'bottomRight',
    config: {
      background: {
        type: 'blur',
        blur: 10,
        color: 'rgba(255, 255, 255, 0.3)',
        borderRadius: 10,
        padding: { x: 20, y: 15 }
      },
      text: {
        font: '28px sans-serif',
        color: '#333333',
        format: '{date}\n{location}'
      }
    }
  },

  // === 文艺系（5个）===
  {
    id: 'film_frame',
    name: '胶片边框',
    category: 'artistic',
    position: 'bottomLeft',
    config: {
      decoration: {
        type: 'film_edge',
        color: '#000000'
      },
      text: {
        font: '24px monospace',
        color: '#FFFFFF',
        format: '{date}  {location}\nShot on {device}'
      }
    }
  },
  {
    id: 'polaroid',
    name: '宝丽来',
    category: 'artistic',
    position: 'bottomCenter',
    config: {
      background: {
        type: 'polaroid',
        color: '#FFFFFF',
        padding: { x: 30, y: 40 }
      },
      text: {
        font: 'italic 26px serif',
        color: '#333333',
        align: 'center',
        format: '{caption}'
      }
    }
  },
  {
    id: 'handwriting',
    name: '手写风格',
    category: 'artistic',
    position: 'bottomRight',
    config: {
      text: {
        font: '32px cursive',
        color: '#FFFFFF',
        stroke: { color: '#000000', width: 1.5 },
        format: '{date}\n{location}'
      }
    }
  },
  {
    id: 'stamp',
    name: '复古印章',
    category: 'artistic',
    position: 'topRight',
    config: {
      decoration: {
        type: 'stamp',
        shape: 'circle',
        color: '#CC3333'
      },
      text: {
        font: 'bold 20px sans-serif',
        color: '#CC3333',
        format: '{date}'
      }
    }
  },
  {
    id: 'diary',
    name: '日记本',
    category: 'artistic',
    position: 'bottomLeft',
    config: {
      background: {
        type: 'paper',
        texture: 'diary',
        color: 'rgba(255, 248, 220, 0.9)',
        padding: { x: 25, y: 20 }
      },
      text: {
        font: '26px serif',
        color: '#333333',
        format: '{date} {weather}\n{caption}'
      }
    }
  }
];

module.exports = { WATERMARK_TEMPLATES_V11 };
```

#### 1.5 动态元素扩展

```javascript
// utils/watermark-data.js (V1.1扩展版)

class WatermarkDataProvider {
  constructor() {
    this.cache = {};
  }

  // 获取所有动态数据
  async getAllData(photo) {
    return {
      // 时间元素
      date: await this.getDate(photo),
      time: await this.getTime(photo),
      weekday: await this.getWeekday(photo),
      lunarDate: await this.getLunarDate(photo),
      solarTerm: await this.getSolarTerm(photo),
      
      // 地理元素
      location: await this.getLocation(photo),
      cityLandmark: await this.getCityLandmark(photo),
      province: await this.getProvince(photo),
      coordinates: await this.getCoordinates(photo),
      altitude: await this.getAltitude(photo),
      
      // 环境元素（需要API）
      weather: await this.getWeather(),
      temperature: await this.getTemperature(),
      aqi: await this.getAQI(),
      humidity: await this.getHumidity(),
      windLevel: await this.getWindLevel(),
      
      // 设备元素
      device: await this.getDevice(photo),
      lens: await this.getLens(photo),
      shootingParams: await this.getShootingParams(photo),
      
      // 特殊元素
      emoji: '',  // 用户选择
      caption: '', // 用户选择
      mood: '',   // 用户选择
      constellation: await this.getConstellation(),
      luckyNumber: this.getLuckyNumber(),
      poem: await this.getRandomPoem()
    };
  }

  // 农历日期
  async getLunarDate(photo) {
    const date = await this.getPhotoDate(photo);
    // 使用lunar-javascript库转换
    const Lunar = require('../../libs/lunar.js');
    const lunar = Lunar.fromDate(date);
    return `${lunar.getMonthInChinese()}月${lunar.getDayInChinese()}`;
  }

  // 24节气
  async getSolarTerm(photo) {
    const date = await this.getPhotoDate(photo);
    const Lunar = require('../../libs/lunar.js');
    const lunar = Lunar.fromDate(date);
    const term = lunar.getCurrentJieQi();
    return term ? term.getName() : '';
  }

  // 天气信息（高德天气API）
  async getWeather() {
    if (this.cache.weather) return this.cache.weather;
    
    try {
      const location = await this.getCurrentLocation();
      const res = await wx.request({
        url: 'https://restapi.amap.com/v3/weather/weatherInfo',
        data: {
          key: 'YOUR_AMAP_KEY',
          city: location.adcode,
          extensions: 'base'
        }
      });

      const weather = res.data.lives[0];
      this.cache.weather = {
        text: weather.weather,
        emoji: this.getWeatherEmoji(weather.weather),
        temperature: weather.temperature + '°C',
        humidity: weather.humidity + '%',
        windLevel: weather.windpower + '级'
      };

      return this.cache.weather;
    } catch (err) {
      return { text: '', emoji: '' };
    }
  }

  // 天气对应emoji
  getWeatherEmoji(weather) {
    const map = {
      '晴': '☀️',
      '多云': '⛅',
      '阴': '☁️',
      '小雨': '🌦️',
      '中雨': '🌧️',
      '大雨': '⛈️',
      '雪': '🌨️',
      '雾': '🌫️',
      '霾': '😷'
    };
    return map[weather] || '';
  }

  // 随机诗句
  async getRandomPoem() {
    const poems = [
      '人间烟火气，最抚凡人心',
      '慢慢来，比较快',
      '平凡日子里的光',
      '生活明朗，万物可爱',
      '山川异域，风月同天',
      // ... 更多诗句
    ];
    return poems[Math.floor(Math.random() * poems.length)];
  }
}

module.exports = { WatermarkDataProvider };
```

---

## 🎯 V1.2 版本（+4周）

### 智能化功能

#### 2.1 滤镜智能推荐

```javascript
// engines/filter/recommend.js

class FilterRecommendEngine {
  constructor() {
    this.userPreferences = this.loadUserPreferences();
  }

  // 综合推荐
  async recommend(photo) {
    const recommendations = [];

    // 1. 场景识别推荐
    const sceneRec = await this.recommendByScene(photo);
    recommendations.push(...sceneRec);

    // 2. 时间推荐
    const timeRec = this.recommendByTime(photo);
    recommendations.push(...timeRec);

    // 3. 天气推荐
    const weatherRec = await this.recommendByWeather();
    recommendations.push(...weatherRec);

    // 4. 用户偏好推荐
    const prefRec = this.recommendByPreference();
    recommendations.push(...prefRec);

    // 去重并打分排序
    return this.rankRecommendations(recommendations);
  }

  // 场景识别推荐
  async recommendByScene(photo) {
    const scene = await this.detectScene(photo);
    
    const sceneFilterMap = {
      'person': ['portra_400', 'natural_skin', 'warm_portrait'],
      'landscape': ['nature_vivid', 'morning_glow', 'velvia_50'],
      'building': ['architecture', 'urban_street', 'bw_story'],
      'food': ['warm_nostalgia', 'kodak_gold', 'natural_skin'],
      'night': ['night_vibe', 'moody_dark', 'cinematic']
    };

    return (sceneFilterMap[scene] || []).map(id => ({
      filterId: id,
      reason: '适合' + this.getSceneName(scene),
      score: 10
    }));
  }

  // 简化版场景检测（基于图像特征）
  async detectScene(photo) {
    // V1.2 MVP：基于亮度、色彩分布的简单判断
    const features = await this.extractFeatures(photo);
    
    if (features.faceDetected) return 'person';
    if (features.avgBrightness < 50) return 'night';
    if (features.blueSaturation > 60) return 'landscape';
    if (features.warmTone > 70) return 'food';
    
    return 'general';
    
    // V2.0 升级：接入腾讯云图像识别API
  }

  // 时间推荐
  recommendByTime(photo) {
    const hour = new Date().getHours();
    
    if (hour >= 5 && hour < 8) {
      return [{
        filterId: 'morning_glow',
        reason: '清晨柔光',
        score: 8
      }];
    } else if (hour >= 17 && hour < 19) {
      return [{
        filterId: 'golden_hour',
        reason: '黄昏时刻',
        score: 9
      }];
    } else if (hour >= 22 || hour < 5) {
      return [{
        filterId: 'night_vibe',
        reason: '夜晚氛围',
        score: 7
      }];
    }
    
    return [];
  }

  // 天气推荐
  async recommendByWeather() {
    const weather = await this.getWeather();
    
    const weatherFilterMap = {
      '晴': ['nature_vivid', 'kodak_gold'],
      '阴': ['rainy_mood', 'moody_dark'],
      '雨': ['rainy_mood', 'cinematic'],
      '雪': ['snow_pure', 'cool_tone']
    };

    const filters = weatherFilterMap[weather.text] || [];
    return filters.map(id => ({
      filterId: id,
      reason: weather.text + '天适用',
      score: 6
    }));
  }

  // 用户偏好推荐
  recommendByPreference() {
    const topFilters = this.userPreferences.topFilters.slice(0, 3);
    
    return topFilters.map((filterId, index) => ({
      filterId: filterId,
      reason: '你常用的滤镜',
      score: 10 - index
    }));
  }

  // 排序推荐结果
  rankRecommendations(recommendations) {
    // 去重
    const uniqueMap = new Map();
    recommendations.forEach(rec => {
      if (!uniqueMap.has(rec.filterId) || 
          uniqueMap.get(rec.filterId).score < rec.score) {
        uniqueMap.set(rec.filterId, rec);
      }
    });

    // 按分数排序，返回前3个
    return Array.from(uniqueMap.values())
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
  }

  // 加载用户偏好
  loadUserPreferences() {
    return wx.getStorageSync('user_preferences') || {
      topFilters: [],
      totalUsage: {},
      lastUsed: []
    };
  }

  // 记录滤镜使用
  recordUsage(filterId) {
    const prefs = this.loadUserPreferences();
    
    // 更新使用次数
    prefs.totalUsage[filterId] = (prefs.totalUsage[filterId] || 0) + 1;
    
    // 更新最近使用
    prefs.lastUsed = [filterId, ...prefs.lastUsed.filter(id => id !== filterId)].slice(0, 10);
    
    // 更新Top滤镜
    prefs.topFilters = Object.entries(prefs.totalUsage)
      .sort((a, b) => b[1] - a[1])
      .map(([id]) => id)
      .slice(0, 5);

    wx.setStorageSync('user_preferences', prefs);
  }
}

module.exports = { FilterRecommendEngine };
```

#### 2.2 水印智能布局

```javascript
// engines/watermark/smart-layout.js

class SmartWatermarkLayout {
  constructor() {
    this.safetyMargin = 40;  // 安全边距
  }

  // 智能计算最佳位置
  async calculateBestPosition(imageData, watermarkSize) {
    // 1. 分析图片亮度分布
    const brightnessMap = this.analyzeBrightness(imageData);
    
    // 2. 检测主体位置（简化版）
    const subjectZones = this.detectSubjectZones(brightnessMap);
    
    // 3. 计算候选位置
    const candidates = this.generateCandidates(imageData.width, imageData.height, watermarkSize);
    
    // 4. 评分并选择最佳位置
    const scores = candidates.map(pos => 
      this.scorePlacement(pos, brightnessMap, subjectZones)
    );
    
    const bestIndex = scores.indexOf(Math.max(...scores));
    return candidates[bestIndex];
  }

  // 分析亮度分布（9宫格）
  analyzeBrightness(imageData) {
    const { width, height, data } = imageData;
    const gridSize = 3;
    const cellWidth = Math.floor(width / gridSize);
    const cellHeight = Math.floor(height / gridSize);
    
    const brightnessMap = [];
    
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        let totalBrightness = 0;
        let pixelCount = 0;
        
        const startX = col * cellWidth;
        const startY = row * cellHeight;
        const endX = Math.min((col + 1) * cellWidth, width);
        const endY = Math.min((row + 1) * cellHeight, height);
        
        for (let y = startY; y < endY; y++) {
          for (let x = startX; x < endX; x++) {
            const idx = (y * width + x) * 4;
            const brightness = (data[idx] + data[idx + 1] + data[idx + 2]) / 3;
            totalBrightness += brightness;
            pixelCount++;
          }
        }
        
        brightnessMap.push({
          row, col,
          avgBrightness: totalBrightness / pixelCount
        });
      }
    }
    
    return brightnessMap;
  }

  // 检测主体区域（简化版：基于亮度和对比度）
  detectSubjectZones(brightnessMap) {
    const avgBrightness = brightnessMap.reduce((sum, cell) => 
      sum + cell.avgBrightness, 0) / brightnessMap.length;
    
    // 标记显著区域（亮度与平均值差异大的区域）
    return brightnessMap.filter(cell => 
      Math.abs(cell.avgBrightness - avgBrightness) > 30
    );
  }

  // 生成候选位置（8个角落和边缘中点）
  generateCandidates(imageWidth, imageHeight, watermarkSize) {
    const { width, height } = watermarkSize;
    const margin = this.safetyMargin;
    
    return [
      // 四角
      { x: margin, y: margin, position: 'topLeft' },
      { x: imageWidth - width - margin, y: margin, position: 'topRight' },
      { x: margin, y: imageHeight - height - margin, position: 'bottomLeft' },
      { x: imageWidth - width - margin, y: imageHeight - height - margin, position: 'bottomRight' },
      
      // 四边中点
      { x: (imageWidth - width) / 2, y: margin, position: 'topCenter' },
      { x: (imageWidth - width) / 2, y: imageHeight - height - margin, position: 'bottomCenter' },
      { x: margin, y: (imageHeight - height) / 2, position: 'leftCenter' },
      { x: imageWidth - width - margin, y: (imageHeight - height) / 2, position: 'rightCenter' }
    ];
  }

  // 评分位置（分数越高越好）
  scorePlacement(position, brightnessMap, subjectZones) {
    let score = 100;
    
    // 1. 避开主体区域（-50分）
    if (this.overlapsSubject(position, subjectZones)) {
      score -= 50;
    }
    
    // 2. 选择较暗区域（白色文字更清晰）
    const cellBrightness = this.getCellBrightness(position, brightnessMap);
    score += (255 - cellBrightness) / 5;  // 越暗分数越高
    
    // 3. 角落位置加分
    if (position.position.includes('Corner')) {
      score += 10;
    }
    
    // 4. 避免过于靠近边缘
    if (position.x < 20 || position.y < 20) {
      score -= 20;
    }
    
    return score;
  }

  // 判断是否与主体重叠
  overlapsSubject(position, subjectZones) {
    // 简化判断：基于9宫格位置
    const gridX = Math.floor(position.x / (position.imageWidth / 3));
    const gridY = Math.floor(position.y / (position.imageHeight / 3));
    
    return subjectZones.some(zone => 
      zone.col === gridX && zone.row === gridY
    );
  }

  // 获取位置对应的亮度
  getCellBrightness(position, brightnessMap) {
    const gridX = Math.floor(position.x / (position.imageWidth / 3));
    const gridY = Math.floor(position.y / (position.imageHeight / 3));
    
    const cell = brightnessMap.find(c => c.col === gridX && c.row === gridY);
    return cell ? cell.avgBrightness : 128;
  }
}

module.exports = { SmartWatermarkLayout };
```

### 用户体验优化

#### 2.3 新手引导系统

```javascript
// components/guide-overlay/guide-overlay.js

Component({
  data: {
    currentStep: 0,
    steps: [
      {
        id: 'welcome',
        title: '欢迎使用拾光相机',
        description: '在时光流逝中,捕捉真实瞬间',
        highlightElement: null,
        position: 'center'
      },
      {
        id: 'select_photo',
        title: '选择照片',
        description: '点击这里选择要处理的照片',
        highlightElement: '#selectPhotoBtn',
        position: 'bottom'
      },
      {
        id: 'choose_filter',
        title: '选择滤镜',
        description: '左右滑动选择你喜欢的滤镜',
        highlightElement: '#filterSelector',
        position: 'top'
      },
      {
        id: 'add_watermark',
        title: '添加水印',
        description: '自动添加日期和地点水印',
        highlightElement: '#watermarkPanel',
        position: 'top'
      },
      {
        id: 'save_share',
        title: '保存或分享',
        description: '点击保存到相册，或分享给朋友',
        highlightElement: '#saveBtn',
        position: 'top'
      }
    ],
    showGuide: false
  },

  lifetimes: {
    attached() {
      // 检查是否首次使用
      const hasSeenGuide = wx.getStorageSync('has_seen_guide');
      if (!hasSeenGuide) {
        this.setData({ showGuide: true });
      }
    }
  },

  methods: {
    next() {
      if (this.data.currentStep < this.data.steps.length - 1) {
        this.setData({
          currentStep: this.data.currentStep + 1
        });
      } else {
        this.finish();
      }
    },

    skip() {
      this.finish();
    },

    finish() {
      wx.setStorageSync('has_seen_guide', true);
      this.setData({ showGuide: false });
      this.triggerEvent('complete');
    }
  }
});
```

#### 2.4 智能提示系统

```javascript
// utils/smart-tips.js

class SmartTipsManager {
  constructor() {
    this.tips = {
      'long_press_compare': {
        trigger: 'filter_selected',
        condition: (context) => context.filterSelectCount === 1,
        message: '长按滤镜可查看原图对比',
        showOnce: true
      },
      'double_tap_apply': {
        trigger: 'filter_selected',
        condition: (context) => context.filterSelectCount === 3,
        message: '双击滤镜可快速应用',
        showOnce: true
      },
      'slide_compare': {
        trigger: 'preview_viewed',
        condition: (context) => context.previewViewCount === 1,
        message: '左右滑动可对比滤镜效果',
        showOnce: true
      },
      'favorite_filter': {
        trigger: 'filter_used',
        condition: (context) => context.sameFilterUsed >= 5,
        message: '长按滤镜可添加到收藏',
        showOnce: true
      },
      'professional_mode': {
        trigger: 'filter_adjusted',
        condition: (context) => context.intensityAdjusted >= 10,
        message: '点击"专业模式"可精细调节参数',
        showOnce: true
      }
    };

    this.context = this.loadContext();
    this.shownTips = wx.getStorageSync('shown_tips') || [];
  }

  // 检查并显示提示
  checkAndShow(trigger, additionalContext = {}) {
    const updatedContext = { ...this.context, ...additionalContext };
    this.context = updatedContext;
    this.saveContext();

    for (const [tipId, tip] of Object.entries(this.tips)) {
      if (tip.trigger === trigger &&
          tip.condition(updatedContext) &&
          (!tip.showOnce || !this.shownTips.includes(tipId))) {
        
        this.showTip(tipId, tip.message);
        
        if (tip.showOnce) {
          this.shownTips.push(tipId);
          wx.setStorageSync('shown_tips', this.shownTips);
        }
        
        break;  // 一次只显示一个提示
      }
    }
  }

  // 显示提示
  showTip(tipId, message) {
    wx.showToast({
      title: message,
      icon: 'none',
      duration: 3000
    });
  }

  // 加载上下文
  loadContext() {
    return wx.getStorageSync('tips_context') || {
      filterSelectCount: 0,
      previewViewCount: 0,
      sameFilterUsed: 0,
      intensityAdjusted: 0
    };
  }

  // 保存上下文
  saveContext() {
    wx.setStorageSync('tips_context', this.context);
  }

  // 重置引导（用于设置中）
  reset() {
    wx.removeStorageSync('shown_tips');
    wx.removeStorageSync('tips_context');
    this.shownTips = [];
    this.context = this.loadContext();
  }
}

module.exports = { SmartTipsManager };
```

#### 2.5 数据统计系统

```javascript
// utils/statistics.js

class StatisticsManager {
  constructor() {
    this.stats = this.loadStats();
  }

  // 记录滤镜使用
  recordFilterUsage(filterId) {
    const date = new Date().toISOString().split('T')[0];
    
    if (!this.stats.filters[filterId]) {
      this.stats.filters[filterId] = {
        totalCount: 0,
        firstUsed: date,
        lastUsed: date,
        dailyUsage: {}
      };
    }

    const filterStats = this.stats.filters[filterId];
    filterStats.totalCount++;
    filterStats.lastUsed = date;
    filterStats.dailyUsage[date] = (filterStats.dailyUsage[date] || 0) + 1;

    this.saveStats();
  }

  // 记录水印使用
  recordWatermarkUsage(templateId) {
    if (!this.stats.watermarks[templateId]) {
      this.stats.watermarks[templateId] = {
        totalCount: 0,
        firstUsed: new Date().toISOString(),
        lastUsed: new Date().toISOString()
      };
    }

    this.stats.watermarks[templateId].totalCount++;
    this.stats.watermarks[templateId].lastUsed = new Date().toISOString();

    this.saveStats();
  }

  // 记录处理照片
  recordPhotoProcessed(location = null) {
    const date = new Date().toISOString().split('T')[0];
    
    this.stats.photos.total++;
    this.stats.photos.daily[date] = (this.stats.photos.daily[date] || 0) + 1;

    if (location) {
      const city = location.split('·')[0];
      this.stats.locations[city] = (this.stats.locations[city] || 0) + 1;
    }

    this.saveStats();
  }

  // 获取Top滤镜
  getTopFilters(limit = 5) {
    return Object.entries(this.stats.filters)
      .sort((a, b) => b[1].totalCount - a[1].totalCount)
      .slice(0, limit)
      .map(([id, data]) => ({
        id,
        count: data.totalCount,
        lastUsed: data.lastUsed
      }));
  }

  // 获取风格偏好分析
  getStylePreference() {
    const { FILTER_CATEGORIES } = require('../config/filter-categories.js');
    const styleCount = {};

    Object.entries(this.stats.filters).forEach(([filterId, data]) => {
      // 找到滤镜所属风格
      for (const [styleId, style] of Object.entries(FILTER_CATEGORIES.style)) {
        if (style.filters.includes(filterId)) {
          styleCount[styleId] = (styleCount[styleId] || 0) + data.totalCount;
        }
      }
    });

    const total = Object.values(styleCount).reduce((sum, count) => sum + count, 0);
    
    return Object.entries(styleCount)
      .map(([style, count]) => ({
        style,
        count,
        percentage: Math.round((count / total) * 100)
      }))
      .sort((a, b) => b.count - a.count);
  }

  // 获取拍摄足迹
  getLocationStats() {
    return Object.entries(this.stats.locations)
      .sort((a, b) => b[1] - a[1])
      .map(([city, count]) => ({ city, count }));
  }

  // 获取月度趋势
  getMonthlyTrend(year, month) {
    const prefix = `${year}-${String(month).padStart(2, '0')}`;
    const dailyData = Object.entries(this.stats.photos.daily)
      .filter(([date]) => date.startsWith(prefix))
      .map(([date, count]) => ({
        date: date.split('-')[2],
        count
      }));

    return dailyData;
  }

  // 加载统计数据
  loadStats() {
    return wx.getStorageSync('statistics') || {
      filters: {},
      watermarks: {},
      photos: {
        total: 0,
        daily: {}
      },
      locations: {},
      createdAt: new Date().toISOString()
    };
  }

  // 保存统计数据
  saveStats() {
    wx.setStorageSync('statistics', this.stats);
  }

  // 生成年度报告数据
  generateYearlyReport(year) {
    const yearPrefix = String(year);
    
    // 筛选当年数据
    const yearlyPhotos = Object.entries(this.stats.photos.daily)
      .filter(([date]) => date.startsWith(yearPrefix))
      .reduce((sum, [, count]) => sum + count, 0);

    return {
      year,
      totalPhotos: yearlyPhotos,
      topFilter: this.getTopFilters(1)[0],
      topFilters: this.getTopFilters(5),
      stylePreference: this.getStylePreference(),
      locationStats: this.getLocationStats(),
      monthlyTrend: this.getMonthlyTrendForYear(year)
    };
  }

  getMonthlyTrendForYear(year) {
    const months = [];
    for (let month = 1; month <= 12; month++) {
      const prefix = `${year}-${String(month).padStart(2, '0')}`;
      const count = Object.entries(this.stats.photos.daily)
        .filter(([date]) => date.startsWith(prefix))
        .reduce((sum, [, c]) => sum + c, 0);
      
      months.push({ month, count });
    }
    return months;
  }
}

module.exports = { StatisticsManager };
```

---

## 🎬 V2.0 版本（+8周）

### 高级功能

#### 3.1 滤镜故事系统

```javascript
// config/filter-stories.js

const FILTER_STORIES = {
  'film_superia': {
    title: '富士Superia 400',
    story: `这是富士最经典的彩色负片之一，以温暖的色调和细腻的颗粒著称。

在胶片时代，Superia 400是日本家庭最常用的胶卷，它记录了无数平凡而温暖的日常时刻。

适合记录生活的温柔瞬间。`,
    scenes: ['人像', '日常', '旅行'],
    characteristics: ['温暖', '细腻', '怀旧'],
    referencePhotos: [
      'https://example.com/superia_1.jpg',
      'https://example.com/superia_2.jpg'
    ],
    tips: '在自然光下效果最佳，适合拍摄人物和生活场景'
  },

  'portra_400': {
    title: '柯达Portra 400',
    story: `柯达Portra 400是专业人像摄影师的首选胶卷。

它拥有细腻的肤色还原和柔和的色彩过渡，能够完美呈现人物的自然美。

被誉为"胶片人像之王"。`,
    scenes: ['人像', '婚礼', '时尚'],
    characteristics: ['柔和', '肤色准确', '专业'],
    referencePhotos: [],
    tips: '特别适合拍摄人像，肤色还原非常自然'
  },

  // ... 其他滤镜故事
};

module.exports = { FILTER_STORIES };
```

```javascript
// pages/filter-detail/filter-detail.js

Page({
  data: {
    filter: null,
    story: null,
    referencePhotos: []
  },

  onLoad(options) {
    const { filterId } = options;
    const { FILTER_PRESETS } = require('../../engines/filter/presets.js');
    const { FILTER_STORIES } = require('../../config/filter-stories.js');

    this.setData({
      filter: FILTER_PRESETS.find(f => f.id === filterId),
      story: FILTER_STORIES[filterId]
    });
  },

  // 查看参考作品
  viewReferencePhoto(e) {
    const { index } = e.currentTarget.dataset;
    wx.previewImage({
      current: index,
      urls: this.data.story.referencePhotos
    });
  },

  // 立即使用此滤镜
  useThisFilter() {
    const app = getApp();
    app.globalData.selectedFilter = this.data.filter.id;
    wx.navigateBack();
  }
});
```

#### 3.2 每日推荐滤镜

```javascript
// components/daily-recommend/daily-recommend.js

Component({
  data: {
    todayFilter: null,
    quote: '',
    showRecommend: true
  },

  lifetimes: {
    attached() {
      this.loadDailyRecommend();
    }
  },

  methods: {
    loadDailyRecommend() {
      const today = new Date().toISOString().split('T')[0];
      const cached = wx.getStorageSync('daily_recommend');

      if (cached && cached.date === today) {
        this.setData(cached.data);
        return;
      }

      // 生成今日推荐
      const filter = this.generateDailyFilter();
      const quote = this.generateQuote(filter);

      const data = {
        todayFilter: filter,
        quote: quote
      };

      this.setData(data);
      wx.setStorageSync('daily_recommend', { date: today, data });
    },

    generateDailyFilter() {
      const { FILTER_PRESETS } = require('../../engines/filter/presets.js');
      const day = new Date().getDay();
      const hour = new Date().getHours();
      
      // 根据星期和时间推荐
      const weekdayFilters = {
        0: 'soft_dream',       // 周日：柔梦
        1: 'nature_vivid',     // 周一：自然鲜活
        2: 'urban_street',     // 周二：城市街拍
        3: 'cinematic',        // 周三：电影感
        4: 'warm_nostalgia',   // 周四：暖调怀旧
        5: 'film_superia',     // 周五：胶片记忆
        6: 'portra_400'        // 周六：柔光人像
      };

      // 根据节气调整
      const solarTerm = this.getCurrentSolarTerm();
      if (solarTerm === '谷雨') {
        return FILTER_PRESETS.find(f => f.id === 'rainy_mood');
      }

      const filterId = weekdayFilters[day];
      return FILTER_PRESETS.find(f => f.id === filterId);
    },

    generateQuote(filter) {
      const quotes = {
        'soft_dream': '在柔光里，每个梦都变得真实',
        'nature_vivid': '新的一周，用鲜活的色彩迎接每一天',
        'urban_street': '街头巷尾，都是生活的诗',
        'cinematic': '给平凡的日子，加一点电影感',
        'warm_nostalgia': '回忆总是温暖的',
        'film_superia': '周末将至，用胶片记录温柔时光',
        'portra_400': '周末的好心情，值得好好记录'
      };

      return quotes[filter.id] || '在时光流逝中，捕捉真实瞬间';
    },

    getCurrentSolarTerm() {
      const Lunar = require('../../libs/lunar.js');
      const lunar = Lunar.fromDate(new Date());
      const term = lunar.getCurrentJieQi();
      return term ? term.getName() : '';
    },

    useTodayFilter() {
      this.triggerEvent('select', {
        filterId: this.data.todayFilter.id
      });
    },

    dismiss() {
      this.setData({ showRecommend: false });
    }
  }
});
```

#### 3.3 年度报告生成

```javascript
// pages/yearly-report/yearly-report.js

const { StatisticsManager } = require('../../utils/statistics.js');

Page({
  data: {
    year: 2026,
    report: null,
    currentSection: 0,
    sections: []
  },

  onLoad() {
    const year = new Date().getFullYear();
    this.setData({ year });
    this.generateReport(year);
  },

  generateReport(year) {
    const statsManager = new StatisticsManager();
    const reportData = statsManager.generateYearlyReport(year);

    const sections = [
      {
        type: 'cover',
        title: `拾光年鉴 ${year}`,
        subtitle: '你的影像数据'
      },
      {
        type: 'summary',
        data: {
          totalPhotos: reportData.totalPhotos,
          topFilter: reportData.topFilter,
          cities: reportData.locationStats.length,
          days: Object.keys(statsManager.stats.photos.daily).length
        }
      },
      {
        type: 'filter_preference',
        title: '你的滤镜画像',
        data: {
          topFilters: reportData.topFilters,
          stylePreference: reportData.stylePreference
        }
      },
      {
        type: 'location_map',
        title: '你的足迹地图',
        data: {
          locations: reportData.locationStats
        }
      },
      {
        type: 'monthly_trend',
        title: '全年记录',
        data: {
          trend: reportData.monthlyTrend
        }
      },
      {
        type: 'photos_gallery',
        title: '年度精选',
        data: {
          photos: this.selectBestPhotos(year)
        }
      },
      {
        type: 'ending',
        title: '继续记录',
        message: `${year + 1}年，继续拾取时光`
      }
    ];

    this.setData({
      report: reportData,
      sections: sections
    });
  },

  selectBestPhotos(year) {
    // 从本地相册中筛选使用拾光相机处理过的照片
    // 按使用滤镜的多样性和时间分布选择12张代表照片
    // 简化版：返回空数组，实际需要访问相册
    return [];
  },

  nextSection() {
    if (this.data.currentSection < this.data.sections.length - 1) {
      this.setData({
        currentSection: this.data.currentSection + 1
      });
    }
  },

  prevSection() {
    if (this.data.currentSection > 0) {
      this.setData({
        currentSection: this.data.currentSection - 1
      });
    }
  },

  // 分享年度报告
  shareReport() {
    // 生成年度报告长图
    this.generateReportImage().then(imagePath => {
      wx.navigateTo({
        url: `/pages/share/share?imagePath=${encodeURIComponent(imagePath)}&type=yearly_report`
      });
    });
  },

  async generateReportImage() {
    // 使用Canvas绘制年度报告长图
    // 包含所有sections的内容
    // 返回临时文件路径
    return '/temp/yearly_report.png';
  }
});
```

---

## ✅ 完整开发检查清单

### MVP（2周）
- [ ] 5个基础水印模板
- [ ] 15个精品滤镜
- [ ] 100种文案+编辑+自定义
- [ ] 批量处理（9张限制+防闪退）
- [ ] 社交分享

### V1.1（+2周）
- [ ] 滤镜三级分类
- [ ] 4种对比模式
- [ ] 专业模式（11个参数）
- [ ] 15个水印模板（3类）
- [ ] 动态元素扩展（环境/特殊）

### V1.2（+4周）
- [ ] 滤镜智能推荐（4种维度）
- [ ] 水印智能布局
- [ ] 新手引导系统
- [ ] 智能提示系统
- [ ] 数据统计功能

### V2.0（+8周）
- [ ] 滤镜故事页面
- [ ] 每日推荐滤镜
- [ ] 年度报告生成
- [ ] 数据可视化

---

**这份完整开发指令包含所有版本迭代，可直接交给Claude Code逐步开发！** 🚀
