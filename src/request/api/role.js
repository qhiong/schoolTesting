// 导入网络请求
import { get, post } from '@/request/http'
// 导出获取所有角色api
export const apiGetRoleListByConditionalPagination = p => get('/role/getRoleListByConditionalPagination', p)
// 添加角色
export const apiAddRole = p => post('/role/addRole', p)
// 删除角色根据编号
export const apiDeleteRoleById = p => post('/role/deleteRoleById', p)
// 更新角色
export const apiUpdateRoleById = p => post('/role/updateRoleById', p)
// 导出获取所有角色api
export const apiGetRoleList = p => get('/role/getRoleList', p)
