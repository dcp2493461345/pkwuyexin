<template>
  <div class="hard-setparamClass">
    <div class="setparam-container">
      <el-card class="box-card">
        <span id="newadd" @click="addDoor" v-if="add">添加收费项目</span>
        <el-table :data="tableData" style="width: 100%" empty-text="暂无数据">
          <el-table-column prop="Charge_name" label="收费名称" min-width="150" />
          <el-table-column  label="收费项目" min-width="150" > 
            <template slot-scope="scope">
              <span>{{ scope.row.Charge_type===2?"其他":'押金'  }}</span>
            </template>
          </el-table-column>
          <el-table-column  label="收费类型" min-width="150" >
             <template slot-scope="scope">
              <span v-if="scope.row.type_inate==1">按价格收费</span>
              <span v-if="scope.row.type_inate==2">按数量收费</span>
              <span v-if="scope.row.type_inate==3">按天收费</span>
              <span v-if="scope.row.type_inate==4">按月收费</span>
              <span v-if="scope.row.type_inate==5">按年收费</span>
            </template>
          </el-table-column>
          <el-table-column  label="收费价格" min-width="150" >
             <template slot-scope="scope">
              <span v-if="scope.row.type_inate==1">{{scope.row.money }} 元</span>
              <span v-if="scope.row.type_inate==2">{{scope.row.money }} 元/个</span>
              <span v-if="scope.row.type_inate==3">{{scope.row.money }} 元/天</span>
              <span v-if="scope.row.type_inate==4">{{scope.row.money }} 元/月</span>
              <span v-if="scope.row.type_inate==5">{{scope.row.money }} 元/年</span>
            </template>
          </el-table-column>
          <el-table-column prop="conten" label="备注" min-width="150" />
          <el-table-column label="操作" min-width="200">
            <template slot-scope="scope">
              <span class="el-btn11" @click="compile(scope.row)" v-if="compiless">修改</span>
              <span class="el-btn33" @click="removess(scope.row)" v-if="compiless">删除</span>
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
      title="添加收费项目"
      :visible.sync="centerDialogVisible1"
      :append-to-body="true"
      center
      class="chen"
      top="35vh"
      :close-on-click-modal="false"
      width="450px"
      >
      <el-form
        ref="addCartype"
        :label-position="labelPosition"
        label-width="110px"
        :model="addcharge"
        class="el-myclass"
        hide-required-asterisk
       >
        <el-form-item label="收费名称:">
          <el-input
            v-model="addcharge.Charge_name"
            class="form_item"
            autocomplete="off"
            @keydown.native.enter="submitForm"
            placeholder="请输入收费名称"
          />
        </el-form-item>
        <div class="yanzheng">
          <div><span v-show="yzheng">请输入收费名称</span>
          <span v-show="yzheng4">收费名称已存在</span>
          </div>
        </div>
          <el-form-item label="选择收费项目：">
            <el-radio-group v-model="addcharge.Charge_type">
            <el-radio label="1"  @change="change3">押金</el-radio>
            <el-radio label="2" @change="change">其他</el-radio>
            </el-radio-group>
        </el-form-item>
          <el-form-item label="" v-if="addcharge.Charge_type!='2'">
            <el-checkbox-group v-model="addcharge.Margin">
            <el-checkbox label="2" name="type">是否是装修保证金？(关联房屋装修状态)</el-checkbox>
            </el-checkbox-group>
             <!-- <el-checkbox v-model="addcharge.Margin">是否是装修保证金？(关联房屋装修状态)</el-checkbox> -->
        </el-form-item>
          <el-form-item label="选择收费类型：" v-if="addcharge.Charge_type==='1'">
            <el-radio-group v-model="addcharge.type_inate">
            <el-radio label="1">按价格收费</el-radio>
            <el-radio label="2">按数量收费</el-radio>
            </el-radio-group>
        </el-form-item>
         <el-form-item label="选择收费类型：" v-if="addcharge.Charge_type==='2'">
            <el-radio-group v-model="addcharge.type">
            <el-radio label="1"  @change="change1">按单次收费</el-radio>
            <el-radio label="2"  @change="change2">按连续收费</el-radio>
            </el-radio-group>
        </el-form-item>
      <el-form-item label="" v-if="addcharge.type==='1'&&addcharge.Charge_type==='2'">
            <el-radio-group v-model="addcharge.type_inate">
            <el-radio label="1">按价格收费</el-radio>
            <el-radio label="2">按数量收费</el-radio>
            </el-radio-group>
        </el-form-item>
        <el-form-item label="" class="raido_dcp" v-if="addcharge.type==='2'&&addcharge.Charge_type==='2'">
            <el-radio-group v-model="addcharge.type_inate">
            <el-radio label="3">按天收费</el-radio>
            <el-radio label="4">按月收费</el-radio>
            <el-radio label="5">按年收费</el-radio>
            </el-radio-group>
        </el-form-item>
        <el-form-item label="收费金额:">
          <el-input
            v-model="addcharge.money"
            class="form_item"
            autocomplete="off"
            @keydown.native.enter="submitForm"
            placeholder="请输入金额"
          />
            <span class="units" v-if="addcharge.type_inate==='1'">元</span>
            <span class="unitss" v-if="addcharge.type_inate==='2'">元/个</span>
            <span class="unitss" v-if="addcharge.type_inate==='3'">元/天</span>
            <span class="unitss" v-if="addcharge.type_inate==='4'">元/月</span>
            <span class="unitss" v-if="addcharge.type_inate==='5'">元/年</span>
        </el-form-item>
        <div class="yanzheng">
          <div><span v-show="yzheng1">请输入收费金额</span></div>
        </div>
          <el-form-item label="">
            <el-checkbox-group v-model="addcharge.info">
            <el-checkbox label="2" name="type">是否关联房屋面积？(收费金额×房屋面积)</el-checkbox>
            </el-checkbox-group>
             <!-- <el-checkbox v-model="addcharge.info">是否关联房屋面积？(收费金额×房屋面积)</el-checkbox> -->
        </el-form-item>
         <el-form-item label="备注:" class="input_two">
          <el-input
            v-model="addcharge.conten"
            @keydown.native.enter="submitForm"
            autocomplete="off"
            class="input textarea"
            rows="4"
            type="textarea"
          ></el-input>
        </el-form-item>
      </el-form>
      <div class="footer-class">
        <span @click="submitForm">确认添加</span>
      </div>
    </el-dialog>
    <!-- 修改车位类型 -->
     <el-dialog
      title="修改收费项目"
      :visible.sync="Modifyparkingspacetype"
      :append-to-body="true"
      center
      class="chen"
      top="35vh"
      :close-on-click-modal="false"
      width="450px"
      >
      <el-form
        ref="addCartype"
        :label-position="labelPosition"
        label-width="110px"
        :model="amendcharge"
        class="el-myclass"
        hide-required-asterisk
       >
        <el-form-item label="收费名称:">
          <el-input
            v-model="amendcharge.Charge_name"
            class="form_item"
            autocomplete="off"
            @keydown.native.enter="submit"
            placeholder="请输入收费名称"
          />
        </el-form-item>
        <!-- <div class="yanzheng">
          <div><span v-show="yzheng">请输入车位类型</span><span v-show="cunzai">车位类型已存在</span></div>
        </div> -->
            <div class="yanzheng">
          <div><span v-show="yzheng2">请输入收费名称</span>
          <span v-show="yzheng5">收费名称已存在</span>
          </div>
        </div>
          <el-form-item label="选择收费项目：">
            <el-radio-group v-model="amendcharge.Charge_type">
            <el-radio label="1" @change="change3">押金</el-radio>
            <el-radio label="2" @change="change">其他</el-radio>
            </el-radio-group>
        </el-form-item>
          <el-form-item label="" v-if="amendcharge.Charge_type!='2'">
            <el-checkbox-group v-model="amendcharge.Margin">
            <el-checkbox label="2" name="type">是否是装修保证金？(关联房屋装修状态)</el-checkbox>
            </el-checkbox-group>
             <!-- <el-checkbox v-model="amendcharge.Margin">是否是装修保证金？(关联房屋装修状态)</el-checkbox> -->
        </el-form-item>
          <el-form-item label="选择收费类型：" v-if="amendcharge.Charge_type==='1'">
            <el-radio-group v-model="amendcharge.type_inate">
            <el-radio label="1">按价格收费</el-radio>
            <el-radio label="2">按数量收费</el-radio>
            </el-radio-group>
        </el-form-item>
         <el-form-item label="选择收费类型：" v-if="amendcharge.Charge_type==='2'">
            <el-radio-group v-model="amendcharge.type">
            <el-radio label="1"  @change="change1">按单次收费</el-radio>
            <el-radio label="2"  @change="change2">按连续收费</el-radio>
            </el-radio-group>
        </el-form-item>
      <el-form-item label="" v-if="amendcharge.type==='1'&&amendcharge.Charge_type==='2'">
            <el-radio-group v-model="amendcharge.type_inate">
            <el-radio label="1">按价格收费</el-radio>
            <el-radio label="2">按数量收费</el-radio>
            </el-radio-group>
        </el-form-item>
        <el-form-item label="" class="raido_dcp" v-if="amendcharge.type==='2'&&amendcharge.Charge_type==='2'">
            <el-radio-group v-model="amendcharge.type_inate">
            <el-radio label="3">按天收费</el-radio>
            <el-radio label="4">按月收费</el-radio>
            <el-radio label="5">按年收费</el-radio>
            </el-radio-group>
        </el-form-item>
        <el-form-item label="收费金额:">
          <el-input
            v-model="amendcharge.money"
            class="form_item"
            autocomplete="off"
            @keydown.native.enter="submit"
            placeholder="请输入金额"
          />
            <span class="units" v-if="amendcharge.type_inate==='1'">元</span>
            <span class="unitss" v-if="amendcharge.type_inate==='2'">元/个</span>
            <span class="unitss" v-if="amendcharge.type_inate==='3'">元/天</span>
            <span class="unitss" v-if="amendcharge.type_inate==='4'">元/月</span>
            <span class="unitss" v-if="amendcharge.type_inate==='5'">元/年</span>
        </el-form-item>
            <div class="yanzheng">
          <div><span v-show="yzheng3">请输入收费金额</span></div>
        </div>
          <el-form-item label="">
            <el-checkbox-group v-model="amendcharge.info">
            <el-checkbox label="2" name="type">是否关联房屋面积？(收费金额×房屋面积)</el-checkbox>
            </el-checkbox-group>
             <!-- <el-checkbox v-model="amendcharge.info">是否关联房屋面积？(收费金额×房屋面积)</el-checkbox> -->
        </el-form-item>
         <el-form-item label="备注:" class="input_two">
          <el-input
            v-model="amendcharge.conten"
            @keydown.native.enter="submit"
            autocomplete="off"
            class="input textarea"
            rows="4"
            type="textarea"
          ></el-input>
        </el-form-item>
      </el-form>
      <div class="footer-class">
        <span @click="submit">确认修改</span>
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
        <p>是否删除该收费项目？</p>
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
import moment from "moment";
import {  chargeList,addcharge,removelist,xiugaixm } from "@/api/wycharge";
import { postSelect_button } from "@/api/Jurisdiction1";
// data数据
export default {
  components: {},
  data() {
    return {
      remove:false,
      add:true,
      compiless:true,
      czjl:true,
      yzheng:false,
      yzheng1:false,
      yzheng2:false,
      yzheng3:false,
      yzheng4:false,
      yzheng5:false,
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
      // 新增收费项目
      addcharge: {
        Charge_name: "",//收费名称
        Charge_type	: "1",//收费项目
        Margin:"",//是否是装修保证金
        type:'',//收费方式
        type_inate:'1',//收费类型
        info:"",//是否关联房屋
        conten:'',//备注
        money:'',//收费价格
      },
      // 修改收费项目
      amendcharge: {
       Charge_name: "",//收费名称
        Charge_type	: "1",//收费项目
        Margin:null,//是否是装修保证金
        type:'',//收费方式
        type_inate:'1',//收费类型
        info:null,//是否关联房屋
        conten:'',//备注
        money:'',//收费价格
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
      park_id: "",
      uname:'',
      Feesid:''
    };
  },
 
  async created() {
    const user = JSON.parse(localStorage.getItem("userInfo"));
    this.parkid = user.Communityid;
    this.uid = user.uid;
    this.park_id = user.Communityid;
    this.uname = user.uname
    this.parkList();

    //  // 拉取用户信息 按钮权限判定
    // this.userInfo = JSON.parse(localStorage.getItem('userInfo'))
    // const { Communityid, uid } = this.userInfo
    // const auth_id = this.$route.meta.auth_id
    // const {data}  =   await postSelect_button({Communityid, uid, auth_id})
    // console.log(data);
    // data.forEach(v=>{
    //   if(v.auth_name==="修改"){
    //     this.compiless=true;
    //   }
    //     if(v.auth_name==="操作记录"){
    //     this.czjl=true;
    //   }
    //     if(v.auth_name==="添加收费项目"){
    //     this.add=true;
    //   }
    // })

  },
  methods: {
   change(){
       this.addcharge.Margin=""
       this.addcharge.type_inate="1"
       this.addcharge.type="1"

        this.amendcharge.Margin=""
       this.amendcharge.type_inate="1"
       this.amendcharge.type="1"
   },
    change1(){
       this.addcharge.type_inate="1"
       this.amendcharge.type_inate="1"
   },
    change2(){
       this.addcharge.type_inate="3"
       this.amendcharge.type_inate="3"
   },
     change3(){
      this.addcharge.type="1"
      this.amendcharge.type="1"
   },
    // 分页设置
    handleCurrentChange(val) {
      this.currentPage = val;
      console.log(val);
      this.parkList();
    },
    // 新增提交 
    async submitForm() {
     
       console.log(this.addcharge);
       if(!this.addcharge.Charge_name){
         this.yzheng=true;
         setTimeout(()=>{
           this.yzheng=false;
         },2000)
       }else if (!this.addcharge.money){
          this.yzheng1=true;
         setTimeout(()=>{
           this.yzheng1=false;
         },2000)
       }else {
          
        if(this.addcharge.Margin){
            this.addcharge.Margin="2"
        }
         if(this.addcharge.info){
            this.addcharge.info="1"
        }
          const data =  await addcharge({
          Communityid:this.uid,
          Charge_name:this.addcharge.Charge_name,
          Charge_type:this.addcharge.Charge_type,
          Margin:this.addcharge.Margin,
          type:this.addcharge.type,
          type_inate:this.addcharge.type_inate,
          info:this.addcharge.info,
          conten:this.addcharge.conten,
          money:this.addcharge.money,
          uname:this.uname
      })
       console.log(data);
        if(data.code===200){
             this.centerDialogVisible1=false;
               this.parkList();
                Message({
            type: "success",
            message: "添加成功"
          });
       }else if(data.code===400){
            // 失败
          Message.error("添加失败");
       }else if(data.code===401){
           this.yzheng4=true;
         setTimeout(()=>{
           this.yzheng4=false;
         },2000)
       }
       }
     
    },
    // 修改提交
    async submit() {
       if(!this.amendcharge.Charge_name){
         this.yzheng2=true;
         setTimeout(()=>{
           this.yzheng2=false;
         },2000)
       }else if (!this.amendcharge.money){
          this.yzheng3=true;
         setTimeout(()=>{
           this.yzheng3=false;
         },2000)
       }else {
          
        if(this.amendcharge.Margin){
            this.amendcharge.Margin="2"
        }else{
            this.amendcharge.Margin="1"
        }
         if(this.amendcharge.info){
            this.amendcharge.info="1"
        }else{
            this.amendcharge.info="2"
        }
          const data =  await xiugaixm({
          Feesid:this.Feesid,
          Charge_name:this.amendcharge.Charge_name,
          Charge_type:this.amendcharge.Charge_type,
          Margin:this.amendcharge.Margin,
          type:this.amendcharge.type,
          type_inate:this.amendcharge.type_inate,
          info:this.amendcharge.info,
          conten:this.amendcharge.conten,
          money:this.amendcharge.money,
          uname:this.uname
      })
       console.log(data);
        if(data.code===200){
             this.Modifyparkingspacetype=false;
               this.parkList();
                Message({
            type: "success",
            message: "修改成功"
          });
       }else if (data.code===400){
            // 失败
          this.$message({
                  message: "您未修改任何内容或修改失败",
                  type: "warning"
                })
             this.Modifyparkingspacetype=false;
       }else if(data.code===401){
          this.yzheng5=true;
         setTimeout(()=>{
           this.yzheng5=false;
         },2000)
       }
       }
    },
    // 获取列表
    async parkList() {
      const data  = await chargeList({
        page: this.currentPage,
        size: this.pageSize,
        Communityid: this.parkid
      });
     console.log(data,"11111111");
      if (!data.msg.data.length && this.currentPage !== 1) {
        //如果当前页没有数据并且当前页码不是第一页
        this.currentPage--;
        this.parkList();
      }
      this.tableData = data.msg.data;
      this.totalPage = Number(data.msg.total); // 总条数
      this.pageNums = data.msg.pageNum;
    },
    // 显示新增模态框
    addDoor() {
        this.addcharge = {
        Charge_name: "",//收费名称
        Charge_type	: "1",//收费项目
        Margin:"",//是否是装修保证金
        type:'',//收费方式
        type_inate:'1',//收费类型
        info:"",//是否关联房屋
        conten:'',//备注
        money:''//收费价格
      }
      this.centerDialogVisible1 = true;
      // 去除验证
  
    },
    // 打开修改模态框
    compile(row) {
      console.log(row);
        this.Feesid=row.Feesid
        this.amendcharge.Charge_name=row.Charge_name
        this.amendcharge.Charge_type=row.Charge_type
        this.amendcharge.Charge_type=String(this.amendcharge.Charge_type)
        this.amendcharge.Margin=row.Margin
        if(this.amendcharge.Margin===2){
          this.amendcharge.Margin=true
        }else{
          this.amendcharge.Margin=false
        }
        this.amendcharge.info=row.info
        if(this.amendcharge.info===1){
          this.amendcharge.info=true
        }else{
          this.amendcharge.info=false
        }
        this.amendcharge.type=row.type
        this.amendcharge.type=String(this.amendcharge.type)
        this.amendcharge.type_inate=row.type_inate
        this.amendcharge.type_inate=String(this.amendcharge.type_inate)
        this.amendcharge.money=row.money
        this.amendcharge.conten=row.conten
      this.Modifyparkingspacetype = true;
    },
    //打开删除弹框
    removess(row){
  
    this.Feesid=row.Feesid
    this.remove=true
    },
    //取消
    cancel(){
         this.remove=false;
    },
    //确认删除
    async minitabtwo(){
     const data = await removelist({
           Feesid:this.Feesid
       })
       console.log(data);
       if(data.code===200){
             this.remove=false;
               this.parkList();
                Message({
            type: "success",
            message: "删除成功"
          });
       }else{
            // 失败
          Message.error("删除失败");
       }
    },
    operation(row){
        this.operatingData.name=row.uname
        this.operatingData.time=row.time
        this.operatingData.ip=row.ip
        this.operationnote=true;
    },
    affirm() {
      this.operationnote = false;
    },
 
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
    min-height: 496px;
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
        padding-left: 36px;
        // height: 65px !important;
        /deep/ .el-form-item__label {
          padding: 0 8px 0 0;
          text-align: left;
        }
        /deep/.el-input__inner {
          // background-color: #f00;
          width: 248px !important;
          height: 32px !important;
          border: 1px solid rgba(210, 210, 210, 1) !important;
          border-radius: 4px !important;
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
            width: 248px;
            height: 112px;
            margin-top: 2px;
          }
          .el-textarea__inner:focus {
            border-color: #d2d2d2;
          }
        }
      }
    }
    .el-form-item{
        .el-radio-group{
            .el-radio{
             width:120px;
            }
        }
        .el-checkbox-group{
            .el-checkbox__label{
                width:212px;
                height:12px;
                font-size:12px;
                font-family:Microsoft YaHei;
                font-weight:400;
                color:rgba(153,153,153,1);
            }
            .el-checkbox__inner::after{
                height: 8px;
                left: 4px;
                top: 1px;
                width: 4px
            }
        }
    }
    .raido_dcp{
          .el-radio-group{
            .el-radio{
                height: 24px;
            }
        }
    }
      }
    }
    .footer-class {
        // position: absolute;
      // background-color: #f00;
      cursor: pointer;
      height: 30px;
      display: flex;
      justify-content: center;
      margin-top: 95px;
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
.el-btn33 {
  display: inline-block;
  text-align: center;
  color: #fff;
  margin-left: 8px;
  width: 52px;
  height: 30px;
  line-height: 30px;
  background: rgba(204, 204, 204, 1);
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
  right: 30px;
  font-size:14px;
font-family:Microsoft YaHei;
font-weight:400;
color:rgba(102,102,102,1);
}
.unitss {
    font-size:14px;
font-family:Microsoft YaHei;
font-weight:400;
color:rgba(102,102,102,1);
  position: absolute;
  right: 16px;
}
.yanzheng {
  color: #ff0000;
  font-size: 14px;
  margin-left: 112px;
  margin-top: 2px;
  width: 300px;
  line-height: 8px !important;
  height: 6px;
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
</style>
