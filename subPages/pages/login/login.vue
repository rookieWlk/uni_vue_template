<template>
  <view class="login">
    <view class="login-container">
      <z-nav-bar :shadow="false" backState="2000" title="登录"></z-nav-bar>
      <div class="avatar-container">
        <img  alt="登录头像">
      </div>
      <view class="content">
        <u--form :model="model" ref="uForm">
          <u-form-item prop="model.userName" ref="item">
            <u--input name="mobile" prefixIcon="account-fill" prefixIconStyle="color: #e32322" border="surround"
              v-model="model.userName" placeholder="请输入手机号码">
            </u--input>
          </u-form-item>

          <u-form-item prop="model.password" ref="item">
            <u--input name="password" prefixIcon="lock-fill" prefixIconStyle="color: #e32322" border="surround"
              type="password" v-model="model.password" placeholder="请输入密码" maxlength="20"></u--input>
          </u-form-item>
        </u--form>
        <view class="action">
          <u-button @click="onSubmit" color="#e32322">
            登录
          </u-button>
        </view>
        <view class="protocol_box">
          <view class="select" :class="{ active: agree }" @click="agree = !agree"></view>
          我已同意
          <text @click="onPageJump('/subPages/pages/login/privacy')">《用户隐私协议》</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { mapMutations } from 'vuex';
export default {
  data() {
    return {
      model: {
        userName: '',
        password: '',
        loginType: 'app'
      },
      checkboxList: [],
      agree: false,
      remember: uni.getStorageSync('remember') || ''
    };
  },
  //第一次加载
  onLoad(e) {
    this.logo = this.$base.logoUrl;
    // #ifdef APP-PLUS
    this.isIos = plus.os.name == 'iOS';
    let systemInfo = uni.getSystemInfoSync();
    this.system = parseFloat(systemInfo['system'].replace(/[a-zA-Z]/g, ''));
    this.isWeixin = plus.runtime.isApplicationExist({
      pname: 'com.tencent.mm',
      action: 'weixin://'
    });
    // #endif
  },
  //页面显示
  onShow() {
    // 如果勾选了记住密码，在这里可以根据需要使用 this.model.password
    if (this.remember.includes('remember')) {
      const rememberPassword = localStorage.getItem('rememberPassword');
      const remember = localStorage.getItem('remember');
      const data = JSON.parse(remember);
      if (rememberPassword && data.includes('remember')) {
        this.model = JSON.parse(rememberPassword);
        this.checkboxList = data;
      } else {
        return;
      }
    }
  },
  //方法
  methods: {
    ...mapMutations(['setUserInfo']),
    onPageJump(url) {
      uni.navigateTo({
        url: url
      });
    },
    checkboxChange(value) {
      if (value.includes('remember')) {
        console.log(value);
        this.remember = value;
        localStorage.setItem('remember', JSON.stringify(this.remember));
      } else {
        this.remember = '';
        localStorage.removeItem('remember');
      }
    },

    onSubmit() {
      if (!this.agree) {
        uni.showToast({
          title: "请先同意《用户协议》和《隐私协议》",
          icon: "none",
        });
        return;
      } else {
        if (this.model.userName === '' || this.model.password === '') {
          uni.showToast({
            title: '请填写账号和密码',
            icon: 'none',
            duration: 2000
          });
          return;
        }
        const data = JSON.stringify(this.model);
        this.$http.post('/oauth/login', data).then((res) => {
          this.setUserInfo(res);
          uni.showToast({
            title: '登录成功',
            duration: 2000,
            success: () => {
              uni.switchTab({
                url: '/pages/home/index'
              });
            }
          });
        });
      }
      // console.log(this.model);
      // localStorage.setItem('rememberPassword', JSON.stringify(this.model));
      // 检查必填项是否为空

    }
  },
};
</script>
<style lang="scss" scoped>
.protocol_box {
  margin-top: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  font-size: 28rpx;
  color: #333333;

  .select {
    width: 36rpx;
    height: 36rpx;
    background-image: url("../../static/icon/ic_gender_unselected.png");
    background-position: center center;
    background-repeat: no-repeat;
    background-size: 100% auto;
    margin-right: 15rpx;

    &.active {
      background-image: url("../../static/icon/ic_agreed.png");
    }
  }

  >text {
    color: #dd0000;
  }
}

.login {
  background-size: cover;
  height: 100vh;

  .login-container {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .avatar-container {
    text-align: center;
    margin-top: 100px;
  }

  .avatar-container img {
    width: 100px;
    height: 100px;
    // border-radius: 50%;
  }

  .content {
    margin: 20px;
    width: 90%;

    .action {
      margin: 40rpx;
    }


    ::v-deep .u-input {
      background-color: #eeeeee;

    }
  }
}
</style>
