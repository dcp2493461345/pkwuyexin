<template>
  <div class="form-container">
    <!-- 分页 -->
    <my-pages
      :pageInfo="pageInfo"
      @handleCurrentChange="handleCurrentChange"
      @nextClickHandler="nextClickHandler"
      class="fenye-class"
    ></my-pages>
    <div class="title-class">
      <div v-if="isIndex" class="button" @click="backToIndex">返回首页</div>
      <div v-if="!isIndex" class="button" @click="backToIndex1" style="width:86px;">返回上一级</div>

      <!-- 搜索框 -->
      <div v-if="isShowSearch" class="serach-box">
        <input
          style="color:#666;"
          v-model="searchContent"
          type="text"
          placeholder="请输入搜索内容"
          @keyup.enter.prevent="getJudgeList1"
        />
        <div class="serach" @click="getJudgeList1">
          <svg-icon icon-class="search1" />
        </div>
      </div>
    </div>

    <div class="table-box">
      <el-table empty-text="暂无数据" :data="tableData2" style="width: 100%; ">
        <el-table-column prop="housenumber" label="房屋编号" min-width="120" />
        <el-table-column prop="houseName" label="用户姓名" min-width="120" />
        <el-table-column prop="houseuserPhone" label="联系电话" min-width="150" />
        <el-table-column label="人脸审核" min-width="120">
          <template slot-scope="scope1">
            <div @click="showPic(scope1.row)" style="width:40px;height:40px;background:#ccc">
              <img style="width:100%" :src="scope1.row.face_img" />
            </div>
            <!-- <div class="demo-image__preview" style="width:40px;height:40px;background:#ccc">
              <el-image :src="scope1.row.face_img" :preview-src-list="img.face" z-index="254656"></el-image>
            </div>-->
          </template>
        </el-table-column>
        <!-- <el-table-column prop="contens" label="备注" min-width="120" /> -->
        <el-table-column prop="time" label="申请时间" min-width="150" />
        <el-table-column label="操作" min-width="200">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              class="operateBtn btn-modify"
              @click="agree2(scope.row)"
              style="height:30px; width:52px;background:#25BAD9;color:#fff;padding:7px;font-family:Microsoft YaHei;font-size:14px; "
            >同意</el-button>
            <el-button
              type="text"
              size="small"
              class="operateBtn btn-modify"
              @click="refuse2(scope.row)"
              style="width:52px; height:30px; margin-left:8px; background:#BFBFBF;color:#fff; padding:7px;font-family:Microsoft YaHei;font-size:14px; "
            >拒绝</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 拒绝弹框 -->
    <el-dialog
      title="提示"
      :modal="true"
      :append-to-body="true"
      :visible.sync="RefusedialogFormVisible"
      :close-on-click-modal="false"
      custom-class="myDetailForm"
    >
      <div class="row" style="position:relative; height:90px;">
        <span style="position:absolute;left:0;padding-right:12px;">*拒绝理由:</span>
        <textarea
          v-model.trim="refuseReason"
          rows="4"
          cols="40"
          autofocus
          style="outline:none;width:250px;color: #333;border:1px solid #D2D2D2;position:absolute;left:78px;resize:none;height:100px !important;padding:8px;border-radius:4px;"
        />
        <p
          v-if="tips"
          style="color:#f44;font-size:14px;position:absolute;top:95px;
    left:80px;"
        >必填</p>
      </div>
      <div
        class="addNow"
        style="cursor:pointer;background-color:#F8AC59;width:72px;height:30px;color:#fff;line-height:25px;border-radius:4px;text-align:center;position:absolute;left:50%;bottom:24px;margin-left:-25px;line-height:30px;"
        @click="didRefuse"
      >确认</div>
    </el-dialog>
    <!-- 同意弹框 -->
    <dialog-card
      content="同意通过申请吗?"
      :centerDialogVisible="centerDialogVisible"
      @ensureHandler="sendAgreenRequest"
      @cancelHandler="cancelHandlerAgree"
      @beforeClose="cancelHandlerAgree"
      :loading="loading"
    ></dialog-card>
    <!-- 查看人脸详情 -->
    <!-- <div v-if="bigPicDialogVisable" class="picBox" style>
      <div class="img">
        <div class="back" @click="bigPicDialogVisable=false">X</div>
        <div class="p2">
          <img :src="img.face" alt />
        </div>
      </div>
    </div>-->
    <el-dialog
      style="width:100%;"
      :visible.sync="bigPicDialogVisable"
      title="查看人脸"
      :append-to-body="true"
      :close-on-click-modal="false"
      custom-class="face-dialog"
    >
      <img width="100%;height:100%;" :src="img.face" alt />
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios'
import { postSelect_faceList, postSearchSelect, postToexamine_list, postSelect_list, postRefuseSelect } from '@/api/dash'
import { postFace_select } from '@/api/residerInfo'
export default {
  props: {
    present: {
      type: Boolean,
      required: true
    }, // 'a'为住户
  },
  data () {
    return {
      fenyeType: 1,//1代表普通分页，2代表搜索分页
      isShowSearch: true,
      rowData: {
        "userHouseId": '',//房屋主键id
        "housenumber": "",//房屋编号
        "userId": '13',//app用户id
        "houseName": "",//申请时审核的姓名
        "houseuserPhone": "",//申请时审核的电话
        "face_img": "",//人脸图片
        "car_img": "",//身份证照片
        // "contens":"",
        "time": ""
      },
      img: {
        // card: '',//身份证
        face: ''//人脸
      },
      // 分页信息
      pageInfo: {
        page: 1, // 当前页
        total: 0, // 总条数
        listRows: 10, // 每页多少条
      },
      isIndex: true,
      searchContent: '',
      id: '',
      bigPicDialogVisable: false,//查看人脸详情弹框
      centerDialogVisible: false,
      tips: false,
      RefusedialogFormVisible: false,
      userInfo: { // 用户信息
      },
      tableData2: [

      ], // 人脸识别
      refuseReason: '',
      loading: false,//加载中
    }
  },
  created () {
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'))
    this.getJudgeList()
  },
  methods: {
    handleCurrentChange (val) {
      console.log(val)
      this.pageInfo.page = val
      if (this.fenyeType === 1) {
        this.getJudgeList(val)
      } else {
        this.getJudgeList1()
      }
    },
    nextClickHandler (val) {
      //cons
    },
    showPic (v) {
      console.log(v)
      this.img.card = v.car_img
      this.img.face = v.face_img
      this.bigPicDialogVisable = true
    },
    didRefuse () {
      if (this.refuseReason) {
        this.sendRefuseRequest()
      } else {
        this.tips = true
        setTimeout(() => {
          this.tips = false
        }, 2000);
      }
    },
    //查询列表
    getJudgeList (page = 1, count = 10) {
      const Communityid = this.userInfo.Communityid
      postSelect_faceList({ Communityid, page, count }).then(resp => {
        console.log(resp, 'resp')
        this.pageInfo.total = resp.msg.total
        this.pageInfo.pageNum = resp.msg.pageNum
        this.pageInfo.page = Number(resp.msg.page)
        this.tableData2 = resp.msg.data
      })
    },
    //搜索时的列表数据
    getJudgeList1 () {
      const page = this.pageInfo.page
      const count = 10
      const name = this.searchContent
      const Communityid = this.userInfo.Communityid
      postSearchSelect({ page, count, name, Communityid }).then(resp => {
        if (resp.code === 200) {
          this.isIndex = false
          this.isShowSearch = false
          this.pageInfo.total = resp.msg.total
          this.pageInfo.pageNum = resp.msg.pageNum
          this.pageInfo.page = Number(resp.msg.page)
          this.tableData2 = resp.msg.data
          this.isIndex = false
          this.fenyeType = 2
        } else {
          this.searchContent = ''
          this.$message({
            message: resp.msg,
            type: "warning"
          })
        }
      })
    },
    refuse2 (v) {
      this.rowData = v
      this.refuseReason = ''
      this.RefusedialogFormVisible = true
    },
    agree2 (v) {
      console.log(v)
      const { Communityid } = this.userInfo
      postFace_select({ id: v.id, Communityid }).then(resp=> {
        console.log(resp,'99999')
        if(resp.code === 200) {

          this.loading = false
          this.centerDialogVisible = true
          this.rowData = v
          this.id = v.userId
        }else if(resp.code === 400) {
          this.$message({
            message: resp.msg,
            type: 'warning'
          })
        }
      })

    },
    //同意弹框点击取消
    cancelHandlerAgree () {
      this.centerDialogVisible = false
    },
    //拒绝点击确认
    sendRefuseRequest () {
      const Reason = this.refuseReason
      const userId = this.rowData.userId
      postRefuseSelect({ userId, Reason }).then(res => {
        if (res.code === 200) {
          this.getJudgeList()
          this.$message({
            message: res.msg,
            type: "success"
          })
          this.RefusedialogFormVisible = false
        } else {
          this.$message({
            message: res.msg,
            type: "error"
          })
          this.RefusedialogFormVisible = false
        }
        this.refuseReason = ''
      })
    },
    //同意接口
    sendAgreenRequest (data) {
      this.loading = data
      const { Communityid, uname } = this.userInfo
      const { userHouseId, userId } = this.rowData
      console.log({ Communityid, uname, userHouseId, userId }, '同意resp')
      postToexamine_list({ Communityid, uname, userHouseId, userId }).then(resp => {
        console.log(resp, '同意resp')
        if (resp.code === 200) {
          //查看人脸是否上传成功
          setTimeout(() => {
            postSelect_list(resp.msg).then(resp => {
              if (resp.code === 200) {
                this.$message({
                  message: resp.msg,
                  type: 'success'
                })
                this.getJudgeList()
                this.centerDialogVisible = false
                this.loading = false
              } else if (resp.code === 400) {
                this.$message({
                  message: resp.msg,
                  type: 'warning'
                })
                this.centerDialogVisible = false
              }
              this.loading = false
            })
          }, 3000)
        } else if (resp.code === 400) {
          this.$message({
            message: resp.msg,
            type: 'warning'
          })
          this.centerDialogVisible = false
        }
      })
    },
    backToIndex () {
      this.$parent.showMain = true
    },
    backToIndex1 () {
      this.isShowSearch = true
      this.searchContent = ''
      this.isIndex = true
      this.fenyeType = 1
      this.getJudgeList()
    },
    agree1 () {

    },

    refuse1 () {

    },
  }
}
</script>

<style lang="scss" scoped>
.picBox {
  z-index: 999;
  background-color: rgba($color: #000000, $alpha: 0.4);
  position: fixed;
  z-index: 999;
  width: 100%;
  height: 100%;
  bottom: 0;
  left: 0;
  .img {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
  }
  .back {
    position: absolute;
    right: 0;
    width: 20px;
    height: 20px;
    color: red;
    line-height: 20px;
    text-align: center;
    cursor: pointer;
  }
  .p1 {
    padding: 10px;
    background-color: #f99;
    width: 500px;
    height: 300px;
    margin: 0 auto;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .p2 {
    padding: 10px;
    margin: 0 auto;
    background-color: #666;
    width: 500px;
    height: 500px;
    img {
      width: 100%;
      height: 100%;
    }
  }
}

/deep/.centerDia {
  background-color: #fff;
  position: absolute;
  top: 30%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
  width: 400px;
  .el-dialog__header {
    display: flex;
    justify-content: space-between;
    .el-dialog__title {
      color: #222 !important;
      font-size: 16px;
      padding-left: 20px;
      left: 0;
    }
    .el-dialog__headerbtn {
      position: static;
      padding-right: 10px;
    }
  }
  .el-dialog__body {
    padding: 30px;
    width: 100%;
    height: 150px;
  }
  .el-dialog__footer {
    margin-bottom: 20px;
    height: 40px;
    .dialog-footer {
      padding-top: 8px;
      height: 40px;
    }
    .el-button {
      height: 30px;
      span {
        display: inline-block;
        height: 30px;
      }
    }
  }
}
.form-container {
  position: relative;
  width: 100%;
  height: 100%;
  background: #fff;
  .title-class {
    width: 100%;
    height: 30px;
  }
  .fenye-class {
    top: 814px !important;
  }
  .button {
    width: 72px;
    height: 30px;
    background: rgba(37, 186, 217, 1);
    border-radius: 4px;
    font-size: 14px;
    color: #fff;
    text-align: center;
    line-height: 30px;
    cursor: pointer;
    float: left;
  }

  // .searchBox {
  //   float: right;
  //   padding-right: 30px;
  //   .search-btn {
  //     height: 30px;
  //     background-color: #bfbfbf;
  //     border-radius: 0 3px 3px 0;
  //     margin-top: -13px;
  //     z-index: 9;
  //     color: #fff;
  //     font-size: 14px;
  //     line-height: 30px;
  //     padding: 0 5px;
  //     cursor: pointer;
  //   }
  //   .sreach-box {
  //     width: 180px;
  //     height: 30px;
  //     border-radius: 3px;
  //     // border: 1px solid #bfbfbf;
  //     border-top: 1px solid #bfbfbf;
  //     border-left: 1px solid #bfbfbf;
  //     border-bottom: 1px solid #bfbfbf;
  //     padding-left: 1px;
  //     /deep/.el-input__inner {
  //       height: 100% !important;
  //       padding-left: 7px !important;
  //     }
  //   }
  // }
}
/deep/.myRecordForm {
  min-width: 380px;
  max-width: 480px;
  .el-dialog__header {
    height: 30px;
    .el-dialog__title {
      position: absolute;
      top: 5px;
      font-size: 16px;
    }
    .el-dialog__headerbtn {
      top: 6px;
    }
  }
  .el-dialog__body {
    position: relative;
    padding-left: 30px;
    padding-bottom: 40px;

    .el-form-item {
      min-height: 30px;
      .el-form-item__content {
        border: 1px solid #d2d2d2;
        border-radius: 4px;
      }
      .el-input__inner {
        height: 100% !important;
      }
    }
  }
  .el-input__inner {
    cursor: default !important;
  }
  .el-form-item__label {
    text-align: left;
  }
  .btn-confirm-record {
    position: absolute;
    bottom: 10px !important;
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
.el-table--fit {
  margin-top: 10px;
}
//申请修改详情//
/deep/.myDetailForm {
  top: 22%;
  border-radius: 5px;
  width: 435px;
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
    padding: 29px 50px 45px 60px !important;
    .el-form {
      padding-bottom: 14px;
      position: relative;
    }
    .row {
      position: relative;
      line-height: 32px;
      margin-bottom: 50px;
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
//搜索框样式
.serach-box {
  float: right;
  width: 180px;
  height: 30px;
  background: rgba(255, 255, 255, 1);
  border: 1px solid rgba(191, 191, 191, 1);
  border-radius: 3px;
  display: flex;
  input {
    float: left;
    width: 155px;
    background: rgba(255, 255, 255, 1);
    border-right: none;
    outline: none;
    flex: 7;
    padding-left: 7px;
    border: none;
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: rgba(153, 153, 153, 1);
    border-radius: 4px;
    &::-webkit-input-placeholder {
      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: rgba(153, 153, 153, 1);
    }
    &::-moz-placeholder {
      font-size: 10px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: rgba(153, 153, 153, 1);
    }
  }
  .serach {
    float: right;
    flex: 1;
    font-size: 14px;
    border-left: none;
    background: rgba(191, 191, 191, 1);
    text-align: center;
    line-height: 28px;
    padding: 0 3px;
    cursor: pointer;
  }
}
.my-input {
  position: absolute;
  left: 87px;
  width: 74%;
  /deep/.el-textarea__inner {
    resize: none !important;
    outline: none !important;
    border: 1px solid #ccc;
    padding: 8px !important;
  }
}
/deep/.el-table th > .cell {
  padding-left: 41px !important;
}
/deep/.el-table .cell {
  padding-left: 41px !important;
}
el-image {
  width: 100% !important;
  height: 100% !important;
  display: inline-block;
}
/deep/.face-dialog {
  border-radius: 5px;
  /deep/.el-dialog__header {
    padding: 12px 0 10px 16px !important;
    border-bottom: 1px solid #eff2f5;
    .el-dialog__title {
      font-size: 16px !important;
    }
    .el-dialog__headerbtn {
      top: 17px !important;
    }
  }
}
/deep/.el-loading-spinner {
  top: 100% !important;
}
/deep/.el-table__body-wrapper {
  overflow-x: inherit;
}
</style>