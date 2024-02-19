<template>
  <view class="page">
    <z-nav-bar title="个人信息" backState="2000"></z-nav-bar>
    <public-module></public-module>
    <view class="cell_list">
      <view class="cell_left txt">昵称</view>
      <view class="cell_right arrow">{{ model.nickname }}</view>
    </view>
    <view class="cell_list">
      <view class="cell_left txt">手机号</view>
      <view class="cell_right arrow">{{ model.mobilePhone }}</view>
    </view>
    <view class="sign_outList" @click="viewInfo">
      <view class="sign_out">个人信息管理</view>
    </view>
    <view class="sign_outList" @click="show = true">
      <view class="sign_out">退出登录</view>
    </view>
    <z-navigation></z-navigation>
    <u-modal :show="show" :content="content" title="提示" showCancelButton @cancel="show = false"
      @confirm="signOut()"></u-modal>
  </view>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
export default {
  data() {
    return {
      model: {
        nickname: '',
        mobilePhone: '',
        department: '',
        postName: '',
        personId: '',
        personCode: '',
        identificationNumber: ''
      },
      show: false,
      content: '此操作将退出登录, 是否继续?'
    };
  },
  computed: {
    ...mapState(['userInfo'])
  },
  //第一次加载
  onLoad() { },
  //页面显示 
  onShow() {
    uni.hideTabBar();

    this.$http.post('/sysPerson/findByUser').then((res) => {
      this.model.nickname = res.cnname;
      this.model.mobilePhone = res.mobilePhone;
      this.model.postName = res.postName;
      this.model.personId = res.personId;
      this.model.personCode = res.personCode;
      this.model.department = res.department;
      this.model.departmentTranslate = res.departmentTranslate;
      this.model.isOutButton = res.isOutButton;
      this.model.identificationNumber = res.identificationNumber;
    });
  },
  //方法
  methods: {
    ...mapMutations(['setUserInfo']),
    viewInfo() {
      uni.navigateTo({
        url: '/subPages/pages/userInfo/index?item=' + JSON.stringify(this.model)
      });
    },
    signOut() {
      this.show = false;
      // 清除 token
      uni.removeStorageSync('token');
      uni.navigateTo({
        url: '/subPages/pages/login/login'
      });
    }
  },
  //页面隐藏
  onHide() { },
  //页面卸载
  onUnload() { },
  //页面下来刷新
  onPullDownRefresh() { },
  //页面上拉触底
  onReachBottom() { },
};
</script>
<style lang="scss" scoped>
@import '@/style/mixin.scss';

.cell_list {
  padding: 30rpx 30rpx;
  margin: 20rpx 30rpx 0 30rpx;
  border-radius: 8rpx;
}

.cell_right image {
  width: 140rpx;
  height: 140rpx;
  border-radius: 50%;
}

.sign_outList {
  padding: 30rpx 30rpx;
  margin: 20rpx 30rpx 0 30rpx;
  border-radius: 8rpx;
  background-color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
}

.sign_out {
  font-size: 30rpx;
}
</style>
