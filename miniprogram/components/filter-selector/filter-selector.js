// components/filter-selector/filter-selector.js
const { FilterRenderer } = require('../../engines/filter/renderer.js');

Component({
  properties: {
    selectedId: {
      type: String,
      value: 'original'
    },
    intensity: {
      type: Number,
      value: 100
    },
    previewSrc: {
      type: String,
      value: ''
    }
  },

  data: {
    filters: []
  },

  lifetimes: {
    attached() {
      this.setData({ filters: FilterRenderer.getPresets() });
    }
  },

  methods: {
    selectFilter(e) {
      const id = e.currentTarget.dataset.id;
      this.triggerEvent('select', { id });
    },

    onIntensityChange(e) {
      this.triggerEvent('intensitychange', { value: parseInt(e.detail.value) });
    }
  }
});
