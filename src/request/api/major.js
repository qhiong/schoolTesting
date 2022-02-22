// 导入网络请求
import { get, post } from '@/request/http';
// 导出增加专业api
export const apiAddMajor = p => post('/major/addMajor', p);
// 导出删除专业api
export const apiDeleteMajorById = p => post('/major/deleteMajorById', p);
// 导出修改专业api
export const apiUpdateMajorById = p => post('/major/updateMajorById', p);
// 导出获取专业根据学院编号api
export const apiGetMajorByDepartmentId = p => get('/major/getMajorByDepartmentId', p);
// 导出根据登录用户学院获取专业api
export const apiGetMajorByLoginUserDepartmentId = p =>
  get('/major/getMajorByLoginUserDepartmentId', p);
// 导出根据用户专业获取专业api
export const apiGetMajorByLoginUserMajorId = p => get('/major/getMajorByLoginUserMajorId', p);
