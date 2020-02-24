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
      <el-dialog
        title="提示"
        :visible.sync="centerDialogVisible"
        :append-to-body="true"
        center
        class="chen"
        :close-on-click-modal="false"
      >
        <div>是否退出登录?</div>
        <span slot="footer" class="dialog-footer">
          <el-button class="quxiao1" @click="centerDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="logoutHandler">确 认</el-button>
        </span>
      </el-dialog>
      <!-- 遮罩四 -->
      <el-dialog
        title="提示"
        :visible.sync="centerDialogVisible2"
        :append-to-body="true"
        center
        class="chen"
        :close-on-click-modal="false"
      >
        <div>是否切换小区?</div>
        <span slot="footer" class="dialog-footer">
          <el-button class="quxiao1" @click="centerDialogVisible2 = false">取 消</el-button>
          <el-button type="primary" @click="qiehuanHandler">确 认</el-button>
        </span>
      </el-dialog>
      <!-- 提示弹框 -->
      <el-dialog
        title="提示"
        :visible.sync="centerDialogVisible4"
        :append-to-body="true"
        center
        top="40vh"
        :close-on-click-modal="false"
        custom-class="setClass"
      >
        请设置停车场参数!
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="cc">去设置</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import { Navbar, Sidebar, AppMain } from './components'
import ResizeMixin from './mixin/ResizeHandler'
import { setInterval, clearInterval } from 'timers'
import { removeToken } from '@/utils/auth'
import { postLogout } from '@/api/user'
import { parkState } from '@/api/dash.js'
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
      centerDialogVisible4: false,
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
      if (newVal === 1) {
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
    if (dashQue === 1) {
      this.type = 1
      this.dialogVisible2 = true
    } else if (dashQue === 2) {
      this.type = 2
      this.dialogVisible1 = true
    } else {
      this.type = 3
      const parkid = this.userInfo.Communityid
      parkState({ parkid }).then(resp => {
        console.log(resp.data, 'rrrrrr')
        localStorage.setItem('stateTypeInfo', JSON.stringify(resp.data))
        localStorage.setItem('setParamState', 2)
        const dashNumber = localStorage.getItem('dashCreate')
        const isSetParams = resp.data.state_type
        if (isSetParams === 2) {
          this.centerDialogVisible4 = false
        } else {
          this.centerDialogVisible4 = true
        }
        if (JSON.parse(localStorage.getItem('dashCreate')) === 2) {
          this.centerDialogVisible4 = false
        }
      })
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
    cc () {
      localStorage.setItem('dashCreate', 2)
      this.centerDialogVisible4 = false
      this.$router.push('/hardware/SetParamss')
    },
    handleClickOutside () {
      this.$store.dispatch('app/closeSideBar', { withoutAnimation: false })
    },
    isCover1 () {
      this.dialogVisible1 = !this.dialogVisible1
      const parkid = this.userInfo.Communityid
      parkState({ parkid }).then(resp => {
        localStorage.setItem('stateTypeInfo', JSON.stringify(resp.data))
        localStorage.setItem('setParamState', 2)
        const dashNumber = localStorage.getItem('dashCreate')
        const isSetParams = resp.data.state_type
        if (isSetParams === 1) {
          this.centerDialogVisible4 = false
        } else {
          this.centerDialogVisible4 = true
        }
        if (JSON.parse(localStorage.getItem('dashCreate')) === 2) {
          this.centerDialogVisible4 = false
        }
      })
      localStorage.setItem('dashQue1', JSON.stringify({ time: '', amg: 3 }))
      console.log(this.dialogVisible1, this.hasWyCover1, '这里是dialogVisible')
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

//切换小区弹框//
.chen {
  /deep/.el-dialog {
    background-color: #fff !important;
    width: 18.23%;
    height: 210px;
    .el-dialog__header {
      padding: 12px 0 10px 16px;
      text-align: left;
      border-bottom: 1px solid #eff2f5;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: rgba(51, 51, 51, 1);
      .el-dialog__title {
        font-size: 16px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: rgba(51, 51, 51, 1) !important;
      }

      button {
        position: absolute;
        top: 14px;
      }
    }
    .el-dialog--center {
      text-align: left;
    }
    .el-dialog__body {
      background-color: #fff;
      height: 110px !important;
      width: 100%;
      position: relative;

      div {
        width: 100%;
        height: 110px;
        line-height: 68px;
        font-size: 16px;
        text-align: center;
      }
    }
    .el-dialog__footer {
      position: absolute;
      padding-top: 0 !important;
      width: 100%;
      display: flex;
      justify-content: center;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: rgba(153, 153, 153, 1);
      span {
        width: 100%;
        display: flex;
        justify-content: space-around;
        button {
          width: 72px;
          height: 30px;
          line-height: 0px;
          font-size: 14px;
          border-radius: 3px !important;
          font-family: Microsoft YaHei;
          font-weight: 400;
          color: rgba(255, 254, 254, 1);
          border: 1px solid #25bad9;
        }
      }
      .quxiao1 {
        color: rgba(153, 153, 153, 1);
        background-color: #fff;
        border: 1px solid rgba(204, 204, 204, 1);
        border-radius: 3px;
      }
    }
    .el button {
      color: #999999 !important;
    }
    .el-button--primary {
      color: #ffffff;
      background-color: #25bad9;
    }
  }
}
.jishi-class {
  /deep/.el-dialog {
    transform: translate(-50%, -50%);
    width: 640px !important;
    height: 156px !important;
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
//删除
/deep/.setClass {
  background-color: #fff !important;
  width: 18.23%;
  height: 210px;
  /deep/.el-dialog__header {
    border-bottom: 1px solid #eff2f5;
    display: flex;
    justify-content: flex-start;
    padding: 10px 20px 5px;
    font-size: 16px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
    .el-dialog__title {
      border-bottom: none;
      font-size: 16px;
      color: rgba(51, 51, 51, 1) !important;
    }
    button {
      z-index: 19999;
      top: 11px !important;
    }
  }
  .el-dialog--center {
    text-align: left;
  }
  .el-dialog__body {
    background-color: #fff;
    height: 110px !important;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 16px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
    cursor: default;
  }
  .el-dialog__footer {
    position: absolute;
    width: 100%;
    display: flex;
    justify-content: center;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: rgba(153, 153, 153, 1);
    bottom: 3px;
    span {
      width: 100%;
      display: flex;
      justify-content: space-around;
      button {
        width: 72px;
        height: 30px;
        font-size: 14px;
        border-radius: 3px !important;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: rgba(255, 254, 254, 1);
        display: flex;
        justify-content: center;
        align-items: center;
        line-height: 0px;
      }
    }
    .quxiao1 {
      color: rgba(153, 153, 153, 1);
      background-color: #fff;
      border: 1px solid rgba(204, 204, 204, 1);
      border-radius: 3px;
    }
  }
  .el button {
    color: #999999 !important;
  }
  .el-button--primary {
    color: #ffffff;
    background-color: #fcb048ff;
    border: none;
  }
}
</style>
