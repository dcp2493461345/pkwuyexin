<template>
  <div id="enterprise-info" class="infor-warp">
    <span v-if="showDot" class="dot"></span>
    <!-- <el-dialog
        title="提示"
        :visible.sync="centerDialogVisible"
        :close-on-click-modal="false"
        :modal="false"
        custom-class="centerDia"
        center>
        <p style="text-align:center">是否删除该企业信息?</p>
        <span slot="footer" class="dialog-footer">
          <el-button @click="centerDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="didAgreen">确 定</el-button>
        </span>
    </el-dialog> -->

    <el-dialog
      title="提示"
      :visible.sync="centerDialogVisible"
      :append-to-body="true"
      custom-class="myConfirm"
      :close-on-click-modal="false"
      width="250"
      center>
      <p style="text-align:center;">是否删除该企业信息</p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="didAgreen">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分页 -->

    <!-- <span class="page-tip">共{{ Math.ceil(pageInfo.total/pageInfo.listRows) }}页,{{ pageInfo.total }}条</span>
    <div class="my-pagination-box">
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

    <div slot="header" class="clearfix">
      <div class="box-header">
        <span v-show="!isSearch" class="add-btn" @click="openAdd">添加企业信息</span>
        <span v-show="isSearch" class="add-btn" @click="backTable">返回上一级</span>
        <span v-show="!isSearch" class="search-btn" @click="handleSearch">搜索</span>
        <el-input @keyup.enter.native="handleSearch" v-show="!isSearch" v-model="searchData" class="sreach-box" clearable placeholder="输入搜索内容" />
      </div>
    </div>
    <!-- <div class="noInfo" v-if="!isShowCard">
      目前还没有相关数据!!
    </div>-->
    <el-card v-if="isShowCard" class="list-card">
      <!-- 图片预览框 -->
      <el-dialog
        :close-on-click-modal="false"
        :modal="true"
        :modal-append-to-body="true"
        :append-to-body="true"
        :visible.sync="ImgDiaLog.origin"
        width="100%"
        title="工商执照"
        custom-class="myLiscencePre"
        style="width: 800px;height:600px;overflow:hidden;position:fixed;top:50%;margin:-300px auto 0;"
        :before-close="handleImgClose"
      >
        <!-- 轮播图片 -->
        <el-carousel height="500px" :autoplay="true" indicator-position="outside">
          <el-carousel-item v-for="item in ImgDiaLog.originSrc" :key="item">
            <img :src="item" alt>
          </el-carousel-item>
        </el-carousel>
        <!-- <img src="http://test.txsqtech.com/uploads/20191013/44a2feb2642dd2f78ad66637e8e4aab6.jpg"> -->
      </el-dialog>

      <!-- 企业列表 -->
      <el-table
        empty-text="暂无数据"
        :data="tableData"
        row-class-name="myRow"
        cell-class-name="myCell"
        style="width: 100%; height:100%;"
      >
        <el-table-column prop="Companyname" label="公司名称" min-width="200" />
        <el-table-column prop="Companyaddress" label="地址" min-width="200" />
        <el-table-column prop="phonename" label="联系人" min-width="120" />
        <el-table-column prop="phone" label="联系电话" min-width="120" />
        <el-table-column prop="cente" label="备注" min-width="250" class="note" />
        <el-table-column label="操作" min-width="300" fixed="right">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              class="operateBtn btn-modify"
              @click="handleModifyClick(scope.row)"
            >修改</el-button>
            <el-button
              size="small"
              class="operateBtn btn-licence"
              @click="handleLicenseClick(scope.row)" style="width:72px;"
            >工商执照</el-button>
            <el-button
              type="text"
              size="small"
              class="operateBtn btn-delete"
              @click="handleDeleteClick(scope.row)"
            >删除</el-button>
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
        <el-form :model="operateRecord">
          <el-form-item label="上次操作员" :label-width="formLabelWidth">
            <el-input v-model="operateRecord.uname" autocomplete="off" />
          </el-form-item>
          <el-form-item label="上次操作时间" :label-width="formLabelWidth">
            <el-input v-model="operateRecord.time" :disabled="true" autocomplete="off" />
          </el-form-item>
          <el-form-item label="上次操作ip地址" :label-width="formLabelWidth">
            <el-input v-model="operateRecord.ip" autocomplete="off" />
          </el-form-item>
        </el-form>
        <div class="btn-confirm-record" @click="RecordialogFormVisible=false">确认</div>
      </el-dialog>
      <!-- 分页 -->
      <!-- <div class="block">
      <el-pagination
        background
        :page-size="listNum"
        :current-page="currentPage"
        layout="prev, pager, next, jumper"

        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        @next-click="nextClickHandler"
      />
      </div>-->
    </el-card>

    <!-- 添加企业信息 -->
    <el-dialog
      title="添加企业"
      custom-class="myAddForm"
      class="position:fixed;top:10px;"
      :close-on-click-modal="false"
      :append-to-body="true"
      :visible.sync="dialogFormVisible"
      :before-close="handleClose"
    >
      <el-form ref="form" :model="addData" label-width="80px">
        <el-form-item label="公司名称:">
          <el-input v-model="addData.Companyname" />
          <p v-if="tips.t1" v-show="tips.t11" class="tips" >请输入公司名称</p>
        </el-form-item>
        
        <el-form-item label="公司地址:">
          <el-input v-model="addData.Companyaddress" />
          <span v-if="!tips.t1&&tips.t2" class="tips" v-show="tips.t22">请输入公司地址</span>
        </el-form-item>
        
        <el-form-item label="联系人:">
          <el-input v-model="addData.phonename" />
          <span v-if="!tips.t1&&!tips.t2&&tips.t3" v-show="tips.t33" class="tips">请输入联系人</span>
        </el-form-item>
        
        <el-form-item label="联系电话:">
          <el-input v-model="addData.phone" />
          <span v-if="!tips.t1&&!tips.t2&&!tips.t3&&tips.t4" ref="phoneNum" v-show="tips.t44" class="tips">请输入联系电话</span>
          <span v-if="tips.t0&&!tips.t1&&!tips.t2&&!tips.t3&&!tips.t4" ref="phoneNum" v-show="tips.t00" class="tips">请输入正确的联系电话</span>
        </el-form-item>
        

        <el-form-item label="工商执照:" style="height:60px !important;margin-top:10px;">
          <!-- 图片列表box -->
          <div ref="myImg" class="up-img">
            <el-upload
              ref="addUpload"
              :limit="3"
              action="#"
              :on-remove="handleRemove"
              :on-preview="handlePictureCardPreview"
              :on-change="handleChange"
              list-type="picture-card"
              :auto-upload="false"
              :class="{hide:hideAdd}"
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
          title="工商执照1"
          custom-class="preBigPic"
          :modal="mod"
          :append-to-body="true"
          :fullscreen="true"
        >
          <img width="100%;height:100%;" :src="ImgDiaLog.addSrc" alt>
        </el-dialog>

        <el-form-item label="备注:" style="height:125px !important;margin-top:20px;">
          <el-input v-model="addData.cente" style="resize:none;outline:none;" type="textarea" />
        </el-form-item>

        <div class="addNow" @click="onSubmit">立即添加</div>
      </el-form>
    </el-dialog>

    <!-- 修改企业信息 -->
    <el-dialog
      title="修改企业"
      custom-class="myModifyForm"
      :append-to-body="true"
      :close-on-click-modal="false"
      :visible.sync="modifydialogFormVisible"
      :before-close="handleModifyClose"
    >
      <el-form ref="modifyForm" :model="modifyData" label-width="80px">
        <el-form-item label="公司名称:">
          <el-input v-model="modifyData.Companyname" />
          <p v-if="tips.t1" v-show="tips.t11" class="tips">请输入公司名称</p>
        </el-form-item>

        <el-form-item label="公司地址:">
          <el-input v-model="modifyData.Companyaddress" />
          <span v-if="!tips.t1&&tips.t2" class="tips" v-show="tips.t22">请输入公司地址</span>
        </el-form-item>
        
        <el-form-item label="联系人:">
          <el-input v-model="modifyData.phonename" />
          <span v-if="!tips.t1&&!tips.t2&&tips.t3" class="tips">请输入联系人</span>
        </el-form-item>
        
        <el-form-item label="联系电话:">
          <el-input v-model="modifyData.phone" />
          <span v-if="!tips.t1&&!tips.t2&&!tips.t3&&tips.t4" ref="phoneNum" class="tips">请输入联系电话</span>
          <span v-if="tips.t0&&!tips.t1&&!tips.t2&&!tips.t3&&!tips.t4" ref="phoneNum" v-show="tips.t00" class="tips">请输入正确的联系电话</span>
        </el-form-item>
        

        <el-form-item label="工商执照:" style="height:60px !important;margin-top:10px;">
          <div class="up-img">
            <el-upload
              ref="modifyUpload"
              action="#"
              :limit="3"
              :file-list="temImgArr1"
              :on-remove="handleRemove1"
              :on-preview="handlePictureCardPreview1"
              :on-change="handleChange1"
              list-type="picture-card"
              :auto-upload="false"
              :class="{hide:hideModify}"
            >
              <i slot="default" class="el-icon-plus" />
              <div slot="file" slot-scope="{file}">
                <!-- <img
                class="el-upload-list__item-thumbnail"
                :src="file.url" alt=""
                >-->
                <span class="el-upload-list__item-actions">
                  <span
                    class="el-upload-list__item-preview"
                    @click="handlePictureCardPreview1(file)"
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
            <!-- 图片预览box -->

            <el-dialog
              style="width:100%;background:#999;padding-top:90px;"
              :visible.sync="ImgDiaLog.modify"
              title="工商执照"
              :modal="mod"
              :append-to-body="true"
              :fullscreen="true"
            >
              <img width="100%;height:100%;" :src="ImgDiaLog.modifySrc" alt>
            </el-dialog>
          </div>
        </el-form-item>

        <el-form-item label="备注:" style="height:125px !important;margin-top:20px;">
          <el-input v-model="modifyData.cente" style="resize:none;" type="textarea" />
        </el-form-item>

        <div class="addNow" @click="onSubmitModify">确认修改</div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios'
// import qs from 'qs'
export default {
  name: 'EnterpriseInfo',
  data() {
    return {
      btn_addNow: true, // 允许添加
      hideAdd: false, // 隐藏上传图片的加号
      hideModify: false, // 隐藏修改图片的加号
      showDot: false,
      userInfo: {},
      delEnterpriseId: '',
      centerDialogVisible: false,
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
        t5: ''
      },
      commonData: {
        token: '',
        Communityid: '',
        uname: ''
      },
      isSearch: false, // 是否显示
      searchData: '',
      SearchResult: [],
      temImgArr1: [], // 缩略图
      formLabelWidth: '120px', // 记录表格宽度
      // 操作记录
      operateRecord: {
        ip: '',
        uname: '',
        time: ''
      },
      ImgDiaLog: { // 图片弹窗显示与否
        origin: false,
        originSrc: '',
        add: false,
        addSrc: '',
        modify: false,
        modifySrc: ''

      },
      mod: false, // 不需要遮罩层
      fullScreen: true,

      // 验证输入是否正确
      inputData: {
        Companyname: false,
        Companyaddress: false,
        phonename: false,
        phone: false
      },
      modify: {
        Companyname: '', // 公司名字
        Companyaddress: '',
        phonename: '', // 联系人
        phone: '',
        cente: '', // 备注
      },

      // 显示与影藏
      isShowCard: false, // 是否显示表格
      dialogFormVisible: false, // 增加框初始隐藏
      modifydialogFormVisible: false, // 修改框
      RecordialogFormVisible: false, // 记录框
      dialogVisible: false, // 添加框
      dialogVisible1: false, // 修改框
      disabled: false,

      // 分页信息
      pageInfo: {
        page: 1, // 当前页
        total: null, // 总条数
        listRows: null, // 每页多少条
        pageNum: null, // 总页数
        render: ''
      },
      tableDataOld: [], // 临时保存的data
      // 查询企业信息
      tableData: [
        {
          Companyname: '', // 公司名字
          enterpriseId: '', // 主键id
          Companyaddress: '',
          phonename: '', // 联系人
          phone: '',
          img: [], // 工商执照
          cente: '', // 备注
          ip: '', // IP地址
          time: '', // 操作时间
          uname: '', // 操作人
          Communityid: '' // 小区id
        }
      ],

      fileLists: [], // 添加的图片列表
      fileLists1: [], // 修改的图片列表
      // 添加的公司信息
      addData: {
        Communityid: '',
        uname: '', // 用户名
        Companyname: '',
        Companyaddress: '',
        phonename: '',
        phone: '',
        img: [], // 添加的图片
        cente: '' // 备注

      },
      // 旧图片地址
      oldImgs: '',
      // 修改的公司信息
      modifyData: {
        enterpriseId: '', // 社区id
        Companyname: '', // 公司名字
        Companyaddress: '', // 公司地址
        phonename: '', // 联系人
        phone: '', // 联系人电话
        imgs: 'old', // 原有的图片
        img: 'new', // 新加的图片
        cente: '',
        uname: ''
      }
    }
  },
  watch: { // 监听并验证添加的信息
    fileLists () {

    },
    'addData.Companyname': function() {
      if (this.addData.Companyname !== '') {
        this.inputData.Companyname = true
      } else {
        this.inputData.Companyname = false
      }
    },
    'modifyData.Companyname': function() {
      if (this.modifyData.Companyname !== '') {
        this.inputData.Companyname = true
      } else {
        this.inputData.Companyname = false
      }
    },
    'addData.Companyaddress': function() {
      if (this.addData.Companyaddress !== '') {
        this.inputData.Companyaddress = true
      } else {
        this.inputData.Companyaddress = false
      }
    },
    'modifyData.Companyaddress': function() {
      if (this.modifyData.Companyaddress !== '') {
        this.inputData.Companyaddress = true
      } else {
        this.inputData.Companyaddress = false
      }
    },
    'addData.phonename': function() {
      if (this.addData.phonename !== '') {
        this.inputData.phonename = true
      } else {
        this.inputData.phonename = false
      }
    },
    'modifyData.phonename': function() {
      if (this.modifyData.phonename !== '') {
        this.inputData.phonename = true
      } else {
        this.inputData.phonename = false
      }
    },
    // 'addData.phone': function() {
 
    //     // 验证手机号码
    //     if (!(/^1[3456789]\d{9}$/.test(this.addData.phone))) {
    //       this.$refs.phoneNum.innerHTML = '请输入正确的手机号码'
    //       // this.$refs.phoneNum.innerHTML="手机号码正确"
    //     } else {
    //       this.$refs.phoneNum.innerHTML = ''
          
    //     }

    //     // console.log(this.$refs.phoneNum)
    // },
    'modifyData.phone': function() {
      if (this.modifyData.phone !== '') {
        // 验证手机号码
        if ((/^1[3456789]\d{9}$/.test(this.modifyData.phone))) {
          console.log('手机号码正确')
          // this.$refs.phoneNum.innerHTML="手机号码正确"
          this.inputData.phone = true
        } else {
          this.inputData.phone = false
          this.$refs.modifyPhoneNum.innerHTML = '请输入正确的手机号码'
        }
      } else {
        this.inputData.phone = false
      }
    }
  },
  created() {
    this.getuserInfo()
    this.getJudgeList()
    this.getCommonData()
    // console.log(this.commonData)
    this.getComList()
    document.addEventListener('keydown', this.aa, false)
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
    didAgreen() {
        this.centerDialogVisible = false
        this.sendDeleteRequest(this.delEnterpriseId)
      },
    aa(e) {
      if (e.keyCode === 116) {
        e.preventDefault()
      }
    },
    getCommonData() {
      const { uname, Communityid } = JSON.parse(localStorage.getItem('userInfo')).data
      const { token } = JSON.parse(localStorage.getItem('userInfo'))
      this.commonData.token = token
      this.commonData.uname = uname
      this.commonData.Communityid = Communityid
    },
    // 点击搜索返回
    backTable() {
      this.isSearch = false
      this.tableData = this.tableDataOld
      // 重新获取新的数据
      this.getComList()
    },
    handleSearch() {
      const { Communityid, token } = this.commonData
      if (this.searchData === '') {
        this.$message({
          message: '搜索内容不能为空',
          type: "warning"
        })
      } else {
        axios.post('http://test.txsqtech.com/index/Enterprise/search',
          {
            Communityid,
            name: this.searchData
          },
          {
            headers: {
              token
            }
          }).then(res => {
            
          this.searchData = ''

          if (res.data.code !== 200) {
            this.$message({
              message: res.data.msg,
              type: 'warning'
            })
          } else {
            this.isSearch = true
            this.pageInfo.page = Number(res.data.msg.page)
            this.pageInfo.total = res.data.msg.total
            this.pageInfo.listRows = res.data.msg.listRows
            this.pageInfo.pageNum = res.data.msg.pageNum
            this.pageInfo.render = res.data.msg.render
            this.SearchResult = res.data.msg.data
            // 显示搜索结果
            console.log(this.tableData, '9990909090')
            this.tableDataOld = this.tableData
            this.tableData = this.SearchResult
            console.log(this.SearchResult, '搜索的结果')
          }
        })
      }
    },
    handleImgClose() {
      console.log('关闭预览')
      this.ImgDiaLog.origin = false // 工商执照
    },
    /* 点击操作记录*/
    handleRecordClick(v) {
      this.RecordialogFormVisible = true
      console.log(v)
      this.operateRecord.uname = v.uname
      this.operateRecord.time = v.time
      this.operateRecord.ip = v.ip
    },
    /* 点击工商执照*/
    handleLicenseClick(v) {
      console.log('aaaa', v.img)
      if (v.img) {
        const imgArr = v.img.split(',')
        const imgs = []

        for (let i = 0; i < imgArr.length; i++) {
          if (imgArr[i]) {
            // if (imgArr[i].includes('http://test.txsqtech.com/uploads/')) {
            //   imgs.push('' + imgArr[i])
            // } else {
            //   imgs.push('http://test.txsqtech.com/uploads/' + imgArr[i])
            // }
            imgs.push(imgArr[i])
          }
        }
        this.ImgDiaLog.originSrc = imgs
        this.ImgDiaLog.origin = true
      } else {
        this.$message({
          message: '目前尚未上传执照',
          type: 'warning'
        })
      }

      // console.log(this.imgDialogSrc)
      console.log(this.ImgDiaLog.originSrc)
    },
    /* 点击删除*/
    handleDeleteClick(v) {
      this.centerDialogVisible = true

      this.delEnterpriseId = v.enterpriseId
      // this.sendDeleteRequest(enterpriseId)
    },
    /* 点击修改*/
    handleModifyClick(v) {
      let oldImg = v.img.split(',')
      if(oldImg.length < 3){
        this.hideModify = false
      } else {
        this.hideModify = true
      }
      this.modifyData.Companyname = v.Companyname
      this.modifyData.Companyaddress = v.Companyaddress
      this.modifyData.phonename = v.phonename
      this.modifyData.phone = v.phone
      this.modifyData.cente = v.cente
      this.modifyData.enterpriseId = v.enterpriseId
      
      if (v.img) {
        const imgArr = v.img.split(',')
        let j = 0
        for (let i = 0; i < imgArr.length; i++) {
          if (imgArr[i]) {
            console.log(imgArr[i], 'aaaaaaaaaaaaaaaaaa')
            // if (imgArr[i].includes('http://test.txsqtech.com/uploads/')) {
            //   imgArr[j] = '' + imgArr[i]
            //   // this.temImgArr.push(imgArr[j])
            // } else {
            //   imgArr[j] = 'http://test.txsqtech.com/uploads/' + imgArr[i]
            // }
            this.temImgArr1.push({ url: imgArr[j] }) // 缩略图
            j++
          }
        }

        this.modifyData.imgs = imgArr // 原有图片
      }
      this.modifydialogFormVisible = true

      console.log(this.temImgArr, '以前的图片')

      console.log(this.modifyData, '修改数据上传')
      console.log(this.temImgArr1, '缩略图地址11')
    },

    /* 确认修改*/
    onSubmitModify() {
      if (!(/^1[3456789]\d{9}$/.test(this.modifyData.phone))) {
          this.tips.t0 = true
          this.tips.t00 = true
          setTimeout(() =>{
          this.tips.t00 = false
        },3000)
      } else {
        this.tips.t0 = false
      }
      if(!this.modifyData.Companyname){
        this.tips.t1 = true
        this.tips.t11 = true
        setTimeout(() =>{
          this.tips.t11 = false
        },3000)
        
      } else {
        this.tips.t1 = false
      }
      if(!this.modifyData.Companyaddress){
        this.tips.t2 = true
        this.tips.t22 = true
        setTimeout(() =>{
          this.tips.t22 = false
        },3000)
      } else {
        this.tips.t2 = false
      } 
      if(!this.modifyData.phonename){
        this.tips.t3 = true
        this.tips.t33 = true
        setTimeout(() =>{
          this.tips.t33 = false
        },3000)
      } else {
        this.tips.t3 = false
      } 
      if(!this.modifyData.phone){
        this.tips.t4 = true
        this.tips.t44 = true
        setTimeout(() =>{
          this.tips.t44 = false
        },3000)
      } else {
        this.tips.t4 = false
      } 
      const { uname, Communityid } = this.userInfo
      // const replcaeData = JSON.parse(localStorage.getItem('replcaeData'))
      // console.log(replcaeData)
      // this.modifyData.Communityid = replcaeData.Communityid
      // this.modifyData.uname = replcaeData.uname

      const formData1 = new FormData()
      formData1.append('Communityid', Communityid)
      formData1.append('enterpriseId', this.modifyData.enterpriseId)
      formData1.append('uname', uname)
      formData1.append('Companyname', this.modifyData.Companyname)
      formData1.append('Companyaddress', this.modifyData.Companyaddress)
      formData1.append('phonename', this.modifyData.phonename)
      formData1.append('phone', this.modifyData.phone)
      let imgStr = ''
      this.temImgArr1.forEach(item => {
        console.log(item.url)
        imgStr += item.url
        imgStr += ','
      })
      imgStr = imgStr.slice(0, -1)
      // ??
      console.log(imgStr, 'str旧图片旧图片旧图片')
      formData1.append('imgs', imgStr) // 旧图片
      formData1.append('cente', this.modifyData.cente)
      this.fileLists1.forEach((item) => {
        console.log(item.raw)
        if (item.raw) {
          formData1.append('img[]', item.raw) // 新图片
        }
      })

      // formData1.append('imgs[]', this.temImgArr) //旧图片

      console.log(this.modifyData, '修改请求数据')
      console.log(this.fileLists1)

      this.sendModifyRequest(formData1)
    },
    // 发送修改请求
    sendModifyRequest(formData1) {
      // let isDone = true // 信息是否完善
      // const obj = this.inputData
      // for (const i in obj) {
      //   if (!obj[i]) {
      //     isDone = false
      //   }
      // }
      if (!this.tips.t0&&!this.tips.t1&&!this.tips.t2&&!this.tips.t3&&!this.tips.t4) { // 向后端发送请求
        // 清空输入的数据
        this.addData =
          {
            Communityid: '',
            uname: '', // 用户名
            Companyname: '',
            Companyaddress: '',
            phonename: '',
            phone: '',
            img: [], // 添加的图片
            cente: '' // 备注
          }
        const { token } = this.commonData
        axios.post('http://test.txsqtech.com/index/Enterprise/addtos',
          formData1
          ,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              token
            }
          }
        )
          .then(res => {
            this.$refs.modifyUpload.clearFiles()
            // if (res.data.code === 405) {
            //   this.$message({
            //     message: '该企业已近存在',
            //     type: 'warning'
            //   })
            // }
            // if (res.data.code === 500) {
            //   this.$message({
            //     message: '服务器错误',
            //     type: 'warning'
            //   })
            // }
            // if (res.data.code === 400) {
            //   this.$message({
            //     message: '数据错误',
            //     type: 'warning'
            //   })
            // }
            if (res.data.code === 200) {
              this.$message({
                message: '修改成功',
                type: 'success'
              })
              this.temImgArr1 = [] // 缩略图
              this.fileLists1 = []
              this.getComList() // 获取跟新的数据
              this.isShowCard = true// 是否显示表格
              this.modifydialogFormVisible = false // 修改框框隐藏
            } else {
              this.$message({
                message: res.data.msg,
                type: "warning"
              })
            }
          })
      }
    },
    // 发送删除请求
    sendDeleteRequest(enterpriseId) {
      axios.post('http://test.txsqtech.com/index/Enterprise/delete',
        { enterpriseId },
        {
          headers: {
            token: this.commonData.token
          }
        })
        .then(res => {
          if (res.data.code === 200) {
            this.getComList() // 获取跟新的数据
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            
          } else {
            this.$message({
              message: res.data.msg,
              type: 'warning'
            })
          }
        })
    },
    /* 请求企业信息 */
    getComList() {
      const { token, Communityid } = this.commonData
      // const token = JSON.parse(localStorage.getItem('userInfo')).token
      axios.post(`http://test.txsqtech.com/index/Enterprise/nterprise?page=${this.pageInfo.page}`,
        { Communityid },
        {
          headers: {
            token
          }
        }
      )
        .then(res => {
          if (res.data.code === 200) {
            this.isSearch = false
            this.pageInfo.page = Number(res.data.data.page)
            this.pageInfo.total = res.data.data.total
            this.pageInfo.listRows = res.data.data.listRows
            this.pageInfo.pageNum = res.data.data.pageNum
            this.pageInfo.render = res.data.data.render
            // console.log(this.pageInfo)
            // this.listNum = res.data.data.listRows //每页显示的条数
            // this.totalPage = res.data.data.total //总条数
            // this.pages = Math.ceil(this.totalPage/this.listNum)
            // console.log(this.listNum,this.totalPage,this.totalPage)
            // console.log('数据条数: '+res.data.data.data.length)
            
              this.tableData = res.data.data.data
              console.log(this.tableData)
              this.isShowCard = true // 显示公司列表
              console.log(res.data.data.data, '得到的数据')
            
          } else {
            this.$message({
              message: res.data.msg,
              type: 'warning'
            })
          }
        })
    },
    /* 添加企业信息 */
    addComList() {

    },

    // 图片事件 添加
    handleRemove(file, fileList) {
      this.fileLists = fileList
      if(this.fileLists.length < 3){
        this.hideAdd = false
      }
      console.log(file)
    },
    handleRemove1(file, fileList) {
      console.log(file)
      const uid = file.uid //删除的图片
      this.temImgArr1.forEach((item, index) => {
        if(item.uid === uid){
          delete this.temImgArr1[index]
        }
      })
      console.log(this.temImgArr1)
      if(this.fileLists1.length < 3){
        this.hideModify = false
        this.fileLists1 = fileList
      }
    },
    handlePictureCardPreview(file) {
      this.ImgDiaLog.addSrc = file.url
      this.ImgDiaLog.add = true // 添加预览
      console.log(123)
    },
    handlePictureCardPreview1(file) {
      this.ImgDiaLog.modifySrc = file.url
      this.ImgDiaLog.modify = true // 修改预览
      console.log(123)
    },
    // 本地选中的图片变化
    handleChange(file, fileList) {
      if (fileList.length < 4) { // 允许最多上传三张图片
        //this.$refs.myImg.style.display = 'none';
        this.fileLists = fileList
      }
      // if (fileList.length < 3) {
      //   this.$message({
      //     message: '已达到上限',
      //     type: 'warning'
      //   })
      // }
      if(this.fileLists.length < 3) {
        this.hideAdd = false
      } else {
        this.hideAdd = true
      }
    },
    handleChange1(file, fileList) {
      console.log(fileList.length, 'dddddddddddddddddddddddddddd')
      if (fileList.length < 4) {
        this.fileLists1 = fileList
      } 
      if(this.fileLists1.length < 3){
          this.hideModify = false
        } else {
          this.hideModify = true
      }
    },
    openAdd() {
      if(this.fileLists.length < 3){
        this.hideAdd = false
      } else {
        this.hideAdd = true
      }
      //this.isShowCard = false
      this.dialogFormVisible = true
      
    },

    // 添加公司
    onSubmit() {
      if(!this.addData.Companyname){
        this.tips.t1 = true
        this.tips.t11 = true
        setTimeout(() =>{
          this.tips.t11 = false
        },3000)
        
      } else {
        this.tips.t1 = false
      }
      if(!this.addData.Companyaddress){
        this.tips.t2 = true
        this.tips.t22 = true
        setTimeout(() =>{
          this.tips.t22 = false
        },3000)
      } else {
        this.tips.t2 = false
      } 
      if(!this.addData.phonename){
        this.tips.t3 = true
        this.tips.t33 = true
        setTimeout(() =>{
          this.tips.t33 = false
        },3000)
      } else {
        this.tips.t3 = false
      } 
      if(!this.addData.phone){
        this.tips.t4 = true
        this.tips.t44 = true
        setTimeout(() =>{
          this.tips.t44 = false
        },3000)
      } else {
        this.tips.t4 = false
      } 
      if (!(/^1[3456789]\d{9}$/.test(this.addData.phone))) {
          this.tips.t0 = true
          this.tips.t00 = true
          setTimeout(() =>{
          this.tips.t00 = false
        },3000)
      } else {
        this.tips.t0 = false
      }

      
      

      // let isDone = true // 信息是否完善
      // const obj = this.inputData
      // for (const i in obj) {
      //   if (!obj[i]) {
      //     isDone = false
      //   }
      // }
      if (!this.tips.t0&&!this.tips.t1&&!this.tips.t2&&!this.tips.t3&&!this.tips.t4&&btn_addNow) { // 向后端发送请求
        this.btn_addNow = false // 禁止连续点击添加
        const { token, Communityid, uname } = this.userInfo
      // const userInfo = JSON.parse(localStorage.getItem('userInfo'))
      // console.log(replcaeData)
      // this.addData.Communityid = userInfo.data.Communityid
      // this.addData.uname = userInfo.uname

      const formData = new FormData()
      formData.append('Communityid', Communityid)
      formData.append('uname', uname)
      formData.append('Companyname', this.addData.Companyname)
      formData.append('Companyaddress', this.addData.Companyaddress)
      formData.append('phonename', this.addData.phonename)
      formData.append('phone', this.addData.phone)

      formData.append('cente', this.addData.cente)
      if(this.fileLists.length !==0){
        this.fileLists.forEach((item) => {
          console.log(item, 'Youyoiyoyoyoyoyyoyoyyoyyyo')
          formData.append('img[]', item.raw)
        })
      }
      this.fileLists = []
      console.log(formData)
        // const token = JSON.parse(localStorage.getItem('userInfo')).token
        axios.post('http://test.txsqtech.com/index/Enterprise/addto',
          formData
          ,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              token
            }
          }
        )
          .then(res => {
            this.btn_addNow = true
            this.$refs.addUpload.clearFiles()
            
            if (res.data.code === 200) {
              this.$message({
                message: '添加成功',
                type: 'success'
              })
              this.addData = {
                Communityid: '',
                uname: '', // 用户名
                Companyname: '',
                Companyaddress: '',
                phonename: '',
                phone: '',
                img: [], // 添加的图片
                cente: '' // 备注
              }
              this.getComList() // 获取跟新的数据
              this.isShowCard = true// 是否显示表格
              this.dialogFormVisible = false // 增加框初始隐藏
            } else {
              this.$message({
                message: res.data.msg,
                type: 'warning'
              })
            }
          })
      }
    },

    addCom() { // 点击添加公司

      // Vue.set(this.tableData,2,this.newData)
    },
    // 关闭添加
    clearAddData() {
      this.addData = {
        Communityid: '',
        uname: '', // 用户名
        Companyname: '',
        Companyaddress: '',
        phonename: '',
        phone: '',
        img: [], // 添加的图片
        cente: '' // 备注
      }

    },
    handleClose() {
      this.fileLists = []
      this.$refs.addUpload.clearFiles()
      this.clearAddData()
      this.getComList()
      this.dialogFormVisible = false
      this.isShowCard = true
      // console.log('close 弹窗')
    },
    // 关闭修改
    handleModifyClose() {
      this.hideModify = false
      this.temImgArr1 = [] // 缩略图
      this.temImgArr = [] // 临时旧图
      this.modifydialogFormVisible = false
      this.isShowCard = true
    },

    // 页码相关事件
    handleSizeChange() {
      console.log(11)
    },
    handleCurrentChange(val) {
      console.log(val)
      this.pageInfo.page = val
      this.getComList()
    },
    nextClickHandler(val) {
      console.log(val, '354')
    }

  }
}
</script>
<style lang="scss" scoped>
/deep/.myConfirm{
  margin: 0 !important;
  width: 408px !important;
  height: 200px !important;
  position: absolute;
  top:50%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
  .el-dialog__footer{
    position: relative;
    padding-top: 50px;
  }
  .el-button{
    position: absolute;
    padding: 5px;
    span{
      font-size: 14px;
    }
  }
  .el-button--default{
    left: 30px;
    bottom: 10px;
    background-color: #fff;
    color: #999;
  }
  .el-button--primary{
    right: 30px;
    bottom: 10px;
    background-color: #25BAD9;
    border: 1px solid #25BAD9;
  }
  .el-dialog__header{ //header
      border-bottom: 1px solid #efefef;
      padding: 12px 0 10px 16px;
        text-align: left;
        color: #333333;
        font-size: 16px;
      button{
        position: absolute;
        top: 14px;
      }
    }

}
/deep/.hide .el-upload--picture-card {
  display: none !important;
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
.block {
  z-index: 9;
  padding-left: 20px;
  bottom: -120px;
    position: absolute;
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
    // top: 742px;
    height: 40px;
    width: 100%;
    .el-pagination {
      z-index:9;
      position: absolute;
    bottom: 0;
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
/deep/.centerDia {
  background-color: #333;
  position: absolute;
  top: 30%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
  width: 400px;
  .el-dialog__header{
    display: flex;
    justify-content: space-between;
    .el-dialog__title{
      color: #222 !important;
      font-size: 16px;
      padding-left: 20px;
      left: 0;
    }
    .el-dialog__headerbtn{
      position: static;
      padding-right: 10px;
    }
  }
  .el-dialog__body{
    padding: 30px;
    width: 100%;
    height: 150px;
  }
  .el-dialog__footer{
    margin-bottom: 20px;
    height: 40px;
    .dialog-footer{
      padding-top: 8px;
      height: 40px;
    }
    .el-button{
      height: 30px;
      span{
        display: inline-block;
        height: 30px;;
      }
    }
  }
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
  .cell {
    white-space: nowrap !important;
  }
}
// /deep/.el-card__body{
//   tbody{
//     .el-table__row{
//       height: 30px !important;
//     }
//   }
// }
// /deep/.el-table__row > td{
//   height: 30px;
//   padding: 0
// }
/deep/.el-card__body {
  padding-top: 0 !important;
}
/deep/.infor-warp {
  height: 500px;
  background-color: green;
}
// .addCom{
//   margin-top: 20px;
//   margin-left: 20px;
//   color: #fff;
//   width: 82px;
//   height: 40px;
//   padding: 0;
//   height: 25px;
//   font-size: 12px;
// }
  /deep/.operateBtn{
    color: #fff;
    display: inline-block;
    border-radius: 4px;
    height: 30px;
    width: 52px;
    padding: 4px;
    font-size: 14px;
  }
.btn-modify {
  background: #25bad9;
}
.btn-licence {
  background: #1fbba6;
}
.btn-delete {
  background-color: #BFBFBF;
}
.btn-record {
  background-color: #CCCCCC;
}
/deep/.note {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
/deep/.up-img {
  //width: 60px;
  z-index: 999;
  height: 60px;
  overflow: hidden;
  .el-upload-list .el-upload-list--picture-card {
  }
  .el-icon-plus {
    position: absolute;
    left: 15px;
    top: 15px;
  }
  .el-upload--picture-card {
    position: relative;
    width: 60px !important;
    height: 60px !important;
  }
  .el-upload-list--picture-card {
    height: 60px !important;
    width: 60px !important;
    .el-upload-list__item {
      width: 60px !important;
      height: 60px !important;
    }
    .el-upload-list--picture-card .el-upload-list__item {
      height: 60px !important;
    }
  }
}
.addNow {
  display: block;
  width: 104px;
  height: 35px;
  background: rgba(248, 172, 89, 1);
  border-radius: 4px;
  position: absolute;
  bottom: 20px;
  left: 50%;
  margin-left: -50px;
  font-size: 16px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: rgba(255, 254, 254, 1);
  line-height: 35px;
  text-align: center;
  cursor: pointer;
}
.addNow :hover {
  color: #f44;
}
.noInfo {
  background-color: #ddd;
  color: #f44;
  text-align: center;
}
// 添加表单的样式
/deep/ .el-dialog {
  width: 500px;
  height: 600px;
  background-color: #fff;
  .el-dialog__header {
    height: 40px;
    border-bottom: 1px solid #eff2f5;
    .el-dialog__title {
      position: absolute;
      top: 0;
      left: 20px;
      line-height: 40px;
      font-size: 18px;
      color: #333;
      font-weight: 400;
    }
    .el-dialog__headerbtn .el-dialog__close {
      width: 16px;
      height: 16px;
      color: #333;
      top: 12px;
      right: 21px;
      font-size: 18px;
    }
  }
}
// .text-waring {
//   color: #f44;
// }
.tips {
  color: #f44;
  font-size: 12px;
}

/deep/ .el-dialog__body {
  padding: 20px 0;
  .el-form {
    margin: 0 72px;
    .el-form-item {
      height: 31px !important;
      margin-bottom: 28px !important;
      margin-top: 10px;
      margin: 0;
      .el-form-item__label {
        padding-right: 20px;
        height: 30px;
        line-height: 30px;
        color: #666666;
      }
      .el-form-item__content {
        line-height: 30px;
        height: 30px;
        .el-input {
          height: 30px;
          border: 1px solid #d2d2d2;
          border-radius: 4px;
          .el-input__inner {
            padding: 0;
            height: 100% !important;
            width: 100% !important;
          }
        }
        .el-textarea {
          height: 125px;
          .el-textarea__inner {
            padding: 0;
            height: 100% !important;
            width: 100% !important;
          }
        }
      }
    }
  }
  .el-form-item__label {
    padding-right: 20px;
    height: 30px;
    line-height: 30px;
  }
}
//添加框样式
/deep/.myAddForm,
/deep/.myRecordForm,
/deep/.myModifyForm {

  position: absolute !important;
  top: 50% !important;
  left: 50% !important;
  transform: translateX(-50%) translateY(-50%);
  margin-top: 0 !important;
 
}
/deep/.myRecordForm {
  height: 350px;
  top: 50% !important;
  margin-top: -150px !important;
  /deep/.el-dialog__header {
    position: relative;
    border-bottom: 1px solid rgb(207, 201, 201);
    .el-dialog__title {
      font-size: 18px;
      color: #333333;
    }
    .el-dialog__headerbtn {
      position: absolute;
      right: 0;
      width: 21px;
      height: 21px;
      top: 50%;
      right: 21px;
      margin-top: -10px;
      .el-dialog__close {
        font-size: 21px !important;
      }
    }
  }
  .el-dialog__body {
    .el-form {
      padding-bottom: 30px;
      .el-form-item {
        margin-bottom: 10px;
        .el-form-item__label {
          text-align: left !important;
        }
        .el-form-item__content {
          .el-input {
            height: 31px;
            padding-left: 5px;
            .el-input__inner {
            }
          }
        }
      }
    }
  }
}

//record-style
.btn-confirm-record {
  cursor: pointer;
  color: #fff;
  margin: 10px auto;
  width: 72px;
  height: 35px;
  border-radius: 4px;
  background-color: #f8ac59;
  text-align: center;
  line-height: 35px;
  font-size: 15px;
}
/deep/[data-v-147bdae0] .el-dialog {
  // position: fixed !important;
  // left: 50% !important;
  // margin-left:-250px !important;
  // width: 500px;
}
/deep/[data-v-147bdae0] .el-dialog .el-dialog__header .el-dialog__title {
  // color: #333333 !important;
}
// /deep/.el-dialog__headerbtn{
//   top:10px !important;
// }
// /deep/[data-v-147bdae0] .el-dialog__body{
//   width:500px !important;
//   padding: 0 !important;
//   .el-form{
//     margin: 10px 40px !important;
//     padding: 0 0 20px !important;
//     .el-form-item{
//       margin: 10px 0 !important;
//       .el-form-item__label{
//         text-align: left !important;

//       }
//       .el-input{
//           height: 31px;
//         }
//     }
//   }

// }

//添加工商执照预览图片

/deep/.el-dialog.is-fullscreen {
  width: 1080px !important;
  height: 600px;
}

//点击工商执照出现的大图
/deep/.myLiscencePre {
  .el-dialog__headerbtn{
    top: 13px !important;
  }
  .el-icon .el-icon-close{
    position: absolute;
    right: 10px;
    top: 5px;
  }
  margin: 0 !important;
  width: 800px !important;
  .el-dialog__body {
    padding: 0;
    img {
      height: 100%;
      width: 100%;
    }
  }
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}

/deep/.list-card {
  border: none;
  position: relative;
  // background-color: #ddd !important;
  height: 100%;
  box-shadow: none !important;
  -webkit-box-shadow: none !important;
}
#enterprise-info {
  height: 80%;
  position: relative;
  /deep/.el-card .list-card .is-always-shadow{
    box-shadow: none !important;
    -webkit-box-shadow: none !important;
  }
  .my-pagination-box {
    z-index: 9999;
    position: absolute;
    bottom: 0;
    right: 0;

    /deep/.el-pagination__editor.el-input .el-input__inner {
      height: 28px !important;
      border: 1px solid #999 !important;
    }
  }
  .page-tip {
    z-index: 9999;
    position: absolute;
    left: 0;
    bottom: 10px;
  }
}
.box-header {
  height: 60px;
  position: relative;
  .add-btn {
    cursor: pointer;
    background-color: #25bad9;
    color: #fff;
    height: 26px;
    line-height: 26px;
    position: absolute;
    top: 50%;
    bottom: 50%;
    left: 20px;
    margin-top: -13px;
    padding: 0 12px;
    border-radius: 4px;
  }
  .back-btn {
    position: absolute;
    height: 26px;
    background-color: #666;
    top: 50%;
    bottom: 50%;
    padding: 0 5px;
    font-size: 14px;
    line-height: 26px;
    margin-top: -13px;
    right: 250px;
    color: #fff;
    cursor: pointer;
    border-radius: 4px;
  }
  .search-btn {
    position: absolute;
    height: 26px;
    background-color: #25bad9;
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
  .sreach-box {
    width: 200px;
    height: 26px;
    position: absolute;
    top: 50%;
    bottom: 50%;
    right: 20px;
    margin-top: -13px;
    background-color: #ddd;
    border: 1px solid #ddd;
    /deep/.el-input__inner {
      height: 100% !important;
      padding-left: 4px !important;
    }
  }
}
</style>

