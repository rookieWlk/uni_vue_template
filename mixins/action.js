export default {
  methods: {
    submit() {
      this.$http.post('/pbActivitySignIn/insert', this.model).then(res => {
        uni.showToast({
          title: '提交成功',
        });
        setTimeout(() => {
          uni.navigateBack({
            delta: 2
          });
        });
      });
    },
    back() {
      uni.navigateBack({
        delta: 1
      });
    },
  }
};