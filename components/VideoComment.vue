<template>
  <div id='container'>
    <div>
      <comment
        @doSend='doSend($event)'
        @doChidSend='doChidSend(arguments)'
        :commentList='commentList'
        :commentNum='commentNum'
        :label='label'
        :avatar='userInfo.avatar'
        :placeholder='placeholder'
        :minRows='minRows'
        :maxRows='maxRows'
      ></comment>
    </div>
  </div>
</template>

<script>
import comment from 'bright-comment' // 开发文件
import courseApi from '@/api/course'
import cookie from 'js-cookie'

export default {
  name: 'videoComment',
  components: { comment },
  props: ['videoId'],
  data() {
    return {
      label: 'SVIP',
      placeholder: '说点什么吧',
      minRows: 4,
      maxRows: 4,
      userInfo: {
        id: '',
        nickname: '',
        avatar: ''
      },
      commentList: [],
      commentNum: 0
    }
  },
  created() {
    this.getCommentList()
    this.getUserInfo()
  },
  methods: {
    getUserInfo() {
      let loginInfo = cookie.get('loginInfo')
      if (loginInfo) {
        loginInfo = JSON.parse(loginInfo)
        this.userInfo = loginInfo
      } else {
      }
    },
    getCommentList() {
      courseApi.getCommentPage(this.videoId, 1, 10)
        .then((res) => {
          console.log('评论信息:', res)
          if (!res.data.data) {
            this.$message.error('获取评论信息失败!')
            return
          }
          this.commentNum = res.data.data.total
          this.commentList = res.data.data.comments.map((comment) => {
            let childrenList = []
            if (comment.children) {
              childrenList = comment.children.map((child) => {
                return {
                  id: child.id,
                  content: child.content,
                  commentUser: {
                    id: child.senderNickname,
                    nickName: child.senderNickname,
                    avatar: child.senderAvatar
                  },
                  targetUser: {
                    nickName: child.replyTo
                  },
                  createDate: child.gmtCreate
                }
              })
            }
            console.log(childrenList)
            return {
              id: comment.id,
              content: comment.content,
              commentUser: {
                id: comment.senderNickname,
                nickName: comment.senderNickname,
                avatar: comment.senderAvatar
              },
              createDate: comment.gmtCreate,
              childrenList: childrenList
            }
          })

        })
    },
    doSend(content) {
      console.log(this.userInfo)
      let comment = {
        videoId: this.videoId,
        content: content,
        senderId: this.userInfo.id,
        senderNickname: this.userInfo.nickname,
        senderAvatar: this.userInfo.avatar
      }
      courseApi.createComment(comment)
        .then((res) => {
          if (res.data.code === 20000) {
            this.$message.success('发送成功!')
            this.getCommentList()
          }
        })
    },
    doChidSend(args) {
      let [ content, replyTo, pid ] = args
      console.log('评论区发送按钮点击事件：', content, replyTo, pid)
      let comment = {
        videoId: this.videoId,
        content: content,
        senderId: this.userInfo.id,
        senderNickname: this.userInfo.nickname,
        senderAvatar: this.userInfo.avatar,
        replyTo: replyTo,
        pid: pid
      }
      courseApi.createComment(comment).then((res) => {
        if (res.data.code === 20000) {
          this.$message.success('发送成功!')
          this.getCommentList()
        }
      })
    }
  }
}
</script>

<style>
#container {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
