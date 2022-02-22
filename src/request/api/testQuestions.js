/**
 * 导入网络请求
 */
import { get, post } from '@/request/http';
// 引入axios
import axios from 'axios';
// 导出获取试题根据条件分页api
export const apiGetTestQuestionsByConditionalPagination = p =>
  get('/testQuestions/getTestQuestionsByConditionalPagination', p);
// 导出删除试题根据编号api
export const apiDeleteTestQuestionsById = p => post('/testQuestions/deleteTestQuestionsById', p);
// 导出添加试题api
export const apiAddTestQuestions = p => post('/testQuestions/addTestQuestions', p);
// 导出修改试题根据编号api
export const apiUpdateTestQuestionsById = p => post('/testQuestions/updateTestQuestionsById', p);
// 导出获取试题根据课程组编号api
export const apiGetTestQuestionsByCourseGroupId = p =>
  get('/testQuestions/getTestQuestionsByCourseGroupId', p);
// 导出获取试题数量根据试题类型分组并满足课程编号试题难度api
export const apiGetTestQuestionsCountGroupByQuestionTypeByCourseIdTestQuestionsDifficulty = p =>
  get(
    '/testQuestions/getTestQuestionsCountGroupByQuestionTypeByCourseIdTestQuestionsDifficulty',
    p,
  );
// 导出解析试题word内容api
export const apiWordAnalysis = p => get('/testQuestions/wordAnalysis', p);
// 导出批量导入试题api
export const apiImportTestQuestions = p => axios.post('/testQuestions/importTestQuestions', p);
