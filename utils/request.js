import axios from 'axios'
import cookie from 'js-cookie'
import { Message, MessageBox } from 'element-ui'
// 创建axios实例,配置请求的url,同时配置request和response的拦截器
export const DOMAIN = 'demo.ynu.icu'
export const baseUrl = 'http://' + DOMAIN + ':9001'
const service = axios.create({
  baseURL: baseUrl, // api的base_url
  timeout: 20000 // 请求超时时间
})

//请求拦截器,为每次请求加上token
// http request 拦截器
service.interceptors.request.use(
  config => {
    //判断token是否存在,如果存在,就随着请求头一起发送
    if (cookie.get('myToken')) {
      config.headers['Authorization'] = cookie.get('myToken')
    }
    return config
  },
  err => {
    return Promise.reject(err)
  })
// http response 拦截器
service.interceptors.response.use(
  response => {
    //打印错误信息
    if (response.data.code == 20001) {
      Message({
        message: response.data.message,
        type: 'error',
        duration: 3 * 1000
      })
      return Promise.reject(response)
    }
    //debugger
    if (response.data.code == 28004) {
      console.log('response.data.resultCode是28004')
      // 返回 错误代码-1 清除ticket信息并跳转到登录页面
      //debugger
      window.location.href = '/login'
      return
    } else {
      if (response.data.code !== 20000) {
        //25000：订单支付中，不做任何提示
        if (response.data.code != 25000) {
          Message({
            message: response.data.message || 'error',
            type: 'error',
            duration: 5 * 1000
          })
        }
      } else {
        return response
      }
    }
  },
  error => {
    return Promise.reject(error.response)   // 返回接口返回的错误信息
  })

export default service
