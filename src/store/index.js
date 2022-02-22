import { createStore } from 'vuex';

export default createStore({
  // 状态
  state: {
    // 文件下载地址
    fileDownPath: 'http://localhost:9000/uploads/',
    // 文件上传地址
    fileUploadPath: 'http://localhost:9000/upload/singleUpload',
    // 网络请求地址
    axiosHeaderPath: 'http://localhost:9000',

    // fileDownPath: 'http://192.168.244.128:9000/uploads/',
    // fileUploadPath: 'http://192.168.244.128:9000/upload/singleUpload',
    // axiosHeaderPath: 'http://192.168.244.128:9000',

    // fileDownPath: 'http://82.157.50.160:9000/uploads/',
    // fileUploadPath: 'http://82.157.50.160:9000/upload/singleUpload',
    // axiosHeaderPath: 'http://82.157.50.160:9000'
  },
  mutations: {},
  actions: {},
  modules: {},
});
