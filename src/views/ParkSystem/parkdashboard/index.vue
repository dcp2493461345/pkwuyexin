<template>
  <div class="wy-homepage">
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
</template>

<script>
import { parkState } from '@/api/hardware.js'
import { userInfo } from 'os'
export default {
  data () {
    return {
      userInfo: {},
      centerDialogVisible4: false
    }
  },
  created () {
    console.log(JSON.parse(localStorage.getItem('userInfo')), 'userInfo')
    // this.userInfo = JSON.parse(localStorage.getItem('userInfo'))
    // const parkid = this.userInfo.Communityid
    // parkState({ parkid }).then(resp => {
    //   console.log(resp.data, 'rrrrrr')
    //   localStorage.setItem('stateTypeInfo', JSON.stringify(resp.data))
    //   localStorage.setItem('setParamState', 2)
    //   const dashNumber = localStorage.getItem('dashCreate')
    //   const isSetParams = resp.data.state_type
    //   if (isSetParams === 1) {
    //     this.centerDialogVisible4 = true
    //   } else {
    //     this.centerDialogVisible4 = false
    //   }
    //   // if (dashNumber === '2') {
    //   //   this.centerDialogVisible4 = false
    //   // } else if (isSetParams === 1 && dashNumber === '1') {
    //   //   this.centerDialogVisible4 = true
    //   // }
    //   if (JSON.parse(localStorage.getItem('dashCreate')) === 2) {
    //     this.centerDialogVisible4 = false
    //   }
    // })

  },
  methods: {
    cc () {
      localStorage.setItem('dashCreate', 2)
      this.centerDialogVisible4 = false
      this.$router.push('/hardware/SetParamss')
    }
  }
}
</script>

<style lang="scss" scoped>
.wy-homepage {
  background-color: #cdcdcd;
  height: 97.7%;
  padding-bottom: 20px;
  padding-right: 46px;
  padding-left: 30px;
  padding-top: 30px;
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
    padding: 16px 20px 10px;
    font-size: 16px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
    .el-dialog__title {
      border-bottom: none;
      font-size: 16px;
    }
    button {
      z-index: 19999;
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
