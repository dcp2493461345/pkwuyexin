<template>
  <!-- 表单 -->
  <el-form ref="loginForm" :model="loginForm" class="login-form" label-position="left">
    <!-- 标题 -->
    <h3 class="title-container">找回密码</h3>
    <!-- 用户名 -->
    <el-form-item prop="username">
      <span class="icon-container">
        <svg-icon icon-class="username1" />
      </span>
      <el-input
        ref="username"
        v-model="loginForm.username"
        placeholder="请输入帐号"
        name="username"
        type="text"
        @keyup.enter.native="handleRetri"
      />
    </el-form-item>
    <div class="mistake-toast">
      <p v-show="true" class="username-toast">{{ nameMsg }}</p>
    </div>
    <!-- 验证码 -->
    <el-form-item prop="password" class="verification">
      <span class="icon-container">
        <svg-icon icon-class="lock2" />
      </span>
      <el-input
        ref="password"
        v-model="loginForm.auth"
        placeholder="请输入验证码"
        name="password"
        class="passwordinput"
        @keyup.enter.native="handleRetri"
      />
      <!-- <p class="kongbai" /> -->
      <p v-if="codeLoading" class="codeSty">{{ time+'s' }}</p>
      <p v-else class="codeSty getverification" @click="handleGetCode">
        <span>获取验证码</span>
      </p>
    </el-form-item>
    <div class="mistake-toast">
      <p v-show="true" class="password-toast">{{ codeMsg }}</p>
    </div>
    <!-- //忘记密码 -->
    <div class="forget" @click="getVerification">无法获取验证码?</div>
    <!-- 提交 -->
    <!-- <el-button type="primary" @click.native.prevent="handleRetri" class="success" ref='success'>确认</el-button>
    <el-button type="primary" @click.native.prevent="handleGveUp" class="forgive" ref="forgive">放弃</el-button>-->
    <div class="reset-btn">
      <div :class="flag===1 ? 'btn1':'btn2'" @mouseover="flag=1" @click="handleRetri">确定</div>
      <div :class="flag!==1 ? 'btn1':'btn2'" @mouseover="flag=2" @click="handleGveUp">放弃</div>
    </div>
  </el-form>
</template>

<script>
/* eslint-disable */
import { postRetrieve, postGetCode } from '@/api/user'
import { setToken } from '@/utils/auth'
import { mapMutations, mapActions, mapState } from 'vuex'
import { setTimeout, setInterval, clearInterval } from 'timers';
import { Message } from 'element-ui'
export default {
  name: 'Loginretripwd',
  data () {
    return {
      loginForm: {
        username: '',
        code: '',
        auth: ''
      },
      codeLoading: false,
      time: 60,
      nameMsg: '',
      codeMsg: '',
      disabled: true,
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: '' }],
        code: [{ required: true, trigger: 'blur', validator: '' }]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined,
      flag: 1
    }
  },
  computed: {
    ...mapState(['userInfo'])
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    ...mapMutations(['setUserInfo', 'uidHandler']),
    ...mapActions(['getCode', 'retrieve']),
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
    // 获取验证码
    handleGetCode () {
      const phone = this.loginForm.username
      postGetCode({ phone }).then(resp => {
        console.log(resp, '验证码resp')
        // 发送成功之后
        if (resp.code === 200) {
          this.loginForm.code = resp.msg.code
          this.codeLoading = true
          var timer = setInterval(() => {
            if (this.time === 0) {
              clearInterval(timer)
              this.time = 60
              this.codeLoading = false
            } else {
              this.time = this.time - 1
            }
          }, 1000)
        } else if (resp.code === 400) {
          this.nameMsg = resp.msg
          setTimeout(() => {
            this.nameMsg = ''
          }, 2000)
        } else if (resp.code === 401) {
          this.codeMsg = resp.msg
          setTimeout(() => {
            this.codeMsg = ''
          }, 2000)
        }
      })
    },
    // 找回密码
    handleRetri () {
      const phone = this.loginForm.username
      const auth = this.loginForm.auth
      const code = this.loginForm.code
      postRetrieve({ phone, auth, code }).then(resp => {
        console.log(resp, '找回密码resp')
        if (resp.code === 400) {
          this.nameMsg = resp.msg
          setTimeout(() => {
            this.nameMsg = ''
          }, 2000)
        } else if (resp.code === 401) {
          this.codeMsg = resp.msg
          setTimeout(() => {
            this.codeMsg = ''
          }, 2000)
        } else if (resp.code === 200) {
          this.uidHandler(resp.msg.uid)
          this.$router.push('/login/loginentermore')
        }
      })
    },
    handleGveUp () {
      this.$router.push({
        path: '/login/welcome'
      })
    },
    getVerification () {
      this.$router.push('/login/loginresetpwd')
    }
  }
}
</script>


<style lang="scss" scoped>
.el-form {
  position: absolute;
  top: 18%;
  right: 12%;
  width: 350px;
  height: 420px;
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
      .el-input__inner {
        border: none;
        outline: none;
        height: 20px !important;
        padding: 0 10px;
        color: #999999;
      }
      .el-input__inner::-webkit-input-placeholder {
        font-size: 0.9vw;
        // padding: 0 0 20px 0;
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
  }
  .el-button--primary.is-disabled,
  .el-button--primary.is-disabled:active,
  .el-button--primary.is-disabled:focus,
  .el-button--primary.is-disabled:hover {
    background: rgba(37, 186, 217, 0.5);
  }
  .svg-icon {
    margin-bottom: -4px;
  }
}
</style>

<style lang="scss" scoped >
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: rgba(51, 51, 51, 1);
$btn-width: 16.7vw;
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
  }
  .verification {
    position: relative;
    .passwordinput {
      width: 50%;
    }
    .codeSty {
      height: 24px;
      line-height: 22px;
      text-align: center;
      border-radius: 3px;
      padding: 0 5px;
      background: #f0f2f5;
      float: right;
      color: #666;
      margin-top: 12px;
    }
    .getverification {
      cursor: pointer;
      font-size: 12px !important;
    }
  }
  .mistake-toast {
    color: red;
    height: 20px;
    width: 100%;
    font-size: 14px;
    padding-top: 4px;
    box-sizing: border-box;
  }
  .reset-btn {
    cursor: pointer;
    text-align: center;
    .btn1 {
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
    }
    .btn2 {
      width: 100%;
      height: 35px;
      background: #fff;
      // background:rgba(37,186,217,1);
      border-radius: 4px;
      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: rgba(153, 153, 153, 1);
      display: flex;
      justify-content: center;
      align-items: center;
    }
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
// .success {
//   // margin-top: 5vh !important;
// }
.forgive {
  padding: 0;
  margin-left: 0;
  background-color: #fff;
  color: rgba(153, 153, 153, 1);
  border: 0;
  font-size: 14px;
  margin-top: 0 !important;
}
</style>