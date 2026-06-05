// config/watermark-templates.js
// 15个精品水印模板（V1.1）：极简5 + 装饰5 + 文艺5

// ============================================================
// Emoji 分类（8类 × 12个）
// ============================================================
const EMOJI_CATEGORIES = [
  { id: 'location', name: '地点',  emoji: ['📍','🗺️','🏙️','🌆','🌃','🏔️','🏖️','🌊','🌲','🏡','🏢','🗼'] },
  { id: 'time',     name: '时间',  emoji: ['🗓️','📅','⏰','🕐','🌅','🌄','🌇','🌆','🌉','🌙','☀️','🌤️'] },
  { id: 'weather',  name: '天气',  emoji: ['☀️','⛅','🌤️','🌥️','☁️','🌦️','🌧️','⛈️','🌨️','❄️','🌬️','🌈'] },
  { id: 'nature',   name: '自然',  emoji: ['🌸','🌺','🌻','🌹','🌷','🍃','🍂','🍁','🌿','🌱','🎋','🎍'] },
  { id: 'emotion',  name: '情感',  emoji: ['❤️','🧡','💛','💚','💙','💜','🖤','🤍','💖','💗','💓','✨'] },
  { id: 'camera',   name: '摄影',  emoji: ['📷','📸','🎞️','🎬','🎥','🔍','🔎','👁️','🌟','💫','⭐','🌠'] },
  { id: 'travel',   name: '旅行',  emoji: ['✈️','🚂','🚢','🗺️','🧳','🎒','⛺','🏕️','🌍','🌏','🧭','🎿'] },
  { id: 'life',     name: '生活',  emoji: ['☕','🍵','🍜','🍱','🎵','📚','🎨','🌿','🕯️','🪴','🛋️','🏡'] }
];

// ============================================================
// 水印分类标签
// ============================================================
const WATERMARK_CATEGORIES = [
  { id: 'minimal',    name: '极简' },
  { id: 'decorative', name: '装饰' },
  { id: 'artistic',   name: '文艺' }
];

// ============================================================
// 15个精品模板（elements 格式，兼容现有渲染引擎）
// ============================================================
const WATERMARK_TEMPLATES = [

  // ===== 极简系（5个）=====

  {
    id: 'classic',
    name: '经典',
    category: 'minimal',
    preview: '日期 · 地点',
    config: {
      background: { show: false },
      elements: [
        {
          type: 'date', format: 'YYYY/MM/DD',
          font: 'PingFang SC', size: 28, color: '#FFFFFF', opacity: 100, bold: false,
          shadow: { color: 'rgba(0,0,0,0.9)', blur: 8 }
        },
        {
          type: 'location',
          font: 'PingFang SC', size: 22, color: 'rgba(255,255,255,0.88)', opacity: 100, bold: false,
          shadow: { color: 'rgba(0,0,0,0.9)', blur: 6 }
        }
      ],
      position: { preset: 'bottom-left', x: 24, y: -28 },
      layout: 'vertical'
    }
  },

  {
    id: 'minimal',
    name: '极简',
    category: 'minimal',
    preview: '月/日',
    config: {
      background: { show: false },
      elements: [
        {
          type: 'date', format: 'MM · DD',
          font: 'PingFang SC', size: 36, color: '#FFFFFF', opacity: 95, bold: false,
          shadow: { color: 'rgba(0,0,0,0.95)', blur: 10 }
        }
      ],
      position: { preset: 'bottom-center', x: 0, y: -28 },
      layout: 'horizontal'
    }
  },

  {
    id: 'minimal_right',
    name: '右下',
    category: 'minimal',
    preview: '日期 地点',
    config: {
      background: { show: false },
      elements: [
        {
          type: 'date', format: 'YYYY/MM/DD',
          font: 'PingFang SC', size: 24, color: '#FFFFFF', opacity: 95, bold: false,
          shadow: { color: 'rgba(0,0,0,0.9)', blur: 7 }
        },
        {
          type: 'location',
          font: 'PingFang SC', size: 20, color: 'rgba(255,255,255,0.82)', opacity: 100, bold: false,
          shadow: { color: 'rgba(0,0,0,0.9)', blur: 6 }
        }
      ],
      position: { preset: 'bottom-right', x: -20, y: -24 },
      layout: 'vertical'
    }
  },

  {
    id: 'minimal_top',
    name: '顶部',
    category: 'minimal',
    preview: '↑ 日期',
    config: {
      background: { show: false },
      elements: [
        {
          type: 'date', format: 'YYYY / MM / DD',
          font: 'PingFang SC', size: 22, color: 'rgba(255,255,255,0.9)', opacity: 100, bold: false,
          shadow: { color: 'rgba(0,0,0,0.85)', blur: 6 }
        }
      ],
      position: { preset: 'top-left', x: 20, y: 20 },
      layout: 'horizontal'
    }
  },

  {
    id: 'caption',
    name: '时光语',
    category: 'minimal',
    preview: '此刻即永恒',
    config: {
      background: { show: false },
      elements: [
        {
          type: 'caption', mode: 'daily',
          font: 'PingFang SC', size: 28, color: '#F5E6D0', opacity: 100, bold: false,
          shadow: { color: 'rgba(0,0,0,0.95)', blur: 10 }
        }
      ],
      position: { preset: 'bottom-center', x: 0, y: -36 },
      layout: 'horizontal'
    }
  },

  // ===== 装饰系（5个）=====

  {
    id: 'emoji_pill',
    name: 'Emoji',
    category: 'decorative',
    preview: '📍 地点 · 日期',
    config: {
      background: {
        show: true, type: 'rounded-rect',
        color: '#000000', opacity: 0.45,
        padding: { x: 20, y: 10 }, radius: 24
      },
      elements: [
        { type: 'emoji',     value: '📍', size: 24 },
        { type: 'location',  font: 'PingFang SC', size: 24, color: '#FFFFFF', opacity: 100 },
        { type: 'separator', value: ' · ', size: 24, color: 'rgba(255,255,255,0.6)' },
        { type: 'date', format: 'MM/DD', font: 'PingFang SC', size: 24, color: 'rgba(255,255,255,0.85)', opacity: 100 }
      ],
      position: { preset: 'bottom-center', x: 0, y: -28 },
      layout: 'horizontal'
    }
  },

  {
    id: 'rounded_card',
    name: '卡片',
    category: 'decorative',
    preview: '圆角信息卡',
    config: {
      background: {
        show: true, type: 'rounded-rect',
        color: '#1A1A1A', opacity: 0.72,
        padding: { x: 24, y: 14 }, radius: 14
      },
      elements: [
        {
          type: 'caption', mode: 'daily',
          font: 'PingFang SC', size: 22, color: '#D4A574', opacity: 100
        },
        {
          type: 'date', format: 'YYYY/MM/DD',
          font: 'PingFang SC', size: 24, color: '#FFFFFF', opacity: 100
        },
        {
          type: 'location',
          font: 'PingFang SC', size: 20, color: '#AAAAAA', opacity: 100
        }
      ],
      position: { preset: 'bottom-left', x: 20, y: -24 },
      layout: 'vertical'
    }
  },

  {
    id: 'glass_card',
    name: '毛玻璃',
    category: 'decorative',
    preview: '半透明卡片',
    config: {
      background: {
        show: true, type: 'rounded-rect',
        color: '#FFFFFF', opacity: 0.18,
        padding: { x: 20, y: 12 }, radius: 16
      },
      elements: [
        {
          type: 'date', format: 'YYYY/MM/DD',
          font: 'PingFang SC', size: 26, color: '#FFFFFF', opacity: 100,
          shadow: { color: 'rgba(0,0,0,0.5)', blur: 4 }
        },
        {
          type: 'location',
          font: 'PingFang SC', size: 22, color: 'rgba(255,255,255,0.85)', opacity: 100,
          shadow: { color: 'rgba(0,0,0,0.5)', blur: 4 }
        }
      ],
      position: { preset: 'bottom-right', x: -20, y: -24 },
      layout: 'vertical'
    }
  },

  {
    id: 'emoji_caption',
    name: 'Emoji卡',
    category: 'decorative',
    preview: '😊 时光语',
    config: {
      background: {
        show: true, type: 'rounded-rect',
        color: '#000000', opacity: 0.5,
        padding: { x: 22, y: 12 }, radius: 20
      },
      elements: [
        { type: 'emoji',   value: '✨', size: 26 },
        {
          type: 'caption', mode: 'daily',
          font: 'PingFang SC', size: 26, color: '#F5E6D0', opacity: 100
        }
      ],
      position: { preset: 'bottom-center', x: 0, y: -32 },
      layout: 'horizontal'
    }
  },

  {
    id: 'full',
    name: '完整',
    category: 'decorative',
    preview: '渐变 · 全信息',
    config: {
      background: {
        show: true, type: 'gradient',
        opacity: 0.72, height: 0.40
      },
      elements: [
        {
          type: 'caption', mode: 'daily',
          font: 'PingFang SC', size: 22, color: '#D4A574', opacity: 100,
          shadow: { color: 'rgba(0,0,0,0.5)', blur: 4 }
        },
        {
          type: 'date', format: 'YYYY/MM/DD HH:mm',
          font: 'PingFang SC', size: 26, color: '#FFFFFF', opacity: 100,
          shadow: { color: 'rgba(0,0,0,0.5)', blur: 4 }
        },
        {
          type: 'location',
          font: 'PingFang SC', size: 22, color: 'rgba(255,255,255,0.82)', opacity: 100,
          shadow: { color: 'rgba(0,0,0,0.5)', blur: 4 }
        },
        {
          type: 'device',
          font: 'PingFang SC', size: 20, color: 'rgba(255,255,255,0.6)', opacity: 100,
          shadow: { color: 'rgba(0,0,0,0.5)', blur: 4 }
        }
      ],
      position: { preset: 'bottom-left', x: 24, y: -24 },
      layout: 'vertical'
    }
  },

  // ===== 文艺系（5个）=====

  {
    id: 'film_style',
    name: '胶片',
    category: 'artistic',
    preview: 'Shot on ···',
    config: {
      background: { show: false },
      elements: [
        {
          type: 'date', format: 'YYYY · MM · DD',
          font: 'monospace', size: 22, color: 'rgba(255,255,255,0.9)', opacity: 100,
          shadow: { color: 'rgba(0,0,0,0.9)', blur: 6 }
        },
        {
          type: 'device',
          font: 'monospace', size: 19, color: 'rgba(255,255,255,0.65)', opacity: 100,
          shadow: { color: 'rgba(0,0,0,0.9)', blur: 5 }
        }
      ],
      position: { preset: 'bottom-right', x: -20, y: -28 },
      layout: 'vertical'
    }
  },

  {
    id: 'cinematic_style',
    name: '电影',
    category: 'artistic',
    preview: '电影条幅',
    config: {
      background: {
        show: true, type: 'gradient',
        opacity: 0.8, height: 0.32
      },
      elements: [
        {
          type: 'caption', mode: 'daily',
          font: 'PingFang SC', size: 30, color: '#FFFFFF', opacity: 100, bold: false,
          shadow: { color: 'rgba(0,0,0,0.6)', blur: 6 }
        },
        {
          type: 'date', format: 'YYYY/MM/DD',
          font: 'PingFang SC', size: 20, color: 'rgba(255,255,255,0.7)', opacity: 100,
          shadow: { color: 'rgba(0,0,0,0.5)', blur: 4 }
        }
      ],
      position: { preset: 'bottom-center', x: 0, y: -32 },
      layout: 'vertical'
    }
  },

  {
    id: 'time_stamp',
    name: '时间章',
    category: 'artistic',
    preview: 'MM/DD 大字',
    config: {
      background: {
        show: true, type: 'rounded-rect',
        color: '#D4A574', opacity: 0.85,
        padding: { x: 18, y: 10 }, radius: 6
      },
      elements: [
        {
          type: 'date', format: 'MM/DD',
          font: 'PingFang SC', size: 32, color: '#1A1A1A', opacity: 100, bold: true
        },
        {
          type: 'date', format: 'YYYY',
          font: 'PingFang SC', size: 18, color: '#3A3A3A', opacity: 90
        }
      ],
      position: { preset: 'top-right', x: -20, y: 20 },
      layout: 'vertical'
    }
  },

  {
    id: 'polaroid_style',
    name: '宝丽来',
    category: 'artistic',
    preview: '白底文案',
    config: {
      background: {
        show: true, type: 'rounded-rect',
        color: '#FEFEFE', opacity: 0.92,
        padding: { x: 28, y: 16 }, radius: 4
      },
      elements: [
        {
          type: 'caption', mode: 'daily',
          font: 'PingFang SC', size: 24, color: '#2C2C2C', opacity: 100
        },
        {
          type: 'date', format: 'YYYY/MM/DD',
          font: 'PingFang SC', size: 18, color: '#888888', opacity: 100
        }
      ],
      position: { preset: 'bottom-center', x: 0, y: -28 },
      layout: 'vertical'
    }
  },

  {
    id: 'diary_style',
    name: '日记',
    category: 'artistic',
    preview: '日记本风',
    config: {
      background: {
        show: true, type: 'rounded-rect',
        color: '#FFF8DC', opacity: 0.88,
        padding: { x: 24, y: 14 }, radius: 8
      },
      elements: [
        {
          type: 'date', format: 'YYYY年MM月DD日',
          font: 'PingFang SC', size: 20, color: '#6B4A2A', opacity: 100
        },
        {
          type: 'caption', mode: 'daily',
          font: 'PingFang SC', size: 24, color: '#4A3020', opacity: 100
        },
        {
          type: 'location',
          font: 'PingFang SC', size: 18, color: '#9B7A5A', opacity: 100
        }
      ],
      position: { preset: 'bottom-left', x: 20, y: -24 },
      layout: 'vertical'
    }
  }

];

// 预设位置列表
const POSITION_PRESETS = [
  { id: 'top-left',      name: '左上', x: 0,   y: 0,   anchor: 'top-left' },
  { id: 'top-center',    name: '中上', x: 0.5, y: 0,   anchor: 'top-center' },
  { id: 'top-right',     name: '右上', x: 1,   y: 0,   anchor: 'top-right' },
  { id: 'middle-left',   name: '左中', x: 0,   y: 0.5, anchor: 'middle-left' },
  { id: 'center',        name: '居中', x: 0.5, y: 0.5, anchor: 'center' },
  { id: 'middle-right',  name: '右中', x: 1,   y: 0.5, anchor: 'middle-right' },
  { id: 'bottom-left',   name: '左下', x: 0,   y: 1,   anchor: 'bottom-left' },
  { id: 'bottom-center', name: '中下', x: 0.5, y: 1,   anchor: 'bottom-center' },
  { id: 'bottom-right',  name: '右下', x: 1,   y: 1,   anchor: 'bottom-right' }
];

const FONT_OPTIONS = [
  { id: 'PingFang SC', name: '苹方',  preview: '苹方字体' },
  { id: 'STHeiti',     name: '黑体',  preview: '黑体字体' },
  { id: 'Georgia',     name: 'Georgia', preview: 'Georgia' },
  { id: 'serif',       name: '宋体',  preview: '宋体字体' },
  { id: 'monospace',   name: '等宽',  preview: 'Monospace' }
];

const COLOR_PRESETS = [
  '#FFFFFF','#000000','#F5F5F5','#333333',
  '#2C3E50','#D4A574','#E67E22','#E74C3C',
  '#27AE60','#3498DB'
];

module.exports = {
  EMOJI_CATEGORIES,
  WATERMARK_TEMPLATES,
  WATERMARK_CATEGORIES,
  POSITION_PRESETS,
  FONT_OPTIONS,
  COLOR_PRESETS
};
