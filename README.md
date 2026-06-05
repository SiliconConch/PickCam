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
![Version](https://img.shields.io/badge/version-1.3.0-FF2D55?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)
![WeChat DevTools](https://img.shields.io/badge/微信开发者工具-1.06+-green?style=flat-square)
![Theme](https://img.shields.io/badge/theme-Dark%20%2B%20Fresh-6B8F5E?style=flat-square)

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
- [已知待优化项](#-已知待优化项)
- [许可证](#-许可证)

---

## 📖 项目简介

**拾光相机（PickCam）** 是一款面向内容创作者的微信小程序相机应用。它将专业摄影工具的能力浓缩进微信生态，让每一位普通用户都能拍出具有电影感的照片——从全沉浸式取景、实时滤镜预览，到精美水印叠加与一键分享，形成完整的创作闭环。

**设计理念**：不是功能的堆砌，而是体验的克制。相机页以纯黑底色搭配品牌红 `#FF2D55` 构建专业沉浸感；首页与辅助页面采用暖白清新风格，动静有别，张弛有度。

**技术特点**：
- 基于微信小程序 Canvas 2D API 实现滤镜渲染与水印合成，**无服务端依赖**
- 全流程纯客户端处理，照片**不上传任何服务器**，保护用户隐私
- 支持批量处理最多 9 张照片，内存管理稳健，适配主流机型
- 双主题设计系统：暗色相机环境（Swancam）+ 清新浅色页面（Fresh）

---

## ✨ 功能特性

### 📷 相机取景

| 功能 | 说明 |
|------|------|
| 全屏沉浸式取景 | 无边框全屏取景，支持沉浸 / 经典两种布局切换 |
| 实时滤镜条 | **全部 15 款**滤镜横向滚动，切换时取景器左上角淡入滤镜名 |
| 专业参数 HUD | ISO / EV / F 值 / 白平衡实时显示，点击查看参数说明浮层 |
| 九宫格辅助线 | 构图辅助网格，可通过更多面板随时开关 |
| 水平仪 | DeviceMotion 驱动气泡指示，水平时变绿提示 |
| 画幅比例 | Full / 1:1 / 4:3 / 3:2 / 16:9 五档选择，取景器实时裁剪参考线 |
| 点击对焦 | 点击取景区域显示对焦框动画，调用 `setFocusPoint` API |
| 捏合缩放 | 双指手势驱动 `setZoom` API，变焦比例指示器实时显示 |
| 闪光灯控制 | 关 / 开 / AUTO 三档循环切换，状态标签实时反馈 |
| 自定义倒计时 | 1–15 秒滑杆自由设定，倒计时期间大字动画提示 |
| 录像模式 | 长按快门开始录像，REC 红点 + 时长 HUD 实时显示 |
| 翻转摄像头 | 前后摄像头一键切换 |
| 相册导入 | 支持从相册最多选取 9 张照片直接进入编辑 |
| 快门音效 | 可开关的快门声音反馈（需配置音效文件，见配置说明） |

### 🎞 滤镜系统

15 款精品滤镜，覆盖 7 大风格分类：

| 分类 | 滤镜名 |
|------|--------|
| 人像 | 原片、真实还原、柔光人像、淡雅少女 |
| 胶片 | 胶片记忆、温暖怀旧、复古油画 |
| 电影 | 电影感、黑金都市、暗夜情绪 |
| 街拍 | 黑白叙事、酷冷清新、都市街头 |
| 自然 | 清晨微光、鲜活自然 |

- **强度调节**：每款滤镜支持 0–100% 强度滑杆微调
- **对比模式**：左右拖拽分割线，实时对比原图与滤镜效果
- **分类浏览**：全部 / 人像 / 胶片 / 街拍 / 自然 / 电影 / 收藏夹 共 7 个分类 Tab
- **收藏功能**：点击 ♡ 收藏常用滤镜，收藏夹快速访问
- **专业调色**：12 参数独立调节（亮度 / 对比度 / 饱和度 / 色温 / 色调 / 自然饱和度 / 清晰度 / 高光 / 阴影 / 暗角 / 颗粒感 / 褪色）
- **自定义滤镜**：专业参数调整满意后可命名保存为自定义预设

### 🏷 水印系统

15 套精品水印模板，三大风格分类：

| 风格 | 模板 |
|------|------|
| 极简（5款） | 经典、时光轴、山峰、洋流、方块 |
| 装饰（5款） | 胶片格、宝丽来、画廊、档案、徽章 |
| 文艺（5款） | 诗意、旅途、物语、心情、章节 |

- **分类 Tab**：全部 / 极简 / 装饰 / 文艺，快速筛选风格
- **水印元素**：日期、地点、设备型号、自定义文字、Emoji、时光语、分隔符
- **智能选位**：分析图片四角亮度，自动选对比度最高的角落
- **九宫格定位**：9 个预设位置点选 + 位置文字手动输入
- **字号 & 透明度**：实时滑杆调节，即时预览
- **位置刷新**：一键重新获取 GPS 位置更新水印地名

### ✂️ 编辑工具

- **图片旋转**：每次 +90° 顺时针旋转，实时 Canvas 预览，保存时应用至实际图片
- **水平翻转**：镜像翻转，适合自拍或需要镜像处理的场景
- **变换复位**：一键还原旋转/翻转状态

### 💬 时光语 & 表情

- 20 句精选文案，覆盖情感、旅行、日常等主题
- 每日固定一句「今日推荐」
- 自定义添加 / 编辑 / 删除个人文案
- 8 大 Emoji 分类（地点 / 时间 / 天气 / 自然 / 情感 / 摄影 / 旅行 / 生活），每类 12 个

### 💾 保存与分享

- **保存当前**：处理当前展示的照片并保存至系统相册
- **批量保存**：一次性处理全部照片；智能选位模式下逐张独立分析最优水印位置
- **分享页**：生成最终成品，支持保存相册、发给朋友、分享朋友圈
- **Pro 升级提示**：卡片式设计，非 Pro 用户可见去水印引导

### 🏠 首页（清新主题）

- 暖白背景浅色设计，与相机页暗色形成视觉呼吸感
- 动态打招呼文案（随时段变化：早上好 / 午间 / 晚上好…）
- 统计卡片：作品数 / 滤镜使用次数 / 水印使用次数 / 连续拍摄天数
- 功能特性标签采用 Sage Green 色系，清新自然

### 👤 个人中心 & 设置

- 统计数据：作品数 / 滤镜使用次数 / 水印使用次数
- 偏好设置：默认滤镜、默认水印模板、默认位置、默认透明度
- 应用设置：自动位置、自动时间戳、触觉反馈、声音反馈、同时保存原图
- 意见反馈：一键复制邮箱联系

---

## 🖼 界面预览

```
┌──────────────────────┐  ┌──────────────────────┐  ┌──────────────────────┐
│  早上好    🔥 3天     │  │  ⊙ ISO EV  F  WB     │  │  编辑            完成│
│  5月15日 周四        │  │  [胶片记忆]           │  │ ↻旋转 ⇔翻转          │
│ ┌──────────────────┐ │  │  ┌────────────────┐  │  │ [滤镜][水印][时光语][表情]│
│ │ 12  4  8  3     │ │  │  │                │  │  │ ─── 滤镜面板 ───    │
│ │作品 滤镜 水印 连续│ │  │  │  Camera        │  │  │ 全部 人像 胶片 电影  │
│ └──────────────────┘ │  │  │  取景器        │  │  │ [原片♡][人像♡][胶片♡]│
│ ┌──────────────────┐ │  │  │                │  │  │ ─────────────────  │
│ │  ◎  开始拍摄     │ │  │  └────────────────┘  │  │ ┌────────────────┐ │
│ │  实时取景·滤镜   │ │  │  ⊞  ⚡  ⏲️           │  │ │  Canvas 预览   │ │
│ └──────────────────┘ │  │  ○原 ◎胶 ●黑 ✨柔... │  │ └────────────────┘ │
│ ┌──────────────────┐ │  │  ┌──┐   ◉   ┌──┐   │  │ ┌────┐  ┌────────┐ │
│ │ ⊞  从相册选图    │ │  │  │🌄│  ███  │👤│   │  │ │保存│  │保存全部│ │
│ └──────────────────┘ │  │  └──┘       └──┘   │  │ └────┘  └────────┘ │
│ ·滤镜 ·水印 ·时光语  │  │                      │  │                      │
└──────────────────────┘  └──────────────────────┘  └──────────────────────┘
     首页（清新浅色）            相机页（暗色沉浸）           编辑页（暗色专业）
```

---

## 🏗 技术架构

```
┌──────────────────────────────────────────────────────────────────┐
│                       微信小程序运行时                              │
├───────────────┬────────────────────────────┬─────────────────────┤
│  Pages 页面层  │      Components 组件层      │    Engines 引擎层    │
│               │                            │                     │
│  splash       │  caption-editor            │  filter/            │
│  camera  ─────┼──  emoji-picker        ────┼──  renderer.js      │
│  edit    ─────┼──  filter-selector*        │    presets.js       │
│  share        │                            │    advanced.js      │
│  profile      │                            │                     │
│  settings     │                            │  watermark/         │
│  about        │                            │    renderer.js      │
│  guide        │                            │    config.js        │
│  auth         │                            │                     │
│  index        │                            │                     │
├───────────────┴────────────────────────────┴─────────────────────┤
│                       Config & Utils 层                            │
│  app.config.js  filter-categories.js  watermark-templates.js     │
│  captions.js  ·  common.js  exif.js  geocoding.js  statistics.js │
├──────────────────────────────────────────────────────────────────┤
│                    微信小程序原生 API 层                             │
│  wx.createCameraContext  ·  wx.createOffscreenCanvas             │
│  wx.getLocation  ·  wx.saveImageToPhotosAlbum  ·  wx.chooseMedia │
│  wx.onDeviceMotionChange  ·  CameraContext.setFocusPoint/setZoom  │
└──────────────────────────────────────────────────────────────────┘
```

> `*` filter-selector 组件已定义但当前版本 edit 页自行实现滤镜 UI，该组件暂为保留备用

### 数据流

```
拍照 / 选图
    │
    ▼
globalData.selectedPhotos
    │
    ▼
edit.js  onLoad()
    ├── FilterRenderer.getPresets()        → 滤镜列表（15款 + 分类）
    ├── WatermarkConfig.getTemplateById()  → 水印配置（按分类）
    ├── ExifReader.getInfo()               → EXIF 元数据
    └── GeoManager.getCurrentLocation()   → GPS 地址
             │
             ▼
    _drawPreviewToCanvas()
    ├── ctx 旋转/翻转变换                  → 图片方向处理
    ├── FilterRenderer.applyFilter()       → 像素级滤镜（12参数）
    └── _drawWatermarkOnCanvas()           → 水印合成
             │
             ▼
    _processPhotoFull()
    ├── _applyTransform()                  → 旋转/翻转写入图片文件
    ├── FilterRenderer.applyFilterToImage()
    └── WatermarkRenderer.applyWatermark()
             │
             ▼
    saveToAlbum() / share page
```

---

## 📁 项目结构

```
PickCam/
├── miniprogram/                     # 小程序主体
│   ├── app.js                       # 全局入口 & globalData
│   ├── app.json                     # 页面注册 & 权限声明
│   ├── app.wxss                     # 双主题设计系统（Swancam + Fresh）
│   │
│   ├── pages/
│   │   ├── splash/                  # 启动页（CSS 镜头动画）
│   │   ├── guide/                   # 引导页（Swiper 4屏）
│   │   ├── auth/                    # 授权页（设置昵称/头像）
│   │   ├── index/                   # 首页（清新浅色 · 统计卡片）
│   │   ├── camera/                  # 相机主页（核心功能聚合）
│   │   ├── edit/                    # 编辑页（Canvas 渲染管线）
│   │   ├── share/                   # 分享页（成品展示）
│   │   ├── profile/                 # 个人中心（统计 + 偏好）
│   │   ├── settings/                # 应用设置
│   │   └── about/                   # 关于页
│   │
│   ├── components/
│   │   ├── caption-editor/          # 时光语选择器（支持自定义增删改）
│   │   ├── emoji-picker/            # Emoji 选择器（8类 × 12个）
│   │   └── filter-selector/         # 滤镜分类选择器（备用组件）
│   │
│   ├── engines/
│   │   ├── filter/
│   │   │   ├── renderer.js          # Canvas 像素级滤镜渲染器
│   │   │   ├── presets.js           # 15款滤镜预设 + FILTER_THUMBNAILS
│   │   │   └── advanced.js          # 专业模式 12参数编辑器
│   │   └── watermark/
│   │       ├── renderer.js          # 水印合成渲染器
│   │       └── config.js            # 水印模板配置管理
│   │
│   ├── config/
│   │   ├── app.config.js            # 应用常量（批量上限/压缩阈值等）
│   │   ├── captions.js              # 20句时光语 + 自定义管理
│   │   ├── filter-categories.js     # 滤镜分类映射（7类含电影）
│   │   └── watermark-templates.js   # 15套水印模板 + Emoji 分类数据
│   │
│   └── utils/
│       ├── common.js                # 通用工具（压缩/保存/权限检查）
│       ├── exif.js                  # EXIF 元数据读取
│       ├── geocoding.js             # GPS 逆地理编码（需配置 API Key）
│       ├── statistics.js            # 使用统计记录与查询
│       └── storage.js               # 最近使用持久化
│
├── .claude/
│   └── launch.json                  # 微信开发者工具 CLI 启动配置
├── .gitignore
└── README.md
```

---

## 🎨 设计系统

拾光相机采用双主题设计系统：**Swancam**（相机 / 编辑等沉浸页）与 **Fresh**（首页 / 辅助页等清新页），所有决策均通过 CSS 变量统一管理，定义于 `app.wxss`。

### Swancam 暗色令牌（相机 / 编辑 / 分享页）

| 变量名 | 值 | 用途 |
|--------|-----|------|
| `--swancam-primary` | `#FF2D55` | 品牌色、激活态、主要按钮 |
| `--swancam-primary-light` | `rgba(255,45,85,0.15)` | 激活态背景 |
| `--swancam-bg` | `#000000` | 页面背景 |
| `--swancam-surface` | `#1C1C1E` | 卡片、面板背景 |
| `--swancam-surface-2` | `#2C2C2E` | 次级表面 |
| `--swancam-border` | `rgba(255,255,255,0.12)` | 边框、分割线 |
| `--swancam-text-primary` | `#FFFFFF` | 主要文字 |
| `--swancam-text-secondary` | `rgba(255,255,255,0.6)` | 次要文字 |
| `--swancam-text-tertiary` | `rgba(255,255,255,0.3)` | 辅助文字 |

### Fresh 浅色令牌（首页 / 个人中心 / 设置 / 关于页）

| 变量名 | 值 | 用途 |
|--------|-----|------|
| `--fresh-bg` | `#F7F6F2` | 暖白背景 |
| `--fresh-surface` | `#FFFFFF` | 卡片背景 |
| `--fresh-border` | `rgba(0,0,0,0.07)` | 卡片边框 |
| `--fresh-text-primary` | `#1A1A18` | 主要文字 |
| `--fresh-text-secondary` | `#6B6B66` | 次要文字 |
| `--fresh-text-tertiary` | `#A0A09A` | 辅助文字 |
| `--fresh-sage` | `#6B8F5E` | Sage green 强调色 |
| `--fresh-sage-light` | `rgba(107,143,94,0.12)` | 标签背景 |
| `--fresh-shadow-sm` | `0 2rpx 12rpx rgba(0,0,0,0.06)` | 卡片轻阴影 |
| `--fresh-shadow-md` | `0 6rpx 28rpx rgba(0,0,0,0.09)` | 浮层阴影 |

> **颜色约束**：金色 `#D4A574` 仅限 Splash / Guide / Auth 引导三页；
> Swancam 页面激活色统一使用品牌红；Fresh 页面强调色使用 Sage Green。

### 通用令牌

```
字体：--font-size-h1(40) / h2(32) / body(28) / caption(24) / tiny(20)
间距：--space-1(8) / space-2(16) / space-3(24) / space-4(32) / space-6(48) / space-8(64)  单位rpx
圆角：--radius-sm(8) / md(16) / lg(32) / full(999)                                         单位rpx
动效：--ease-out-expo: cubic-bezier(0.19,1,0.22,1)  --duration-fast: 0.2s  --duration-std: 0.35s
```

### 全局工具类

| 类名 | 说明 |
|------|------|
| `.glass-panel` | 毛玻璃面板（`backdrop-filter: blur(20px)` + 半透明边框） |
| `.safe-bottom` | 适配 Home Indicator（`env(safe-area-inset-bottom) + 24rpx`） |
| `.swancam-btn-ripple` | 暗色按压回弹（`scale(0.94)` + `opacity(0.85)`） |
| `.ripple-btn` | 同上，用于普通 view 元素 |

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
#    项目目录：PickCam/miniprogram
#    AppID：填入你自己的小程序 AppID（或选「测试号」体验）
```

### 启动方式

**方式一：GUI 导入**
1. 打开微信开发者工具 → 「导入项目」
2. 目录选择 `PickCam/miniprogram`，填入 AppID → 「导入」

**方式二：命令行（需先在开发者工具开启「服务端口」）**

```bash
# 打开项目 IDE
"C:\Program Files (x86)\Tencent\微信web开发者工具\cli.bat" open \
  --project "C:\Claude\PickCam\miniprogram" --port 9420

# 生成二维码供手机扫码预览
"C:\Program Files (x86)\Tencent\微信web开发者工具\cli.bat" auto-preview \
  --project "C:\Claude\PickCam\miniprogram" --port 9420
```

> 以上两个配置已保存至 `.claude/launch.json`，可通过 Claude Code 一键启动。

### 必要配置

| 配置项 | 文件 | 说明 |
|--------|------|------|
| 腾讯地图 API Key | `utils/geocoding.js` `TENCENT_MAP_KEY` | 用于 GPS 经纬度转中文地名；留空时水印位置信息为空 |
| 快门音效文件 | `assets/audio/shutter.mp3` | 启用声音反馈的必要资源；缺失时静默（功能不报错） |

### 权限申请

首次真机预览时，小程序会请求以下权限：

| 权限 | 用途 |
|------|------|
| `scope.camera` | 相机取景与拍摄 |
| `scope.userLocation` | 获取 GPS 位置用于水印地名 |
| `scope.writePhotosAlbum` | 保存处理后的照片到相册 |

---

## 📱 页面说明

### 用户流程

```
首次启动                        日常使用
    │                               │
    ▼                               ▼
[splash]  ──────────────────► [splash]
    │                               │
    ▼                               ▼
[guide]                     [index（清新首页）]
    │                               │
    ▼                         ┌─────┴──────┐
[auth]                        │            │
    │                       拍摄         选图
    ▼                         │            │
[index]                    [camera]     [edit]
                               │            │
                               └────────────┤
                                            ▼
                                         [share]
                                            │
                            ┌───────────────┘
                            ▼
                       再拍一批 → [index]
```

### 各页面职责

| 页面 | 路径 | 主题 | 核心职责 |
|------|------|------|----------|
| `splash` | `pages/splash` | 暗色 | 开屏动画（CSS 镜头光圈 + 品牌文字入场） |
| `guide` | `pages/guide` | 暗色+金调 | 4屏功能引导（Swiper + 纯 CSS 插画动效） |
| `auth` | `pages/auth` | 暗色+金调 | 设置昵称/头像，写入 `pickcam_user_profile` |
| `index` | `pages/index` | **清新浅色** | 首页（动态问候 + 统计卡片 + 双入口） |
| `camera` | `pages/camera` | 暗色 | 相机主页（取景 / 辅助工具 / 滤镜条） |
| `edit` | `pages/edit` | 暗色 | 编辑页（Canvas 渲染管线 + 工具面板） |
| `share` | `pages/share` | 暗色 | 分享页（成品预览 + 保存/分享操作） |
| `profile` | `pages/profile` | 暗色 | 个人中心（统计 + 偏好 + 设置入口） |
| `settings` | `pages/settings` | 暗色 | 应用设置（开关 + 反馈 + 关于） |
| `about` | `pages/about` | 暗色+金调 | 关于页（版本 + 功能介绍 + 反馈） |

---

## ⚙️ 核心引擎

### 滤镜引擎 `engines/filter/`

**`renderer.js` — FilterRenderer**

基于 Canvas 2D `getImageData` / `putImageData` 的像素级处理引擎。

```javascript
FilterRenderer.getPresets()                              // → FilterPreset[]
FilterRenderer.applyFilter(imageData, params, intensity) // 实时预览（Canvas）
await FilterRenderer.applyFilterToImage(path, params, intensity) // 保存输出
```

支持 12 个独立参数：`brightness` · `contrast` · `saturation` · `temperature` · `tint` · `vibrance` · `sharpen` · `highlights` · `shadows` · `vignetteIntensity` · `grain` · `fade`

**`advanced.js` — AdvancedFilterEditor**

```javascript
AdvancedFilterEditor.getDefaultParams()              // 全 0 默认值
AdvancedFilterEditor.mergeParams(preset, pro)        // 预设 + 专业叠加
AdvancedFilterEditor.isDirty(proParams)              // → boolean
AdvancedFilterEditor.saveAsCustom(name, params)      // 持久化为自定义预设
```

### 水印引擎 `engines/watermark/`

**`renderer.js` — WatermarkRenderer**

```javascript
await WatermarkRenderer.applyWatermark(filePath, wmConfig, photoMeta)
// → 返回合成后的临时文件路径
```

水印元素类型：`date` · `location` · `device` · `caption` · `custom` · `emoji` · `separator`

背景类型：`none` · `solid` · `gradient` · `rounded-rect`

**智能水印选位算法**

```javascript
// 缩图至 160×160，采样四角 22% 区域平均亮度
// 选择最暗角落（对比度最高）放置水印
async _detectBestPositionForImage(filePath)  // → 'bottom-left' | ...
```

### 图片变换引擎（`edit.js` 内置）

```javascript
// 旋转/翻转在保存时通过 OffscreenCanvas 实际写入图片文件
async _applyTransform(filePath)  // → 变换后的临时路径
```

---

## 🔧 配置说明

### `config/app.config.js`

```javascript
module.exports = {
  MAX_PHOTOS:     9,      // 批量处理上限
  MAX_IMAGE_SIZE: 2000,   // 超过此宽度（px）自动压缩
  BATCH_DELAY:    100,    // 批量处理帧间隔（ms），防内存溢出
  PRO_PRICE:      68,     // Pro 版价格（元）
}
```

### `app.js` globalData

| 字段 | 类型 | 说明 |
|------|------|------|
| `selectedPhotos` | `Array` | 相机/相册 → 编辑页的照片列表 |
| `captureFilterId` | `String` | 相机页预选滤镜 ID，传递给编辑页 |
| `captureAspectRatio` | `String` | 相机页选择的画幅比例（edit 页待接入） |
| `shareImagePath` | `String` | 编辑页生成的分享图临时路径 |
| `clearSelection` | `Boolean` | 从分享页返回时触发清理标记 |
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
| `pickcam_streak` | 连续拍摄天数（⚠️ 当前只读不写，见已知问题） |
| `last_capture_filter` | 上次拍摄使用的滤镜 ID |
| `is_pro` | Pro 版授权标记 |

---

## 📐 开发规范

### CSS 变量使用规则

```css
/* ✅ 相机/编辑等暗色页面 */
color: var(--swancam-text-primary);
background: var(--swancam-primary-light);

/* ✅ 首页/设置等清新页面 */
background: var(--fresh-bg);
color: var(--fresh-sage);

/* ❌ 已废弃的旧令牌（运行时 undefined） */
color: var(--text);  background: var(--primary);  color: var(--white);
```

### 颜色约束

```
品牌红 #FF2D55  → 所有 Swancam 页面的激活色/主 CTA
Sage Green     → Fresh 页面的强调色/标签
金色 #D4A574    → 仅限 splash / guide / auth（引导流程暖调）
```

### 新增页面检查清单

- [ ] 顶部导航栏处理 `env(safe-area-inset-top)`（刘海屏）
- [ ] 底部操作区使用 `.safe-bottom`（Home Indicator）
- [ ] 暗色页背景使用 `var(--swancam-bg)`；清新页使用 `var(--fresh-bg)`
- [ ] 不引入硬编码颜色（`#000`、`#fff` 等）

### 提交规范

遵循 [Conventional Commits](https://www.conventionalcommits.org/zh-hans/)：

```
feat:     新功能
fix:      Bug 修复
style:    样式调整（不影响逻辑）
refactor: 重构
perf:     性能优化
docs:     文档更新
chore:    构建/工具链变更
```

---

## 🗺 路线图

### v1.0–v1.2（已完成）✅
- [x] 全沉浸式相机取景页
- [x] 15 款精品滤镜 + 强度调节
- [x] 专业调色面板（12 参数）
- [x] 滤镜对比模式（拖拽分割线）
- [x] 15 套水印模板 + 智能选位
- [x] 20 句时光语 + Emoji 选择器
- [x] 批量保存（最多 9 张）
- [x] 个人偏好设置持久化
- [x] Swancam 暗色设计系统

### v1.3（当前版本）✅
- [x] 九宫格辅助线（可开关）
- [x] 水平仪（DeviceMotion API）
- [x] 画幅比例选择（取景参考线）
- [x] 点击对焦（setFocusPoint）
- [x] 捏合缩放（setZoom）
- [x] 相机取景器内实时滤镜名标注
- [x] 滤镜分类扩充「电影」类别（7类）
- [x] 滤镜收藏功能（♡ 按钮 + 收藏夹）
- [x] 水印模板分类 Tab（全部/极简/装饰/文艺）
- [x] 图片旋转 + 水平翻转（Canvas 变换 + 保存应用）
- [x] 首页清新浅色重设计（Fresh 主题）
- [x] Fresh 设计令牌系统（13 个变量）
- [x] 引导流程补全（guide → auth → camera）
- [x] 更多功能面板入口修复
- [x] 设置页「意见反馈」入口
- [x] 个人中心「应用设置」入口

### v1.4（规划中）
- [ ] `pickcam_streak` 连续拍摄天数写入逻辑
- [ ] 画幅比例实际传递至编辑/保存流程
- [ ] 统计数据结构统一（index / profile / statistics.js）
- [ ] 更多面板 Grid / Level 激活态图标指示
- [ ] index 页 `app.json` 导航栏颜色适配浅色主题
- [ ] 图片裁剪工具
- [ ] 录像后进入视频编辑页

### v2.0（长期规划）
- [ ] 快门音效资源文件
- [ ] 作品社区（需服务端）
- [ ] Pro 订阅（去水印 + 专属模板）
- [ ] 夜景增强算法

---

## ⚠️ 已知待优化项

以下问题已识别，将在后续版本修复：

| 优先级 | 编号 | 位置 | 描述 |
|--------|------|------|------|
| 🔴 | R1 | `index.js` | `pickcam_streak` 连续天数只读不写，首页始终显示 0 |
| 🔴 | R2 | `statistics.js` / `profile.js` | 两处统计读写的数据结构字段名不一致，导致 profile 页数据为 0 |
| 🔴 | R3 | `edit.js` | 画幅比例（`captureAspectRatio`）未在 onLoad 中读取，选择的比例对保存无影响 |
| 🟠 | R4 | `geocoding.js` | `TENCENT_MAP_KEY = ''`，逆地理编码静默失败，水印位置为空 |
| 🟠 | R5 | `assets/audio/` | `shutter.mp3` 缺失，soundFeedback 开关无音效 |
| 🟡 | R6 | `app.json` | `navigationBarBackgroundColor: "#0A0A0A"` 与 index 页浅色主题不协调 |
| 🟡 | R7 | `camera.wxml` | 更多面板内网格线 / 水平仪图标无开启状态高亮 |
| 🟡 | R8 | `components/filter-selector/` | 整个组件未被任何页面使用，是完整死代码 |
| 🟡 | R9 | `config/app.config.js` | `COLORS` 对象含已废弃配色（与 Swancam 矛盾），应清理 |
| 🟢 | R10 | `about.js` | `shareApp()` 调用已弃用的 `wx.showShareMenu`，应改为 `open-type="share"` 按钮 |

---

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建特性分支：`git checkout -b feat/your-feature`
3. 提交改动（遵循提交规范，勿在提交信息中引用第三方产品名称）
4. 推送：`git push origin feat/your-feature`
5. 发起 Pull Request，说明改动原因与影响范围

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
