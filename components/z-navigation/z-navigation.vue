<template>
  <view>
    <view class="footer_box" :class="{ footer_bg: bg }">
      <view
        v-for="(item, index) of navigationList"
        :key="index"
        class="footer_item"
      >
        <view v-if="item.raised" class="footer_raised_item" @click="onRaised">
          <image
            class="footer_raised_item_image"
            :src="'/' + item.iconPath"
            mode="aspectFit"
          ></image>
        </view>
        <view v-else class="footer_nav_item" @click="onPageJump(item.pagePath)">
          <image
            v-if="item.pagePath == path"
            class="footer_nav_item_image"
            :src="'/' + item.selectedIconPath"
            mode="aspectFit"
          ></image>
          <image
            v-else
            class="footer_nav_item_image"
            :src="'/' + item.iconPath"
            mode="aspectFit"
          ></image>
          <text
            class="footer_nav_item_text"
            :class="[item.pagePath == path ? 'footer_item_text_active' : '']"
            >{{ item.text }}</text
          >
        </view>
      </view>
    </view>
    <view v-if="bg" class="footer_station"></view>
    <z-popup v-model="popupShow" type="center">
      <view class="popup_content">
        <view>凸起导航解决方案，请看components/module/navigation.vue</view>
        <view>和pages/home/common.vue</view>
      </view>
    </z-popup>
  </view>
</template>
<script>
export default {
  props: {
    bg: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      path: '',
      navigationList: [
        {
          pagePath: 'pages/home/index',
          iconPath: 'static/icon/tab/icon_home.png',
          selectedIconPath: 'static/icon/tab/icon_home_c.png',
          text: '首页'
        },
        {
          pagePath: 'pages/functionMenu/common',
          iconPath: 'static/icon/tab/icon_xiaoxi.png',
          selectedIconPath: 'static/icon/tab/icon_xiaoxi_c.png',
          text: '工作'
        },
        {
          pagePath: 'pages/userInfo/common',
          iconPath: 'static/icon/tab/icon_wode.png',
          selectedIconPath: 'static/icon/tab/icon_wode_c.png',
          text: '个人信息'
        }
      ],
      popupShow: false
    }
  },
  //第一次加载
  created() {
    //获取所有页面
    let currentPages = getCurrentPages()
    let page = currentPages[currentPages.length - 1]
    this.path = page.route
  },
  //方法
  methods: {
    onPageJump(url) {
      if (this.path !== url) {
        uni.switchTab({
          url: '/' + url
        })
      }
    },
    onRaised() {
      this.popupShow = true
    }
  }
}
</script>
<style lang="scss" scoped>
@import '@/style/mixin.scss';
.footer_station {
  height: 100rpx;
  box-sizing: content-box;
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}
.footer_box {
  height: 100rpx;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  flex-direction: row;
  z-index: 502;
  box-sizing: content-box;
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}
.footer_bg {
  background-color: #fff;
}
.footer_item {
  position: relative;
  flex: 1;
}
.footer_nav_item {
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
}
.footer_nav_item:active {
  background-color: rgba($color: #fff, $alpha: 0.1);
}
.footer_nav_item_text {
  font-size: 24rpx;
  color: #999999;
  margin-top: 6rpx;
}
.footer_nav_item_text_active {
  color: #f9a633;
}
.footer_nav_item_image {
  width: 50rpx;
  height: 50rpx;
}
.footer_raised_item {
  position: absolute;
  top: -40rpx;
  left: 50%;
  transform: translateX(-50%);
  width: 120rpx;
  height: 120rpx;
  background-color: #fff;
  border-radius: 50%;
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  align-items: center;
  justify-content: center;
}
.footer_raised_item_image {
  width: 70rpx;
  height: 70rpx;
}
.popup_content {
  background-color: #fff;
  padding: 30rpx;
}
</style>
