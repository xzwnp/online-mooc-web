import request from '@/utils/request'

export default {

  getTeacherPage(current, size) {
    return request({
      url: `/eduservice/teacher/page/${current}/limit/${size}`,
      method: 'get'
    })
  },
  getById(courseId) {
    return request({
      url: `/eduservice/teacher/getById/${courseId}`,
      method: 'get'
    })
  }
}
