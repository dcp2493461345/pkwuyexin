<template>
  <div>
    <!--   -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-table :data="tableData" style="width: 100%; min-width:1000px;" empty-text="暂无数据">
          <el-table-column prop="uname" label="姓名" min-width="150" />
          <el-table-column prop="ucphone" label="旧帐号" min-width="150" />
          <el-table-column prop="username" label="新帐号" min-width="150" />
          <!-- 当前状态 -->
          <el-table-column label="当前状态" min-width="150">
            <template slot-scope="scope">
              <p v-html="scope.row.type === 3 ? '申请修改帐号并初始化密码':''"></p>
            </template>
          </el-table-column>
          <!-- 操作 -->
          <el-table-column label="操作" min-width="150">
            <template slot-scope="scope">
              <el-button
                size="mini"
                @click="handleTongyi(scope.$index, scope.row)"
                v-if="isShowTY"
              >同意</el-button>
              <el-button
                class="el-btn2"
                size="mini"
                type="danger"
                @click="handleJujue(scope.$index, scope.row)"
                v-if="isShowRefuse"
              >拒绝</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
    <p v-if="hongShow" class="hongdian" />
    <!-- 分页 -->
    <my-pages :pageInfo="pageInfo" @handleCurrentChange="handleCurrentChange" class="myfenye"></my-pages>
    <!-- 同意弹框 -->
    <dialog-card
      content="同意修改帐号?"
      :centerDialogVisible="centerDialogVisible1"
      :loading="loadingTY"
      @ensureHandler="querenHandler"
      @cancelHandler="cancelTyHandler"
      @beforeClose="cancelTyHandler"
    ></dialog-card>
    <!-- 拒绝弹框 -->
    <dialog-card
      content="拒绝修改帐号?"
      :centerDialogVisible="centerDialogVisible2"
      :loading="loadingRefuse"
      @ensureHandler="querenHandler1"
      @cancelHandler="cancelHandlerRe"
      @beforeClose="cancelHandlerRe"
    ></dialog-card>
  </div>
</template>

<script>
import { getInfo } from '@/utils/auth'
import { Message } from 'element-ui'
import { postToexamine_list, postSelect_button, postToexamine_add, postToexamine_test } from '@/api/Jurisdiction'
export default {
  name: 'AccountAudit',
  data () {
    return {
      dongjieClass: 'dongjie',
      tableData: [],
      muid: null,
      value: false,
      centerDialogVisible1: false,//同意弹框
      centerDialogVisible2: false,//拒绝弹框
      currentState: '',
      ishowAdd: true,
      hongShow: false,
      //分页的信息
      pageInfo: {
        total: null,//总条数
        listRows: 10,//page-size
        page: 1,//当前页
      },
      userInfo: {},
      isShowTY: false,//按钮权限判断之同意按钮是否出现
      isShowRefuse: false,//按钮权限判断之拒绝按钮是否出现
      loadingTY: false,//同意的加载
      loadingRefuse: false,//拒绝的加载
    }
  },
  watch: {
    // 如果 `question` 发生改变，这个函数就会运行
    tableData: function (newQuestion, oldQuestion) {
      if (newQuestion.length === 0) {
        this.hongShow = false
      }
    }
  },
  created () {
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'))
    const { Communityid, uid } = this.userInfo
    const auth_id = this.$route.meta.auth_id
    postToexamine_list({ Communityid, uid }).then(resp => {
      console.log(resp, 'res1111')
      if (resp.msg.data.length) {
        this.hongShow = true
      }
      if (resp.msg.data) {
        this.pageInfo.total = resp.msg.total
        this.pageInfo.page = Number(resp.msg.page)
        this.tableData = resp.msg.data
      }
    })
    //按钮权限判定
    postSelect_button({ Communityid, uid, auth_id }).then(resp => {
      // console.log(resp, '按钮权限')
      if (resp.code === 200) {
        this.buttonLists = resp.data
        var btnList = this.buttonLists
        btnList.forEach(list => {
          if (list.auth_name === '同意') {
            this.isShowTY = true
          }
          if (list.auth_name === '拒绝') {
            this.isShowRefuse = true
          }
        })
      }
    })
  },
  methods: {
    //查询列表数据
    getLists () {
      const { Communityid, uid } = this.userInfo
      const page = this.pageInfo.page
      const count = 10
      postToexamine_list({ Communityid, uid, page, count }).then(resp => {
        // console.log(resp, 'res')
        this.pageInfo.total = resp.msg.total
        this.pageInfo.page = Number(resp.msg.page)
        this.tableData = resp.msg.data
      })
    },
    // 分页设置
    handleCurrentChange (val) {
      this.pageInfo.page = val
      this.getLists()
    },
    //点击同意按钮
    handleTongyi (index, row) {
      // console.log(index, row)
      this.loadingTY = false
      this.muid = row.uid
      this.centerDialogVisible1 = true
    },
    //取消同意弹框
    cancelTyHandler () {
      this.centerDialogVisible1 = false
    },
    //同意
    querenHandler () {
      this.loadingTY = true
      const uid = this.muid
      postToexamine_add({ uid }).then(resp => {
        this.loadingTY = false
        // console.log(resp, '103')
        if (resp.code === 200) {
          this.$message({
            message: resp.msg,
            type: 'success'
          })

          this.getLists()
        } else {
          this.$message({
            message: resp.msg,
            type: 'warning'
          })
        }
        this.centerDialogVisible1 = false
      })
    },
    handleJujue (index, row) {
      this.loadingRefuse = false
      this.muid = row.uid
      this.centerDialogVisible2 = true
    },
    //取消拒绝弹框
    cancelHandlerRe () {
      this.centerDialogVisible2 = false
    },
    querenHandler1 () {
      this.loadingRefuse = true
      const uid = this.muid
      postToexamine_test({ uid }).then(resp => {
        this.loadingRefuse = false
        if (resp.code === 200) {
          this.$message({
            message: resp.msg,
            type: 'success'
          })
          this.getLists()
        } else {
          this.$message({
            message: resp.msg,
            type: 'warning'
          })
        }
        this.centerDialogVisible2 = false
      })
    }
  }
}
</script>
<style lang="scss" scoped>
//卡片的样式
.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}
.clearfix {
  span {
    display: inline-block;
    width: 50px;
    height: 50px;
    // line-height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f00;
    color: #fff;
    width: 57px;
    height: 23px;
    background: rgba(37, 186, 217, 1);
    border-radius: 4px;
    font-size: 10px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: rgba(255, 255, 255, 1);
    cursor: pointer;
  }
}
.box-card {
  min-height: 785px;
  position: relative;
  width: 100%;
  box-shadow: none;
  border: none;
  /deep/.el-card__header {
    border: none;
    border-bottom: none;
    padding: 20px !important;
    .el-table--striped .el-table__body tr.el-table__row--striped td {
      background-color: #eff2f5;
    }
    .el-table td {
      padding: 15px 0 !important;
    }
    .el-table th {
      // padding: 14px 55px !important;
      font-size: 10px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: rgba(144, 147, 153, 1);
    }
    .el-table .cell {
      padding: 0px 0px 0px 65px;
      height: 30px !important;
      line-height: 30px;
      margin: 0px;
      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      .el-button--mini {
        width: 52px;
        height: 30px;
        background: rgba(37, 186, 217, 1);
        border-radius: 4px;
        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: rgba(255, 255, 255, 1);
        border: none;
        padding: 0px;
        line-height: 30px;
        span {
          display: inline-block;
          width: 100%;
          height: 100%;
        }
      }
      .dongjie {
        color: #606266;
        background-color: #fff;
      }
      .notdongjie {
        color: #606266;
      }
      .el-btn2 {
        background-color: #bfbfbf;
      }
    }
  }
}
//表格行样式
.tableRowStyle {
  color: #f00 !important;
  background: #f00 !important;
}
.page {
  position: absolute;
  bottom: 70px;
  right: 4px;
  font-size: 10px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: rgba(102, 102, 102, 1);
}

//红点样式
.hongdian {
  width: 6px;
  height: 6px;
  background-color: #f00;
  border-radius: 5px;
  position: absolute;
  top: 26px;
  left: 240px;
}
.chen {
  /deep/.el-dialog {
    background-color: #fff !important;
    width: 18.23%;
    height: 210px;
    background-color: #fff;
    margin-top: 0% !important;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    -webkit-transform: translate(-50%, -50%);
    -moz-transform: translate(-50%, -50%);
    min-width: 380px;
    border-radius: 5px;
    .el-dialog__header {
      padding: 12px 0 10px 16px;
      text-align: left;
      border-bottom: 1px solid #eff2f5;
      font-size: 16px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: rgba(51, 51, 51, 1);
      .el-dialog__title {
        text-align: left;
        font-size: 16px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: rgba(51, 51, 51, 1);
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
      // padding: 20px 50px 6px 48px !important;
      position: relative;

      div {
        width: 100%;
        height: 110px;
        line-height: 78px;
        font-size: 16px;
        text-align: center;
      }
    }
    .el-dialog__footer {
      position: absolute;
      padding-top: 0px;
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
          font-size: 14px;
          line-height: 0;
          border-radius: 3px !important;
          font-family: Microsoft YaHei;
          font-weight: 400;
          color: rgba(255, 254, 254, 1);
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
      border: 1px solid #25bad9;
    }
  }
}
/deep/.el-pagination.is-background .btn-prev:disabled {
  cursor: default;
}
/deep/.el-pagination__editor {
  background-color: #5fafe4 !important;
  height: 20px;
  width: 30px;
  color: white;
  cursor: pointer;
  margin-left: 0.25vw;
}
/deep/.myfenye {
  top: 35px;
  .record-data {
    left: 20px;
    bottom: 30px;
  }
  .el-pagination {
    bottom: 22px;
    right: 108px;
  }
}
</style>
