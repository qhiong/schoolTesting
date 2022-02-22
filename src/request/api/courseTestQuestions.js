/**
 * 引入网络请求
 */
import { get, post } from '@/request/http'

// 根据课程编号获取试题编号列表api
export const apiGetTestQuestionsIdByCourseId = p => get('/courseTestQuestions/getTestQuestionsIdByCourseId', p)
// 根据课程编号更改试题pi
export const apiUpdateTestQuestionsByCourseId = p => post('/courseTestQuestions/updateTestQuestionsByCourseId', p)
