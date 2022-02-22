// 导入网络请求
import { get, post } from '@/request/http';
// 导出根据课程组编号获取用户编号数组api
export const apiGetUserIdByCourseGroupId = p => get('/userCourseGroup/getUserIdByCourseGroupId', p);
// 导出修改用户根据课程组编号api
export const apiUpdateUserByCourseGroupId = p =>
  post('/userCourseGroup/updateUserByCourseGroupId', p);
// 导出根据课程组编号获取用户课程组api
export const apiGetUserCourseGroupByCourseGroupId = p =>
  get('/userCourseGroup/getUserCourseGroupByCourseGroupId', p);
// 导出根据用户课程组修改课程组长api
export const apiUpdateUserCourseGroupLeaderByCourseGroupId = p =>
  post('/userCourseGroup/updateUserCourseGroupLeaderByCourseGroupId', p);
