// 导入网络请求
import { get, post } from '@/request/http';
// 导出获取所有学院（根据条件分页）api
export const apiGetDepartmentListByConditionalPagination = p =>
  get('/department/getDepartmentListByConditionalPagination', p);
// 导出添加学院api
export const apiAddDepartment = p => post('/department/addDepartment', p);
// 导出删除学院api
export const apiDeleteDepartmentById = p => post('/department/deleteDepartmentById', p);
// 导出修改学院api
export const apiUpdateDepartmentById = p => post('/department/updateDepartmentById', p);
// 获取所有学院api
export const apiGetDepartmentList = p => get('/department/getDepartmentList', p);
