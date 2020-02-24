<template>
  <div id="compcharge">
    <span v-if="showDot" class="dot"></span>
    <!-- 三级菜单出口 -->
    <!-- <router-view /> -->
    <!--
    <div class="top-button-box">
      <span class="btn1">收费</span>
      <span class="search-box">
        <input type="text">
      </span>

    </div> -->
    <!-- 申请退款 -->
    <el-dialog
      title="申请退款"
      custom-class="myRefoundForm"
      class="position:fixed;top:10px;"
      :append-to-body="true"
      :close-on-click-modal="false"
      :visible.sync="refoundFormVisible"
      :before-close="handleRefoundClose"
    >
      <el-form ref="form" :model="refoundFormData" label-width="80px">
        <el-form-item label="项目名称:">
          <el-input v-model="refoundFormData.feelname" disabled />
        </el-form-item>

        <el-form-item label="公司名称:">
          <el-input v-model="refoundFormData.enterprisename" disabled />
        </el-form-item>

        <el-form-item label="起止时间:">
          <el-input v-model="refoundFormData.Start_time" disabled />
        </el-form-item>

        <el-form-item label="收费金额:">
          <el-input v-model="refoundFormData.leftmoney" disabled />
        </el-form-item>
        <el-form-item label="退款金额:">
          <el-input v-model.trim="refoundFormData.tuimoney" />
          <!-- <p v-show="moneyTip">退款金额不能大于收款金额!</p> -->
          <p v-if="tips.t0" v-show="tips.t00" class="tips">请输入退款金额</p>
          <p v-if="!tips.t0&&tips.t1" v-show="tips.t11" class="tips">请输入正确的退款金额</p>
        </el-form-item>

        <el-form-item label="上传凭证:"
        id="myImg"
        style="height:80px !important;margin-top:10px;background:#dfdfdf">
          <!-- 图片列表box -->
          <div class="up-img">
            <p v-if="!tips.t0&&!tips.t1&&tips.t2" v-show="tips.t22" class="tips" style="padding-left:40px;position:absolute;top:71px;left:-40px;">请上传凭证</p>
            <el-upload
              ref="addUpload"
              :limit="3"
              action="#"
              :on-remove="handleRemove"
              :on-preview="handlePictureCardPreview"
              :on-change="handleChange"
              list-type="picture-card"
              :auto-upload="false"
              :class="{hide:hideTui}"
            >
              <i slot="default" class="el-icon-plus" />
              <div slot="file" slot-scope="{file}">
                <img class="el-upload-list__item-thumbnail" :src="file.url" alt>
                <span class="el-upload-list__item-actions">
                  <span
                    class="el-upload-list__item-preview"
                    @click="handlePictureCardPreview(file)"
                  >
                    <i class="el-icon-zoom-in" />
                  </span>
                  <span
                    v-if="!disabled"
                    class="el-upload-list__item-delete"
                    @click="handleDownload(file)"
                  >
                    <i class="el-icon-download" />
                  </span>
                  <span
                    v-if="!disabled"
                    class="el-upload-list__item-delete"
                    @click="handleRemove(file)"
                  >
                    <i class="el-icon-delete" />
                  </span>
                </span>
              </div>
            </el-upload>
          </div>
        </el-form-item>
        

        <!-- 图片预览box -->
        <el-dialog
          style="width:100%;background:#999;padding-top:90px;"
          :visible.sync="ImgDiaLog.add"
          title="pic1"
          :modal="true"
          :append-to-body="true"
          :fullscreen="true"
        >
          <img width="100%;height:100%;" :src="ImgDiaLog.addSrc" alt>
        </el-dialog>

        <el-form-item label="退款理由:" style="height:125px !important;margin-top:20px;">
          <el-input v-model="refoundFormData.tuiconten" placeholder="退款理由" style="resize:none;" type="textarea" @input="valifyReason" />
          <p v-if="!tips.t0&&!tips.t1&&!tips.t2&&tips.t3" v-show="tips.t33" class="tips" style="position:absolute;bottom:-42px;">请输入退款理由</p>
        </el-form-item>

        <div class="addNow" @click="onSubmitRefound">申请退款</div>
      </el-form>
    </el-dialog>

    <!--搜索栏-->
    <div slot="header" class="clearfix">
      <div class="box-header">
        <span v-show="isSearch">
          <span class="add-btn" @click="handleBack">返回上一级</span>
        </span>
        <span v-show="!isSearch">
          <span class="add-btn" @click="clickCharge">收费</span>
        </span>

        <span v-show="!isSearch" class="search-btn" @click="handleSearch">搜索</span>
        <el-input
          @keyup.enter.native="handleSearch"
          v-show="!isSearch"
          v-model="searchData"
          class="sreach-box"
          clearable
          placeholder="输入搜索内容"
        />
      </div>
    </div>
    <!-- 分页 -->
    <!-- <div class="block">
      <p
        class="record-data"
      >共{{ Math.ceil(pageInfo.total/pageInfo.listRows) }}页 共{{ pageInfo.total }}条</p>
      <el-pagination
        background
        :page-size="pageInfo.listRows"
        layout="prev, pager, next, jumper"
        :total="pageInfo.total"
        :current-page="pageInfo.page"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        @next-click="nextClickHandler"
      />
    </div> -->

    <div class="table-box">
      <!-- 收费列表  -->
      <el-table
        empty-text="暂无数据"
        :data="tableData"
        row-class-name="myRow"
        cell-class-name="myCell"
        style="width: 100%; height:100%;"
      >
        <el-table-column prop="feelname" label="项目名称" min-width="80" />
        <el-table-column prop="enterprise" label="公司名称" min-width="80" />
        <el-table-column prop="enterprisename" label="联系人" min-width="80" />
        <el-table-column prop="enterprisephone" label="联系电话" min-width="120" />
        <!-- <el-table-column prop="money" label="收费金额(元)" min-width="150" /> -->
        <el-table-column 
            label="收费金额(元)" 
            min-width="180" 
            >
            <template slot-scope="scope1">
              <div class="slot_imgBox" style="">
                <svg-icon 
                :icon-class=
                  "scope1.row.method===1 ? 'pay1': scope1.row.method===2 ? 'pay2': scope1.row.method===3 ? 'pay3': 'pay4'" 
                  style="font-size: 12px;line-height:50px;" />
                {{scope1.row.money}}
              </div> 
            </template>
        </el-table-column>

        <el-table-column prop="leftmoney" label="余额(元)" min-width="100" />
        <el-table-column prop="Start_time" label="起止时间" min-width="200" />
        <el-table-column prop="ticket" label="打票状态" min-width="80" />
        <el-table-column prop="center" label="备注" min-width="120" class="note" />
        <el-table-column label="操作" fixed="right" min-width='240'>
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              class="operateBtn btn-print"
              @click="handlePrintTicket(scope.row)"
            >打票</el-button>
            <el-button
              type="text"
              size="small"
              class="operateBtn btn-refound"
              @click="handleTuikuan(scope.row)" style="width:72px;"
            >申请退款</el-button>
            <el-button
              type="text"
              size="small"
              class="operateBtn btn-record"
              @click="handleRecordClick(scope.row)" style="width:72px;"
            >操作记录</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 操作记录 -->

      <el-dialog
        title="操作记录"
        :modal="true"
        :close-on-click-modal="false"
        :append-to-body="true"
        :visible.sync="RecordialogFormVisible"
        custom-class="myRecordForm"
      >
        <el-form :model="recordData">
          <el-form-item label="收费人" :label-width="formLabelWidth">
            <el-input v-model="recordData.uname" autocomplete="off" />
          </el-form-item>
          <el-form-item label="收费时间" :label-width="formLabelWidth">
            <el-input v-model="recordData.time" :disabled="true" autocomplete="off" />
          </el-form-item>
          <el-form-item label="打票人" :label-width="formLabelWidth">
            <el-input v-model="recordData.ticketname" autocomplete="off" />
          </el-form-item>
          <el-form-item label="打票时间" :label-width="formLabelWidth">
            <el-input v-model="recordData.tickettime" autocomplete="off" />
          </el-form-item>
        </el-form>
        <div class="btn-confirm-record" @click="RecordialogFormVisible=false">确认</div>
      </el-dialog>

      <!-- 添加收费 -->
      <el-dialog
        title="收费"
        custom-class="myAddForm"
        class="position:fixed;top:10px;"
        :close-on-click-modal="false"
        :append-to-body="true"
        :visible.sync="AdddialogVisible"
        :before-close="handleClose"
        >
        <el-form ref="form" :model="addData" label-width="80px">
          <el-form-item label="项目名称:">
            <el-input v-model.trim="addData.feelname" />
            <p v-if="tips.t1" v-show="tips.t11" class="tips">请输入项目名称</p>
          </el-form-item>

          <!-- <el-form-item label="公司ID:">
            <el-input v-model="addData.enterpriseId" />
            <span class="tips" >{{addData.enterpriseId?'':'请输入公司名称'}}</span>
          </el-form-item> -->
          <el-form-item label="公司名称:">
            <el-select v-model="addData.enterpriseId" filterable placeholder="请选择">
              <el-option
                v-for="item in companys"
                :key="item.enterpriseId"
                :label="item.Companyname"
                :value="item.enterpriseId"
              />
            </el-select>
            <p v-if="!tips.t1&&tips.t2" v-show="tips.t22" class="tips" style="height: 20px;line-height: 1;">请输入公司名称</p>
          </el-form-item>

          <el-form-item label="收费金额:">
            <el-input v-model.trim="addData.money" />
            <p v-if="!tips.t1&&!tips.t2&&tips.t3" v-show="tips.t33" class="tips">请输入收费金额</p>

            <!-- <span class="tips">{{ addData.money?'':'请输入收费金额' }}</span> -->
          </el-form-item>

          <el-form-item label="开始时间:">
            <div class="block startTime">
              <el-date-picker
                v-model="addData.start_time"
                style="padding-left:20px"
                type="date"
                placeholder=""
                @input='fun'
              />
              <p v-if="!tips.t1&&!tips.t2&&!tips.t3&&tips.t4" v-show="tips.t44" class="tips">请输入开始时间</p>
            </div>
          </el-form-item>
          <el-form-item v-show="addData.start_time" label="结束时间:">
            <el-date-picker
              v-model="addData.end_time"
              style="padding-left:20px"
              type="date"
              placeholder=""
            />
            <p v-if="!tips.t1&&!tips.t2&&!tips.t3&&!tips.t4&&tips.t5" v-show="tips.t55" class="tips">请输入结束时间</p>
          </el-form-item>

          <!-- <el-form-item label="开始时间:">
            <el-input v-model="addData.start_time" />
            <p v-if="!tips.t1&&!tips.t2&&!tips.t3&&tips.t4" v-show="tips.t44" class="tips">请输入收费金额</p>
            <span class="tips">{{ addData.start_time?'':'请输入开始时间' }}</span>
          </el-form-item>

          <el-form-item label="结束时间:">
            <el-input v-model="addData.end_time" />
            <p v-if="!tips.t1&&!tips.t2&&!tips.t3&&!tips.t4&&tips.t5" v-show="tips.t55" class="tips">请输入结束时间</p>
            <span class="tips">{{ addData.end_time?'':'请输入结束时间' }}</span>
          </el-form-item> -->

          <el-form-item label="备注:" style="height:40px !important;margin-top:30px; resize:none">
            <el-input v-model="addData.center" class="myCent" style="resize:none;outline:none;" type="textarea" />
          </el-form-item>
          <el-form-item label="支付方式:" class="payWay" style="height:50px !important;margin-top:0px;">
            <el-radio-group v-model="addData.method">
              <el-radio label="1" value="1">
                <svg-icon icon-class='pay1' style="font-size: 16px;line-height:50px;" />&nbsp;微信</el-radio>
              <el-radio label="2" value="2">
                <svg-icon icon-class='pay2' style="font-size: 16px;line-height:50px;" />&nbsp;支付宝</el-radio>
              <el-radio label="3" value="3">
                <svg-icon icon-class='pay3' style="font-size: 16px;line-height:50px;" />&nbsp;现金</el-radio>
              <el-radio label="4" value="4">
                <svg-icon icon-class='pay4' style="font-size: 16px;line-height:50px;" />&nbsp;银行卡</el-radio>
            </el-radio-group>
            <p v-if="!tips.t1&&!tips.t2&&!tips.t3&&!tips.t4&&!tips.t5&&tips.t6" v-show="tips.t66" class="tips">请输入支付方式</p>
            <!-- <span class="tips" style="display:block;">{{ addData.method?'':'请输入支付方式' }}</span> -->
          </el-form-item>

          <div class="addNow" style="cursor:pointer" @click="onSubmit">确认收费</div>
        </el-form>

      </el-dialog>
      
      <!-- 分页 -->
    <div class="block">
      <p
        class="record-data"
      >共{{ Math.ceil(pageInfo.total/pageInfo.listRows) }}页 共{{ pageInfo.total }}条</p>
      <el-pagination
        background
        :page-size="pageInfo.listRows"
        layout="prev, pager, next, jumper"
        :total="pageInfo.total"
        :current-page="pageInfo.page"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        @next-click="nextClickHandler"
      />
    </div>


    </div>

    <el-dialog
      title="提示"
      :modal="true"
      :append-to-body="true"
      :visible.sync="TipdialogVisible"
      custom-class="isPrint-box"
    >
      <p>当前收费 <span class="price">{{ chargeMoney }}</span>收费后是否需要立即打票 </p>
      <div class="btn-confirm-record1" @click="TipdialogVisible=false">不需要</div>
      <div class="btn-confirm-record2" @click="handlePrintTicket">立即打票</div>
    </el-dialog>

  </div>
</template>

<script>
// require('@assets/styles/myChargeStyle')
import axios from 'axios'
export default {
  name: 'CompCharge',
  data() {
    return {
      // tips: {
      //   t1: '',
      //   t11: false,
      //   t2: '',
      //   t22: false,
      //   t3: '',
      //   t33: false
      // },
      hideTui: false,
      showDot: false,
      userInfo: {},
      hasImg: false,
      tips:{
        t0: '',
        t00: false,
        t1: '',
        t11: false,
        t2: '',
        t22: false,
        t3: '',
        t33: false,
        t4: '',
        t44: false,
        t5: '',
        t55: false,
        t6: '',
        t66: false,
        
      },
      commonData: {
        token: '',
        Communityid: '',
        uname: ''
      },
      refoundFormVisible: false, // 退款弹窗
      refoundFormData: {
        'feelname': '', // 项目名字
        'enterprise': '', // 公司名字
        'Start_time': null, // 起止时间
        'end_time': null,
        'money': '', // 收费金额

        'tuimoney': '', // 退款金额
        'tuiimg': '', // 退款凭证
        'tuiconten': ''// 退款理由
      },
      ImgDiaLog: { // 图片弹窗显示与否
        add: false,
        addSrc: ''
      },

      refoundInfo: {
        'wid': '15', // 账单id
        'money': '11', // 退款金额
        'uname': 'mm', // 用户姓名
        'Remarks': 'zzz' // 退款备注
      },
      moneyTip: false,
      reasonTip: false,
      imgTip: false,
      fileLists: [], // 退款的凭证图片
      isSearch: false,
      searchData: '', // 搜索的内容
      // 分页信息
      pageInfo: {
        page: 1, // 当前页
        total: null, // 总条数
        listRows: null, // 每页多少条
        pageNum: null, // 总页数
        render: ''
      },
      TipdialogVisible: false, // 收费后是否打票
      AdddialogVisible: false, // 添加收费
      // 添加的收费信息
      addData: {
        'Communityid': '', // 小区id
        'feelname': '', // 项目名字
        'enterpriseId': '', // 企业id
        'money': '', // 收费金额
        'start_time': null, // 开始时间
        'end_time': null, // 结束时间
        'center': '', // 备注
        'method': '1', // 1为微信2为支付宝3为现金4为银行卡
        'uname': ''// 用户姓名
      },
      chargeMoney: '', // 打票的收费金额
      printId: '', // 添加收费后立即打票的id
      companys: [], // 已近入驻的企业
      tableData: [
        // {
        //   wid: '', // 账单id
        //   feelname: 'test', // 项目名字
        //   enterprise: 'ww', // 公司名字
        //   enterprisename: 'ee', // 公司联系人
        //   enterprisephone: '123', // 公司联系电话
        //   money: '999', // 价格
        //   Start_time: '2015-2018', // 起止时间
        //   center: '备注', // 备注
        //   method: '1', // 支付方式：1为微信2为支付宝3为现金4为银行卡
        //   ticket: '已打', // 打票状态1为未打票2未已打票
        //   time: '2019', // 操作时间
        //   uname: 'xx', // 操作人
        //   ip: '190.21.11', // 操作ip
        //   Auditor: 'bb', // 审核人
        //   times: '2019.08', // 审核时间
        //   Auditortype: '已近审核', // 审核状态
        //   ticketname: 'cc', // 打票人
        //   tickettime: '2018.06', // 打票时间
        //   Remarksa: '备注'// 审核备注
        // }
      ],
      // 操作记录
      formLabelWidth: '120px', // 记录表格宽度
      RecordialogFormVisible: false,
      recordData: {}
    }
  },
  created() {
    this.getuserInfo()
    this.getJudgeList()
    this.getCommonData()
    console.log(this.commonData)
    this.getChargeList()
    this.getCompanies()
  },
  // computed: {
  //   defaultCheack(){
  //     return this.addData.method.toString()
  //   }
  // },
  watch: {
    'addData.money': {
      handler(n, o) {
        n = String(n)
        if (Number(n) == n) {
          if (n.includes('.')) {
            this.addData.money = n.slice(0, n.indexOf('.') + 3)
          }
        } else {
          this.addData.money = o
        }
      },
      deep: true,
      immediate: true
    },
    'refoundFormData.money': {
      handler(n, o) {
        n = String(n)
        if (Number(n) == n) {
          if (n.includes('.')) {
            this.refoundFormData.money = n.slice(0, n.indexOf('.') + 3)
          }
        } else {
          this.refoundFormData.money = o
        }
      },
      deep: true,
      immediate: true
    },
    'refoundFormData.tuimoney': {
      handler(n, o) {
        n = String(n)
        if (Number(n) == n) {
          if (n.includes('.')) {
            this.refoundFormData.tuimoney = n.slice(0, n.indexOf('.') + 3)
          }
        } else {
          this.refoundFormData.tuimoney = o
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    getJudgeList() {
      const { token, Communityid } = this.userInfo
      // const token = JSON.parse(localStorage.getItem('userInfo')).token
      axios.post(`http://test.txsqtech.com/index/Fees/texamine`,
        { Communityid },
        {
          headers: {
            token
          }
        }
      ).then(res => {
        if (res.data.code === 200) {
          if(res.data.msg.data.length > 0) {
            this.showDot = true
          }
        }
      })
    },
    getuserInfo() {
      const local = JSON.parse(localStorage.getItem('userInfo'))
      this.userInfo.token = local.token
      this.userInfo.Communityid = local.data.Communityid
      this.userInfo.uname = local.data.uname
      this.userInfo.Jurisdiction = local.Jurisdiction
      console.log(this.userInfo)
    },
    fun() {
        this.addData.end_time === null
        delete(this.addData.end_time)
        console.log(this.addData.end_time)
    },
    getCommonData() {
      const { uname, Communityid } = JSON.parse(localStorage.getItem('userInfo')).data
      const { token } = JSON.parse(localStorage.getItem('userInfo'))
      this.commonData.token = token
      this.commonData.uname = uname
      this.commonData.Communityid = Communityid
    },
    /* 退款表单事件 */
    // 图片事件 添加
    handleRemove(file, fileList) {

      //this.valifyImg()
      
      this.fileLists = fileList
      if(this.fileLists.length === 3){
     
        this.hideTui = true
      } else {
 
        this.hideTui = false
      }
    },
    handlePictureCardPreview(file) {
      this.ImgDiaLog.addSrc = file.url
      this.ImgDiaLog.add = true // 添加预览
      console.log(123)
    },
    // 本地选中的图片变化
    handleChange(file, fileList) {
      if (fileList.length < 4) { // 允许最多上传三张图片
        this.fileLists = fileList
        console.log(this.fileLists.length, '11111111111111111111111111111')
      }
      this.valifyImg()
      // if (fileList.length >= 3) {
      //   if(fileList.length > 0){
      //     this.hasImg = true
      //   } else {
      //     this.hasImg = false
      //   }
      //   this.$message({
      //     message: '已达到上限',
      //     type: 'warning'
      //   })

      // }
      if(this.fileLists.length < 3) {
        this.hideTui = false
      } else {
        this.hideTui = true
      }

    },
    // 关闭退款弹窗
    handleRefoundClose() {
      this.fileLists = []
      this.$refs.addUpload.clearFiles()
      this.refoundFormVisible = false
      this.clearRefoundInput()
    },
    clearRefoundInput() {
      this.refoundFormData = {
        'feelname': '篮球比赛', // 项目名字
        'enterprise': 'bbb', // 公司名字
        'StartTime': '2018', // 起止时间
        'money': '99', // 收费金额
        'tuimoney': '', // 退款金额
        'tuiimg': '', // 退款凭证
        'tuiconten': ''// 退款理由
      }
    },

    // 点击收费
    clickCharge() {
      this.AdddialogVisible = true
    },
    handleBack() {
      this.isSearch = false
      this.getChargeList() // 重新获取收费列表
    },
    // 确认添加
    onSubmit() {
      if(!this.addData.feelname){ //项目名
        this.tips.t1 = true
        this.tips.t11 = true
        setTimeout(() =>{
          this.tips.t11 = false
        },3000)
        
      } else {
        this.tips.t1 = false
      }
      if(!this.addData.enterpriseId){ //公司名
        this.tips.t2 = true
        this.tips.t22 = true
        setTimeout(() =>{
          this.tips.t22 = false
        },3000)
      } else {
        this.tips.t2 = false
      } 
      if(!this.addData.money){ //收费金额
        this.tips.t3 = true
        this.tips.t33 = true
        setTimeout(() =>{
          this.tips.t33 = false
        },3000)
      } else {
        this.tips.t3 = false
      } 
      if(this.addData.start_time === null){ //开始时间
        this.tips.t4 = true
        this.tips.t44 = true
        setTimeout(() =>{
          this.tips.t44 = false
        },3000)
      } else {
        this.tips.t4 = false
      } 
      if(!this.addData.end_time){ //结束时间
        this.tips.t5 = true
        this.tips.t55 = true
        setTimeout(() =>{
          this.tips.t55 = false
        },3000)
      } else {
        this.tips.t5 = false
      } 
      if(!this.addData.method){ //支付方式
        this.tips.t6 = true
        this.tips.t66 = true
        setTimeout(() =>{
          this.tips.t66 = false
        },3000)
      } else {
        this.tips.t6 = false
      } 
      if (!this.tips.t1&&!this.tips.t2&&!this.tips.t3&&!this.tips.t4&&!this.tips.t5&&!this.tips.t6) {
        console.log(this.addData, '添加的数据')
        this.sendAddCharge()
      } else {
        // this.$message({
        //   message: '请先完善添加信息',
        //   type: 'warning'
        // })
      }
    },
    // 验证添加的内容
    validataInput() {
      let pass = true
      for (const item in this.addData) {
        if (this.addData[item] === '') {
          pass = false
        }
      }
      return pass
    },
    // 发送添加请求
    sendAddCharge() {
      const { token, uname, Communityid } = this.commonData
      this.addData.uname = uname
      this.addData.Communityid = Communityid
      // const token = JSON.parse(localStorage.getItem('userInfo')).token
      axios.post('http://test.txsqtech.com/index/Fees/charge',
        { ...this.addData },
        {
          headers: {
            token
          }
        }
      ).then(res => {
        // 如果添加收费成功 清除addData

        if (res.data.code === 200) {
          this.$message({
            message: '收费成功',
            type: 'success'
          })
          this.clearInput()
          this.AdddialogVisible = false
          this.chargeMoney = res.data.money
          this.printId = res.data.mes
          setTimeout(() => {
            this.TipdialogVisible = true
          }, 1000)
          // 获取最新的数据
          this.getChargeList()
        }
        else if (res.data.code === 10000) {
          this.$router.push('/')
        } else {
          this.$message({
            message: res.data.msg,
            type: 'warning'
          })
        }

        // 隐藏
        
        console.log(res, '收费后的返回值')
      })
    },
    // 关闭添加
    handleClose() {
      this.AdddialogVisible = false
      this.clearInput()
    },
    // 点击搜索
    handleSearch() {
      
      // this.isSearch = true
      this.sendSearchRequest()

    },
    // 点击打票
    handlePrintTicket() {
      this.TipdialogVisible = false
      alert('打票功能暂未开通')
    },
    // 点击申请退款
    handleTuikuan(v) {
      console.log(v,'aaaaaaaaaaaaaaaa')
      const { uname } = this.userInfo
      // const token = JSON.parse(localStorage.getItem('userInfo')).token
      this.refoundFormVisible = true
      this.refoundFormData.feelname = v.feelname // 项目名
      this.refoundFormData.enterprisename = v.enterprisename // 公司名
      this.refoundFormData.Start_time = v.Start_time // 起止时间
      this.refoundFormData.money = v.money // 收款
      this.refoundFormData.leftmoney = v.leftmoney // 收款
      console.log(this.refoundFormData)
      console.log(v, '当前行的数据')
      this.refoundInfo.uname = uname
      this.refoundInfo.wid = v.wid

      // this.refoundInfo.money = this.refoundFormData.tuimoney //退款金额
      this.refoundInfo.Remarks = this.refoundFormData.tuiconten // 退款原因
      // console.log(v,'当前行的数据')
      // console.log(this.refoundFormData,'表单数据')
      console.log(this.refoundFormData)
    },
    // 验证金额
    valifyMoney(val) {
      if (val > this.refoundFormData.money) {
        this.moneyTip = true
      } else {
        this.moneyTip = false
      }
      console.log(val, this.moneyTip)
    },
    valifyReason() {
      if (this.refoundFormData.tuiconten === '') {
        this.reasonTip = true
      } else {
        this.reasonTip = false
      }
      console.log(this.reasonTip, 'reason')
    },
    valifyImg() {
      if (this.fileLists.length === 0) {
        this.hasImg = false
        this.imgTip = true
      } else {
        this.hasImg = true
        this.imgTip = false
      }
    },
    // 立即申请退款
    onSubmitRefound() {
      
      this.valifyImg()
      if(!this.refoundFormData.tuimoney){
        this.tips.t0 = true
        this.tips.t00 = true
        setTimeout(() =>{
          this.tips.t00 = false
        },3000)
        
      } else {
        this.tips.t0 = false
      }
      if( Number(this.refoundFormData.tuimoney)  > Number(this.refoundFormData.leftmoney) ){
        this.tips.t1 = true
        this.tips.t11 = true
        setTimeout(() =>{
          this.tips.t11 = false
        },3000)
        
      } else {
        this.tips.t1 = false
      }
      // if(this.refoundFormData.tuimoney > this.refoundFormData.money){
      //   this.tips.t1 = true
      //   this.tips.t11 = true
      //   setTimeout(() =>{
      //     this.tips.t11 = false
      //   },3000)
        
      // } else {
      //   this.tips.t1 = false
      // }
      if(!this.hasImg){
        this.tips.t2 = true
        this.tips.t22 = true
        setTimeout(() =>{
          this.tips.t22 = false
        },3000)
        
      } else {
        this.tips.t2 = false
      }
      if(!this.refoundFormData.tuiconten){
        this.tips.t3 = true
        this.tips.t33 = true
        setTimeout(() =>{
          this.tips.t33 = false
        },3000)
        
      } else {
        this.tips.t3 = false
      }
      

      
      //this.valifyReason()
      //console.log(!this.moneyTip, !this.reasonTip)
      if (!this.tips.t1&&!this.tips.t2&&!this.tips.t3) {
        const upData = new FormData()
        console.log(this.refoundFormData, '表单数据')
        const { wid } = this.refoundInfo
        const { uname } = this.commonData
        const Remarks = this.refoundFormData.tuiconten
        const { tuimoney } = this.refoundFormData
        upData.append('wid', wid)
        upData.append('money', tuimoney) // 退款金额
        upData.append('uname', uname)
        upData.append('Remarks', Remarks)

        this.fileLists.forEach((item) => {
          upData.append('img[]', item.raw)
        })
        // this.fileLists = []
        console.log(this.refoundInfo, '发送的数据')
        this.sendRefoundRequest(upData)
      } 
      // else {
      //   alert('不能这样就发送了')
      // }
    },
    sendRefoundRequest(upData) {
      const { token } = this.commonData
      // const token = JSON.parse(localStorage.getItem('userInfo')).token
      console.log('开始发送请求')
      axios.post('http://test.txsqtech.com/index/Fees/apply',
        upData,
        {
          headers: {
            token,
            'Content-Type': 'multipart/form-data'
          }
        }).then(res => {
          this.isSearch = false
          this.fileLists = []
          console.log(res,'aaaaaaaaaaaaaaaaaaaaaa')

          if (res.data.code === 200) {
            this.refoundFormVisible = false
            this.getChargeList()
            this.getJudgeList()
            
            this.$message({
              message: res.data.msg,
              type: 'success'
            })
            this.ImgDiaLog.addSrc = ''

          } else {
            this.$message({
              message: res.data.msg,
              type: 'warning'
            })
          }
      })
    },
    handleRecordClick(v) {
      this.RecordialogFormVisible = true
      this.recordData.tickettime = v.tickettime // 打票时间
      this.recordData.ticketname = v.ticketname // 打票人
      this.recordData.time = v.time // 收费时间
      this.recordData.uname = v.uname // 收费人
      console.log(this.recordData, 'record数据')
      // alert('记录')
    },
    // 页码相关事件
    handleSizeChange() {
      console.log(11)
    },
    handleCurrentChange(val) {
      console.log(val)
      this.pageInfo.page = val
      this.getChargeList()
    },
    nextClickHandler(val) {
      console.log(val, '354')
    },
    // 清空添加数据
    clearInput() {
      this.addData = {
        'Communityid': '', // 小区id
        'feelname': '', // 项目名字
        'enterpriseId': '', // 企业id
        'money': '', // 收费金额
        'start_time': null, // 开始时间
        'end_time': null, // 结束时间
        'center': '', // 备注
        'method': '1', // 1为微信2为支付宝3为现金4为银行卡
        'uname': ''// 用户姓名
      }
    },
    // 请求搜索结果
    sendSearchRequest() {
      const { Communityid, token } = this.commonData
      // const token = JSON.parse(localStorage.getItem('userInfo')).token

      const name = this.searchData
      axios.post(`http://test.txsqtech.com/index/Fees/search`,
        {
          Communityid,
          name
        },
        {
          headers: {
            token
          }
        }
      ).then(res => {
        this.searchData = ''
        // 如果有结果
        if (res.data.code === 200) {
          
          this.pageInfo.total = res.data.msg.total
          this.pageInfo.listRows = res.data.msg.listRows
          this.pageInfo.pageNum = res.data.msg.pageNum
          console.log(res.data.msg.data)
          this.tableData = res.data.msg.data
          this.isSearch = true
        } else {
          this.$message({
            message: res.data.msg,
            type: 'warning'
          })
        }
        // this.tableData = 结果
      })
    },
    // 请求收费列表
    getChargeList() {
      const { Communityid, token } = this.commonData
      // const token = JSON.parse(localStorage.getItem('userInfo')).token
      axios.post(`http://test.txsqtech.com/index/Fees/enterpris?page=${this.pageInfo.page}`,
        { Communityid },
        {
          headers: {
            token
          }
        }
      )
        .then(res => {
          // console.log(res)
          if (res.data.code === 200) {
            this.pageInfo.total = res.data.msg.total
            this.pageInfo.listRows = res.data.msg.listRows
            this.pageInfo.pageNum = res.data.msg.pageNum
            console.log(res.data.msg.data, '后端回来的收费列表')
            this.tableData = res.data.msg.data
          }
        })
    },
    // 获取入驻的企业
    getCompanies() {
      const { Communityid, token } = this.commonData
      // const token = JSON.parse(localStorage.getItem('userInfo')).token
      axios.post('http://test.txsqtech.com/index/Fees/nterprise',
        {
          Communityid
        },
        {
          headers: {
            token
          }
        }
      ).then(res => {
        if(res.data.code === 10000) {
          this.$router.push('/')
        } else {
          this.companys = res.data.msg
          console.log(res.data.msg, '获取到的入驻企业')
        }
        
      })
    }

  }
}
</script>
<style lang="scss" scoped>
/deep/.myCent{
  .el-form-item__content{
    border: none !important;
  }
  .el-textarea__inner{
    resize: none;
    outline: none;
  }
}
/deep/.payWay{
  .el-form-item__content{
    border: none !important;
  }
}
/deep/.note {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
/deep/.el-table--enable-row-hover .el-table__body tr:hover>td{
background-color: #EFF2F5 !important;
}
.el-table__body tr:hover>td{
    background-color: #EFF2F5!important;
  }
 
  .el-table__body tr.current-row>td{
    background-color: #EFF2F5!important;
  }
/deep/.el-table::before{
  background-color: #fff !important;
}
/deep/.startTime{
  top: 0 !important;
  left: -20px;
}
/deep/.hide .el-upload--picture-card {
  display: none !important;
}
 /deep/.operateBtn{
    color: #fff;
    display: inline-block;
    border-radius: 4px;
    height: 30px;
    width: 52px;
    padding: 4px;
    font-size: 14px;
  }
  /deep/.btn-refound{
    background-color: #1FBBA6;
  }
  /deep/.btn-print{
    background-color: #25BAD9;
  }
  /deep/.btn-modify{
    background: #25bad9;
  }
  /deep/.btn-record{
    background-color: #CCCCCC;
  }
  .dot{
    display: inline-block;
    z-index: 10;;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: #F44;
    position: absolute;
    top: -28px;
    left: 323px;
  }
  
  // /deep/.block .el-pagination .is-background{
  //   position: absolute !important;
  //   right: 68px;
  //   width: 235px;
  //   z-index: 9;
  //   bottom: 0;
  // }
  // .block .record-data{
  //   cursor: default;
  //   display: inline-block;
  //   line-height: 18px;
  //   margin-top: 15px;
  //   position: absolute;
  //   bottom:0;
  //   font-size: 14px;
  //   font-family: Microsoft YaHei;
  //   font-weight: 400;
  //   color: #333;
  // }
   //操作记录表格样式
  /deep/.myRecordForm{
    background-color: #fff;
    margin-top: 0% !important;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    -webkit-transform: translate(-50%,-50%);
    -moz-transform: translate(-50%,-50%);
    border-radius: 5px;
      min-width: 380px;
      width: 24.43%;
      .el-dialog__header{
        height: 43px;
        border-bottom: 1px solid #efefef;
        .el-dialog__title{
          position: absolute;
          line-height: 0;
          font-size: 16px;
        }
        .el-dialog__headerbtn{
          top: 12px;
        }
      }
    .el-dialog__body{
      position: relative;
      padding: 23px 50px 64px 48px !important;
      .el-form-item{
        min-height: 30px;
        height: 24px !important;
        margin-left: 5px;
        .el-form-item__content{
          border: 1px solid #d2d2d2;
          line-height: 30px;
          border-radius: 4px;
          width: 64%;
        }
        .el-input__inner{
          height: 100% !important;
        }
      }
    }
    .el-input__inner{
      cursor: default !important;
    }
    .el-form-item__label{
      text-align: left;
      line-height: 30px;
    }
    .btn-confirm-record{
      position: absolute;
      width: 72px;
      height: 30px;
      bottom: 24px !important;
      left: 50%;
      transform: translateX(-50%);
      background-color: #F8AC59;
      min-width: 36px;
      text-align: center;
      padding: 5px 8px;
      color: #FFFEFE;
      border-radius: 4px;
      bottom: 10px;
      cursor: pointer;
    }
  }
  //添加表单样式
  /deep/ .myAddForm{
    .de{
      height: 32px;
    }
    width: 480px !important;
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
    input{
        -moz-appearance:textfield;
    }
    .el-input__inner{
        -moz-appearance:textfield;
    }
    .el-input__inner{
      height: 24px !important;
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
    min-width: 480px;
    .el-dialog__header{ //header
      border-bottom: 1px solid #efefef;
      padding: 12px 0 10px 16px;
      .el-dialog__title{
        color: #333333;
        font-size: 16px;
      }
      button{
        position: absolute;
        top: 14px;
      }
    }
    .el-dialog__body{
      position: relative;
        padding: 30px 40px 84px 54px !important;
        .de{
          position: absolute;
          left: 30px;
          top: 10px;
          padding-bottom: 10px;
        }
        .el-form{
          padding-top: 10px;
          .row{
            position: relative;
            padding-bottom: 24px;
            .tips{
              color: red;
              position: absolute;
              right: 99px;
            }
            
            span{
              display: inline-block;
            }
            .t1{
               width: 79px;
            }
            .t2{
              width: 80px;
            }
            .t3{
              padding-right: 15px;
            }
            .t4{
              width: 155px;
              border: 1px solid #d2d2d2;
              height: 32px;
              padding-left: 5px;
              padding-right: 5px;
              outline: none;
              border-radius: 4px;
            }
            /deep/.el-select{
              width: 155px;
              padding-left: 5px;
              border: 1px solid #d2d2d2;
              height: 32px;
              border-radius: 4px;
              .el-input__inner{
                  padding-left: 0;
                }
              .el-input__suffix-inner{
                height: 100%;
                .el-input__icon{
                  line-height: 1;
                }
              }
            }
          }
        }
      }
      .el-input__icon{
                  line-height: 32px !important;

                }
    .addNow{
      height: 30px;
      padding: 0 8px;
      position: absolute;
      background-color: #F8AC59;
      line-height: 30px;
      color: #FFFEFE;
      border-radius: 4px;
      bottom: 24px;
      left: 50%;
      transform: translateX(-50%);
    }
    .el-form-item{
      height: 32px !important;
      margin-bottom: 25px;
      line-height: 32px;
      .el-form-item__label{ //lable
        color: #666666;
        line-height: 32px;
        text-align: left;
      }
      .el-form-item__content{ //content
        box-sizing: border-box;
        border: 1px solid #D2D2D2;
        margin-left: 80px !important;
        width: 73%;
        border-radius: 4px;
        height: 32px;
        line-height: 32px;
        .m::after{
          content:'m²';
          position: absolute;
          top: -1px;
          right:-25px;
        }
        .el-select{
          width: 100%;
          line-height: 32px;
          top: -5px
        }
        .tips{ //tips
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
  // //操作记录表格样式
  // /deep/.myRecordForm{
  //   background-color: #fff;
  //   margin-top: 0% !important;
  //   position: absolute;
  //   top: 50%;
  //   left: 50%;
  //   transform: translate(-50%,-50%);
  //   -webkit-transform: translate(-50%,-50%);
  //   -moz-transform: translate(-50%,-50%);
  //   border-radius: 5px;
  //     min-width: 380px;
  //     height: 286px;
  //     width: 24.43%;
  //     .el-dialog__header{
  //       height: 43px;
  //       border-bottom: 1px solid #efefef;
  //       .el-dialog__title{
  //         position: absolute;
  //         line-height: 0;
  //         font-size: 16px;
  //       }
  //       .el-dialog__headerbtn{
  //         top: 12px;
  //       }
  //     }
  //   .el-dialog__body{
  //     position: relative;
  //     padding: 23px 50px 64px 48px !important;
  //     .el-form-item{
  //       min-height: 30px;
  //       height: 24px !important;
  //       margin-left: 5px;
  //       .el-form-item__content{
  //         border: 1px solid #d2d2d2;
  //         line-height: 30px;
  //         border-radius: 4px;
  //         width: 64%;
  //       }
  //       .el-input__inner{
  //         height: 100% !important;
  //       }
  //     }
  //   }
  //   .el-input__inner{
  //     cursor: default !important;
  //   }
  //   .el-form-item__label{
  //     text-align: left;
  //     line-height: 30px;
  //   }
  //   .btn-confirm-record{
  //     position: absolute;
  //     width: 72px;
  //     height: 30px;
  //     bottom: 24px !important;
  //     left: 50%;
  //     transform: translateX(-50%);
  //     background-color: #F8AC59;
  //     min-width: 36px;
  //     text-align: center;
  //     padding: 5px 8px;
  //     color: #FFFEFE;
  //     border-radius: 4px;
  //     bottom: 10px;
  //     cursor: pointer;
  //   }
  // }
  .tips{
    color: #f44;
    font-size: 12px;
  }
  /deep/.el-upload-list--picture-card .el-upload-list__item{
    width: 80px;
    height: 80px;
  }
  /deep/#myImg{
    
    .el-form-item{
      margin-bottom: 5px;
      
    }
    .el-form-item__label{
      background-color: #fff;
      line-height: 80px;
      /deep/.el-upload-list--picture-card .el-upload-list__item{
        width: 80px !important;
      }
    }
    .el-form-item__content{
      height: 100% !important;
      .up-img{
        background-color: #fff;
        height: 100%;
        .el-upload-list__item .is-ready{
          height: 80px;
        }
        .el-upload-list__item-actions{

        }
        div{
          height: 100%;
          height: 100%;
          .el-upload-list .el-upload-list--picture-card{
            height: 100%;
            background-color: #f44;
            li{
              height: 100%;
            }
          }
          .el-upload--picture-card{
            width: 80px;
            position: relative;
            .el-icon-plus{
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translateX(-50%) translateY(-50%)
            }
          }
        }
      }
    }
  }
  .block {
    padding-left: 20px;
    position: absolute;
    bottom: -151px;
    .record-data {
      cursor: default;
    display: inline-block;
    line-height: 18px;
    margin-top: 15px;
    position: absolute;
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
    }
    // position: absolute;
    height: 40px;
    width: 100%;
    .el-pagination {
      z-index:9;
      position: absolute;
    bottom: -1px;
    right: 68px;
    width: 235px;
      /deep/button {
        min-width: 24px !important;
      height: 24px;
      cursor: default;
      }
      /deep/.el-pagination__jump {
        position: relative;
      margin-left: 5px;
      background: #5FAFE4;
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
        width: 40px;
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
          margin-left: 48px ;
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
          margin-left: 4px;
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
  // /deep/.myAddForm{
  //   position: relative;
  //   height: 560px;
  //   top:50%;
  //   bottom: 50%;
  //   transform: translateY(-50%);
  //   margin-top:0 !important;
  //   /deep/.el-form-item{
  //     height: 40px !important;
  //     .el-form-item__content{
  //       margin-bottom: 15px !important;
  //       height: 40px !important;
  //       .el-input__inner{
  //         height: 40px !important;
  //       }
  //       .tips{
  //         color: red;
  //         position: absolute;
  //         bottom: -25px;
  //         left:0;
  //       }
  //     }
  //   }
  //   .addNow{
  //     position: absolute;
  //     height: 30px;
  //     padding: 0 5px;
  //     border-radius: 4px;
  //     line-height: 30px;
  //     background-color: #F8AC59;
  //     bottom: 20px;
  //     left:50%;
  //     margin-left: -20px;

  //   }
  // }
  /deep/.isPrint-box{
    position: relative;
    height: 200px;
    width: 300px;
    background-color: #fff;
    position: absolute;
    margin-top: -100px !important;
    margin-left: -150px;
    left: 50%;
    top: 50%;
    bottom: 50%;
    .el-dialog__header{

    }
    .el-dialog__body{
      padding: 20px 30px 0 30px  !important;
      text-align: center;
      .price{
        color: red;
      }
      .btn-confirm-record1,.btn-confirm-record2{
        position: absolute;
        bottom: 20px;
        padding: 0 5px;
        height: 30px;
        line-height: 30px;
        cursor: pointer;
        border-radius: 4px;
      }
      .btn-confirm-record1{
        border: 1px solid #CCCCCC;
        left: 20px;
        color: #999999;
        padding: 0 8px;
      }
      .btn-confirm-record2{
        color: #fff;
        background-color: #25BAD9;
        right: 20px;
      }
    }
  }
  #compcharge{
    position: relative;
    height: 80%;
    background-color: #fff;

    .table-box{ //table
      position: absolute;
      width: 100%;
      top: 60px;
      bottom: 32px;
      /deep/.el-table__header{
        width: 100% !important;
      }
      /deep/.el-table__body{

      }
      /deep/.myRow {
        height: 56px;
        padding: 0;
      }
      /deep/.myRow > td {
        padding: 0;
      }
      /deep/.myCell {
        border-collapse: collapse;
        .cell{
          height: 30px;
          line-height: 30px;
          position: relative;
        //   button{
        //     position: absolute;
        //   }
        //   .btn-print{
        //     left: 0
        //   }
        //   .btn-refound{
        //     left: 40px;
        //   }
        //   .btn-record{}
        }

      }
    }
    .page-box{
      position: absolute;
      bottom: 0;
    }
    .my-pagination-box{
      display: inline-block;
    }
    .top-button-box{
      position: relative;
      background-color: #999;
      height: 60px;
      .btn1{
        position: absolute;
        top: 50%;
        bottom: 50%;
        margin-top: -13px;
        left: 20px;
        width:52px;
        height: 26px;
        cursor: pointer;
        text-align: center;
        line-height: 28px;
        border-radius: 4px;
        background-color: #25BAD9;
        display: inline-block;
        color: #fff;
        padding: 0 12px;
        font-size: 14px;
      }
      .search-box{
        height: 26px;
        position: absolute;
        top: 50%;
        right: 20px;
        bottom: 50%;
        margin-top: -13px;
        input{
          outline: none;
          border: none;

        }
      }
    }

    .box-header{
    height: 60px;
    position: relative;
    .add-btn{
      cursor: pointer;
      background-color: #25BAD9;
      color: #fff;
      height: 26px;
      position: absolute;
      top: 50%;
      bottom: 50%;
      left: 20px;
      margin-top: -13px;
      padding: 0 12px;
      border-radius: 4px;
    }
    .search-btn{
        position: absolute;
        height: 26px;
        background-color: #25BAD9;
        top: 50%;
        bottom: 50%;
        right: 20px;
        margin-top: -13px;
        z-index: 9;
        color: #fff;
        font-size: 14px;
        line-height: 26px;
        padding: 0 5px;
        cursor: pointer;
      }
    .sreach-box{
      width: 200px;
      height: 26px;
      position: absolute;
      top: 50%;
      bottom: 50%;
      right: 20px;
      margin-top: -13px;
      background-color: #ddd;
      border: 1px solid #ddd;
      /deep/.el-input__inner{
        height: 100% !important;
        padding-left: 4px !important;
      }
    }
  }

}
//申请退款框样式

/deep/.myRefoundForm {
  position: relative;
    height: 760px;
    max-width: 600px;
    min-width: 500px;
    top:50%;
    bottom: 50%;
    transform: translateY(-50%);
    margin-top:0 !important;
    .el-form{
      padding: 30px !important;
    }
    /deep/.el-form-item{
      height: 40px !important;
      .el-form-item__content{
        margin-bottom: 15px !important;
        height: 40px !important;
        .el-input__inner{
          border: 1px solid #dfdfdf !important;
          cursor: default;
          height: 32px !important;
          color: #666;
        }
        .tips{
          color: red;
          position: absolute;
          bottom: -28px;
          left:0;
        }
      }
    }
    .addNow{
      cursor: pointer;
      position: absolute;
      height: 30px;
      padding: 0 5px;
      border-radius: 4px;
      line-height: 30px;
      background-color: #F8AC59;
      bottom: 20px;
      left:50%;
      margin-left: -20px;

    }
}

</style>
