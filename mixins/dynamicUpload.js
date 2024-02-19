import base from '@/config/baseUrl';
import store from '@/store';

export default {
  methods: {
    getFileList(index) {
      // 根据索引返回对应的 fileList 数据
      return this.fileList[index] || [];
    },
    getAllFileLists() {
      let allFileLists = [];
      for (let i = 1; i <= this.standList.length; i++) {
        let fileList = this.fileList[i];
        if (fileList && fileList.length > 0) {
          allFileLists.push(...fileList);
        }
      }
      return allFileLists;
    },

    deletePic(event) {
      this.fileList[event.name].splice(event.index, 1);
      if (typeof this.model.image === 'string') {
        try {
          const data = JSON.parse(this.model.image);
          if (Array.isArray(data)) {
            data.splice(event.index, 1);
            this.model.image = JSON.stringify(data);
            console.log(data, 'data');
          }
        } catch (error) {
          console.error('Error parsing JSON data:', error);
        }
      }
    },
    // 新增图片
    async afterRead(index, event) {
      const key = this.standList[index - 1];
      const lists = [].concat(event.file);
      const fileListLen = this.fileList[index] ? this.fileList[index].length : 0;

      if (!this.fileList[index]) {
        this.$set(this.fileList, index, []); // 初始化 fileList[index] 为一个空数组
      }

      lists.map(async (item) => {
        const fileType = item.name.split('.').pop().toLowerCase();
        console.log(fileType, 'fileType');
        const allowedFileTypes = ['jpeg', 'png', 'jpg','doc', 'docx', 'pdf'];
        if (!allowedFileTypes.includes(fileType)) {
          uni.showToast({
            title: '仅支持上传照片和文档文件（doc、docx、pdf）',
            icon: 'none'
          });
          return;
        }
        const newItem = {
          ...item,
          status: 'uploading',
          key: key.codDesc,
          message: '上传中',
        };
        this.fileList[index].push(newItem);
        const result = await this.uploadFilePromise(item.url);
        const uploadUrl = JSON.parse(result);
        const updatedItem = {
          ...newItem,
          status: 'success',
          message: '',
          key: key.codDesc,
          url: base.baseUrl + uploadUrl.datas.path,
        };
        const itemIndex = this.fileList[index].indexOf(newItem);
        this.fileList[index].splice(itemIndex, 1, updatedItem);
      });
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
    back() {
      uni.navigateBack({
        delta: 1,
      });
    }
  },
};