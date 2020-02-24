<template>
  <!-- 退出删除，切换小区的公共弹框 -->
  <el-dialog
    title="提示"
    :visible.sync="centerDialogVisible"
    :append-to-body="true"
    center
    custom-class="myself-dialog"
    :close-on-click-modal="false"
    :before-close="beforeClose"
  >
    <div style="cursor:default;display:flex;justify-content:center;">{{content}}</div>
    <span slot="footer" class="dialog-footer">
      <el-button class="quxiao1" @click="cancelHandler">取 消</el-button>
      <el-button
        type="primary"
        @click="ensureHandler"
        v-loading="loading"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
        class="qeren"
        style="background:#25bad9;"
      >确 认</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: "Pages",
  props: {
    content: String,
    centerDialogVisible: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {

    }
  },
  created () {
  },
  methods: {
    ensureHandler () {
      this.$emit("ensureHandler", true)
    },
    cancelHandler () {
      this.$emit("cancelHandler", false)
    },
    beforeClose () {
      this.$emit("beforeClose", false)
    }
  }
}
</script>

<style lang="scss" scoped>
//切换小区弹框//
/deep/.myself-dialog {
  background-color: #fff !important;
  width: 350px;
  height: 210px;
  top: 24%;
  border-radius: 5px;
  
  /deep/.el-dialog__header {
    padding: 10px 0 8px 16px !important;
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
    padding: 0px !important;
    div {
      width: 100%;
      height: 110px;
      line-height: 110px;
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
/deep/.el-loading-spinner {
  top: 100% !important;
}
</style>