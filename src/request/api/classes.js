/**
 * 引入网络请求
 */
import { get, post } from '@/request/http';

// 获取所有班级根据条件分页api
export const apiGetClassesListByConditionalPagination = p =>
  get('/classes/getClassesListByConditionalPagination', p);
// 添加班级api
export const apiAddClasses = p => post('/classes/addClasses', p);
// 删除班级根据编号api
export const apiDeleteClassesById = p => post('/classes/deleteClassesById', p);
// 更新班级根据编号api
export const apiUpdateClassesById = p => post('/classes/updateClassesById', p);
// 获取班级根据专业年级
export const apiGetClassesByMajorIdGrade = p => get('/classes/getClassesByMajorIdGrade', p);
