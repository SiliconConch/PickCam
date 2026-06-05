// pages/auth/auth.js
const PROFILE_KEY = 'pickcam_user_profile';
const GUIDED_KEY  = 'pickcam_guided_v1';

Page({
  data: {
    avatar: '',
    nickname: '',
    saving: false
  },

  onLoad() {
    // 若已有资料则预填
    const saved = wx.getStorageSync(PROFILE_KEY) || {};
    if (saved.nickname) {
      this.setData({ avatar: saved.avatar || '', nickname: saved.nickname });
    }
  },

  // 头像选择（WeChat chooseAvatar）
  onChooseAvatar(e) {
    this.setData({ avatar: e.detail.avatarUrl });
  },

  // 昵称输入
  onNicknameInput(e) {
    this.setData({ nickname: e.detail.value });
  },

  // 保存并进入
  async save() {
    if (this.data.saving) return;
    const nickname = this.data.nickname.trim() || '拾光用户';
    const profile = {
      avatar: this.data.avatar,
      nickname,
      userId: 'pickcam_' + Date.now(),
      createdAt: new Date().toLocaleDateString('zh-CN')
    };
    wx.setStorageSync(PROFILE_KEY, profile);
    wx.setStorageSync(GUIDED_KEY, true);
    wx.redirectTo({ url: '/pages/camera/camera' });
  },

  // 跳过，不设置
  skip() {
    wx.setStorageSync(GUIDED_KEY, true);
    wx.redirectTo({ url: '/pages/camera/camera' });
  }
});
