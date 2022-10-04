import axios from 'axios'
import { Message } from 'element-ui'
import router from '../router/index'


axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8';
// axios.defaults.headers['Access-Control-Allow-Origin']='*';
//  axios.defaults.headers['Access-Control-Allow-Methods']='PUT,POST,GET,DELETE,OPTIONS';
// axios.defaults.headers['Access-Control-Allow-Headers']='X-Requested-With,Content-Type';

// 创建axios实例
const service = axios.create({
  // baseURL: '/', // api的base_url
  withCredentials: true,
  timeout: 30000 // 请求超时时间
})

// request拦截器
service.interceptors.request.use(config => {
  // const token = localStorage.getItem('token')
  const token = sessionStorage.getItem('token')

  if (token) {
    config.params = Object.assign({}, config.params, { token: token })
    /* let obj = JSON.stringify(Object.assign({}, config.params, { token: token })).replace(/\</g, '&lt;').replace(/\>/g, '&gt;')
    config.params = JSON.parse(obj)*/
  }
  return config
}, error => {
  // Do something with request error
  Promise.reject(error)
})

// respone拦截器
service.interceptors.response.use(
    response => {
      const res = response.data
      if (res.code && res.code !== 0 && res.code !== 200 && res.code !== '200') {
       /* // token已过期，重新登录
        if (res.code === 401 || res.code === 556 || res.code === 557 ) {
          // if (res.code === 401) {
          Promise.reject(res)
          localStorage.clear()
          sessionStorage.removeItem('token')
          router.push('/login')
          return message(res.msg, 'warning')
        }
        if(res.code === 300){
          message(res.msg, 'warning')
          return response.data
        }*/
        message(res.msg, 'error')
        return Promise.reject(res)
      }
      return response.data || response
    },
    error => {
      return Promise.reject(error)
    }
)

export function message(text, type) {
  Message({
    message: text,
    type: type,
    duration: 5 * 1000
  })
}

export default service
