<template>
  <view>
    <view style="width: 60px; height: 60px">
      <slot></slot>
    </view>
    <waterMark
      :index="index"
      :ref="'watermark' + index"
      @waterMark="waterMark"
    ></waterMark>
  </view>
</template>
<script
  type="text/javascript"
  src="https://webapi.amap.com/maps?v=1.4.15&key=1d6bcd1030fd2991a6e03eb8dce58c56"
></script>
<script>
import waterMark from './watermark.vue'
export default {
  components: {
    // 2.注册局部组件
    waterMark
  },
  props: {
    index: {
      type: [Number, String],
      default: 0
    }
  },
  data() {
    return {
      imageList: []
    }
  },
  methods: {
    // 选择图片
    chooseImage() {
      uni.chooseImage({
        count: 9, // 限制的图片数量
        sizeType: ['compressed'], // original 原图，compressed 压缩图，默认二者都有
        sourceType: ['camera'], // album 从相册选图，camera 使用相机，默认二者都有
        success: (res) => {
          var imgPathList = res.tempFilePaths
          if (imgPathList.length > 0) {
            this.addImages(imgPathList)
          }
        },
        fail: (err) => {
          if ('chooseImage:fail cancel' == err.errMsg) {
            uni.showToast({
              icon: 'none',
              title: '取消了选择'
            })
          }
        }
      })
    },
    // 添加图片
    addImages(filePaths) {
      if (filePaths.length > 0) {
        let userInfo = uni.getStorageSync('userInfoLogin')
        var fillTexts = [
          // '拍摄人：' + userInfo.nickName,
          // '时间：' + this.getNowTime()
        ]
        // 添加水印
        console.log(filePaths, 'filePaths', this.index)
        this.$refs['watermark' + this.index].addWaterMark({
          filePaths,
          fillTexts
        })
      }
    },
    /**
     * 水印添加回调，在H5平台下，filePath 为 base64
     */
    waterMark(filePath) {
      this.imageList = []
      this.imageList.push(filePath)
      console.log(this.imageList, 'this.imageList')
      this.$emit('getImageList', this.imageList)
    },
    /**
     * 获取当前时间
     */
    getNowTime() {
      var date = new Date(),
        year = date.getFullYear(),
        month = date.getMonth() + 1,
        day = date.getDate(),
        hour = date.getHours() < 10 ? '0' + date.getHours() : date.getHours(),
        minute =
          date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes(),
        second =
          date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
      month >= 1 && month <= 9 ? (month = '0' + month) : ''
      day >= 0 && day <= 9 ? (day = '0' + day) : ''
      return (
        year +
        '-' +
        month +
        '-' +
        day +
        ' ' +
        hour +
        ':' +
        minute +
        ':' +
        second
      )
    }
    // 获取当前位置
    // getLocation(callback) {
    //   // 初始化高德地图定位
    //   let mapObj = new AMap.Map('iCenter')
    //   mapObj.plugin('AMap.Geolocation', function () {
    //     let geolocation = new AMap.Geolocation({
    //       enableHighAccuracy: true,
    //       timeout: 10000,
    //       maximumAge: 0,
    //       convert: true,
    //       showButton: true,
    //       buttonPosition: 'LB',
    //       buttonOffset: new AMap.Pixel(10, 20),
    //       showMarker: true,
    //       showCircle: true,
    //       panToLocation: true,
    //       zoomToAccuracy: true
    //     })
    //     mapObj.addControl(geolocation)
    //     geolocation.getCurrentPosition((status, result) => {
    //       if (status === 'complete') {
    //         console.log(result.position, '++++++++++++++-----------')
    //         const location = {
    //           lng: result.position.lng,
    //           lat: result.position.lat
    //         }
    //         callback(location)
    //         
    //       } else {
    //         Toast.fail('定位失败', 1, () => {
    //           props.dispatch({
    //             type: 'studentWorkStudy/changeCurrentAddress',
    //             currentAddress: '定位失败'
    //           })
    //         })
    //       }
    //     })
    //   })
    // }
  }
}
</script>
<style scoped>
.ul {
  border: red solid 1px;
  text-align: center;
  margin-right: 12px;
  position: relative;
  min-height: 100px;
}
.ul .li .img {
  display: block;
  width: 20px;
}
</style>
