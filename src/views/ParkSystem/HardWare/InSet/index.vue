<template>
  <div class="hard-setparamClass">
    <div class="setparam-container">
      <div v-if="isShowAdd">
        <el-card class="box-card" v-if="isShowCard">
          <div style="height:30px;">
            <span id="newadd" @click="addClick" v-if="addBtn">新增内场</span>
          </div>

          <el-table :data="tableData" style="width: 100%" empty-text="暂无数据">
            <el-table-column
              prop="setting_name"
              :label="labelM"
              min-width="150"
              label-class-name="workOrderStyle"
            />
            <!-- 操作 -->
            <el-table-column label="操作" min-width="100">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  style="background:#25BAD9; color:#fff; font-size:14px;height:30px; width:52px;
            border-color:#25BAD9; padding:5px;"
                  @click="handleEdit(scope.$index, scope.row)"
                  v-if="modifyBtn"
                >修改</el-button>
                <el-button
                  size="mini"
                  style="background:#25BAD9; color:#fff; font-size:14px;height:30px; width:52px;
            border-color:#25BAD9; padding:5px;"
                  v-if="bangdingBtn"
                  @click="handleBandi(scope.$index, scope.row)"
                >绑定</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
        <modify-params v-else @isShowCardFunc="isShowCardFunc1" :inSetId="inSetId"></modify-params>
      </div>
      <add-inset v-if="!isShowAdd" @isShowCardFunc1="isShowCardFunc2"></add-inset>
      <!-- 分页 -->
      <div v-if="isShowAdd">
        <div v-if="isShowCard">
          <my-pages :pageInfo="pageInfo"  class="myfenye"></my-pages>
        </div>
      </div>
    </div>
    <!-- 绑定遮罩三 -->
    <el-dialog
      title="绑定停车场"
      :visible.sync="centerDialogVisible1"
      :append-to-body="true"
      center
      :close-on-click-modal="false"
      custom-class="bangding-class"
    >
      <!-- <p>提示</p> -->
      <el-form label-position="right" label-width="80px">
        <div class="form-item">
          <el-form-item label="选择停车场:" class="region-class">
            <el-select v-model="setting_name" placeholder="请选择停车场" class="choice-class">
              <el-option v-for="item in parkLists" :key="item.id" :value="item.setting_name">
                <span class="chenp" @click="hanid(item.id)">{{ item.setting_name }}</span>
              </el-option>
            </el-select>
          </el-form-item>
          <p class="tips">{{parkToast}}</p>
          <!-- //选择停车场备选组 -->
          <el-form-item label="选择门岗:">
            <el-checkbox-group v-model="doorLists1">
              <el-checkbox
                v-for="item in doorLists"
                :label="item.id"
                :key="item.door_post_name"
              >{{item.door_post_name}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <p class="tips" style>{{ mengangToast }}</p>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" style="font-size:14px;" @click="bangdingDid">确 认</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { Message } from 'element-ui'
import { parkState } from '@/api/dash.js'
import { postBindingCar, postBindingInfo, postBindingInfoBach, postDoorListId } from '@/api/hardware'
import ModifyParams from './ModifyParams.vue'
import AddInset from './AddInset.vue'
import { postSelect_button } from '@/api/Jurisdiction1'
// data数据
export default {
  components: {
    ModifyParams,
    AddInset
  },
  data () {
    return {
      labelM:'',
      addBtn: false,
      modifyBtn: false,
      bangdingBtn: false,
      showInset: false,//判断是否设置了外场
      parkToast: '',//选择停车场提示语
      mengangToast: '',//选择门岗提示语
      set_id: null,//选择的内场id
      inSetId: '',//内场id
      isShowAdd: true,
      parkid: null,
      pageInfo: {
        total: 0,//总条数
        listRows: 10,//page-size
        page: 1,//当前页
      },
      centerDialogVisible1: false, // 新增门岗
      isShowCard: true,
      parkLists: [],
      doorLists1: [],
      setting_name: '',
      doorLists: [],
      tableData: []
    }
  },
  created () {
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'))
    const { Communityid, uid } = this.userInfo
    this.parkid = this.userInfo.Communityid
    const auth_id = this.$route.meta.auth_id
    this.getInsetList()
    parkState({ parkid: this.parkid }).then(resp => {
      const stateType = resp.data.state_type
      this.showInset = stateType === 2 ? true : false
    })
    //权限绑定
    postSelect_button({ Communityid, uid, auth_id }).then(resp => {
      console.log(resp, 'resp按钮权限')
      if (resp.code === 200) {
        this.buttonLists = resp.data
        var btnList = this.buttonLists
        btnList.forEach(list => {
          if (list.auth_name === '新增内场') {
            this.addBtn = true
          }
          if (list.auth_name === '绑定') {
            this.bangdingBtn = true
          }
          if (list.auth_name === '修改') {
            this.modifyBtn = true
          }
        })
      }
    })
  },
  methods: {
    hanid (id) {
      this.set_id = id
    },
    //第一次绑定确认
    bangdingDid () {
      const door_id = this.doorLists1.join(',')//门岗checkbox
      const set_id = this.set_id//选择停车场
      const id = this.inSetId
      //前端验证
      if (!set_id) {
        this.parkToast = '请选择停车场'
        setTimeout(() => {
          this.parkToast = ''
        }, 2000)
      } else if (!door_id) {
        //验证是否输入了设备名称
        this.mengangToast = '请选择门岗'
        setTimeout(() => {
          this.mengangToast = ''
        }, 2000)
      } else if (set_id && door_id) {
        postBindingInfoBach({ id, set_id, door_id, parkid: this.parkid }).then(resp => {
          if (resp.data === '绑定成功') {
            this.$message({
              message: resp.data,
              type: "success"
            })
            this.centerDialogVisible1 = false
            this.parkLists = []
          }
        })
      }
    },
    //请求内场数据列表
    getInsetList (page = 1, size = 10, parkid = this.parkid) {
      postBindingCar({ page, size, parkid }).then(resp => {
        this.tableData = resp.data.data
        this.pageInfo.total = resp.data.total
        this.pageInfo.page = resp.data.page
      })
    },
    //已经绑定过后点击确认
    handleBandi (index, row) {
      this.inSetId = row.id
      const id = row.id
      postBindingInfo({ id: id, parkid: this.parkid }).then(resp => {
        this.parkLists = resp.data.set_list
        if (resp.data.seting_info) {
          //修改绑定
          this.doorLists = resp.data.door_list
          this.set_id = resp.data.seting_info.id
          this.setting_name = resp.data.seting_info.setting_name
          //后端返回的checklist
          this.$nextTick(function () {
            this.doorLists1 = resp.data.door_info
          })
        } else {
          //第一次绑定（添加）
          this.setting_name = ''
          this.set_id = null
          this.doorLists1 = []
          postDoorListId({ parkid: this.parkid }).then(resp1 => {
            this.doorLists = resp1.data
          })
        }
      })
      this.centerDialogVisible1 = true
    },
    //点击修改
    handleEdit (index, row) {
      this.isShowCard = false
      this.inSetId = row.id
    },
    isShowCardFunc1 (data) {
      this.isShowCard = data
      this.getInsetList()
    },
    isShowCardFunc2 (data) {
      this.isShowAdd = data
      this.getInsetList()
    },
    //新增内场
    addClick () {
      if (this.showInset) {
        //内场界面显示
        this.isShowAdd = false
      } else {
        this.$message({
          message: '请先设置外场参数',
          type: 'warning'
        })
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
      height: 30px !important;
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

/deep/ .el-dialog {
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
  .el-dialog__wrapper {
    overflow: auto;
  }
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
  /deep/.el-dialog__body {
    overflow: hidden;
    padding: 20px 50px 6px 48px !important;
    .form-item {
      height: 60px;
      .zhiwei {
        margin-bottom: 0px;
        .el-form-item__label {
          display: inline-block;
          font-size: 14px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          padding: 0 !important;
          white-space: nowrap;
          color: rgba(102, 102, 102, 1);
          text-align: right !important;
        }
        .el-form-item__content {
          input {
            width: 87% !important;
            border: 1px solid rgba(210, 210, 210, 1);
            border-radius: 3px;
            outline: none;
            color: #333333;
            padding-left: 8px;
          }
        }
      }
      .el-form-item {
        margin-bottom: 0px;
        margin-top: 1px;
        text-align: center;
        &__label {
          height: 30px;
          display: inline-block;
          font-size: 14px;
          padding: 0 !important;
          font-family: Microsoft YaHei;
          font-weight: 400;
          color: rgba(102, 102, 102, 1);
        }
        &__content {
          input {
            position: relative;
            height: 30px;
            width: 87% !important;
            border: 1px solid rgba(210, 210, 210, 1);
            border-radius: 3px;
            outline: none;
            color: #333333;
            padding-left: 8px;
          }
        }
      }

      .mistack-message {
        position: relative;
        top: -13px;
        text-align: left;
        margin-left: 5px;
        box-sizing: border-box;
        font-size: 14px;
        transform: scale(0.9);
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: rgba(255, 0, 0, 1);
      }
    }
  }
  .el-dialog__footer {
    padding-top: 0px;
    button {
      width: 62px;
      height: 30px;
      line-height: 0;
      outline: none;
      border: none;
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 0 auto;
      background: rgba(248, 172, 89, 1);
      border-radius: 3px;
      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: rgba(255, 254, 254, 1);
      margin-bottom: 4px;
    }
  }
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
  left: 4px !important;
  top: -2px !important;
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
  min-width: 1000px;
}
.setparam-container {
  // height: 2000px;
  // background-color: green;
  width: 100%;
}
/deep/.el-table .cell {
  height: 30px !important;
}
/deep/.bangding-class {
  width: 500px !important;
    height: 273px !important;
     display: flex;
flex-direction: column;
margin:0 !important;
position:absolute;
top:50%;
left:50%;
transform:translate(-50%,-50%);

 
    .el-dialog__body {
      height: 178px;
      padding: 20px 58px 15px 77px !important;
      .el-checkbox__label {
        position: relative;
        top: 8px;
      }
      /deep/.el-form-item__label {
        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: rgba(102, 102, 102, 1);
      }
      .el-select {
        display: block !important;
        .el-input {
          width: 300px;
          .el-input__inner {
            width: 300px;
            height: 32px;
            border: 1px solid rgba(210, 210, 210, 1) !important;
            border-radius: 4px;
          }
          /deep/.el-input__suffix {
            right: 20px !important;
          }
        }
      }
    }
  // }
}
// /deep/.el-select-dropdown {
//   min-width: 262px !important;
//   left: 633px;
// }
.choice-class {
  // background-color: #f00;
  width: 266px;
  position: relative !important;
  top: 0px;
  left: 0px !important;
}
.tips {
  color: red;
  height: 20px;
  margin-left: 100px;
}
.chenp {
  display: block;
}
.el-checkbox-group {
  width: 354px;
  margin-top: -6px;
  display: flex;
  flex-wrap: wrap;
  margin-left: 20px;
  .el-checkbox__inner {
    width: 17px;
    height: 17px;
  }
}
/deep/.myfenye {
  top: 42px;
  .record-data {
    left: 20px;
    bottom: 38px;
  }
  .el-pagination {
    right: 90px;
    bottom: 30px;
  }
}
.workOrderStyle {
  color: red !important;
}

</style>
