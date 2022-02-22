/**
 * 导入网络请求
 */
import { get, post } from '@/request/http';
// 导出添加课程api
export const apiAddCourse = p => post('/course/addCourse', p);
// 导出删除课程根据编号api
export const apiDeleteCourseById = p => post('/course/deleteCourseById', p);
// 导出修改课程api
export const apiUpdateCourseById = p => post('/course/updateCourseById', p);
// 导出获取所有课程分页数据api
export const apiGetCourseListByConditionalPagination = p =>
  get('/course/getCourseListByConditionalPagination', p);
// 导出获取课程根据课程组编号
export const apiGetCourseByCourseGroupId = p => get('/course/getCourseByCourseGroupId', p);
// 导出导入课程api
export const apiImportCourse = p => post('/course/importCourse', p);
// 导出根据教学计划编号开课学期课程名查询课程api
export const apiGetCourseByTeachingPlanIdCourseSemesterCourseName = p =>
  get('/course/getCourseByTeachingPlanIdCourseSemesterCourseName', p);
