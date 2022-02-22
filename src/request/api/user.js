// 导入网络请求
import { get, post } from '@/request/http';
// 登陆验证api
export const apiLogin = p => post('/user/login', p);
// 发送注册验证码
export const apiSendRegistrationVerificationCode = p =>
  post('/user/sendRegistrationVerificationCode', p);
// 注册用户
export const apiRegister = p => post('/user/register', p);
// 根据当前登录者信息修改密码api
export const apiUpdateUserPasswordByLoginInformation = p =>
  post('/user/updateUserPasswordByLoginInformation', p);
// 添加用户api
export const apiAddUser = p => post('/user/addUser', p);
// 删除用户根据编号api
export const apiDeleteUserById = p => post('/user/deleteUserById', p);
// 更新用户根据编号api
export const apiUpdateUserById = p => post('/user/updateUserById', p);
// 获取用户数据根据条件分页查询api
export const apiGetUserListByConditionalPagination = p =>
  get('/user/getUserListByConditionalPagination', p);
// 更新用户状态根据编号api
export const apiUpdateUserStateById = p => post('/user/updateUserStateById', p);
// 初始化密码api
export const apiInitializationPassword = p => post('/user/initializationPassword', p);
// 获取登录者信息api
export const apiGetLoginInformation = p => get('/user/getLoginInformation', p);
// 发送邮箱验证码api
export const apiSendVerificationCode = p => post('/user/sendVerificationCode', p);
// 导出验证当前用户密码api
export const apiCheckPasswordByLoginInformation = p =>
  post('/user/checkPasswordByLoginInformation', p);
// 导出验证邮箱验证码api
export const apiCheckVerificationCode = p => post('/user/checkVerificationCode', p);
// 导出修改邮箱根据登录者信息api
export const apiUpdateEmailByLoginInformation = p => post('/user/updateEmailByLoginInformation', p);
// 导出学院专业用户树形结构数据api
export const apiGetDepartmentMajorUserTreeShapeList = p =>
  get('/user/getDepartmentMajorUserTreeShapeList', p);
