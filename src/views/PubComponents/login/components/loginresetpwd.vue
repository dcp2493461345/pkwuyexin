<template>
  <!-- eslint-disable -->
  <!-- 重置密码页面 -->
  <!-- 表单 -->
  <el-form ref="loginForm" :model="loginForm" class="login-form" label-position="left">
    <!-- 标题 -->
    <h3 class="title-container">重置密码</h3>
    <!-- 帐号 -->
    <el-form-item prop="username">
      <span class="icon-container">
        <svg-icon icon-class="username1" />
      </span>
      <el-input
        ref="username"
        placeholder="请输入帐号"
        v-model="loginForm.phone"
        name="username"
        type="text"
        @keyup.enter.native="handleReset"
      />
    </el-form-item>
    <div class="mistake-toast">
      <p class="username-toast" v-show="true">{{phoneMsg}}</p>
    </div>
    <!-- 姓名 -->
    <el-form-item prop="ownname">
      <span class="icon-container">
        <svg-icon icon-class="name1" />
      </span>
      <el-input
        ref="name"
        placeholder="请输入姓名"
        v-model="loginForm.name"
        name="name"
        type="text"
        @keyup.enter.native="handleReset"
      />
    </el-form-item>
    <div class="mistake-toast">
      <p class="username-toast" v-show="true">{{nameMsg}}</p>
    </div>
    <!-- 新电话 -->
    <el-form-item prop="username">
      <span class="icon-container">
        <svg-icon icon-class="phone1" />
      </span>
      <el-input
        ref="username"
        placeholder="请输入新电话"
        v-model="loginForm.phones"
        name="username"
        type="text"
        @keyup.enter.native="handleReset"
      />
    </el-form-item>
    <div class="mistake-toast">
      <p class="username-toast" v-show="true">{{phonesMsg}}</p>
    </div>
    <!-- 验证码 -->
    <el-form-item prop="password" class="verification">
      <span class="icon-container">
        <svg-icon icon-class="lock2" />
      </span>
      <el-input
        ref="verificationcode"
        v-model="loginForm.auth"
        placeholder="请输入验证码"
        name="verificationcode"
        class="passwordinput"
        @keyup.enter.native="handleReset"
        style="width:50%;"
      />
      <!-- <p class="kongbai"></p> -->
      <p v-if="codeLoading" class="codeSty">{{ time+'s' }}</p>
      <p v-else class="codeSty getverification" @click="handleGetCode">
        <i>{{ '获取验证码' }}</i>
      </p>
    </el-form-item>
    <div class="mistake-toast">
      <p class="password-toast" v-show="true">{{codeMsg}}</p>
    </div>
    <!-- 提交 -->
    <!-- <el-button :loading="loading" type="primary" @click.native.prevent="handleReset" class="success btn1">确认</el-button>
    <el-button :loading="loading" type="primary" @click.native.prevent="handleGveUp" class="forgive btn2">放弃</el-button>-->
    <div class="reset-btn" @mouseleave="flag=1">
      <div @mouseover="flag=1" :class="flag===1 ? 'btn1':'btn2'" @click="handleReset">确定</div>
      <div @mouseover="flag=2" :class="flag!==1 ? 'btn1':'btn2'" @click="handleGveUp">放弃</div>
    </div>
  </el-form>
</template>

<script>
// import { setToken } from '@/utils/auth'
import { Message } from 'element-ui'
import { mapActions } from 'vuex'
import { postGetCodes, postResetPwd } from '@/api/user'
// console.log("login")
export default {
  name: 'loginresetpwd',
  data () {
    return {
      loginForm: {
        phone: '',
        name: '',
        phones: '',
        auth: '',//输入的验证码
        code: ''//返回的验证码
      },
      codeLoading: false,
      time: 60,
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: '' }],
        password: [{ required: true, trigger: 'blur', validator: '' }]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined,
      phoneMsg: '',
      nameMsg: '',
      phonesMsg: '',
      codeMsg: '',
      flag: 1
    }
  },
  // watch: {
  //   $route: {
  //     handler: function(route) {
  //       this.redirect = route.query && route.query.redirect
  //     },
  //     immediate: true
  //   }
  // },
  methods: {
    ...mapActions(['resetPwd', "getCodes"]),
    handleReset () {
      localStorage.setItem('isRefresh', true)
      const { phone, name, phones, auth, code } = this.loginForm
      postResetPwd({ phone, name, phones, auth, code }).then(resp => {
        // console.log(resp, '重置帐号resp')
        if (resp.code === 400) {
          this.phoneMsg = resp.msg
          setTimeout(() => {
            this.phoneMsg = ''
          }, 2000)
        } else if (resp.code === 401) {
          this.nameMsg = resp.msg
          setTimeout(() => {
            this.nameMsg = ''
          }, 2000)
        } else if (resp.code === 402) {
          this.phonesMsg = resp.msg
          setTimeout(() => {
            this.phonesMsg = ''
          }, 2000)
        } else if (resp.code === 403) {
          this.codeMsg = resp.msg
          setTimeout(() => {
            this.codeMsg = ''
          }, 2000)
        } else if (resp.code === 404) {
          this.$message.error(resp.msg);
        } else if (resp.code === 200) {
          this.$message({
            message: resp.msg,
            type: 'success'
          });
          this.$router.push('/login/WelCome')
        }
      })
    },
    //获取验证码
    handleGetCode () {
      // const phones = this.loginForm
      const { phone, phones, name } = this.loginForm
      postGetCodes({ phone, phones, name }).then(resp => {
        console.log(resp, '重置获取resp')
        if (resp.code === 400) {
          this.phoneMsg = resp.msg
          setTimeout(() => {
            this.phoneMsg = ''
          }, 2000)
        } else if (resp.code === 401) {
          this.nameMsg = resp.msg
          setTimeout(() => {
            this.nameMsg = ''
          }, 2000)
        } else if (resp.code === 402) {
          this.phonesMsg = resp.msg
          setTimeout(() => {
            this.phonesMsg = ''
          }, 2000)
        } else if (resp.code === 200) {
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
        }
      })
    },
    handleGveUp () {
      this.$router.push('/login/loginretripwd')
    },
  }
}
</script>

<style lang="scss" scoped>
.el-form {
  position: absolute;
  top: 14%;
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
    height: 50px;
    margin-top: 12px;
    margin-bottom: 0px;
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
    margin-bottom: 35px;
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
      margin-bottom: 2px;
    }
  }
  .verification {
    position: relative;
    .passwordinput {
      width: 50%;
    }
    .kongbai {
      width: 4.5vw;
      height: 1.6vh;
      background-color: #fff;
      position: absolute;
      top: -0.4vh;
      right: 0;
      // border: 1px solid red;
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
    height: 10px;
    width: 100%;
    font-size: 14px;
    padding-top: 4px;
    box-sizing: border-box;
  }
  .reset-btn {
    cursor: pointer;
    text-align: center;
    margin-top: 30px;
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
  right: 1.8vw;
  height: 0.78vh;
  font-size: 0.78vw;
  font-family: MicrosoftYaHei;
  font-weight: 400;
  color: rgba(51, 51, 51, 1);
  cursor: pointer;
}
.forgive {
  padding: 0px;
  margin-left: 0px;
  background-color: #fff;
  color: rgba(153, 153, 153, 1);
  border: 0px;
  font-size: 0.7vw;
}
</style>
<style lang="scss" scoped>
.el-form {
  position: absolute;
  top: 15%;
  right: 12%;
  width: 350px;
  height: 490px;
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
        border: none !important;
        outline: none;
      }
      .el-input__inner::-webkit-input-placeholder {
        font-size: 0.9vw;
      }
      .el-input__inner::-moz-placeholder {
        font-size: 0.9vw;
      }
    }
  }
  .svg-icon {
    vertical-align: -0.35em !important;
  }
  .el-button {
    width: 100%;
    height: 5vh;
    padding-top: 1.5vh;
    background: rgba(37, 186, 217, 1);
    border-radius: 3px;
    // margin-bottom:30px;
    // margin-top: 20px;
    font-size: 0.9vw;
  }
}
</style>
<style lang="scss">
.el-input__inner {
  border: none !important;
  outline: none;
  background-color: rgb(255, 255, 255) !important;
}
</style>