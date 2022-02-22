/**
 * 导入网络请求
 */
import { get, post } from '@/request/http';
// 导出获取所有操作api 树形结构
export const apiGetOperationList = p => get('/operation/getOperationList', p);
// 导出添加操作api
export const apiAddOperation = p => post('/operation/addOperation', p);
// 导出删除操作api
export const apiDeleteOperationById = p => post('/operation/deleteOperationById', p);
// 导出更新操作api
export const apiUpdateOperationById = p => post('/operation/updateOperationById', p);
// 导出获取当前用户是否具有操作权限api
export const apiGetOperationByUserIdOperationAddress = p =>
  get('/operation/getOperationByUserIdOperationAddress', p);
