<template>
  <div class="hard-setparamClass">
    <div class="setparam-container">
      <el-card class="box-card">
        <div class="kuang">
          <span>
            <el-button class="newadd" v-if="addcar" type="text" @click="addor">新增特殊车辆</el-button>
          </span>
          <span>
            <el-button v-if="back" class="newadds" type="text" @click="clear">返回上一级</el-button>
          </span>
          <div>
            <span>
              <input
                class="search"
                v-if="!back"
                v-model="searchForm.orderNo"
                type="text"
                @keyup.enter="searchfrom"
                placeholder="请输入搜索内容"
              />
            </span>
            <span class="btn" @click="searchfrom" v-if="!back">
              <svg-icon icon-class="search1" />
            </span>
          </div>
        </div>
        <el-table :data="tableData" style="width: 100%" empty-text="暂无数据">
          <el-table-column prop="vehicle_car_number" label="车牌号" min-width="280" />
          <el-table-column prop="vehicle_name" label="车主姓名" min-width="280" />
          <el-table-column prop="vehicle_phone" label="联系电话" min-width="280"></el-table-column>
          <el-table-column prop="centons" label="备注" min-width="280" class="remark"></el-table-column>
          <el-table-column label="使用状态" min-width="280">
            <template slot-scope="scope">
              <span :class="{active:scope.row.state===2}">{{scope.row.state===1?"已启用":'已禁用' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="180">
            <template slot-scope="scope">
              <el-button class="el-btn11" type="text" @click="compile(scope.row)" v-if="xuigai">修改</el-button>
              <el-button
                v-show="qyjy"
                class="el-btn22"
                v-if="scope.row.state===1"
                type="text"
                @click="forbidden(scope.row)"
              >禁用</el-button>
              <el-button
                v-show="qyjy"
                class="el-btn33"
                v-if="scope.row.state===2"
                type="text"
                @click="open(scope.row)"
              >启用</el-button>
              <el-button v-if="openmn" class="el-btn44" type="text" @click="del(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
      <!-- 分页 -->
      <div class="block">
        <p class="record-data">共 {{ pageNums }}页,共 {{ totalPage }}条</p>
        <el-pagination
          background
          :page-size="10"
          layout="prev, pager, next, jumper"
          :total="totalPage"
          :current-page.sync="currentPage"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
    <!-- 新增特殊车辆 -->
    <el-dialog
      title="新增特殊车辆"
      :visible.sync="centerDialogVisible1"
      :append-to-body="true"
      center
      class="specialvehicles"
      top="35vh"
      :close-on-click-modal="false"
      width="26.04%"
     >
      <el-form
        :label-position="labelPosition"
        label-width="80px"
        :model="Specialvehicle"
        class="el-myclass"
        ref="Specialvehicle"
        hide-required-asterisk
      >
        <el-form-item label="车牌号:">
          <el-input
          type="text"
            class="form_item"
            v-model="Specialvehicle.vehicle_car_number"
            @keydown.native.enter="submitForm"
            autocomplete="off"
          ></el-input>
        </el-form-item>

        <div class="yanzheng">
          <div><span v-show="yzheng">请输入车牌号</span><span v-show="zengze">请输入正确的车牌号</span><span v-show="zengze2">车牌号已存在</span></div>
        </div>
        <el-form-item label="车主姓名:">
          <el-input
            v-model="Specialvehicle.vehicle_name"
            @keydown.native.enter="submitForm"
            autocomplete="off"
          ></el-input>
        </el-form-item>

        <div class="yanzheng">
          <div v-show="yzheng1">请输入车主姓名</div>
        </div>
        <el-form-item label="联系电话:">
          <el-input
            oninput="value=value.replace(/[^\d]/g,'')"
            v-model.number="Specialvehicle.vehicle_phone"
            @keydown.native.enter="submitForm"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <div class="yanzheng">
          <div><span v-show="yzheng2">请输入联系电话</span><span v-show="zengze1">请输入正确的电话号码</span></div>
        </div>
        <el-form-item label="备注:" class="input_two">
          <el-input
            v-model="Specialvehicle.centons"
            @keydown.native.enter="submitForm"
            autocomplete="off"
            class="input textarea"
            rows="4"
            type="textarea"
          ></el-input>
        </el-form-item>
      </el-form>
      <div class="footer-class">
        <span @click="submitForm">确认</span>
      </div>
    </el-dialog>
    <!-- 修改特殊车辆 -->
    <el-dialog
      title="修改特殊车辆"
      :visible.sync="Modification"
      :append-to-body="true"
      center
      class="specialvehicles"
      top="35vh"
      :close-on-click-modal="false"
      width="26.04%"
     >
      <el-form
        :label-position="labelPosition"
        label-width="80px"
        :model="Modificationcar"
        class="el-myclass"
        ref="addCartype"
        hide-required-asterisk
      >
        <el-form-item label="车牌号:">
          <el-input
            class="form_item"
            v-model="Modificationcar.vehicle_car_number"
            @keydown.native.enter="affirm"
            autocomplete="off"
          ></el-input>
        </el-form-item>

        <div class="yanzheng">
          <div><span v-show="yzheng">请输入车牌号</span><span v-show="zengze">请输入正确的车牌号</span><span v-show="zengze3">车牌号已存在</span></div>
        </div>
        <el-form-item label="车主姓名:">
          <el-input
            v-model="Modificationcar.vehicle_name"
            @keydown.native.enter="affirm"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <div class="yanzheng">
          <div v-show="yzheng1">请输入车主姓名</div>
        </div>
        <el-form-item label="联系电话:">
          <el-input
            oninput="value=value.replace(/[^\d]/g,'')"
            v-model.number="Modificationcar.vehicle_phone"
            @keydown.native.enter="affirm"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <div class="yanzheng">
          <div><span v-show="yzheng2">请输入联系电话</span><span v-show="zengze1">请输入正确的电话号码</span></div>
        </div>
        <el-form-item label="备注:" class="input_two">
          <el-input
            v-model="Modificationcar.centons"
            @keydown.native.enter="affirm"
            autocomplete="off"
            class="input textarea"
            rows="4"
            type="textarea"
          ></el-input>
        </el-form-item>
      </el-form>
      <div class="footer-class">
        <span @click="affirm">确认</span>
      </div>
    </el-dialog>
    <!-- 启用 -->
    <el-dialog
      title="提示"
      :visible.sync="remindercar"
      :append-to-body="true"
      center
      class="reminder"
      top="35vh"
      :close-on-click-modal="false"
      width="380px"
     >
      <div class="footer-one">
        <p>是否启用该特殊车辆？</p>
      </div>
      <div class="footer-class">
        <span class="one" @click="cancel">取消</span>
        <span class="two" @click="minitab">确认</span>
      </div>
    </el-dialog>
    <!-- 禁用 -->
    <el-dialog
      title="提示"
      :visible.sync="forbiddencar"
      :append-to-body="true"
      center
      class="reminder"
      top="35vh"
      :close-on-click-modal="false"
      width="380px"
     >
      <div class="footer-one">
        <p>是否禁用该特殊车辆？</p>
      </div>
      <div class="footer-class">
        <span class="one" @click="cancel">取消</span>
        <span class="two" @click="minitabone">确认</span>
      </div>
    </el-dialog>
    <!-- 删除 -->
    <el-dialog
      title="提示"
      :visible.sync="remove"
      :append-to-body="true"
      center
      class="reminder"
      top="35vh"
      :close-on-click-modal="false"
      width="380px"
     >
      <div class="footer-one">
        <p>是否删除该特殊车辆？</p>
      </div>
      <div class="footer-class">
        <span class="one" @click="cancel">取消</span>
        <span class="two" @click="minitabtwo">确认</span>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { Message } from "element-ui";
import { postSelect_button } from "@/api/Jurisdiction1";
import {
  addspecialcar,
  specialcarlist,
  amendcarlist,
  deletecar,
  searchList,
  startusing
} from "@/api/parkCar";
// data数据
export default {
  components: {},
  data () {
    return {
      zengze3:false,
      zengze2:false,
      zengze:false,
      zengze1:false,
      xuigai: false,//修改
      yzheng: false,
      yzheng1: false,
      yzheng2: false,
      remove: false,
      forbiddencar: false,
      remindercar: false,
      tableData: [],
      back: false,
      userInfoList: {}, //localStorage的userInfo
      pageNums: 1, //总页数
      totalPage: null, //总条数
      disabled: true,
      labelPosition: "right",
      park_id: null, //停车场id
      parkid: "",
      currentPage: 1, // 当前页
      pageSize: 10, // 当前页条数
      centerDialogVisible1: false, //新增特殊车辆
      Modification: false, //修改特殊车辆
      id: "", //列表唯一id
      state: "", //状态1启用2禁用
      //修改车辆
      Modificationcar: {
        vehicle_car_number: "", //车牌号
        vehicle_name: "", //姓名
        vehicle_phone: "", //电话
        centons: "" //备注
      },
      //新增车辆
      Specialvehicle: {
        vehicle_car_number: "", //车牌号
        vehicle_name: "", //姓名
        vehicle_phone: "", //电话
        centons: "" //备注
      },
      //查询
      searchForm: {
        orderNo: ""
      },
      addcar: '',//新增特殊车辆id
      openmn: '',//删除
      zengjia: false,//增加
      qyjy: false,
      soushuo: false,
    };
  },
  async created () {
    //获取列表
    const jurisdiction = JSON.parse(localStorage.getItem("RouterLists"));
    const user = JSON.parse(localStorage.getItem("userInfo"));
    this.parkid = user.Communityid;
    this.park_id = user.Communityid;
    //console.log(user.list );
    this.parkList();

    // 拉取用户信息按钮权限
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'))
    const { Communityid, uid } = this.userInfo
    const auth_id = this.$route.meta.auth_id
    const { data } = await postSelect_button({ Communityid, uid, auth_id })
    console.log(data);
    data.forEach(v => {
      if (v.auth_name === "新增特殊车辆") {
        this.zengjia = true;
        this.addcar = this.zengjia;
      }
      if (v.auth_name === "修改") {
        this.xuigai = true;
      }
      if (v.auth_name === "删除") {
        this.openmn = true;
      }
      if (v.auth_name === "启用禁用") {
        this.qyjy = true;
      }
    })
  },
  methods: {
    // 分页设置
    handleCurrentChange (val) {
      this.currentPage = val;
      this.parkList();
    },
    //编辑
    compile (row) {
      this.Modification = true;
      let {
        id,
        vehicle_name,
        vehicle_phone,
        vehicle_car_number,
        centons
      } = row;
      this.id = id;
      this.Modificationcar.vehicle_name = vehicle_name;
      this.Modificationcar.vehicle_phone = Number(vehicle_phone);
      this.Modificationcar.vehicle_car_number = vehicle_car_number;
      this.Modificationcar.centons = centons;
    },
    //确认编辑
    async affirm () {
       var phoneReg = /^1[34578]\d{9}$/;
      var carNumberReg = /^(([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z](([0-9]{5}[DF])|([DF]([A-HJ-NP-Z0-9])[0-9]{4})))|([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z][A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳使领]))$/;
      if (!this.Modificationcar.vehicle_car_number) {
        this.yzheng = true
        setTimeout(() => {
          this.yzheng = false
        }, 2000)
      } else if (!this.Modificationcar.vehicle_name) {
        this.yzheng1 = true
        setTimeout(() => {
          this.yzheng1 = false
        }, 2000)
      } else if (!this.Modificationcar.vehicle_phone) {
        this.yzheng2 = true
        setTimeout(() => {
          this.yzheng2 = false
        }, 2000)
      } else if (this.Modificationcar.vehicle_name && this.Modificationcar.vehicle_phone && this.Modificationcar.vehicle_car_number) {
                 this.Modificationcar.vehicle_car_number=this.Modificationcar.vehicle_car_number.toUpperCase()
           if(!carNumberReg.test(this.Modificationcar.vehicle_car_number)){
             this.zengze = true
        setTimeout(() => {
          this.zengze = false
        }, 2000)
        }else if(!phoneReg.test(this.Modificationcar.vehicle_phone)){
             this.zengze1 = true
              setTimeout(() => {
                this.zengze1 = false
              }, 2000)
              }else{
                     // console.log(this.amendCartype);
        let res = await amendcarlist({
          vehicle_name: this.Modificationcar.vehicle_name,
          vehicle_phone: this.Modificationcar.vehicle_phone,
          vehicle_car_number: this.Modificationcar.vehicle_car_number,
          centons: this.Modificationcar.centons,
          id: this.id
        });
        //console.log(msg);
        if (res.msg === 1) {
          this.Modification = false;
          this.parkList();
          Message({
            type: "success",
            message: "修改成功"
          });
        } else if(res.data==="当前数据未做修改") {
          // 失败
          this.$message({
                  message: "您未修改任何内容或修改失败",
                  type: "warning"
                })
           this.Modification = false;
        }
        else if (res.data==="有相同的车牌号"){
           this.zengze3 = true
              setTimeout(() => {
                this.zengze3 = false
              }, 2000)
        }
        else{
           Message.error("修改失败");
           this.Modification = false;
        }
                 }
      }
    },
    //新增弹框打开
    addor () {
      this.Specialvehicle = {}
      this.centerDialogVisible1 = true;

    },
    //新增提交
    async submitForm () {
      var phoneReg = /^1[34578]\d{9}$/;
      var carNumberReg = /^(([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z](([0-9]{5}[DF])|([DF]([A-HJ-NP-Z0-9])[0-9]{4})))|([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z][A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳使领]))$/
      if (!this.Specialvehicle.vehicle_car_number) {
        this.yzheng = true
        setTimeout(() => {
          this.yzheng = false
        }, 2000)
      }
       else if (!this.Specialvehicle.vehicle_name) {
        this.yzheng1 = true
        setTimeout(() => {
          this.yzheng1 = false
        }, 2000)
      } else if (!this.Specialvehicle.vehicle_phone) {
        this.yzheng2 = true
        setTimeout(() => {
          this.yzheng2 = false
        }, 2000)
      }
       else if (this.Specialvehicle.vehicle_name && this.Specialvehicle.vehicle_phone && this.Specialvehicle.vehicle_car_number) {
             this.Specialvehicle.vehicle_car_number=this.Specialvehicle.vehicle_car_number.toUpperCase()
        if(!carNumberReg.test(this.Specialvehicle.vehicle_car_number)){
             this.zengze = true
        setTimeout(() => {
          this.zengze = false
        }, 2000)
        }else if(!phoneReg.test(this.Specialvehicle.vehicle_phone)){
             this.zengze1 = true
              setTimeout(() => {
                this.zengze1 = false
              }, 2000)
              }else{
             
        let data = await addspecialcar({
          vehicle_name: this.Specialvehicle.vehicle_name,
          vehicle_phone: this.Specialvehicle.vehicle_phone,
          vehicle_car_number: this.Specialvehicle.vehicle_car_number,
          park_id: this.park_id,
          centons: this.Specialvehicle.centons
        });
        //console.log(obj);
        if (data.msg === 1) {
          this.centerDialogVisible1 = false;
          // 再此获取列表
          this.parkList();
          Message({
            type: "success",
            message: "添加成功"
          });
        } else if(data.data==="当前车牌号已经是特殊车辆了"){
            this.zengze2=true;
            setTimeout(()=>{
                this.zengze2=false;
            },2000)
        }
         else{
          // 失败
          Message.error("添加失败");
        }
              }
      }
    },
    //禁用弹框
    forbidden (row) {
      this.forbiddencar = true;
      let { id } = row;
      this.id = id;
    },
    //启用弹框
    open (row) {
      this.remindercar = true;
      let { id } = row;
      this.id = id;
    },
    //取消
    cancel () {
      this.remindercar = false;
      this.forbiddencar = false;
      this.remove = false;
    },
    //启用
    async minitab () {
      let { msg } = await startusing({
        type: 1,
        id: this.id
      });
      console.log(msg);
      if (msg === 1) {
        this.remindercar = false;
        this.parkList();
        Message({
          type: "success",
          message: "启用成功"
        });
      } else {
        // 失败
        Message.error("启用失败");
      }
    },
    //禁用
    async minitabone () {
      console.log(this.id);
      let { msg } = await startusing({
        type: 2,
        id: this.id
      });
      console.log(msg);
      if (msg === 1) {
        this.forbiddencar = false;
        this.parkList();
        Message({
          type: "success",
          message: "禁用成功"
        });
      } else {
        // 失败
        Message.error("禁用失败");
      }
    },
    //删除
    del (row) {
      this.remove = true;
      let { id } = row;
      this.id = id;
    },
    //删除确认
    async minitabtwo () {
      let { msg } = await deletecar({
        id: this.id
      });
      console.log(msg);
      if (msg === 1) {
        this.remove = false;
        this.parkList();
        Message({
          type: "success",
          message: "删除成功"
        });
      } else {
        // 失败
        Message.error("删除失败");
      }
    },
    //查询
    async searchfrom () {
      //console.log(this.searchForm.orderNo);
      if (this.searchForm.orderNo) {
        let { data } = await searchList({
          page: this.currentPage,
          size: this.pageSize,
          parkid: this.parkid,
          name: this.searchForm.orderNo
        });
        console.log(data);
        if (data.total) {
          this.tableData = data.data;
          this.totalPage = data.total; // 总条数
          this.pageNums = data.pageNum; //总页数
          this.back = true;
          this.addcar = false;
        } else {
          Message.error("没有找到你想要的内容");
          this.searchForm.orderNo = "";
        }
      }
      //  date=obj.data
      //   date.foreach(v=>{
      //     console.log(v);

      //   })
    },
    //获取列表
    async parkList () {
      const { data } = await specialcarlist({
        page: this.currentPage,
        size: this.pageSize,
        parkid: this.parkid
      });
      if (!data.data.length && this.currentPage !== 1) {
        //如果当前页没有数据并且当前页码不是第一页
        this.currentPage--;
        this.parkList();
      }
      this.tableData = data.data;
      this.totalPage = data.total; // 总条数
      this.pageNums = data.pageNum; //总页数
      console.log(data);
    },
    //清除
    clear () {
      this.tableData = [];
      this.back = false;
      this.parkList();
      this.searchForm.orderNo = ''
      this.addcar = this.zengjia;
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
      line-height: 30px !important;
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

.newadd {
  display: inline-block;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  width: 100px;
  height: 30px;
  line-height: 0px;
  background: rgba(37, 186, 217, 1);
  border-radius: 4px;
  font-size: 14px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: rgba(255, 255, 255, 1);
  cursor: pointer;
}
.kuang {
  height: 32px;
  position: relative;
}
.newadds {
  display: inline-block;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  width: 100px;
  height: 30px;
  line-height: 0px;
  background: rgba(37, 186, 217, 1);
  border-radius: 4px;
  font-size: 14px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: rgba(255, 255, 255, 1);
  cursor: pointer;
  position: absolute;
  top: 0px;
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
/deep/.el-table .cell {
  height: 30px !important;
  line-height: 30px;
  overflow: hidden; /*超出部分隐藏*/
  text-overflow: ellipsis; /* 超出部分显示省略号 */
  white-space: nowrap; /*规定段落中的文本不进行换行 */
  width: 250px; /*需要配合宽度来使用*/
}
.el-btn11 {
  display: inline-block;
  text-align: center;
  color: #fff;
  width: 52px;
  height: 30px;
  line-height: 5px;
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
  margin-left: 8px;
  color: #fff;
  line-height: 5px;
  font-size: 14px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: rgba(255, 255, 255, 1);
  cursor: pointer;
  width: 52px;
  height: 30px;
  background: #fa5c5c;
  border-radius: 4px;
}
.el-btn33 {
  margin-left: 8px;
  display: inline-block;
  text-align: center;
  color: #fff;
  width: 52px;
  height: 30px;
  line-height: 5px;
  background: #46c346;
  border-radius: 4px;
  font-size: 14px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: rgba(255, 255, 255, 1);
  cursor: pointer;
}
.el-btn44 {
  display: inline-block;
  text-align: center;
  margin-left: 8px;
  color: #fff;
  line-height: 5px;
  font-size: 14px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: rgba(255, 255, 255, 1);
  cursor: pointer;
  width: 52px;
  height: 30px;
  background: rgba(204, 204, 204, 1);
  border-radius: 4px;
}

.units {
  position: absolute;
  right: 42px;
}
.specialvehicles {
  /deep/.el-dialog {
    min-width: 380px;
    height: 416px;
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
      .el-dialog__title {
        font-size: 16px !important;
      }
      .el-dialog__headerbtn {
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
      padding: 24px 8px 25px 8px;
      .el-myclass {
        padding-left: 13%;
        height: 65px !important;
        /deep/ .el-form-item__label {
          padding: 0 8px 0 0;
          text-align: left;
        }
        /deep/.el-input__inner {
          // background-color: #f00;
          width: 79% !important;
          height: 32px !important;
          border: 1px solid rgba(210, 210, 210, 1) !important;
          border-radius: 4px !important;
          color: #333333;
          padding: 0px 7px;
        }
        .form_item{
          /deep/.el-input__inner{
            text-transform:uppercase;
          }
        }
      }
    }
    .footer-class {
      // background-color: #f00;
      cursor: pointer;
      height: 30px;
      display: flex;
      justify-content: center;
      margin-top: 230px;
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
      margin-bottom: 2px;
      height: 40px !important;
      .el-form-item__error {
        padding-top: 0px !important;
      }
    }
    .input_two {
      .el-form-item__content {
        .el-input {
          .el-input__inner {
            height: 88px !important;
            vertical-align: text-top !important;
          }
        }
        .textarea {
          margin-top: 2px;
          .el-textarea__inner {
            font-family: "Microsoft" !important;
            font-size: 14px !important;
            // overflow-y: scroll;
            width: 79%;
            height: 88px;
            margin-top: 2px;
          }
          .el-textarea__inner:focus {
            border-color: #d2d2d2;
          }
        }
      }
    }
  }
}
.search {
  width: 177px !important;
  height: 30px !important;
  position: absolute;
  top: 0px;
  right: 24px;
  float: left;
  width: 155px;
  background: rgba(255, 255, 255, 1);
  border-right: none;
  outline: none;
  flex: 7;
  padding-left: 7px;
  border: 1px solid rgba(210, 210, 210, 1) !important;
  font-size: 14px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  border-radius: 3px 0 0 3px !important;
  color: #333;
  &::-webkit-input-placeholder {
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    // color: rgba(153, 153, 153, 1);
    color: #999999 !important;
    // padding: 0 0 20px 0;
  }
  &::-moz-placeholder {
    font-size: 10px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: rgba(153, 153, 153, 1);
  }
}
.btn {
  display: inline-block;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  width: 24px;
  height: 30px;
  line-height: 5px;
  background: rgba(204, 204, 204, 1);
  border-radius: 0px 3px 3px 0px;
  font-size: 14px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: rgba(255, 255, 255, 1);
  cursor: pointer;
  position: absolute;
  right: 0px;
  top: 0px;
}

.active {
  color: red;
}
.reminder {
  /deep/.el-dialog {
    min-width: 380px;
    height: 210px;
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
      padding: 12px 19px 12px;
      .el-dialog__title {
        font-size: 16px !important;
      }
      .el-dialog__headerbtn {
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
      //padding: 24px 25px 25px 0px;
      padding: 0px;
      .el-myclass {
        padding-left: 55px;
        height: 65px !important;
        /deep/ .el-form-item__label {
          padding: 0 8px 0 0;
          text-align: left;
        }
        /deep/.el-input__inner {
          // background-color: #f00;
          width: 266px !important;
          height: 32px !important;
          border: 1px solid rgba(210, 210, 210, 1) !important;
          border-radius: 4px !important;
          color: #333333;
          padding: 0px 7px;
        }
      }
    }
    .footer-one {
      width: 380px;
      height: 112px;
      display: flex;
      justify-content: center;
      align-items: center;
      p {
        font-size: 16px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: rgba(102, 102, 102, 1);
      }
    }
    .footer-class {
      // background-color: #f00;
      cursor: pointer;
      height: 30px;
      display: flex;
      justify-content: center;

      .two {
        width: 72px;
        height: 30px;
        border-radius: 4px;
        background-color: #25bad9;
        border-color: #25bad9;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #fff;
        margin-left: 98px;
      }
      .one {
        width: 72px;
        height: 30px;
        border-radius: 4px;
        background-color: #ffffff;
        border: 1px solid rgba(204, 204, 204, 1);
        display: flex;
        justify-content: center;
        align-items: center;
        color: #999999;
      }
    }
    .el-form-item {
      margin-bottom: 0;
      height: 50px !important;
    }
  }
}
.el-button--text {
  color: #ffffff;
}
.yanzheng {
  color: #ff0000;
  font-size: 14px;
  top:-3px;
  margin-left: 80px;
  width: 300px;
  line-height: 15px;
  height: 16px;
}
/deep/.el-table {
  /deep/.el-table__body-wrapper {
    /deep/tbody {
      /deep/tr {
        height: 60px !important;
      }
    }
  }
  /deep/.el-table__header-wrapper {
    /deep/.has-gutter {
      /deep/tr {
        height: 60px !important;
      }
    }
  }
}
</style>
