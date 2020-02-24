
<template>
  <!-- 输入新密码页面222 -->
  <!-- 表单 -->
  <el-form ref="loginForm" :model="loginForm" class="login-form" label-position="left">
    <!-- 标题 -->
    <h3 class="title-container">请输入新密码</h3>
    <!-- 新密码 -->
    <el-form-item prop="password">
      <span class="icon-container">
        <svg-icon icon-class="lock1" />
      </span>
      <el-input
        ref="password"
        :key="passwordType"
        v-model="loginForm.password"
        placeholder="请输入新密码"
        name="password"
        :type="passwordType"
        @keyup.enter.native="handlenewpwd"
      />
      <span class="show-pwd" @click="showPwd">
        <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
      </span>
    </el-form-item>
    <div class="mistake-toast">
      <p v-show="true" class="password-toast">{{ firstMsg }}</p>
    </div>
    <!-- 再次输入新密码 -->
    <el-form-item prop="password">
      <span class="icon-container">
        <svg-icon icon-class="lock1" />
      </span>
      <el-input
        ref="password"
        :key="passwordType"
        v-model="loginForm.pwd"
        placeholder="请再次输入新密码"
        name="password"
        :type="passwordType"
        @keyup.enter.native="handlenewpwd"
      />
      <span class="show-pwd" @click="showPwd">
        <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
      </span>
    </el-form-item>
    <div class="mistake-toast">
      <p v-show="true" class="password-toast">{{ secondMsg }}</p>
    </div>
    <!-- 提交 -->
    <!-- <el-button :loading="loading" type="primary" @click.native.prevent="handlenewpwd" class="save-btn" >确认</el-button>
    <el-button :loading="loading" type="primary" @click.native.prevent="handleforgive" class="forgive">放弃</el-button>-->
    <div class="reset-btn" @mouseleave="flag=1">
      <div :class="flag===1 ? 'btn1':'btn2'" @mouseover="flag=1" @click="handlenewpwd">确定</div>
      <!-- <div :class="flag!==1 ? 'btn1':'btn2'" @mouseover="flag=2" @click="handleforgive">放弃</div> -->
    </div>
  </el-form>
</template>

<script>
/* eslint-disable */
import { login, postHighes, postUpdete, postCommunity, postPosition } from '@/api/user'
import { setToken, getToken, getInfo, setReplaceData } from '@/utils/auth'
import { mapActions, mapMutations, mapState } from 'vuex'
export default {
  name: 'Loginenternewpwd',
  data () {
    return {
      loginForm: {
        password: '',
        pwd: '',
        phone: ''
      },
      secondMsg: '',
      firstMsg: '',
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: '' }],
        password: [{ required: true, trigger: 'blur', validator: '' }]
      },
      loading: false,
      passwordType: 'password',
      flag: 1
    }
  },
  computed: {
    ...mapState(['userInfo', 'uid'])
  },
  created () {
    // 查询字符串， query‘
    console.log(this.uid, 'this.uid')
    this.loginForm.phone = this.$route.query.phone
  },
  methods: {
    ...mapMutations(['setUserInfo', 'setDueToTheTime']),
    ...mapActions(['enterPwd']),
    showPwd () {
      // console.log('眼睛')
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handlenewpwd () {
      localStorage.setItem('isRefresh', true)
      const uid = this.uid
      const password = this.loginForm.password
      const pwd = this.loginForm.pwd
      // console.log({ uid, password, pwd }, '修改密码的参数')
      postUpdete({ uid, password, pwd }).then(resp => {
        console.log(resp, '修改密码resp')
        if (resp.code === 401) {
          //输入西新密码
          this.firstMsg = resp.msg
          setTimeout(() => {
            this.firstMsg = ''
          }, 2000)
        } else if (resp.code === 402) {
          this.secondMsg = resp.msg
          setTimeout(() => {
            this.secondMsg = ''
          }, 2000)
        } else if (resp.code === 405) {
          this.$message.error(resp.msg)
        } else if (resp.code === 200) {
          //修改成功
          const uid = resp.uid
          postPosition({ uid }).then(resp => {
            console.log(resp, '查询职位response')
            //修改成功，存token
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
                    // console.log(resp, 'postcomunty')
                    // this.amgHandler(resp.msg)
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
                    // this.amgHandler(resp.msg)
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
    handleforgive () {
      this.$router.push('/login')
      // console.log('放弃')1)
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
    height: 5vh;
    font-size: 1.1vw;
    padding-top: 1.5vh;
    background: rgba(37, 186, 217, 1);
    border-radius: 3px;
    // margin-bottom:1.5vh;
    margin-top: 0vh;
    // margin-top: 0px!important;
  }
}
</style>

<style lang="scss" scoped >
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: rgba(51, 51, 51, 1);
$btn-width: 16.7vw;
$btn-height: 4.2vh;
.wy-login-container {
  .login-form {
    .title-container {
      cursor: default;
      width: auto;
      font-size: 22px;
      margin-bottom: 60px;
      box-sizing: border-box;
      font-family: MicrosoftYaHei;
      font-weight: 400;
      color: rgba(51, 51, 51, 1);
    }
    .icon-container {
      box-sizing: border-box;
      font-size: 26px;
      color: rgba(102, 102, 102, 1);
      .svg-icon {
        margin-bottom: -4px;
        // vertical-align: -0.3em !important;
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

    .reset-btn {
      // width: 100%;
      // height: $btn-height;
      // background-color: #f00;
      cursor: pointer;
      text-align: center;
      margin-top: 50px !important;
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
  .forgive {
    padding: 0;
    margin-left: 0;
    color: rgba(153, 153, 153, 1);
    background: #fff;
    border: 0;
    font-size: 12px;
    margin-top: 0;
    margin-bottom: 0;
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
}
</style>