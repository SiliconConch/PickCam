<div align="center">

<br/>

```
  ◎  拾光相机
     PickCam
```

**用光影，讲述属于你的故事**

*A cinematic WeChat Miniprogram for capturing life's quiet moments*

<br/>

![Platform](https://img.shields.io/badge/platform-微信小程序-07C160?style=flat-square&logo=wechat&logoColor=white)
![Version](https://img.shields.io/badge/version-1.2.0-FF2D55?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)
![WeChat DevTools](https://img.shields.io/badge/微信开发者工具-1.06+-green?style=flat-square)
![Style](https://img.shields.io/badge/theme-Dark%20Only-000000?style=flat-square)

<br/>

</div>

---

## 目录

- [项目简介](#-项目简介)
- [功能特性](#-功能特性)
- [界面预览](#-界面预览)
- [技术架构](#-技术架构)
- [项目结构](#-项目结构)
- [设计系统](#-设计系统)
- [快速开始](#-快速开始)
- [页面说明](#-页面说明)
- [核心引擎](#-核心引擎)
- [配置说明](#-配置说明)
- [开发规范](#-开发规范)
- [路线图](#-路线图)
- [许可证](#-许可证)

---

## 📖 项目简介

**拾光相机（PickCam）** 是一款面向内容创作者的微信小程序相机应用。它将专业摄影工具的能力浓缩进微信生态，让每一位普通用户都能拍出具有电影感的照片——从全沉浸式取景、实时滤镜预览，到精美水印叠加与一键分享，形成完整的创作闭环。

**设计理念**：不是功能的堆砌，而是体验的克制。以纯黑底色搭配品牌红 `#FF2D55`，构建沉浸、专业、有温度的暗色创作环境。

**技术特点**：
- 基于微信小程序 Canvas 2D API 实现滤镜渲染与水印合成，无服务端依赖
- 全流程纯客户端处理，照片不上传任何服务器，保护用户隐私
- 支持批量处理最多 9 张照片，内存管理稳健，适配主流机型

---

## ✨ 功能特性

### 📷 相机取景
| 功能 | 说明 |
|------|------|
| 全屏沉浸式取景 | 无边框全屏取景，支持沉浸/经典两种布局切换 |
| 实时滤镜条 | 8 款代表性滤镜横向滚动预览，拍前即所见 |
| 专业参数 HUD | ISO / EV / F 值 / 白平衡实时显示，点击查看参数说明 |
| 闪光灯控制 | 关 / 开 / AUTO 三档循环切换，状态标签实时反馈 |
| 自定义倒计时 | 1–15 秒滑杆自由设定，倒计时期间大字动画提示 |
| 录像模式 | 长按快门开始录像，REC 红点 + 时长 HUD 实时显示 |
| 翻转摄像头 | 前后摄像头一键切换 |
| 相册导入 | 支持从相册最多选取 9 张照片直接进入编辑 |

### 🎞 滤镜系统
15 款精品滤镜，覆盖主流摄影风格：

| 分类 | 滤镜名 |
|------|--------|
| 人像 | 原片、真实还原、柔光人像 |
| 胶片 | 胶片记忆、温暖怀旧 |
| 电影 | 电影感、黑金都市、暗夜情绪 |
| 街头 | 黑白叙事、酷冷清新 |
| 自然 | 清晨微光、碧波清透、日落余晖 |
| 创意 | 莫兰迪、淡雅少女 |

- **强度调节**：每款滤镜支持 0–100% 强度滑杆微调
- **对比模式**：左右拖拽分割线，实时对比原图与滤镜效果
- **专业调色**：亮度、对比度、饱和度、色温、色调、自然饱和度、清晰度、高光、阴影、暗角、颗粒感、褪色 12 个参数独立调节
- **自定义滤镜**：专业参数调整满意后可保存为自定义滤镜
- **滤镜分类**：全部 / 人像 / 胶片 / 街头 / 自然 / 电影 / 收藏夹

### 🏷 水印系统
15 套精品水印模板，三大风格分类：

| 风格 | 说明 |
|------|------|
| 极简（5款） | 经典、时光轴、山峰、洋流、方块 |
| 装饰（5款） | 胶片格、宝丽来、画廊、档案、徽章 |
| 文艺（5款） | 诗意、旅途、物语、心情、章节 |

- **水印元素**：日期、地点、设备型号、自定义文字、Emoji、时光语、分隔符
- **智能选位**：自动分析图片四角亮度，选择对比度最高的角落放置水印
- **九宫格定位**：9 个预设位置点选，配合像素级偏移
- **字号 & 透明度**：实时滑杆调节，即时预览
- **位置刷新**：一键重新获取当前 GPS 位置更新水印地名

### 💬 时光语 & 表情
- 20 句精选文案，覆盖情感、旅行、日常等主题
- 每日固定一句「每日金句」
- 8 大 Emoji 分类（地点 / 时间 / 天气 / 自然 / 情感 / 摄影 / 旅行 / 生活），每类 12 个

### 💾 保存与分享
- **保存当前**：处理当前展示的照片并保存至相册
- **批量保存**：一次性处理全部照片，智能选位模式下逐张分析最优水印位置
- **分享页**：生成最终成品，支持保存相册、发给朋友、分享朋友圈
- **原图保留**：可设置同时保存未经处理的原图

### 👤 个人中心 & 设置
- 统计数据：作品数 / 滤镜使用次数 / 水印使用次数
- 偏好设置：默认滤镜、默认水印模板、默认位置、默认透明度
- 应用设置：自动位置、自动时间戳、触觉反馈、声音反馈、同时保存原图

---

## 🖼 界面预览

```
┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────────┐
│  ⊙  ISO EV  F  WB   │  │   编辑              完成│  │      分享           │
│                     │  │  ┌───────────────┐   │  │  ┌───────────────┐  │
│  ┌─────────────┐    │  │  │               │   │  │  │               │  │
│  │             │    │  │  │   Canvas       │   │  │  │  成品预览      │  │
│  │   Camera    │    │  │  │   预览区        │   │  │  │              │  │
│  │   取景器     │    │  │  │               │   │  │  │              │  │
│  │             │    │  │  └───────────────┘   │  │  └───────────────┘  │
│  └─────────────┘    │  │  [滤镜][水印][时光语][表情]│  │  长按图片可保存或分享  │  │
│  ⚙️  ⚡  ⏲️          │  │  ════ 滤镜面板 ════   │  │  ┌──┐ ┌──┐ ┌──┐  │
│  ○ 原片 ◎ 胶片 ● 黑白 │  │  当前滤镜  100%      │  │  │💾│ │💬│ │🏠│  │
│  ┌──┐  ◉  ┌──┐      │  │  ▓▓▓▓▓▓▓▓░░░░░░    │  │  └──┘ └──┘ └──┘  │
│  │🌄│ ███ │👤│      │  │  [原片][人像][电影]...   │  │                     │
└─────────────────────┘  └─────────────────────┘  └─────────────────────┘
       相机页                    编辑页                    分享页
```

---

## 🏗 技术架构

```
┌──────────────────────────────────────────────────────────────┐
│                    微信小程序运行时                             │
├──────────────┬───────────────────────────┬───────────────────┤
│   Pages 页面层 │     Components 组件层      │   Engines 引擎层   │
│              │                           │                   │
│  splash      │  caption-editor           │  filter/          │
│  camera  ────┼──  emoji-picker       ────┼──  renderer.js    │
│  edit    ────┼──  filter-selector        │    presets.js     │
│  share       │                           │    advanced.js    │
│  profile     │                           │                   │
│  settings    │                           │  watermark/       │
│  about       │                           │    renderer.js    │
│  guide       │                           │    config.js      │
│  auth        │                           │                   │
│  index       │                           │                   │
├──────────────┴───────────────────────────┴───────────────────┤
│                      Config & Utils 层                        │
│  app.config.js  filter-categories.js  watermark-templates.js │
│  captions.js  |  common.js  exif.js  geocoding.js  storage.js│
├──────────────────────────────────────────────────────────────┤
│                   微信小程序原生 API 层                         │
│  wx.createCameraContext  wx.createOffscreenCanvas            │
│  wx.getLocation  wx.saveImageToPhotosAlbum  wx.chooseMedia   │
└──────────────────────────────────────────────────────────────┘
```

### 数据流

```
拍照/选图
    │
    ▼
globalData.selectedPhotos
    │
    ▼
edit.js (onLoad)
    ├── FilterRenderer.getPresets()       → 滤镜列表
    ├── WatermarkConfig.getTemplateById() → 水印配置
    ├── ExifReader.getInfo()              → EXIF 元数据
    └── GeoManager.getCurrentLocation()  → GPS 地址
             │
             ▼
    _drawPreviewToCanvas()
    ├── ctx.drawImage()                   → 绘制原图
    ├── FilterRenderer.applyFilter()      → 像素级滤镜
    └── _drawWatermarkOnCanvas()          → 水印合成
             │
             ▼
    _processPhotoFull()                   → 保存/分享输出
```

---

## 📁 项目结构

```
PickCam/
├── miniprogram/                    # 小程序主体
│   ├── app.js                      # 全局入口 & globalData
│   ├── app.json                    # 页面注册 & 权限声明
│   ├── app.wxss                    # Swancam 全局设计系统
│   │
│   ├── pages/                      # 页面
│   │   ├── splash/                 # 启动页（CSS 镜头动画）
│   │   ├── guide/                  # 引导页（Swiper 4屏）
│   │   ├── auth/                   # 授权/设置个人形象
│   │   ├── index/                  # 首页入口（拍照/选图）
│   │   ├── camera/                 # 相机取景器（核心页）
│   │   ├── edit/                   # 编辑页（滤镜+水印）
│   │   ├── share/                  # 分享页（成品展示）
│   │   ├── profile/                # 个人中心
│   │   ├── settings/               # 应用设置
│   │   └── about/                  # 关于页
│   │
│   ├── components/                 # 可复用组件
│   │   ├── caption-editor/         # 时光语选择器
│   │   ├── emoji-picker/           # Emoji 选择器
│   │   └── filter-selector/        # 滤镜分类选择器
│   │
│   ├── engines/                    # 核心处理引擎
│   │   ├── filter/
│   │   │   ├── renderer.js         # Canvas 滤镜渲染器
│   │   │   ├── presets.js          # 15款滤镜参数预设
│   │   │   └── advanced.js         # 专业模式 12参数
│   │   └── watermark/
│   │       ├── renderer.js         # 水印合成渲染器
│   │       └── config.js           # 水印配置管理
│   │
│   ├── config/                     # 全局配置
│   │   ├── app.config.js           # 应用常量
│   │   ├── captions.js             # 20句时光语文案
│   │   ├── filter-categories.js    # 滤镜分类映射
│   │   └── watermark-templates.js  # 15套水印模板定义
│   │
│   └── utils/                      # 工具函数
│       ├── common.js               # 通用工具（压缩/保存/提示）
│       ├── exif.js                 # EXIF 元数据读取
│       ├── geocoding.js            # GPS 逆地理编码
│       ├── statistics.js           # 使用统计记录
│       └── storage.js              # 最近使用持久化
│
├── docs/                           # 产品文档
│   ├── 拾光相机 - 产品需求文档 v3.0.md
│   ├── 拾光相机 - 竞品分析文档 v3.0.md
│   ├── 拾光相机 完整产品需求文档 V4.0.md
│   └── ...
│
├── .claude/
│   └── launch.json                 # 微信开发者工具启动配置
├── .gitignore
└── README.md
```

---

## 🎨 设计系统

拾光相机使用内部设计令牌系统 **Swancam**，所有视觉决策均通过 CSS 变量统一管理，定义于 `app.wxss`。

### 色彩系统

| 变量名 | 值 | 用途 |
|--------|-----|------|
| `--swancam-primary` | `#FF2D55` | 品牌色、激活态、主要按钮 |
| `--swancam-primary-light` | `rgba(255,45,85,0.15)` | 激活态背景、高亮底色 |
| `--swancam-accent` | `#E67E22` | 次级强调色 |
| `--swancam-bg` | `#000000` | 页面背景 |
| `--swancam-surface` | `#1C1C1E` | 卡片、面板背景 |
| `--swancam-surface-2` | `#2C2C2E` | 次级表面 |
| `--swancam-border` | `rgba(255,255,255,0.12)` | 边框、分割线 |
| `--swancam-text-primary` | `#FFFFFF` | 主要文字 |
| `--swancam-text-secondary` | `rgba(255,255,255,0.6)` | 次要文字 |
| `--swancam-text-tertiary` | `rgba(255,255,255,0.3)` | 辅助文字、占位符 |

> ⚠️ **设计约束**：全局强制暗色主题，禁止引入任何浅色元素。金色 `#D4A574` 仅用于 Splash / Guide / Auth 三个引导页（品牌暖调）；其余所有页面激活色统一使用品牌红。

### 字体系统

| 变量名 | 值 | 用途 |
|--------|-----|------|
| `--font-size-h1` | `40rpx` | 页面大标题 |
| `--font-size-h2` | `32rpx` | 区块标题 |
| `--font-size-body` | `28rpx` | 正文 |
| `--font-size-caption` | `24rpx` | 辅助说明 |
| `--font-size-tiny` | `20rpx` | 标签、徽章 |
| `--font-weight-bold` | `600` | 加粗 |
| `--font-weight-med` | `500` | 中等 |

### 间距系统（8rpx 网格）

```
--space-1: 8rpx   --space-2: 16rpx  --space-3: 24rpx
--space-4: 32rpx  --space-6: 48rpx  --space-8: 64rpx
```

### 圆角系统

```
--radius-sm: 8rpx    --radius-md: 16rpx
--radius-lg: 32rpx   --radius-full: 999rpx
```

### 动效系统

```
--ease-out-expo: cubic-bezier(0.19, 1, 0.22, 1)   /* 弹性缓出 */
--duration-fast: 0.2s                               /* 快速反馈 */
--duration-std:  0.35s                              /* 标准过渡 */
```

### 全局工具类

| 类名 | 说明 |
|------|------|
| `.glass-panel` | 毛玻璃面板（`backdrop-filter: blur(20px)` + 半透明边框） |
| `.safe-bottom` | 适配 Home Indicator（`env(safe-area-inset-bottom) + 24rpx`） |
| `.swancam-btn-ripple` | 按压回弹效果（`scale(0.94)` + `opacity(0.85)`） |
| `.ripple-btn` | 同上，用于普通 view 按钮 |

---

## 🚀 快速开始

### 前置条件

- [微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html) ≥ 1.06
- 微信小程序开发者账号（[申请地址](https://mp.weixin.qq.com/)）

### 克隆与导入

```bash
# 1. 克隆仓库
git clone https://github.com/SiliconConch/PickCam.git
cd PickCam

# 2. 在微信开发者工具中导入项目
#    项目目录选择：PickCam/miniprogram
#    AppID：填入你自己的小程序 AppID（或选择"测试号"）
```

### 启动项目

**方式一：微信开发者工具 GUI**
1. 打开微信开发者工具
2. 点击「导入项目」
3. 目录选择 `PickCam/miniprogram`
4. 填入 AppID，点击「导入」

**方式二：命令行（需开启 CLI/HTTP 服务）**

```bash
# 在微信开发者工具 → 设置 → 安全设置 → 开启「服务端口」后执行：

# 打开项目（IDE）
"C:\Program Files (x86)\Tencent\微信web开发者工具\cli.bat" open \
  --project "C:\Claude\PickCam\miniprogram" \
  --port 9420

# 自动预览（生成二维码，手机扫码预览）
"C:\Program Files (x86)\Tencent\微信web开发者工具\cli.bat" auto-preview \
  --project "C:\Claude\PickCam\miniprogram" \
  --port 9420
```

> 以上两个配置已保存至 `.claude/launch.json`，可通过 Claude Code 一键启动。

### 权限配置

首次在真机预览时，小程序会请求以下权限，需用户手动授权：

| 权限 | 用途 |
|------|------|
| `scope.camera` | 相机取景与拍摄 |
| `scope.userLocation` | 获取 GPS 位置用于水印地名 |
| `scope.writePhotosAlbum` | 保存处理后的照片到相册 |

---

## 📱 页面说明

### 用户流程

```
首次启动                    日常使用
    │                           │
    ▼                           ▼
[splash]                    [splash]
    │                           │
    ▼                           ▼
[guide]                     [camera] ←────────────────┐
    │                           │                      │
    ▼                           ├─── 拍照/选图 ──► [edit] ──► [share]
[auth]                          │                      │
    │                           ├─── 个人中心 ──► [profile]  │
    ▼                           │                             │
[camera]                        └─── 设置/关于               │
                                                     [goHome]─┘
```

### 各页面职责

| 页面 | 路径 | 核心职责 |
|------|------|----------|
| `splash` | `pages/splash` | 开屏动画（CSS 镜头光圈 + 品牌文字入场） |
| `guide` | `pages/guide` | 4屏功能引导（Swiper + 插画动效） |
| `auth` | `pages/auth` | 设置昵称/头像，写入 `pickcam_user_profile` |
| `index` | `pages/index` | 首页（快速入口：拍照 / 选择照片） |
| `camera` | `pages/camera` | 相机主页（取景、滤镜条、HUD、拍照/录像） |
| `edit` | `pages/edit` | 编辑页（Canvas 渲染、滤镜、水印、保存） |
| `share` | `pages/share` | 分享页（成品预览、保存相册、发送朋友圈） |
| `profile` | `pages/profile` | 个人中心（统计数据 + 默认偏好设置） |
| `settings` | `pages/settings` | 应用设置（拍摄开关 + 存储 + 交互反馈） |
| `about` | `pages/about` | 关于页（版本信息 + 功能简介 + 反馈入口） |

---

## ⚙️ 核心引擎

### 滤镜引擎 `engines/filter/`

#### `renderer.js` — FilterRenderer
基于 Canvas 2D `getImageData` / `putImageData` 的像素级处理引擎。

```javascript
// 获取所有预设
FilterRenderer.getPresets()  // → FilterPreset[]

// 将滤镜应用到 ImageData（用于实时预览）
FilterRenderer.applyFilter(imageData, params, intensity)

// 将滤镜应用到图片文件（用于最终保存）
await FilterRenderer.applyFilterToImage(filePath, params, intensity)
```

**支持参数**：`brightness` · `contrast` · `saturation` · `temperature` · `tint` · `vibrance` · `sharpen` · `highlights` · `shadows` · `vignetteIntensity` · `grain` · `fade`

#### `advanced.js` — AdvancedFilterEditor
专业模式 12 参数独立调节，支持与预设叠加合并。

```javascript
// 获取默认参数（全 0）
AdvancedFilterEditor.getDefaultParams()

// 合并预设参数与专业调整
AdvancedFilterEditor.mergeParams(presetParams, proParams)

// 检查是否有任何参数被修改
AdvancedFilterEditor.isDirty(proParams)  // → boolean

// 保存为自定义滤镜（持久化到 Storage）
AdvancedFilterEditor.saveAsCustom(name, params)
```

### 水印引擎 `engines/watermark/`

#### `config.js` — WatermarkConfig
水印模板的加载、克隆与参数管理。

```javascript
const mgr = new WatermarkConfig()
mgr.getTemplateById(id)      // 获取模板配置
mgr.cloneConfig(config)      // 深拷贝配置（防止引用污染）
```

#### `renderer.js` — WatermarkRenderer
将水印配置合成到图片文件，输出新的临时文件路径。

```javascript
await WatermarkRenderer.applyWatermark(filePath, wmConfig, photoMeta)
// → 返回合成后的临时文件路径
```

**水印元素类型**：`date` · `location` · `device` · `caption` · `custom` · `emoji` · `separator`

**背景类型**：`none` · `solid` · `gradient` · `rounded-rect`

### 智能水印选位

编辑页内置图像分析算法，自动为每张照片选择对比度最高的角落放置水印：

```javascript
// 缩小到 160×160 采样，检测四角 22% 区域的平均亮度
// 选择亮度最低（背景最暗）的角落
async _detectBestPositionForImage(filePath)  // → 'bottom-left' | 'top-right' | ...
```

---

## 🔧 配置说明

### `config/app.config.js`

```javascript
module.exports = {
  MAX_PHOTOS:     9,      // 批量处理上限
  MAX_IMAGE_SIZE: 2000,   // 超过此像素宽度自动压缩
  BATCH_DELAY:    100,    // 批量处理帧间隔（ms），防内存溢出
  PRO_PRICE:      68,     // Pro 版价格（元）
}
```

### `app.js` globalData

| 字段 | 类型 | 说明 |
|------|------|------|
| `selectedPhotos` | `Array` | 从相机/相册传递给编辑页的照片列表 |
| `captureFilterId` | `String` | 相机页预选的滤镜 ID，传递给编辑页 |
| `shareImagePath` | `String` | 编辑页生成的分享图临时路径 |
| `clearSelection` | `Boolean` | 从分享页返回首页时触发清理标记 |
| `isPro` | `Boolean` | 是否 Pro 版用户 |
| `appSettings` | `Object` | 缓存的用户偏好设置 |

### Storage Keys

| Key | 说明 |
|-----|------|
| `pickcam_user_profile` | 用户昵称 + 头像 |
| `pickcam_settings` | 应用偏好设置 |
| `pickcam_stats` | 使用统计（作品数 / 滤镜次数 / 水印次数） |
| `pickcam_favorites` | 收藏的滤镜 ID 列表 |
| `pickcam_layout_mode` | 相机布局偏好（`immersive` / `classic`） |
| `last_capture_filter` | 上次拍摄使用的滤镜 |

---

## 📐 开发规范

### CSS 变量使用规则

```css
/* ✅ 正确：仅使用 Swancam 令牌 */
color: var(--swancam-text-primary);
background: var(--swancam-primary-light);

/* ❌ 错误：旧令牌，已废弃，在运行时为 undefined */
color: var(--text);
background: var(--primary);
color: var(--white);
```

### 颜色使用规则

```css
/* ✅ 激活色（所有常规页面） */
border-color: var(--swancam-primary);   /* #FF2D55 */

/* ✅ 金色（仅限引导流程三页） */
/* splash.wxss / guide.wxss / auth.wxss 可使用 #D4A574 */

/* ❌ 禁止在编辑/相机/分享等核心页面使用金色 */
border-color: #D4A574;  /* 不可 */
```

### 页面结构规范

每个新增页面须包含：
1. 顶部导航栏，处理 `env(safe-area-inset-top)` 刘海屏适配
2. 底部操作区使用 `.safe-bottom` 处理 Home Indicator
3. 背景色使用 `var(--swancam-bg)`，不使用硬编码 `#000`

### 提交规范

遵循 [Conventional Commits](https://www.conventionalcommits.org/zh-hans/)：

```
feat:     新功能
fix:      Bug 修复
style:    样式调整（不影响逻辑）
refactor: 重构（无新功能/无 Bug 修复）
perf:     性能优化
docs:     文档更新
chore:    构建/工具链变更
```

示例：
```bash
git commit -m "feat: 编辑页新增表情 Tab，打通 Emoji 选择器入口"
git commit -m "fix: 修复对比模式滤镜标签残留金色"
git commit -m "style: 设置页/关于页补全顶部导航栏"
```

---

## 🗺 路线图

### v1.2（当前版本）✅
- [x] 全沉浸式相机取景页
- [x] 15 款精品滤镜 + 强度调节
- [x] 专业调色面板（12 参数）
- [x] 滤镜对比模式（拖拽分割线）
- [x] 15 套水印模板 + 智能选位
- [x] 20 句时光语 + Emoji 选择器
- [x] 批量保存（最多 9 张）
- [x] 个人偏好设置持久化
- [x] Swancam 设计系统全面落地

### v1.3（计划中）
- [ ] 滤镜收藏夹与自定义排序
- [ ] 录像后进入视频编辑页
- [ ] 水印模板自定义编辑
- [ ] 照片直方图显示
- [ ] 相机网格线 / 水平仪

### v2.0（长期规划）
- [ ] RAW 格式导出（需申请特殊权限）
- [ ] HDR 拍摄模式
- [ ] 夜景增强算法
- [ ] 作品社区（需服务端支持）
- [ ] Pro 订阅：去水印 + 专属模板解锁

---

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建特性分支：`git checkout -b feat/your-feature`
3. 提交改动（遵循提交规范）
4. 推送到远程：`git push origin feat/your-feature`
5. 发起 Pull Request，描述改动原因与影响范围

**提 Issue 时请注明**：微信版本、手机型号、复现步骤、预期行为 vs 实际行为。

---

## 📄 许可证

[MIT License](LICENSE) © 2026 [SiliconConch](https://github.com/SiliconConch)

本项目仅供学习与个人使用，不包含任何商业授权的第三方字体或图片资源。

---

<div align="center">

**拾光相机** · 硅基拾贝出品

*捕捉每一个平凡瞬间*

</div>
