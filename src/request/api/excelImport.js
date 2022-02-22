// 引入axios
import axios from 'axios';
// 导出批量插入学院api
export const apiImportDepartment = p => axios.post('/department/importDepartment', p);
// 导出批量插入试题类型api
export const apiImportQuestionType = p => axios.post('/questionType/importQuestionType', p);
// 导出批量插入用户api
export const apiImportUser = p => axios.post('/user/importUser', p);
