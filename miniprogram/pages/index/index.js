const app = getApp();

Page({
  data: {
    webUrl: app.globalData.siteUrl,
    loadError: false
  },

  handleLoad() {
    if (this.data.loadError) {
      this.setData({ loadError: false });
    }
  },

  handleError() {
    this.setData({ loadError: true });
  },

  retry() {
    const separator = app.globalData.siteUrl.includes('?') ? '&' : '?';
    this.setData({
      loadError: false,
      webUrl: `${app.globalData.siteUrl}${separator}reload=${Date.now()}`
    });
  }
});
