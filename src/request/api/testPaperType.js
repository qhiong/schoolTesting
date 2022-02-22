// 导入网络请求
import { get, post } from '@/request/http';
// 导出获取所有试卷类型根据条件分页 api
export const apiGetTestPaperTypeByConditionalPagination = p =>
  get('/testPaperType/getTestPaperTypeByConditionalPagination', p);
// 导出删除试卷类型根据编号api
export const apiDeleteTestPaperTypeById = p => post('/testPaperType/deleteTestPaperTypeById', p);
// 导出添加试卷类型api
export const apiAddTestPaperType = p => post('/testPaperType/addTestPaperType', p);
// 导出修改试卷类型api
export const apiUpdateTestPaperType = p => post('/testPaperType/updateTestPaperType', p);
// 导出获取所有试卷类型api
export const apiGetTestPaperTypeList = p => get('/testPaperType/getTestPaperTypeList', p);
