/**
 * 导入网络请求
 */
import { get, post } from '@/request/http';

// 导出添加课程组api
export const apiAddCourseGroup = p => post('/courseGroup/addCourseGroup', p);
// 导出删除课程组根据编号api
export const apiDeleteCourseGroupById = p => post('/courseGroup/deleteCourseGroupById', p);
// 导出修改课程组根据编号api
export const apiUpdateCourseGroupById = p => post('/courseGroup/updateCourseGroupById', p);
// 导出获取课程组根据条件分页api
export const apiGetCourseGroupByConditionalPagination = p =>
  get('/courseGroup/getCourseGroupByConditionalPagination', p);
// 获取课程组信息根据课程组名
export const apiGetCourseGroupByLoginInformationCourseGroupName = p =>
  get('/courseGroup/getCourseGroupByLoginInformationCourseGroupName', p);
// 导出获取课程组根据登录用户专业api
export const apiGetCourseGroupByLoginUserMajor = p =>
  get('/courseGroup/getCourseGroupByLoginUserMajor', p);
