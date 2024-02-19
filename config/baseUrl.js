let baseUrl = ''
let socketUrl = ''
if (process.env.NODE_ENV === 'development') {
  // 开发环境
  // baseUrl = "http://localhost:7001/";
  // socketUrl = "ws://localhost:6001/";
  // baseUrl = "https://hqbc.qixsz.com/api";
  baseUrl = 'https://dxdj.qixsz.com/api'
  // socketUrl = "ws://8.129.186.35:6001/";
} else if (process.env.NODE_ENV === 'production') {
  // 生产环境
  baseUrl = 'https://dxdj.qixsz.com/api'
  // socketUrl = "ws://twin-ui.com:6001/";
}
const courtConfig = {
  //微信公众号APPID
  publicAppId: 'ww4cbccff826fcda4e',
  //请求接口
  baseUrl: baseUrl,
  //webSocket地址
  socketUrl: socketUrl,
  //平台名称
  platformName: '数字党建管理系统',
  //项目logo
  logoUrl: '../../static/demo/logo.png',
  //页面分享配置
  share: {
    title: '数字党建管理系统',
    // #ifdef MP-WEIXIN
    path: '/pages/home/home', //小程序分享路径
    // #endif
    // #ifdef H5 || APP-PLUS
    //公众号||APP分享
    desc: '数字党建管理系统', // 分享描述
    link: 'https://www.kemean.com/sameCity/18031201/index.html', // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
    imgUrl:
      'http://qn.kemean.cn/upload/201901/28/23bedfc34597482292ecd6dc107f6342' // 分享图标
    // #endif
  }
}
//手机号验证正则表达式
const phoneRegular = /^1\d{10}$/
//邮箱验证正则表达式
const mailRegular = /^\w+@\w+(\.[a-zA-Z]{2,3}){1,2}$/
//密码验证正则表达式
const passwordRegular = /^[a-zA-Z0-9]{4,10}$/
export default Object.assign(
  {
    phoneRegular,
    mailRegular,
    passwordRegular
  },
  courtConfig
)
