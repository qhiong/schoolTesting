/**
 * 导入网络请求
 */
import { get, post } from '@/request/http';
// 导出获取为选课年级根据专业编号
export const apiGetNotSelectedCourseGrade = p =>
  get('/courseSelection/getNotSelectedCourseGrade', p);
// 根据专业编号获取已选课信息api
export const apiGetSelectedCourseByMajorId = p =>
  get('/courseSelection/getSelectedCourseByMajorId', p);
// 删除选课信息根据编号api
export const apiDeleteCourseSelectionById = p =>
  post('/courseSelection/deleteCourseSelectionById', p);
// 导出添加选课api
export const apiAddCourseSelection = p => post('/courseSelection/addCourseSelection', p);
