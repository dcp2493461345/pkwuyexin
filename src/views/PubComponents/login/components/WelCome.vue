<template>
  <el-form ref="loginForm" :model="loginForm" class="login-form" label-position="left">
    <!-- 标题 -->
    <h3 class="title-container">欢迎登录</h3>
    <!-- 用户名 -->
    <el-form-item prop="username" class="wy-form-item">
      <span class="icon-container">
        <svg-icon icon-class="username1" />
      </span>
      <el-input
        ref="username"
        v-model="loginForm.username"
        placeholder="请输入帐号"
        name="username"
        type="text"
        @keyup.enter.native="handleLogin"
      />
    </el-form-item>
    <div class="mistake-toast">
      <p v-show="true" class="username-toast">{{ nameMsg }}</p>
    </div>
    <!-- 密码 -->
    <el-form-item prop="password">
      <span class="icon-container">
        <svg-icon icon-class="lock2" />
      </span>
      <el-input
        ref="password"
        :key="passwordType"
        v-model="loginForm.password"
        placeholder="请输入密码"
        name="password"
        :type="passwordType"
        class="input1"
        @keyup.enter.native="handleLogin"
      />
      <span class="show-pwd" @click="showPwd">
        <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
      </span>
    </el-form-item>
    <div class="mistake-toast toast1">
      <p v-show="true" class="password-toast">{{ pwdMsg }}</p>
    </div>
    <!-- //忘记密码 -->
    <div class="forget" @click="foundPwd">忘记密码？</div>
    <!-- 提交 -->
    <el-button
      :loading="loading"
      type="primary"
      class="success"
      @click.native.prevent="handleLogin"
    >确认</el-button>
  </el-form>
</template>

<script>
import { postLogin, postPosition, postCommunity } from '@/api/user'
import { getToken, getInfo, setReplaceData, setToken, removeToken } from '@/utils/auth'
import { mapMutations, mapActions, mapState } from 'vuex'
import { setTimeout } from 'timers';
import { Message } from 'element-ui'
export default {
  name: 'Login',
  data () {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      nameMsg: '',
      pwdMsg: '',
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: '' }],
        password: [{ required: true, trigger: 'blur', validator: '' }]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined,
      userInfo: {}
    }
  },
  components: {
  },
  created () {
    this.loginForm.username = ''
    this.loginForm.password = ''
  },
  methods: {
    // ...mapMutations(['setUserInfo']),
    ...mapMutations(['setDueToTheTime', 'uidHandler', 'amgHandler']),
    ...mapActions(['login']),
    showPwd () {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    foundPwd () {
      this.$router.replace({
        path: '/login/loginretripwd'
      })
    },
    handleLogin () {
      const name = this.loginForm.username
      const password = this.loginForm.password
      postLogin({ name, password }).then(resp => {
        // console.log(resp, '登录的response11')
        //刷新
        localStorage.setItem('isRefresh', true)
        if (resp.code === 401 || resp.code === 402) {
          //帐号错误或者申请重置中
          this.nameMsg = resp.msg
          setTimeout(() => {
            this.nameMsg = ''
          }, 2000)
        } else if (resp.code === 403) {
          //密码错误提示
          this.pwdMsg = resp.msg
          setTimeout(() => {
            this.pwdMsg = ''
          }, 2000)
        } else if (resp.code === 404) {
          //传uid
          this.uidHandler(resp.msg.uid)
          //跳转到修改密码
          this.$router.push('/login/loginenternewpwd')
        } else if (resp.code === 200) {
          //登录成功
          const uid = resp.msg.uid
          postPosition({ uid }).then(resp => {
            // console.log(resp, '查询职位response')
            //登录成功，存token
            setToken(resp.msg.token)
            // console.log(JSON.stringify(resp.msg), 'JSON.parse(resp.msg)')
            localStorage.setItem('userInfo', JSON.stringify(resp.msg))
            if (resp.msg.category !== 3) {
              this.$router.push('/login/community')
            } else {
              if (resp.msg.Jurisdiction === 1) {
                this.$router.push('/login/community')
              } else {
                if (resp.msg.type === 1) {
                  // this.$router.push('')
                  this.userInfo = JSON.parse(localStorage.getItem('userInfo'))
                  const Communityid = this.userInfo.Communityid
                  const type = this.userInfo.type
                  postCommunity({ Communityid, type }).then(resp => {

                    localStorage.setItem('dashQue1', JSON.stringify(resp.msg))
                    //跳转物业框架
                    this.$router.push('/dashboard')
                    // console.log(resp, '物业查询小区是否到期的resp')
                  })

                } else if (resp.msg.type === 2) {
                  this.userInfo = JSON.parse(localStorage.getItem('userInfo'))
                  const Communityid = this.userInfo.Communityid
                  const type = this.userInfo.type
                  postCommunity({ Communityid, type }).then(resp => {

                    // console.log(resp, '停车场查询小区是否到期的resp 11')
                    localStorage.setItem('dashQue1', JSON.stringify(resp.msg))
                    //跳转停车框架
                    this.$router.push('/parkdashboard')
                  })
                }
              }
            }
          })
        }
      })
    },
  }
}
</script>

<style lang="scss">
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: rgba(51, 51, 51, 1);
$btn-height: 4.2vh;
.login-form {
  .title-container {
    cursor: default;
    width: auto;
    font-size: 22px;
    margin-bottom: 50px;
    box-sizing: border-box;
    font-family: MicrosoftYaHei;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
  }
  .icon-container {
    box-sizing: border-box;
    font-size: 28px;
    color: rgba(102, 102, 102, 1);
    .svg-icon {
      margin-bottom: -4px;
    }
  }
  .mistake-toast {
    color: red;
    height: 20px;
    width: 100%;
    font-size: 14px;
    padding-top: 4px;
    box-sizing: border-box;
    // position: relative;
  }
}
.forget {
  float: right;
  font-size: 12px;
  font-family: MicrosoftYaHei;
  font-weight: 400;
  color: rgba(51, 51, 51, 1);
  cursor: pointer;
  width: auto;
  margin-bottom: 45px;
}
.success {
  border-color: #25bad9;
}
.show-pwd {
  position: absolute;
  right: 8px;
  top: 6px;
  font-size: 18px;
  color: $dark_gray;
  cursor: pointer;
  user-select: none;
}
</style>
<style lang="scss" scoped>
$btn-height: 35px;
.el-form {
  position: absolute;
  top: 18%;
  right: 12%;
  min-width: 350px;
  height: 420px;
  max-width: 100%;
  margin: 0 auto;
  overflow: hidden;
  background: rgba(255, 255, 255, 1);
  border-radius: 14px;
  padding: 40px 35px !important;
  .el-form-item {
    position: relative;
    width: 100%;
    height: 43px !important;
    margin-bottom: 0px !important;
    margin-top: 12px;
    border-bottom: 1px solid rgba(160, 160, 160, 1);
    .el-input {
      width: 82%;
      border: none;
      font-size: 16px;
      // margin-top: 1vh;
      /deep/.el-input__inner {
        border: none;
        outline: none;
        height: 20px !important;
        padding: 0 10px;
        color: #666;
        width: 96% !important;
      }
      .el-input__inner::-webkit-input-placeholder {
        font-size: 0.9vw;
      }
      .el-input__inner::-moz-placeholder {
        font-size: 0.9vw;
      }
    }
  }
  .el-button {
    width: 100%;
    height: 35px;
    background: rgba(37, 186, 217, 1);
    border-radius: 4px;
    font-size: 16px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: rgba(255, 255, 255, 1);
    display: flex;
    justify-content: center;
    align-items: center;
    line-height: 6px;
    box-sizing: border-box;
    border-color: rgba(37, 186, 217, 1);
  }
}
</style>
