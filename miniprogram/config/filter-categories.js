// config/filter-categories.js
// 滤镜分类系统（V1.1）

const FILTER_CATEGORIES = [
  { id: 'all',       name: '全部',  icon: '✦' },
  { id: 'portrait',  name: '人像',  icon: '👤' },
  { id: 'landscape', name: '风景',  icon: '🏔️' },
  { id: 'street',    name: '街拍',  icon: '🏙️' },
  { id: 'film',      name: '胶片',  icon: '📷' },
  { id: 'favorites', name: '收藏',  icon: '⭐' }
];

// 滤镜 → 分类映射
const FILTER_CATEGORY_MAP = {
  'original':       ['all'],
  'restore':        ['all', 'portrait', 'landscape'],
  'film-memory':    ['all', 'film'],
  'bw-narrative':   ['all', 'street', 'film'],
  'morning-light':  ['all', 'landscape'],
  'vintage-oil':    ['all', 'film'],
  'soft-portrait':  ['all', 'portrait'],
  'urban-street':   ['all', 'street'],
  'natural-vivid':  ['all', 'landscape'],
  'dreamy':         ['all', 'portrait'],
  'cinematic':      ['all', 'street'],
  'dark-mood':      ['all', 'street'],
  'pink-soft':      ['all', 'portrait'],
  'cool-crisp':     ['all', 'landscape', 'street'],
  'warm-nostalgia': ['all', 'film', 'portrait']
};

/**
 * 根据分类ID获取滤镜ID列表
 */
function getFiltersByCategory(categoryId, favoritedFilters = []) {
  if (categoryId === 'favorites') return favoritedFilters;
  if (categoryId === 'all') return Object.keys(FILTER_CATEGORY_MAP);
  return Object.entries(FILTER_CATEGORY_MAP)
    .filter(([, cats]) => cats.includes(categoryId))
    .map(([id]) => id);
}

module.exports = { FILTER_CATEGORIES, FILTER_CATEGORY_MAP, getFiltersByCategory };
