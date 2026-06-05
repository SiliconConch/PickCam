// components/caption-editor/caption-editor.js
const { CaptionManager } = require('../../config/captions.js');

Component({
  data: {
    displayCaptions: [],   // [{text, isCustom}]
    selectedCaption: '',
    showAddDialog: false,
    newCaption: '',
    longPressCaption: '',
    showContextMenu: false
  },

  lifetimes: {
    attached() {
      this.captionMgr = new CaptionManager();
      this._loadCaptions();
    }
  },

  methods: {
    _loadCaptions() {
      const all = this.captionMgr.getAllCaptions();
      const displayCaptions = all.map(text => {
        const spaceIdx = text.indexOf(' ');
        const hasEmoji = spaceIdx > 0 && spaceIdx <= 3;
        return {
          text,
          emoji: hasEmoji ? text.slice(0, spaceIdx) : '',
          label: hasEmoji ? text.slice(spaceIdx + 1) : text,
          isCustom: !this.captionMgr.isDefaultCaption(text)
        };
      });
      this.setData({ displayCaptions });
    },

    // ── 每日 / 随机 ──
    selectDaily() {
      this._selectCaption(this.captionMgr.getDailyCaption());
    },

    selectRandom() {
      this._selectCaption(this.captionMgr.getRandomCaption());
    },

    // ── 点击选择 ──
    onTapCaption(e) {
      this._selectCaption(e.currentTarget.dataset.caption);
    },

    _selectCaption(caption) {
      this.setData({ selectedCaption: caption, showContextMenu: false });
      this.triggerEvent('select', { caption });
    },

    // ── 长按（仅自定义可操作） ──
    onLongPressCaption(e) {
      const caption = e.currentTarget.dataset.caption;
      if (!this.captionMgr.isDefaultCaption(caption)) {
        this.setData({ longPressCaption: caption, showContextMenu: true });
      }
    },

    closeContextMenu() {
      this.setData({ showContextMenu: false, longPressCaption: '' });
    },

    editCaption() {
      const old = this.data.longPressCaption;
      this.setData({ showContextMenu: false });
      wx.showModal({
        title: '编辑时光语',
        editable: true,
        content: old,
        success: (res) => {
          if (res.confirm && res.content && res.content.trim()) {
            const r = this.captionMgr.editCustomCaption(old, res.content.trim());
            if (r.success) { this._loadCaptions(); wx.showToast({ title: '已修改', icon: 'success' }); }
            else wx.showToast({ title: r.error, icon: 'none' });
          }
        }
      });
    },

    deleteCaption() {
      const caption = this.data.longPressCaption;
      this.setData({ showContextMenu: false });
      wx.showModal({
        title: '删除',
        content: `确定删除「${caption}」？`,
        confirmText: '删除', confirmColor: '#E74C3C',
        success: (res) => {
          if (res.confirm) {
            this.captionMgr.deleteCustomCaption(caption);
            this._loadCaptions();
            wx.showToast({ title: '已删除', icon: 'success' });
          }
        }
      });
    },

    // ── 添加自定义 ──
    showAdd() { this.setData({ showAddDialog: true, newCaption: '' }); },
    onNewCaptionInput(e) { this.setData({ newCaption: e.detail.value }); },
    cancelAdd() { this.setData({ showAddDialog: false, newCaption: '' }); },

    addCustomCaption() {
      const r = this.captionMgr.addCustomCaption(this.data.newCaption.trim());
      if (r.success) {
        this.setData({ showAddDialog: false, newCaption: '' });
        this._loadCaptions();
        wx.showToast({ title: '已添加', icon: 'success' });
      } else {
        wx.showToast({ title: r.error, icon: 'none' });
      }
    },

    close() { this.triggerEvent('close'); }
  }
});
