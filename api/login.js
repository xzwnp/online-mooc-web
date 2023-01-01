import request from '@/utils/request'
export default {
  login(formItem){
    return request({
      url: `/educenter/member/login`,
      method: 'post',
      data:formItem
    })
  },
  getMemberInfo(){
    return request({
      url: `/educenter/member/info`,
      method: 'get',
    })
  }
}
