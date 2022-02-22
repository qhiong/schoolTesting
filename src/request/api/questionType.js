// 导入网络请求
import { get, post } from '@/request/http'
// 导出根据条件获取试题类型分页数据api
export const apiGetQuestionTypeByConditionalPagination = p => get('/questionType/getQuestionTypeByConditionalPagination', p)
// 导出添加试题类型api
export const apiAddQuestionType = p => post('/questionType/addQuestionType', p)
// 导出删除试题类型根据编号api
export const apiDeleteQuestionTypeById = p => post('/questionType/deleteQuestionTypeById', p)
// 导出更新试题类型api
export const apiUpdateQuestionTypeById = p => post('/questionType/updateQuestionTypeById', p)
// 导出获取所有试题类型api
export const apiGetQuestionTypeList = p => get('/questionType/getQuestionTypeList', p)
