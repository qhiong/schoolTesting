import { get, post } from '@/request/http'

// 根据角色编号获取菜单
export const apiGetMenuByRoleId = p => get('/roleMenu/getMenuByRoleId', p)
// 根据角色编号更新菜单
export const apiUpdateMenuByRoleId = p =>
  post('/roleMenu/updateMenuByRoleId', p)
