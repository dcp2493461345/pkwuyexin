<template>
  <div class="hard-setparamClass">
    <div class="setparam-container">
      <el-card class="box-card">
        <div class="kuang">
          <span>
            <el-button v-if="plcc" class="newadd" type="text" @click="addor">批量出场</el-button>
          </span>
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
          <el-table-column prop="car_number" label="车牌号" min-width="200" />
          <el-table-column prop="phone" label="电话号码" min-width="200" />
          <el-table-column prop="door_into_id" label="入口门岗名称" min-width="200" />
          <el-table-column prop="star_time" label="入场时间" min-width="250" class="remark" />
          <el-table-column prop="img" label="抓拍图片" min-width="250">
            <template slot-scope="scope">
              <img :src="scope.row.img" />
            </template>
          </el-table-column>
          <el-table-column label="是否长租" min-width="250" class="remark">
            <template slot-scope="scope">
              <span>{{scope.row.is_long_rent===1?"否":'是' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="250">
            <template slot-scope="scope">
              <el-button class="el-btn11" v-if="ccjs" type="text" @click="compile(scope.row)">出场结算</el-button>
              <el-button class="el-btn22" v-if="xiugai" type="text" @click="forbidden(scope.row)">修改</el-button>
              <el-button class="el-btn44" v-if="caozuo" type="text" @click="record(scope.row)">操作记录</el-button>
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
         <!-- 搜索分页 -->
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
    </div>
    <!-- 批量出场 -->
    <el-dialog
      title="批量出场"
      :visible.sync="centerDialogVisible1"
      :append-to-body="true"
      center
      class="Batchappearance"
      top="35vh"
      :close-on-click-modal="false"
      width="600px"
     >
      <el-form
        ref="Specialvehicle"
        :label-position="labelPosition"
        label-width="130px"
        class="el-myclass"
        hide-required-asterisk
      >
        <el-form-item label="选择车辆入场时间:">
          <el-date-picker
            v-model="value1"
            type="datetime"
            prefix-icon="el-icon-date"
            placeholder
            @blur="shijiao"
          />
        </el-form-item>
      </el-form>
      <div class="beizhu">
        <div class="one" v-if="datum">注：以下车辆均为所选时间前入场</div>
        <div class="two" v-if="beizhu">请选择车辆入场时间</div>
      </div>
      <div v-if="datum" class="table-input">
        <el-table
          ref="multipleTable"
          :data="tabletime"
          tooltip-effect="dark"
          style="width: 100%;margin-top:24px;"
          height="240"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="30" />
          <el-table-column prop="car_number" label="车牌号" width="100"></el-table-column>
          <el-table-column prop="phone" label="电话号码" width="120" />
          <el-table-column prop="door_post_name" label="入口" width="120" />
          <el-table-column prop="star_time" label="入场时间" show-overflow-tooltip />
        </el-table>
      </div>
      <div class="footer-class">
        <span @click="sumbitList">确认</span>
      </div>
    </el-dialog>

    <!-- 出场结算 -->
    <el-dialog
      title="出场结算"
      :visible.sync="Modification"
      :append-to-body="true"
      center
      class="specialvehicles"
      top="16vh"
      :close-on-click-modal="false"
      width="26.04%"
     >
      <el-form
        ref="addCartype"
        :label-position="labelPosition"
        label-width="100px"
        :model="Modificationcar"
        class="el-myclass"
        hide-required-asterisk
      >
        <el-form-item label="入场时间:">
          <el-input
            disabled
            v-model="Modificationcar.star_time"
            class="form_item"
            autocomplete="off"
            @keydown.native.enter="affirm"
          />
        </el-form-item>
        <el-form-item label="出场时间:">
          <el-input
            disabled
            v-model="Modificationcar.currentTime"
            autocomplete="off"
            @keydown.native.enter="affirm"
          />
        </el-form-item>
        <el-form-item label="停车时长:">
          <el-input
            disabled
            v-model="Modificationcar.long_time"
            autocomplete="off"
            @keydown.native.enter="affirm"
          />
        </el-form-item>
        <el-form-item label="应收金额(元):">
          <el-input
            disabled
            v-model="Modificationcar.price"
            autocomplete="off"
            @keydown.native.enter="affirm"
          />
        </el-form-item>
        <el-form-item label="优惠金额(元):">
          <el-input
          @input="changenumber"
            v-model="Modificationcar.shop_price"
            autocomplete="off"
            @keydown.native.enter="affirm"
            placeholder="选填"
          />
        </el-form-item>
        <el-form-item label="结算金额(元):" class="lastinput">
          <el-input
            v-model.number="Modificationcar.settlementamount"
            autocomplete="off"
            @keydown.native.enter="affirm"
          />
        </el-form-item>
        <div class="yanzheng1">
          <div v-show="isDeleteHouse">请输入结算金额</div>
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

    <!-- 修改在场车辆 -->
    <el-dialog
      title="修改在场车辆"
      :visible.sync="remindercar"
      :append-to-body="true"
      center
      class="reminder"
      top="20vh"
      :close-on-click-modal="false"
      width="600px"
     >
      <div class="vehicle-plate" style>
        <div>
          <div class="input_outer">
            <label>车牌号:</label>
            <label class="label_province" for="id_province">
              <input
                class="input_province"
                type="text"
                @blur="toggleStyles(5,false)"
                maxlength="1"
                id="id_province"
                @click="showProvince"
                v-model="selectedProvince"
              />
            </label>
            <input
              id="id_plate0"
              class="input_platenumber_base"
              style="left:45px;"
              @keydown="changes(0)"
              @keyup="writeP(0,$event)"
              @focus="toggleStyle(0,true)"
              maxlength="1"
              v-model="pvArray[0]"
            />
            <input
              id="id_plate1"
              class="input_platenumber_base"
              style="left:81px;"
              @keydown="changes(1)"
              @keyup="writeP(1,$event)"
              @focus="toggleStyle(1,true)"
              maxlength="1"
              v-model="pvArray[1]"
            />
            <input
              id="id_plate2"
              class="input_platenumber_base"
              style="left:117px;"
              @keydown="changes(2)"
              @keyup="writeP(2,$event)"
              @focus="toggleStyle(2,true)"
              maxlength="1"
              v-model="pvArray[2]"
            />
            <input
              id="id_plate3"
              class="input_platenumber_base"
              style="left:153px;"
              @keydown="changes(3)"
              @keyup="writeP(3,$event)"
              @focus="toggleStyle(3,true)"
              maxlength="1"
              v-model="pvArray[3]"
            />
            <input
              id="id_plate4"
              class="input_platenumber_base"
              style="left:189px;"
              @keydown="changes(4)"
              @keyup="writeP(4,$event)"
              @focus="toggleStyle(4,true)"
              maxlength="1"
              v-model="pvArray[4]"
            />
            <input
              id="id_plate5"
              class="input_platenumber_base"
              style="left:225px;"
              @keydown="changes(5)"
              @keyup="writeP(5,$event)"
              @focus="toggleStyle(5,true)"
              maxlength="1"
              v-model="pvArray[5]"
            />
            <input
             @keydown="changes(6)"
              @keyup="writeP(6,$event)"
              @focus="toggleStyle(6,true)"
              id="id_plate6"
              class="input_platenumber_base1"
              style="left:225px; color:#333333;font-size:14px;
                  font-family:Microsoft YaHei;
                  font-weight:400;"
              placeholder="新能源"
              maxlength="1"
               v-model="pvArray[6]"
            />
          </div>
        </div>
        <div class="yanzheng2">
          <div v-show="chepai">请输入正确的车牌号</div>
        </div>
        <div>
          <div class="input_outer1">
            <label>电话号码:</label>
            <input
              id="id__plate0"
              class="input_platenumber_base"
              style="left:45px;"
              @keydown="changes1(0)"
              @keyup="writeP1(0,$event)"
              @focus="toggleStyle1(0,true)"
              @blur="toggleStyle1(0,false)"
              maxlength="1"
              v-model="pvArrays[0]"
            />
            <input
              id="id__plate1"
              class="input_platenumber_base"
              style="left:81px;"
              @keydown="changes1(1)"
              @keyup="writeP1(1,$event)"
              @focus="toggleStyle1(1,true)"
              @blur="toggleStyle1(1,false)"
              maxlength="1"
              v-model="pvArrays[1]"
            />
            <input
              id="id__plate2"
              class="input_platenumber_base"
              style="left:117px;"
              @keydown="changes1(2)"
              @keyup="writeP1(2,$event)"
              @focus="toggleStyle1(2,true)"
              @blur="toggleStyle1(2,false)"
              maxlength="1"
              v-model="pvArrays[2]"
            />
            <input
              id="id__plate3"
              class="input_platenumber_base"
              style="left:153px;"
              @keydown="changes1(3)"
              @keyup="writeP1(3,$event)"
              @focus="toggleStyle1(3,true)"
              @blur="toggleStyle1(3,false)"
              maxlength="1"
              v-model="pvArrays[3]"
            />
            <input
              id="id__plate4"
              class="input_platenumber_base"
              style="left:189px;"
              @keydown="changes1(4)"
              @keyup="writeP1(4,$event)"
              @focus="toggleStyle1(4,true)"
              @blur="toggleStyle1(4,false)"
              maxlength="1"
              v-model="pvArrays[4]"
            />
            <input
              id="id__plate5"
              class="input_platenumber_base"
              style="left:225px;"
              @keydown="changes1(5)"
              @keyup="writeP1(5,$event)"
              @focus="toggleStyle1(5,true)"
              @blur="toggleStyle1(5,false)"
              maxlength="1"
              v-model="pvArrays[5]"
            />
            <input
              id="id__plate6"
              class="input_platenumber_base"
              style="left:225px;"
              @keydown="changes1(6)"
              @keyup="writeP1(6,$event)"
              @focus="toggleStyle1(6,true)"
              @blur="toggleStyle1(5,false)"
              maxlength="1"
              v-model="pvArrays[6]"
            />
            <input
              id="id__plate7"
              class="input_platenumber_base"
              style="left:225px;"
              @keydown="changes1(7)"
              @keyup="writeP1(7,$event)"
              @focus="toggleStyle1(7,true)"
              @blur="toggleStyle1(5,false)"
              maxlength="1"
              v-model="pvArrays[7]"
            />
            <input
              id="id__plate8"
              class="input_platenumber_base"
              style="left:225px;"
              @keydown="changes1(8)"
              @keyup="writeP1(8,$event)"
              @focus="toggleStyle1(8,true)"
              @blur="toggleStyle1(5,false)"
              maxlength="1"
              v-model="pvArrays[8]"
            />
            <input
              id="id__plate9"
              class="input_platenumber_base"
              style="left:225px;"
              @keydown="changes1(9)"
              @keyup="writeP1(9,$event)"
              @focus="toggleStyle1(9,true)"
              @blur="toggleStyle1(5,false)"
              maxlength="1"
              v-model="pvArrays[9]"
            />
            <input
              id="id__plate10"
              class="input_platenumber_base"
              style="left:225px;"
              @keydown="changes1(10)"
              @keyup="writeP1(10,$event)"
              @focus="toggleStyle1(10,true)"
              @blur="toggleStyle1(5,false)"
              maxlength="1"
              v-model="pvArrays[10]"
            />
          </div>
        </div>
        <div class="yanzheng3">
          <div v-show="dianhua">请输入正确的电话号码</div>
        </div>
        <div class="box-input" append-to-body title="请选择" v-show="dialogVisible">
          <el-button type="text" v-for="one in provinces" @click="choose(one)">{{one}}</el-button>
        </div>
        <div class="footer-class">
          <span @click="onOfferTap">确认</span>
        </div>
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
  parkingSpaces,
  Settlement,
  sumbitdata,
  getcomelist,
  sumbitcomelist,
  amendphone,
  searchnewlist,
  operatingRecord
} from "@/api/parkCar";
import { postSelect_button } from "@/api/Jurisdiction1";
import moment from "moment";
// data数据
export default {
  components: {},
  data () {
    return {
      loading:true,
      rules: {
        vehicle_car_number: [{ required: true, message: "车牌号不能为空" }],
        vehicle_name: [{ required: true, message: "姓名不能为空" }],
        vehicle_phone: [
          { required: true, message: "电话不能为空" },
          { type: "number", message: "电话必须为数字" }
        ]
      },
      inputList: [
        { val: "" },
        { val: "" },
        { val: "" },
        { val: "" },
        { val: "" },
        { val: "" }
      ],
      tabletime: [],
      operationnote: false,
      dianhua: false,
      chepai: false,
      datum: false,
      beizhu: false,
      isDeleteHouse: false,
      value1: "", // 入场时间
      value2: "", // 入场时间戳
      yzheng: false,
      yzheng1: false,
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
      ids: [], //
      state: "", // 状态1启用2禁用
      uid: null,
      id: '',//列表id
      end_time: '',//当前时间时间戳
      entrytime: '',//入场时间时间戳
      platenumbers: '',//修改的车牌号
      phonenumber: '',//修改的电话号码
      // 操作记录
      operatingData: {
        name: "",
        time: "",
        ip: ""
      },
      // 出场结算
      Modificationcar: {
        currentTime: new Date(), // 获取当前时间
        star_time: "", // 入场时间
        price: "", // 应收金额
        long_time: "", // 停车时长
        shop_price: '',//优惠金额
        settlementamount: '',//结算金额
        centons: "" // 优惠理由
      },
      // 查询
      searchForm: {
        orderNo: ""
      },
      searchs:false,
      addcar: "", // 新增特殊车辆id
      openmn: "", // 操作
      dialogVisible: false,
      selectedProvince: "",
      inputScope: [
        "0",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "A",
        "B",
        "C",
        "D",
        "E",
        "F",
        "G",
        "H",
        "I",
        "J",
        "K",
        "L",
        "M",
        "N",
        "O",
        "P",
        "Q",
        "R",
        "S",
        "T",
        "U",
        "V",
        "W",
        "X",
        "Y",
        "Z"
      ],
      pvArray: ["", "", "", "", "", "",""],
      provinces: [
        "京",
        "沪",
        "浙",
        "苏",
        "粤",
        "鲁",
        "晋",
        "冀",
        "豫",
        "川",
        "渝",
        "辽",
        "吉",
        "黑",
        "皖",
        "鄂",
        "津",
        "贵",
        "云",
        "桂",
        "琼",
        "青",
        "新",
        "藏",
        "蒙",
        "宁",
        "甘",
        "陕",
        "闽",
        "赣",
        "湘"
      ],
      pvArrays: [],
      plcc: false,
      plcc1: false,
      ccjs: false,
      xiugai: false,
      caozuo: false
    };
  },
  async created () {
    // 获取列表
    const user = JSON.parse(localStorage.getItem("userInfo"));
    this.parkid = user.Communityid;
    this.park_id = user.Communityid;
    this.uid = user.uid;
    const userlist = user.list;
    this.parkList();
    // 拉取用户信息 按钮权限判定
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'))
    const { Communityid, uid } = this.userInfo
    const auth_id = this.$route.meta.auth_id
    const { data } = await postSelect_button({ Communityid, uid, auth_id })
    data.forEach(v => {
      if (v.auth_name === "批量出场") {
        this.plcc1 = true;
        this.plcc = this.plcc1
      }
      if (v.auth_name === "出场结算") {
        this.ccjs = true;
      }
      if (v.auth_name === "修改") {
        this.xiugai = true;
      }
      if (v.auth_name === "操作记录") {
        this.caozuo = true;
      }
    })
  },
  methods: {
    //操作记录
    async record (row) {
      const { id } = row;
      let iddcp = id;
      this.operationnote = true;
      const { data } = await operatingRecord({
        state: 6,
        id: iddcp,
       
      });
      console.log(data);
      data.time = moment(data.time * 1000).format("YYYY-MM-DD HH:mm:ss");
      this.operatingData = data;
    },
    operate () {
      this.operationnote = false;
    },
    //转换成时间戳
    formDate (time) {
      const thisTime = time.replace(/ /g, '/')
      var nowTime = new Date(thisTime)
      nowTime = nowTime.getTime() / 1000
      return nowTime
    },
    //获取当前时间
    time () {
      this.Modificationcar.currentTime = //修改数据date
        new Date().getFullYear() +
        "-" +
        this.appendZero((new Date().getMonth() + 1)) +
        "-" +
        this.appendZero(new Date().getDate()) +
        " " +
        this.appendZero(new Date().getHours()) +
        ":" +
        this.appendZero(new Date().getMinutes()) +
        ":" +
        this.appendZero(new Date().getSeconds());
      // this.gettime=data.parse(this.Modificationcar.currentTime)
      // console.log(this.gettime,"当前时间时间戳");
      this.end_time = this.formDate(this.Modificationcar.currentTime)
      console.log(this.end_time);

    },
    //时间过滤加0
    appendZero (obj) {
      if (obj < 10) {
        return "0" + obj;
      } else {
        return obj;
      }
    },
    changes (index) {
      this.pvArray.splice(index, 1, "");
    },
    showProvince () {
      this.dialogVisible = true;
      $(".input_platenumber_base").each(function () {
        this.blur();
      });
      $(".input_province").each(function () {
        this.focus();
      });
    },
    toggleStyle: function () {
      this.dialogVisible = false;
    },
    toggleStyles () {
      //  this.dialogVisible = false;
    },
    choose (p) {
      this.selectedProvince = p;
      this.dialogVisible = false;
      $("#id_plate0").focus();
    },
    writeP (id, key) {
      if (!$("#id_plate" + (id + 1)).focus().length) {
        $(".input_platenumber_base").each(function () {
          this.blur();
        });
      }
      //console.log( $('#id_plate'+(id+1)).focus());
      const k_del = 8,
        k_enter = 13,
        k_left = 37,
        k_right = 39;
      if (key.keyCode === k_del) {
        this.pvArray.splice(id, 1, "");
        $("#id_plate" + (id - 1)).focus();
        if (id === 0) {
          this.showProvince();
        }
      } else if (key.keyCode === k_left) {
        $("#id_plate" + (id - 1)).focus();
      } else if (key.keyCode === k_right) {
        $("#id_plate" + (id + 1)).focus();
      } else if (key.keyCode === k_enter) {
        $(".input_platenumber_base").each(function () {
          this.blur();
        });
      } else {
        let cv = this.pvArray[id];
        if (/^\w$/.test(cv)) {
          this.pvArray.splice(id, 1, cv.toUpperCase());
        } else {
          this.pvArray.splice(id, 1, "");
        }
      }
    },
    changes1 (index) {
      this.pvArrays.splice(index, 1, "");
    },
    showProvince1 () {
      this.dialogVisible = true;
      $(".input_platenumber_base").each(function () {
        this.blur();
      });
    },
    toggleStyle1: function () {
      this.dialogVisible = false;
    },
    writeP1 (id, key) {
      if (!$("#id__plate" + (id + 1)).focus().length) {
        $(".input_platenumber_base").each(function () {
          this.blur();
        });
      }
      //console.log( $('#id__plate'+(id+1)).focus());
      const k_del = 8,
        k_enter = 13,
        k_left = 37,
        k_right = 39;
      if (key.keyCode === k_del) {
        this.pvArrays.splice(id, 1, "");
        $("#id__plate" + (id - 1)).focus();
        if (id === 0) {
          $(".input_platenumber_base").each(function () {
            this.blur();
          });
        }
      } else if (key.keyCode === k_left) {
        $("#id__plate" + (id - 1)).focus();
      } else if (key.keyCode === k_right) {
        $("#id__plate" + (id + 1)).focus();
      } else if (key.keyCode === k_enter) {
        $(".input_platenumber_base").each(function () {
          this.blur();
        });
      } else {
        let cv = this.pvArrays[id];
        if (/^\w$/.test(cv)) {
          this.pvArrays.splice(id, 1, cv.toUpperCase());
        } else {
          this.pvArrays.splice(id, 1, "");
        }
      }
    },
    //修改车牌号电话号码
    async onOfferTap () {
      this.platenumbers = this.selectedProvince + this.pvArray.join(""),
        this.phonenumber = this.pvArrays.join("")
        console.log(this.platenumbers,"车牌");
      var carNumberReg = /^(([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z](([0-9]{5}[DF])|([DF]([A-HJ-NP-Z0-9])[0-9]{4})))|([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z][A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳使领]))$/
      var phonerReg = /^1[3456789]\d{9}$/
      //console.log(phonerReg.test(this.phonenumber));
      //console.log(carNumberReg.test(this.platenumbers));
      if (!carNumberReg.test(this.platenumbers)) {
        this.chepai = true;
        setTimeout(() => {
          this.chepai = false;
        }, 2000)
      } else if (!phonerReg.test(this.phonenumber)) {
        this.dianhua = true;
        setTimeout(() => {
          this.dianhua = false;
        }, 2000)
      } else {
        const { msg } = await amendphone({
          phone: this.phonenumber,
          car_number: this.platenumbers,
          id: this.id,
          parkid: this.parkid,
           uid:this.uid
        })
        if (msg === 1) {
          this.remindercar = false;
          this.parkList();
          Message({
            type: "success",
            message: "修改成功"
          });
        } else if (msg === 2) {
          Message.error("非常抱歉,您未修改任何数据");
        } else {
          Message.error("修改失败");
        }
      }

    },
    // 分页设置
    handleCurrentChange (val) {
      this.currentPage = val;
      this.parkList();
    },
       handleCurrentChange1 (val) {
    this.currentPage = val;
      this.search();
    },
    // 出场结算
    async compile (row) {
      this.Modificationcar.shop_price = ""
      this.Modificationcar.settlementamount = ""
      this.Modificationcar.centons = ""
      this.time()
      this.Modification = true;
      const {
        id,
        star_time,
      } = row;
      const { data } = await Settlement({ id })
      console.log(data);
      this.entrytime = data.endtime - data.star_time
      this.id = id;
      this.Modificationcar.star_time = star_time;
      this.Modificationcar.price = data.price
      this.Modificationcar.long_time = data.long_time;
      this.Modificationcar.settlementamount=data.price
      // console.log(this.entrytime);
    },
    changenumber(){
      this.Modificationcar.settlementamount=this.Modificationcar.price-this.Modificationcar.shop_price
    },
    // 确认出场
    async affirm () {
      if (!this.Modificationcar.settlementamount) {
        this.isDeleteHouse = true;
        setTimeout(() => {
          this.isDeleteHouse = false;
        }, 2000)
      } else {
        const data = await sumbitdata({
          id: this.id,
          parkid: this.parkid,
          ying_price: this.Modificationcar.price,
          shop_price: this.Modificationcar.shop_price,
          price: this.Modificationcar.settlementamount,
          centons: this.Modificationcar.centons,
          end_time: this.end_time,
          car_long_time: this.entrytime,
           uid:this.uid
        })
        console.log(data);
        if (data.msg === 1) {
          this.Modification = false;
          this.parkList();
          Message({
            type: "success",
            message: "出场成功"
          });
        } else {
          // 失败
          Message.error("出场失败");
        }
      }



    },
    // 批量出场弹框打开
    addor () {
      this.centerDialogVisible1 = true;
      this.value1 = '';
      this.tabletime = []
      this.datum = false;
      this.beizhu = false;
      this.ids = []
    },
    async shijiao () {
        // setTimeout(() => {
        //   loading.close();
        // }, 2000);
      if (!this.value1) {
        this.beizhu = true;
        setTimeout(() => {
          this.beizhu = false;
        }, 2000);
      } else {
          console.log(this.value1);
        const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        //console.log(this.value1);
        var d = new Date(this.value1);
        //转换成标准格式
        d = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
        this.value2 = this.formDate(d)
        const { data } = await getcomelist({
          star_time: this.value2,
          parkid: this.parkid
        })
        console.log(data);
        data.forEach(v => {
           if(v.star_time===0){
            v.star_time="-"
          }else{
            v.star_time=moment(v.star_time*1000).format('YYYY-MM-DD HH:mm:ss')
          }
        })
        this.tabletime = data
        if (!this.tabletime.length) {
          this.$message.error("该时间之前暂无车辆停放");
        } else {
          loading.close();
          this.beizhu = false;
          this.datum = true;
        }
      }
     
    },
    //获取批量出场列表
    async submitForm () {

    },
    //获取选中状态的数据
    handleSelectionChange (rows) {
      //console.log(rows);
      this.ids = rows.map(v => v.id).join(",")
      //console.log(this.ids);
    },
    //提交出场列表
    async sumbitList () {
      if (!this.ids.length) {
        this.$message.error("请先选中数据");
      } else {
        const data = await sumbitcomelist({
          id: this.ids,
          parkid: this.parkid,
           uid:this.uid
        })
        if (data.msg === 1) {
          this.centerDialogVisible1 = false;
          this.parkList();
          Message({
            type: "success",
            message: "出场成功"
          });
        } else {
          // 失败
          Message.error("出场失败");
        }
      }
    },
    // 修改车牌
    forbidden (row) {
      console.log(row);

      this.remindercar = true;
      const { id } = row;
      this.id = id;
      this.pvArray = [];
      this.pvArrays = [];
      this.selectedProvince = "";
      this.dialogVisible = false;
      if (row.phone) {
        this.pvArrays = row.phone.split('')
      }
      this.selectedProvince = row.car_number.split('').slice(0, 1)
      this.pvArray = row.car_number.split('')
      this.pvArray.shift()
    },
    // 查询
    async search () {
      // console.log(this.searchForm.orderNo);
      if (this.searchForm.orderNo) {
        const { data } = await searchnewlist({
          page: this.currentPage,
          size: this.pageSize,
          parkid: this.parkid,
          name: this.searchForm.orderNo
        });
           data.data.forEach(v => {
          if(v.star_time===0){
            v.star_time="-"
          }else{
            v.star_time=moment(v.star_time*1000).format('YYYY-MM-DD HH:mm:ss')
          }
      });
        console.log(data);
        if (data.total) {
          this.tableData = data.data;
          this.totalPage = data.total; // 总条数
          this.pageNums = data.pageNum; //总页数
          this.plcc = false
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
      const { data } = await parkingSpaces({
        page: this.currentPage,
        size: this.pageSize,
        parkid: this.parkid,
        uid: this.uid
      });
      console.log(data);
      data.data.forEach(v => {
          if(v.star_time===0){
            v.star_time="-"
          }else{
            v.star_time=moment(v.star_time*1000).format('YYYY-MM-DD HH:mm:ss')
          }
      });

      this.tableData = data.data;
      this.totalPage = data.total; // 总条数
      this.pageNums = data.pageNum; // 总页数
    },
    // 清除
    clear () {
      this.tableData = [];
      this.back = false;
      this.parkList();
      this.searchForm.orderNo = "";
      this.plcc = this.plcc1
        this.searchs = false;
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
  line-height: 0px;
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
          width: 220px !important;
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
        .one {
          color: rgba(170, 170, 170, 1);
        }
        .two {
          color: #ff0000;
        }
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
      margin-top: 20px;
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
    height: 607px;
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
      padding: 24px 1px 25px 1px;
      .el-myclass {
        padding-left: 55px;
        height: 65px !important;
        /deep/ .el-form-item__label {
          padding: 0 8px 0 0;
          text-align: left;
           cursor: default !important;
        }
        /deep/.el-input__inner {
          // background-color: #f00;
          width: 80% !important;
          height: 32px !important;
          border: 1px solid rgba(210, 210, 210, 1) !important;
          border-radius: 4px !important;
          color: #333333;
          padding: 0px 7px;
          cursor: default !important;
        }
      }
    }
    .footer-class {
      // background-color: #f00;
      cursor: pointer;
      height: 30px;
      display: flex;
      justify-content: center;
      margin-top: 420px;
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
      margin-bottom: 18px;
      height: 40px !important;
      .el-form-item__error {
        padding-top: 0px !important;
      }
    }
    .lastinput {
      margin-bottom: 0px !important;
      height: 40px;
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
            width: 80%;
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
    height: 250px;
    border-radius: 5px;
      //  display: flex;
      //  flex-direction: column;
      //  margin:0 !important;
      //  position: fixed;
      //  top:50%;
      //  left:50%;
      //  transform:translate(-50%,-50%);
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
      /deep/.inputs {
        margin-left: 53px;
        /deep/.border-input {
          width: 32px !important;
          height: 32px !important;
          margin-top: 30px;
          margin-left: 10px;
          text-align: center;
        }
      }
    }

    .footer-class {
      // background-color: #f00;
      height: 30px;
      display: flex;
      justify-content: center;
      margin-top: 4px;
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
  margin-left: 90px;
  width: 300px;
  line-height: 12px;
  height: 12px;
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

.typer {
  position: fixed;
  z-index: 99999999999999999999;
  width: 100%;
  height: 380px;
  background: #fff;
  color: black;
  bottom: 0px;
  ul {
    display: flex;
    flex-wrap: wrap;
    li {
      width: 10vw;
      height: 10vw;
      text-align: center;
      line-height: 10vw;
    }
  }
}
.input_outer {
  height: 40px;
  width: 100%;
  position: relative;
  top: 30px;
  left: 104px;
}
.input_outer1 {
  height: 40px;
  width: 100%;
  position: relative;
  top: 3px;
  left: 47px;
}
.input_province {
  margin-left: 12px;
  text-align: center;
  width: 32px;
  height: 32px;
  border: 1px solid rgba(210, 210, 210, 1);
  border-radius: 4px;
  outline: 0;
  font-size: 14px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: rgba(51, 51, 51, 1);
  /*#0861fc*/
}
.input_outer .input_platenumber_base:last-child {
  border-right: 1px solid #c5c5c5;
}
.input_platenumber_base {
  text-align: center;
  width: 32px;
  height: 32px;
  border: 1px solid rgba(210, 210, 210, 1);
  border-radius: 4px;
  top: 0;
  outline: 0;
  font-size: 14px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: rgba(51, 51, 51, 1);
  margin-left: 10px;
}
.input_platenumber_base1 {
  text-align: center;
  width: 45px;
  height: 32px;
  border: 1px solid rgba(210, 210, 210, 1);
  border-radius: 4px;
  top: 0;
  outline: 0;
  font-family: "黑体";
  font-size: 12px;
  font-weight: 400;
  color: rgba(213, 216, 223, 1);
  margin-left: 10px;
}
.focus_style {
  /*已获得焦点样式*/
  border: 1px solid rgba(82, 168, 236, 0.8);
  border-radius: 2px;
  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075),
    0 0 8px rgba(82, 168, 236, 0.6);
  -webkit-box-shadow: inset 0px 2px 2px rgba(0, 0, 0, 0.75),
    0 0 8px rgba(82, 168, 236, 0.6);
}
.box-input {
  padding: 65px 24% 50px 24%;
  width: 100%;
  height: 500px;
  background: #fff;
  z-index: 99999999999999;
  position: fixed;
  top: 60%;
  left: 0;
  .el-button {
    width: 58px;
    height: 58px;
    background: rgba(253, 254, 254, 1);
    border: 1px solid rgba(190, 200, 208, 1);
    border-radius: 5px;
    font-size: 24px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
    margin-bottom: 44px;
    margin-right: 20px;
  }
}
.yanzheng1 {
  color: #ff0000;
  font-size: 14px;
  margin-left: 100px;
  width: 150px;
  line-height: 12px;
  height: 20px;
}
.yanzheng2 {
  color: #ff0000;
  font-size: 14px;
  margin-left: 160px;
  width: 150px;
  line-height: 12px;
  height: 20px;
  margin-top: 28px;
}
.yanzheng3 {
  color: #ff0000;
  font-size: 14px;
  margin-left: 116px;
  width: 150px;
  line-height: 12px;
  height: 20px;
}
.operationnote {
  /deep/.el-dialog {
    min-width: 380px;
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
</style>
