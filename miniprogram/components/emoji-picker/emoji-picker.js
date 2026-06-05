// components/emoji-picker/emoji-picker.js
const { EMOJI_CATEGORIES } = require('../../config/watermark-templates.js');

Component({
  data: {
    categories: EMOJI_CATEGORIES,
    activeCategoryId: 'location',
    displayEmoji: []
  },

  lifetimes: {
    attached() {
      this._loadEmoji('location');
    }
  },

  methods: {
    _loadEmoji(categoryId) {
      const cat = EMOJI_CATEGORIES.find(c => c.id === categoryId);
      this.setData({
        activeCategoryId: categoryId,
        displayEmoji: cat ? cat.emoji : []
      });
    },

    switchCategory(e) {
      const id = e.currentTarget.dataset.id;
      this._loadEmoji(id);
    },

    selectEmoji(e) {
      const emoji = e.currentTarget.dataset.emoji;
      this.triggerEvent('select', { emoji });
    },

    close() {
      this.triggerEvent('close');
    }
  }
});
