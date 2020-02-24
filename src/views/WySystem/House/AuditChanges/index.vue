<template>
  <div class="mm-class">
    <!-- 分页 -->
    <my-pages :pageInfo="pageInfo" @handleCurrentChange="handleCurrentChange" class="myfenye"></my-pages>
    <div id="audit-changes">
      <span v-show="showDot" class="dot" />
      <!-- 表格 -->
      <Table
        :tableData="judgeList"
        :is-show-detail="isShowDetail"
        @bridge="getMesFromChild"
        @fun1="handleDetailClick"
        @fun2="handleJudgeClick"
        @fun3="handleModifyClick"
        @fun4="handleUserClick"
        @fun5="handleCarClick"
        @fun6="handleRecordClick"
        @back="back"
      />
      <!-- 申请修改详情弹窗 -->
      <el-dialog
        v-if="detailFormVisible"
        :title="isShowDelete?'审核':'申请修改详情'"
        :custom-class="isShowDelete?'myDetailForm':'myDetailForm1'"
        :append-to-body="true"
        :visible.sync="detailFormVisible"
        :close-on-click-modal="false"
        :before-close="handleDetailClose"
      >
        <el-form label-width="380px">
          <div v-if="!isShowDelete">
            <div class="row">
              <span class="t1">房屋类型:</span>
              <span class="t2">{{ detailData.data.typeName }}</span>
              <span class="t3">修改为:</span>
              <span class="t4">{{ detailData.data.typeNames }}</span>
            </div>
            <div class="row">
              <span class="t1">楼栋:</span>
              <span class="t2">{{ detailData.data.userHouseBuilding }}</span>
              <span class="t3">修改为:</span>
              <span
                class="t4"
              >{{ detailData.data.userHouseBuildings=='0'?'':detailData.data.userHouseBuildings }}</span>
            </div>
            <div class="row">
              <span class="t1">单元:</span>
              <span class="t2">{{ detailData.data.userHouseUnit }}</span>
              <span class="t3">修改为:</span>
              <span
                class="t4"
              >{{ detailData.data.userHouseUnits=='0'?'':detailData.data.userHouseUnits }}</span>
            </div>
            <div class="row">
              <span class="t1">门牌号:</span>
              <span class="t2">{{ detailData.data.userHouseNumber }}</span>
              <span class="t3">修改为:</span>
              <span
                class="t4"
              >{{ detailData.data.userHouseNumbers=='0'?'':detailData.data.userHouseNumbers }}</span>
            </div>
            <div class="row">
              <span class="t1">房屋面积:</span>
              <span class="t2">{{ detailData.data.Housingarea }}</span>
              <span class="t3">修改为:</span>
              <span
                class="t4"
              >{{ detailData.data.Housingareas=='0'?'':detailData.data.Housingareas }}</span>
            </div>
            <div class="row">
              <span class="t1">物业费单价:</span>
              <span class="t2">{{ detailData.data.Price }}</span>
              <span class="t3">修改为:</span>
              <span class="t4">{{ detailData.data.Prices=='0'?'':detailData.data.Prices }}</span>
            </div>
            <div class="row" style="position:relative; height:100px;">
              <span style="position:absolute;left:0">*申请理由:</span>
              <textarea
                v-model="detailData.data.centns"
                disabled
                rows="1"
                cols="40"
                style="background:#fff;position:absolute;width:240px;right:0;resize:none;min-height:100px;padding:8px;overflow:scroll;overflow-y:hidden;overflow-x:hidden;border-radius: 4px;border-color: #d2d2d2;"
                onfocus="window.activeobj=this;this.clock=setInterval(function(){activeobj.style.height=activeobj.scrollHeight+'px';},10);"
                onblur="clearInterval(this.clock);"
              />
            </div>
          </div>
          <div v-if="isShowDelete" style="height:100px;padding-top:20px;">
            <p
              style="color:#FE3D3D;font-size:14px;text-align:center;font-size:16px;"
            >{{ detailData.test }}</p>
            <p
              style="padding-top:25px;height:80px;"
            >申请理由:&nbsp;&nbsp;&nbsp;{{ detailData.data.centns }}</p>
          </div>
          <div class="btn agreen" style="cursor:pointer" @click="agreen">同意</div>
          <div class="btn refuse" style="cursor:pointer" @click="refuse">拒绝</div>
        </el-form>
      </el-dialog>
      <!-- 删除新增弹框 -->
      <!-- 您确认同意此申请弹框 -->
      <dialog-card
        content="您确定同意此申请？"
        :centerDialogVisible="centerDialogVisibleAgreen"
        @ensureHandler="sendAgreenRequest"
        @cancelHandler="cancelHandler1"
        @beforeClose="cancelHandler1"
      ></dialog-card>
      <el-dialog
        title="提示"
        :modal="true"
        :append-to-body="true"
        :visible.sync="centerDialogVisibleDele"
        :close-on-click-modal="false"
        custom-class="mydeleForm"
        :before-close="handleClosedd"
        top="20%"
      >
        <div class="content">
          <span style="color:red;">同意</span>，该房屋的所有数据将被删除，请确认做好备份后再进行删除，您确定要删除吗?
        </div>
        <div slot="footer" class="dialog-footer">
          <button @click="handleClosedd">取 消</button>
          <button @click="deleHandler" class="queren">确 定</button>
        </div>
      </el-dialog>
      <!-- 操作记录 -->
      <!-- 操作记录 -->
      <el-dialog
        v-if="showRecord"
        title="操作记录"
        :modal="true"
        :append-to-body="true"
        :visible.sync="RecordialogFormVisible"
        :close-on-click-modal="false"
        custom-class="myRecordForm"
      >
        <el-form>
          <el-form-item v-if="recordData.code !== 5" label="上次操作员:" :label-width="formLabelWidth">
            <el-input v-model="recordData.data.uname" :disabled="true" autocomplete="off" />
          </el-form-item>
          <el-form-item v-if="recordData.code !== 5" label="上次操作时间:" :label-width="formLabelWidth">
            <el-input v-model="recordData.data.time" :disabled="true" autocomplete="off" />
          </el-form-item>
          <el-form-item
            v-if="recordData.code !== 5"
            label="上次操作IP地址:"
            :label-width="formLabelWidth"
          >
            <el-input v-model="recordData.data.ip" :disabled="true" autocomplete="off" />
          </el-form-item>
          <el-form-item v-if="recordData.code === 5" label="上次审核人:" :label-width="formLabelWidth">
            <el-input v-model="recordData.usname" :disabled="true" autocomplete="off" />
          </el-form-item>
          <el-form-item v-if="recordData.code === 5" label="上次审核时间:" :label-width="formLabelWidth">
            <el-input v-model="recordData.times" :disabled="true" autocomplete="off" />
          </el-form-item>
          <el-form-item v-if="recordData.code === 5" label="上次审核结果:" :label-width="formLabelWidth">
            <el-input v-model="recordData.Result" :disabled="true" autocomplete="off" />
          </el-form-item>
        </el-form>
        <div class="btn-confirm-record" @click="RecordialogFormVisible=false">确认</div>
      </el-dialog>
      <!-- 拒绝理由弹框 -->
      <el-dialog
        title="拒绝"
        custom-class="myDetailForm"
        :append-to-body="true"
        :visible.sync="refuseFormVisible"
        :close-on-click-modal="false"
        :before-close="handleRefuseClose"
      >
        <el-form label-width="380px">
          <div class="row" style="position:relative; height:100px;">
            <span style="position:absolute;left:0">*拒绝理由:</span>
            <textarea
              v-model="refuseReason.centnsa"
              rows="1"
              cols="40"
              autofocus
              style="outline:none;border-radius:4px;left:80px;position:absolute;width:228px;right:0;resize:none;height: 100px;padding:8px;overflow:scroll;overflow-y:hidden;overflow-x:hidden;border;border-color:rgb(210,210,210);"
            />
            <p
              class="tips"
              style="position:absolute;top:94px;left:80px;font-size:14px;color:#f44;"
            >{{judgeTips}}</p>
          </div>
          <div class="btn confirm" style="cursor:pointer" @click="didRefuse">确认</div>
        </el-form>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import Table from './TableList'
import Pages from '../Pages'
import { postSelect_examine, postupdelet_agree, postdatele_list, postupdelet_refuse, postdeirte_list } from '@/api/House.js'
import { postSelect_button } from '@/api/Jurisdiction'
export default {
  name: 'AuditChanges',
  components: {
    Table,
    Pages
  },
  //data数据
  data () {
    return {
      ff: 'fff',
      isShowDelete: false, // 是删除还是详情
      showDot: false,
      showRecord: false,
      formLabelWidth: '120px', // 记录表格宽度
      RecordialogFormVisible: false,
      tips: {
        reason: false // 拒绝理由是否填写
      },
      refuseReason: {
        centnsa: ''
      },
      refuseFormVisible: false,
      detailFormVisible: false,
      centerDialogVisibleDele: false,//删除同意弹框
      centerDialogVisibleAgreen: false,//同意此申请弹框
      isShowPage: true,
      isShowDetail: false,
      userInfo: { // 用户信息
      },
      recordData: {
      },
      judgeList: [], // 审核列表
      judgeListC: [],
      detailData: {},
      //分页的信息
      pageInfo: {
        total: 0,//总条数
        listRows: 10,//page-size
        page: 1,//当前页
      },
      judgeTips: '',//填写审核备注
      loadingDele: false,//加载控制之删除
    }
  },
  watch: {
    'judgeList': {
      handler (n, o) {
        if (n.length === 0) {
          this.showDot = false
        }
      },
      deep: true,
      immediate: true
    },
  },
  created () {
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'))
    const { Communityid, uid } = this.userInfo
    const auth_id = this.$route.meta.auth_id

    this.getJudgeList()
  },
  methods: {
    // 获取审核列表
    getJudgeList () {
      const Communityid = this.userInfo.Communityid
      const page = this.pageInfo.page
      const count = 10
      postSelect_examine({ Communityid, page, count }).then(resp => {
        console.log(resp, 'jhjfhjfha ')
        if (resp.code === 200) {
          this.pageInfo.total = resp.msg.total
          this.pageInfo.page = Number(resp.msg.page)
          this.judgeList = resp.msg.data
          if (resp.msg.data.length > 0) {
            this.showDot = true
          }
        }
      })
    },
    handleDetailClose () {
      this.detailFormVisible = false
      this.centerDialogVisibleAgreen = false
    },
    change () {
      this.isShowDetail = !this.isShowDetail
    },
    // 页码相关事件
    handleSizeChange () {
      console.log(11)
    },
    handleCurrentChange (val) {
      if (this.isMainBox) {
        this.pageInfo.page = val
        this.getHouseList()
      } else {
        this.pageInfo.page = val
        this.sendSearchRequest()
      }
      // console.log(val)
    },
    nextClickHandler (val) {
      // console.log(val, '354')
    },
    // 点击详情
    handleDetailClick (v) {
      // console.log(v, '点击房屋详情')
      // v.data.checktime = v.data.checktime.slice(0, -9)
      // v.data.wuye_price = v.data.wuye_price.slice(0, -9)
      const d = []
      d.push(v)
      this.isShowPage = false
      this.isShowDetail = true
      this.judgeListC = this.judgeList
      this.judgeList = d
    },
    // 点击返回
    back () {
      this.isShowPage = true
      this.isShowDetail = false
      this.judgeList = this.judgeListC
    },
    // 点击审核
    handleJudgeClick (v) {
      console.log(v, '点击审核')
      this.detailFormVisible = true
      this.detailData = v
      if (v.code === 3) {
        // 1为正常2申请修改3删除房屋4.审核同意5审核拒绝
        this.isShowDelete = true
      } else if (v.code === 2) {
        this.isShowDelete = false
      }
    },
    agreen () {
      this.detailFormVisible = false
      if (this.isShowDelete) {
        //删除同意确认弹框出现
        this.centerDialogVisibleDele = true
      } else {
        // this.sendAgreenRequest() // 同意修改
        this.centerDialogVisibleAgreen = true
      }
    },
    deleHandler () {
      // 同意删除
      const { userHouseId } = this.detailData
      postdatele_list({ userHouseId }).then(resp => {
        // console.log(resp, '删除同意')
        if (resp.code === 200) {
          this.$message({
            message: resp.msg,
            type: 'success'
          })
          this.centerDialogVisibleDele = false
          this.getJudgeList()
        } else {
          this.$message({
            message: resp.msg,
            type: 'warning'
          })
          this.centerDialogVisibleDele = false
        }
      })
    },
    refuse () {
      // alert("拒绝")
      this.detailFormVisible = false
      this.refuseFormVisible = true
    },
    handleRefuseClose () {
      this.refuseReason.centnsa = ''
      this.refuseFormVisible = false
      this.detailFormVisible = true
    },
    handleClosedd () {
      this.detailFormVisible = true
      this.centerDialogVisibleDele = false
    },
    didRefuse () {
      // if (this.refuseReason.centnsa) {
      if (this.isShowDelete) {
        //审核删除的拒绝
        this.sendRefuseRequest1()
      } else {
        //审核详情的拒绝
        this.sendRefuseRequest()
      }
      // } else {
      //   this.tips.reason = true
      //   setTimeout(() => {
      //     this.tips.reason = false
      //   }, 3000)
      // }
    },
    // 同意修改
    sendAgreenRequest () {
      console.log(this.detailData, 'this.detailData')
      const { userHouseId } = this.detailData
      const usname = this.userInfo.uname
      postupdelet_agree({ userHouseId, usname }).then(resp => {
        console.log(resp, '修改同意')
        if (resp.code === 400) {
          this.$message({
            message: resp.msg,
            type: 'warning'
          })
          this.centerDialogVisibleAgreen = false

        } else {
          //修改同意成功
          this.getJudgeList()
          this.centerDialogVisibleAgreen = false
          this.$message({
            message: resp.msg,
            type: 'success'
          })
        }
      })
    },
    // 修改拒绝
    sendRefuseRequest () {
      const { userHouseId } = this.detailData
      const usname = this.userInfo.uname
      const { centnsa } = this.refuseReason
      postupdelet_refuse({ userHouseId, usname, centnsa }).then(resp => {
        console.log(resp, '修改拒绝res')
        if (resp.code === 401) {
          this.judgeTips = resp.msg
          setTimeout(() => {
            this.judgeTips = ''
          }, 2000)
        } else if (resp.code === 200) {
          this.$message({
            message: resp.msg,
            type: 'success'
          })
          this.getJudgeList()
          this.refuseFormVisible = false
          this.refuseReason.centnsa = ''
        } else {
          this.$message({
            message: res.data.msg,
            type: 'warning'
          })
          this.refuseFormVisible = false
          this.refuseReason.centnsa = ''
        }
      })
    },
    // 删除拒绝
    sendRefuseRequest1 () {
      const { userHouseId } = this.detailData
      const usname = this.userInfo.uname
      const { centnsa } = this.refuseReason
      postdeirte_list({ userHouseId, usname, centnsa }).then(resp => {

        if (resp.code === 402) {
          this.judgeTips = resp.msg
          setTimeout(() => {
            this.judgeTips = ''
          }, 2000)
        } else if (resp.code === 200) {
          this.$message({
            message: resp.msg,
            type: 'success'
          })
          this.getJudgeList()
          this.refuseFormVisible = false
          this.refuseReason.centnsa = ''
        } else {
          this.$message({
            message: res.data.msg,
            type: 'warning'
          })
          this.refuseFormVisible = false
          this.refuseReason.centnsa = ''
        }
      })
    },
    // 点击修改
    handleModifyClick (v) {
      // alert("modify")
    },
    // 点击住户
    handleUserClick (v) {
      // alert("user")
    },
    // 点击车位
    handleCarClick (v) {
      // alert("car")
    },
    cancelHandler1 () {
      this.centerDialogVisibleAgreen = false
      this.detailFormVisible = true
    },
    // 点击记录
    handleRecordClick (v) {
      console.log(v, '点击操作记录')
      this.recordData = v
      this.showRecord = true
      this.RecordialogFormVisible = true
    },
    getMesFromChild (v) { // 获取子组件传递过来的值
      console.log(v, '22222222222')
    },
    // 从本地获取登录用户信息
    getUserInfo () {
      const local = JSON.parse(localStorage.getItem('userInfo'))
      this.userInfo.token = local.token
      this.userInfo.Communityid = local.data.Communityid
      this.userInfo.uname = local.data.uname
    },

  }

}
</script>
<style lang="scss" scoped>
.mm-class {
  height: 781px;
  position: relative;
  margin: 20px;
  background-color: #fff;
}
#audit-changes {
  height: 735px;
  // margin: 20px;
  background-color: #fff;
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
//操作记录表格样式
/deep/.myRecordForm {
  background-color: #fff;
  margin-top: 0% !important;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  -webkit-transform: translate(-50%, -50%);
  -moz-transform: translate(-50%, -50%);
  border-radius: 5px;
  min-width: 380px;
  height: 286px;
  width: 24.43%;
  .el-dialog__header {
    height: 43px;
    border-bottom: 1px solid #efefef;
    .el-dialog__title {
      position: absolute;
      line-height: 0;
      font-size: 16px;
    }
    .el-dialog__headerbtn {
      top: 12px;
    }
  }
  .el-dialog__body {
    position: relative;
    padding: 23px 50px 64px 48px !important;
    .el-form-item {
      min-height: 30px;
      height: 24px !important;
      margin-left: 5px;
      .el-form-item__content {
        border: 1px solid #d2d2d2;
        line-height: 30px;
        border-radius: 4px;
        width: 64%;
      }
      .el-input__inner {
        height: 100% !important;
        color: #333;
      }
    }
  }
  .el-input__inner {
    cursor: default !important;
  }
  .el-form-item__label {
    text-align: left;
    line-height: 30px;
  }
  .btn-confirm-record {
    position: absolute;
    width: 72px;
    height: 30px;
    bottom: 24px !important;
    left: 50%;
    transform: translateX(-50%);
    background-color: #f8ac59;
    min-width: 36px;
    text-align: center;
    padding: 5px 8px;
    color: #fffefe;
    border-radius: 4px;
    bottom: 10px;
    cursor: pointer;
  }
}

//申请修改详情//
/deep/.myDetailForm {
  margin-top: 0 !important;
  position: fixed;
  top: 38%;
  left: 39%;
  border-radius: 5px;
  width: 435px;
  display: flex;
flex-direction: column;
margin:0 !important;
position:absolute;
top:50%;
left:50%;
transform:translate(-50%,-50%);
  .el-dialog__header {
    position: relative;
    border-bottom: 1px solid #eff2f5;
    height: 40px;
    .el-dialog__title {
      position: absolute;
      top: 0;
      height: 40px;
      font-size: 16px;
      line-height: 40px;
      color: #333333;
    }
    .el-dialog__headerbtn {
      top: 12px;
    }
  }
  .el-dialog__body {
    position: relative;
    padding: 30px 50px 45px 60px !important;
    .el-form {
      padding-bottom: 14px;
      position: relative;
    }
    .row {
      position: relative;
      line-height: 32px;
      margin-bottom: 24px;
      span {
        display: inline-block;
      }
      .t1 {
        width: 85px;
      }
      .t2 {
        width: 85px;
      }
      .t3 {
        width: 57px;
      }
      .t4 {
        border: 1px solid #d2d2d2;
        width: 30%;
        height: 32px;
        position: absolute;
        top: -1px;
        border-radius: 3px;
        padding-left: 8px;
        line-height: 32px;
        color: #333;
      }
    }
  }
  .btn {
    padding: 5px 22px;
    position: absolute;
    width: 72px;
    height: 30px;
    bottom: -22px;
    color: #fff;
    border-radius: 4px;
  }
  .refuse {
    left: 30px;
    background: #5fafe4;
  }
  .agreen {
    right: 30px;
    background: #25bad9;
  }
  .confirm {
    background-color: #f8ac59;
    left: 50%;
    transform: translateX(-50%);
  }
}
/deep/.myDetailForm1 {
  margin-top: 0 !important;
  position: fixed;
  top: 17%;
  left: 38%;
  border-radius: 5px;
  width: 435px;
  height: 570px;
  display: flex;
flex-direction: column;
margin:0 !important;
position:absolute;
top:50%;
left:50%;
transform:translate(-50%,-50%);
  .el-dialog__header {
    position: relative;
    border-bottom: 1px solid #eff2f5;
    height: 40px;
    .el-dialog__title {
      position: absolute;
      top: 0;
      height: 40px;
      font-size: 16px;
      line-height: 40px;
      color: #333333;
    }
    .el-dialog__headerbtn {
      top: 12px;
    }
  }
  .el-dialog__body {
    position: relative;
    padding: 24px 50px 20px 60px !important;
    .el-form {
      padding-bottom: 14px;
      position: relative;
    }
    .row {
      position: relative;
      line-height: 32px;
      margin-bottom: 22px;
      span {
        display: inline-block;
      }
      .t1 {
        width: 85px;
      }
      .t2 {
        width: 85px;
      }
      .t3 {
        width: 57px;
      }
      .t4 {
        border: 1px solid #d2d2d2;
        width: 30%;
        height: 32px;
        position: absolute;
        top: -1px;
        border-radius: 3px;
        padding-left: 8px;
        line-height: 32px;
        color: #333;
        border-color: #d2d2d2;
      }
    }
  }
  .btn {
    padding: 5px 22px;
    position: absolute;
    width: 72px;
    height: 30px;
    bottom: -22px;
    color: #fff;
    border-radius: 4px;
  }
  .refuse {
    left: 30px;
    background: #5fafe4;
  }
  .agreen {
    right: 30px;
    background: #25bad9;
  }
  .confirm {
    background-color: #f8ac59;
    left: 50%;
    transform: translateX(-50%);
  }
}
/deep/.mydeleForm {
  width: 350px;
  height: 210px;
  background: rgba(255, 255, 255, 1);
  border-radius: 5px;
  display: flex;
flex-direction: column;
margin:0 !important;
position:absolute;
top:50%;
left:50%;
transform:translate(-50%,-50%);
  .el-dialog__header {
    font-size: 16px !important;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
    padding: 10px 0px 8px 20px;
    border-bottom: 1px solid rgba(239, 242, 245, 1);
    cursor: default;
    .el-dialog__title {
      font-size: 16px !important;
    }
    .el-dialog__headerbtn {
      top: 13px !important;
    }
  }
  .el-dialog__body {
    padding: 33px 42px;
    .content {
      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #666666;
      line-height: 24px;
    }
  }
  .el-dialog__footer {
    padding: 0px;
    .dialog-footer {
      padding: 0px 10px;
      width: 100%;
      height: 50px;
      display: flex;
      justify-content: space-around;
      button {
        width: 80px;
        height: 30px;
        border: 1px solid rgba(204, 204, 204, 1);
        border-radius: 3px;
        cursor: pointer;
        background-color: #fff;
        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: rgba(153, 153, 153, 1);
      }
      .queren {
        background: rgba(37, 186, 217, 1);
        border-radius: 3px;
        color: #ffffff;
        border: none;
      }
    }
  }
}
/deep/.myfenye {
  top: 791px;
  .record-data {
    margin-top: -40px;
  }
  .el-pagination {
    bottom: 15px;
  }
}
</style>>
