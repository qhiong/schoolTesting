import { get, post } from '@/request/http'

// 根据角色编号获取菜单api
export const apiGetRoleByUserId = p => get('/userRole/getRoleByUserId', p)
// 根据角色编号更改菜单api
export const apiUpdateRoleByUserId = p => post('/userRole/updateRoleByUserId', p)
