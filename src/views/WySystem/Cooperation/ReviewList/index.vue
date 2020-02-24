<template>
  <div id="enterprise-info">
    <span v-if="showDot" style="z-index:9" class="dot"></span>

    <el-dialog
      title="提示"
      :visible.sync="centerDialogVisible"
      :append-to-body="true"
      custom-class="myConfirm"
      :close-on-click-modal="false"
      width="250"
      center>
      <p style="text-align:center;">拒绝退款<span style="color:#f44;padding:0 4px;">{{backMoney}}</span>元?</p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="didSendRefuse">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="提示"
      :visible.sync="centerDialogVisible1"
      :append-to-body="true"
      custom-class="myConfirm"
      :close-on-click-modal="false"
      width="250"
      center>
      <p style="text-align:center;">同意退款<span style="color:#f44;padding:0 4px;">{{backMoney}}</span>元?</p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible1 = false">取 消</el-button>
        <el-button type="primary" @click="didSendAgreen">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="审核退款"
      custom-class="myJudgeForm"
      class="position:fixed;top:10px;"
      :append-to-body="true"
      :close-on-click-modal="false"
      :visible.sync="judgeFormVisible"
      :before-close="handleJudgeClose"
    >
      <el-form ref="form" :model="judgeFormData" label-width="80px">
        <el-form-item label="项目名称:">
          <el-input v-model="judgeFormData.feelname" disabled />
        </el-form-item>

        <el-form-item label="公司名称:">
          <el-input v-model="judgeFormData.enterprise" disabled />
        </el-form-item>


        <el-form-item label="起止时间:">
          <el-input v-model="judgeFormData.Start_time" disabled />
        </el-form-item>

        <el-form-item label="收费金额:">
          <el-input v-model="judgeFormData.money" disabled />
        </el-form-item>
        <el-form-item label="退款金额:">
          <el-input v-model.number="judgeFormData.refundmoney" disabled />
        </el-form-item>

        <el-form-item class="imgs" label="上传凭证:" style="height:60px !important;margin-top:10px;">
          <!-- 图片列表box -->
          <div ref="imgs" class="img-box">
            <img v-if="imgArr[0]" :src="imgArr[0]" alt="">
            <img v-if="imgArr[1]" :src="imgArr[1]" alt="">
            <img v-if="imgArr[2]" :src="imgArr[2]" alt="">

          </div>
        </el-form-item>

        <el-form-item class="tuiR" label="退款原因:" style="height:45px !important;margin-top:20px;">
          <el-input v-model="judgeFormData.Remarks" style="resize:none;cursor:default;" disabled resize="none" type="textarea" />
        </el-form-item>
        <el-form-item class="tuiR" label="审核结果:" style="height:45px !important;margin-top:20px;">
          <el-input v-model="judgeFormData.judgeResult" placeholder="请输入同意/拒绝理由" style="resize:none;" resize="none" type="textarea" />
          <p v-if="tips.t1" v-show="tips.t11" style="color:red;">必填</p>
        </el-form-item>
        <div class="btn btn-disagree" @click="clickDisagree">拒绝</div>
        <div class="btn btn-agree" @click="clickAgree">同意</div>
      </el-form>
    </el-dialog>
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
    <!-- <div slot="header" class="clearfix">
      <div class="box-header">
        <span class="add-btn" @click="clickCharge">收费</span>
        <span class="search-btn" @click="handleSearch">搜索</span>
        <el-input
          class="sreach-box"
          v-model="searchData"
          clearable placeholder="输入">
        </el-input>
      </div>
    </div> -->
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
    <div class="block">
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

    <div class="table-box">
      <!-- 企业列表 -->
      <el-table
        empty-text="暂无数据"
        :data="tableData"
        row-class-name="myRow"
        cell-class-name="myCell"
        style="width: 100%; height:100%;"
      >
        <el-table-column prop="uname" label="退款申请人" min-width="100" />
        <el-table-column prop="feelname" label="项目名称" min-width="120" />
        <el-table-column prop="enterprise" label="公司名称" min-width="80" />
        <el-table-column prop="money" label="收费金额" min-width="100" />
        <el-table-column prop="refundmoney" label="退款金额" min-width="80" />
        <el-table-column label="操作"
        min-width="80" fixed="right"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              class="operateBtn btn-judge"
              @click="handleJudge(scope.row)"
            >审核</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

  </div>
</template>

<script>
// require('@assets/styles/myChargeStyle')
import axios from 'axios'
// import { type } from 'os'
export default {
  name: 'CompCharge',
  data() {
    return {
      backMoney: '',
      centerDialogVisible: false,
      centerDialogVisible1: false,
      showDot: false,
      imgArr: [],
      tips: {
        t1: '',
        t11: false,
      },
      rowInfo: {},
      userInfo: {},
      searchData: '', // 搜索的内容
      // 分页信息
      pageInfo: {
        page: 1, // 当前页
        total: null, // 总条数
        listRows: null, // 每页多少条
        pageNum: null, // 总页数
        render: ''
      },
      tableData: [
        // {
        //   "wid":1,//账单id
        //   "feelname":'dfds',//项目名字
        //   "enterprise":'czxc',//公司名字
        //   "Start_time":'',//起止时间
        //   "money":'100',//收费金额
        //   "img":'',//退款凭证
        //   "Remarks":'scc',//退款备注
        //   "refundmoney":'sxcsz',//退款金额
        //   "uname":'sd',//退款申请人
        // }
      ],
      // 审核退款表单
      judgeFormVisible: false,
      judgeFormData: {
        feelname: '',
        enterprise: '',
        Start_time: '',
        money: '',
        refundmoney: '',
        Remarks: '',
        judgeResult: ''
      }
    }
  },
  created() {
    this.getuserInfo()
    this.getJudgeList()
  },
  methods: {
    getuserInfo() {
      const local = JSON.parse(localStorage.getItem('userInfo'))
      this.userInfo.token = local.token
      this.userInfo.Communityid = local.data.Communityid
      this.userInfo.uname = local.data.uname
      this.userInfo.Jurisdiction = local.Jurisdiction
      console.log(this.userInfo)
    },
    // 点击收费
    clickCharge() {

    },
    // 点击搜索
    handleSearch() {

    },
    // 点击审核
    handleJudge(v) {
      this.rowInfo = v
      console.log(v)
      // this.$refs.imgs = ''
      this.judgeFormData.feelname = v.feelname
      this.judgeFormData.enterprise = v.enterprise
      this.judgeFormData.Start_time = v.Start_time
      this.judgeFormData.money = v.money
      this.judgeFormData.refundmoney = v.refundmoney
      this.judgeFormData.Remarks = v.Remarks
      this.imgArr = v.img.split(',')
      // let imgSrc = []
      // let imgarr = []
      // img.forEach(item => {
      //   item = 'http://test.txsqtech.com/uploads/' + item
      //   imgarr.push(item)
        
      // })
      // imgSrc = imgarr
      // console.log(imgSrcArr)
      // setTimeout(() => {
      //   console.log(this.$refs.imgs)
      //   const p = this.$refs.imgs
      //   console.log(p)
      //   const imgEle = document.createElement('img')
      //   imgSrcArr.forEach((item) => {
      //     imgEle.src = item
      //     p.appendChild(imgEle)
      //   })
      // }, 0)

      this.judgeFormVisible = true
    },
    // 页码相关事件
    handleSizeChange() {
      console.log(11)
    },
    handleCurrentChange(val) {
      console.log(val)
      this.pageInfo.page = val
      this.getChargeList()
    },
    nextClickHandler(val) {
      console.log(val, '354')
    },
    // 关闭审核
    handleJudgeClose() {
      this.judgeFormVisible = false
      this.judgeFormData.judgeResult = ''
    },
    clickDisagree() {
      if(!this.judgeFormData.judgeResult){
        this.tips.t1 = true
        this.tips.t11 = true
        setTimeout(() =>{
          this.tips.t11 = false
        },3000)
      } else {
        this.tips.t1 = false
      }
      if(!this.tips.t1){
        this.centerDialogVisible = true
        this.backMoney = this.judgeFormData.refundmoney
        // this.$confirm(`拒绝退款 ${this.judgeFormData.refundmoney} 元?`, '提示', {
        //   confirmButtonText: '确定',
        //   cancelButtonText: '取消',
        //   type: 'warning'
        // }).
        // then(() => {
          
        // }).catch(() => {
        //   this.$message({
        //     type: 'info',
        //     message: '已取消拒绝'
        //   });          
        // });
      

      // alert('拒绝')
     }
      
    },
    didSendRefuse() {
      const { token, uname } = this.userInfo
          const { wid } = this.rowInfo
          axios.post(`http://test.txsqtech.com/index/Fees/agrees`,
            {
              wid, // 账单id
              Remarksa: this.judgeFormData.judgeResult, // 审核备注
              uname // 用户姓名
            },
            {
              headers: {
                token
              }
            }
          ).then(res => {
            this.centerDialogVisible = false
            if (res.data.code === 200) {
              this.judgeFormVisible = false
              this.getJudgeList()
              this.$message({
                message: '已拒绝',
                type: 'success'
              })
            } else {
              this.$message({
                message: res.data.msg,
                type: 'warning'
              })
            }
            // 清空输入
            console.log(res)
          })
    },
    didSendAgreen() {
      const { token, uname } = this.userInfo
      const { wid } = this.rowInfo
      axios.post(`http://test.txsqtech.com/index/Fees/agree`,
        {
          wid, // 账单id
          Remarksa: this.judgeFormData.judgeResult, // 审核备注
          uname // 用户姓名
        },
        {
          headers: {
            token
          }
        }
      ).then(res => {
        this.centerDialogVisible1 = false
        this.judgeFormData.judgeResult = ''
        this.judgeFormVisible = false
        this.getJudgeList()
        if (res.data.code === 200) {
          this.getJudgeList()
          this.$message(
            {
              type: 'success',
              message: '审核同意'
            }
          )
        } else {
          this.$message({
            message: res.data.msg,
            type: 'warning'
          })
        }
        console.log(res)
      })
    },
    clickAgree() {
      if(!this.judgeFormData.judgeResult){
        this.tips.t1 = true
        this.tips.t11 = true
        setTimeout(() =>{
          this.tips.t11 = false
        },3000)
      } else {
        this.tips.t1 = false
      }
      if(!this.tips.t1){
        this.centerDialogVisible1 = true
        this.backMoney = this.judgeFormData.refundmoney
            
          
      }
      
    },
    // 请求列表
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
      )
        .then(res => {
          if (res.data.code === 200) {
            // alert('成功得到')
            this.pageInfo.total = res.data.msg.total
            this.pageInfo.listRows = res.data.msg.listRows
            this.pageInfo.pageNum = res.data.msg.pageNum
            this.tableData = res.data.msg.data
            if(res.data.msg.data.length > 0) {
              this.showDot = true
            } else {
              this.showDot = false
            }
          }
          console.log(res.data.msg.data, '审核列表')
        })
    }
  }
}
</script>
<style lang="scss" scoped>
/deep/ .tuiR{
  .el-form-item__content{
    border: none !important;
    .el-textarea__inner{
      background:#fff;
      color: #666;
    }
  }
}
/deep/.myConfirm{
  margin: 0 !important;
  width: 380px;
  position: absolute;
  top:50%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
  .el-dialog__footer{
    position: relative;
    padding-top: 20px;
  }
  .el-button{
    position: absolute;
    padding: 5px;
    span{
      font-size: 14px;
    }
  }
  .el-button--default{
    left: 30px;
    bottom: 10px;
    background-color: #fff;
    color: #999;
  }
  .el-button--primary{
    right: 30px;
    bottom: 10px;
    background-color: #25BAD9;
    border: 1px solid #25BAD9;
  }
  .el-dialog__header{ //header
      border-bottom: 1px solid #efefef;
      padding: 12px 0 10px 16px;
        text-align: left;
        color: #333333;
        font-size: 16px;
      button{
        position: absolute;
        top: 14px;
      }
    }

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
  /deep/.btn-judge{
    background-color: #25BAD9;
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
 .block {
   padding-left: 20px;
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
    bottom:-119px;
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
  .btn{
    position: absolute;
    padding: 4px 12px;
    bottom: 20px;
    cursor: pointer;
    color: #fff;
    border-radius: 4px;
  }
  .btn-disagree{
    left: 30px;
    background-color: #5FAFE4;
  }
  .btn-agree{
    right: 30px;
    background-color: #25BAD9;
  }
/deep/.btn-judge{
    background: #25bad9;
  }
/deep/.operateBtn{
    color: #fff;
    display: inline-block;
    border-radius: 4px;
    padding: 4px;
    font-size: 14px;
  }
/deep/.el-message-box{
  .el-message-box__content{
    
  }
  .el-message-box__btns{
    display: flex;
    text-align: center !important;
  }
}
//  /deep/.myJudgeForm{
//     width: 500px;
//     height: 600px;
//     margin-top: 0 !important;
//     position: fixed;
//     top: 50%;
//     left: 50%;
//     transform: translateX(-50%) translateY(-50%);
//     .el-dialog__header{
//       position: relative;
//       height: 40px;
//       border-bottom: 1px solid #eff2f5;
//       .el-dialog__title{
//         position: absolute;
//         left: 20px;
//         top: 0;
//         line-height: 40px;
//       }
//       .el-dialog__headerbtn{
//         position: absolute;
//         top: 50%;
//         transform: translateY(-50%);
//         right: 20px;

//       }
//     }
//     .el-dialog__body{
//       padding-top: 21px !important;
//       .el-form{
//         .img-box{
//           background-color: #eee;
//           height: 60px;
//           img{
//             height: 60px;
//             width: 60px;
//           }
//         }
//         .el-form-item{
//           height: 40px !important;
//           margin-bottom: 10px !important;
//         }
//         .btn{
//           position: absolute;
//           padding: 4px 12px;
//           bottom: 20px;
//           cursor: pointer;
//           color: #fff;
//           border-radius: 4px;
//         }
//         .btn-disagree{
//           left: 30px;
//           background-color: #5FAFE4;
//         }
//         .btn-agree{
//           right: 30px;
//           background-color: #25BAD9;
//         }
//       }
//     }
//   }
 #enterprise-info {
  height: 80%;
  position: relative;
  .my-pagination-box {
    z-index: 9999;
    position: absolute;
    bottom: 0;
    right: 0;

    /deep/.el-pagination__editor.el-input .el-input__inner {
      height: 28px !important;
      border: 1px solid #999 !important;
    }
  }
  .page-tip {
    z-index: 9999;
    position: absolute;
    left: 0;
    bottom: 10px;
  }
}
    .page-box{
      position: absolute;
      bottom: 0;
      .page-tip{
        position: absolute;
        left: 20px;
      }
    }
//     .my-pagination-box{
//       display: inline-block;
//     }
//     .top-button-box{
//       position: relative;
//       background-color: #999;
//       height: 60px;
//       .btn1{
//         position: absolute;
//         top: 50%;
//         bottom: 50%;
//         margin-top: -13px;
//         left: 20px;
//         width:52px;
//         height: 26px;
//         cursor: pointer;
//         text-align: center;
//         line-height: 28px;
//         border-radius: 4px;
//         background-color: #25BAD9;
//         display: inline-block;
//         color: #fff;
//         padding: 0 12px;
//         font-size: 14px;
//       }
//       .search-box{
//         height: 26px;
//         position: absolute;
//         top: 50%;
//         right: 20px;
//         bottom: 50%;
//         margin-top: -13px;
//         input{
//           outline: none;
//           border: none;

//         }
//       }
//     }

//     .box-header{
//     height: 60px;
//     position: relative;
//     .add-btn{
//       cursor: pointer;
//       background-color: #25BAD9;
//       color: #fff;
//       height: 26px;
//       position: absolute;
//       top: 50%;
//       bottom: 50%;
//       left: 20px;
//       margin-top: -13px;
//       padding: 0 12px;
//       border-radius: 4px;
//     }
//     .search-btn{
//         position: absolute;
//         height: 26px;
//         background-color: #25BAD9;
//         top: 50%;
//         bottom: 50%;
//         right: 20px;
//         margin-top: -13px;
//         z-index: 9;
//         color: #fff;
//         font-size: 14px;
//         line-height: 26px;
//         padding: 0 5px;
//         cursor: pointer;
//       }
//     .sreach-box{
//       width: 200px;
//       height: 26px;
//       position: absolute;
//       top: 50%;
//       bottom: 50%;
//       right: 20px;
//       margin-top: -13px;
//       background-color: #ddd;
//       border: 1px solid #ddd;
//       /deep/.el-input__inner{
//         height: 100% !important;
//         padding-left: 0 !important;
//       }
//     }
//   }

//   }
 /deep/ .myJudgeForm{
   .img-box{
     display: flex;
     justify-content: flex-start;
     width: 100%;
     height: 80px;
     img{
       padding: 5px;
       border-radius: 10px;
       margin-right: 10px;
       width: 80px;
       height: 100%;

     }
   }
   .tips{ //tips
          color: red;
          font-size: 14px;
          position: absolute;
          bottom: -31px;
          left: 0;
        }
   .el-input.is-disabled .el-input__inner{
     cursor: default;
   }
   .el-input__inner{
     color: #666;
   }
   .el-textarea.is-disabled .el-textarea__inner{
     cursor: default;
   }
    .imgs{
      .el-form-item__content{
        border:none !important;
      }
    }
    .de{
      height: 32px;
    }
    width: 480px !important;
    .el-input__inner::-webkit-outer-spin-button,
    .el-input__inner::-webkit-inner-spin-button {
        -webkit-appearance: none;
        appearance: none; 
        margin: 0; 
    }
    /* 火狐 */
    /* 谷歌 */
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
        -webkit-appearance: none;
        appearance: none; 
        margin: 0; 
    }
    /* 火狐 */
    input{
        -moz-appearance:textfield;
    }
    .el-input__inner{
        -moz-appearance:textfield;
    }
    .el-input__inner{
      height: 24px !important;
      width: 96%;
      margin-left: 2px;
      margin-top: 5px;
      padding-left: 12px;
    }
    margin-top: 0 !important;
    position: absolute;
    border-radius: 5px;
    top: 50%;
    transform: translateY(-50%) translateX(-50%);
    left: 50%;
    min-width: 480px;
    .el-dialog__header{ //header
      border-bottom: 1px solid #efefef;
      padding: 12px 0 10px 16px;
      .el-dialog__title{
        color: #333333;
        font-size: 16px;
      }
      button{
        position: absolute;
        top: 14px;
      }
    }
    .el-dialog__body{
      position: relative;
        padding: 30px 40px 84px 54px !important;
        .de{
          position: absolute;
          left: 30px;
          top: 10px;
          padding-bottom: 10px;
        }
        .el-form{
          padding-top: 10px;
          .row{
            position: relative;
            padding-bottom: 24px;
            .tips{
              position: absolute;
              right: 99px;
            }
            
            span{
              display: inline-block;
            }
            .t1{
               width: 79px;
            }
            .t2{
              width: 80px;
            }
            .t3{
              padding-right: 15px;
            }
            .t4{
              width: 155px;
              border: 1px solid #d2d2d2;
              height: 32px;
              padding-left: 5px;
              padding-right: 5px;
              outline: none;
              border-radius: 4px;
            }
            /deep/.el-select{
              width: 155px;
              padding-left: 5px;
              border: 1px solid #d2d2d2;
              height: 32px;
              border-radius: 4px;
              .el-input__inner{
                  padding-left: 0;
                }
              .el-input__suffix-inner{
                height: 100%;
                .el-input__icon{
                  line-height: 1;
                }
              }
            }
          }
        }
      }
      .el-input__icon{
                  line-height: 32px !important;

                }
    .addNow{
      height: 30px;
      padding: 0 8px;
      position: absolute;
      background-color: #F8AC59;
      line-height: 30px;
      color: #FFFEFE;
      border-radius: 4px;
      bottom: 24px;
      left: 50%;
      transform: translateX(-50%);
    }
    .el-form-item{
      height: 32px !important;
      margin-bottom: 25px;
      line-height: 32px;
      .el-form-item__label{ //lable
        color: #666666;
        line-height: 32px;
        text-align: left;
      }
      .el-form-item__content{ //content
        box-sizing: border-box;
        border: 1px solid #D2D2D2;
        margin-left: 80px !important;
        width: 73%;
        border-radius: 4px;
        height: 32px;
        line-height: 32px;
        .m::after{
          content:'m²';
          position: absolute;
          top: -1px;
          right:-25px;
        }
        .el-select{
          width: 100%;
          line-height: 32px;
          top: -5px
        }
        .tips{ //tips
          color: red;
          height: 20px;
          line-height: 20px;
          font-size: 14px;
          position: absolute;
          bottom: -22px;
          left: 0;
        }
      }
    }
  }
</style>
