
<template>
  <div id="house-details">
    <span v-show="showDot" class="dot" />

    <el-dialog
      title="提示"
      :visible.sync="centerDialogVisible1"
      :append-to-body="true"
      custom-class="myConfirm"
      :close-on-click-modal="false"
      width="250"
      center
    >
      <p style="text-align:center;">确认导入以下房屋?</p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelImport">取 消</el-button>
        <el-button type="primary" @click="didConfirmImport">确 定</el-button>
      </span>
    </el-dialog>
    <div v-if="houseDetailShow">
      <!-- <router-view /> -->
      <!--搜索栏-->
      <div slot="header" class="clearfix">
        <div v-if="isMainBox" class="box-header">
          <span
            v-if="ask.import"
            v-show="!isShowExcel"
            class="load-btn"
            @click="clickDownLoad"
          >下载房屋模板</span>
          <span v-if="ask.add" v-show="!isShowExcel" class="add-btn" @click="clickAddHouse">添加房屋</span>

          <span v-if="!isError" v-show="isShowExcel" class="add-btn" @click="backToLastPage">返回上一级</span>
          <span
            v-if="!isError"
            v-show="isShowExcel"
            class="add-btn1"
            style="margin-left:14px;"
            @click="excelImport"
          >确认导入</span>
          <span
            v-if="isError"
            v-show="isShowExcel"
            style="background:#F8AC59"
            class="add-btn"
            @click="ok"
          >确认</span>
          <span
            v-if="isError"
            style="position:absolute;left:72px;top:5px;color:#f44; font-size:14px;"
          >提示: 您有数据未导入成功,请记录并修改后再次重新导入</span>
          <div
            @click="clickImportHouse"
            style="display:inline-block;width:73px;height:30px;"
            v-if="ask.import "
          >
            <el-upload
              v-if="houseTypeList.length"
              v-show="!isShowExcel"
              action="#"
              multiple
              ref="upload1"
              :before-upload="beforeUpload"
              :limit="1"
            >
              <el-button size="small" type="primary" class="add-btn1">导入房屋</el-button>
            </el-upload>
            <el-button size="small" type="primary" class="add-btn1" v-else>导入房屋</el-button>
          </div>
          <!-- 搜索框 -->
          <span v-show="!isShowExcel" class="search-btn" @click="getSearchLists">
            <svg-icon icon-class="search1" />
          </span>
          <el-input
            style="color:#f00;"
            v-show="!isShowExcel"
            v-model="searchData"
            class="sreach-box"
            placeholder="请输入搜索内容"
            @keyup.enter.native="getSearchLists"
          />
        </div>

        <div v-if="!isMainBox" class="box-header">
          <span class="add-btn" style="background:#25BAD9;" @click="backToLastPage">返回上一级</span>
        </div>
      </div>
      <!-- 房屋列表  -->
      <div v-if="!isShowExcel" class="table-box">
        <el-table
          empty-text="暂无数据"
          :data="tableData"
          row-class-name="myRow"
          cell-class-name="myCell"
          style="width: 100%; height:100%;"
          v-loading.fullscreen="loadingExcel"
          element-loading-text="拼命加载中"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.8)"
        >
          <el-table-column prop="userHouseBuilding" label="楼栋" min-width="50" />
          <el-table-column prop="userHouseUnit" label="单元" min-width="50" />
          <el-table-column prop="userHouseNumber" label="门牌号" min-width="65" />
          <el-table-column prop="typeName" label="房屋类型" min-width="80" />
          <el-table-column prop="Housingarea" label="房屋面积(m²)" min-width="120" />

          <el-table-column prop="Price" label="物业费单价(元)" min-width="120" />
          <el-table-column label="房屋状态" min-width="90">
            <template slot-scope="scope1">
              <p v-html="scope1.row.state===1?'未交房':'已交房'"></p>
              <p
                :class="scope1.row.zx_tapy===1?'red':''"
                style="font-size:12px;"
                v-html="scope1.row.zx_tapy===1?'(装修未办理)':'(装修已办理)'"
              >({{ scope1.row.zx_tapy }})</p>
            </template>
          </el-table-column>
          <el-table-column prop="checktime" label="交房时间" min-width="100" />
          <el-table-column prop="wuye_price" label="物业费到期时间" min-width="120" />
          <el-table-column prop="centn" class-name="note" label="房屋备注" min-width="160" />
          <el-table-column label="操作" min-width="320">
            <template slot-scope="scope">
              <el-button
                v-if="ask.modify"
                type="text"
                size="small"
                class="operateBtn btn-modify"
                style="height:30px; width:52px; "
                @click="handleModifyClick(scope.row)"
              >修改</el-button>
              <el-button
                v-if="ask.houseInfo"
                type="text"
                size="small"
                class="operateBtn btn-modify"
                style="width:72px; height:30px; margin-left:8px; background:#1FBBA6"
                @click="handleUserInfoClick(scope.row)"
              >住户信息</el-button>
              <el-button
                v-if="ask.carInfo"
                type="text"
                size="small"
                class="operateBtn btn-modify"
                style="width:72px; height:30px; margin-left:8px;"
                @click="handleCarInfoClick(scope.row)"
              >车位信息</el-button>
              <el-button
                v-if="ask.record"
                size="small"
                class="operateBtn btn-record"
                style="width:72px; height:30px; margin-left:8px; background-color:#ccc; border:1px solid #ccc;"
                @click="handleRecordClick(scope.row)"
              >操作记录</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-if="isShowExcel" class="table-box">
        <!-- 展示Excel -->

        <el-table
          v-if="isShowExcel"
          class="rollTable"
          empty-text="暂无数据"
          :data="excelData"
          row-class-name="myRow"
          cell-class-name="myCell"
          style="width: 100%; height:100%;"
          v-loading.fullscreen="loadingExcel1"
          element-loading-text="导入中，请耐心等待..."
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.8)"
        >
          <el-table-column :prop="prop[0]" label="楼栋" min-width="100" />
          <el-table-column :prop="prop[1]" label="单元" min-width="100" />
          <el-table-column :prop="prop[2]" label="门牌号" min-width="100" />
          <el-table-column :prop="prop[3]" label="房屋类型" min-width="100" />
          <el-table-column :prop="prop[4]" label="房屋面积(m²)" min-width="100" />
          <el-table-column :prop="prop[5]" label="交房时间" min-width="100" />
          <el-table-column v-if="amazing" :prop="prop[6]" label="物业费到期时间" min-width="100" />
          <!-- <el-table-column :prop="prop[6]" label="交房时间" min-width="100" /> -->
          <!-- <el-table-column :prop="prop[6]" label="物业费到期时间" min-width="100" /> -->
          <el-table-column v-if="prop.length===8" :prop="prop[7]" label="失败原因" min-width="100" />
        </el-table>
      </div>
      <!-- 分页 -->
      <my-pages
        v-if="!isShowExcel"
        :pageInfo="pageInfo"
        @handleCurrentChange="handleCurrentChange"
        class="myfenye"
      ></my-pages>
      <!-- 操作记录 -->
      <el-dialog
        title="操作记录"
        :modal="true"
        :append-to-body="true"
        :visible.sync="RecordialogFormVisible"
        :close-on-click-modal="false"
        custom-class="myRecordForm"
      >
        <el-form :model="recordData">
          <el-form-item label="上次操作员:" :label-width="formLabelWidth">
            <el-input
              v-model="recordData.uname"
              :disabled="true"
              autocomplete="off"
              class="operration-class"
            />
          </el-form-item>
          <el-form-item label="上次操作时间:" :label-width="formLabelWidth">
            <el-input
              v-model="recordData.time"
              :disabled="true"
              autocomplete="off"
              class="operration-class"
            />
          </el-form-item>
          <el-form-item label="上次操作IP地址:" :label-width="formLabelWidth">
            <el-input
              v-model="recordData.ip"
              :disabled="true"
              autocomplete="off"
              class="operration-class"
            />
          </el-form-item>
          <el-form-item v-if="recordData.code === 5" label="上次审核人:" :label-width="formLabelWidth">
            <el-input
              v-model="recordData.usname"
              :disabled="true"
              autocomplete="off"
              class="operration-class"
            />
          </el-form-item>
          <el-form-item v-if="recordData.code === 5" label="上次审核时间:" :label-width="formLabelWidth">
            <el-input
              v-model="recordData.times"
              :disabled="true"
              autocomplete="off"
              class="operration-class"
            />
          </el-form-item>
          <el-form-item
            v-if="recordData.code === 5"
            label="上次审核结果:"
            :label-width="formLabelWidth"
            class="hh-class"
          >
            <textarea v-model="newResult" autofocus :disabled="true" class="textarea-class" />
          </el-form-item>
        </el-form>
        <div
          v-if="recordData.code === 5"
          class="btn-confirm-record"
          @click="RecordialogFormVisible=false"
        >确认</div>
        <div v-else class="btn-confirm-record1" @click="RecordialogFormVisible=false">确认</div>
      </el-dialog>

      <!-- 添加弹框 -->
      <el-dialog
        title="添加房屋"
        custom-class="myAddFormDetail"
        class="position:absolute;top:10px;"
        :append-to-body="true"
        :visible.sync="AdddialogVisible"
        :before-close="handleAddClose"
        :close-on-click-modal="false"
      >
        <el-form ref="form" :model="addData" label-width="80px">
          <el-form-item label="房屋类型:" class="houseclass">
            <el-select v-model="addData.oid" placeholder="请选择" class="fwType-class" no-data-text>
              <el-option
                v-for="item in houseTypeList"
                :key="item.oid"
                :label="item.typeName"
                :value="item.oid"
              />
            </el-select>
            <span class="tips">{{addTips1}}</span>
          </el-form-item>
          <el-form-item label="楼栋:">
            <el-input v-model.trim="addData.userHouseBuilding" />
            <span class="tips">{{addTips2}}</span>
          </el-form-item>
          <el-form-item label="单元:">
            <el-input v-model.trim="addData.userHouseUnit" />
            <span class="tips">{{addTips3}}</span>
          </el-form-item>
          <el-form-item label="门牌号:">
            <el-input v-model.trim="addData.userHouseNumber" />
            <span class="tips">{{addTips4}}</span>
          </el-form-item>
          <el-form-item label="房屋面积:">
            <el-input v-model.trim="addData.Housingarea" class="m" />
            <span class="tips">{{addTips5}}</span>
          </el-form-item>
          <el-form-item label="开始时间:">
            <div class="block">
              <el-date-picker
                v-model="addData.checktime"
                style="padding-left:20px"
                type="date"
                placeholder
              />
            </div>
          </el-form-item>
          <el-form-item v-show="addData.checktime" label="到期时间:">
            <el-date-picker
              v-model="addData.wuye_price"
              style="padding-left:20px"
              type="date"
              placeholder
            />
            <span class="tips">{{addTips6}}</span>
          </el-form-item>
          <div class="row" style="position:relative; height:90px;">
            <span style="position:absolute;left:0;padding-right:12px;margin-top:5px;">房屋备注:</span>
            <textarea
              v-model.trim="addData.centn"
              rows="1"
              cols="40"
              style="line-height: 18px;outline:none;width:260px;border-radius: 4px;
            color: #333;border:1px solid #D2D2D2;position:absolute;left:80px;resize:none;min-height:100px;padding:8px;overflow:scroll;overflow-y:hidden;overflow-x:hidden"
            />
          </div>
          <div
            class="addNow"
            style="cursor:pointer"
            @click="clickConfirmAdd"
            v-loading="loadingAdd"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.8)"
          >确认添加</div>
        </el-form>
      </el-dialog>

      <!-- 修改表格 -->
      <el-dialog
        title="修改"
        custom-class="myForm"
        class="position:fixed;top:10px;"
        :append-to-body="true"
        :visible.sync="ModifydialogVisible"
        :before-close="handleAddClose1"
        :close-on-click-modal="false"
      >
        <p
          style="position:absolute;right:20px;top:50px;cursor:pointer;color:#999999;font-size:12px;"
          @click="shenqingHandler"
        >
          <svg-icon icon-class="warning" style="font-size:14px;" />&nbsp;申请修改详情
        </p>
        <el-form ref="form1" :model="modifyData" label-width="80px">
          <el-form-item v-if="isShowHouseTime" label="交房时间:">
            <!-- <el-input v-model.number="addData.checktime" /> -->
            <div class="block">
              <el-date-picker v-model="modifyData.checktime" type="date" placeholder="选择日期" />
            </div>
            <p v-if="tips.checktime" class="tips">请填写时间</p>
          </el-form-item>
          <div class="row" style="position:relative; height:100px;">
            <span style="position:absolute;left:0;line-height:30px;">房屋备注:</span>
            <textarea
              v-model="modifyData.centn"
              rows="1"
              cols="40"
              style="width:222px;border:1px solod #d2d2d2;border-radius:4px;min-height:100px;outline:none;position:absolute;left:80px;border-color:#d2d2d2;resize:none;padding:8px;overflow:scroll;overflow-y:hidden;overflow-x:hidden;letter-spacing:2px;"
              onfocus="window.activeobj=this;this.clock=setInterval(function(){activeobj.style.height=activeobj.scrollHeight+'px';},10);"
              onblur="clearInterval(this.clock);"
            />
          </div>

          <div
            class="addNow"
            style="cursor:pointer"
            @click="clickConfirmModify"
            v-loading="loadingModi1"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.8)"
          >确认修改</div>
        </el-form>
      </el-dialog>

      <!-- 申请修改详情 -->
      <el-dialog
        title="申请修改详情"
        custom-class="myAddForm"
        class="position:fixed;top:10px;"
        :append-to-body="true"
        :visible.sync="detailFormVisible"
        :close-on-click-modal="false"
        :before-close="handleAddClose2"
      >
        <el-checkbox v-model="isDeleteHouse" class="de">申请删除房屋</el-checkbox>

        <el-form ref="form2" :model="modifyData" label-width="380px">
          <div v-show="!isDeleteHouse">
            <div class="row">
              <span class="t1">房屋类型:</span>
              <span class="t2">{{ originData.typeName }}</span>
              <span class="t3">修改为:</span>
              <el-select v-model="modifyData.oid" filterable placeholder="请选择修改" class="typeclass">
                <el-option
                  v-for="item in houseTypeList"
                  :key="item.oid"
                  :label="item.typeName"
                  :value="item.oid"
                />
              </el-select>
              <!-- {{modifyData.oid}} -->
            </div>
            <div class="row">
              <span class="t1">楼栋:</span>
              <span class="t2">{{ originData.userHouseBuilding }}</span>
              <span class="t3">修改为:</span>
              <input v-model.trim="modifyData.userHouseBuilding" class="t4" />
              <p class="tips">{{modifyDetailsTips1}}</p>
            </div>
            <div class="row">
              <span class="t1">单元:</span>
              <span class="t2">{{ originData.userHouseUnit }}</span>
              <span class="t3">修改为:</span>
              <input v-model.trim="modifyData.userHouseUnit" class="t4" />
              <p class="tips">{{modifyDetailsTips2}}</p>
            </div>
            <div class="row">
              <span class="t1">门牌号:</span>
              <span class="t2">{{ originData.userHouseNumber }}</span>
              <span class="t3">修改为:</span>
              <input v-model.trim="modifyData.userHouseNumber" class="t4" />
              <p class="tips">{{modifyDetailsTips3}}</p>
            </div>
            <div class="row">
              <span class="t1">房屋面积:</span>
              <span class="t2">{{ originData.Housingarea }}</span>
              <span class="t3">修改为:</span>
              <input v-model.trim="modifyData.Housingarea" class="t4" />
            </div>
            <div class="row">
              <span class="t1">物业费单价:</span>
              <span class="t2">{{ originData.Price }}</span>
              <span class="t3">修改为:</span>
              <input v-model.trim="modifyData.Price" class="t4" />
            </div>
          </div>

          <div class="row" style="position:relative; height:100px;" v-show="!isDeleteHouse">
            <span class="t1" style="margin-top:5px;">*申请理由:</span>
            <textarea
              v-model.trim="modifyData.centns"
              rows="1"
              cols="40"
              style="min-height:100px;border-radius:4px;border:1px solid #d2d2d2;outline:none;position:absolute;left:85px;resize:none;width:289px;min-width:284px;padding:8px;overflow:scroll;overflow-y:hidden;overflow-x:hidden;"
              onfocus="window.activeobj=this;this.clock=setInterval(function(){activeobj.style.height=activeobj.scrollHeight+'px';},10);"
              onblur="clearInterval(this.clock);"
            />
            <p class="tips" style="left:85px !important;top:100px">{{modifyDetailsTips4}}</p>
          </div>
          <div class="row" style="position:relative; height:100px;" v-show="isDeleteHouse">
            <span class="t1" style="margin-top:5px;">*申请理由:</span>
            <textarea
              v-model.trim="shanchuCenten"
              rows="1"
              cols="40"
              style="min-height:100px;border-radius:4px;border:1px solid #d2d2d2;outline:none;position:absolute;left:85px;resize:none;width:289px;min-width:284px;padding:8px;overflow:scroll;overflow-y:hidden;overflow-x:hidden;"
              onfocus="window.activeobj=this;this.clock=setInterval(function(){activeobj.style.height=activeobj.scrollHeight+'px';},10);"
              onblur="clearInterval(this.clock);"
            />
            <p class="tips" style="left:85px !important;top:100px">{{modifyDetailsTips4}}</p>
          </div>
          <div
            v-if="!isDeleteHouse"
            class="addNow"
            style="cursor:pointer"
            @click="clickConfirmModify1"
            v-loading="loadingModi2"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.8)"
          >确认修改</div>
          <div
            v-if="isDeleteHouse"
            class="addNow"
            style="cursor:pointer"
            @click="clickConfirmModify2"
            v-loading="loadingModi3"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.8)"
          >申请删除</div>
        </el-form>
      </el-dialog>
    </div>
    <!-- 住户信息模块 -->
    <resident-info
      v-else
      :houseid="houseid"
      :housenumber="housenumber"
      @isShowHouse="isShowHouse1"
    />
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { postUpdet_house, postDownLoadHouse, postSelect_examine, postdetele_house, postExcel_import, postDownload_file, postSelect_house, postinsert_type1, postInsert_house, postSelect_single, postSelect_search, postUpde_house, postDownLoad, postDownLoad1 } from '@/api/House.js'
import axios from 'axios'
import ResidentInfo from './ResidentInfo'
import { postSelect_button } from '@/api/Jurisdiction'
export default {
  name: 'HouseDetails',
  components: {
    ResidentInfo
  },
  // data数据
  data () {
    return {
      shanchuCenten:'',
      loadingExcel: false,//Excel的加载中
      loadingExcel1: false,//Excel的二次加载中
      newResult: '',
      doImport: false,
      centerDialogVisible1: false,
      ask: {//按钮权限控制
        add: '',
        import: '',
        modify: '',
        houseInfo: '',
        carInfo: '',
        record: '',
        download: ''
      },
      showDot: false,
      amazing: true,
      tips: {
        checktime: false, // 交房时间是否为空
        isExist: false, // 要修改的房屋是否已存在
        reason: false // 是否填写申请理由
      },
      housenumber: '',
      houseid: null,
      houseDetailShow: true,
      prop: ['1', '2', '3', '4', '5', '6', '7'],
      isShowTip: false,
      isError: false,
      dr_nameId: '', // 点击确认导入传给后台的id
      excelData: [],
      isShowExcel: false,
      fileList: [],
      originData: '',//点击修改时的当条数据
      isShowHouseTime: true,
      isDeleteHouse: false, // 申请删除房屋
      isMainBox: true,
      token: '',
      searchData: '', // 搜索的内容
      //分页的信息
      pageInfo: {
        total: 0,//总条数
        listRows: 10,//page-size
        page: 1,//当前页
      },
      // pt: '',
      // pn: '',
      // 操作记录
      formLabelWidth: '113px', // 记录表格宽度
      RecordialogFormVisible: false,
      recordData: {},
      houseTypeList: [
        // {
        //   oid: 55,
        //   typeName: '商业'
        // }
      ], // 房屋类型列表
      existedType: [], // 已近存在的房屋类型
      tableData: [
        // {
        //   'userHouseId': 1, // 房屋主键id
        //   'userHouseBuilding': 0, // 楼栋
        //   'userHouseUnit': 0, // 单元
        //   'userHouseNumber': 0, // 门牌
        //   'Housingarea': null, // 房屋面积
        //   'typeName': null, // 房屋类型名称
        //   'Price': null, // 物业费单价
        //   'state': '未交房', // 是否交房
        //   'zx_tapy': '装修未办理', // 装修是否办理
        //   'checktime': null, // 交房时间
        //   'wuye_price': null, // 房屋物业到期时间
        //   'centn': null, // 房屋备注
        //   'time': null, // 操作时间
        //   'uname': null, // 添加修改操作人
        //   'ip': null, // 上次操作ip
        //   'usname': null, // 审核人
        //   'times': null, // 审核时间
        //   'Result': ''// 审核结果
        // }
      ],
      tableData1: [], // 存储搜索或添加后的结果
      n1: false, // 不为空
      n2: false,
      n3: false,
      n4: false,
      n5: false,
      e: false,
      AdddialogVisible: false, // 添加框
      ModifydialogVisible: false, // 修改框
      addData: {
        oid: '', // 房屋类型id
        userHouseBuilding: '', // 楼栋
        userHouseUnit: '', // 单元
        userHouseNumber: '', // 门牌号
        Housingarea: '', // 房屋面积
        checktime: '', // 交房时间
        wuye_price: '', // 到期时间
        centn: '', // 房屋备注
      },
      modifyData: {
        'uname': '', // 操作人
        'userHouseId': '', // 房屋主键id (已交房 只修改备注)
        'centn': '', // 修改的备 (未交房 修改备注和时间)
        'checktime': '', // 交房时间
        'Communityid': '', // 小区id (已交房和未交房)
        'oid': '', // 房屋类型主键id
        'userHouseBuilding': '', // 楼栋
        'userHouseUnit': '', // 单元
        'userHouseNumber': '', // 门牌
        'Housingarea': '', // 房屋面积
        'Price': '', // 物业单价
        'centns': ''// 申请理由
      },
      modifyType: {
        centOnly: false,
        centAndTime: false
      },
      detailFormVisible: false,
      userInfo: {},// 登录用户相关信息
      addTips1: '',//添加时选择房屋类型提示语
      addTips2: '',//添加时选择楼栋提示语
      addTips3: '',//添加时选择单元类型提示语
      addTips4: '',//添加时选择门牌号提示语
      addTips5: '',//添加时选择房屋面积提示语
      addTips6: '',//到期时间提示语
      fenyeType: 1,//1代表正常分页2代表搜索分页3代表查询单个
      userHouseId: null,//查询单个数据时的userHouseId
      modifyDetailsTips1: '',//修改时提示楼栋已经存在
      modifyDetailsTips2: '',//修改时提示单元已经存在
      modifyDetailsTips3: '',//修改时提示门牌号已经存在
      modifyDetailsTips4: '',//修改时提示申请理由
      loadingAdd: false,//加载控制之确认添加
      loadingModi1: false,//加载控制之确认修改1
      loadingModi2: false,//加载控制之确认修改2
      loadingModi3: false,//加载控制之确认修改3
      loadingModi4: false,//加载控制之确认修改4
    }
  },
  computed: {
    ...mapState(['secondRouterLists']),
  },
  watch: {
    'addData.userHouseBuilding': {
      handler (n, o) {
        n = String(n)
        if (Number(n) == n) {
          if (n.includes('.')) {
            this.addData.userHouseBuilding = n.slice(0, n.indexOf('.'))
          }
          if (n.slice(0, 1) === '0') {
            this.addData.userHouseBuilding = n.slice(1)
          }
        } else {
          this.addData.userHouseBuilding = o
        }
      },
      deep: true,
      immediate: true
    },
    'addData.userHouseUnit': {
      handler (n, o) {
        n = String(n)
        if (Number(n) == n) {
          if (n.includes('.')) {
            this.addData.userHouseUnit = n.slice(0, n.indexOf('.'))
          }
          if (n.slice(0, 1) === '0') {
            this.addData.userHouseUnit = n.slice(1)
          }
        } else {
          this.addData.userHouseUnit = o
        }
      },
      deep: true,
      immediate: true
    },
    'addData.userHouseNumber': {
      handler (n, o) {
        n = String(n)
        if (Number(n) == n) {
          if (n.includes('.')) {
            this.addData.userHouseNumber = n.slice(0, n.indexOf('.'))
          }
          if (n.slice(0, 1) === '0') {
            this.addData.userHouseNumber = n.slice(1)
          }
        } else {
          this.addData.userHouseNumber = o
        }
      },
      deep: true,
      immediate: true
    },
    'modifyData.userHouseBuilding': {
      handler (n, o) {
        n = String(n)
        if (Number(n) == n) {
          if (n.includes('.')) {
            this.modifyData.userHouseBuilding = n.slice(0, n.indexOf('.'))
          }
          if (n.slice(0, 1) === '0') {
            this.modifyData.userHouseBuilding = n.slice(1)
          }
        } else {
          this.modifyData.userHouseBuilding = o
        }
      },
      deep: true,
      immediate: true
    },
    'modifyData.userHouseUnit': {
      handler (n, o) {
        n = String(n)
        if (Number(n) == n) {
          if (n.includes('.')) {
            this.modifyData.userHouseUnit = n.slice(0, n.indexOf('.'))
          }
          if (n.slice(0, 1) === '0') {
            this.modifyData.userHouseUnit = n.slice(1)
          }
        } else {
          this.modifyData.userHouseUnit = o
        }
      },
      deep: true,
      immediate: true
    },
    'modifyData.userHouseNumber': {
      handler (n, o) {
        n = String(n)
        if (Number(n) == n) {
          if (n.includes('.')) {
            this.modifyData.userHouseNumber = n.slice(0, n.indexOf('.'))
          }
          if (n.slice(0, 1) === '0') {
            this.modifyData.userHouseNumber = n.slice(1)
          }
        } else {
          this.modifyData.userHouseNumber = o
        }
      },
      deep: true,
      immediate: true
    },
    'addData.Housingarea': {
      handler (n, o) {
        n = String(n)
        if (Number(n) == n) {
          if (n.includes('.')) {
            this.addData.Housingarea = n.slice(0, n.indexOf('.') + 3)
          }
        } else {
          this.addData.Housingarea = o
        }
      },
      deep: true,
      immediate: true
    },
    'modifyData.Housingarea': {
      handler (n, o) {
        n = String(n)
        if (Number(n) == n) {
          if (n.includes('.')) {
            this.modifyData.Housingarea = n.slice(0, n.indexOf('.') + 3)
          }
        } else {
          this.modifyData.Housingarea = o
        }
      },
      deep: true,
      immediate: true
    },
    'modifyData.Price': {
      handler (n, o) {
        n = String(n)
        if (Number(n) == n) {
          if (n.includes('.')) {
            this.modifyData.Price = n.slice(0, n.indexOf('.') + 3)
          }
        } else {
          this.modifyData.Price = o
        }
      },
      deep: true,
      immediate: true
    }
  },
  created () {
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'))
    const { Communityid, uid } = this.userInfo
    const auth_id = this.$route.meta.auth_id
    //获取按钮权限
    postSelect_button({ Communityid, uid, auth_id }).then(res => {
      if (res.code === 200) {
        this.buttonLists = res.data
        var btnList = this.buttonLists
        btnList.forEach(item => {
          if (item.auth_name === '添加房屋') {
            this.ask.add = true
          }
          if (item.auth_name === '导入房屋') {
            this.ask.import = true
          }
          if (item.auth_name === '修改') {
            this.ask.modify = true
          }
          if (item.auth_name === '住户信息') {
            this.ask.houseInfo = true
          }
          if (item.auth_name === '车位信息') {
            this.ask.carInfo = true
          }
          if (item.auth_name === '操作记录') {
            this.ask.record = true
          }
          if (item.auth_name === '下载房屋模板') {
            this.ask.download = true
          }
        })
      }
    })
    //红点是否出现
    this.getJudgeList()
    //请求房屋数据
    this.getHouseType()
    //请求房屋类型数据
    this.getHouseList()
  },
  methods: {
    // 请求房屋数据
    getHouseList () {
      const Communityid = this.userInfo.Communityid
      const page = this.pageInfo.page
      postSelect_house({ Communityid, page }).then(resp => {
        console.log(resp, '33')
        this.pageInfo.total = resp.msg.total
        this.pageInfo.page = Number(resp.msg.page)
        this.tableData = resp.msg.data
      })
    },
    //请求房屋类型列表
    getHouseType () {
      const Communityid = this.userInfo.Communityid
      postinsert_type1({ Communityid }).then(resp => {
        console.log(resp, 'type')
        this.houseTypeList = resp.msg // 房屋类型列表
      })
    },
    //搜索请求列表
    getSearchLists () {
      const Communityid = this.userInfo.Communityid
      const page = this.pageInfo.page
      const name = this.searchData
      postSelect_search({ Communityid, page, name }).then(resp => {
        if (resp.code === 200) {
          this.fenyeType = 2
          this.pageInfo.total = resp.msg.total
          this.pageInfo.page = Number(resp.msg.page)
          this.tableData = resp.msg.data
          this.isMainBox = false
        } else if (resp.code === 400) {
          this.$message({
            message: resp.msg,
            type: 'warning'
          })
          this.searchData = ''
        }
      })
    },
    //判断红点是否消失
    getJudgeList () {
      const Communityid = this.userInfo.Communityid
      const page = this.pageInfo.page
      postSelect_examine({ Communityid, page }).then(resp => {
        if (resp.code === 200) {
          if (resp.msg.data.length > 0) {
            if (this.secondRouterLists.children) {
              this.secondRouterLists.children.forEach(item => {
                if (item.meta.title === '审核列表') {
                  this.showDot = true
                } else {
                  this.showDot = false
                }
              })
            }
          }
        }
      })
    },
    ok () {
      this.isShowExcel = false
      this.isError = false
    },
    isShowHouse1 () {
      this.houseDetailShow = true
    },
    //导入房屋
    beforeUpload (file) {
      this.loadingExcel = true
      if (this.houseTypeList.length === 0) {
        this.$message({
          message: '请先添加房屋类型',
          type: 'warning'
        })
      } else {
        var fd = new window.FormData()
        fd.append('excel', file)
        postDownLoadHouse(fd).then(res => {
          
          this.loadingExcel = false
          if (res.code === 200) {
            var arr = res.msg.data
          var array = []
          var i = 0
            var a = 1
          for(i=0;i<arr.length;i++){
            switch (Object.values(arr[i]).length)
{
    case 1:
      if(arr[i][1]){
array.push(arr[i])
      }
      break;
    case 2:
   if(arr[i][1]||arr[i][2]){
array.push(arr[i])
      }
      break;
        case 3:
   if(arr[i][1]||arr[i][2]||arr[i][3]){
array.push(arr[i])
      }
      break;
      case 4:
   if(arr[i][1]||arr[i][2]||arr[i][3] || arr[i][4]){
array.push(arr[i])
      }
      break;
      case 5:
   if(arr[i][1]||arr[i][2]||arr[i][3] || arr[i][4]||arr[i][5]){
array.push(arr[i])
      }
      break;
      case 6:
   if(arr[i][1]||arr[i][2]||arr[i][3] || arr[i][4]||arr[i][5]||arr[i][6]){
array.push(arr[i])
      }
      break;
    default:
     if(arr[i][1]||arr[i][2]||arr[i][3] || arr[i][4]||arr[i][5]||arr[i][6] ||arr[i][7]){
array.push(arr[i])
      }
}   
          }  
            this.excelData = array
            this.dr_nameId = res.msg.dr_nameId
            this.prop = ['1', '2', '3', '4', '5', '6', '7']
            this.isShowExcel = true
            this.amazing = false
            setTimeout(() => {
              this.amazing = true
            }, 1)
          } else if (resp.code === 401) {
            this.$message({
              message: resp.msg,
              type: 'warning'
            })
          } else if (resp.code === 402) {
            this.$message({
              message: resp.msg,
              type: 'error'
            })
          }
          this.$refs.upload1.clearFiles()
        })
      }
    },
    cancelImport () {
      this.centerDialogVisible1 = false
    },
    //Excel导入数据库
    didConfirmImport () {
      this.centerDialogVisible1 = false
      this.loadingExcel1 = true
      const { uname, Communityid } = this.userInfo
      const dr_nameId = this.dr_nameId
      postExcel_import({ uname, Communityid, dr_nameId }).then(resp => {
        this.loadingExcel1 = false
        if (resp.data.length > 0) {
          // 提示导入数据失败
          this.isError = true
        }
        if (resp.data.length === 0) {
          this.$message({
            message: '导入成功',
            type: 'success'
          })
          this.isShowExcel = false
        }
        this.getHouseList()
        //返回回来的数据
        this.prop = ['userHouseBuilding', 'userHouseUnit', 'userHouseNumber', 'cid', 'Housingarea', 'checktime', 'wuye_price', 'Reason']
        var arr = resp.data
            var i = 0
            var array = []
            for(i=0;i<arr.length;i++){
              if(arr[i]['userHouseBuilding']||arr[i]['userHouseUnit']||arr[i]['userHouseNumber']||arr[i]['cid']||arr[i]['Housingarea']||arr[i]['checktime']||arr[i]['wuye_price']){
                array.push(arr[i])
              }
            }
        this.excelData = array
      })
    },
    excelImport () {
      this.centerDialogVisible1 = true
    },
    // 返回上一级
    backToLastPage () {
      this.fenyeType = 1
      this.searchData = ''
      this.isMainBox = true
      this.isShowExcel = false
      this.getHouseList()
    },
    // 下载房屋模板
    async clickDownLoad () {
      let res = await postDownLoad();
      if (res.code === 200) {
        // let res = await postDownLoad1({ name: res.msg });
        postDownLoad1({ name: res.msg }).then(res => {
          let blob = new Blob([res], {
            type:
              "application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          });
          //console.log(blob);
          const fileName = "房屋模板.xls";
          if ("download" in document.createElement("a")) {
            // 非IE下载
            const elink = document.createElement("a");
            elink.download = fileName;
            elink.style.display = "none";
            elink.href = URL.createObjectURL(blob);
            document.body.appendChild(elink);
            elink.click();
            URL.revokeObjectURL(elink.href); // 释放URL 对象
            document.body.removeChild(elink);
          } else {
            // IE10+下载
            navigator.msSaveBlob(blob, fileName);
          }
        })
      }
    },

    getUserInfo () {
      return JSON.parse(localStorage.getItem('userInfo')).data
    },
    handleUserInfoClick (v) {
      if (v.state === 2) {
        console.log(v, '639')
        this.houseid = v.userHouseId
        this.housenumber = v.housenumber
        this.houseDetailShow = false
      } else {
        this.$message({
          message: '请填写交房时间后，再添加住户信息',
          type: 'warning'
        })
      }
    },
    handleCarInfoClick (v) {
      // alert('车位信息')
    },
    handleRecordClick (v) {
      console.log(v, '操作记录')
      this.RecordialogFormVisible = true
      this.recordData = v
      this.newResult = '拒绝：' + v.Result
    },
    // 点击添加房屋
    clickAddHouse () {
      this.loadingAdd = false
      if (this.houseTypeList.length > 0) {
        //清空数据
        this.addData = {
          'oid': '', // 房屋类型id
          'userHouseBuilding': '', // 楼栋
          'userHouseUnit': '', // 单元
          'userHouseNumber': '', // 门牌号
          'Housingarea': '', // 房屋面积
          'checktime': '', // 交房时间
          'wuye_price': '', // 到期时间
          'centn': '', // 房屋备注
        }
        this.AdddialogVisible = true
      } else {
        this.$message({
          message: '请先添加房屋类型',
          type: 'warning'
        })
      }
    },
    // 点击导入房屋
    clickImportHouse () {
      if (this.houseTypeList.length == 0) {
        this.$message({
          message: '请先添加房屋类型',
          type: 'warning'
        })
      } else {
        return
      }
    },
    // 点击修改
    handleModifyClick (v) {
      this.shanchuCenten = ''
      console.log(v)
      this.loadingModi1 = false
      this.loadingModi2 = false
      this.loadingModi3 = false
      this.loadingModi4 = false
      //  v.state为1为未交房，2为已交房
      this.modifyData.checktime = ''
      if (v.state === 2) {
        //已交房就只用修改备注
        this.modifyType.centOnly = true
        // 隐藏交房时间
        this.isShowHouseTime = false
      }
      if (v.state === 1) {
        this.modifyType.centOnly = false
        this.isShowHouseTime = true
      }
      this.originData = v
      //房屋备注回显
      this.modifyData.centn = v.centn
      this.ModifydialogVisible = true
    },
    // 确认修改
    clickConfirmModify () {
      const { userHouseId } = this.originData
      const { uname } = this.userInfo
      var { centn, checktime } = this.modifyData
      this.loadingModi1 = true
      if (this.modifyType.centOnly) { // 已交房 只修改备注
        this.sendModifyRequest(uname, userHouseId, centn, checktime)
        this.ModifydialogVisible = false
      } else { // 未交房 修改时间和备注
        this.sendModifyRequest(uname, userHouseId, centn, checktime)
      }
    },
    // 确认修改详情
    clickConfirmModify1 () {
      this.loadingModi2 = true
      const { Communityid, uname } = this.userInfo
      const { userHouseId } = this.originData
      const { oid, Housingarea, Price, userHouseBuilding, userHouseUnit, userHouseNumber, centns } = this.modifyData
      postUpdet_house({ uname, userHouseId, centns, userHouseNumber, userHouseUnit, userHouseBuilding, Price, Housingarea, oid, Communityid }).then(resp => {
        this.loadingModi2 = false
        if (resp.code === 401) {
          this.modifyDetailsTips4 = resp.msg
          setTimeout(() => {
            this.modifyDetailsTips4 = ''
          }, 2000)
        } else if (resp.code === 400) {
          this.$message({
            message: resp.msg,
            type: 'warning'
          })
          this.ModifydialogVisible = false // 关闭弹框
          this.detailFormVisible = false
        } else if (resp.code === 402) {
          this.$message({
            message: resp.msg,
            type: 'warning'
          })
        } else {
          //申请修改成功
          this.showDot = true//审核红点出现
          //判断分页类型
          if (this.fenyeType === 1) {
            this.getHouseList()
          } else if (this.fenyeType === 2) {
            this.getSearchLists()
          } else {
            console.log(userHouseId, 'userHouseId')
            this.sendSingleSelectRequest(userHouseId)
          }
          this.ModifydialogVisible = false // 关闭添加
          this.detailFormVisible = false
          this.$message({
            message: resp.msg,
            type: 'success'
          })
        }
      })
    },
    // 确认删除
    clickConfirmModify2 () {
      const { uname } = this.userInfo
      const { userHouseId } = this.originData
      const centns = this.shanchuCenten
      postdetele_house({ uname, userHouseId, centns }).then(resp => {
        console.log(resp, 'shangchu d')
        if (resp.code === 401) {
          this.modifyDetailsTips4 = resp.msg
          setTimeout(() => {
            this.modifyDetailsTips4 = ''
          }, 2000)
        } else if (resp.code === 400) {
          this.$message({
            message: resp.msg,
            type: 'warning'
          })
          this.detailFormVisible = false
          this.isDeleteHouse = false
        } else {
          //成功
          this.showDot = true
          //判断是否审核列表模块
          if (this.secondRouterLists.children) {
            this.secondRouterLists.children.forEach(item => {
              if (item.meta.title === '审核列表') {
                this.showDot = true
              } else {
                this.showDot = false
              }
            })
          }
          this.detailFormVisible = false
          this.isDeleteHouse = false
          //判断分页类型
          if (this.fenyeType === 1) {
            this.getHouseList()
          } else if (this.fenyeType === 2) {
            this.getSearchLists()
          } else {
            this.sendSingleSelectRequest(userHouseId)
          }
          this.clearModifyData()
          this.$message({
            message: resp.msg,
            type: 'success'
          })
        }
      })
    },
    /* 添加表单相关事件 */
    // 确认添加
    clickConfirmAdd () {
      this.loadingAdd = true
      this.addData.uname = this.userInfo.uname
      this.addData.Communityid = this.userInfo.Communityid
      postInsert_house(this.addData).then(resp => {
        this.loadingAdd = false
        if (resp.code === 401) {
          this.addTips1 = resp.msg
          setTimeout(() => {
            this.addTips1 = ''
          }, 2000)
        } else if (resp.code === 402) {
          this.addTips2 = resp.msg
          setTimeout(() => {
            this.addTips2 = ''
          }, 2000)
        } else if (resp.code === 403) {
          this.addTips3 = resp.msg
          setTimeout(() => {
            this.addTips3 = ''
          }, 2000)
        } else if (resp.code === 404) {
          this.addTips4 = resp.msg
          setTimeout(() => {
            this.addTips4 = ''
          }, 2000)
        } else if (resp.code === 405) {
          this.addTips5 = resp.msg
          setTimeout(() => {
            this.addTips5 = ''
          }, 2000)
        } else if (resp.code === 406) {
          this.addTips6 = resp.msg
          setTimeout(() => {
            this.addTips6 = ''
          }, 2000)
        } else if (resp.code === 407) {
          //房屋已存在
          this.$message({
            message: resp.msg,
            type: 'warning'
          })
          // this.AdddialogVisible = false
        }
        else if (resp.code === 200) {
          this.$message({
            message: "添加成功",
            type: "success"
          })
          this.AdddialogVisible = false
          this.userHouseId = resp.msg
          const userHouseId = resp.msg
          this.isMainBox = false // 显示返回上一页
          this.sendSingleSelectRequest(userHouseId)
        }
      })
    },
    // 添加成功后查询单个房屋
    sendSingleSelectRequest (userHouseId) {
      this.fenyeType = 3
      const page = 1
      const count = 10
      postSelect_single({ page, count, userHouseId }).then(resp => {
        // console.log(resp, '添加成功后查询单个房屋')
        if (resp.code === 200) {
          this.pageInfo.total = resp.msg.total
          this.pageInfo.page = Number(resp.msg.page)
          this.tableData = resp.msg.data
        }
      })
    },
    //点击申请修改
    shenqingHandler () {
      this.detailFormVisible = true
      this.ModifydialogVisible = false
      //清空数据
      this.modifyData = {
        'uname': '', // 操作人
        'userHouseId': '', // 房屋主键id (已交房 只修改备注)
        'centn': '', // 修改的备 (未交房 修改备注和时间)
        'checktime': '', // 交房时间
        'Communityid': '', // 小区id (已交房和未交房)
        'oid': '', // 房屋类型主键id
        'Housingarea': '', // 房屋面积
        'Price': '', // 物业单价
        'userHouseBuilding': '', // 楼栋
        'userHouseUnit': '', // 单元
        'userHouseNumber': '', // 门牌
        'centns': ''// 申请理由
      }
    },
    handleAddClose () {
      this.AdddialogVisible = false
      this.n1 = false
      this.n2 = false
      this.n3 = false
      this.n4 = false
      this.n5 = false
      this.e = false
      this.clearAddData()
    },
    /* 修改表单相关事件 */
    // 确认修改

    handleAddClose1 () {
      this.ModifydialogVisible = false

    },
    handleAddClose2 () {
      this.detailFormVisible = false
      this.isDeleteHouse = false
      // setTimeout(() => {
      this.clearModifyData()
      // }, 1000)
    },
    clearAddData () {
      this.addData = {
        'Communityid': '', // 小区id
        'oid': '', // 房屋类型id
        'userHouseBuilding': '', // 楼栋
        'userHouseUnit': '', // 单元
        'userHouseNumber': '', // 门牌号
        'Housingarea': '', // 房屋面积
        'checktime': '', // 交房时间
        'wuye_price': '', // 到期时间
        'centn': '', // 房屋备注
        'uname': ''// 操作人
      }
    },
    clearModifyData () {
      this.modifyData = {
        'uname': '', // 操作人
        'userHouseId': '', // 房屋主键id (已交房 只修改备注)

        'centn': '', // 修改的备 (未交房 修改备注和时间)
        'checktime': '', // 交房时间

        'Communityid': '', // 小区id (已交房和未交房)
        'oid': '', // 房屋类型主键id
        'Housingarea': '', // 房屋面积
        'Price': '', // 物业单价
        'userHouseBuilding': '', // 楼栋
        'userHouseUnit': '', // 单元
        'userHouseNumber': '', // 门牌
        'centns': ''// 申请理由
      }
    },

    // 页码相关事件
    handleSizeChange () {
      console.log(11)
    },
    // 分页设置
    handleCurrentChange (val) {
      this.pageInfo.page = val
      if (this.fenyeType === 1) {
        this.getHouseList()
      } else {
        this.getSearchLists()
      }
    },
    nextClickHandler (val) {
      // console.log(val, '354')
    },
    /* 修改请求 */
    // 修改备注
    sendModifyRequest (uname, userHouseId, centn, checktime) {
      postUpde_house({ uname, userHouseId, centn, checktime }).then(resp => {
        // console.log(resp, '进入修改备注')
        this.loadingModi1 = false
        if (resp.code === 200) {
          this.$message({
            message: resp.msg,
            type: 'success'
          })
          this.ModifydialogVisible = false // 关闭添加
          //判断分页类型
          if (this.fenyeType === 1) {
            this.getHouseList()
          } else if (this.fenyeType === 2) {
            this.getSearchLists()
          } else {
            console.log('xiugai ')
            this.sendSingleSelectRequest(userHouseId)
          }
          this.ModifydialogVisible = false // 关闭添加
          this.detailFormVisible = false
          this.$message({
            message: resp.msg,
            type: 'success'
          })
        } else {
          this.$message({
            message: resp.msg,
            type: 'warning'
          })
          this.ModifydialogVisible = false // 关闭添加
        }
      })
    },
  }}
</script>

<style lang="scss" scoped>
/deep/.el-date-editor.el-input {
  width: 280px !important;
}
/deep/.myConfirm {
  margin: 0 !important;
  width: 380px;
  height: 210px;
  position: absolute;
  top: 50%;
  left: 50%;
  border-radius: 5px;
  transform: translateX(-50%) translateY(-50%);
  .el-dialog__footer {
    position: relative;
    padding-top: 45px;
  }
  .el-button {
    position: absolute;
    padding: 5px;
    span {
      font-size: 14px;
    }
  }
  .el-button--default {
    left: 60px;
    bottom: 10px;
    background-color: #fff;
    color: #999;
    width: 72px;
    height: 30px;
    border: 1px solid rgba(204, 204, 204, 1);
    border-radius: 3px;
  }
  .el-button--primary {
    right: 60px;
    bottom: 10px;
    width: 72px;
    height: 30px;
    background: rgba(37, 186, 217, 1);
    border: 1px solid rgba(37, 186, 217, 1);
    border-radius: 4px;
    font-size: 14px;
  }
  .el-dialog__header {
    //header
    border-bottom: 1px solid #efefef;
    padding: 12px 0 10px 16px;
    text-align: left;
    color: #333333;
    .el-dialog__title {
      font-size: 16px;
      line-height: 20px;
    }
    font-size: 16px;
    button {
      position: absolute;
      top: 14px;
    }
  }
  .el-dialog__body {
    font-size: 16px;
    padding: 47px 25px 19px 30px;
  }
}
/deep/.el-message-box .myConfirm {
  width: 400px !important;
  background-color: #f44 !important;
}
.dot {
  display: inline-block;
  z-index: 10;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: #f44;
  position: absolute;
  top: -46px;
  left: 220px;
}
.tips {
  color: red;
  font-size: 14px;
  height: 20px;
  line-height: 20px;
}
.red {
  color: red;
}
/deep/.rollTable {
  overflow-y: auto;
  .el-table__body {
    background: #f00 !important;
    td {
      // background-color: #f00;
      padding: 16px 0 !important;
    }
  }
}
/deep/.btn-modify {
  background: #25bad9;
}
/deep/.btn-record {
  background-color: #bfbfbf;
}
/deep/.operateBtn {
  color: #fff;
  display: inline-block;
  border-radius: 4px;
  padding: 4px;
  font-size: 14px;
}
//添加表单样式
/deep/ .myAddFormDetail {
  .de {
    height: 32px;
  }
  width: 450px !important;
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
    width: 90%;
    margin-left: 2px;
    margin-top: 5px !important;
    padding-left: 12px;
  }
  margin-top: 0 !important;
  position: absolute;
  border-radius: 5px;
  top: 50%;
  transform: translateY(-50%) translateX(-50%);
  left: 50%;
  // min-width: 480px;
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
    padding: 11px 40px 84px 54px !important;
    .de {
      position: absolute;
      left: 30px;
      top: 10px;
      padding-bottom: 10px;
    }
    .el-form {
      padding-top: 10px;
      .el-form-item__label {
        .el-form-item__content {
          .block {
            /deep/.el-date-editor.el-input {
              width: 280px !important;
              /deep/.el-input__inner {
                padding: 0 20px !important;
              }
            }
          }
        }
      }
      .row {
        position: relative;
        margin-bottom: 24px;
        .tips {
          position: absolute;
          right: 99px;
        }

        span {
          display: inline-block;
        }
        .t1 {
          width: 79px;
        }
        .t2 {
          width: 80px;
        }
        .t3 {
          padding-right: 15px;
        }
        .t4 {
          width: 155px;
          border: 1px solid #d2d2d2;
          height: 32px;
          padding-left: 5px;
          padding-right: 5px;
          outline: none;
          border-radius: 4px;
        }
        /deep/.el-select {
          width: 155px;
          padding-left: 5px;
          border: 1px solid #d2d2d2;
          height: 32px;
          border-radius: 4px;
          .el-input__inner {
            padding-left: 0;
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
    height: 30px;
    padding: 0 8px;
    position: absolute;
    background-color: #f8ac59;
    line-height: 30px;
    color: #fffefe;
    border-radius: 4px;
    bottom: 24px;
    left: 50%;
    transform: translateX(-50%);
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
      .fwType-class {
        // background-color: #f00 !important;
        z-index: 1000;
        /deep/.el-input__inner {
          height: 30px !important;
        }
      }
      .el-input__inner {
        height: 22px !important;
        color: #333;
        margin-top: 5px !important;
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
/deep/ .myAddForm {
  .de {
    height: 32px;
  }
  width: 470px !important;
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
    width: 90%;
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
    padding: 29px 40px 84px 54px !important;
    .de {
      position: absolute;
      left: 30px;
      top: 10px;
      padding-bottom: 10px;
    }
    .el-form {
      padding-top: 10px;
      .row {
        position: relative;
        padding-bottom: 22px;
        .tips {
          position: absolute;
          right: 99px;
        }

        span {
          display: inline-block;
        }
        .t1 {
          width: 79px;
        }
        .t2 {
          width: 80px;
        }
        .t3 {
          padding-right: 15px;
        }
        .t4 {
          width: 155px;
          border: 1px solid #d2d2d2;
          height: 32px;
          padding-left: 5px;
          padding-right: 5px;
          outline: none;
          border-radius: 4px;
        }
        /deep/.el-select {
          width: 155px;
          padding-left: 5px;
          border: 1px solid #d2d2d2;
          height: 32px;
          border-radius: 4px;
          .el-input__inner {
            padding-left: 0;
          }
          .el-input__suffix-inner {
            height: 100%;
            .el-input__icon {
              // line-height: 1;
            }
          }
        }
      }
    }
  }
  /deep/.el-input__icon {
    line-height: 32px !important;
    right: 20px !important;
  }
  .addNow {
    height: 30px;
    padding: 0 8px;
    position: absolute;
    background-color: #f8ac59;
    line-height: 30px;
    color: #fffefe;
    border-radius: 4px;
    bottom: 24px;
    left: 50%;
    transform: translateX(-50%);
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

//修改//
/deep/.myForm {
  margin-top: 0 !important;
  position: absolute;
  top: 50%;
  transform: translateY(-50%) translateX(-50%);
  left: 50%;
  width: 400px;
  border-radius: 5px;
  .el-input--prefix .el-input__inner {
    height: 20px !important;
    padding-left: 29px !important;
  }
  .el-dialog__body {
    padding: 40px 50px 84px 48px !important;
  }
  .el-dialog__header {
    //header
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
  .el-form-item__label {
    height: 32px;
    line-height: 32px;
    text-align: left !important;
  }
  .el-form-item {
    height: 47px !important;
    margin-bottom: 15px;
    .el-form-item__content {
      border-radius: 4px;
      height: 32px;
      line-height: 32px;
      border: 1px solid #d2d2d2;
      // width: 250px;
      .el-input {
        width: 73% !important;
      }
      .el-input__icon {
        line-height: 30px;
      }
    }
  }
  .addNow {
    height: 30px;
    padding: 0 8px;
    position: absolute;
    background-color: #f8ac59;
    line-height: 30px;
    color: #fffefe;
    border-radius: 4px;
    bottom: 24px;
    left: 50%;
    transform: translateX(-50%);
  }
}
//操作记录表格样式
/deep/.myRecordForm {
  background-color: #fff;
  margin-top: 0% !important;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  -webkit-transform: translate(-50%, -50%);
  -moz-transform: translate(-50%, -50%);
  border-radius: 5px;
  min-width: 380px;
  width: 24.43%;
  .el-dialog__header {
    height: 43px;
    border-bottom: 1px solid #efefef;
    .el-dialog__title {
      position: absolute;
      line-height: 0;
      color: #333333;
      font-size: 16px;
    }
    .el-dialog__headerbtn {
      top: 12px;
    }
  }
  .el-dialog__body {
    position: relative;
    padding: 23px 50px 64px 48px !important;
    .el-form-item {
      min-height: 30px;
      height: 24px !important;
      margin-left: 5px;
      .el-form-item__content {
        border: 1px solid #d2d2d2;
        line-height: 30px;
        border-radius: 4px;
        width: 64%;
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
    line-height: 30px;
  }
  .btn-confirm-record {
    width: 72px;
    height: 30px;
    background-color: #f8ac59;
    min-width: 36px;
    text-align: center;
    padding: 5px 8px;
    color: #fffefe;
    border-radius: 4px;
    bottom: 10px;
    cursor: pointer;
    margin: 100px 150px -50px;
  }
  .btn-confirm-record1 {
    position: absolute;
    bottom: 24px !important;
    left: 50%;
    transform: translateX(-50%);
    background-color: #f8ac59;
    min-width: 36px;
    text-align: center;
    padding: 5px 8px;
    color: #fffefe;
    border-radius: 4px;
    bottom: 10px;
    width: 72px;
    height: 30px;
    cursor: pointer;
  }
}

#house-details {
  position: relative;
  margin: 20px;
  height: 89%;
  min-width:1290px;
  background-color: #fff;
  .table-box {
    //table
    position: relative;
    width: 100%;
    top: 13px;
    min-width: 1266px;
    bottom: 32px;
    /deep/.el-table__header {
      width: 100% !important;
    }

    /deep/.myRow {
      height: 30px;
      padding: 0;
    }
    /deep/ .hover-row {
      background-color: #eff2f5;
    }
    /deep/.myRow > td {
      padding: 7px 0;
    }
    /deep/.myCell {
      border-collapse: collapse;
    }
    /deep/.note {
      position: relative;
      .cell {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
  .page-box {
    position: absolute;
    bottom: 0;
  }
  .my-pagination-box {
    display: inline-block;
  }
  .top-button-box {
    position: relative;
    background-color: #999;
    height: 60px;
    .btn1 {
      position: absolute;
      top: 50%;
      bottom: 50%;
      margin-top: -13px;
      left: 20px;
      width: 52px;
      height: 26px;
      cursor: pointer;
      text-align: center;
      line-height: 28px;
      border-radius: 4px;
      background-color: #25bad9;
      display: inline-block;
      color: #fff;
      padding: 0 12px;
      font-size: 14px;
    }
    .search-box {
      height: 26px;
      position: absolute;
      top: 50%;
      right: 20px;
      bottom: 50%;
      margin-top: -13px;
      input {
        outline: none;
        border: none;
      }
    }
  }

  .box-header {
    height: 30px;
    position: relative;
    .add-btn {
      cursor: pointer;
      background-color: #1fbba6;
      color: #fff;
      height: 30px;
      line-height: 30px;
      position: absolute;
      top: 43%;
      font-size: 14px;
      bottom: 50%;
      margin-top: -13px;
      padding: 0 8px;
      border-radius: 4px;
    }
    .load-btn {
      cursor: pointer;
      color: #25bad9;
      position: absolute;
      font-size: 12px;
      right: 0px;
      top: -45px;
    }
    .add-btn1 {
      cursor: pointer;
      background-color: #25bad9;
      border: 1px solid #25bad9;
      color: #fff;
      height: 30px;
      line-height: 28px;
      font-size: 14px;
      position: absolute;
      top: 42%;
      bottom: 50%;
      left: 82px;
      margin-top: -13px;
      padding: 0 8px;
      border-radius: 4px;
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
  //分页器的样式
  .block {
    position: absolute;
    top: 720px;
    height: 40px;
    width: 100%;
    .record-data {
      cursor: default;
      display: inline-block;
      line-height: 18px;
      margin-top: 17px;
      position: absolute;
      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: rgba(51, 51, 51, 1);
    }
    .el-pagination {
      position: absolute;
      top: 13px;
      right: -9px;
      width: 235px;
      /deep/button {
        min-width: 24px !important;
        height: 24px;
        cursor: default;
      }
      /deep/.el-pagination__jump {
        position: relative;
        margin-left: 5px;
        background: #5fafe4;
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
          width: 35px;
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
            margin-left: 45px;
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
            margin-left: 1px;
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
}

.operration-class {
  // background-color: #f00;
  // color: red;
  /deep/.el-input__inner {
    color: #333 !important;
  }
}
/deep/.el-input__suffix {
  top: 1px !important;
  right: 30px;
  .el-icon-circle-close {
    position: absolute;
    right: 0;
  }
}
// /deep/.el-message-box__header {
//   border-bottom: 1px solid red !important;
// }
/deep/.el-message-box__wrapper {
  background-color: #f44;
}
/deep/.el-message-box {
  background-color: #f00 !important;
}
/deep/.el-table tbody tr:hover > td {
  background-color: #eff2f5 !important;
}
/deep/ .hover-row {
  background-color: #eff2f5;
}
/deep/.myfenye {
  top: 763px !important;
  .record-data {
    margin-top: 0px !important;
    bottom: 33px !important;
  }
  .el-pagination {
    right: 67px;
    bottom: 25px !important;
  }
}
/deep/.el-loading-spinner {
  top: 70% !important;
}
.hh-class {
  /deep/.el-form-item__content {
    border: none !important;
  }
  .textarea-class {
    background-color: #fff;
    width: 100%;
    height: 100px !important;
    outline: none;
    border: 1px solid #d2d2d2;
    border-radius: 5px;
    padding:8px;
  }
}
/deep/.el-upload-list {
  display: none !important;
}
.houseclass{
  /deep/.el-input__suffix{
    right:4px !important;
  }
}
.typeclass {
   /deep/.el-input__suffix{
    right:2px !important;
    top:3px !important;
  }
}
</style>
