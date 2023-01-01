import request from '@/utils/request'

export default {
  getAllSubject() {
    return request({
      url: `/eduservice/subject/getAllSubject`,
      method: 'get'
    })
  },
  getCoursePage(current, size, conditions) {
    return request({
      url: `/eduservice/course/current/${current}/size/${size}`,
      method: 'post',
      data: conditions
    })
  },
  getById(courseId) {
    return request({
      url: `/eduservice/course/getFrontCourseInfo/${courseId}`,
      method: 'get'
    })
  },
  getCommentPage(videoId, current, size) {
    return request({
      url: `eduservice/comment/${videoId}/current/${current}/size/${size}`,
      method: 'get'
    })
  },
  createComment(comment) {
    return request({
      url: `eduservice/comment/create`,
      method: 'post',
      data: comment
    })
  }
}
