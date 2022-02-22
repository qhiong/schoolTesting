import axios from 'axios';
import NProgress from 'nprogress';
import QS from 'qs';
import 'nprogress/nprogress.css';
import { ElMessage } from 'element-plus';
import store from '@/store/index';

const http = axios;
// 默认请求公共地址
http.defaults.baseURL = store.state.axiosHeaderPath;
// 最大响应时间
http.timeout = 3 * 1000;
// 前端跨域传递Cookie设置
http.defaults.withCredentials = true;
// post请求头设置
http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
// 请求前置拦截器 添加token
http.interceptors.request.use(
  config => {
    // 将本地存储的token 放在请求头中
    config.headers.Authorization = window.localStorage.getItem('token');
    // 开启进度条
    NProgress.start();
    return config;
    // eslint-disable-next-line node/handle-callback-err
  },
  // eslint-disable-next-line node/handle-callback-err
  error => {
    // 提示发生异常
    ElMessage.error('网络错误提示');
    // 结束进度条动画
    NProgress.done();
    // eslint-disable-next-line prefer-promise-reject-errors
    return Promise.reject('网络错误提示');
  },
);
// 请求响应拦截器
http.interceptors.response.use(
  config => {
    // 关闭进度条
    NProgress.done();
    // eslint-disable-next-line eqeqeq
    if (config.data.code == 200) {
      return config;
    }
    // 返回错误信息
    ElMessage.error(config.data.msg);
    // eslint-disable-next-line prefer-promise-reject-errors
    return Promise.reject('网络错误提示');
    // eslint-disable-next-line node/handle-callback-err
  },
  // eslint-disable-next-line node/handle-callback-err
  error => {
    // 结束进度条动画
    NProgress.done();
    ElMessage.error('网络错误提示');
    // eslint-disable-next-line prefer-promise-reject-errors
    return Promise.reject('网络错误提示');
  },
);

/**
 * get方法，对应get请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function get(url, params) {
  return new Promise((resolve, reject) => {
    http
      .get(url, {
        params: params,
      })
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err.data);
      });
  });
}

/**
 * post方法，对应post请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function post(url, params) {
  return new Promise((resolve, reject) => {
    // indices false 将数组a[0]=1&a[1]=2 转换为 a=1&a=2
    axios
      .post(url, QS.stringify(params, { indices: false }))
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err.data);
      });
  });
}
// 导出获取原始http请求对象
export function getHttp() {
  console.log(http);
  return http;
}
