<script>

export default {
  globalData: {},
  onLaunch: function () {
    wx.cloud.init({
      env:  "你的云开发环境ID",
    });
  },
};
</script>