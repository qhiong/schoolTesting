/**
 * 导入网络请求
 */
import { get, post } from '@/request/http';
// 导出添加教学计划api
export const apiAddTeachingPlan = p => post('/teachingPlan/addTeachingPlan', p);
// 导出删除教学计划api
export const apiDeleteTeachingPlanById = p => post('/teachingPlan/deleteTeachingPlanById', p);
// 导出修改教学计划api
export const apiUpdateTeachingPlanById = p => post('/teachingPlan/updateTeachingPlanById', p);
// 导出根据条件分页获取教学计划api
export const apiGetTeachingPlanListByConditionalPagination = p =>
  get('/teachingPlan/getTeachingPlanListByConditionalPagination', p);
// 导出根据专业获取教学计划
export const apiGetTeachingPlanByMajorId = p => get('/teachingPlan/getTeachingPlanByMajorId', p);
// 导出根据登录用户专业获取教学计划api
export const apiGetTeachingPlanByLoginUserMajor = p =>
  get('/teachingPlan/getTeachingPlanByLoginUserMajor', p);
