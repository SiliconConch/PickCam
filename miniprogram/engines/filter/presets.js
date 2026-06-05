// engines/filter/presets.js
// 15个精品滤镜预设（V1.1）

const FILTER_PRESETS = [
  {
    id: 'original',
    name: '原片',
    desc: '不做任何处理',
    category: 'all',
    swatch: ['#B8B8B8', '#606060'],
    params: {
      brightness: 0, contrast: 0, saturation: 0,
      temperature: 0, tint: 0, vibrance: 0,
      sharpen: 0, highlights: 0, shadows: 0,
      vignetteIntensity: 0, grain: 0, fade: 0
    }
  },
  {
    id: 'restore',
    name: '真实还原',
    desc: '广播级色彩分级，精准还原肤色与高光细节',
    category: 'portrait',
    swatch: ['#C8D8C0', '#708860'],
    params: {
      brightness: 1, contrast: -1, saturation: -1,
      temperature: 0, tint: 0, vibrance: 1,
      sharpen: -12, highlights: -3, shadows: 1,
      vignetteIntensity: 0, grain: 0, fade: 0
    }
  },
  {
    id: 'film-memory',
    name: '胶片记忆',
    desc: '低噪点模拟经典胶片，保护暗部层次',
    category: 'film',
    swatch: ['#D4A860', '#7A4010'],
    params: {
      brightness: 2, contrast: 3, saturation: -5,
      temperature: 5, tint: 2, vibrance: 3,
      sharpen: -8, highlights: -4, shadows: 2,
      vignetteIntensity: 8, grain: 2, fade: 10
    }
  },
  {
    id: 'bw-narrative',
    name: '黑白叙事',
    desc: '高对比度黑白',
    category: 'street',
    swatch: ['#909090', '#141414'],
    params: {
      brightness: 3, contrast: 20, saturation: -100,
      temperature: 0, tint: 0, vibrance: 0,
      sharpen: 5, highlights: -10, shadows: 8,
      vignetteIntensity: 25, grain: 5, fade: 0
    }
  },
  {
    id: 'morning-light',
    name: '清晨微光',
    desc: '柔和蓝调晨曦',
    category: 'landscape',
    swatch: ['#88B8E0', '#3060A8'],
    params: {
      brightness: 8, contrast: -3, saturation: -8,
      temperature: -15, tint: -3, vibrance: 5,
      sharpen: -5, highlights: -10, shadows: 10,
      vignetteIntensity: 8, grain: 2, fade: 8
    }
  },
  {
    id: 'vintage-oil',
    name: '复古油画',
    desc: '油画质感，暖色浓郁',
    category: 'film',
    swatch: ['#D08830', '#601808'],
    params: {
      brightness: -3, contrast: 10, saturation: 15,
      temperature: 20, tint: 8, vibrance: -3,
      sharpen: -12, highlights: -15, shadows: 15,
      vignetteIntensity: 30, grain: 5, fade: 15
    }
  },
  {
    id: 'soft-portrait',
    name: '柔光人像',
    desc: 'Kodak Portra 400',
    category: 'portrait',
    swatch: ['#EAC8A8', '#B07050'],
    params: {
      brightness: 6, contrast: -5, saturation: -3,
      temperature: 10, tint: 5, vibrance: 3,
      sharpen: -12, highlights: -8, shadows: 10,
      vignetteIntensity: 12, grain: 3, fade: 10
    }
  },
  {
    id: 'urban-street',
    name: '城市街拍',
    desc: '高对比度街头风',
    category: 'street',
    swatch: ['#A0A0A0', '#181818'],
    params: {
      brightness: -3, contrast: 25, saturation: -15,
      temperature: -3, tint: 0, vibrance: 0,
      sharpen: 8, highlights: -5, shadows: 0,
      vignetteIntensity: 15, grain: 5, fade: 0
    }
  },
  {
    id: 'natural-vivid',
    name: '自然鲜活',
    desc: '风景增强，色彩饱满',
    category: 'landscape',
    swatch: ['#68D870', '#188838'],
    params: {
      brightness: 3, contrast: 8, saturation: 15,
      temperature: 3, tint: -2, vibrance: 20,
      sharpen: 5, highlights: -3, shadows: 3,
      vignetteIntensity: 0, grain: 0, fade: 0
    }
  },
  {
    id: 'dreamy',
    name: '柔梦',
    desc: '梦幻柔焦，温柔光感',
    category: 'portrait',
    swatch: ['#F0E8F8', '#C0A0D8'],
    params: {
      brightness: 12, contrast: -12, saturation: -3,
      temperature: 3, tint: 3, vibrance: 3,
      sharpen: -25, highlights: -3, shadows: 12,
      vignetteIntensity: 0, grain: 0, fade: 20
    }
  },
  {
    id: 'cinematic',
    name: '电影感',
    desc: '电影级宽容度',
    category: 'street',
    swatch: ['#5888A8', '#102840'],
    params: {
      brightness: -5, contrast: 15, saturation: -10,
      temperature: -5, tint: 2, vibrance: 3,
      sharpen: 3, highlights: -15, shadows: 12,
      vignetteIntensity: 35, grain: 4, fade: 12
    }
  },
  {
    id: 'dark-mood',
    name: '暗调情绪',
    desc: '低调氛围，压抑美学',
    category: 'street',
    swatch: ['#404068', '#080810'],
    params: {
      brightness: -15, contrast: 20, saturation: -8,
      temperature: -3, tint: 0, vibrance: 0,
      sharpen: 3, highlights: -25, shadows: 3,
      vignetteIntensity: 45, grain: 8, fade: 3
    }
  },
  {
    id: 'pink-soft',
    name: '粉调柔和',
    desc: '柔和马卡龙色调',
    category: 'portrait',
    swatch: ['#F8C0D8', '#D07098'],
    params: {
      brightness: 10, contrast: -8, saturation: 3,
      temperature: 12, tint: 12, vibrance: 8,
      sharpen: -8, highlights: -5, shadows: 8,
      vignetteIntensity: 0, grain: 0, fade: 15
    }
  },
  {
    id: 'cool-crisp',
    name: '冷调清冽',
    desc: '高冷蓝调，清爽质感',
    category: 'landscape',
    swatch: ['#80C8E8', '#185880'],
    params: {
      brightness: 3, contrast: 12, saturation: -15,
      temperature: -25, tint: -8, vibrance: 3,
      sharpen: 3, highlights: -8, shadows: 0,
      vignetteIntensity: 12, grain: 2, fade: 5
    }
  },
  {
    id: 'warm-nostalgia',
    name: '暖调怀旧',
    desc: '温暖回忆，时光感',
    category: 'film',
    swatch: ['#E8A048', '#804010'],
    params: {
      brightness: 6, contrast: 3, saturation: 3,
      temperature: 25, tint: 8, vibrance: 5,
      sharpen: -10, highlights: -12, shadows: 15,
      vignetteIntensity: 20, grain: 10, fade: 18
    }
  }
];

// 滤镜场景样张配置 (视觉隐喻)
const FILTER_THUMBNAILS = {
  'original': { thumb: '/assets/filters/thumb_original.jpg', icon: '📷', tag: '真实' },
  'restore': { thumb: '/assets/filters/thumb_restore.jpg', icon: '👤', tag: '人像' },
  'film-memory': { thumb: '/assets/filters/thumb_film.jpg', icon: '🎞️', tag: '胶片' },
  'bw-narrative': { thumb: '/assets/filters/thumb_bw.jpg', icon: '🖋️', tag: '黑白' },
  'morning-light': { thumb: '/assets/filters/thumb_landscape.jpg', icon: '🌄', tag: '风景' },
  'vintage-oil': { thumb: '/assets/filters/thumb_oil.jpg', icon: '🎨', tag: '艺术' },
  'soft-portrait': { thumb: '/assets/filters/thumb_portrait.jpg', icon: '👗', tag: '柔美' },
  'urban-street': { thumb: '/assets/filters/thumb_street.jpg', icon: '🏙️', tag: '街拍' },
  'natural-vivid': { thumb: '/assets/filters/thumb_vivid.jpg', icon: '🌿', tag: '鲜活' },
  'dreamy': { thumb: '/assets/filters/thumb_dreamy.jpg', icon: '✨', tag: '柔梦' },
  'cinematic': { thumb: '/assets/filters/thumb_movie.jpg', icon: '🎬', tag: '电影' },
  'dark-mood': { thumb: '/assets/filters/thumb_dark.jpg', icon: '🕯️', tag: '暗调' },
  'pink-soft': { thumb: '/assets/filters/thumb_pink.jpg', icon: '🌸', tag: '甜美' },
  'cool-crisp': { thumb: '/assets/filters/thumb_cool.jpg', icon: '❄️', tag: '清冽' },
  'warm-nostalgia': { thumb: '/assets/filters/thumb_warm.jpg', icon: '☕', tag: '怀旧' }
};

module.exports = { FILTER_PRESETS, FILTER_THUMBNAILS };
