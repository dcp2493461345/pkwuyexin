<template>
  <div class="hard-setparamClass">
    <div class="setparam-container">
      <el-card class="box-card">
        <span class="mm">
          <span id="newadd" @click="addDoor" v-if="buttonallShow">新增门岗</span>
        </span>
        <el-table :data="tableData" style="width: 100%" empty-text="暂无数据">
          <el-table-column prop="door_post_name" label="门岗名称" min-width="150" />
          <el-table-column prop="camera_name" label="摄像头名称" min-width="240" >
          <template slot-scope="scope1">
              <p
              class="opop"
              >{{ scope1.row.camera_name }}</p>
            </template>
          </el-table-column>
          <el-table-column prop="user_name" label="当前收费员" min-width="150" />
        </el-table>
      </el-card>
      <!-- 分页 -->
      <my-pages :pageInfo="pageInfo" @handleCurrentChange="handleCurrentChange" class="myfenye"></my-pages>
    </div>
    <!-- 遮罩三 -->
    <el-dialog
      title="新增门岗"
      :visible.sync="centerDialogVisible1"
      :append-to-body="true"
      center
      class="chen"
      top="35vh"
      :close-on-click-modal="false"
    >
      <el-form :label-position="labelPosition" label-width="85px" class="el-myclass">
        <el-form-item label="门岗名称:">
          <el-input v-model="doorName" @keydown.native.enter="addMengang" autofocus></el-input>
          <span style="color:red;position: absolute;top:29px;left:0px;">{{toast1}}</span>
        </el-form-item>
      </el-form>
      <div class="footer-class" @click="addMengang">
        <span>确认</span>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { postDoorList, postDoorAdd } from '@/api/hardware'
import { Message } from 'element-ui'
import { postSelect_button } from '@/api/Jurisdiction1'
// data数据
export default {
  components: {},
  data () {
    return {
      buttonallShow: false,
      centerDialogVisible1: false, // 新增门岗
      tableData: [],
      userInfo: {},//localStorage的userInfo
      pageInfo: {
        total: 0,//总条数
        listRows: 10,//page-size
        page: 1,//当前页
      },
      pageNums: 0,//总页数
      totalPage: 0,//总条数
      currentPage: null,// 当前页
      doorName: '',//增加的门岗名称
      labelPosition: 'right',
      parkid: null,
      toast1: '',//门岗名称提示语
    }
  },
  created () {
    const page = 1
    const size = 10
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'))
    const { Communityid, uid } = this.userInfo
    this.parkid = this.userInfo.Communityid
    const auth_id = this.$route.meta.auth_id
    postDoorList({ page, size, parkid: this.parkid }).then(resp => {
      this.tableData = resp.data.data
      this.pageInfo.total = resp.data.total
      this.pageInfo.page = resp.data.page
    })
    // 按钮权限判定
    postSelect_button({ Communityid, uid, auth_id }).then(resp => {
      if (resp.code === 200) {
        this.buttonLists = resp.data
        var btnList = this.buttonLists
        btnList.forEach(list => {
          if (list.auth_name === '新增门岗') {
            this.buttonallShow = true
          }
        })
      }
    })
  },
  methods: {
    // 分页设置
    handleCurrentChange (val) {
      this.pageInfo.page = val
      this.getDooorList(val, 10, this.parkid)
    },
    //查询门岗列表
    getDooorList (page = 1, size = 10, parkid = this.parkid) {
      postDoorList({ page, size, parkid }).then(resp => {
        this.tableData = resp.data.data
        this.pageInfo.total = resp.data.total
      })
    },
    addDoor () {
      this.doorName = ''
      this.centerDialogVisible1 = true
    },
    //新增门岗
    addMengang () {
      //验证门岗是否填写，填写才访问接口
      if (this.doorName) {
        const adminId = this.userInfo.uid
        const doorName = this.doorName
        postDoorAdd({ adminId, doorName, parkid: this.parkid }).then(resp => {
          if (resp.data === '门岗添加成功') {
            this.$message({
              message: '门岗添加成功',
              type: 'success'
            })
            this.centerDialogVisible1 = false
            const nume = Number(this.pageInfo.total) / Number(10)
            var shu = ''
            if (Math.round(nume) === nume) {
              // num是整数
              shu = Number(nume) + Number(1)
            } else {
              shu = Math.ceil(nume)
            }
            const page = shu
            this.getDooorList(shu, 10, this.parkid)
            this.handleCurrentChange(page)
          }
        })
      } else {
        this.toast1 = '请输入门岗名称'
        setTimeout(() => {
          this.toast1 = ''
        }, 2000)
      }

    }
  }
}
</script>
<style lang="scss" scoped>
//卡片的样式
/deep/.createJobDialog .el-dialog .el-dialog--center {
  background-color: #f44 !important;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}

.box-card {
  min-height: 775px;
  position: relative;
  width: 100%;
  box-shadow: none;
  border: none;
  /deep/.el-card__header {
    border: none;
    border-bottom: none;
    padding: 20px !important;
    .el-table--striped .el-table__body tr.el-table__row--striped td {
      background-color: #eff2f5 !important;
    }
    .el-table thead {
      color: #909399 !important;
    }
    .el-table td {
      padding: 15px 0 !important;
      z-index: 222;
    }
    .el-table th {
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: rgba(144, 147, 153, 1);
    }
    /deep/.el-table .cell {
      text-overflow: ellipsis !important;
      overflow: hidden !important;
      white-space: nowrap;
      cursor: default;
      width: 400px;
      // height: 30px !important;
      line-height: 30px;
      font-size: 14px;
      padding: 0 0 0 65px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      span {
        width: 100%;
        p {
          text-overflow: ellipsis !important;
          overflow: hidden !important;
          white-space: nowrap;
        }
      }
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

.chen {
  /deep/.el-dialog {
    width: 500px;
    height: 188px;
    border-radius: 5px;
    .el-dialog__header {
      text-align: left;
      padding: 13px 20px 10px;
      height: 47px !important;
      border-bottom: 1px solid #eff2f5;
      .el-dialog__title {
        font-size: 16px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: rgba(51, 51, 51, 1);
      }
      .el-dialog__headerbtn {
        top: 15px !important;
      }
    }
    /deep/.el-dialog__body {
      text-align: initial;
      padding: 24px 25px 25px 0px;
      .el-form-item__label {
        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: rgba(102, 102, 102, 1);
      }
      .el-myclass {
        padding-left: 55px;
        height: 65px !important;
        /deep/ .el-form-item__label {
          padding: 0 24px 0 0;
        }
        /deep/.el-input__inner {
          // background-color: #f00;
          width: 266px !important;
          height: 32px !important;
          border: 1px solid rgba(210, 210, 210, 1) !important;
          border-radius: 4px !important;
        }
      }
    }
    .footer-class {
      // background-color: #f00;
      cursor: pointer;
      display: flex;
      justify-content: center;
      height: 30px;
      span {
        width: 72px;
        height: 30px;
        border-radius: 4px;
        background-color: #fcb048;
        border-color: #fcb048;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #fff;
      }
    }
  }
}
.hongdian {
  width: 6px;
  height: 6px;
  background-color: #f00;
  border-radius: 5px;
  position: absolute;
  top: 26px;
  left: 240px;
}
/deep/.el-tree-node {
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: rgba(108, 108, 108, 1);
  .el-tree-node__label {
    font-size: 14px !important;
  }
  .el-tree-node__content {
    height: 30px !important;
  }
  .el-checkbox__inner {
    width: 20px;
    height: 20px;
  }
  .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner {
    background-color: #409eff;
    border-color: #409eff;
    color: #fff !important;
    cursor: default !important;
    &::after {
      color: #fff !important;
      cursor: default !important;
    }
  }
}
/deep/.el-checkbox__inner::after {
  height: 10px;
  left: 6px;
  top: 2px;
  width: 4px;
}
/deep/.el-pagination.is-background .btn-next:disabled {
  cursor: default;
}
/deep/.el-pagination.is-background .btn-prev:disabled {
  cursor: default;
}

.total-class {
  position: relative;

  .div-class {
    width: 100px;
    height: 100px;
    position: absolute;
    background: green !important;
    top: -10px;
    z-index: 25633333334444444444655555555555555555555566666666666612789;
  }
}
/deep/.el-popover {
  top: 0px !important;
  left: 10px !important;
  z-index: 56789356345554555;
}

#newadd {
  display: inline-block;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  width: 72px;
  height: 30px;
  line-height: 30px;
  background: rgba(37, 186, 217, 1);
  border-radius: 4px;
  font-size: 14px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: rgba(255, 255, 255, 1);
  cursor: pointer;
}
/deep/.el-pagination__editor {
  background-color: #5fafe4 !important;
  height: 20px;
  width: 30px;
  color: white;
  cursor: pointer;
}
.hard-setparamClass {
  height: 93%;
}
.setparam-container {
  min-width: 600px;
  width: 100%;
}
/deep/.el-table .cell {
  // height: 30px !important;
}
/deep/.myfenye {
  top: 39px;
  .record-data {
    left: 20px;
    bottom: 35px;
  }
  .el-pagination {
    right: 90px;
    bottom: 30px;
  }
}
.mm {
  display: block;
  height: 30px;
}
.opop{
  // width:350px;
}
</style>
