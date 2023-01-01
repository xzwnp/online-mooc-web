import cookie from 'js-cookie'

export function checkLogin(_this) {
  if (cookie.get('loginInfo') == null) {
    //傻逼Nuxt不让用promise 会报错
    _this.$message.error('该功能需要登录才能使用!')
    _this.$router.push('/login')
  }
}
