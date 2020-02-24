<template>
  <div id="compcharge">
    <!-- v-if="showDot" -->
    <span v-if="showDot" class="dot"></span>
    <!-- 三级菜单出口 -->
    <!-- <router-view /> -->
    <!--
    <div class="top-button-box">
      <span class="btn1">收费</span>
      <span class="search-box">
        <input type="text">
      </span>
    </div> -->

    

    <!--搜索栏-->
    <div v-if="isShowDetail" class="back" @click="back1" style="cursor:pointer;position:absolute;top:15px;left:20px;padding:5px;background:#25BAD9;color:#fff;border-radius:4px;">返回上一级</div>
    <div v-if="!isShowDetail" slot="header" class="clearfix">
      <div class="box-header">
        <span v-show="isSearch">
          <span class="add-btn" @click="handleBack">返回上一级</span>
        </span>
        <!-- <span class="add-btn" @click="clickCharge">收费</span>  -->
        <span v-show="!isSearch" class="search-btn" @click="handleSearch">搜索</span>
        <el-input
          v-show="!isSearch"
          v-model="searchData"
          class="sreach-box"
          clearable
          @keyup.enter.native="handleSearch"
          placeholder="输入搜索内容"
        />
      </div>
    </div>
    <!-- 分页 -->
    <!-- <div class="page-box">
      <span class="page-tip">共{{ Math.ceil(pageInfo.total/pageInfo.listRows) }}页,{{ pageInfo.total }}条</span>
      <div class="my-pagination-box">

        <el-pagination
          background
          :page-size="pageInfo.listRows"
          layout="prev, pager, next, jumper"
          :total="pageInfo.total"
          :current-page="pageInfo.page"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          @next-click="nextClickHandler"
        />
      </div>
    </div> -->
      <!-- 分页 -->
    <div v-if="!isShowDetail" class="block">
      <p
        class="record-data"
      >共{{ Math.ceil(pageInfo.total/pageInfo.listRows) }}页 共{{ pageInfo.total }}条</p>
      <el-pagination
        background
        :page-size="pageInfo.listRows"
        layout="prev, pager, next, jumper"
        :total="pageInfo.total"
        :current-page="pageInfo.page"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        @next-click="nextClickHandler"
      />
    </div>


    <!-- 图片查看 -->
    <el-dialog
      title=""
      >

    </el-dialog>


    <!-- 操作记录 -->
    <el-dialog
      title="操作记录"
      :modal="true"
      :close-on-click-modal="false"
      :append-to-body="true"
      :visible.sync="RecordialogFormVisible"
      custom-class="myRecordForm"

      >
      <el-form :model="recordData">
        <el-form-item label="收费人:" :label-width="formLabelWidth">
          <el-input v-model="recordData.uname" :disabled="true" autocomplete="off" />
        </el-form-item>
        <el-form-item label="收费时间:" :label-width="formLabelWidth">
          <el-input v-model="recordData.time" :disabled="true" autocomplete="off" />
        </el-form-item>
        <el-form-item label="打票人:" :label-width="formLabelWidth">
          <el-input v-model="recordData.ticketname" :disabled="true" autocomplete="off" />
        </el-form-item>
        <el-form-item label="打票时间:" :label-width="formLabelWidth">
          <el-input v-model="recordData.tickettime" :disabled="true" autocomplete="off" />
        </el-form-item>
        <!-- <el-form-item label="审核人:" :label-width="formLabelWidth">
          <el-input v-model="recordData.shenname" :disabled="true" autocomplete="off" />
        </el-form-item>
        <el-form-item label="审核时间:" :label-width="formLabelWidth">
          <el-input v-model="recordData.shentime" :disabled="true" autocomplete="off" />
        </el-form-item>
        <el-form-item label="备注:" :label-width="formLabelWidth">
          <el-input v-model="recordData.center" :disabled="true" autocomplete="off" />
        </el-form-item> -->
      </el-form>
      <div class="btn-confirm-record" @click="RecordialogFormVisible=false">确认</div>
    </el-dialog>

    <div v-if="!isShowDetail" class="table-box">
      
     
      <!-- 退款列表  -->
      <el-table
        empty-text="暂无数据"
        :data="tableData"
        row-class-name="myRow"
        cell-class-name="myCell"
        style="width: 100%; height:100%;"
      >
       
        <el-table-column v-if="amazing" prop="feelname" label="项目名称" min-width="80" />
        <el-table-column prop="enterprise" label="公司名称" min-width="80" />
        <el-table-column prop="enterprisename" label="联系人" min-width="80" />
        <el-table-column prop="enterprisephone" label="联系电话" min-width="120" />
        <!-- <el-table-column prop="money" label="收费金额(元)" min-width="100" /> -->
        <el-table-column 
            label="收费金额(元)" 
            min-width="190" 
            >
            <template slot-scope="scope1">
              <div class="slot_imgBox" style="">
                <svg-icon 
                :icon-class=
                  "scope1.row.method===1 ? 'pay1': scope1.row.method===2 ? 'pay2': scope1.row.method===3 ? 'pay3': 'pay4'" 
                  style="font-size: 12px;line-height:50px;" />
                {{scope1.row.money}}
              </div> 
            </template>
        </el-table-column>
        <el-table-column prop="leftmoney" label="余额(元)" min-width="120" />
        <el-table-column prop="Start_time" label="起止时间" min-width="200" />
        <el-table-column prop="ticket" label="打票状态" min-width="100" />
        <el-table-column prop="center" label="备注" min-width="120" class="note" />
        <el-table-column 
          label="操作"
          fixed="right"
          min-width="180">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              class="operateBtn btn-detail"
              @click="handleDetailClick(scope.row)" style="width:72px;"
            >退款详情</el-button>
            <el-button
              type="text"
              size="small"
              class="operateBtn btn-record"
              @click="handleRecordClick(scope.row)" style="width:72px;"
            >操作记录</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div v-if="isShowDetail" class="table-box">
      <!-- 退款列表  -->
      <el-table
        empty-text="暂无数据"
        :data="tableData"
        row-class-name="myRow"
        cell-class-name="myCell"
        style="width: 100%; height:100%;"
      >
        <el-table-column prop="feelname" label="项目名称" min-width="80" />
        <el-table-column prop="name" label="退款人" min-width="80" />
        <el-table-column prop="tuimoney" label="退款金额" min-width="80" />
        <el-table-column prop="tuitime" label="退款时间" min-width="120" />
        <el-table-column 
            label="退款凭证" 
            min-width="120" 
            >
            <template slot-scope="scope1">
              <div class="slot_imgBox" style="">
                <img @click="showPic(scope1.row.tuiimg[0])" v-if="scope1.row.tuiimg[0]" :src="scope1.row.tuiimg[0]">
                <img @click="showPic(scope1.row.tuiimg[1])" v-if="scope1.row.tuiimg[1]" :src="scope1.row.tuiimg[1]">
                <img @click="showPic(scope1.row.tuiimg[2])" v-if="scope1.row.tuiimg[2]" :src="scope1.row.tuiimg[2]">
              </div> 
            </template>
        </el-table-column>
        <!-- <el-table-column prop="tuiimg" label="退款凭证" width="100" /> -->
        <el-table-column prop="tuiconten" label="退款原因" min-width="80" />
        <el-table-column prop="shenname" label="审核人" min-width="80" />
        <el-table-column prop="shentime" label="审核时间" min-width="100" />
        <el-table-column label="审核结果" min-width="100"  >
          <template slot-scope="s">
            {{s.row.tuitype === 2 ? '同意':'拒绝'}}
          </template>
        </el-table-column>
        <el-table-column prop="shenconten" label="审核备注" min-width="80" class="note" />
      </el-table>
    </div>

  </div>
</template>

<script>
// require('@assets/styles/myChargeStyle')
import axios from 'axios'
export default {
  name: 'CompCharge',
  data() {
    return {
      showDot: false,
      isSearch: false,
      amazing: true,
      formLabelWidth: '120px',
      recordData: {},
      RecordialogFormVisible: false,
      isShowDetail: false,
      userInfo: {},
      searchData: '', // 搜索的内容
      // 分页信息
      pageInfo: {
        page: 1, // 当前页
        total: 5, // 总条数
        listRows: 10, // 每页多少条
        pageNum: null, // 总页数
        render: ''
      },
      tableData: [
        // {
        //   "feelname":'test',//项目名字
        //   "enterprise":'',//公司名字
        //   "enterprisename":'',//联系人
        //   "enterprisephone":'',//联系电话
        //   "money":'',//收费金额
        //   "method":'',//1为微信2为支付宝3为现金4为银行卡
        //   "Start_time":'',//起止时间
        //   "ticket":'',//打票状态
        //   "center":'',//备注
        //   "uname":'',//收费人
        //   "time":'',//收费时间
        //   "ticketname":'',//打票人
        //   "tickettime":'',//打票时间
        //   "name":'',//退款人
        //   "tuimoney":'',//退款金额
        //   "tuitime":'',//退款时间
        //   "tuiimg":'',//退款凭证
        //   "tuiconten":'',//退款备注
        //     "shenname":'',//审核人
        //   "shenconten":'',//审核备注
        //   "shentime":'',//审核时间
        // }
      ]
    }
  },
  created() {
    this.getuserInfo()
    this.getJudgeList()
    this.getRefundList()
  },
  methods: {
    showPic(url) {
      
    },
    getJudgeList() {
      const { token, Communityid } = this.userInfo
      // const token = JSON.parse(localStorage.getItem('userInfo')).token
      axios.post(`http://test.txsqtech.com/index/Fees/texamine`,
        { Communityid },
        {
          headers: {
            token
          }
        }
      ).then(res => {
        if (res.data.code === 200) {
          if(res.data.msg.data.length > 0) {
            this.showDot = true
          }
        }
      })
    },
    handleBack() {
      this.isSearch = false
      this.getRefundList()
    },
    back1() {
      this.isShowDetail=false
      this.getRefundList()
      // this.amazing = true
      // setTimeout(() => {
      //   this.amazing = false
      // }, 1);
    },
    getuserInfo() {
      const local = JSON.parse(localStorage.getItem('userInfo'))
      this.userInfo.token = local.token
      this.userInfo.Communityid = local.data.Communityid
      this.userInfo.uname = local.data.uname
      this.userInfo.Jurisdiction = local.Jurisdiction
      console.log(this.userInfo)
    },
    handleDetailClick(v) {
      console.log(v.data)
      // const arr = []
       //arr.push(v)
      this.isShowDetail = true
       this.tableData = v.data
    },
    handleRecordClick(v) {
      console.log(v)
      this.recordData = v
      this.RecordialogFormVisible = true
      // alert('记录')
    },

    // 点击搜索
    handleSearch() {
      // this.isSearch = true
      this.sendSearchRequest()
    },
    sendSearchRequest() {
      const { Communityid, token } = this.userInfo
      const name = this.searchData
      axios.post(`http://test.txsqtech.com/index/Fees/refundlists`,
        {
          Communityid,
          name
        },
        {
          headers: {
            token
          }
        }
      ).then(res => {
        this.searchData = ''
        // 如果有结果
        if (res.data.code === 200) {
          this.isSearch = true
          this.pageInfo.total = res.data.msg.total
          this.pageInfo.listRows = res.data.msg.listRows
          this.pageInfo.pageNum = res.data.msg.pageNum
          console.log(res.data.msg.data)
          if(res.data.msg.data.length > 0) {
              res.data.msg.data.forEach((item) => {
                item.data.forEach((i) => {
                  i.tuiimg = i.tuiimg.split(',')
                })
              })
              this.tableData = res.data.msg.data

              ///???
            }
          //this.tableData = res.data.msg.data

        } else {
          this.$message({
            message: res.data.msg,
            type: 'warning'
          })
        }
        // this.tableData = 结果
      })
    },

    // 页码相关事件
    handleSizeChange() {
      console.log(11)
    },
    handleCurrentChange(val) {
      console.log(val)
      this.pageInfo.page = val
      this.getRefundList()
    },
    nextClickHandler(val) {
      console.log(val, '354')
    },
    // 请求列表
    getRefundList() {
      const { token, Communityid } = this.userInfo
      axios.post(`http://test.txsqtech.com/index/Fees/refundlist?page=${this.pageInfo.page}`, 
        { 
          Communityid
        },
        {
          headers: {
            token
          }
        })
        .then(res => {
          if (res.data.code === 200) {
            console.log(res.data.msg.data, '退款列表')
            // alert('得到退款列表')
            this.pageInfo.total = res.data.msg.total
            this.pageInfo.listRows = res.data.msg.listRows
            this.pageInfo.pageNum = res.data.msg.pageNum
            if(res.data.msg.data.length > 0) {

           
              res.data.msg.data.forEach((item) => {
                item.data.forEach((i) => {
                  i.tuiimg = i.tuiimg.split(',') //*  "tuitype":'',//审核状态2同意3拒绝

                })
                

                
              })
              this.tableData = res.data.msg.data

              ///???
            }
            
            
          } else {
            this.$message({
              message: res.dada.msg,
              type: "warning"
            }
            )
          }
        })
    }
  }
}
</script>
<style lang="scss" scoped>
/deep/.el-table::before{
  background-color: #fff !important;
}
.block{
  padding-left: 20px;
  bottom: -119px !important;
}
  /deep/.operateBtn{
    color: #fff;
    display: inline-block;
    border-radius: 4px;
    height: 30px;
    width: 52px;
    padding: 4px;
    font-size: 14px;
  }
  /deep/.btn-detail{
    background-color: #1FBBA6;
  }
  /deep/.btn-record{
    background-color: #cccccc;
  }
.dot{
    display: inline-block;
    z-index: 10;;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: #F44;
    position: absolute;
    top: -28px;
    left: 323px;
  }
  .slot_imgBox{
    width: 160px;
    height: 40px;
    padding-top: 8px;
    img{
      cursor: pointer;
      width: 40px;
      margin-right: 5px;
      border-radius: 4px;
    }
  }
  //操作记录表格样式
  /deep/.myRecordForm{
    background-color: #fff;
    margin-top: 0% !important;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    -webkit-transform: translate(-50%,-50%);
    -moz-transform: translate(-50%,-50%);
    border-radius: 5px;
      min-width: 380px;
      height: 586px;
      width: 33%;
      .el-dialog__header{
        padding: 14px 0 10px 20px;
        height: 43px;
        border-bottom: 1px solid #eff2f5;
        .el-dialog__title{
          position: absolute;
          line-height: 16px;
          font-size: 16px;
        }
      .el-dialog__headerbtn{
        top: 14px;
      }
    }
     .el-dialog__body{
        overflow: hidden;
    padding: 20px 62px 6px 53px !important;
      }
    .el-form-item{
      width: 100% !important;
      height: 32px !important;
    }
    .el-form-item__content{
      border: 1px solid #d2d2d2;
      border-radius: 4px;
      height: 40px;
      cursor: default;
      .el-input__inner{
        cursor: default !important;
      }
    }
    .el-form-item__label{
      text-align: left;
      font-size: 14px;
      line-height: 32px !important;
      padding: 0 !important;
    }
    .btn-confirm-record{
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      background-color: #F8AC59;
      min-width: 36px;
      text-align: center;
      width: 72px;
      height: 30px;
      line-height: 19px;
      padding: 5px 8px;
      color: #FFFEFE;
      border-radius: 4px;
      font-size: 14px;
      bottom: 24px;
      cursor: pointer;
    }
  }
  
 .block {
   position: absolute;
    .record-data {
      cursor: default;
    display: inline-block;
    line-height: 18px;
    margin-top: 15px;
    position: absolute;
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
    }
    // position: absolute;
    bottom:-51px;
    height: 40px;
    width: 100%;
    .el-pagination {
      z-index:9;
      position: absolute;
    bottom: 0px;
    right: 68px;
    width: 235px;
      /deep/button {
        min-width: 24px !important;
      height: 24px;
      cursor: default;
      }
      /deep/.el-pagination__jump {
        position: relative;
      margin-left: 5px;
      background: #5FAFE4;
      height: 24px;
      border-radius: 3px;
      color: #fff;
      font-size: 0px;
      //input和ul是否居中
      margin-top: 0px;
        .el-input {
          font-family: Microsoft YaHei;
        font-weight: 400;
        height: 24px;
        width: 40px;
        margin-left: 3px;
        border-radius: 3px;
        color: rgba(102, 102, 102, 1);
        outline: none;
        text-align: center;
          /deep/.el-input__inner {
            font-size: 14px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          color: rgba(102, 102, 102, 1);
          display: inline-block;
          margin-left: 48px ;
          width: 40px;
          height: 24px !important;
          border: 1px solid rgba(239, 242, 245, 1) !important;
          border-radius: 3px;
          outline: none;
          }
          &::before {
             content: "前往";
          color: #fff;
          font-size: 14px;
          display: inline-block;
          position: absolute;
          margin-left: 4px;
          text-align: center;
          margin-top: 3px;
          height: 24px;
          }
          &:after {
            content: "页";
          padding-left: 10px !important;
          font-size: 14px;
          position: absolute;
          top: 3px;
          }
        }
      }
      /deep/.el-pager li {
        min-width: 24px;
      height: 24px;
      border-radius: 2px;
      font-size: 10px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: rgba(102, 102, 102, 1);
      line-height: 24px;
      }
    }
    /deep/.el-pagination.is-background .el-pager li:not(.disabled).active {
      background: #5fafe4;
      color: rgba(255, 255, 255, 1);
    }
  }
  #compcharge{
    position: relative;
    height: 80%;
    background-color: #fff;
    .table-box{ //table
      position: absolute;
      width: 100%;
      top: 60px;
      bottom: 32px;
      /deep/.el-table__header{
        width: 100% !important;
      }
      /deep/.el-table__body{

      }
      /deep/.myRow {
        height: 56px;
        padding: 0;
      }
      /deep/.myRow > td {
        padding: 0;
      }
      /deep/.myCell {
        border-collapse: collapse;
      }
    }
    .page-box{
      position: absolute;
      bottom: 0;
    }
    .my-pagination-box{
      display: inline-block;
    }
    .top-button-box{
      position: relative;
      background-color: #999;
      height: 60px;
      .btn1{
        position: absolute;
        top: 50%;
        bottom: 50%;
        margin-top: -13px;
        left: 20px;
        width:52px;
        height: 26px;
        cursor: pointer;
        text-align: center;
        line-height: 28px;
        border-radius: 4px;
        background-color: #25BAD9;
        display: inline-block;
        color: #fff;
        padding: 0 12px;
        font-size: 14px;
      }
      .search-box{
        height: 26px;
        position: absolute;
        top: 50%;
        right: 20px;
        bottom: 50%;
        margin-top: -13px;
        input{
          outline: none;
          border: none;

        }
      }
    }

    .box-header{
      background-color: #fff;
      height: 60px;
      position: relative;
      .add-btn{
        cursor: pointer;
        background-color: #25BAD9;
        color: #fff;
        height: 26px;
        position: absolute;
        top: 50%;
        bottom: 50%;
        left: 20px;
        margin-top: -13px;
        padding: 0 12px;
        border-radius: 4px;
    }
    .search-btn{
        position: absolute;
        height: 26px;
        background-color: #25BAD9;
        top: 50%;
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
    .sreach-box{
      width: 200px;
      height: 26px;
      position: absolute;
      top: 50%;
      bottom: 50%;
      right: 20px;
      margin-top: -13px;
      background-color: #ddd;
      border: 1px solid #ddd;
      /deep/.el-input__inner{
        height: 100% !important;
        padding-left: 4px !important;
      }
    }
  }
  }
</style>
