<template>
  <view class="container"> </view>
</template>

<script>
export default {
  data() {
    return {};
  },
  mounted() {


    wx.cloud.callFunction({
        name: "pushMessage",
        data: {
          content: "收到了吗?",
        },
      })
      .then((res) => {
        console.log("pushMessage.res", res);
      })
      .catch((err) => {
        console.log("pushMessage.err", err);
      });
  },
};
</script>

