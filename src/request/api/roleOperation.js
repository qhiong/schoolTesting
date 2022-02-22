/**
 * 导入网络请求
 */
import { get, post } from '@/request/http'
// 导出根据角色编号获取操作编号数组api
export const apiGetOperationByRoleId = p =>
  get('/roleOperation/getOperationByRoleId', p)
// 导出修改操作根据角色编号
export const apiUpdateOperationByRoleId = p =>
  post('/roleOperation/updateOperationByRoleId', p)
