<template>
  <div :class="classObj" class="app-wrapper">
    <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside" />
    <sidebar class="sidebar-container" />
    <div class="main-container">
      <div :class="{'fixed-header':fixedHeader}">
        <navbar
          :huanying-name="huanyingName"
          :dingwei-name="dingweiName"
          @isShowTHander="isShowT3Hander"
          @isShowT4Hander="isShowT4Hander"
        />
      </div>
      <!-- 主题内容 -->
      <div class="fix-appmain">
        <app-main />
      </div>
    </div>
    <!-- 遮罩层 -->
    <div class="wy-cover">
      <!-- 遮罩一 -->
      <div>
        <el-dialog
          v-if="type === 2"
          :title="`系统将在${DuetoThetime1}天后到期，为了能正常使用系统，请及时续费。`"
          :show-close="false"
          width="38%"
          :modal-append-to-body="false"
          :visible.sync="dialogVisible1"
          :close-on-click-modal="false"
          class="jishi-class"
        >
          <span @click="isCover1">我知道了</span>
          <br />
          <br />
        </el-dialog>
        <div v-if="type===1" class="outClass" @click="exitHandler()">直接退出</div>
      </div>
      <!-- 遮罩二 -->
      <el-dialog
        v-if="type===1"
        :modal-append-to-body="false"
        title="系统已欠费，为了能正常使用系统，请及时续费。"
        :show-close="false"
        width="520px"
        :visible.sync="dialogVisible2"
        :close-on-click-modal="false"
        class="qianfei-class"
      >
        <p class="exit" @click="isCover2">
          {{ countdown + 's' }}
          <span style="color:#fff;">秒后自动退出</span>
        </p>
        <br />
        <br />
      </el-dialog>
      <!-- 遮罩三 -->
      <dialog-card
        :centerDialogVisible="centerDialogVisible"
        content="是否退出登录?"
        @ensureHandler="logoutHandler"
        @cancelHandler="cancelHandler"
        @beforeClose="cancelHandler"
        class="other-class"
      ></dialog-card>
      <!-- 遮罩四 -->
      <dialog-card
        :centerDialogVisible="centerDialogVisible2"
        content="是否切换小区?"
        @ensureHandler="qiehuanHandler"
        @cancelHandler="cancelHandler1"
        @beforeClose="cancelHandler1"
        class="other-class"
      ></dialog-card>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import { Navbar, Sidebar, AppMain } from './components'
import ResizeMixin from './mixin/ResizeHandler'
import { setInterval, clearInterval } from 'timers'
import { removeToken } from '@/utils/auth'
import { postLogout, postSelect_position_list } from '@/api/user'
export default {
  name: 'Layout',
  components: {
    Navbar,
    Sidebar,
    AppMain
  },
  mixins: [ResizeMixin],
  data () {
    return {
      DuetoThetime1: null,
      dialogVisible1: true,
      dialogVisible2: true,
      time: 150,
      type: 1,
      countdown: 30, // 倒计时
      centerDialogVisible: false,
      centerDialogVisible2: false,
      huanyingName: '',
      dingweiName: '',
      userInfo: {}
    }
  },
  computed: {
    ...mapState(['dueToTheTime', 'amg', 'dueTotime']),
    sidebar () {
      return this.$store.state.app.sidebar
    },
    device () {
      return this.$store.state.app.device
    },
    fixedHeader () {
      return this.$store.state.settings.fixedHeader
    },
    classObj () {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    }
  },
  watch: {
    countdown: function (newVal, oldVal) {
      if (newVal === 0) {
        this.exitHandler()
      }
    }
  },

  created () {
    //从后端获取侧边栏菜单数据
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'))

    this.dingweiName = this.userInfo.Community_name
    this.dialogVisible = this.hasWyCover1
    const dashQue = JSON.parse(localStorage.getItem('dashQue1')).amg
    this.DuetoThetime1 = JSON.parse(localStorage.getItem('dashQue1')).time

    // console.log(typeof (dashQue), 'dashQue')
    if (dashQue === 1) {
      //系统已欠费，为了能正常使用系统，请及时续费。
      this.type = 1
      this.dialogVisible2 = true
    } else if (dashQue === 2) {
      this.type = 2
      this.dialogVisible1 = true
    } else {
      this.type = 3
    }
    //倒计时
    if (this.type === 1) {
      var timer = setInterval(() => {
        if (this.countdown === 0) {
          clearInterval(timer)
          this.countdown = 3
          this.codeLoading = false
        } else {
          this.countdown = this.countdown - 1
        }
      }, 1000)
    }
    this.huanyingName = this.userInfo.uname

  },
  methods: {
    ...mapActions(['logout']),
    ...mapMutations(['changeamgHandler']),
    handleClickOutside () {
      this.$store.dispatch('app/closeSideBar', { withoutAnimation: false })
    },
    isCover1 () {
      this.dialogVisible1 = !this.dialogVisible1
      // this.changeamgHandler(5)
      localStorage.setItem('dashQue1', JSON.stringify({ time: '', amg: 3 }))
      // console.log(this.dialogVisible1, this.hasWyCover1, '这里是dialogVisible')
    },
    isCover2 () {
    },
    // 退出登录
    exitHandler () {

      const uid = Number(this.userInfo.uid)
      const Jurisdiction = this.userInfo.Jurisdiction
      if (Jurisdiction === 2) {
        postLogout({ uid }).then(resp => {
          console.log(resp, '退出登录resp')
          if (resp.code === 200) {
            removeToken()
            localStorage.removeItem('userInfo')
            localStorage.clear()
            this.$router.push('/login/welcome')
          } else {
            this.$message.error(resp.msg)
          }
        })
      } else {
        this.$router.push('/login/community')
      }
    },
    isShowT3Hander () {
      this.centerDialogVisible = !this.centerDialogVisible
    },
    isShowT4Hander () {
      this.centerDialogVisible2 = !this.centerDialogVisible2
    },
    // nav退出登录
    logoutHandler () {

      const uid = this.userInfo.uid
      postLogout({ uid }).then(resp => {
        if (resp.code === 200) {
          removeToken()
          localStorage.removeItem('userInfo')
          localStorage.clear()
          this.$router.push('/login/welcome')
        }
      })
    },
    qiehuanHandler () {
      if (this.userInfo.category === 3) {
        if (this.userInfo.Jurisdiction === 1) {
          this.$router.push('/login/community')
        } else {
          return
        }
      } else {
        this.$router.push('/login/community')
      }
    },
    cancelHandler () {
      this.centerDialogVisible = false
    },
    cancelHandler1 () {
      this.centerDialogVisible2 = false
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
@import "~@/styles/variables.scss";
/deep/.el-dialog {
  background-color: #fff;
  margin-top: 0% !important;
  position: absolute;
  top: 50%;
  left: 50%;
  background: none;
  box-shadow: none;
  transform: translate(-50%, -50%);
  -webkit-transform: translate(-50%, -50%);
  -moz-transform: translate(-50%, -50%);
  min-width: 380px;
  border-radius: 5px;
  .el-dialog__header {
    padding: 0px;
    .el-dialog__title {
      font-family: Microsoft YaHei;
      font-weight: 400;
      // font-size: 25px !important;
      color: rgba(255, 255, 255, 1) !important;
      color: black;
      padding: 0px;
    }
  }

  .el-dialog__body {
    border-radius: 4px;
    padding: 30px 20px !important;
    span {
      font-size: 23px !important;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: rgba(254, 141, 79, 1);
      float: right;
      cursor: pointer;
    }
  }
}
.outClass {
  position: absolute;
  top: 10%;
  right: 5%;
  cursor: pointer;
  color: #ccc;
  font-family: Microsoft YaHei;
  font-weight: 400;
  z-index: 19999999999;
}
.fix-appmain {
  @include clearfix;
  position: fixed;
  height: 100%;
  width: 100%;
  margin-left: 16px;
  box-sizing: border-box;
  // z-index: 100000;
  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
}
.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}

.fixed-header {
  position: relative;
  top: 0;
  right: 0;
  z-index: 9;
  // width: calc(100% - #{$sideBarWidth});
  width: 100%;
  transition: width 0.28s;
}

.hideSidebar .fixed-header {
  width: calc(100% - 54px);
  width: 100%;
}

.hideSidebar .app-main {
  height: 93.5%;
  margin-right: 86px;
}
.mobile .fixed-header {
  width: 100%;
}

.jishi-class {
  /deep/.el-dialog {
    transform: translate(-50%, -50%);
    width: 640px !important;
    height: 156px !important;
    // background-color: #ccc;
    .el-dialog__title {
      font-size: 25px !important;
    }
    /deep/.el-dialog__body {
      border-radius: 4px;
      padding: 100px 18px !important;
      span {
        font-size: 23px !important;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: rgba(254, 141, 79, 1);
        float: right;
        cursor: pointer;
      }
    }
  }
}
.qianfei-class {
  /deep/.el-dialog {
    width: 553px !important;
    .el-dialog__title {
      font-size: 24px !important;
    }
    /deep/.el-dialog__body {
      border-radius: 4px;
      padding: 99px 185px !important;
      p {
        font-size: 24px !important;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: rgba(254, 141, 79, 1);
        float: right;
        cursor: pointer;
      }
    }
  }
}
.other-class {
  // background-color: #f00;
  /deep/.el-dialog {
    top: 50% !important;
  }
}
</style>
