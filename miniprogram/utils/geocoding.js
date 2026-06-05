// utils/geocoding.js
// 地理位置获取与逆地理编码

// ============================================================
// 腾讯地图 API Key 配置
// 申请地址：https://lbs.qq.com/dev/console/application/mine
// 申请后在微信公众平台 → 开发 → 开发管理 → 服务器域名 中
// 将 apis.map.qq.com 添加到 request 合法域名
// ============================================================
const TENCENT_MAP_KEY = ''; // [重要] 请在此填入您的腾讯地图 API Key，否则无法将经纬度转换为中文地址

const GeoManager = {
  _cachedLocation: null,
  _cacheTime: 0,
  CACHE_DURATION: 5 * 60 * 1000, // 5分钟缓存

  /**
   * 获取当前位置（带缓存）
   * @returns {Promise<{latitude, longitude, address}>}
   */
  async getCurrentLocation() {
    if (!TENCENT_MAP_KEY) {
      console.warn('GeoManager: TENCENT_MAP_KEY 未配置，无法执行逆地理编码。');
    }
    const now = Date.now();
    if (this._cachedLocation && (now - this._cacheTime) < this.CACHE_DURATION) {
      return this._cachedLocation;
    }

    try {
      const granted = await this._checkPermission();
      if (!granted) {
        return { address: '', latitude: null, longitude: null };
      }

      const location = await new Promise((resolve, reject) => {
        wx.getLocation({
          type: 'wgs84',
          success: resolve,
          fail: reject
        });
      });

      let address = '';
      if (TENCENT_MAP_KEY) {
        address = await this._reverseGeocode(location.latitude, location.longitude);
      }

      const result = {
        latitude: location.latitude,
        longitude: location.longitude,
        address
      };
      this._cachedLocation = result;
      this._cacheTime = now;
      return result;

    } catch (e) {
      console.error('获取位置失败:', e);
      return { address: '', latitude: null, longitude: null };
    }
  },

  /**
   * 腾讯地图逆地理编码 → 返回中文地址（城市+区县）
   */
  async _reverseGeocode(lat, lng) {
    try {
      const url = `https://apis.map.qq.com/ws/geocoder/v1/?location=${lat},${lng}&key=${TENCENT_MAP_KEY}&output=json`;
      const res = await new Promise((resolve, reject) => {
        wx.request({ url, success: resolve, fail: reject });
      });

      if (res.statusCode === 200 && res.data && res.data.status === 0) {
        const comp = res.data.result.address_component || {};
        // 优先返回：区县（如"南山区"），次选城市（如"深圳市"）
        const district = (comp.district || '').replace(/区$|县$/, '');
        const city = (comp.city || '').replace(/市$/, '');
        if (district && city && district !== city) {
          return `${city} · ${district}`;
        }
        return district || city || res.data.result.address || '';
      }
    } catch (e) {
      console.error('逆地理编码失败:', e);
    }
    return '';
  },

  /**
   * 检查并请求位置权限
   */
  async _checkPermission() {
    return new Promise((resolve) => {
      wx.getSetting({
        success: (res) => {
          if (res.authSetting['scope.userLocation']) {
            resolve(true);
          } else {
            wx.authorize({
              scope: 'scope.userLocation',
              success: () => resolve(true),
              fail: () => {
                wx.showModal({
                  title: '需要位置权限',
                  content: '为在水印中显示位置，需要获取您的位置权限',
                  confirmText: '去设置',
                  success: (r) => {
                    if (r.confirm) {
                      wx.openSetting({
                        success: (s) => resolve(!!s.authSetting['scope.userLocation'])
                      });
                    } else {
                      resolve(false);
                    }
                  }
                });
              }
            });
          }
        },
        fail: () => resolve(false)
      });
    });
  },

  clearCache() {
    this._cachedLocation = null;
    this._cacheTime = 0;
  }
};

module.exports = { GeoManager };
