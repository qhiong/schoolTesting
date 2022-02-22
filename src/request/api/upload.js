// 导入网络请求
import { getHttp } from '@/request/http'
// 导入vuex
import store from '@/store/index'
// 导出上传图片api
export const apiUploadImg = p => getHttp().post(store.state.fileUploadPath, p, {
  headers: { 'Content-Type': 'multipart/form-data' }
})
