// pages/guide/guide.js
const GUIDED_KEY = 'pickcam_guided_v1';

const SLIDES = [
  {
    illus: 'brand',
    accentStyle: 'background: radial-gradient(ellipse at 50% 40%, rgba(212,165,116,0.1) 0%, transparent 65%);',
    title: '拾光相机',
    desc: '专业拍摄 · 精品滤镜 · 精美水印\n用光影，讲述属于你的故事'
  },
  {
    illus: 'filter',
    accentStyle: 'background: radial-gradient(ellipse at 50% 40%, rgba(232,140,80,0.1) 0%, transparent 65%);',
    title: '15 种精品滤镜',
    desc: '胶片 · 电影 · 人文 · 黑白\n一键焕新，让照片更有质感'
  },
  {
    illus: 'watermark',
    accentStyle: 'background: radial-gradient(ellipse at 50% 40%, rgba(80,180,160,0.08) 0%, transparent 65%);',
    title: '精美水印模板',
    desc: '时间 · 地点 · 心情\n15 款风格，留下专属印记'
  },
  {
    illus: 'caption',
    accentStyle: 'background: radial-gradient(ellipse at 50% 40%, rgba(155,140,210,0.08) 0%, transparent 65%);',
    title: '时光语',
    desc: '20 句精选文案，一键配词\n为每张照片附上最美注脚'
  }
];

Page({
  data: {
    slides: SLIDES,
    current: 0,
    isLast: false
  },

  onChange(e) {
    const current = e.detail.current;
    this.setData({ current, isLast: current === SLIDES.length - 1 });
  },

  goNext() {
    const { current, slides } = this.data;
    if (current < slides.length - 1) {
      this.setData({ current: current + 1, isLast: current + 1 === slides.length - 1 });
    } else {
      this._start();
    }
  },

  skip() {
    this._start();
  },

  _start() {
    wx.setStorageSync(GUIDED_KEY, true);
    wx.redirectTo({ url: '/pages/camera/camera' });
  }
});
