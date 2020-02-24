
<template>
  <div id="HouseType">
    <span v-show="showDot" class="dot" />
    <!--搜索栏-->
    <div slot="header" class="clearfix">
      <div class="box-header">
        <span v-if="ask.add" class="add-btn" @click="clickAddHouseType">添加房屋类型</span>
      </div>
    </div>
    <!-- 操作记录 -->
    <el-dialog
      title="操作记录"
      :modal="true"
      :close-on-click-modal="false"
      :append-to-body="true"
      :visible.sync="RecordialogFormVisible"
      custom-class="myRecordForm11"
    >
      <el-form :model="recordData">
        <el-form-item label="上次操作员:" :label-width="formLabelWidth">
          <el-input
            v-model="recordData.uname"
            :disabled="true"
            autocomplete="off"
            class="operration-class"
          />
        </el-form-item>
        <el-form-item label="上次操作时间:" :label-width="formLabelWidth">
          <el-input
            v-model="recordData.time"
            :disabled="true"
            autocomplete="off"
            class="operration-class"
          />
        </el-form-item>
        <el-form-item label="上次操作IP地址:" :label-width="formLabelWidth">
          <el-input
            v-model="recordData.ip"
            :disabled="true"
            autocomplete="off"
            class="operration-class"
          />
        </el-form-item>
      </el-form>
      <div class="btn-confirm-record" @click="RecordialogFormVisible=false">确认</div>
    </el-dialog>
    <!-- 添加表格 -->
    <el-dialog
      title="添加房屋类型"
      custom-class="myAddForm"
      :close-on-click-modal="false"
      :append-to-body="true"
      :visible.sync="AdddialogVisible"
    >
      <el-form ref="form" :model="addData" label-width="96px">
        <el-form-item label="房屋类型:" class="fyTy-class">
          <el-input v-model="addData.typeName" />
          <p class="tips">{{addMistakeToast1}}</p>
        </el-form-item>
        <el-form-item label="物业单价:" class="fyTy-class">
          <el-input v-model="addData.money" />
          <p class="tips">{{addMistakeToast2}}</p>
        </el-form-item>
        <div
          class="addNow"
          style="cursor:pointer"
          @click="clickConfirmAdd"
          v-loading="loadingAdd"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.8)"
        >确认添加</div>
      </el-form>
    </el-dialog>
    <!-- 修改表格 -->
    <el-dialog
      title="修改房屋类型"
      custom-class="myAddForm"
      :close-on-click-modal="false"
      class="position:fixed;top:10px;"
      :append-to-body="true"
      :visible.sync="ModifydialogVisible"
    >
      <el-form ref="form" :model="modifyData" label-width="96px">
        <el-form-item label="房屋类型:">
          <el-input v-model="modifyData.typeName" />
          <p class="tips">{{modiMistakeToast1}}</p>
        </el-form-item>
        <el-form-item label="物业单价:">
          <el-input v-model.trim="modifyData.money" />
          <p class="tips">{{modiMistakeToast2}}</p>
        </el-form-item>
        <div
          class="addNow"
          style="cursor:pointer"
          @click="clickConfirmModify"
          v-loading="loadingModi"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.8)"
        >确认修改</div>
      </el-form>
    </el-dialog>
    <!-- 房屋列表 -->
    <div class="table-box">
      <el-table
        empty-text="暂无数据"
        :data="tableData"
        row-class-name="myRow"
        cell-class-name="myCell"
        style="width: 100%; height:100%;"
      >
        <el-table-column prop="typeName" label="房屋类型" min-width="300" />
        <el-table-column prop="pacic" label="物业费单价(元)" min-width="300" />
        <el-table-column label="操作" min-width="150">
          <template slot-scope="scope">
            <el-button
              v-if="ask.modify"
              type="text"
              size="small"
              class="operateBtn btn-modify"
              @click="handleModifyClick(scope.row)"
            >修改</el-button>
            <el-button
              v-if="ask.record"
              type="text"
              size="small"
              class="operateBtn btn-record"
              style="width:72px;"
              @click="handleRecordClick(scope.row)"
            >操作记录</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <my-pages :pageInfo="pageInfo" @handleCurrentChange="handleCurrentChange" class="myfenye"></my-pages>
    </div>
  </div>
</template>

<script>
import { postSelect_examine, postHouseSelectType, postInesrt_type, postUpdete_type } from '@/api/House.js'
import { mapState } from 'vuex'
import { postSelect_button } from '@/api/Jurisdiction'
export default {
  name: 'HouseType',
  //data数据
  data () {
    return {
      ask: {
        delete: '',
        add: '',
        import: '',
        modify: '',
        houseInfo: '',
        carInfo: '',
        record: '',
        download: ''
      },
      showDot: false,//是否出现红点
      //分页的信息
      pageInfo: {
        total: null,//总条数
        listRows: 10,//page-size
        page: 1,//当前页
      },
      // 操作记录
      formLabelWidth: '120px', // 记录表格宽度
      RecordialogFormVisible: false,
      recordData: {},
      tableData: [
        // {
        //   "oid":32,//房屋主键id
        //   "typea":"住宅",//房屋类型名字
        //   "Communityid":15,//小区id
        //   "time":1571299120,//添加修改时间
        //   "pacic":1.8,//物业单价
        //   "uname":"李永爱",//操作人名字
        //   "ip":"127.0.0.1",//ip地址
        //   "typexiu":null,//修改前的类容
        //   "pacics":null//修改前的物业费单价
        //   }
      ],
      AdddialogVisible: false, // 添加框
      ModifydialogVisible: false, // 修改框
      addData: {
        typeName: '', // 房屋类型名称
        money: '', // 房屋单价,
      },
      modifyData: {
        oid: '', // 房屋类型id
        typeName: '', // 房屋类型名称
        money: '', // 房屋单价
        uname: '', // 用户名字(操作人名字)
      },
      userInfo: {},// 用户相关信息
      addMistakeToast1: '',//添加房屋类型错误提示
      addMistakeToast2: '',//添加类型错误提示
      modiMistakeToast1: '',//修改房屋类型错误提示
      modiMistakeToast2: '',//修改类型错误提示
      loadingAdd: false,//加载控制之确认添加
      loadingModi: false,//加载控制之确认修改
    }
  },
  created () {
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'))
    const { Communityid, uid } = this.userInfo
    const auth_id = this.$route.meta.auth_id
    //获取按钮权限
    postSelect_button({ Communityid, uid, auth_id }).then(res => {
      if (res.code === 200) {
        this.buttonLists = res.data
        var btnList = this.buttonLists
        btnList.forEach(item => {
          if (item.auth_name === '添加房屋类型') {
            this.ask.add = true
          }
          if (item.auth_name === '修改') {
            this.ask.modify = true
          }
          if (item.auth_name === '操作记录') {
            this.ask.record = true
          }
        })

      }
    })
    //判断是否有红点出现
    this.getJudgeList()
    //请求数据列表
    this.getHouseList()
  },
  watch: {
    'modifyData.money': {
      handler (n, o) {
        n = String(n)
        if (Number(n) == n) {
          if (n.includes('.')) {
            this.modifyData.money = n.slice(0, n.indexOf('.') + 3)
          }
        } else {
          this.modifyData.money = o
        }
      },
      deep: true,
      immediate: true
    },
    'addData.money': {
      handler (n, o) {
        console.log(n, 'nn')
        n = String(n)
        if (Number(n) == n) {
          if (n.includes('.')) {
            this.addData.money = n.slice(0, n.indexOf('.') + 3)
          }
        } else {
          this.addData.money = o
        }
      },
      deep: true,
      immediate: true
    }
  },
  computed: {
    ...mapState(['secondRouterLists'])
  },
  methods: {
    // 请求列表
    getHouseList () {
      const Communityid = this.userInfo.Communityid
      const page = this.pageInfo.page
      postHouseSelectType({ Communityid, page }).then(resp => {
        this.pageInfo.total = resp.msg.total
        this.pageInfo.page = Number(resp.msg.page)
        this.tableData = resp.msg.data
      })
    },
    //判断红点是否出现
    getJudgeList () {
      const Communityid = this.userInfo.Communityid
      const page = this.pageInfo.page
      postSelect_examine({ Communityid, page }).then(resp => {
        if (resp.code === 200) {
          if (resp.msg.data.length > 0) {
            if (this.secondRouterLists.children) {
              this.secondRouterLists.children.forEach(item => {
                if (item.meta.title === '审核列表') {
                  this.showDot = true
                } else {
                  this.showDot = false
                }
              })
            }
          }
        }
      })
    },
    // 格式化时间
    formatDate (now) {
      var year = now.getFullYear()
      var month = now.getMonth() + 1
      var date = now.getDate()
      var hour = now.getHours()
      var minute = now.getMinutes()
      var second = now.getSeconds()
      return year + '-' + month + '-' + date + ' ' + hour + ':' + minute + ':' + second
    },
    handleRecordClick (v) {
      this.RecordialogFormVisible = true
      this.recordData.ip = v.ip // ip
      this.recordData.time = v.time // 操作时间
      this.recordData.uname = v.uname // 操作人员
    },
    // 点击添加房屋类型
    clickAddHouseType () {
      this.loadingAdd = false
      //清空之前添加的数据
      this.addData.typeName = ''
      this.addData.money = ''
      this.AdddialogVisible = true
    },
    // 点击修改
    handleModifyClick (v) {
      this.loadingModi = false
      //数据回显
      this.modifyData.typeName = v.typeName
      this.modifyData.oid = v.oid
      this.modifyData.money = v.pacic
      this.modifyData.uname = v.uname
      //弹框出现
      this.ModifydialogVisible = true
    },
    /* 添加表单相关事件 */
    // 确认添加
    clickConfirmAdd () {
      this.loadingAdd = true
      const { uname, Communityid } = this.userInfo
      const { typeName, money } = this.addData
      console.log({ uname, Communityid, typeName, money }, '参数')
      postInesrt_type({ uname, Communityid, typeName, money }).then(resp => {
        this.loadingAdd = false
        if (resp.code === 200) {
          this.$message({
            message: resp.msg,
            type: 'success'
          })
          this.AdddialogVisible = false // 关闭添加
          this.handleCurrentChange(1)
        } else if (resp.code === 401) {
          this.addMistakeToast1 = resp.msg
          setTimeout(() => {
            this.addMistakeToast1 = ''
          }, 2000)
        } else if (resp.code === 400) {
          this.$message({
            message: resp.msg,
            type: 'error'
          })
          this.AdddialogVisible = false // 关闭添加
        }
      })
    },
    /* 修改表单相关事件 */
    // 确认修改
    clickConfirmModify () {
      this.loadingModi = true
      postUpdete_type(this.modifyData).then(resp => {
        this.loadingModi = false
        if (resp.code === 200) {
          this.$message({
            message: resp.msg,
            type: 'success'
          })
          this.ModifydialogVisible = false // 关闭修改弹框
          this.getHouseList()
        } else if (resp.code === 401) {
          this.modiMistakeToast1 = resp.msg
          setTimeout(() => {
            this.modiMistakeToast1 = ''
          }, 2000)
        } else if (resp.code === 400) {
          this.$message({
            message: resp.msg,
            type: 'warning'
          })
          this.ModifydialogVisible = false // 关闭修改弹框
        }
      })
    },
    handleCurrentChange (val) {
      this.pageInfo.page = val
      this.getHouseList()
    },
  }
}
</script>
<style lang="scss" scoped>
/deep/.el-table__fixed-right::before {
  height: 0;
}
/deep/.el-table__body tr:hover > td {
  background-color: #eff2f5 !important;
}

/deep/.el-table__body tr.current-row > td {
  background-color: #eff2f5 !important;
}
.dot {
  display: inline-block;
  z-index: 10;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: #f44;
  position: absolute;
  top: -46px;
  left: 220px;
}
/deep/.btn-modify {
  background: #25bad9;
}
/deep/.btn-record {
  background-color: #cccccc;
}
/deep/.operateBtn {
  color: #fff;
  display: inline-block;
  border-radius: 4px;
  height: 30px;
  width: 52px;
  padding: 4px;
  font-size: 14px;
}
//添加表单样式
/deep/ .myAddForm {
  background-color: #fff;
  margin-top: 0% !important;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  -webkit-transform: translate(-50%, -50%);
  -moz-transform: translate(-50%, -50%);
  min-width: 380px;
  width: 26.04% !important;
  border-radius: 5px;
  .el-dialog__header {
    //header
    border-bottom: 0.5px solid #eff2f5;
    padding: 10px 0 8px 16px !important;
    .el-dialog__title {
      color: #333333;
      font-size: 16px;
    }
    button {
      position: absolute;
      top: 14px;
    }
  }
  .el-dialog__body {
    padding: 24px 75px 55px 50px !important;
  }
  .addNow {
    height: 30px;
    width: 72px;
    position: absolute;
    background-color: #f8ac59;
    line-height: 30px;
    color: #fffefe;
    font-size: 14px;
    border-radius: 4px;
    text-align: center;
    bottom: 24px;
    left: 50%;
    transform: translateX(-50%);
  }
  .el-form-item {
    height: 36px !important;
    margin-bottom: 25px;
    .el-form-item__label {
      //lable
      color: #666666;
      font-size: 14px;
      line-height: 32px;
    }
    .el-form-item__content {
      //content
      border: 1px solid #d2d2d2;
      border-radius: 4px;
      height: 32px !important;
      .el-input {
        width: 78% !important;
      }
      .el-input__inner {
        height: 29px !important;
        top: -24px;
        left: 0px;
        position: absolute;
        color: #333;
      }
      .tips {
        color: red;
        font-size: 14px;
        position: absolute;
        bottom: -31px;
        left: 0;
      }
    }
  }
  /deep/.el-loading-spinner {
    top: 65% !important;
  }
}
/deep/.el-table::before {
  background-color: #fff;
}
//操作记录表格样式
/deep/.myRecordForm11 {
  background-color: #fff;
  margin-top: 0% !important;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  -webkit-transform: translate(-50%, -50%);
  -moz-transform: translate(-50%, -50%);
  border-radius: 5px;
  min-width: 410px;
  height: 286px;
  width: 24.43%;
  .el-dialog__header {
    padding: 14px 0 10px 20px;
    height: 43px;
    border-bottom: 1px solid #eff2f5;
    .el-dialog__title {
      position: absolute;
      line-height: 16px;
      font-size: 16px;
    }
    .el-dialog__headerbtn {
      top: 14px;
    }
  }
  .el-dialog__body {
    overflow: hidden;
    padding: 24px 62px 43px 53px !important;
  }
  .el-form-item {
    width: 100% !important;
    height: 32px !important;
  }
  .el-form-item__content {
    border: 1px solid #d2d2d2;
    border-radius: 4px;
    height: 32px;
    cursor: default;
    .el-input {
      height: 28px;
      .el-input__inner {
        position: absolute;
        top: 1px;
        height: 28px !important;
        cursor: default !important;
      }
    }
  }
  .el-form-item__label {
    text-align: left;
    font-size: 14px;
    line-height: 32px !important;
    padding: 0 !important;
  }
  .btn-confirm-record {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    background-color: #f8ac59;
    min-width: 36px;
    text-align: center;
    width: 72px;
    height: 30px;
    line-height: 19px;
    padding: 5px 8px;
    color: #fffefe;
    border-radius: 4px;
    font-size: 14px;
    bottom: 24px;
    cursor: pointer;
  }
}

#HouseType {
  position: relative;
  height: 89%;
  margin: 20px;
  background-color: #fff;
  .table-box {
    //table
    position: relative;
    width: 100%;
    top: 12px;
    height: 618px;
    min-width: 850px;
    min-height: 660px;
    bottom: 32px;
    /deep/.el-table__header {
      width: 100% !important;
    }
    /deep/.myRow {
      height: 30px;
      padding: 0;
    }
    /deep/.myRow > td {
      padding: 15px 0;
    }
    /deep/.myCell {
      border-collapse: collapse;
    }
  }
  .page-box {
    position: absolute;
    bottom: 0;
  }
  .my-pagination-box {
    display: inline-block;
  }
  .top-button-box {
    position: relative;
    background-color: #999;
    height: 60px;
    .btn1 {
      position: absolute;
      top: 50%;
      bottom: 50%;
      margin-top: -13px;
      left: 20px;
      width: 52px;
      height: 26px;
      cursor: pointer;
      text-align: center;
      line-height: 28px;
      border-radius: 4px;
      background-color: #25bad9;
      display: inline-block;
      color: #fff;
      padding: 0 12px;
      font-size: 14px;
    }
    .search-box {
      height: 26px;
      position: absolute;
      top: 50%;
      right: 20px;
      bottom: 50%;
      margin-top: -13px;
      input {
        outline: none;
        border: none;
      }
    }
  }

  .box-header {
    height: 30px;
    position: relative;
    .add-btn {
      cursor: pointer;
      background-color: #25bad9;
      color: #fff;
      height: 30px;
      line-height: 30px;
      position: absolute;
      font-size: 14px;
      top: 42%;
      bottom: 50%;
      margin-top: -13px;
      padding: 0 8px;
      border-radius: 4px;
    }
    .search-btn {
      position: absolute;
      height: 30px;
      background-color: #25bad9;
      top: 42%;
      bottom: 50%;
      right: 20px;
      margin-top: -13px;
      z-index: 9;
      color: #fff;
      font-size: 14px;
      line-height: 26px;
      padding: 0 5px;
      cursor: pointer;
    }
    .sreach-box {
      width: 180px;
      height: 26px;
      position: absolute;
      top: 50%;
      bottom: 50%;
      right: 20px;
      margin-top: -13px;
      background-color: #ddd;
      border: 1px solid #ddd;
      /deep/.el-input__inner {
        height: 100% !important;
        padding-left: 0 !important;
        cursor: default;
      }
    }
  }
}
.fyTy-class {
  // background-color: #f00;
  position: relative;
  /deep/.el-input__inner {
    position: absolute;
    top: -19px;
  }
}
.operration-class {
  // background-color: #f00;
  // color: red;
  /deep/.el-input__inner {
    color: #333 !important;
  }
}
/deep/.myfenye {
  top: 101px;
  .record-data {
    margin-top: -52px;
  }
  .el-pagination {
    bottom: 27px;
  }
}
/deep/.el-table__empty-block {
  border-bottom: 1px solid #eeeeee !important;
}
</style>
