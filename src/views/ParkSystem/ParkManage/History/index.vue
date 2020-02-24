<template>
  <div class="hard-setparamClass">
    <div class="setparam-container">
      <el-card class="box-card">
        <div class="kuang">
          <span>
            <el-button v-if="back" class="newadds" type="text" @click="clear">返回上一级</el-button>
          </span>
          <span>
            <input
              v-if="!back"
              v-model="searchForm.orderNo"
              @keyup.enter="search"
              class="search"
              placeholder="请输入搜索内容"
            />
          </span>
          <span class="btn" @click="search" v-if="!back">
            <svg-icon icon-class="search1" />
          </span>
        </div>
        <el-table :data="tableData" style="width: 100%" empty-text="暂无数据">
          <el-table-column prop="car_number" label="车牌号" width="150" />
          <el-table-column prop="phone" label="电话号码" width="150" />
          <el-table-column label="是否长租" width="120">
            <template slot-scope="scope">
              <span>{{scope.row.is_long_rent===1?"否":"是"}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="star_time" label="入场时间" width="180" class="remark" />
          <el-table-column prop="door_into_name" label="入口" width="150" />
          <el-table-column prop="end_time" label="出场时间" width="180" class="remark" />
          <el-table-column prop="door_out_name" label="出口" width="150" class="remark" />
          <el-table-column prop="price_discount" label="优惠金额(元)" width="130" class="remark" />
          <el-table-column prop="car_stay" label="停车时长" width="150" class="remark" />
          <el-table-column prop="price" label="应收金额(元)" width="130" class="remark" >
           <template slot-scope="scope">
              <span class="svg_tubiao" style="margin-right:5px;" v-if="scope.row.is_pay===1">
                <svg-icon icon-class="zhifubao" />
              </span>
              <span class="svg_tubiao" style="margin-right:5px;" v-if="scope.row.is_pay===2">
                <svg-icon icon-class="weixin" />
              </span>
              <span class="svg_tubiao" style="margin-right:5px;" v-if="scope.row.is_pay===3">
                <svg-icon icon-class="xianjin" />
              </span>
              <span class="svg_tubiao" style="margin-right:5px;" v-if="scope.row.is_pay===4">
                <svg-icon icon-class="yinghangka" />
              </span>
              <span>{{ scope.row.price}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button v-if="xiugai" class="el-btn11" type="text" @click="compile(scope.row)">修改</el-button>
              <el-button v-if="ckxq" class="el-btn22" type="text" @click="forbidden(scope.row)">查看详情</el-button>
              <el-button v-if="caozuo" class="el-btn44" type="text" @click="del(scope.row)">操作记录</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
      <!-- 分页 -->
      <div class="block" v-show="!searchs">
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
 <div class="block"  v-show="searchs">
        <p class="record-data">共 {{ pageNums }}页,共 {{ totalPage }}条</p>
        <el-pagination
          background
          :page-size="10"
          layout="prev, pager, next, jumper"
          :total="totalPage"
          :current-page.sync="currentPage"
          @current-change="handleCurrentChange1"
        />
      </div>
    <!-- 修改 -->
    <el-dialog
      title="修改历史停车记录"
      :visible.sync="Modification"
      :append-to-body="true"
      center
      class="specialvehicles"
      top="35vh"
      :close-on-click-modal="false"
      width="500px"
     >
      <el-form
        ref="addCartype"
        :label-position="labelPosition"
        label-width="100px"
        :model="Modificationcar"
        class="el-myclass"
        hide-required-asterisk
      >
        <el-form-item label="优惠金额(元):">
          <el-input
            v-model="Modificationcar.price_discount"
            autocomplete="off"
            @keydown.native.enter="affirm"
          />
          <span class="units">元</span>
        </el-form-item>
        <div class="yanzheng">
          <div v-show="yzheng10">优惠金额不能为空</div>
        </div>
        <el-form-item label="优惠理由:" class="input_two">
          <el-input
            v-model="Modificationcar.centons"
            autocomplete="off"
            class="input textarea"
            rows="4"
            type="textarea"
            @keydown.native.enter="affirm"
          />
        </el-form-item>
      </el-form>
      <div class="footer-class">
        <span @click="affirm">确认</span>
      </div>
    </el-dialog>

    <!-- 查看详情 -->
    <el-dialog
      title="查看详情"
      :visible.sync="remindercar"
      :append-to-body="true"
      center
      class="reminder"
      top="10vh"
      :close-on-click-modal="false"
      width="800px"
     >
      <div class="box">
        <div class="box-one">
          <el-form
            :label-position="labelPosition"
            label-width="74px"
            :model="particulars"
            class="el-myclass"
            hide-required-asterisk
          >
            <el-form-item label="订单号:">
              <el-input
                v-model="particulars.order_sn"
                autofocus
                disabled
                @keydown.native.enter="onOfferTap"
              />
            </el-form-item>
            <el-form-item label="车牌号:">
              <el-input
                v-model="particulars.car_number"
                autofocus
                @keydown.native.enter="onOfferTap"
                disabled
              />
            </el-form-item>
            <el-form-item label="入口:">
              <el-input
                disabled
                v-model="particulars.door_into_name"
                autofocus
                @keydown.native.enter="onOfferTap"
              />
            </el-form-item>
            <el-form-item label="入场时间:">
              <el-input
                disabled
                v-model="particulars.star_time"
                autofocus
                @keydown.native.enter="onOfferTap"
              />
            </el-form-item>
            <el-form-item label="入场图片:">
              <img :src="'http://aim.txsqtech.com/'+particulars.into_image" />
            </el-form-item>
            <el-form-item label="停车时长:">
              <el-input
                disabled
                v-model="particulars.car_stay"
                autofocus
                @keydown.native.enter="onOfferTap"
              />
            </el-form-item>
            <el-form-item label="应收金额:">
              <el-input
                v-model="particulars.price"
                disabled
                autofocus
                @keydown.native.enter="onOfferTap"
              />
            </el-form-item>
            <el-form-item label="收费员:">
              <el-input
                disabled
                v-model="particulars.user_price"
                autofocus
                @keydown.native.enter="onOfferTap"
              />
            </el-form-item>
            <div class="reveal">入口显示屏内容</div>
            <el-form-item label="第一排:">
              <el-input
                disabled
                v-model="particulars.led_into"
                autofocus
                @keydown.native.enter="onOfferTap"
              />
            </el-form-item>
            <el-form-item label="第二排:">
              <el-input
                disabled
                v-model="particulars.led_into"
                autofocus
                @keydown.native.enter="onOfferTap"
              />
            </el-form-item>
          </el-form>
        </div>
        <div class="box-two">
          <el-form
            :label-position="labelPosition"
            label-width="74px"
            :model="Appearance"
            class="el-myclass"
            hide-required-asterisk
          >
            <el-form-item label="是否长租">
              <el-radio-group v-model="Appearance.is_long_rent" disabled>
                <el-radio :label="1">否</el-radio>
                <el-radio :label="2">是</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="电话号码:">
              <el-input
                disabled
                v-model="Appearance.phone"
                autofocus
                @keydown.native.enter="onOfferTap"
              />
            </el-form-item>
            <el-form-item label="出口:">
              <el-input
                disabled
                v-model="Appearance.door_out_name"
                autofocus
                @keydown.native.enter="onOfferTap"
              />
            </el-form-item>
            <el-form-item label="出场时间:">
              <el-input
                v-model="Appearance.end_time"
                disabled
                autofocus
                @keydown.native.enter="onOfferTap"
              />
            </el-form-item>
            <el-form-item label="出场图片:">
              <img :src="'http://aim.txsqtech.com/'+Appearance.out_image" />
            </el-form-item>
            <el-form-item label="优惠金额:">
              <el-input
                disabled
                v-model="Appearance.price_discount"
                autofocus
                @keydown.native.enter="onOfferTap"
              />
            </el-form-item>
            <el-form-item label="收费方式:">
              <el-input
                disabled
                v-if="Appearance.is_pay===1"
                autofocus
                @keydown.native.enter="onOfferTap"
                value="支付宝"
              />
              <el-input
                disabled
                v-if="Appearance.is_pay===2"
                autofocus
                @keydown.native.enter="onOfferTap"
                value="微信"
              />
              <el-input
                disabled
                v-if="Appearance.is_pay===3"
                autofocus
                @keydown.native.enter="onOfferTap"
                value="现金"
              />
            </el-form-item>
            <div class="reveals">出口显示屏内容</div>
            <el-form-item label="第一排:">
              <el-input
                v-model="Appearance.led_out"
                disabled
                autofocus
                @keydown.native.enter="onOfferTap"
              />
            </el-form-item>
            <el-form-item label="第二排:">
              <el-input
                v-model="Appearance.led_out"
                disabled
                autofocus
                @keydown.native.enter="onOfferTap"
              />
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="footer-class">
        <span @click="onOfferTap">确认</span>
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
      width="500px"
     >
      <el-form
        :label-position="labelPosition"
        label-width="110px"
        :model="operatingData"
        class="el-myclass"
        hide-required-asterisk
      >
        <el-form-item label="上次操作员:">
          <el-input
            v-model="operatingData.name"
            autofocus
            disabled
            @keydown.native.enter="operate"
          />
        </el-form-item>
        <el-form-item label="上次操作时间:">
          <el-input
            v-model="operatingData.time"
            autofocus
            disabled
            @keydown.native.enter="operate"
          />
        </el-form-item>
        <el-form-item label="上次操作IP地址:">
          <el-input v-model="operatingData.ip" autofocus disabled @keydown.native.enter="operate" />
        </el-form-item>
      </el-form>
      <div class="footer-class">
        <span @click="operate">确认</span>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { Message } from "element-ui";
import $ from "jquery";
import {
  historylist,
  viewdetails,
  operatingRecord,
  discounts,
  searchnewlists

} from "@/api/parkCar";
import { postSelect_button } from "@/api/Jurisdiction1";
import moment from "moment";
// data数据
export default {
  components: {},
  data () {
    return {
      searchs:false,
      rules: {
        vehicle_car_number: [{ required: true, message: "车牌号不能为空" }],
        vehicle_name: [{ required: true, message: "姓名不能为空" }],
        vehicle_phone: [
          { required: true, message: "电话不能为空" },
          { type: "number", message: "电话必须为数字" }
        ]
      },
      operatingData: {
        name: "",
        time: "",
        ip: ""
      },
      //车辆详情
      particulars: {
        order_sn:'',
        car_number: "", //车牌号
        star_time: "",
        door_into_name: "",
        price: "",
        user_price: "",
        led_into: "",
        car_stay: "",
        into_img: "",
           into_image: "",
        out_img:''
      },
      //详情
      Appearance: {
        is_long_rent: "",
        phone: "",
        door_out_name: "",
        end_time: "",
        price_discount: "",
        is_pay: "",
        led_out: "",
        out_img:'',
         out_image:''
      },
      operationnote: false,
      value1: "", // 入场时间
      yzheng10: false,
      remove: false,
      forbiddencar: false,
      remindercar: false,
      tableData: [],
      back: false,
      userInfoList: {}, // localStorage的userInfo
      pageNums: 1, // 总页数
      totalPage: null, // 总条数
      disabled: true,
      labelPosition: "right",
      park_id: null, // 停车场id
      parkid: "",
      currentPage: 1, // 当前页
      pageSize: 10, // 当前页条数
      centerDialogVisible1: false, // 新增特殊车辆
      Modification: false, // 修改特殊车辆
      id: "", // 列表唯一id
      state: "", // 状态1启用2禁用
      // 操作记录
      operatingData: {
        name: "",
        time: "",
        ip: "",
        resource: ""
      },
      // 修改车辆
      Modificationcar: {
        price_discount: "", // 优惠金额
        centons: "" // 理由
      },
      src:
        "https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg",
      // 查询
      searchForm: {
        orderNo: ""
      },
      addcar: "", // 新增特殊车辆id
      openmn: "", // 操作
      dialogVisible: false,
      selectedProvince: "",
      xiugai: false,
      ckxq: false,
      caozuo: false,
    };
  },
  async created () {
    // 获取列表
    const user = JSON.parse(localStorage.getItem("userInfo"));
    this.parkid = user.Communityid;
    this.park_id = user.Communityid;
    // console.log(user.list );
    const userlist = user.list;
    this.parkList();
    // 拉取用户信息 按钮权限判定
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'))
    const { Communityid, uid } = this.userInfo
    const auth_id = this.$route.meta.auth_id
    const { data } = await postSelect_button({ Communityid, uid, auth_id })
    data.forEach(v => {
      if (v.auth_name === "修改") {
        this.xiugai = true;
      }
      if (v.auth_name === "查看详情") {
        this.ckxq = true;
      }
      if (v.auth_name === "操作记录") {
        this.caozuo = true;
      }
    })
  },
  methods: {
    //操作记录
    async del (row) {
      const { id } = row;
      let iddcp = id;
      this.operationnote = true;
      const { data } = await operatingRecord({
        state: 7,
        id: iddcp
      });
      console.log(data);
      data.time = moment(data.time * 1000).format("YYYY-MM-DD HH:mm:ss");
      this.operatingData = data;
    },
    operate () {
      this.operationnote = false;
    },
    onOfferTap () {
      this.remindercar = false;
    },
    handleSelectionChange () { },
    // 分页设置
    handleCurrentChange (val) {
      this.currentPage = val;
      this.parkList();
    },
       handleCurrentChange1 (val) {
    this.currentPage = val;
      this.search();
    },
    // 编辑
    compile (row) {
      this.Modification = true;
      const { id, price_discount } = row;
      this.id = id;
      this.Modificationcar.price_discount = price_discount;
      this.Modificationcar.centons = ""
    },
    // 修改
    async affirm () {
      if (!this.Modificationcar.price_discount) {
        this.yzheng10 = true;
        setInterval(() => {
          this.yzheng10 = false;
        }, 2000);
      } else {
        const data = await discounts({
          price: Number(this.Modificationcar.price_discount),
          centons: this.Modificationcar.centons,
          id: this.id,
          parkid: this.parkid
        });
        console.log(data);
        if (data.msg === 1) {
          this.Modification = false;
          this.parkList();
          Message({
            type: "success",
            message: "修改成功"
          });
        } else if (data.msg === 2) {
          Message.error("非常抱歉,您未修改任何数据");
          this.Modification = false;
        } else if (data.msg === 3) {
          Message.error(data.data);
          this.Modification = false;
        } else if (data.msg === 13) {
          Message.error(data.data);
          this.Modification = false;
        }
      }
    },
    // 查看详情
    async forbidden (row) {
      this.remindercar = true;
      const { id } = row;
      this.id = id;
      const { data } = await viewdetails({
        id: this.id,
        parkid: this.parkid
      });
      console.log(data);
      this.particulars.car_number = data.car_number;
      if(data.star_time===0){
             this.particulars.star_time="-"
          }else{
             this.particulars.star_time=moment(data.star_time*1000).format('YYYY-MM-DD HH:mm:ss')
          }
      // this.particulars.star_time = moment(data.star_time * 1000).format(
      //   "YYYY-MM-DD HH:mm:ss"
      // );
      this.particulars.door_into_name = data.door_into_name;
      this.particulars.order_sn = data.order_sn;
      this.particulars.price = data.price;
      this.particulars.user_price = data.user_price;
      this.particulars.led_into = data.led_into;
      this.particulars.car_stay = this.formatSeconds(data.car_stay)
      this.particulars.into_img = data.into_img;
      this.particulars.into_image = data.into_image;
      this.Appearance.phone = data.phone;
      this.Appearance.door_out_name = data.door_out_name;
      this.Appearance.out_img = data.out_img;
      this.Appearance.out_image = data.out_image;
      this.Appearance.end_time = moment(data.end_time * 1000).format(
        "YYYY-MM-DD HH:mm:ss"
      );
      this.Appearance.price_discount = data.price_discount;
      this.Appearance.is_pay = data.is_pay;
      this.Appearance.led_out = data.led_out;
      this.Appearance.is_long_rent = data.is_long_rent;
    },
    // 查询
    async search () {
      // console.log(this.searchForm.orderNo);
      if (this.searchForm.orderNo) {
        const { data } = await searchnewlists({
          page: this.currentPage,
          size: this.pageSize,
          parkid: this.parkid,
          name: this.searchForm.orderNo
        });
        console.log(data);
        data.data.forEach(v=>{
          if(v.star_time===0){
            v.star_time="-"
          }else{
            v.star_time=moment(v.star_time*1000).format('YYYY-MM-DD HH:mm:ss')
          }
          v.end_time=moment(v.end_time*1000).format('YYYY-MM-DD HH:mm:ss')
             v.car_stay=moment(v.car_stay*1000).format('YYYY-MM-DD HH:mm:ss')
        })
        if (data.total) {
          this.tableData = data.data;
          this.totalPage = data.total; // 总条数
          this.pageNums = data.pageNum; //总页数
          this.back = true;
          this.searchs = true;
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
    // 获取列表
    async parkList () {
      const { data } = await historylist({
        page: this.currentPage,
        size: this.pageSize,
        parkid: this.parkid
      });
      data.data.forEach(v => {
         if(v.star_time===0){
            v.star_time="-"
          }else{
            v.star_time=moment(v.star_time*1000).format('YYYY-MM-DD HH:mm:ss')
          }
        v.end_time = moment(v.end_time * 1000).format("YYYY-MM-DD HH:mm:ss");
        // v.car_stay = moment(v.car_stay).format("HH小时mm分ss秒");
        v.car_stay = this.formatSeconds(v.car_stay)
      });
      this.tableData = data.data;
      this.totalPage = data.total; // 总条数
      this.pageNums = data.pageNum; // 总页数
      console.log(data);
    },
    //秒换算成小时
    formatSeconds (value) {
      var secondTime = parseInt(value);// 秒
      var minuteTime = 0;// 分
      var hourTime = 0;// 小时
      if (secondTime > 60) {//如果秒数大于60，将秒数转换成整数
        //获取分钟，除以60取整数，得到整数分钟
        minuteTime = parseInt(secondTime / 60);
        //获取秒数，秒数取佘，得到整数秒数
        secondTime = parseInt(secondTime % 60);
        //如果分钟大于60，将分钟转换成小时
        if (minuteTime > 60) {
          //获取小时，获取分钟除以60，得到整数小时
          hourTime = parseInt(minuteTime / 60);
          //获取小时后取佘的分，获取分钟除以60取佘的分
          minuteTime = parseInt(minuteTime % 60);
        }
      }
      var result = "" + parseInt(secondTime) + "秒";

      if (minuteTime > 0) {
        result = "" + parseInt(minuteTime) + "分" + result;
      }
      if (hourTime > 0) {
        result = "" + parseInt(hourTime) + "小时" + result;
      }
      return result;
    },
    // 清除
    clear () {
      this.tableData = [];
      this.searchs=false
      this.back = false;
      this.parkList();
      this.searchForm.orderNo = "";
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
.newadds {
  display: inline-block;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  width: 100px;
  height: 30px;
  line-height: 5px;
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
  background: #1fbba6;
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
  width: 72px;
  height: 30px;
  background: #25bad9;
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
  width: 72px;
  height: 30px;
  background: #cccccc;
  border-radius: 4px;
}

.units {
  position: absolute;
  right: 42px;
}
.Batchappearance {
  /deep/.el-dialog {
    min-width: 400px;
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
      .el-myclass {
        // padding-left: 55px;
        // height: 65px !important;
        display: flex;
        justify-content: center;
        /deep/ .el-form-item__label {
          padding: 0 8px 0 0;
          text-align: left;
        }
        /deep/.el-input__inner {
          // background-color: #f00;
          width: 200px !important;
          height: 32px !important;
          border: 1px solid rgba(210, 210, 210, 1) !important;
          border-radius: 4px !important;
          color: #333333;
          text-align: center;
        }
        /deep/.el-input__prefix {
          /deep/ .el-input__icon {
            height: 32px !important;
            line-height: 32px !important;
          }
        }
      }
      .beizhu {
        margin-left: 232px;
        margin-top: -10px;
        width: 210px;
        height: 12px;
        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: rgba(170, 170, 170, 1);
      }
      .table-input {
        /deep/.el-table {
          position: static;

          /deep/.el-table__header-wrapper {
            /deep/.has-gutter {
              /deep/tr {
                height: 36px !important;
                /deep/th {
                  border-bottom: none !important;
                  padding: 0px;
                  .el-checkbox__inner::after {
                    top: 0px;
                    left: 4px;
                  }
                }
              }
            }
          }
          /deep/.el-table__body-wrapper {
            border: 1px solid #fff;
            /deep/tbody {
              /deep/tr {
                height: 36px !important;
                /deep/td {
                  border-bottom: none !important;
                  padding: 0px;
                  .el-checkbox__inner::after {
                    top: 0px;
                    left: 4px;
                  }
                }
              }
            }
          }
        }
      }
    }
    .footer-class {
      // background-color: #f00;
      height: 30px;
      display: flex;
      justify-content: center;
      margin-top: 10px;
      span {
        cursor: pointer;
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
      height: 40px !important;
      .el-form-item__error {
        padding-top: 0px !important;
      }
    }
  }
}

.specialvehicles {
  /deep/.el-dialog {
    min-width: 400px;
    height: 321px;
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
      padding: 24px 25px 25px 24px;
      .el-myclass {
        padding-left: 37px;
        height: 65px !important;
        /deep/ .el-form-item__label {
          padding: 0 8px 0 0;
          text-align: left;
        }
        /deep/.el-input__inner {
          // background-color: #f00;
          width: 250px !important;
          height: 32px !important;
          border: 1px solid rgba(210, 210, 210, 1) !important;
          border-radius: 4px !important;
          color: #333333;
          padding: 0px 7px;
        }
      }
    }
    .footer-class {
      // background-color: #f00;
      cursor: pointer;
      height: 30px;
      display: flex;
      justify-content: center;
      margin-top: 135px;
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
          .el-textarea__inner {
            font-family: "Microsoft" !important;
            font-size: 14px !important;
            // overflow-y: scroll;
            width: 250px;
            height: 112px;
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
  border-radius: 0px 4px 4px 0px;
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
    height: 825px;
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
      margin-top: 20px;
      padding: 0px;
      .box {
        display: flex;
        justify-content: center;
        width: 720px;
        .box-one {
          width: 360px;
          box-sizing: border-box;
          margin-left: 50px;
          .el-myclass {
            padding-left: 37px;
            height: 65px !important;
            .reveal {
              font-size: 14px;
              font-family: Microsoft YaHei;
              font-weight: 400;
              color: rgba(166, 172, 195, 1);
            }
            /deep/ .el-form-item__label {
              padding: 0 8px 0 0;
              text-align: left;
            }
            /deep/img {
              width: 248px;
              height: 140px;
              background: rgba(239, 242, 245, 1);
              border-radius: 4px;
            }
            /deep/.el-input__inner {
              // background-color: #f00;
              width: 248px !important;
              height: 32px !important;
              border: 1px solid rgba(210, 210, 210, 1) !important;
              border-radius: 4px !important;
              color: #333333;
              padding: 0px 7px;
              cursor: default;
            }
          
            .el-form-item {
              margin-bottom: 16px;
            }
          }
        }
        .box-two {
          width: 360px;
          box-sizing: border-box;
          .el-myclass {
            padding-left: 37px;
            height: 65px !important;
            .reveals {
              font-size: 14px;
              font-family: Microsoft YaHei;
              font-weight: 400;
              color: rgba(166, 172, 195, 1);
              margin-top: 72px;
            }
            /deep/ .el-form-item__label {
              padding: 0 8px 0 0;
              text-align: left;
            }
            /deep/img {
              width: 248px;
              height: 140px;
              background: rgba(239, 242, 245, 1);
              border-radius: 4px;
            }
            /deep/.el-radio__input{
               cursor: default;
               /deep/.el-radio__inner{
               cursor: default;
               /deep/.el-radio__original{
                 cursor: default;
               }
            }
            }
             
            /deep/.el-radio__label{
                 cursor: default;
            }
            /deep/.el-input__inner {
              // background-color: #f00;
              width: 250px !important;
              height: 32px !important;
              border: 1px solid rgba(210, 210, 210, 1) !important;
              border-radius: 4px !important;
              color: #333333;
              padding: 0px 7px;
              cursor: default;
            }
            .el-form-item {
              margin-bottom: 16px;
            }
          }
        }
      }
    }

    .footer-class {
      // background-color: #f00;
      height: 30px;
      display: flex;
      justify-content: center;
      margin-top: 30px;
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
        cursor: pointer;
      }
    }
  }
}
.el-button--text {
  color: #ffffff;
}
.yanzheng {
  color: #ff0000;
  font-size: 12px;
  margin-left: 102px;
  width: 300px;
  line-height: 12px;
  height: 20px;
  margin-top: -4px;
}
.kuang {
  height: 32px;
  position: relative;
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
.box-input {
  width: 500px;
  height: 500px;
  background: #fff;
  z-index: 99999999999999;
  position: fixed;
  top: 50%;
  left: 50%;
  .el-button {
    color: black;
  }
}
.operationnote {
  /deep/.el-dialog {
    min-width: 400px;
    height: 286px;
    border-radius: 5px;
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
      padding: 24px 25px 25px 0px;
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
</style>
