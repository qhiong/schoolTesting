/**
 * 引入网络请求
 */
import { get, post } from '@/request/http';
// 导出添加试卷api
export const apiAddTestPaper = p => post('/testPaper/addTestPaper', p);
// 导出获取试卷根据课程编号api
export const apiGetTestPaperByCourseId = p => get('/testPaper/getTestPaperByCourseId', p);
// 导出删除试卷根据试卷编号api
export const apiDeleteTestPaperByTestPaperId = p =>
  post('/testPaper/deleteTestPaperByTestPaperId', p);
// 导出获取试卷根据登录者api
export const apiGetTestPaperByLoginUser = p => get('/testPaper/getTestPaperByLoginUser', p);
// 导出生成试卷api
export const apiGenerateTestPaper = p => post('/testPaper/generateTestPaper', p);
// 导出获取试卷根据条件api
export const apiGetSetTestPaperByConditional = p =>
  get('/testPaper/getSetTestPaperByConditional', p);
// 导出生成试卷答案api
export const apiGenerateTestPaperAnswers = p => post('/testPaper/generateTestPaperAnswers', p);
