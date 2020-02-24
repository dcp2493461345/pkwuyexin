<template>
  <div class="hard-setparamClass">
    <div class="setparam-container">
      <div class="box-header" v-show="isShowExcel">
        <span v-if="!isError" v-show="isShowExcel" class="add-btn" @click="backToLastPage">返回上一级</span>
      </div>
      <el-card class="box-card" v-if="!isShowExcel">
        <!-- 查询 -->
        <!-- 车位列表 -->
        <el-table v-if="!isShowExcel" :data="tableData" style="width: 100%" empty-text="暂无数据">
          <el-table-column prop="user_name" label="申请人" min-width="100"></el-table-column>
          <el-table-column prop="state" label="申请内容" min-width="180" class="remark">
                <template slot-scope="scope">
                    <span>{{scope.row.state===1?'修改' : '删除' }}{{ scope.row.state_car_list}}车位详情</span>
            </template>
          </el-table-column>
          <el-table-column prop="add_time" label="申请时间" min-width="180" class="remark"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button class="el-btn11" v-if="shenhe" type="text" @click="compile(scope.row)">审核</el-button>
              <el-button class="el-btn44" v-if="xiangqing" type="text" @click="handle(scope.row)">车位详情</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
      <!-- 车位详情 -->
      <div v-if="isShowExcel" class="box-card">
        <div class="table-box">
         <el-table  :data="tabledata" style="width: 100%" empty-text="暂无数据">
          <el-table-column prop="car_number" label="车位号" width="200" />
          <el-table-column prop="car_type_name" label="车位类型" width="200" />
          <el-table-column prop="car_price" label="长租车月租(元)" width="200" />
          <el-table-column prop="state" label="车位状态" width="200">
            <template slot-scope="scope">
              <span :class="{active:scope.row.state===1}">{{scope.row.state===1?"未售":'' }}</span>
              <span>{{scope.row.state===2?"已售":'' }}</span>
              <span :class="{actived:scope.row.state===3}">{{scope.row.state===3?"已出租":'' }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="Longplate" label="长租车牌号" width="200"></el-table-column>
          <el-table-column prop="car_house_number" label="关联房屋" width="200" class="remark"></el-table-column>
          <el-table-column prop="centons" label="车位备注" width="350" class="remark"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button class="el-btn55" type="text" v-if="caozuo"  @click="handless(scope.row)">操作记录</el-button>
            </template>
          </el-table-column>
        </el-table>
        </div>
      </div>
      <!-- 分页 -->
      <div class="block" v-show="!isShow" >
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
    <!-- 确认删除 -->
    <el-dialog
      title="审核"
      :visible.sync="Changeparkingdetails1"
      :append-to-body="true"
      center
      class="reminders"
      top="35vh"
      :close-on-click-modal="false"
      width="435px"
     >
      <div class="footer-one">
        <p>申请删除{{Changeparkingcar.number  }}的车位详情！</p>
      </div>
      <div class="footer-two">
          <label>申请理由：</label>
          <span>{{ Changecar.centons }}</span>
      </div>
      <div class="footer-class">
        <span class="one" @click="cancel">拒绝</span>
        <span class="two" @click="minitab">同意</span>
      </div>
    </el-dialog>
    <!-- 同意申请 -->
    <el-dialog
      title="提示"
      :visible.sync="Application"
      :append-to-body="true"
      center
      class="reminder"
      top="35vh"
      :close-on-click-modal="false"
      width="380px"
      :before-close="handleClose1"
     >
      <div class="footer-one">
        <p>您确定同意此申请？</p>
      </div>
      <div class="footer-class">
        <span class="one" @click="countermand">取消</span>
        <span class="two" @click="verify">确认</span>
      </div>
    </el-dialog>
     <!-- 同意删除 -->
    <el-dialog
      title="提示"
      :visible.sync="Agreedtoremove"
      :append-to-body="true"
      center
      class="reminderdcp"
      top="35vh"
      :close-on-click-modal="false"
      
      width="380px"
      :before-close="handleClose">
      <div class="footer-one">
        <p><span>同意</span>，该车位的所有数据将被删除，请确认做好备份后再进行删除，您确定要删除吗？</p>
      </div>
      <div class="footer-class">
        <span class="one" @click="abrogate">取消</span>
        <span class="two" @click="countersign">确认</span>
      </div>
    </el-dialog>
    <!-- 审核修改车位 -->
    <el-dialog
      title="申请修改详情"
      custom-class="myAddForm"
      class="changepark"
      :append-to-body="true"
      :visible.sync="Changeparkingdetails"
      :close-on-click-modal="false"
      >
      <el-form ref="form1" :model="Changecar" label-width="380px">
        <div>
           <div class="row">
            <span class="t1">车位类型:</span>
            <span class="t2">{{ Changeparkingcar.car_type_name}}</span>
            <span class="t3">修改为:</span>
            <el-select v-model="Changecar.car_type" placeholder disabled >
              <el-option
                :label="item.park_type"
                v-for="(item ,index) in pulllists"
                :key="index"
                :value="item.id"
              ></el-option>
            </el-select>
          </div>
          <div class="row">
            <span class="t1">选择楼层:</span>
            <span class="t2">
                <span>{{Changeparkingcar.floor===1?"1层":'' }}</span>
              <span>{{Changeparkingcar.floor===2?"2层":'' }}</span>
              <span>{{Changeparkingcar.floor===3?"3层":'' }}</span>
              <span>{{Changeparkingcar.floor===4?"4层":'' }}</span>
              <span>{{Changeparkingcar.floor===5?"6层":'' }}</span>
              <span>{{Changeparkingcar.floor===7?"7层":'' }}</span>
              <span>{{Changeparkingcar.floor===8?"8层":'' }}</span>
              <span>{{Changeparkingcar.floor===9?"9层":'' }}</span>
              <span>{{Changeparkingcar.floor===10?"10层":'' }}</span>
              <span>{{Changeparkingcar.floor===-1?"负1层":'' }}</span>
              <span>{{Changeparkingcar.floor===-2?"负2层":'' }}</span>
              <span>{{Changeparkingcar.floor===-3?"负3层":'' }}</span>
              <span>{{Changeparkingcar.floor===-4?"负4层":'' }}</span>
              <span>{{Changeparkingcar.floor===-5?"负5层":'' }}</span>
              <span>{{Changeparkingcar.floor===-6?"负6层":'' }}</span>
              <span>{{Changeparkingcar.floor===-7?"负7层":'' }}</span>
              <span>{{Changeparkingcar.floor===-8?"负8层":'' }}</span>
              <span>{{Changeparkingcar.floor===-9?"负9层":'' }}</span>
              <span>{{Changeparkingcar.floor===-10?"负10层":'' }}</span>
            </span>
            <span class="t3">修改为:</span>
            <el-select v-model="Changecar.floor" placeholder disabled >
              <el-option
                :label="item.label"
                v-for="(item ,index) in park_floor"
                :key="index"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
          <div class="row">
            <span class="t1">车位号:</span>
            <span class="t2">{{ Changeparkingcar.number }}</span>
            <span class="t3">修改为:</span>
            <input v-model.trim="Changecar.car_number" class="t4" prop="number" disabled style="  text-indent: 12px;" />
          </div>
          <div class="row">
            <span class="t1">长租车月租:</span>
            <span class="t2">
              {{ Changeparkingcar.car_price}}
            </span>
            <span class="t3">修改为:</span>
            <input v-model.trim="Changecar.car_price" class="t4" disabled style="  text-indent: 12px;" />
          </div>
          <div class="row">
            <span class="t1">关联房屋:</span>
            <span class="t2">{{ Changeparkingcar.house_number }}</span> 
            <span class="t3">修改为:</span>
            <input v-model.trim="Changecar.car_house_number" class="t4" disabled style="  text-indent: 12px;" />
          </div>
        </div>
        <div class="row" style="position:relative; height:102px;">
          <span class="t1" style="margin-top:5px;">*申请理由:</span>
          <textarea
          disabled
            v-model.trim="Changecar.centons"
            rows="1"
            cols="40"
            style="background:#fff;min-height:110px;border-radius:4px;border:1px solid #d2d2d2;outline:none;position:absolute;left:85px;resize:none;width:259px;min-width:259px;padding:8px;overflow:scroll;overflow-y:hidden;overflow-x:hidden"
            onfocus="window.activeobj=this;this.clock=setInterval(function(){activeobj.style.height=activeobj.scrollHeight+'px';},10);"
            onblur="clearInterval(this.clock);"
          />
        </div>
        <div  class="addNow" style="cursor:pointer" @click="affirm">同意</div>
        <div  class="addNow1" style="cursor:pointer" @click="reject">拒绝</div>
      </el-form>
    </el-dialog>
    <!-- 拒绝申请 --> 
    <el-dialog
      title="拒绝"
      custom-class="myAddForm"
      class="changeparks"
      :append-to-body="true"
      :visible.sync="declineanapplication"
      :close-on-click-modal="false"
      :before-close="handleCloses"
      >
      <el-form ref="form2" :model="reason" label-width="380px" >
        <div class="row" style="position:relative; height:100px;">
          <span class="t1" style="margin-top:5px;font-size:14px">*拒绝理由:</span>
          <textarea
            v-model="reason.centons"
            rows="1"
            cols="40"
            style="min-height:125px;border-radius:4px;border:1px solid #d2d2d2;outline:none;position:absolute;left:85px;resize:none;width:228px;padding:8px;overflow:scroll;overflow-y:hidden;overflow-x:hidden;font-size:14px;"
            onfocus="window.activeobj=this;this.clock=setInterval(function(){activeobj.style.height=activeobj.scrollHeight+'px';},10);"
            onblur="clearInterval(this.clock);"
          />
        </div>
        <div  class="addNow2" style="cursor:pointer" @click="notarize" >确认</div>
        <div class="yanzheng1">
          <div  v-show="yzheng">请输入拒绝理由</div>
        </div>
      </el-form>
    </el-dialog>
    <!-- 拒绝删除 -->
    <el-dialog
      title="拒绝"
      custom-class="myAddForm"
      class="changeparks"
      :append-to-body="true"
      :visible.sync="declineanapplication1"
      :close-on-click-modal="false"
      :before-close="handleCloses1"
      >
      <el-form ref="form2" :model="reasons" label-width="380px" >
        <div class="row" style="position:relative; height:100px;">
          <span class="t1" style="margin-top:5px;font-size:14px">*拒绝理由:</span>
          <textarea
            v-model="reasons.centons"
            rows="1"
            cols="40"
            style="min-height:125px;border-radius:4px;border:1px solid #d2d2d2;outline:none;position:absolute;left:85px;resize:none;width:266px;min-width:266px;padding:8px;overflow:scroll;overflow-y:hidden;overflow-x:hidden;font-size:14px;"
            onfocus="window.activeobj=this;this.clock=setInterval(function(){activeobj.style.height=activeobj.scrollHeight+'px';},10);"
            onblur="clearInterval(this.clock);"
          />
        </div>
        <div  class="addNow2" style="cursor:pointer" @click="notarize1" >确认</div>
        <div class="yanzheng1">
          <div  v-show="yzheng">请输入拒绝理由</div>
        </div>
      </el-form>
    </el-dialog>
     <!-- 操作记录 -->
    <el-dialog
      title="操作记录"
      :visible.sync="operationss"
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
        :model="operations"
        class="el-myclass"
        ref="Specialvehicle"
        hide-required-asterisk
        disabled
      >
        <el-form-item label="上次操作员:">
          <el-input v-model="operations.name" @keydown.native.enter="from" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="上次操作时间:">
          <el-input v-model="operations.time" @keydown.native.enter="from" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="上次操作IP地址:">
          <el-input v-model="operations.ip" @keydown.native.enter="from" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div class="footer-class">
        <span @click="from">确认</span>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import "@/assets/fonts/iconfont.js";
import axios from "axios";
import { Message } from "element-ui";
import {
    auditList,
    particulars,
    Agreetorefuse,
    parkdata,
    //
  pullList,
  operatingRecord,
} from "@/api/parkCar";
import { postSelect_button } from "@/api/Jurisdiction1";
import moment from "moment";
// data数据
export default {
  components: {},
  data() {
      //console.log(JSON.parse(window.localStorage.getItem("items")).id,'123333333333333333333333333');
    return {
      reasons:{
        centons:''
      },
      declineanapplication1:false,
        Agreedtoremove:false,
        tabledata:[],//车位详情
        yzheng:false,
      declineanapplication:false,//拒绝申请
       Application:false,//同意申请弹框
        isExist: false ,// 要修改的车位号是否已存在
      remindercar: false,
      isShowExcel: false,
      isError: false,
      isShow:false,
      checked: true,
      pulllists: [],
      tableData: [],
      park_floor: [
        {
          value: -10,
          label: "负10层"
        },
        {
          value: -9,
          label: "负9层"
        },
        {
          value: -8,
          label: "负8层"
        },
        {
          value: -7,
          label: "负7层"
        },
        {
          value: -6,
          label: "负6层"
        },
        {
          value: -5,
          label: "负5层"
        },
        {
          value: -4,
          label: "负4层"
        },
        {
          value: -3,
          label: "负3层"
        },
        {
          value: -2,
          label: "负2层"
        },
        {
          value: -1,
          label: "负1层"
        },
        {
          value: 1,
          label: "1层"
        },
        {
          value: 2,
          label: "2层"
        },
        {
          value: 3,
          label: "3层"
        },
        {
          value: 4,
          label: "4层"
        },
        {
          value: 6,
          label: "6层"
        },
        {
          value: 7,
          label: "7层"
        },
        {
          value: 8,
          label: "8层"
        },
        {
          value: 9,
          label: "9层"
        },
        {
          value: 10,
          label: "10层"
        }
      ],
      back: false, //返回上一级
      pageNums: 1, //总页数
      totalPage: null, //总条数
      disabled: true,
      labelPosition: "right",
      park_id: null, //停车场id
      parkid: "",
      currentPage: 1, // 当前页
      pageSize: 10, // 当前页条数
      centerDialogVisible1: false, //增加车位
      Modification: false, //修改车位
      operationss: false, //操作记录
      Changeparkingdetails: false, //申请修改车位
      Changeparkingdetails1: false, //申请修改车位
      //修改车辆
      Modificationcar: {
        centons: "", //备注
        state: null //车位状态
      },
      //修改之前的数据
      Changeparkingcar: {
        car_type_name: "", //车位类型
        number: "", //车位号
        centons: "", //备注
        state: null, //车位状态
        house_number: "", //关联房屋
        car_price: "",
        car_type:'',
        floor:null
      },
      //申请修改的数据
      Changecar: {
        car_type: "", //车位类型id
        car_number: "", //车位号
        centons: "", //备注
        car_house_number: "", //关联房屋
        car_price: "",
        floor:null
      },
   
      //操作记录
      operations: {
      },
      //查询
      orderNo: "",
      user: {}, //当前列信息
      listid: "", //导入文件id
      carlistid:'',//当前列id
      ids:'',
      uid:"",
      reason:{
          centons:''//拒绝理由
      },
      shenhe:false,
      xiangqing:false,
      caozuo:false
    };
  },
  async created() {
    //获取列表
    const user = JSON.parse(localStorage.getItem("userInfo"));
    this.parkid = user.Communityid;
    this.park_id = user.Communityid;
    this.uid = user.uid;
    //获取车位类型下拉id
    this.Pulllist();
    //console.log(user.list );
    //获取车位列表
    this.parkList();
       // 拉取用户信息按钮权限
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'))
    const { Communityid, uid } = this.userInfo
    const auth_id = this.$route.meta.auth_id
    const {data}  =   await postSelect_button({Communityid, uid, auth_id})
    console.log(data);
    
    data.forEach(v=>{
      if(v.auth_name==="审核"){
        this.shenhe=true
      }
       if(v.auth_name==="车位详情"){
        this.xiangqing=true
      }
      if(v.auth_name==="操作记录"){
        this.caozuo=true
      }
    })
  },
  methods: {
    handleCloses1(){
      this.declineanapplication1=false;
      this.Changeparkingdetails1=true
    },
    handleCloses(){
      this.declineanapplication=false;
      this.Changeparkingdetails=true;
    },
      handleClose1(){
        this.Application=false
      this.Changeparkingdetails=true
    },
    handleClose(){
      this.Agreedtoremove=false
      this.Changeparkingdetails1=true
    },
    // 返回上一页
    backToLastPage() {
      this.isShowExcel = false;
      this.parkList();
      this.isShow=false;

    },
    //获取车位类型下拉id
    async Pulllist() {
      let { data } = await pullList({ parkid: this.parkid });

      this.pulllists = data;
      console.log(data);
      
    },
    // 分页设置
    handleCurrentChange(val) {
      this.currentPage = val;
      this.parkList();
    },
    //编辑
    async compile(row) {
        this.Changeparkingdetails =false
        this.Changeparkingdetails1 =false
        this.reason.centons=null;
        console.log(row);
        this.carlistid=row.id
        const {data} = await particulars({id:this.carlistid})
        console.log(data);
        if(data.update_info.car_type===0){
          data.update_info.car_type=""
        }
          if(data.update_info.car_price==="0.00"){
          data.update_info.car_price=""
        }
         if(data.update_info.floor===0){
          data.update_info.floor=""
        }
         if(data.update_info.floor===data.info.floor){
          data.update_info.floor=""
        }
         if(data.update_info.car_type_name && data.update_info.car_price===""){
           this.pulllists.forEach(v=>{
             if(v.id===data.update_info.car_type){
               data.update_info.car_price=v.park_car_long
             }
           })
        }

        //修改之前的数据
        this.Changeparkingcar.car_type_name = data.info.car_type_name;
        this.Changeparkingcar.number = data.info.car_number;
        this.Changeparkingcar.house_number = data.info.car_house_number;
        this.Changeparkingcar.state = data.update_info.state;
        this.Changeparkingcar.centons = data.info.centons;
        this.Changeparkingcar.car_price = data.info.car_price;
        this.Changeparkingcar.car_type = data.info.car_type;
        this.Changeparkingcar.floor = data.info.floor;
        //申请修改的数据
    
        this.Changecar=data.update_info
      
        //展示弹框
        if(this.Changeparkingcar.state===1){
           this.Changeparkingdetails = true;
        }
         else if(this.Changeparkingcar.state===2){
           this.Changeparkingdetails1 = true;
        }
        },
  
    //车位详情
    async handle(row) {
     //console.log(row);
       const {pid} =  row;
        const data = await parkdata({id:pid})
        console.log(data);
        this.isShowExcel=true;
        this.tabledata[0]=data.data
      this.isShow=true;
    },
    from() {
      this.operationss = false;
    },

    //同意修改
     affirm() {
        this.Changeparkingdetails = false;
        this.Application=true
    },
    //取消
    countermand(){
        this.Application=false
        this.Changeparkingdetails=true
    },
    //确认
    async verify(){
     const {msg} =await Agreetorefuse({
            id:this.carlistid,
            type:2,
            uid:this.uid
        })
        console.log(msg);
        
       if(msg===1){
            this.Application=false
            this.parkList()
            this.Changeparkingcar.state=''
            Message({
          type: "success",
          message: "同意成功"
        });
      
       }else {
            this.Application=false
            this.parkList()
            this.Changeparkingcar.state=''
        // 失败
        Message.error("同意失败");
      }
        
    },
    //拒绝申请
    async notarize(){
        if(this.reason.centons){
           const {msg} = await Agreetorefuse({
            id:this.carlistid,
            type:3,
            uid:this.uid,
            centons:this.reason.centons
            })
              if(msg===1){
            this.declineanapplication=false
            Message({
          type: "success",
          message: "拒绝成功"
        });
         this.parkList()
       
       }else {
            this.declineanapplication=false
            this.parkList()
        // 失败
        Message.error("拒绝失败");
      }
        }else{
            this.yzheng=true
             setTimeout(() => {
            this.yzheng = false
      }, 4000)
        }
    },
      //拒绝申请
    async notarize1(){
        if(this.reasons.centons){
           const {msg} = await Agreetorefuse({
            id:this.carlistid,
            type:3,
            uid:this.uid,
            centons:this.reasons.centons  
            })
              if(msg===1){
            this.declineanapplication1=false
            Message({
          type: "success",
          message: "拒绝删除"
        });
         this.parkList()
       
       }else {
            this.declineanapplication1=false
            this.parkList()
        // 失败
        Message.error("拒绝失败");
      }
        }else{
            this.yzheng=true
             setTimeout(() => {
            this.yzheng = false
      }, 4000)
        }
    },
    //获取列表
    async parkList() {
      const { data } = await auditList({
        page: this.currentPage,
        size: this.pageSize,
        parkid: this.parkid
      });
        console.log(data);
         if (!data.data.length && this.currentPage !== 1) {
        //如果当前页没有数据并且当前页码不是第一页
        this.currentPage--;
        this.parkList();
      }
      if(!data.data.length){
        this.$bus.$emit("updates")
      }
      
      data.data.forEach(async v=>{
          v.add_time= moment(v.add_time*1000).format("YYYY-MM-DD HH:mm:ss");
            const {data} = await particulars({id:v.id})
            v.state_car_list=data.info.car_number
      })
      this.tableData = data.data;
      this.totalPage = data.total; // 总条数
      this.pageNums = data.pageNum; //总页数
    },
    excelImport() {
      this.remindercar = true;
    },
    //取消
    cancel() {
      this.Changeparkingdetails = false;
      this.declineanapplication=true;
    },
    //确认删除申请
   minitab() {
        //console.log(this.carlistid,this.uid);
        this.Changeparkingdetails1=false
        this.Agreedtoremove=true

     },
    //拒绝
    reject(){
          this.Changeparkingdetails = false;
        this.declineanapplication=true;
    },
     //拒绝
    cancel(){
          this.Changeparkingdetails1 = false;
        this.declineanapplication1=true;
    },
    //取消同意删除
    abrogate(){
         this.Agreedtoremove=false
            this.Changeparkingdetails1=true
    },
    //确认同意删除
    async countersign(){
         const {msg}=await Agreetorefuse({
            id:this.carlistid,
            type:2,
            uid:this.uid
        })
       if(msg===1){
            this.Agreedtoremove=false
            this.parkList()
            this.Changeparkingcar.state=''
            Message({
          type: "success",
          message: "删除成功"
        });
      
       }else {
            this.Agreedtoremove=false
            this.parkList()
            this.Changeparkingcar.state=''
        // 失败
        Message.error("删除失败");
      }
    },
      //操作记录
    handless(row) {
      // console.log(row);
      const { id } = row;
      this.ids = id;
      this.operations=null;
      this.operatingRecord();
      this.operationss = true;
    },
       // 获取操作记录列表
    async operatingRecord() {
      const { data } = await operatingRecord({
        state: 2,
        id: this.ids
      });
       console.log(data);
      data.time = moment(data.time*1000).format("YYYY-MM-DD HH:mm:ss");
      this.operations = data;
    },
  }
};
</script>
<style lang="scss" scoped>
.box-header {
//   margin-top: 20px;
//   margin-left: 20px;
//   position: relative;
//   height: 30px;
  .add-btn {
    cursor: pointer;
    background-color: #25BAD9;
    color: #fff;
    height: 30px;
    line-height: 30px;
    position: absolute;
    top: 43%;
    font-size: 14px;
    top: 75px;
   left:20px;
    padding: 0 8px;
    border-radius: 4px;
    z-index: 888888888888888888;
  }
  .load-btn {
    cursor: pointer;
    color: #25bad9;
    position: absolute;
    font-size: 12px;
    right: 0px;
    top: -45px;
  }
  .search-btn {
    position: absolute;
    height: 30px;
    background-color: #bfbfbf;
    top: 42%;
    bottom: 50%;
    right: 0px;
    border-radius: 0 3px 3px 0;
    margin-top: -13px;
    z-index: 9;
    color: #fff;
    font-size: 14px;
    line-height: 30px;
    padding: 0 5px;
    cursor: pointer;
    input::-webkit-input-placeholder {
      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #999999;
    }
    input::-moz-placeholder {
      font-size: 10px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #999999;
    }
  }
  .sreach-box {
    width: 180px;
    height: 30px;
    position: absolute;
    top: 42%;
    right: 0px;
    border-radius: 3px;
    margin-top: -13px;
    border: 1px solid #bfbfbf;
    /deep/.el-input__inner {
      height: 100% !important;
      margin-left: 1px;
      padding-left: 7px !important;
      color: #666;
      &::-webkit-input-placeholder {
        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #999999;
      }
      &::-moz-placeholder {
        font-size: 10px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #999999;
      }
    }
    // input {
    //   background-color: #f00 !important;
    // }
  }
}
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
  .table-box{
     padding: 20px !important;
     margin-top: 30px;
  }
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
   background:#fff;
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
  left: 4px;
  top: 0px;
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
  width: 72px;
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
.newaddcp {
  display: inline-block;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  width: 86px;
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
  width: 72px;
  height: 30px;
  background: #1FBBA6;
  border-radius: 4px;
}
.el-btn55 {
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
  width: 72px;
  height: 30px;
  background: #CCCCCC;
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
      padding: 12px 19px 12px;
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
  right: 42px;
}
.search {
  /deep/.el-input__inner {
    // background-color: #f00;
    width: 177px !important;
    height: 30px !important;
    border: 1px solid rgba(210, 210, 210, 1) !important;
    border-radius: 4px 0 0 4px !important;
    color: #333333;
    padding: 0px 7px;
    position: absolute;
   right:24px;
    top: -67px;
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
  border-radius: 0px 4px 4px 0px;
  font-size: 14px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: rgba(255, 255, 255, 1);
  cursor: pointer;
  position: absolute;
 right:20px;
  top: 21px;
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
      height: 47px !important;
      padding: 12px 19px 12px;
      border-bottom: 1px solid #eff2f5;
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
.reminders {
  /deep/.el-dialog {
    min-width: 380px;
    height: 229px;
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
      padding: 12px 19px 12px;
      border-bottom: 1px solid #eff2f5;  
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
      width: 435px;
      p {
        font-size: 16px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color:#FE3D3D;
        margin-left:100px; 
        margin-top: 30px;
      }
    }
      .footer-two {
      margin-left: 80px;
      margin-top: 26px;
      font-size: 14px;
      font-family: Microsoft YaHei;
      p {
        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color:#FE3D3D;
      }
    }
    .footer-class {
      // background-color: #f00;
      cursor: pointer;
      height: 30px;
      display: flex;
      justify-content: center;
      margin-top: 22px;
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
        background-color: #5FAFE4;
        border: 1px solid rgba(204, 204, 204, 1);
        display: flex;
        justify-content: center;
        align-items: center;
        color: #ffffff;
      }
    }
    .el-form-item {
      margin-bottom: 0;
      height: 50px !important;
    }
  }
}
.reminderdcp {
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
      padding: 12px 19px 12px;
      border-bottom: 1px solid #eff2f5;
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
        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: rgba(102, 102, 102, 1);
        padding:0 40px 0 40px;
        span{
            color:red;
        }
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


.addparkings {
  /deep/.el-dialog {
    min-width: 400px;
    height: 468px;
     display: flex;
       flex-direction: column;
       margin:0 !important;
       position:absolute;
       top:50%;
       left:50%;
       transform:translate(-50%,-50%);
    .el-dialog__header {
      text-align: left !important;
      height: 47px !important;
      border-bottom: 1px solid #eff2f5 !important;
    }
    /deep/.el-dialog__body {
      text-align: initial;
      //padding: 24px 25px 25px 0px;
      .el-myclass {
        padding-left: 55px;
        height: 65px !important;
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
          color: #333333;
          padding: 0px 7px;
          font-size: 12px;
        }
        .warnings {
          height: 30px !important;
          padding: 0px !important;
          margin-top: -26px !important;
          .el-form-item__content {
            margin-left: 296px !important;
            font-family: Microsoft YaHei;
            font-weight: 400;
            color: rgba(153, 153, 153, 1);
          }
          .warning {
            cursor: pointer;
            font-size: 12px;
            .icon-jinggao {
              fill: #f8ac59;
            }
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
      margin-top: 277px;
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
      margin-bottom: 6px;
      height: 50px !important;
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
          .el-textarea__inner {
            font-family: "Microsoft" !important;
            font-size: 14px !important;
            // overflow-y: scroll;
            width: 248px;
            height: 88px;
            margin-top: 2px;
            padding: 5px 8px;
          }
          .el-textarea__inner:focus {
            border-color: #d2d2d2;
          }
        }
      }
    }
  }
}
.actived {
  color: #1fbba6;
}
.changepark {
 
  /deep/ .myAddForm {
    position: fixed;
    top: 10px;
    width: 435px !important;

    .de {
      height: 32px;
    }
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
    input {
      -moz-appearance: textfield;
    }
    .el-input__inner {
      -moz-appearance: textfield;
    }
    .el-input__inner {
      height: 22px !important;
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
    min-width: 400px;
    .el-dialog__header {
      //header
      border-bottom: 1px solid #efefef;
      padding: 12px 0 10px 16px;
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
      position: relative;
      padding: 10px 40px 93px 40px !important;
    width: 435px !important;
      .el-form {
        padding-top: 10px;
           font-size: 12px;
        .row {
          position: relative;
          padding-bottom: 24px;
          font-size: 14px;
          .tips {
            position: absolute;
            right: 99px;
          }

          span {
            display: inline-block;
          }
          .t1 {
            width: 100px;
          }
          .t2 {
            width: 86px;
          }
          .t3 {
            padding-right: 15px;
            font-size:14px
          }
          .t4 {
            width: 100px;
            border: 1px solid #d2d2d2;
            height: 32px;
            padding-left: 5px;
            padding-right: 5px;
            outline: none;
            border-radius: 4px;
              background: #fff;

          }
          /deep/.el-select {
            width: 100px;
            padding-left: 5px;
            border: 1px solid #d2d2d2;
            height: 32px;
            border-radius: 4px;
            .el-input__inner {
              padding-left: 0;
              cursor: default;
              color:#666666;
              border:none;
            }
            .el-input__suffix-inner {
              display:none;
              height: 100%;
              cursor: default;
              .el-input__icon {
                line-height: 1;
              cursor: default;
              }
            }
          }
        }
      }
    }
    .el-input__icon {
      line-height: 32px !important;
    }
    .addNow {
      width:72px;
      height: 30px;
      text-align: center;
      font-size: 14px;
      position: absolute;
      background-color: #25BAD9;
      line-height: 30px;
      color: #fffefe;
      border-radius: 4px;
      bottom: 24px;
      right: 21%;
    }
      .addNow1 {
      width:72px;
      height: 30px;
      text-align: center;
      font-size: 14px;
      position: absolute;
      background-color: #5FAFE4;
      line-height: 30px;
      color: #fffefe;
      border-radius: 4px;
      bottom: 24px;
      left: 21%;
    }
    .addNow2 {
      width:72px;
      height: 30px;
      text-align: center;
      font-size: 14px;
      position: absolute;
      background-color: #F8AC59;
      line-height: 30px;
      color: #fffefe;
      border-radius: 4px;
      bottom: 24px;
      left: 210px;
    
    }
    .el-form-item {
      height: 32px !important;
      margin-bottom: 25px;
      line-height: 32px;

      .el-form-item__label {
        //lable
        color: #666666;
        line-height: 32px;
        text-align: left;
      }
      .el-form-item__content {
        //content
        box-sizing: border-box;
        border: 1px solid #d2d2d2;
        margin-left: 80px !important;
        width: 73%;
        border-radius: 4px;
        height: 32px;
        line-height: 32px;
        .el-input__inner {
          height: 30px !important;
        }
        .m::after {
          content: "m²";
          position: absolute;
          top: -1px;
          right: -25px;
        }
        .el-select {
          width: 100%;
          line-height: 32px;
          top: -5px;
        }
        .tips {
          //tips
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
}
.changeparks {
 
  /deep/ .myAddForm {
    position: fixed;
    top: 10px;
    width: 450px !important;
    height: 276px !important;
    .de {
      height: 32px;
    }
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
    input {
      -moz-appearance: textfield;
    }
    .el-input__inner {
      -moz-appearance: textfield;
    }
    .el-input__inner {
      height: 22px !important;
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
    min-width: 400px;
    .el-dialog__header {
      //header
      border-bottom: 1px solid #efefef;
      padding: 10px 0 8px 16px;
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
      position: relative;
      padding: 18px 40px 84px 65px !important;
      // width: 435px !important;
      .el-form {
        padding-top: 10px;
           font-size: 14px;
        .row {
          position: relative;
          padding-bottom: 24px;
          font-size:14px;
          .tips {
            position: absolute;
            right: 99px;
          }

          span {
            display: inline-block;
          }
          .t1 {
            width: 100px;
          }
          .t2 {
            width: 90px;
          }
          .t3 {
            padding-right: 15px;
          }
          .t4 {
            width: 100px;
            border: 1px solid #d2d2d2;
            height: 32px;
            padding-left: 5px;
            padding-right: 5px;
            outline: none;
            border-radius: 4px;
              background: #fff;

          }
          /deep/.el-select {
            width: 100px;
            padding-left: 5px;
            border: 1px solid #d2d2d2;
            height: 32px;
            border-radius: 4px;
            .el-input__inner {
              padding-left: 0;
              cursor: default;
              color:#666666;
              border:none;
            }
            .el-input__suffix-inner {
              height: 100%;
              .el-input__icon {
                line-height: 1;
              }
            }
          }
        }
      }
    }
    .el-input__icon {
      line-height: 32px !important;
    }
    .addNow {
      width:72px;
      height: 30px;
      text-align: center;
      font-size: 14px;
      position: absolute;
      background-color: #25BAD9;
      line-height: 30px;
      color: #fffefe;
      border-radius: 4px;
      bottom: 24px;
      right: 25%;
    }
      .addNow1 {
      width:72px;
      height: 30px;
      text-align: center;
      font-size: 14px;
      position: absolute;
      background-color: #5FAFE4;
      line-height: 30px;
      color: #fffefe;
      border-radius: 4px;
      bottom: 24px;
      left: 25%;
    }
    .addNow2 {
      width:72px;
      height: 30px;
      text-align: center;
      font-size: 14px;
      position: absolute;
      background-color: #F8AC59;
      line-height: 30px;
      color: #fffefe;
      border-radius: 4px;
      bottom: 43px;
      left: 190px;
    
    }
    .el-form-item {
      height: 32px !important;
      margin-bottom: 25px;
      line-height: 32px;

      .el-form-item__label {
        //lable
        color: #666666;
        line-height: 32px;
        text-align: left;
      }
      .el-form-item__content {
        //content
        box-sizing: border-box;
        border: 1px solid #d2d2d2;
        margin-left: 80px !important;
        width: 73%;
        border-radius: 4px;
        height: 32px;
        line-height: 32px;
        .el-input__inner {
          height: 30px !important;
        }
        .m::after {
          content: "m²";
          position: absolute;
          top: -1px;
          right: -25px;
        }
        .el-select {
          width: 100%;
          line-height: 32px;
          top: -5px;
        }
        .tips {
          //tips
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
}
.newadds {
  display: inline-block;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  width: 72px;
  height: 30px;
  line-height: 5px;
  background: #1fbba6;
  border-radius: 4px;
  font-size: 14px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: rgba(255, 255, 255, 1);
  cursor: pointer;
}
.el-button--text{

  color:#FFFFFF;
}

.yanzheng1{
    color:red;
    font-size: 14px;
    margin-left: 85px;
    width: 106px;
    line-height: 12px;
    height: 12px;
    margin-top:30px;
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
