<template>
  <div class='in-wrap'>
    <!-- 公共头引入 -->
    <header id='header'>
      <section class='container'>
        <h1 id='logo'>
          <a href='http://www.ynu.edu.cn/' title='云南大学'>
            <img src='~/assets/img/logo.png' width='100%' alt='云南大学'>
          </a>
        </h1>
        <div class='h-r-nsl'>
          <ul class='nav'>
            <router-link to='/' tag='li' active-class='current' exact>
              <a>首页</a>
            </router-link>
            <router-link to='/course' tag='li' active-class='current'>
              <a>课程</a>
            </router-link>
            <router-link to='/teacher' tag='li' active-class='current'>
              <a>名师</a>
            </router-link>
            <router-link to='/article' tag='li' active-class='current'>
              <a>文章</a>
            </router-link>
            <router-link to='/qa' tag='li' active-class='current'>
              <a>问答</a>
            </router-link>
          </ul>
          <!-- / nav -->
          <!-- / nav -->
          <ul class='h-r-login'>
            <li v-if='!loginInfo.id' id='no-login'>
              <a href='/login' title='登录'>
                <em class='icon18 login-icon'>&nbsp;</em>
                <span class='vam ml5'>登录</span>
              </a>
              |
              <a href='/register' title='注册'>
                <span class='vam ml5'>注册</span>
              </a>
            </li>
            <li v-if='loginInfo.id' id='is-login-one' class='mr10'>
              <a id='headerMsgCountId' href='#' title='消息'>
                <em class='icon18 news-icon'>&nbsp;</em>
              </a>
              <q class='red-point' style='display: none'>&nbsp;</q>
            </li>
            <li v-if='loginInfo.id' id='is-login-two' class='h-r-user' @click='showHelp=true'>
              <a title>
                <img
                  :src='loginInfo.avatar'
                  width='30'
                  height='30'
                  class='vam picImg'
                  alt
                >
                <span id='userName' class='vam disIb'>{{ loginInfo.nickname }}</span>
              </a>
              <a href='javascript:void(0);' title='退出' @click='logout()' class='ml5'>退出</a>
            </li>
            <!-- /未登录显示第1 li；登录后显示第2，3 li -->
          </ul>
          <aside class='h-r-search'>
            <form action='#' method='post'>
              <label class='h-r-s-box'>
                <input type='text' placeholder='输入你想学的课程' name='queryCourse.courseName' value>
                <button type='submit' class='s-btn' @click='searchCourseByName'>
                  <em class='icon18'>&nbsp;</em>
                </button>
              </label>
            </form>
          </aside>
        </div>
        <aside class='mw-nav-btn'>
          <div class='mw-nav-icon'></div>
        </aside>
        <div class='clear'></div>
      </section>
    </header>
    <!-- /公共头引入 -->

    <nuxt />

    <!-- 公共底引入 -->
    <footer id='footer'>
      <section class='container'>
        <div class>
          <h4 class='hLh30'>
            <span class='fsize18 f-fM c-999'>友情链接</span>
          </h4>
          <ul class='of flink-list'>
            <li>
              <a href='http://www.ynu.edu.cn/' title='云南大学' target='_blank'>云南大学</a>
            </li>
          </ul>
          <div class='clear'></div>
        </div>
        <div class='b-foot'>
          <section class='fl col-7'>
            <section class='mr20'>
              <section class='b-f-link'>
                <a href='#' title='关于我们' target='_blank'>关于我们</a>|
                <a href='#' title='联系我们' target='_blank'>联系我们</a>|
                <a href='#' title='帮助中心' target='_blank'>帮助中心</a>|
                <a href='#' title='资源下载' target='_blank'>资源下载</a>|
                <span>服务热线：010-12345678(北京) 0755-12345678(深圳)</span>
                <span>Email：xiao@ynu.icu</span>
              </section>
              <section class='b-f-link mt10'>
                <span>©课程版权?没有 </span>
              </section>
            </section>
          </section>
          <aside class='fl col-3 tac mt15'>
            <section class='gf-tx'>
              <span>
                <img src='~/assets/img/wx-icon.png' alt>
              </span>
            </section>
            <section class='gf-tx'>
              <span>
                <img src='~/assets/img/wb-icon.png' alt>
              </span>
            </section>
          </aside>
          <div class='clear'></div>
        </div>
      </section>
    </footer>
    <!-- /公共底引入 -->
    <!-- 帮助页面   -->
    <el-drawer
      title='帮助中心'
      :visible.sync='showHelp'
      direction='ttb'>
      <ul style='text-align:center;font-size: 20px;font-family: 楷体,serif;color: #666666;line-height: 30px'>
        <li>点击一门课程,然后在课程大纲处选择一个视频即可开始观看。</li>
        <li>点击课程资料会自动下载。</li>
        <li>需要登录才能观看视频和进行评论!</li>
      </ul>
    </el-drawer>
  </div>
</template>
<script>
import '~/assets/css/reset.css'
import '~/assets/css/theme.css'
import '~/assets/css/global.css'
import '~/assets/css/web.css'
import cookie from 'js-cookie'
import login from '../api/login'

export default {
  data() {
    return {
      token: '',
      loginInfo: {
        id: '',
        age: '',
        avatar: '',
        mobile: '',
        nickname: '',
        sex: ''
      },
      showHelp: false
    }
  },
  methods: {
    wxLogin(token) {
      cookie.set('myToken', token, { domain: 'localhost' })
      login.getMemberInfo()
        .then(response => {
          let userInfo = response.data.data.userInfo
          //需要转化为string形式再存入cookie
          userInfo = JSON.stringify(userInfo)
          cookie.set('loginInfo', userInfo, { domain: 'localhost' })
          //解决页面信息仍然显示未登录的方法:手动刷新
          window.location.href = '/'
        })
    },
    //从cookie中读取用户信息
    showInfo() {
      let loginInfo = cookie.get('loginInfo')
      if (loginInfo) {
        loginInfo = JSON.parse(loginInfo)
        this.loginInfo = loginInfo
      }
    },
    logout() {
      this.$confirm('确定要退出吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        cookie.remove('myToken')
        cookie.remove('loginInfo')
        this.loginInfo = {}
        this.$message.success('已退出')
        window.location.href = '/'
      })
    },
    searchCourseByName() {
      //todo
      //思路,路径参数为title=课程名,course/index 读取路径参数并保存到conditions.title
    }

  },
  created() {
    //使用微信登录时,后端重定向到首页,并在路径参数中携带token
    //获取这个token,保存为cookie
    let token = this.$route.query.token
    if (token) {
      this.wxLogin(token)
      this.showInfo()
    } else {
      this.showInfo()
    }
  }
}
</script>
