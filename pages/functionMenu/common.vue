<template>
  <view>
    <z-nav-bar :shadow="false" title="登录" backState="2000"></z-nav-bar>
    <public-module></public-module>
    <z-navigation></z-navigation>
  </view>
</template>

<script>
export default {
  data() {
    return {

    };
  },
  onLoad() { },
  onShow() {
    // 隐藏原生的tabbar
    uni.hideTabBar();
  },
  methods: {

  }
};
</script>

<style scoped lang="scss"></style>