<template>
  <div>
    <!--   -->
    <el-card class="box-card">
      <span v-if="isShowAddto" id="newadd1" @click="isShow1">
        <span v-if="isShowAddto" v-show="ishowAdd" id="newadd">新增小区门</span>
      </span>

      <span v-if="!isShowAddto" class="newAdd" @click="exitBefore">返回上一级</span>
      <!-- 搜索框 -->
      <div v-if="isShowAddto" class="serach-box">
        <input
          style="color:#666;"
          v-model="serachContent"
          type="text"
          placeholder="请输入搜索内容"
          @keyup.enter="serachHandler"
        />
        <div class="serach" @click="serachHandler">
          <svg-icon icon-class="search1" />
        </div>
      </div>
      <el-table :data="tableData" style="width: 100%" class="entry-table-class" empty-text="没有数据">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-row>
                <!-- 人脸 -->
                <el-col v-if="props.row.ren.equipmentnameRl" :span="8" style="width:28.4%">
                  <el-form-item
                    v-if="props.row.ren.equipmentnameRl"
                    label="人脸名称:"
                    label-width="115px"
                  >
                    <span>{{ props.row.ren.equipmentnameRl }}</span>
                  </el-form-item>
                  <el-form-item
                    v-if="props.row.ren.factorynumberRl"
                    label="设备出厂号:"
                    label-width="115px"
                  >
                    <span>{{ props.row.ren.factorynumberRl }}</span>
                  </el-form-item>
                  <el-form-item v-if="props.row.ren.ladderRl" label="门禁控制器编号:" label-width="115px">
                    <span>{{ props.row.ren.ladderRl }}</span>
                  </el-form-item>
                </el-col>
                <!-- 蓝牙 -->
                <el-col v-if="props.row.lanya.equipmentnameLy" :span="8" style="width:28.8%">
                  <el-form-item
                    v-if="props.row.lanya.equipmentnameLy"
                    label="蓝牙名称:"
                    label-width="115px"
                  >
                    <span>{{ props.row.lanya.equipmentnameLy }}</span>
                  </el-form-item>
                  <el-form-item
                    v-if="props.row.lanya.factorynumberLy"
                    label="设备出厂号:"
                    label-width="115px"
                  >
                    <span>{{ props.row.lanya.factorynumberLy }}</span>
                  </el-form-item>
                  <el-form-item
                    v-if="props.row.lanya.ladderLy"
                    label="门禁控制器编号:"
                    label-width="115px"
                  >
                    <span>{{ props.row.lanya.ladderLy }}</span>
                  </el-form-item>
                </el-col>
                <!-- 二维码 -->
                <el-col v-if="props.row.erwei.equipmentnameEw" :span="8">
                  <el-form-item
                    v-if="props.row.erwei.equipmentnameEw"
                    label="二维码名称:"
                    label-width="115px"
                  >
                    <span>{{ props.row.erwei.equipmentnameEw }}</span>
                  </el-form-item>
                  <el-form-item
                    v-if="props.row.erwei.factorynumberEw"
                    label="设备出厂号:"
                    label-width="115px"
                  >
                    <span>{{ props.row.erwei.factorynumberEw }}</span>
                  </el-form-item>
                  <el-form-item
                    v-if="props.row.erwei.ladderEw"
                    label="门禁控制器编号:"
                    label-width="115px"
                  >
                    <span>{{ props.row.erwei.ladderEw }}</span>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column label="大门名称" prop="Gatename" min-width="150" />
        <el-table-column label="入/出口" prop="type" min-width="150">
          <template slot-scope="scope">
            <p v-html="scope.row.type === 1 ? '入口':'出口'" />
          </template>
        </el-table-column>
        <el-table-column label="入/出口设备编号" prop="equipment" min-width="150" />
        <!-- 操作 -->
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              v-if="isShowEdit"
              size="mini"
              style="background:#25BAD9; color:#fff; font-size:14px;height:30px; width:52px;
            border-color:#25BAD9; padding:5px;"
              @click="handleEdit(scope.$index, scope.row)"
            >修改</el-button>
            <el-button
              v-if="isShowDelte"
              class="el-btn2"
              size="mini"
              type="danger"
              style="background:#BFBFBF; color:#fff; font-size:14px;height:30px; width:52px;
            border-color:#BFBFBF; padding:5px;"
              @click="handleDelete(scope.$index, scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 分页 -->
    <my-pages :pageInfo="pageInfo" @handleCurrentChange="handleCurrentChange" class="myfenye"></my-pages>
    <!-- 新增小区遮罩层 新增小区遮罩层新增小区遮罩层新增小区遮罩层新增小区遮罩层新增小区遮罩层新增小区遮罩层新增小区遮罩层-->
    <el-dialog
      :visible.sync="centerDialogVisible"
      center
      title="新增小区门"
      :append-to-body="true"
      :close-on-click-modal="false"
      class="add-class"
    >
      <el-form
        ref="ruleForm1"
        :model="ruleFrom1"
        status-icon
        label-width="115px"
        class="demo-ruleForm1"
        label-position="left"
      >
        <!-- 第一行大门名称： -->
        <div class="div-row">
          <el-form-item label="大门名称:" prop="gateName">
            <el-input v-model="ruleFrom1.Gatename" />
          </el-form-item>
          <div class="gatename-mistacktoast">{{ gateToast }}</div>
        </div>
        <!-- 第二行 入口设备编号-->
        <div class="div-row" style="margin-top:12px">
          <div>
            <el-form-item label="入口设备编号:" prop="pass">
              <el-input v-model="ruleFrom1.equipment" />
            </el-form-item>
          </div>
        </div>
        <!-- 第四模块 -->
        <div class="div-row1">
          <!-- 入口人脸设备: -->
          <div class="flexBox">
            <ul v-if="isEntryFcShow">
              <div style="color:#A6ACC3">入口人脸设备</div>
              <el-form-item label="设备名称:" prop="pass">
                <el-input v-model="ruleFrom1.equipmentnameRl" />
              </el-form-item>
              <el-form-item label="设备出厂号:" prop="pass">
                <el-input v-model="ruleFrom1.factorynumberRl" />
              </el-form-item>
              <el-form-item label="门禁控制器编号:" prop="pass">
                <el-input v-model="ruleFrom1.ladderRl" />
              </el-form-item>
            </ul>
            <!-- 入口设备编号: -->
            <ul v-if="isEntryBlShow">
              <div style="color:#A6ACC3">入口蓝牙设备</div>
              <el-form-item label="设备名称:">
                <el-input v-model="ruleFrom1.equipmentnameLy" />
              </el-form-item>
              <el-form-item label="设备出厂号:">
                <el-input v-model="ruleFrom1.factorynumberLy" />
              </el-form-item>
              <el-form-item label="门禁控制器编号:">
                <el-input v-model="ruleFrom1.ladderLy" />
              </el-form-item>
            </ul>
            <!-- 入口二维码设备: -->
            <ul v-if="isEntryErShow">
              <div style="color:#A6ACC3">入口二维码设备</div>
              <el-form-item label="设备名称:">
                <el-input v-model="ruleFrom1.equipmentnameEw" />
              </el-form-item>
              <el-form-item label="设备出厂号:">
                <el-input v-model="ruleFrom1.factorynumberEw" />
              </el-form-item>
              <el-form-item label="门禁控制器编号:">
                <el-input v-model="ruleFrom1.ladderEw" />
              </el-form-item>
            </ul>
          </div>
        </div>
        <!-- 第五模块出口设备编号： -->
        <div class="div-row">
          <el-col>
            <el-form-item label="出口设备编号:" prop="pass">
              <el-input v-model="ruleFrom1.equipments" />
            </el-form-item>
          </el-col>
        </div>
        <!-- 第七模块 -->
        <div class="div-row1">
          <!-- 出口人脸设备 -->
          <div class="flexBox">
            <ul v-if="isExportFcShow">
              <div style="color:#A6ACC3">出口人脸设备</div>
              <el-form-item label="设备名称:">
                <el-input v-model="ruleFrom1.equipmentnameRls" />
              </el-form-item>
              <el-form-item label="设备出厂号:">
                <el-input v-model="ruleFrom1.factorynumberRls" />
              </el-form-item>
              <el-form-item label="门禁控制器编号:">
                <el-input v-model="ruleFrom1.ladderRls" />
              </el-form-item>
            </ul>
            <!-- 出口蓝牙设备 -->
            <ul v-if="isExportBlShow">
              <div style="color:#A6ACC3">出口蓝牙编号</div>
              <el-form-item label="设备名称:">
                <el-input v-model="ruleFrom1.equipmentnameLys" />
              </el-form-item>
              <el-form-item label="设备出厂号:">
                <el-input v-model="ruleFrom1.factorynumberLys" />
              </el-form-item>
              <el-form-item label="门禁控制器编号:">
                <el-input v-model="ruleFrom1.ladderLys" />
              </el-form-item>
            </ul>
            <ul v-if="isExportErShow">
              <div style="color:#A6ACC3">出口二维码设备</div>
              <el-form-item label="设备名称:">
                <el-input v-model="ruleFrom1.equipmentnameEws" />
              </el-form-item>
              <el-form-item label="设备出厂号:">
                <el-input v-model="ruleFrom1.factorynumberEws" />
              </el-form-item>
              <el-form-item label="门禁控制器编号:">
                <el-input v-model="ruleFrom1.ladderEws" />
              </el-form-item>
            </ul>
          </div>
        </div>
        <el-row type="flex" justify="center">
          <p class="mistack-toast">{{ mistakeToast }}</p>
        </el-row>
        <!-- 提交 -->
        <el-button
          class="btn-confirm"
          type="primary"
          @click="submitHandler"
          v-loading="loadingAdd"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.8)"
        >确认</el-button>
      </el-form>
    </el-dialog>
    <!-- 修改 -->
    <el-dialog
      :visible.sync="centerDialogVisible1"
      center
      title="修改小区门"
      :append-to-body="true"
      :close-on-click-modal="false"
      class="add-class modify-class"
    >
      <el-form
        ref="ruleFrom1"
        :model="ruleFrom1"
        status-icon
        label-width="115px"
        class="demo-ruleForm1"
        label-position="left"
      >
        <!-- 第一行大门名称： -->
        <div class="div-row">
          <el-form-item label="大门名称:" prop="gateName">
            <el-input v-model="ruleFrom1.Gatename" />
          </el-form-item>
          <div class="gatename-mistacktoast">{{ gateToast }}</div>
        </div>
        <!-- 第二行 入口设备编号-->
        <div class="div-row">
          <el-form-item :label="rowType===1?'入口设备编号:':'出口设备编号:'" prop="pass">
            <el-input v-model="ruleFrom1.equipment" />
          </el-form-item>
        </div>
        <!-- 第三行 -->
        <div class="div-row1">
          <!-- 入口人脸设备: -->
          <div class="flexBox">
            <ul v-if="isEntryFcShow">
              <div style="color:#A6ACC3" v-html="rowType===1?'入口人脸设备':'出口人脸设备'"></div>
              <el-form-item label="设备名称:" prop="pass">
                <el-input v-model="ruleFrom1.equipmentnameRl" />
              </el-form-item>
              <el-form-item label="设备出厂号" prop="pass">
                <el-input v-model="ruleFrom1.factorynumberRl" />
              </el-form-item>
              <el-form-item label="门禁控制器编号:" prop="pass">
                <el-input v-model="ruleFrom1.ladderRl" />
              </el-form-item>
            </ul>
            <!-- 入口蓝牙设备: -->
            <ul v-if="isEntryBlShow">
              <div style="color:#A6ACC3" v-html="rowType===1?'入口蓝牙设备':'出口蓝牙设备'"></div>
              <el-form-item label="设备名称:" prop="pass">
                <el-input v-model="ruleFrom1.equipmentnameLy" />
              </el-form-item>
              <el-form-item label="设备出厂号:" prop="pass">
                <el-input v-model="ruleFrom1.factorynumberLy" />
              </el-form-item>
              <el-form-item label="门禁控制器编号:" prop="pass">
                <el-input v-model="ruleFrom1.ladderLy" />
              </el-form-item>
            </ul>
            <!-- 入口二维码设备: -->
            <ul v-if="isEntryErShow">
              <div style="color:#A6ACC3" v-html="rowType===1?'入口二维码设备':'出口二维码设备'"></div>
              <el-form-item label="设备名称:" prop="pass">
                <el-input v-model="ruleFrom1.equipmentnameEw" />
              </el-form-item>
              <el-form-item label="设备出厂号:" prop="pasmets">
                <el-input v-model="ruleFrom1.factorynumberEw" />
              </el-form-item>
              <el-form-item label="门禁控制器编号:" prop="pass">
                <el-input v-model="ruleFrom1.ladderEw" />
              </el-form-item>
            </ul>
          </div>
        </div>
        <el-row type="flex" justify="center">
          <p class="mistack-toast">{{ mistakeToast }}</p>
        </el-row>
        <!-- 提交 -->
        <el-button
          class="btn-confirm"
          type="primary"
          @click="entryEditHandler"
          v-loading="loadingModiEntry"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.8)"
        >确认</el-button>
      </el-form>
    </el-dialog>
    <!-- 删除弹框 -->
    <dialog-card
      content="是否删除该条数据?"
      :centerDialogVisible="centerDialogVisible3"
      :loading="loadingRefuse"
      @ensureHandler="deleteQuerenHandler"
      @cancelHandler="cancelHandlerRe"
      @beforeClose="cancelHandlerRe"
    ></dialog-card>
  </div>
</template>

<script>
import { Message } from 'element-ui'
import { postGateSelect, postGateInsert, postGateDelete, postGateSearch, postGateUpdate } from '@/api/entranceGuard'
import { getInfo } from '@/utils/auth'
import { postSelect_button } from '@/api/Jurisdiction'
export default {
  name: 'AccountAudit',
  // data数据
  data () {
    return {
      isShowDelte: false,//按钮权限之删除
      isShowEdit: false,//按钮权限之修改
      ishowAdd: false,//按钮权限之新增小区门
      isShowAddto: true,//点击返回上一级时，新增小区门是否出现
      serachContent: '',//搜索框内容
      tableData: [],
      centerDialogVisible: false,
      centerDialogVisible1: false,
      centerDialogVisible2: false,//编辑出口
      centerDialogVisible3: false,//删除弹框
      ruleFrom1: {
        Communityid: null, // 小区id
        uname: '', // 当前操作人名字
        Gatename: '', // 大门名字
        equipment: null, // 入口设备编号入口设备编号入口设备编号
        equipmentnameRl: '', // 人脸设备名称
        factorynumberRl: null, // 人脸设备出厂号
        ladderRl: null, // 人脸门禁控制器编号
        equipmentnameLy: '', // 蓝牙设备名称
        factorynumberLy: null, // 蓝牙设备出厂号
        ladderLy: null, // 蓝牙门禁控制器编号
        equipmentnameEw: '', // 二维码设备名称
        factorynumberEw: null, // 二维码设备出厂号
        ladderEw: null, // 二维码门禁控制器编号
        equipments: null, // 出口设备编号出口设备编号出口设备编号
        equipmentnameRls: '', // 人脸设备名称
        factorynumberRls: null, // 人脸设备出厂号
        ladderRls: null, // 人脸门禁控制器编号
        equipmentnameLys: '', // 蓝牙设备名称
        factorynumberLys: null, // 蓝牙设备出厂号
        ladderLys: null, // 蓝牙门禁控制器编号
        equipmentnameEws: '', // 二维码设备名称
        factorynumberEws: null, // 二维码设备出厂号
        ladderEws: null // 二维码门禁控制器编号
      },
      //分页的信息
      pageInfo: {
        total: null,//总条数
        listRows: 10,//page-size
        page: 1,//当前页
      },
      isEntryFcShow: true,//入口人脸权限
      isEntryBlShow: true,//入口蓝牙权限
      isEntryErShow: true,//入口二维码权限
      isExportFcShow: true,//出口人脸权限
      isExportBlShow: true,//出口蓝牙权限
      isExportErShow: true,//出口二维码权限
      gateToast: '',//大门提示语
      mistakeToast: '',//错误提示语
      gateId: null,//点击删除时当前数据的id(小区大门主键值id)
      device: null,//存入后端返回的device
      updataQuery: {
        gateId: 15,
        uname: 1,
        Gatename: 10,
        equipment: 15,
        equipmentnameRl: 1,
        factorynumberRl: 10,
        ladderRl: 15,
        equipmentnameLy: 1,
        factorynumberLy: 10,
        ladderLy: 15,
        equipmentnameEw: 1,
        factorynumberEw: 10,
        ladderEw: 10
      },
      userInfo: {},//用户信息
      loadingRefuse: false,//删除的加载控制
      loadingAdd: false,//添加加载控制
      loadingModiEntry: false,//修改入口加载控制
      fenyeType: 1,//1代表普通分页，2代表搜索分页
      rowType: 1,//修改的出入口界面控制，1为入口，2为出口
    }
  },
  created () {
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'))
    const { Communityid, uid } = this.userInfo
    const auth_id = this.$route.meta.auth_id
    //获取按钮权限
    postSelect_button({ Communityid, uid, auth_id }).then(resp => {
      if (resp.code === 200) {
        this.buttonLists = resp.data
        var btnList = this.buttonLists
        btnList.forEach(list => {
          if (list.auth_name === '新增小区门') {
            this.ishowAdd = true
          }
          if (list.auth_name === '修改') {
            this.isShowEdit = true
          }
          if (list.auth_name === '删除') {
            this.isShowDelte = true
          }
        })
      }
    })
    //查询大门门禁列表
    const page = this.pageInfo.page
    const count = 10
    // console.log(this.device, 'devicw')
    postGateSelect({ Communityid, page, count }).then(resp => {
      console.log(resp, 'resp')
      this.pageInfo.total = resp.msg.total
      this.pageInfo.page = Number(resp.msg.page)
      this.tableData = resp.msg.data
      this.device = resp.device
      if (this.device === 1) {
        this.isEntryFcShow = false
        this.isEntryBlShow = false
        this.isEntryErShow = false
        this.isExportFcShow = false
        this.isExportBlShow = false
        this.isExportErShow = false
      } else if (this.device === 2) {
        this.isEntryBlShow = false
        this.isEntryErShow = false
        this.isExportBlShow = false
        this.isExportErShow = false
      } else if (this.device === 3) {
        this.isEntryFcShow = false
        this.isEntryErShow = false
        this.isExportFcShow = false
        this.isExportErShow = false
      } else if (this.device === 4) {
        this.isEntryFcShow = false
        this.isEntryBlShow = false
        this.isExportFcShow = false
        this.isExportBlShow = false
      } else if (this.device === 5) {
        this.isEntryErShow = false
        this.isExportErShow = false
      } else if (this.device === 6) {
        this.isExportBlShow = false
        this.isEntryBlShow = false
      } else if (this.device === 7) {
        this.isEntryFcShow = false
        this.isExportFcShow = false
      }
    })
  },
  methods: {
    //查询大门门禁列表
    getTableLists () {
      const Communityid = this.userInfo.Communityid
      const page = this.pageInfo.page
      const count = 10
      postGateSelect({ Communityid, page, count }).then(resp => {
        // console.log(resp, 'resp')
        this.pageInfo.total = resp.msg.total
        this.pageInfo.page = Number(resp.msg.page)
        this.tableData = resp.msg.data
        this.device = resp.device
        // if (resp.msg.data.length === 0) {
        //   this.pageInfo.page = resp.msg.page - 1
        //   this.getTableLists()
        // }
      })
    },
    //查询搜索大门门禁列表
    getSearchLists () {
      const Communityid = this.userInfo.Communityid
      const page = this.pageInfo.page
      const count = 10
      const name = this.serachContent
      postGateSearch({ Communityid, page, count, name }).then(resp => {
        // console.log(resp, 'ee')
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
    //返回上一级
    exitBefore () {
      this.isShowAddto = true
      this.serachContent = ''
      this.fenyeType = 1
      this.getTableLists()
    },
    //点击新增小区门
    isShow1 () {
      if (this.device === 1) {
        this.$message({
          message: '您暂未开通门禁管理,请联系17716136776',
          type: 'warning'
        })
        return
      } else {
        this.gateToast = ''
        this.mistakeToast = ''
        this.ruleFrom1 = {}
        this.centerDialogVisible = !this.centerDialogVisible
      }
    },
    //点击修改
    handleEdit (index, row) {
      console.log(row)
      this.gateToast = ''
      this.mistakeToast = ''
      if (this.device === 1) {
        this.$message({
          message: '您暂未开通门禁管理,请联系17716136776',
          type: 'warning'
        })
        return
      } else {
        this.rowType = row.type
        //数据辉县
        this.centerDialogVisible1 = !this.centerDialogVisible1
        this.ruleFrom1.Gatename = row.Gatename
        this.ruleFrom1.equipment = row.equipment
        this.ruleFrom1.equipmentnameRl = row.ren.equipmentnameRl
        this.ruleFrom1.factorynumberRl = row.ren.factorynumberRl
        this.ruleFrom1.ladderRl = row.ren.ladderRl
        this.ruleFrom1.equipmentnameLy = row.lanya.equipmentnameLy
        this.ruleFrom1.factorynumberLy = row.lanya.factorynumberLy
        this.ruleFrom1.ladderLy = row.lanya.ladderLy
        this.ruleFrom1.equipmentnameEw = row.erwei.equipmentnameEw
        this.ruleFrom1.factorynumberEw = row.erwei.factorynumberEw
        this.ruleFrom1.ladderEw = row.erwei.ladderEw
        this.ruleFrom1.gateId = row.gateId
        this.ruleFrom1.uname = row.uname
      }
    },
    //点击删除按钮
    handleDelete (index, row) {
      this.loadingRefuse = false
      if (this.device === 1) {
        this.$message({
          message: '您暂未开通门禁管理,请联系17716136776',
          type: 'warning'
        })
        return
      } else {
        this.gateId = row.gateId
        this.centerDialogVisible3 = !this.centerDialogVisible3
      }
    },
    //新增小区弹框点击确认
    submitHandler () {
      this.ruleFrom1.Communityid = this.userInfo.Communityid
      this.ruleFrom1.uname = this.userInfo.uname
      const gateInsertQuery = this.ruleFrom1
      this.loadingAdd = true
      postGateInsert(gateInsertQuery).then(resp => {
        this.loadingAdd = false
        if (resp.code === 401) {
          this.gateToast = resp.msg
          setTimeout(() => {
            this.gateToast = ''
          }, 2000)
        } else if (resp.code === 402 || resp.code === 403 || resp.code === 405) {
          this.mistakeToast = resp.msg
          setTimeout(() => {
            this.mistakeToast = ''
          }, 2000)
        } else if (resp.code === 400 || resp.code === 404) {
          this.$message({
            message: resp.msg,
            type: 'warning'
          })
        } else {
          this.$message({
            message: resp.msg,
            type: 'success'
          })
          this.centerDialogVisible = false
          this.handleCurrentChange(1)
        }
      })
    },
    // 分页设置
    handleCurrentChange (val) {
      this.pageInfo.page = val
      if (this.fenyeType === 1) {
        this.getTableLists()
      } else {
        this.getSearchLists()
      }
    },
    // 弹框里面的确认删除操作
    deleteQuerenHandler () {
      this.loadingRefuse = true
      const gateId = this.gateId
      postGateDelete({ gateId }).then(resp => {
        this.loadingRefuse = false
        if (resp.code === 200) {
          this.$message({
            message: resp.msg,
            type: 'success'
          })
          if (this.fenyeType === 1) {
            this.getTableLists()
          } else {
            this.getSearchLists()
          }
        } else {
          this.$message({
            message: resp.msg,
            type: 'warning'
          })
        }
        this.centerDialogVisible3 = !this.centerDialogVisible3
      })
    },
    // 搜索
    serachHandler () {
      if (this.device === 1) {
        this.$message({
          message: '您暂未开通门禁管理,请联系17716136776',
          type: 'warning'
        })
        return
      } else {
        this.getSearchLists()
      }
    },
    //修改
    entryEditHandler () {
      this.loadingModiEntry = true
      this.gateToast = ''
      this.mistakeToast = ''
      const { gateId, uname, Gatename, equipment, equipmentnameRl, factorynumberRl, ladderRl, equipmentnameLy, factorynumberLy, ladderLy, equipmentnameEw, factorynumberEw, ladderEw } = this.ruleFrom1
      this.updataQuery = { gateId, uname, Gatename, equipment, equipmentnameRl, factorynumberRl, ladderRl, equipmentnameLy, factorynumberLy, ladderLy, equipmentnameEw, factorynumberEw, ladderEw }
      postGateUpdate(this.updataQuery).then(resp => {
        this.loadingModiEntry = false
        if (resp.code === 401) {
          this.gateToast = resp.msg
          setTimeout(() => {
            this.gateToast = ''
          }, 2000)
        } else if (resp.code === 402 || resp.code === 403 || resp.code === 405) {
          this.mistakeToast = resp.msg
          setTimeout(() => {
            this.mistakeToast = ''
          }, 2000)
        } else if (resp.code === 404) {
          this.$message({
            message: resp.msg,
            type: 'warning'
          })
          this.centerDialogVisible1 = !this.centerDialogVisible1
        } else {
          // 修改成功
          this.$message({
            message: resp.msg,
            type: 'success'
          })
          if (this.fenyeType === 1) {
            this.getTableLists()
          } else {
            this.getSearchLists()
          }
          this.centerDialogVisible1 = false
        }
      })
    },

    //取消删除弹框
    cancelHandlerRe () {
      this.centerDialogVisible3 = false
    }
  }
}
</script>
<style lang="scss" scoped>
//折叠样式

/deep/.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
/deep/.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
  height: 40px !important;
}
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
  span {
    display: inline-block;
    width: 50px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f00;
    color: #fff;
    width: 57px;
    height: 23px;
    background: rgba(37, 186, 217, 1);
    border-radius: 4px;
    font-size: 10px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: rgba(255, 255, 255, 1);
    cursor: pointer;
  }
}
.box-card {
  min-height: 730px;
  position: relative;
  width: 100%;
  box-shadow: none;
  border: none;
  /deep/.el-card__header {
    border: none;
    border-bottom: none;
    .el-table--striped .el-table__body tr.el-table__row--striped td {
      background-color: #eff2f5;
    }
    .el-table th {
      font-size: 10px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: rgba(144, 147, 153, 1);
    }
    .el-table .cell {
      padding: 0px 0px 0px 65px;
      margin: 0px;
      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: rgba(96, 98, 102, 1);
      /deep/.el-button {
        background: rgba(37, 186, 217, 1) !important;
        border-radius: 3px;
        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: rgba(255, 255, 255, 1);
        border: none;
        padding: 0px;
        span {
          display: inline-block;
          width: 100%;
          height: 100%;
        }
      }
      .dongjie {
        color: #606266;
        background-color: #fff;
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

/deep/.el-pagination.is-background .btn-prev:disabled {
  cursor: default;
}
/deep/.el-pagination__editor {
  background-color: #5fafe4 !important;
  height: 20px;
  width: 30px;
  color: white;
  cursor: pointer;
}
/deep/ .demo-table-expand .el-form-item {
  width: 30% !important;
}
#newadd {
  display: inline-block;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  width: 86px;
  min-height: 30px;
  line-height: 30px;
  background: rgba(37, 186, 217, 1);
  border-radius: 4px;
  font-size: 14px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: rgba(255, 255, 255, 1);
  cursor: pointer;
}
#newadd1 {
  display: inline-block;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  width: 86px;
  min-height: 30px;
  line-height: 30px;
  background: none;
  border-radius: 4px;
  font-size: 14px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: rgba(255, 255, 255, 1);
  cursor: pointer;
}
.newAdd {
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
}
/deep/.el-dialog--center .el-dialog__body {
  padding: 0px 35px 0px 54px;
}
.demo-ruleForm1 {
  width: 100%;
  .el-row {
    margin-bottom: 0;
    &:last-child {
      margin-bottom: 0;
      .el-col-8 {
        width: 28.8% !important;
      }
    }
  }
  .el-col {
    border-radius: 4px;
    margin-top: 10px;
  }
  .bg-purple-dark {
    background: #99a9bf;
  }
  .bg-purple {
    background: #d3dce6;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
  // 新增大门表单样式
  .el-form-item {
    margin-bottom: 0;
    height: 48px !important;
  }
  .el-input {
    /deep/input {
      min-width: 220px;
      height: 21px;
      border: 1px solid rgba(210, 210, 210, 1) !important;
      border-radius: 4px;
    }
  }
  .submit-class {
    button {
      background: rgba(248, 172, 89, 1);
      border-radius: 4px;
      border-color: rgba(248, 172, 89, 1);
      width: 51px;
      height: 25px;
      padding: 0px;
    }
  }
  /deep/.el-input__suffix {
    display: none;
  }
  /deep/ .el-form-item__error {
    top: 83% !important;
  }
}
.chen {
  /deep/.el-dialog {
    background-color: #fff !important;
    width: 350px;
    min-height: 210px;
    border-radius: 4px;

    .el-dialog__header {
      padding: 10px 0 7px 20px;
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
      // /deep/.el-dialog__headerbtn {
      //   top: 17px !important;
      // }
      button {
        position: absolute;
        top: 10px;
        .el-dialog__close {
          // background: #f00;
          top: 5px !important;
        }
      }
    }
    .el-dialog--center {
      text-align: left;
    }
    .el-dialog__body {
      background-color: #fff;
      height: 110px !important;
      width: 100%;
      padding: 47px 0 50px 0 !important;
      position: relative;

      div {
        width: 100%;
        height: 110px;
        text-align: center;
      }
    }
    .el-dialog__footer {
      position: absolute;
      top: 145px;
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
          width: 80px;
          height: 31px;
          line-height: 0.36vh;
          font-size: 16px;
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
    .elbutton {
      color: #999999 !important;
    }
    /deep/ .el-button--primary {
      color: #ffffff;
      background-color: #25bad9 !important;
      border-color: #25bad9 !important;
    }
  }
}
//搜索框样式
.serach-box {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 180px;
  height: 30px;
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
      color: rgba(153, 153, 153, 1);
    }
    &::-moz-placeholder {
      font-size: 10px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: rgba(153, 153, 153, 1);
    }
  }
  .serach {
    float: right;
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
.el-table {
  display: relative;
  overflow: inherit;
}
.entry-table-class {
  overflow-x: hidden !important;
  border-bottom: none !important;
  top: 12px;
  min-width: 940px;
}

.gatename-mistacktoast {
  color: red;
  width: auto;
  position: absolute;
  height: 20px;
  left: 115px;
  top: 28px;
  line-height: 35px;
  display: inline-block;
}
.mistack-toast {
  position: absolute;
  top: 3px;
  text-align: center;
  color: red;
  width: 260px;
  height: 20px;
}
/deep/ .demo-table-expand .el-form-item {
  width: 100% !important;
}

.add-class {
  /deep/.el-loading-spinner {
    top: 100%;
  }
  /deep/.el-dialog {
    position: absolute;
    margin: 0 !important;
    left: 50%;
    top: 50%;
    border-radius: 4px;
    transform: translateX(-50%) translateY(-50%);
    display: inline-block;
    max-width: 1150px;
    height: 654px;
    width: auto;
    .el-dialog__title {
      font-size: 16px;
    }
    /deep/ .el-input__inner {
      height: 32px !important;
      color: #333;
      border-radius: 4px !important;
    }
  }
}
/deep/.el-dialog__header {
  padding: 12px 0 10px 16px;
  text-align: left;
  border-bottom: 1px solid #eff2f5;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: #333;
}
/deep/.el-dialog__body {
  display: inline-block;
}
.div-row {
  width: 300px;
  height: 47px;
  margin-top: 10px;
}
.div-row1 {
  display: inline-block;
  margin-top: 4px;

  .flexBox {
    display: flex;
  }
  ul {
    justify-content: flex-start;
    box-sizing: border-box;
    padding-right: 20px;
  }
}

/deep/.demo-ruleForm1 {
  position: relative;
  padding-bottom: 50px;
  margin-top: 20px;
}
.btn-confirm {
  position: relative;
  border-radius: 4px;
  top: 24px;
  left: 50%;
  background: #f8ac59;
  border-color: #f8ac59;
  width: 72px;
  font-size: 14px;
  height: 30px;
  line-height: 0px;
  transform: translateX(-50%);
}
/deep/.el-dialog__close {
  color: #909399;
  position: absolute;
  top: -1px;
  right: 0px;
}
/deep/.el-dialog__title {
  cursor: default;
}
.modify-class {
  /deep/.el-dialog {
    height: 420px;
  }
}
/deep/.myfenye {
  top: 93px;
  .record-data {
    left: 20px;
    bottom: 33px;
  }
  .el-pagination {
    right: 87px;
    bottom: 30px;
  }
}
/deep/.myself-dele {
  background: #f00 !important;
  display: flex;
flex-direction: column;
margin:0 !important;
position:absolute;
top:50%;
left:50%;
transform:translate(-50%,-50%);
  .el-dialog {
    /deep/ .el-dialog__body {
      padding: 0px !important;
      div {
        line-height: 110px !important;
      }
    }
  }
}
</style>
