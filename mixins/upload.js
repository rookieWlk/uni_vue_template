import base from '@/config/baseUrl';
import store from '@/store';

export default {
  methods: {
    // 删除图片
    deletePic(event) {
      console.log(event);
      this[`fileList${event.name}`].splice(event.index, 1);
      if (typeof this.model.image === 'string') {
        const data = JSON.parse(this.model.image);
        data.splice(event.index, 1);
        this.model.image = JSON.stringify(data);
        console.log(data, 'data');
      }
    },
    // 新增图片
    async afterRead(event) {
      // 当设置 multiple 为 true 时, file 为数组格式，否则为对象格式
      let lists = [].concat(event.file);
      let fileListLen = this[`fileList${event.name}`].length;
      lists.map((item) => {
        this[`fileList${event.name}`].push({
          ...item,
          status: 'uploading',
          message: '上传中'
        });
      });
      for (let i = 0; i < lists.length; i++) {
        const result = await this.uploadFilePromise(lists[i].url);
        const uploadUrl = JSON.parse(result);
        console.log(result, 'result');
        let item = this[`fileList${event.name}`][fileListLen];
        this[`fileList${event.name}`].splice(fileListLen, 1, Object.assign(item, {
          status: 'success',
          message: '',
          url: base.baseUrl + uploadUrl.datas.path,
        }));
        fileListLen++;
      }
    },
    uploadFilePromise(url) {
      store.commit('setLoadingShow', true);

      return new Promise((resolve, reject) => {
        uni.uploadFile({
          url: `${base.baseUrl}/ossfile/upload`, // 仅为示例，非真实的接口地址
          filePath: url,
          name: 'file',
          header: {
            QXSZTOKEN: store.state.userInfo.token
          },
          formData: {},
          success: (res) => {
            const uploadedImage = JSON.parse(res.data).datas;
            console.log(uploadedImage, 'uploadedImage', this.model.image);
            if (typeof this.model.image === 'string' && this.model.image) {
              const data = JSON.parse(this.model.image);
              this.model.image = [...data, uploadedImage]; // 追加上传的图片到this.model.image数组中
            }
            setTimeout(() => {
              resolve(res.data);
              store.commit('setLoadingShow', false);
            }, 1000);
          },
          fail: (err) => {
            reject(err);
          }
        });
      });
    },
  }
};
