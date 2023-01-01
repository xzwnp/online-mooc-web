<template>
  <div class='main'>
    <div class='title'>
      <a href='/login'>登录</a>
      <span>·</span>
      <a class='active' href='/register'>注册</a>
    </div>

    <div class='sign-up-container'>
      <el-form ref='userForm' :model='params'>

        <el-form-item class='input-prepend restyle' prop='nickname'
                      :rules="[{ required: true, message: '请输入你的昵称', trigger: 'blur' }]">
          <div>
            <el-input type='text' placeholder='你的昵称' v-model='params.nickname' />
            <i class='iconfont icon-user' />
          </div>
        </el-form-item>

        <el-form-item class='input-prepend restyle no-radius' prop='mobile'
                      :rules="[{ required: true, message: '请输入手机号码', trigger: 'blur' },{validator: checkPhone, trigger: 'blur'}]">
          <div>
            <el-input type='text' placeholder='手机号' v-model='params.mobile' />
            <i class='iconfont icon-phone' />
          </div>
        </el-form-item>

        <el-form-item class='input-prepend' prop='password'
                      :rules="[{ required: true, message: '请输入密码', trigger: 'blur' }]">
          <div>
            <el-input type='password' placeholder='设置密码' v-model='params.password' />
            <i class='iconfont icon-password' />
          </div>
        </el-form-item>

        <el-form-item class='' prop='avatar' style='display: flex;align-items: center'>
          <span style='color: #666'>上传头像(可选):</span>
          <el-upload
            class='avatar-uploader'
            :action='baseUrl+"/eduoss/fileoss"'
            :show-file-list='false'
            :on-success='handleAvatarSuccess'
            :on-error='handleAvatarFail'
            :before-upload='beforeAvatarUpload'>
            <img v-if='params.avatar' :src='params.avatar' class='avatar'>
            <i v-else class='el-icon-plus avatar-uploader-icon'></i>
          </el-upload>

        </el-form-item>

        <div class='btn'>
          <input type='button' class='sign-up-button' value='注册' @click='submitRegister()'>
        </div>
        <p class='sign-up-msg'>
          点击 “注册” 即表示您同意并愿意遵守
          <br>
          <a target='_blank' href='http://www.jianshu.com/p/c44d171298ce'>用户协议</a>
          和
          <a target='_blank' href='http://www.jianshu.com/p/2ov8x3'>隐私政策</a> 。
        </p>
      </el-form>
      <!-- 更多注册方式 -->
      <div class='more-sign'>
        <h6>社交帐号直接注册</h6>
        <ul>
          <li><a id='weixin' class='weixin' target='_blank' href='http://huaan.free.idcfengye.com/api/ucenter/wx/login'><i
            class='iconfont icon-weixin' /></a></li>
          <li><a id='qq' class='qq' target='_blank' href='#'><i class='iconfont icon-qq' /></a></li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import '~/assets/css/sign.css'
import '~/assets/css/iconfont.css'
import register from '@/api/register'
import { baseUrl } from '@/utils/request'

export default {
  layout: 'sign',
  data() {
    return {
      params: {
        mobile: '',
        code: '',
        nickname: '',
        password: '',
        avatar: null
      },
      baseUrl
    }
  },
  methods: {
    //获取手机验证码 懒得做了
    getCodeFun() {
      register.sendCode(this.params.mobile)
        .then(response => {
          if (Number(response.data.code) !== 20000) {
            this.$message.error('发送失败!')
            return
          }
          this.$message.success('发送成功!')
          this.sending = false
          this.timeDown()
        })
    },
    handleAvatarSuccess(res, file) {
      this.params.avatar = res.data.url
    },
    handleAvatarFail(err) {
      this.$message('图片上传服务不可用')
    },
    beforeAvatarUpload(file) {
    },
    submitRegister() {
      //this.$refs['userForm'].validate() 这个是elementUI提供的表单校验
      this.$refs['userForm'].validate((valid) => {
        if (valid) {
          register.registerMember(this.params).then(response => {
            //提示注册成功
            this.$message({
              type: 'success',
              message: '注册成功'
            })
            this.$router.push({ path: '/login' })
          })
        }
      })
    },
    //点击发送验证码后进入倒计时,需要过一段时间才能点击发送
    timeDown() {
      this.codeTest = 60
      let id = setInterval(() => {
        this.codeTest--
        if (this.codeTest <= 0) {
          this.sending = true
          this.codeTest = '获取验证码'
          clearInterval(id)
        }
      }, 1000)
    },
    checkPhone(rule, value, callback) {
      //debugger
      if (!(/^1[34578]\d{9}$/.test(value))) {
        return callback(new Error('手机号码格式不正确'))
      }
      return callback()
    }
  }
}
</script>

<style scoped>
.avatar-uploader {
  width: 100px;
  height: 100px;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader:hover {
  border-color: #409EFF;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  line-height: 100px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
