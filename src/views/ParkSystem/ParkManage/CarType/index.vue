<template>
  <div class="hard-setparamClass">
    <div class="setparam-container">
      <el-card class="box-card">
        <span id="newadd" @click="addDoor" v-if="add">添加车位类型</span>
        <el-table :data="tableData" style="width: 100%" empty-text="暂无数据">
          <el-table-column prop="park_type" label="车位类型" min-width="150" />
          <el-table-column prop="park_car_long" label="长租车月租(元)" min-width="150" />
          <el-table-column label="操作">
            <template slot-scope="scope">
              <span class="el-btn11" @click="compile(scope.row)" v-if="compiless">修改</span>
              <span class="el-btn22" @click="operation(scope.row)" v-if="czjl">操作记录</span>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
      <!-- 分页 -->
      <div class="block">
        <p class="record-data">共{{ pageNums }}页,共{{ totalPage }}条</p>
        <el-pagination
          background
          :page-size="pageSize"
          layout="prev, pager, next, jumper"
          :total="totalPage"
          :current-page.sync="currentPage"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
    <!-- 新增车位类型 -->
    <el-dialog
      title="新增车位类型"
      :visible.sync="centerDialogVisible1"
      :append-to-body="true"
      center
      class="chen"
      top="35vh"
      :close-on-click-modal="false"
      width="26.04%"
      >
      <el-form
        ref="addCartype"
        :label-position="labelPosition"
        label-width="90px"
        :model="addCarType"
        class="el-myclass"
        hide-required-asterisk
      >
        <el-form-item label="车位类型:">
          <el-input
            v-model="addCarType.park_type"
            class="form_item"
            autocomplete="off"
            @keydown.native.enter="submitForm"
          />
        </el-form-item>
        <div class="yanzheng">
          <div><span v-show="yzheng">请输入车位类型</span><span v-show="cunzai">车位类型已存在</span></div>
        </div>
        <el-form-item label="长租车月租:">
          <el-input
           onkeyup="this.value= this.value.match(/\d+(\.\d{0,2})?/) ? this.value.match(/\d+(\.\d{0,2})?/)[0] : ''"
            v-model.trim="addCarType.park_car_long"
            autocomplete="off"
            @keydown.native.enter="submitForm"
          />
          <span class="units">元</span>
        </el-form-item>
        <div class="yanzheng">
        </div>
      </el-form>
      <div class="footer-class">
        <span @click="submitForm">确认</span>
      </div>
    </el-dialog>
    <!-- 修改车位类型 -->
    <el-dialog
      title="修改车位类型"
      :visible.sync="Modifyparkingspacetype"
      :append-to-body="true"
      center
      class="chen"
      top="35vh"
      :close-on-click-modal="false"
      width="26.04%"
      >
      <el-form
        ref="addCartype"
        :label-position="labelPosition"
        label-width="90px"
        :model="amendCartype"
        class="el-myclass"
        hide-required-asterisk
      >
        <el-form-item label="车位类型:">
          <el-input
            v-model="amendCartype.park_type"
            class="form_item"
            autocomplete="off"
            @keydown.native.enter="submit"
          />
        </el-form-item>
        <div class="yanzheng">
          <div><span v-show="yzheng">请输入车位类型</span><span v-show="cunzai">车位类型已存在</span></div>
        </div>
        <el-form-item label="长租车月租:">
          <el-input
          onkeyup="this.value= this.value.match(/\d+(\.\d{0,2})?/) ? this.value.match(/\d+(\.\d{0,2})?/)[0] : '' "
            v-model="amendCartype.park_car_long"
            autocomplete="off"
            @keydown.native.enter="submit"
          />
          <span class="units">元</span>
        </el-form-item>
        <div class="yanzheng">
         
        </div>
      </el-form>
      <div class="footer-class">
        <span @click="submit">确认</span>
      </div>
    </el-dialog>

    <!-- 操作记录 -->
    <el-dialog
      title="操作记录"
      :visible.sync="operationnote"
      :append-to-body="true"
      center
      class="operationnote"
      top="35vh"
      :close-on-click-modal="false"
      width="24.43%"
      >
      <el-form
        :label-position="labelPosition"
        label-width="110px"
        :model="operatingData"
        class="el-myclass"
        hide-required-asterisk
      >
        <el-form-item label="上次操作员:">
          <el-input v-model="operatingData.name" autofocus disabled @keydown.native.enter="affirm" />
        </el-form-item>
        <el-form-item label="上次操作时间:">
          <el-input v-model="operatingData.time" autofocus disabled @keydown.native.enter="affirm" />
        </el-form-item>
        <el-form-item label="上次操作IP地址:">
          <el-input v-model="operatingData.ip" autofocus disabled @keydown.native.enter="affirm" />
        </el-form-item>
      </el-form>
      <div class="footer-class">
        <span @click="affirm">确认</span>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { Message } from "element-ui";
import moment from "moment";
import { addPark, parkList, modifyPark, operatingRecord } from "@/api/parkCar";
import { postSelect_button } from "@/api/Jurisdiction1";
// data数据
export default {
  components: {},
  data() {
    return {
      add:false,
      compiless:false,
      czjl:false,
      yzheng:false,
      yzheng1:false,
      Modifyparkingspacetype: false, // 修改车位类型
      centerDialogVisible1: false, // 新增车位类型
      operationnote: false, // 操作记录
      tableData: [],
      userInfoList: {}, // localStorage的userInfo
      pageNums: 1, // 总页数
      totalPage:null, // 总条数
      disabled: true,
      id: "", // 当前列id
      ids: "",
      cunzai:false,
      // 新增车位类型
      addCarType: {
        park_type: "",
        park_car_long: ""
      },
      // 修改车位类型
      amendCartype: {
        park_type: "",
        park_car_long: ""
      },
      // 操作记录
      operatingData: {
        name: "",
        time: "",
        ip: ""
      },
      labelPosition: "right",
      parkid: "",
      currentPage: 1, // 当前页
      pageSize: 10, // 当前页条数
      uid: "",
      park_id: ""
    };
  },
 
  async created() {
    const user = JSON.parse(localStorage.getItem("userInfo"));
    this.parkid = user.Communityid;
    this.uid = user.uid;
    this.park_id = user.Communityid;
    this.parkList();

     // 拉取用户信息 按钮权限判定
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'))
    const { Communityid, uid } = this.userInfo
    const auth_id = this.$route.meta.auth_id
    const {data}  =   await postSelect_button({Communityid, uid, auth_id})
    console.log(data);
    data.forEach(v=>{
      if(v.auth_name==="修改"){
        this.compiless=true;
      }
        if(v.auth_name==="操作记录"){
        this.czjl=true;
      }
        if(v.auth_name==="添加车位类型"){
        this.add=true;
      }
    })

  },
  methods: {
   
    // 分页设置
    handleCurrentChange(val) {
      this.currentPage = val;
      console.log(val);
      this.parkList();
    },
    // 新增车位类型提交 验证所有表单
    async submitForm() {
        if (!this.addCarType.park_type) {
          this.yzheng=true;
          setTimeout(()=>{
             this.yzheng=false
          },2000)
          }else if(this.addCarType.park_type){
                  const data = await addPark({
            park_type: this.addCarType.park_type,
            park_car_long: this.addCarType.park_car_long,
            park_id: this.park_id,
            uid: this.uid
          });
        
          if (data.msg === 1) {
            this.centerDialogVisible1 = false;
            // 再此获取列表
            this.parkList();
            Message({
              type: "success",
              message: "添加成功"
            });
          }else if(data.data==="不能重复!"){
             this.cunzai=true;
             setTimeout(()=>{
               this.cunzai=false;
             },2000)
          }
          else {
            // 失败
            Message.error("添加失败");
          }
          } 
     
    },
    // 修改车位类型提交
    async submit() {
       if (!this.amendCartype.park_type) {
          this.yzheng=true;
          setTimeout(()=>{
             this.yzheng=false
          },2000)
          }else if(this.amendCartype.park_type){
          // console.log(this.amendCartype);
          const res = await modifyPark({
            park_type: this.amendCartype.park_type,
            park_car_long: this.amendCartype.park_car_long,
            id: this.id,
            uid: this.uid,
            parkid:this.parkid
          });
          if (res.msg === 1) {
            this.Modifyparkingspacetype = false;
            this.parkList();
            Message({
              type: "success",
              message: "修改成功"
            });
          } else if(res.data==="当前未做任何修改!") {
            // 失败
             this.$message({
            message: "您未修改任何内容或修改失败",
            type: "warning"
          })
            this.Modifyparkingspacetype = false;
          }else if(res.data==="不能重复!"){
              this.cunzai=true;
              setTimeout(()=>{
              this.cunzai=false;
              },2000)
          }
          else {
              Message.error("修改失败");
            this.Modifyparkingspacetype = false;
          }
          }
    },
    // 获取车位类型列表
    async parkList() {
      const { data } = await parkList({
        page: this.currentPage,
        size: this.pageSize,
        parkid: this.parkid,
        uid: this.uid
      });
     console.log(data);
      this.tableData = data.data;
      this.totalPage = Number(data.total); // 总条数
      this.pageNums = data.pageNum;
    },
    // 显示新增车位模态框
    addDoor() {
         this.addCarType= {
        park_type: "",
        park_car_long: ""
      }
      this.centerDialogVisible1 = true;
      // 去除验证
  
    },
    // 修改车位类型
    compile(row) {
      console.log(row);
      const { park_type, park_car_long, id } = row;
      this.amendCartype.park_type = park_type;
      this.amendCartype.park_car_long = Number(park_car_long);
      this.id = id;
      this.Modifyparkingspacetype = true;
      // this.$nextTick(() => {
      //   this.$refs.amendCartype.resetFields();
      // });
    },
    // 操作记录
    operation(row) {
      console.log(row);
      const { id } = row;
      this.ids = id;
      this.operatingRecord();
      this.operationnote = true;
    },
    affirm() {
      this.operationnote = false;
    },
    // 获取操作记录列表
    async operatingRecord() {
      const { data } = await operatingRecord({
        state: 1,
        id: this.ids
      });
      console.log(data);
      data.time = moment(data.time*1000).format("YYYY-MM-DD HH:mm:ss");
      this.operatingData = data;
    }
  }
};
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
  min-height: 783px;
  position: relative;
  width: 100%;
  box-shadow: none;
  border: none;
  /deep/.el-card__header {
    border: none;
    border-bottom: none;
    padding: 20px !important;
    /deep/.el-table--striped .el-table__body tr.el-table__row--striped td {
      background-color: #eff2f5 !important;
      height: 60px !important;
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

//分页器的样式
.block {
  background: #fff;
  .record-data {
    cursor: default;
    display: inline-block;
    line-height: 11px;
    padding-left: 20px;
    margin-top: 15px;
    position: absolute;
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
  }
  position: relative;
  top: -30px;
  height: 40px;
  width: 100%;
  .el-pagination {
    position: absolute;
    bottom: 0;
    right: 87px;
    /deep/button {
      min-width: 24px !important;
      height: 24px;
    }
    /deep/.el-pagination__jump {
      position: relative;
      margin-left: 0px;
      color: #fff;
      font-size: 0px;
      //input和ul是否居中
      margin-top: 0px;

      .el-input {
        font-family: Microsoft YaHei;
        font-weight: 400;
        height: 24px;
        width: 40px;
        margin-left: 5px;
        outline: none;
        color: rgba(102, 102, 102, 1);

        /deep/.el-input__inner {
          font-size: 14px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          color: rgba(102, 102, 102, 1);
          display: inline-block;
          width: 40px;
          margin-left: 48px;
          height: 24px !important;
          border: 1px solid rgba(239, 242, 245, 1) !important;
          border-radius: 3px;
          outline: none;
        }
        &::before {
          content: "前往";
          color: #fff;
          font-size: 14px;
          margin-left: 4px;
          position: absolute;
          margin-top: 3px;
          text-align: center;
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
      border-radius: 3px;
      font-size: 14px;
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

.chen {
  /deep/.el-dialog {
    min-width: 380px;
    height: 247px;
    border-radius: 5px;
     display: flex;
       flex-direction: column;
       margin:0 !important;
       position:absolute;
       top:50%;
       left:50%;
       transform:translate(-50%,-50%);
    .el-dialog__header {
      text-align: left;
      height: 43px !important;
      border-bottom: 1px solid #eff2f5;
      padding: 10px 19px 12px;
      .el-dialog__title{
      font-size:16px !important;
      }
      .el-dialog__headerbtn{
           position: absolute;
    top: 15px;
    right: 20px;
    padding: 0;
    background: 0 0;
    border: none;
    outline: 0;
    cursor: pointer;
    font-size: 16px;
      }
    }
    /deep/.el-dialog__body {
      text-align: initial;
      padding: 24px 0px 25px 0;
      .el-myclass {
        padding-left: 65px;
        height: 65px !important;
        /deep/ .el-form-item__label {
          padding: 0 8px 0 0;
          text-align: left;
        }
        /deep/.el-input__inner {
          // background-color: #f00;
          width: 73% !important;
          height: 32px !important;
          border: 1px solid rgba(210, 210, 210, 1) !important;
          border-radius: 4px !important;
        }
      }
    }
    .footer-class {
      // background-color: #f00;
      cursor: pointer;
      height: 30px;
      display: flex;
      justify-content: center;
      margin-top: 58px;
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
        text-align: center；
      }
    }
    .el-form-item {
      margin-bottom: 0;
      height: 40px !important;
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
  width: 100px;
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
  //height: 100%;
}
.setparam-container {
  // height: 2000px;
  // background-color: green;
  width: 100%;
}

.el-btn11 {
  display: inline-block;
  text-align: center;
  color: #fff;
  width: 52px;
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
.el-btn22 {
  display: inline-block;
  text-align: center;
  margin-left: 12px;
  color: #fff;
  line-height: 30px;
  font-size: 14px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: rgba(255, 255, 255, 1);
  cursor: pointer;
  width: 72px;
  height: 30px;
  background: rgba(204, 204, 204, 1);
  border-radius: 4px;
}
.operationnote {
  /deep/.el-dialog {
    min-width: 380px;
    height: 286px;
    border-radius: 5px;
     display: flex;
       flex-direction: column;
       margin:0 !important;
       position:absolute;
       top:50%;
       left:50%;
       transform:translate(-50%,-50%);
    .el-dialog__header {
      text-align: left;
      height: 43px !important;
      border-bottom: 1px solid #eff2f5;
      padding: 10px 19px 12px;
       .el-dialog__title{
      font-size:16px !important;
      }
       .el-dialog__headerbtn{
           position: absolute;
    top: 15px;
    right: 20px;
    padding: 0;
    background: 0 0;
    border: none;
    outline: 0;
    cursor: pointer;
    font-size: 16px;
      }
    }
    /deep/.el-dialog__body {
      text-align: initial;
      padding: 24px 6% 25px 6%;
      .el-myclass {
        padding-left: 32px;
        height: 65px !important;
        /deep/ .el-form-item__label {
          padding: 0 8px 0 0;
          text-align: left;
        }
        /deep/.el-input__inner {
          // background-color: #f00;
          width: 88% !important;
          height: 32px !important;
          border: 1px solid rgba(210, 210, 210, 1) !important;
          border-radius: 4px !important;
          color: #333333;
          padding: 0px 7px;
          cursor: default;
        }
      }
    }
    .footer-class {
      // background-color: #f00;
      cursor: pointer;
      height: 30px;
      display: flex;
      justify-content: center;
      margin-top: 101px;
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
    .el-form-item {
      margin-bottom: 0;
      height: 50px !important;
    }
  }
}
.units {
  position: absolute;
  right: 19%;
}
.yanzheng {
  color: #ff0000;
  font-size: 14px;
  margin-left: 90px;
  margin-top: 2px;
  width: 300px;
  line-height: 8px !important;
  height: 20px;
}
 /deep/.el-table{
   /deep/.el-table__body-wrapper{
     /deep/tbody{
       /deep/tr{
        height: 60px !important;
      }
    }
  }
    /deep/.el-table__header-wrapper{
     /deep/.has-gutter{
       /deep/tr{
        height: 60px !important;
      }
    }
  }
}
</style>
