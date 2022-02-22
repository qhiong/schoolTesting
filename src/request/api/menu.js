import { get, post } from '@/request/http'

// 根据请求头中的用户名获取菜单列表
export const apiGetMenuByUserJobNumber = p => get('/menu/getMenuByUserJobNumber', p)
// 获取所有菜单
export const apiGetMenuList = p => get('/menu/getMenuList', p)
// 添加菜单
export const apiAddMenu = p => post('/menu/addMenu', p)
// 删除菜单
export const apiDeleteMenuById = p => post('/menu/deleteMenuById', p)
// 更新菜单
export const apiUpdateMenuById = p => post('/menu/updateMenuById', p)
