<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <div class="box-header">
          <span v-if="isShowXZ" v-show="isShowAddto">
            <span v-if="isShowAddto" @click="addtoJusHandler">新增帐号</span>
          </span>
          <span v-if="!isShowAddto" class="newAdd" @click="exitBefore">返回上一级</span>
          <!-- 搜索框 -->
          <div v-if="isShowAddto" class="serach-box">
            <input
              style="color:#666;"
              v-model="serachContent"
              type="text"
              placeholder="请输入搜索内容"
              @keyup.enter="searchHandler"
            />
            <div class="serach" @click="searchHandler">
              <svg-icon icon-class="search1" />
            </div>
          </div>
        </div>
        <el-table :data="tableData" style="width: 100%" empty-text="没有数据">
          <el-table-column prop="uname" label="姓名" min-width="150" />
          <el-table-column prop="username" label="帐号" min-width="150" />
          <el-table-column prop="poname" label="职位" min-width="150" />
          <!-- 帐号状态 -->
          <el-table-column prop="po_notes" label="帐号状态" min-width="150">
            <template slot-scope="scope">
              <p
                size="mini"
                :class="[scope.row.isfreeze === 1 ? activeClass : '', dongjieClass]"
                @click="handleEdit(scope.$index, scope.row)"
                v-html="scope.row.isfreeze === 1 ? '使用中':'冻结'"
              >{{ scope.row.isfreeze === 1 ? '使用中':'冻结' }}</p>
            </template>
          </el-table-column>
          <!-- 操作 -->
          <el-table-column label="操作" min-width="150">
            <template slot-scope="scope">
              <el-button
                size="mini"
                @click="handleOperation(scope.$index, scope.row)"
                @mouseleave.native="hideHandler"
              >
                操作
                <svg-icon icon-class="xsj" />
              </el-button>
              <div
                v-if="rowUid === scope.row.uid && flag ? true : false"
                class="choice-box"
                @click="operationHandler(scope.$index, scope.row)"
                @mouseleave="mouseHandler"
              >
                <p @click="updataHandler(scope.$index, scope.row)" v-if="ishowModify">修改信息</p>
                <p @click="loginRecordHandler(scope.$index, scope.row)" v-if="ishowRecord">登录记录</p>
                <p @click="jiedongHandler(scope.$index, scope.row)" v-if="ishowJD">{{ jiedongData }}</p>
                <p @click="delteHandler(scope.$index, scope.row)" v-if="ishowDele">删除帐号</p>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
    <!-- 分页 -->
    <p v-if="hongShow" class="hongdian" />
    <my-pages :pageInfo="pageInfo" @handleCurrentChange="handleCurrentChange" class="myfenye"></my-pages>
    <!-- 新增帐号遮罩层 -->
    <el-dialog
      :visible.sync="centerDialogVisible"
      width="400px"
      center
      :append-to-body="true"
      :close-on-click-modal="false"
    >
      <span slot="title">{{ titleName }}</span>
      <el-form :label-position="labelPosition" label-width="80px">
        <div class="form-item" style="height:60px">
          <el-form-item label="帐号:">
            <input
              ref="nameInput"
              v-model="formAlign.phone"
              type="text"
              placeholder="请输入手机号"
              @focus="handlerPhone"
            />
            <p class="mistack-message">{{ mistakeToast2 }}</p>
          </el-form-item>
        </div>
        <div class="form-item" style="height:60px">
          <el-form-item label="姓名:">
            <input v-model="formAlign.name" type="text" @focus="handlerName" placeholder="请输入姓名" />
            <p class="mistack-message">{{ mistakeToast1 }}</p>
          </el-form-item>
        </div>
        <div class="form-item">
          <el-form-item label="职位:" class="region-class">
            <el-select v-model="poname" placeholder="请选择职位" class="width:73.5% !important">
              <el-option
                v-for="item in cities"
                :key="item.poname"
                :value="item.poname"
                @change="hanPoid(item.poid)"
              >
                <span class="chenp" @click="hanPoid(item.poid)">{{ item.poname }}</span>
                <!-- <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span> -->
              </el-option>
            </el-select>
            <p class="mistack-message">{{ mistakeToast3 }}</p>
          </el-form-item>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          @click="addtoHandler"
          v-loading="loadingAdd"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.8)"
        >确认</el-button>
      </span>
    </el-dialog>
    <!-- 修改帐号弹框 -->
    <el-dialog
      :visible.sync="centerDialogVisible1"
      width="400px"
      center
      :append-to-body="true"
      :close-on-click-modal="false"
    >
      <span slot="title">{{ titleName }}</span>
      <el-form :label-position="labelPosition" label-width="80px">
        <div class="form-item" style="height:60px;color:#909399;">
          <el-form-item label="帐号:">
            <input
              style="color:#909399;"
              ref="nameInput"
              v-model="formAlign.phone"
              type="text"
              placeholder="请输入手机号"
              @focus="handlerPhone"
              disabled
            />
            <p class="mistack-message">{{ mistakeToast2 }}</p>
          </el-form-item>
        </div>
        <div class="form-item" style="height:60px">
          <el-form-item label="姓名:">
            <input v-model="formAlign.name" type="text" @focus="handlerName" placeholder="请输入姓名" />
            <p class="mistack-message">{{ mistakeToast1 }}</p>
          </el-form-item>
        </div>
        <div class="form-item">
          <el-form-item label="职位:" class="region-class1">
            <el-select v-model="poname" placeholder="请选择职位">
              <el-option v-for="item in cities" :key="item.poname" :value="item.poname">
                <span class="chenp" @click="hanPoid(item.poid)">{{ item.poname }}</span>
                <!-- <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span> -->
              </el-option>
            </el-select>
            <p class="mistack-message">{{ mistakeToast3 }}</p>
          </el-form-item>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          @click="addtoHandler1"
          v-loading="loadingModi"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.8)"
        >确认</el-button>
      </span>
    </el-dialog>
    <!-- 登录记录 -->
    <el-dialog
      :visible.sync="centerDialogVisible2"
      width="24.43%"
      center
      :append-to-body="true"
      :close-on-click-modal="false"
      class="login-record"
    >
      <span slot="title">登录记录</span>
      <el-form :label-position="labelPosition" label-width="80px">
        <div class="form-item">
          <el-form-item label="姓名:">
            <input v-model="loginRecordData.name" type="text" disabled />
          </el-form-item>
        </div>
        <div class="form-item">
          <el-form-item label="帐号:">
            <input ref="nameInput" v-model="loginRecordData.phone" type="text" disabled />
          </el-form-item>
        </div>
        <div class="form-item">
          <el-form-item label="职位:">
            <input ref="nameInput" v-model="loginRecordData.region" type="text" disabled />
          </el-form-item>
        </div>
        <div class="form-item">
          <el-form-item label="最后操作时间:">
            <input ref="nameInput" v-model="loginRecordData.lastTime" type="text" disabled />
          </el-form-item>
        </div>
        <div class="form-item">
          <el-form-item label="上次登录时间:">
            <input ref="nameInput" v-model="loginRecordData.lastTimes" type="text" disabled />
          </el-form-item>
        </div>
        <div class="form-item">
          <el-form-item label="上次登录IP:">
            <input ref="nameInput" v-model="loginRecordData.lastTimesIp" type="text" disabled />
          </el-form-item>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addtoHandler2">确认</el-button>
      </span>
    </el-dialog>
    <!-- 删除遮罩层 -->
    <dialog-card
      content="是否删除该帐号？"
      :centerDialogVisible="centerDialogVisible4"
      :loading="loadingDele"
      @ensureHandler="delteHandler1"
      @cancelHandler="cancelHandlerDele"
      @beforeClose="cancelHandlerDele"
    ></dialog-card>
    <!-- 冻结弹窗 -->
    <dialog-card
      :content="`是否${ toastJiedong }该帐号？`"
      :centerDialogVisible="centerDialogVisible5"
      :loading="loadingDJ"
      @ensureHandler="jiedongHandler1"
      @cancelHandler="cancelHandlerJd"
      @beforeClose="cancelHandlerJd"
    ></dialog-card>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { getInfo } from '@/utils/auth'
import { Message } from 'element-ui'
import { postSelect_button, postSelect_user, postSelect_jurisdiction1, postInsert_add, postUpdete_list1, postfrozen_list, postdelete_list, postSearch_list, postToexamine_list } from '@/api/Jurisdiction1'
// import M from 'minimatch'
export default {
  name: 'AccountManage',
  //data数据
  data () {
    return {
      flag: false,
      hongShow: false,
      tableData: [],
      poname: '',
      cities: [],
      dataPoid: '',//新增的poid
      value: '',
      titleName: '新增帐号',
      labelPosition: 'right',
      centerDialogVisible: false,
      centerDialogVisible1: false,
      centerDialogVisible2: false,
      centerDialogVisible4: false,
      centerDialogVisible5: false,
      formAlign: {
        name: '',//新增/修改帐号弹框的姓名
        phone: ''//新增/修改帐号弹框的帐号
      },
      serachContent: '',//搜索的内容
      mistakeToast1: '',//姓名提示语
      mistakeToast2: '',//帐号提示语
      mistakeToast3: '',//职位提示语
      dongjieClass: 'dongjie',
      activeClass: 'notdongjie',
      isShowAddto: true,//搜索时控制新增帐号是否显示
      loginRecordData: {//登录记录数据
        name: '1',
        phone: '2',
        region: '3',
        lastTime: '4',
        lastTimes: '5',
        lastTimesIp: '6'
      },
      jiedongData: '',
      toastJiedong: '',
      jiedongUid: null,//解冻时当前的uid
      deleUid: null,//删除时当前uid
      jiedongIsfreeze: null,
      showOperation: true,
      rowUid: null,
      value1: false,
      //分页的信息
      pageInfo: {
        total: 0,//总条数
        listRows: 10,//page-size
        page: 1,//当前页
      },
      fenyeType: 1,//1为普通分页，2为搜索分页
      userInfo: {},//用户信息
      isShowXZ: false,//按钮权限判定之新增帐号显示
      ishowModify: false,//按钮权限判定之修改信息显示
      ishowRecord: false,//按钮权限判定之登录记录显示
      ishowJD: false,//按钮权限判定之解冻显示
      ishowDele: false,//按钮权限判定之删除帐号显示
      updataquery: {},//修改的参数
      loadingAdd: false,//新增弹框的确认加载控制
      loadingModi: false,//修改弹框的确认加载控制
      loadingDJ: false,//冻结弹框的确认加载控制
      loadingDele: false,//删除弹框的确认加载控制
    }
  },
  computed: {
    ...mapState(['secondRouterLists']),
    // 存在本地的用户信息
    userInfoData () {
      return JSON.parse(getInfo())
    }
  },
  created () {
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'))
    const { Communityid, uid } = this.userInfo
    const auth_id = this.$route.meta.auth_id
    //按钮权限判定
    postSelect_button({ Communityid, uid, auth_id }).then(resp => {
      console.log(resp, '按钮权限判定')
      if (resp.code === 200) {
        this.buttonLists = resp.data
        var btnList = this.buttonLists
        if (btnList.length !== 0) {
          btnList.forEach(list => {
            if (list.auth_name === '新增帐号') {
              this.isShowXZ = true
            }
            if (list.auth_name === '修改信息') {
              this.ishowModify = true
            }
            if (list.auth_name === "登录记录") {
              this.ishowRecord = true
            }
            if (list.auth_name === "解冻") {
              this.ishowJD = true
            }
            if (list.auth_name === "删除帐号") {
              this.ishowDele = true
            }
          })
        }
      }
    })
    //请求列表数据
    this.getTableUserList()
    //红点是否出现
    postToexamine_list({ Communityid, uid }).then(resp => {
      if (resp.msg.data.length) {
        if (this.secondRouterLists.children) {
          this.secondRouterLists.children.forEach(item => {
            console.log(item, 'this.secondRouterLists.children')
            if (item.meta.title === '帐号审核') {
              this.hongShow = true

            } else {
              this.hongShow = false
            }
          })
        }
      }
    })
  },
  methods: {
    //查询用户列表
    getTableUserList () {
      const { Communityid, uid } = this.userInfo
      const page = this.pageInfo.page
      postSelect_user({ Communityid, uid, page }).then(resp => {
        this.pageInfo.total = resp.msg.total
        this.pageInfo.page = Number(resp.msg.page)
        this.tableData = resp.msg.data
        if (resp.msg.data.length === 0) {
          this.pageInfo.page = resp.msg.page - 1
          this.getTableUserList()
        }
      })
    },
    //搜索时的查询用户列表
    getSearchList () {
      const { Communityid, uid } = this.userInfo
      const page = this.pageInfo.page
      const uname = this.serachContent
      const count = 10
      postSearch_list({ uname, Communityid, uid, page, count }).then(resp => {
        if (resp.code === 200) {
          this.fenyeType = 2
          this.pageInfo.total = resp.msg.total
          this.pageInfo.page = Number(resp.msg.page)
          this.tableData = resp.msg.data
          this.isShowAddto = false
        } else {
          this.$message({
            message: resp.msg,
            type: 'warning'
          })
          this.serachContent = ''
        }
      })
    },
    hideHandler () {
      if (this.flag === true) {
        this.flag = true
      } else {
        this.flag = false
      }
    },
    mouseHandler () {
      this.flag = false
    },
    hanPoid (poid) {
      console.log(poid, '选择职位')
      this.dataPoid = poid
      this.mistakeToast3 = ''
    },
    handlerName () {
      console.log('handlerName')
      this.mistakeToast1 = ''
    },
    handlerPhone () {
      this.mistakeToast2 = ''
    },
    handleOperation (index, row) {
      this.rowUid = row.uid
      this.flag = true
      row.isfreeze === 1 ? this.jiedongData = '冻结' : this.jiedongData = '解冻'
    },
    operationHandler (index, row) {
      // this.tableData[index].operationVisible = !this.tableData[index].operationVisible
      this.rowUid = null
    },
    // 点击新增帐号
    addtoJusHandler () {
      this.titleName = '新增帐号'
      this.mistakeToast1 = ''
      this.mistakeToast2 = ''
      this.mistakeToast3 = ''
      this.centerDialogVisible = true
      this.formAlign.name = ''
      this.formAlign.phone = ''
      this.poname = ''
      const { Communityid, uid } = this.userInfo
      this.dataPoid = null
      this.loadingAdd = false
      //查询权限
      postSelect_jurisdiction1({ Communityid, uid }).then(resp => {
        this.cities = resp.msg
      })
    },
    //点击返回上一级
    exitBefore () {
      this.isShowAddto = true
      this.serachContent = ''
      this.fenyeType = 1
      this.getTableUserList()
    },
    // 点击新增帐号
    addtoHandler () {
      this.loadingAdd = true
      const uname = this.formAlign.name
      const phone = this.formAlign.phone
      const { Communityid, propertyId, uid } = this.userInfo
      const poid = this.dataPoid
      postInsert_add({ Communityid, propertyId, uid, uname, phone, poid }).then(resp => {
        this.loadingAdd = false
        if (resp.code === 200) {
          this.$message({
            message: resp.msg,
            type: 'success'
          })
          this.centerDialogVisible = !this.centerDialogVisible
          // 添加数据前的分页设置
          const nume = Number(this.pageInfo.total) / Number(10)
          if (Math.round(nume) === nume) {
            // num是整数
            var shu = Number(nume) + Number(1)
          } else {
            var shu = Math.ceil(nume)
          }
          //背景色跳到对应页数
          this.pageInfo.page = shu
          // 请求对应页数的数据
          this.handleCurrentChange(shu)
        } else if (resp.code === 401) {
          this.mistakeToast1 = resp.msg
          setTimeout(() => {
            this.mistakeToast1 = ''
          }, 2000)
        } else if (resp.code === 402) {
          this.mistakeToast2 = resp.msg
          setTimeout(() => {
            this.mistakeToast2 = ''
          }, 2000)
        } else if (resp.code === 403) {
          this.mistakeToast3 = resp.msg
          setTimeout(() => {
            this.mistakeToast3 = ''
          }, 2000)
        } else {
          this.$message({
            message: resp.msg,
            type: "warning"
          })
          this.centerDialogVisible = !this.centerDialogVisible
        }
      })
    },
    //修改帐号
    addtoHandler1 () {
      this.loadingModi = true
      this.updataquery.uname = this.formAlign.name
      this.updataquery.poid = this.dataPoid
      if (this.poname === '请选择职位') {
        this.updataquery.poid = ''
      }
      // console.log(this.updataquery)
      postUpdete_list1(this.updataquery).then(resp => {
        this.loadingModi = false
        if (resp.code === 200) {
          this.$message({
            message: resp.msg,
            type: 'success'
          })
          this.centerDialogVisible1 = !this.centerDialogVisible1
          this.getTableUserList()
        } else if (resp.code === 401) {
          this.mistakeToast1 = resp.msg
          setTimeout(() => {
            this.mistakeToast1 = ''
          }, 2000)
        } else if (resp.code === 402) {
          this.mistakeToast3 = resp.msg
          setTimeout(() => {
            this.mistakeToast3 = ''
          }, 2000)
        } else if (resp.code === 403) {
          this.mistakeToast2 = resp.msg
          setTimeout(() => {
            this.mistakeToast2 = ''
          }, 2000)
        } else {
          this.$message({
            message: resp.msg,
            type: 'warning'
          })
          this.centerDialogVisible1 = !this.centerDialogVisible1
        }
      })
    },
    addtoHandler2 () {
      this.centerDialogVisible2 = !this.centerDialogVisible2
    },
    updataHandler (index, row) {
      this.mistakeToast3 = ''
      this.loadingModi = false
      this.centerDialogVisible1 = true
      this.titleName = '修改帐号'
      // 将值赋在input框
      this.formAlign.name = row.uname
      this.formAlign.phone = row.username
      this.poname = row.poname
      if (this.poname === '') {
        this.poname = '请选择职位'
      }
      // 获取点击确认按钮时调用接口所用的参数
      this.updataquery.uid = row.uid
      this.updataquery.Communityid = this.userInfo.Communityid
      const { Communityid, uid } = this.userInfo
      postSelect_jurisdiction1({ Communityid, uid }).then(resp => {
        const lists = resp.msg
        if (lists.length) {
          lists.forEach(item => {
            if (item.poname === this.poname) {
              this.dataPoid = item.poid
            }
          })
        }
        this.cities = resp.msg
      })
    },
    loginRecordHandler (index, row) {
      this.centerDialogVisible2 = !this.centerDialogVisible2
      this.loginRecordData.name = row.uname
      this.loginRecordData.phone = row.username
      this.loginRecordData.region = row.poname
      this.loginRecordData.lastTime = row.sess_time
      this.loginRecordData.lastTimes = row.time
      this.loginRecordData.lastTimesIp = row.ip
    },
    delteHandler (index, row) {
      this.loadingDele = false
      this.centerDialogVisible4 = true
      this.deleUid = row.uid
    },
    //取消删除
    cancelHandlerDele () {
      this.centerDialogVisible4 = false
    },
    delteHandler1 () {
      this.loadingDele = true
      const { Communityid } = this.userInfo
      const uid = this.deleUid
      postdelete_list({ uid, Communityid }).then(resp => {
        this.loadingDele = false
        if (resp.code === 200) {
          this.$message({
            message: resp.msg,
            type: "success"
          })
          this.getTableUserList()
        } else {
          this.$message({
            message: resp.msg,
            type: "warning"
          })
        }
        this.centerDialogVisible4 = false
      })
    },
    searchHandler () {
      this.getSearchList()
    },
    // 分页设置
    handleCurrentChange (val) {
      this.pageInfo.page = val
      if (this.fenyeType === 1) {
        this.getTableUserList()
      } else {
        this.getSearchList()
      }
    },
    jiedongHandler (index, row) {
      this.loadingDJ = false
      this.centerDialogVisible5 = true
      this.jiedongIsfreeze = row.isfreeze
      this.jiedongIsfreeze === 2 ? this.toastJiedong = '解冻' : this.toastJiedong = '冻结'
      this.jiedongUid = row.uid
    },
    //取消解冻/冻结
    cancelHandlerJd () {
      this.centerDialogVisible5 = false
    },
    jiedongHandler1 () {
      this.loadingDJ = true
      const uid = this.jiedongUid
      postfrozen_list({ uid }).then(resp => {
        this.loadingDJ = false
        if (resp.code === 200) {
          this.$message({
            message: resp.msg,
            type: "success"
          })
          this.getTableUserList()
        } else {
          this.$message({
            message: resp.msg,
            type: 'warning'
          })
        }
        this.centerDialogVisible5 = false
      })
    }
  }
}
</script>
// <style lang="scss" scoped>
//卡片的样式
.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}
.clearfix {
  .box-header {
    height: 50px;
    width: 100%;
    span {
      float: left;
      display: inline-block;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      width: 72px;
      height: 30px;
      line-height: 30px;
      line-height: 30px;
      background: rgba(37, 186, 217, 1);
      border-radius: 4px;
      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: rgba(255, 255, 255, 1);
      cursor: pointer;
    }
    .newAdd {
      float: left;
      display: inline-block;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #f00;
      color: #fff;
      width: 93px;
      height: 30px;
      line-height: 30px;
      background: rgba(37, 186, 217, 1);
      border-radius: 4px;
      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: rgba(255, 255, 255, 1);
      cursor: pointer;
      padding: 0.65vw 0.78vh;
    }
    //搜索框样式
    .serach-box {
      float: right;
      width: 180px;
      height: 30px;
      right: 60px;
      top: 20px;
      background: rgba(255, 255, 255, 1);
      border: 1px solid rgba(191, 191, 191, 1);
      border-radius: 3px;
      display: flex;
      input {
        float: left;
        width: 155px;
        background: rgba(255, 255, 255, 1);
        border-right: none;
        outline: none;
        flex: 7;
        padding-left: 7px;
        border: none;
        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        border-radius: 3px;
        color: rgba(153, 153, 153, 1);
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
      .serach {
        // float: right;
        flex: 1;
        font-size: 14px;
        border-left: none;
        background: rgba(191, 191, 191, 1);
        text-align: center;
        line-height: 28px;
        padding: 0 3px;
        cursor: pointer;
      }
    }
  }
}
.box-card {
  min-height: 785px;
  width: 100%;
  box-shadow: none;
  border: none;
  overflow: inherit;
  /deep/.el-card__header {
    border: none;
    border-bottom: none;
    padding: 20px !important;
    .el-table--striped .el-table__body tr.el-table__row--striped td {
      background-color: #eff2f5;
    }
    .el-table {
      overflow: inherit;
      // top: 12px !important;
    }
    .el-table__body-wrapper {
      overflow: inherit;
    }
    .el-table td {
      padding: 15px 0 !important;
    }
    .el-table th {
      // padding: 14px 55px !important;
      font-size: 10px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: rgba(144, 147, 153, 1);
    }
    .el-table .cell {
      // background-color: #f00;
      height: 30px !important;
      padding: 0 0 0 65px;
      line-height: 30px;
      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      .el-button--mini {
        width: 60px;
        height: 30px;
        background: rgba(248, 172, 89, 1);
        border-radius: 4px;
        border-radius: 4px;
        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: rgba(255, 255, 255, 1);
        border: none;
        padding: 0px;
        line-height: 30px;
        position: relative;
        span {
          display: inline-block;
          width: 100%;
          height: 100%;
        }
        svg {
          font-size: 12px;
          transform: scale(0.6);
        }
      }
      //操作
      .choice-box {
        width: 126px;
        // height: 140px;
        background: rgba(255, 255, 255, 1);
        border: 1px solid rgba(238, 238, 238, 1);
        box-shadow: 0px 6px 5px 0px rgba(153, 153, 153, 0.08);
        position: absolute;
        z-index: 3169 !important;
        left: 0;
        cursor: pointer;
        p {
          width: 100%;
          height: 35px;
          line-height: 35px;
          padding-left: 10px;
          font-size: 14px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          color: rgba(102, 102, 102, 1);
          z-index: 3177 !important;
          &:hover {
            background: rgba(239, 242, 245, 1);
          }
        }
      }
      .dongjie {
        color: red;
      }
      .notdongjie {
        color: #606266;
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
.page {
  position: absolute;
  bottom: 70px;
  right: 4px;
  font-size: 10px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: rgba(102, 102, 102, 1);
}

/deep/.el-dialog {
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
    // padding: 20px 48px 27px 30px !important;
    .form-item {
      height: 40px;

      .el-form-item {
        margin-bottom: 0px;
        margin-top: 1px;
        &__label {
          width: 64px !important;
          height: 30px;
          display: inline-block;
          padding: 0 !important;
          font-size: 14px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          color: rgba(102, 102, 102, 1);
        }
        &__content {
          margin-left: 64px !important;
          input {
            position: relative;
            height: 30px;
            width: 100% !important;
            padding-left: 8px;
            border: 1px solid rgba(210, 210, 210, 1);
            border-radius: 4px;
            outline: none;
            color: #333333;
            padding-left: 8px;
            // &:-webkit-input-placeholder {
            //   color: red !important;
            // }
          }
        }
        input {
          outline: none;
          font-size: 14px;
          border-radius: 4px;
          margin-left: 12px;
          width: 90% !important;
          height: 32px !important;
          background: #fff;
          font-family: Microsoft YaHei;
          font-weight: 400;
          color: #333;
          &::-webkit-input-placeholder {
            font-size: 14px;
            font-family: Microsoft YaHei;
            font-weight: 400;
            color: rgba(153, 153, 153, 1);
            // color: red !important;
            // padding: 0 0 20px 0;
          }
        }
      }
      //下拉菜单
      .region-class {
        .el-form-item__content {
          margin-left: 64px !important;
          .el-input {
            width: 289px;
          }
          .el-input__suffix {
            left: 225px;
          }
        }
        input {
          border-radius: 3px;
          border: 1px solid rgba(210, 210, 210, 1) !important;
          width: 89% !important;
          &:-webkit-input-placeholder {
            color: red !important;
          }
        }
      }
      .region-class1 {
        .el-form-item__content {
          margin-left: 64px !important;
          .el-input {
            width: 289px;
          }
          .el-input__suffix {
            left: 225px;
          }
        }
        input {
          // background-color: #f00 !important;
          border-radius: 4px;
          border: 1px solid rgba(210, 210, 210, 1) !important;
          width: 89% !important;
          // border: 1px solid rgba(210, 210, 210, 1);
          &:-webkit-input-placeholder {
            color: red !important;
          }
        }
      }

      .mistack-message {
        position: relative;
        color: red;
        top: -13px;
        text-align: left;
        margin-left: 0px;
        box-sizing: border-box;
        font-size: 14px;
        transform: scale(0.9);
        font-family: Microsoft YaHei;
        font-weight: 400;
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
//登录记录样式
.login-record {
  /deep/.el-dialog {
    border-radius: 4px !important;
    .el-dialog__body {
      padding: 9px 38px 25px 43px !important;
      .el-form-item {
        margin-top: 12px;
      }
      .el-form-item__content {
        margin-left: 87px !important;
        padding-left: 8px;
      }
      .el-form-item__label {
        width: 95px !important;
      }
    }
  }
}
//删除
.chen {
  /deep/.el-dialog {
    background-color: #fff !important;
    width: 18.23%;
    height: 210px;
    /deep/.el-dialog__header {
      border-bottom: 1px solid #eff2f5;
      .el-dialog__title {
        border-bottom: none;
        font-size: 16px;
      }
      button {
        z-index: 19999;
      }
    }
    .el-dialog--center {
      text-align: left;
    }
    .el-dialog__body {
      background-color: #fff;
      height: 110px !important;
      position: relative;
      div {
        width: 100%;
        height: 110px;
        line-height: 78px;
        margin-left: 8px;
        font-size: 16px;
        text-align: center;
      }
    }
    .el-dialog__footer {
      position: absolute;
      width: 100%;
      display: flex;
      justify-content: center;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: rgba(153, 153, 153, 1);
      span {
        width: 100%;
        display: flex;
        justify-content: space-around;
        button {
          width: 72px;
          height: 30px;
          font-size: 14px;
          border-radius: 3px !important;
          font-family: Microsoft YaHei;
          font-weight: 400;
          color: rgba(255, 254, 254, 1);
        }
      }
      .quxiao1 {
        color: rgba(153, 153, 153, 1);
        background-color: #fff;
        border: 1px solid rgba(204, 204, 204, 1);
        border-radius: 3px;
      }
    }
    .el button {
      color: #999999 !important;
    }
    .el-button--primary {
      color: #ffffff;
      background-color: #25bad9;
    }
  }
}
//下拉滚动
// /deep/.el-select-dropdown  {
//   width: 1000px !important;
//  .el-select-dropdown__item  {
//   background: #f00 !important;

//   }
// }
/deep/.chenp {
  display: block;
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
/deep/.el-pagination.is-background .btn-next:disabled {
  cursor: default;
}
/deep/.el-pagination.is-background .btn-prev:disabled {
  cursor: default;
}
/deep/ .el-loading-spinner {
  top: 100% !important;
}
/deep/.el-pagination__editor {
  background-color: #5fafe4 !important;
  height: 20px;
  width: 30px;
  color: white;
  cursor: pointer;
  margin-left: 0.25vw;
}
/deep/.myfenye {
  top: 35px;
  .record-data {
    left: 20px;
    bottom: 30px;
  }
  .el-pagination {
    right: 108px;
    bottom: 23px;
  }
}
/deep/.dele-calss {
  /deep/.el-dialog {
    /deep/.el-dialog__body {
      padding: 0px !important;
      div {
      }
    }
  }
}
</style>
