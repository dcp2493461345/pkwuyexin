<template>
  <div>
    <!--   -->
    <el-card class="box-card">
      <span @click="isShow1" v-if="isShowAddto" id="newadd1">
        <span v-if="isShowAddto" v-show="ishowAdd" id="newadd">新增单元门</span>
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
      <el-table :data="tableData" style="width: 100%;top:12px; min-width:1000px" empty-text="没有数据">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand" label-width="115px">
              <el-row>
                <!-- 人脸 -->
                <el-col v-if="props.row.ren.equipmentnameRl" :span="8" style="width:26%">
                  <el-form-item label="设备名称:">
                    <span>{{ props.row.ren.equipmentnameRl }}</span>
                  </el-form-item>
                  <el-form-item label="设备出厂号:">
                    <span>{{ props.row.ren.factorynumberRl }}</span>
                  </el-form-item>
                  <el-form-item label="门禁控制器编号:">
                    <span>{{ props.row.ren.ladderRl }}</span>
                  </el-form-item>
                </el-col>
                <!-- 蓝牙 -->
                <el-col v-if="props.row.lanya.equipmentnameLy" :span="8" style="width:26%">
                  <el-form-item label="设备名称:">
                    <span>{{ props.row.lanya.equipmentnameLy }}</span>
                  </el-form-item>
                  <el-form-item label="设备出厂号:">
                    <span>{{ props.row.lanya.factorynumberLy }}</span>
                  </el-form-item>
                  <el-form-item label="门禁控制器编号:">
                    <span>{{ props.row.lanya.ladderLy }}</span>
                  </el-form-item>
                </el-col>
                <!-- 二维码 -->
                <el-col v-if="props.row.erwei.equipmentnameEw" :span="8">
                  <el-form-item label="设备名称:">
                    <span>{{ props.row.erwei.equipmentnameEw }}</span>
                  </el-form-item>
                  <el-form-item label="设备出厂号:">
                    <span>{{ props.row.erwei.factorynumberEw }}</span>
                  </el-form-item>
                  <el-form-item label="门禁控制器编号:">
                    <span>{{ props.row.erwei.ladderEw }}</span>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column label="楼栋" prop="Tung" min-width="150" />
        <el-table-column label="单元" prop="single" min-width="150" />
        <el-table-column label="单元门名称" prop="Gatename" min-width="150" />
        <!-- 操作 -->
        <el-table-column label="操作" min-width="150">
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
    <!-- 新增单元门遮罩层 -->
    <el-dialog
      :visible.sync="centerDialogVisible"
      center
      :append-to-body="true"
      :close-on-click-modal="false"
      class="add-class"
    >
      <span slot="title" style="font-size:16px;cursor:default;">新增单元门</span>
      <el-form
        ref="ruleForm"
        :model="ruleForm"
        status-icon
        label-width="115px"
        class="demo-ruleForm1"
        label-position="left"
      >
        <!-- 第一行大门名称： -->
        <div class="div-row">
          <el-form-item label="选择楼栋:" prop="gateName" class="building-class">
            <el-select v-model="value" placeholder="请选择楼栋" no-data-text="请选择楼栋">
              <el-option
                v-for="(item,index) in options"
                :key="index"
                :label="item.userHouseBuilding"
                :value="item.userHouseBuilding"
              >
                <span
                  class="chenp"
                  @click="hanPoid(item.userHouseBuilding)"
                >{{ item.userHouseBuilding }}</span>
              </el-option>
            </el-select>
            <div class="loudong-class">{{ buildoingContent }}</div>
          </el-form-item>
        </div>
        <div class="div-row">
          <el-form-item label="选择单元:" prop="gateName" class="building-class">
            <el-select v-model="value1" placeholder="请选择单元" no-data-text="请先选择楼栋">
              <el-option
                v-for="(item,index) in options1"
                :key="index"
                :label="item.userHouseUnit"
                :value="item.userHouseUnit"
              >
                <span class="chenp" @click="hanPoid1(item.userHouseUnit)">{{ item.userHouseUnit }}</span>
              </el-option>
            </el-select>
            <div class="loudong-class">{{ unitContent }}</div>
          </el-form-item>
        </div>
        <div class="div-row">
          <el-form-item label="单元门名称:" prop="gateName" class="building-class">
            <el-input v-model="ruleForm.Gatename" />
            <div class="loudong-class">{{ doorName }}</div>
          </el-form-item>
        </div>
        <div class="div-row">
          <el-form-item label="设备编号:" prop="gateName" class="building-class">
            <el-input v-model="ruleForm.equipment" />
            <div class="loudong-class">{{ equipmentContent }}</div>
          </el-form-item>
        </div>
        <!-- 第四模块 -->
        <div class="div-row1">
          <div class="flexBox">
            <!-- 入口人脸设备: -->
            <ul v-if="isEntryFcShow" :span="8">
              <div style="color:#A6ACC3">人脸设备</div>
              <el-form-item label="设备名称:" prop="pass">
                <el-input v-model="ruleForm.equipmentnameRl" />
              </el-form-item>
              <el-form-item label="设备出厂号" prop="pass">
                <el-input v-model="ruleForm.factorynumberRl" />
              </el-form-item>
              <el-form-item label="门禁控制器编号:" prop="pass">
                <el-input v-model="ruleForm.ladderRl" />
              </el-form-item>
            </ul>
            <!-- 入口设备编号: -->
            <ul v-if="isEntryBlShow" :span="8">
              <div style="color:#A6ACC3">蓝牙设备</div>
              <el-form-item label="设备名称:" prop="pass">
                <el-input v-model="ruleForm.equipmentnameLy" />
              </el-form-item>
              <el-form-item label="设备出厂号:" prop="pass">
                <el-input v-model="ruleForm.factorynumberLy" />
              </el-form-item>
              <el-form-item label="门禁控制器编号:" prop="pass">
                <el-input v-model="ruleForm.ladderLy" />
              </el-form-item>
            </ul>
            <!-- 入口二维码设备: -->
            <ul v-if="isEntryErShow" :span="8">
              <div style="color:#A6ACC3">二维码设备</div>
              <el-form-item label="设备名称:" prop="pass">
                <el-input v-model="ruleForm.equipmentnameEw" />
              </el-form-item>
              <el-form-item label="设备出厂号:" prop="pass">
                <el-input v-model="ruleForm.factorynumberEw" />
              </el-form-item>
              <el-form-item label="门禁控制器编号:" prop="pass">
                <el-input v-model="ruleForm.ladderEw" />
              </el-form-item>
            </ul>
          </div>
        </div>
        <!-- 错误提示 -->
        <el-row type="flex" justify="center">
          <p class="mistack-toast">{{ mistakeToast }}</p>
        </el-row>
        <!-- 提交 -->
        <el-button
          type="primary"
          class="btn-confirm"
          @click="addHandler()"
          v-loading="loadingAdd"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.8)"
        >确认</el-button>
      </el-form>
    </el-dialog>
    <!-- 修改 -->
    <el-dialog
      :visible.sync="centerDialogVisible5"
      center
      :append-to-body="true"
      :close-on-click-modal="false"
      class="add-class"
    >
      <span slot="title">修改单元门</span>
      <el-form
        ref="ruleForm1"
        :model="ruleForm1"
        status-icon
        label-width="115px"
        class="demo-ruleForm1"
        label-position="left"
      >
        <!-- 第一行大门名称： -->
        <div class="div-row">
          <el-form-item label="选择楼栋:" prop="gateName" class="building-class">
            <el-select v-model="value" placeholder="请选择楼栋" no-data-text="请选择楼栋">
              <el-option
                v-for="(item,index) in options"
                :key="index"
                :label="item.userHouseBuilding"
                :value="item.userHouseBuilding"
              >
                <span
                  class="chenp"
                  @click="hanPoid(item.userHouseBuilding)"
                >{{ item.userHouseBuilding }}</span>
              </el-option>
            </el-select>
            <div class="loudong-class">{{ buildoingContent }}</div>
          </el-form-item>
        </div>
        <div class="div-row">
          <el-form-item label="选择单元:" prop="gateName" class="building-class">
            <el-select v-model="value1" placeholder="请选择单元" no-data-text="请先选择楼栋">
              <el-option
                v-for="(item,index) in options1"
                :key="index"
                :label="item.userHouseUnit"
                :value="item.userHouseUnit"
              >
                <span class="chenp" @click="hanPoid1(item.userHouseUnit)">{{ item.userHouseUnit }}</span>
              </el-option>
            </el-select>
            <div class="loudong-class">{{ unitContent }}</div>
          </el-form-item>
        </div>
        <div class="div-row">
          <el-form-item label="单元门名称:" prop="gateName" class="building-class">
            <el-input v-model="ruleForm1.Gatename" />
            <div class="loudong-class">{{ doorName }}</div>
          </el-form-item>
        </div>
        <div class="div-row">
          <el-form-item label="设备编号:" prop="gateName" class="building-class">
            <el-input v-model="ruleForm1.equipment" />
            <div class="loudong-class">{{ equipmentContent }}</div>
          </el-form-item>
        </div>
        <!-- 第四模块 -->
        <div class="div-row1">
          <div class="flexBox">
            <!-- 入口人脸设备: -->
            <ul v-if="isEntryFcShow" :span="8">
              <div style="color:#A6ACC3">人脸设备</div>
              <el-form-item label="设备名称:" prop="pass">
                <el-input v-model="ruleForm1.equipmentnameRl" />
              </el-form-item>
              <el-form-item label="设备出厂号" prop="pass">
                <el-input v-model="ruleForm1.factorynumberRl" />
              </el-form-item>
              <el-form-item label="门禁控制器编号:" prop="pass">
                <el-input v-model="ruleForm1.ladderRl" />
              </el-form-item>
            </ul>
            <!-- 入口设备编号: -->
            <ul v-if="isEntryBlShow" :span="8">
              <div style="color:#A6ACC3">蓝牙设备</div>
              <el-form-item label="设备名称:" prop="pass">
                <el-input v-model="ruleForm1.equipmentnameLy" />
              </el-form-item>
              <el-form-item label="设备出厂号:" prop="pass">
                <el-input v-model="ruleForm1.factorynumberLy" />
              </el-form-item>
              <el-form-item label="门禁控制器编号:" prop="pass">
                <el-input v-model="ruleForm1.ladderLy" />
              </el-form-item>
            </ul>
            <!-- 入口二维码设备: -->
            <ul v-if="isEntryErShow" :span="8">
              <div style="color:#A6ACC3">二维码设备</div>
              <el-form-item label="设备名称:" prop="pass">
                <el-input v-model="ruleForm1.equipmentnameEw" />
              </el-form-item>
              <el-form-item label="设备出厂号:" prop="pass">
                <el-input v-model="ruleForm1.factorynumberEw" />
              </el-form-item>
              <el-form-item label="门禁控制器编号:" prop="pass">
                <el-input v-model="ruleForm1.ladderEw" />
              </el-form-item>
            </ul>
          </div>
        </div>
        <!-- 错误提示 -->
        <el-row type="flex" justify="center">
          <p class="mistack-toast">{{ mistakeToast }}</p>
        </el-row>
        <!-- 提交 -->
        <el-button
          type="primary"
          class="btn-confirm"
          @click="editHandler"
          v-loading="loadingModi"
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
      @ensureHandler="deletesHandler"
      @cancelHandler="cancelHandlerRe"
      @beforeClose="cancelHandlerRe"
    ></dialog-card>
  </div>
</template>

<script>
import { Message } from 'element-ui'
import { postUnitSelect, postUnitStoried, postUnitSearch, postUnitSingle, postUnitInsert, postUnitUpdate, postUnitDelete } from '@/api/entranceGuard'
import { getInfo } from '@/utils/auth'
import { postSelect_button } from '@/api/Jurisdiction'
export default {
  name: 'AccountAudit',
  // data数据
  data () {
    return {
      isShowDelte: false,//按钮权限之删除
      isShowEdit: false,//按钮权限之修改
      ishowAdd: false,//按钮权限之新增
      device: null,//后端返回的device
      isShowAddto: true,//点击返回上一级时，新增小区门是否出现
      serachContent: '',//搜索框内容
      tableData: [],
      centerDialogVisible: false,//新增
      centerDialogVisible5: false, // 修改
      centerDialogVisible3: false, // 删除
      ruleForm: {
        userHouseBuilding: null, // 楼栋
        userHouseUnit: null, // 单元
        Gatename: null, // 单元门名字
        equipment: null, // 设备编号
        equipmentnameRl: null, // 人脸设备名称
        factorynumberRl: null, // 人脸设备出厂号
        ladderRl: null, // 人脸门禁控制器编号
        equipmentnameLy: null, // 蓝牙设备名称
        factorynumberLy: null, // 蓝牙设备出厂号
        ladderLy: null, // 蓝牙门禁控制器编号
        equipmentnameEw: null, // 二维码设备名称
        factorynumberEw: null, // 二维码设备出厂号
        ladderEw: null // 二维码门禁控制器编号
      },
      ruleForm1: {
        Tung: null, // 楼栋
        single: null, // 单元
        Gatename: null, // 门名称
        equipment: null, // 设备编号
        equipmentnameRl: null, // 人脸设备名称
        factorynumberRl: null, // 人脸设备出厂号
        ladderRl: null, // 人脸门禁控制器编号
        equipmentnameLy: null, // 蓝牙设备名称
        factorynumberLy: null, // 蓝牙设备出厂号
        ladderLy: null, // 蓝牙门禁控制器编号
        equipmentnameEw: null, // 二维码设备名称
        factorynumberEw: null, // 二维码设备出厂号
        ladderEw: null // 二维码门禁控制器编号
      },
      mistakeToast: '', // 错误提示
      userInfo: {},
      //分页的信息
      pageInfo: {
        total: null,//总条数
        listRows: 10,//page-size
        page: 1,//当前页
      },
      options: [],//楼栋的下拉框内容
      value: '',
      options1: [],//单元门的下拉框内容
      value1: '',
      gateId: null,//当前数据ID
      isEntryFcShow: true,//入口人脸权限
      isEntryBlShow: true,//入口蓝牙权限
      isEntryErShow: true,//入口二维码权限
      isExportFcShow: true,//出口人脸权限
      isExportBlShow: true,//出口人脸权限
      isExportErShow: true,//出口二维码权限
      buildoingContent: '', // 几个提示
      unitContent: '',//选择单元的内容
      doorName: '',//单元门名称
      equipmentContent: '',//设备名称
      loadingRefuse: false,//加载控制之删除
      fenyeType: 1,//1代表普通分页，2代表搜索分页
      loadingAdd: false,//新增单元门的加载控制
      loadingModi: false,//修改单元门的加载控制
    }
  },
  created () {
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'))
    const { Communityid, uid } = this.userInfo
    const auth_id = 52
    //获取按钮权限
    postSelect_button({ Communityid, uid, auth_id }).then(resp => {
      console.log({ Communityid, uid, auth_id }, resp, 'resp获取按钮权限')
      if (resp.code === 200) {
        this.buttonLists = resp.data
        var btnList = this.buttonLists
        btnList.forEach(list => {
          if (list.auth_name === '新增单元门') {
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
    //查询单元门列表
    const page = this.pageInfo.page
    const count = 10
    postUnitSelect({ Communityid, page, count }).then(resp => {
      this.pageInfo.total = resp.msg.total
      this.device = resp.device
      this.pageInfo.page = Number(resp.msg.page)
      this.tableData = resp.msg.data
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
    //查询单元门禁列表
    getTableLists () {
      const Communityid = this.userInfo.Communityid
      const page = this.pageInfo.page
      const count = 10
      postUnitSelect({ Communityid, page, count }).then(resp => {
        this.pageInfo.total = resp.msg.total
        this.device = resp.device
        this.pageInfo.page = Number(resp.msg.page)
        this.tableData = resp.msg.data
        if (resp.msg.data.length === 0) {
          this.pageInfo.page = resp.msg.page - 1
          this.getTableLists()
        }
      })
    },
    //查询搜索单元门列表
    getSearchLists () {
      const Communityid = this.userInfo.Communityid
      const page = this.pageInfo.page
      const count = 10
      const name = this.serachContent
      postUnitSearch({ Communityid, page, count, name }).then(resp => {
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
    //点击返回上一级
    exitBefore () {
      this.isShowAddto = true
      this.serachContent = ''
      this.fenyeType = 1
      this.pageInfo.page = 1
      this.getTableLists()

    },
    // 添加单元门门禁
    addHandler () {
      this.loadingAdd = true
      this.ruleForm.uname = this.userInfo.uname
      this.ruleForm.Communityid = this.userInfo.Communityid
      postUnitInsert(this.ruleForm).then(resp => {
        this.loadingAdd = false
        if (resp.code === 405 || resp.code === 406 || resp.code === 407 || resp.code === 408) {
          this.mistakeToast = resp.msg
          setTimeout(() => {
            this.mistakeToast = ''
          }, 2000)
        } else if (resp.code === 401) {
          this.buildoingContent = resp.msg
          setTimeout(() => {
            this.buildoingContent = ''
          }, 2000)
        } else if (resp.code === 402) {
          this.unitContent = resp.msg
          setTimeout(() => {
            this.unitContent = ''
          }, 2000)
        } else if (resp.code === 403) {
          this.doorName = resp.msg
          setTimeout(() => {
            this.doorName = ''
          }, 2000)
        } else if (resp.code === 404) {
          this.equipmentContent = resp.msg
          setTimeout(() => {
            this.equipmentContent = ''
          }, 2000)
        } else {
          // 录入成功
          this.$message({
            message: resp.msg,
            type: 'success'
          })
          this.handleCurrentChange(1)
          this.centerDialogVisible = !this.centerDialogVisible
        }
      })
    },
    // 选择楼栋时
    hanPoid (dataId) {
      const Communityid = this.userInfo.Communityid
      this.value = dataId
      this.value1 = null
      this.ruleForm.userHouseBuilding = this.value
      this.ruleForm1.userHouseBuilding = Number(this.value)
      this.ruleForm1.userHouseUnit = Number(this.value1)
      // 查询单元
      const userHouseBuilding = this.value
      postUnitSingle({ Communityid, userHouseBuilding }).then(resp => {
        this.options1 = resp.msg
      })
    },
    // 选择单元
    hanPoid1 (itemId) {
      this.ruleForm.userHouseUnit = itemId
      this.ruleForm1.userHouseUnit = Number(itemId)
    },
    //点击新增
    isShow1 () {
      if (this.device === 1) {
        this.$message({
          message: '您暂未开通门禁管理,请联系17716136776',
          type: 'warning'
        })
        return
      }
      this.ruleForm = {}
      this.value = null
      this.value1 = null
      this.mistakeToast = ''
      const Communityid = this.userInfo.Communityid
      //清空选择单元的数据
      this.options1 = {}
      // 查询楼栋
      postUnitStoried({ Communityid }).then(resp => {
        this.options = resp.msg
      })
      this.centerDialogVisible = !this.centerDialogVisible
    },
    //点击修改
    handleEdit (index, row) {
      if (this.device === 1) {
        this.$message({
          message: '您暂未开通门禁管理,请联系17716136776',
          type: 'warning'
        })
        return
      }
      this.value = row.Tung
      this.value1 = row.single
      this.mistakeToast = ''
      //数据回显
      this.ruleForm1.gateId = row.gateId
      this.ruleForm1.Gatename = row.Gatename
      this.ruleForm1.equipment = row.equipment
      this.ruleForm1.equipmentnameRl = row.ren.equipmentnameRl
      this.ruleForm1.factorynumberRl = row.ren.factorynumberRl
      this.ruleForm1.ladderRl = row.ren.ladderRl
      this.ruleForm1.equipmentnameLy = row.lanya.equipmentnameLy
      this.ruleForm1.factorynumberLy = row.lanya.factorynumberLy
      this.ruleForm1.ladderLy = row.lanya.ladderLy
      this.ruleForm1.equipmentnameEw = row.erwei.equipmentnameEw
      this.ruleForm1.factorynumberEw = row.erwei.factorynumberEw
      this.ruleForm1.ladderEw = row.erwei.ladderEw
      const Communityid = this.userInfo.Communityid
      this.ruleForm1.userHouseBuilding = row.Tung
      this.ruleForm1.userHouseUnit = row.single
      // 查询楼栋
      postUnitStoried({ Communityid }).then(resp => {
        this.options = resp.msg
      })
      // 查询单元
      const userHouseBuilding = this.value
      postUnitSingle({ Communityid, userHouseBuilding }).then(resp => {
        this.options1 = resp.msg
      })
      this.centerDialogVisible5 = !this.centerDialogVisible5
    },
    //修改点击确认
    editHandler () {
      this.loadingModi = true
      const Communityid = this.userInfo.Communityid
      const uname = this.userInfo.uname
      var { userHouseBuilding, userHouseUnit, equipment, equipmentnameRl, factorynumberRl, ladderRl, equipmentnameLy, factorynumberLy, ladderLy, equipmentnameEw, factorynumberEw, ladderEw } = this.ruleForm1
      const Gatename = this.ruleForm1.Gatename
      const gateId = this.ruleForm1.gateId
      userHouseBuilding = Number(userHouseBuilding)
      userHouseUnit = Number(userHouseUnit)
      const editQuery = { uname, gateId, userHouseBuilding, userHouseUnit, equipment, equipmentnameRl, factorynumberRl, ladderRl, equipmentnameLy, factorynumberLy, ladderLy, equipmentnameEw, factorynumberEw, ladderEw, Gatename }
      postUnitUpdate(editQuery).then(resp => {
        this.loadingModi = false
        if (resp.code === 405 || resp.code === 406 || resp.code === 408) {
          this.mistakeToast = resp.msg
          setTimeout(() => {
            this.mistakeToast = ''
          }, 2000)
        } else if (resp.code === 401) {
          this.buildoingContent = resp.msg
          setTimeout(() => {
            this.buildoingContent = ''
          }, 2000)
        } else if (resp.code === 402) {
          this.unitContent = resp.msg
          setTimeout(() => {
            this.unitContent = ''
          }, 2000)
        } else if (resp.code === 403) {
          this.doorName = resp.msg
          setTimeout(() => {
            this.doorName = ''
          }, 2000)
        } else if (resp.code === 404) {
          this.equipmentContent = resp.msg
          setTimeout(() => {
            this.equipmentContent = ''
          }, 2000)
        } else if (resp.code === 407) {
          this.centerDialogVisible5 = !this.centerDialogVisible5
          this.$message({
            message: resp.msg,
            type: 'warning'
          })
        } else {
          // 录入成功
          this.$message({
            message: resp.msg,
            type: 'success'
          })
          if (this.fenyeType === 1) {
            this.getTableLists()
          } else {
            this.getSearchLists()
          }
          this.centerDialogVisible5 = !this.centerDialogVisible5
        }
      })
    },
    //点击删除
    handleDelete (index, row) {
      if (this.device === 1) {
        Message('您暂未开通门禁管理,请联系17716136776')
        return
      }
      this.gateId = row.gateId
      this.centerDialogVisible3 = !this.centerDialogVisible3
    },
    cancelHandlerRe () {
      this.centerDialogVisible3 = false
    },
    //删除弹框取消
    deletesHandler () {
      const gateId = this.gateId
      this.loadingRefuse = true
      postUnitDelete({ gateId }).then(resp => {
        this.loadingRefuse = false
        if (resp.code === 401) {
          this.$message({
            message: resp.msg,
            type: 'warning'
          })
        } else {
          // 删除成功
          this.$message({
            message: resp.msg,
            type: 'success'
          })
          if (this.fenyeType === 1) {
            this.getTableLists()
          } else {
            this.getSearchLists()
          }
        }
        this.centerDialogVisible3 = !this.centerDialogVisible3
      })
    },
    // 搜索单元门
    serachHandler () {
      if (this.device === 1) {
        this.$message({
          message: '您暂未开通门禁管理,请联系17716136776',
          type: 'warning'
        })
        return
      } else {
        this.pageInfo.page = 1
        this.getSearchLists()
      }
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
  }
}
</script>
<style lang="scss" scoped>
//折叠样式
/deep/.demo-table-expand {
  font-size: 0;
  min-width: 1104px;
}
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
    padding: 21px !important;
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
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: rgba(96, 98, 102, 1);
      .el-button--mini {
        background: rgba(37, 186, 217, 1);
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
//分页器的样式

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
#newadd1 {
  display: inline-block;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  width: 86px;
  height: 30px;
  line-height: 30px;
  background: none;
  border-radius: 4px;
  font-size: 14px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: rgba(255, 255, 255, 1);
  cursor: pointer;
}
/deep/.el-dialog--center .el-dialog__body {
  padding: 7px 35px 0 54px;
}
.demo-ruleForm1 {
  width: 100%;
  .el-row {
    margin-bottom: 0;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .el-col {
    border-radius: 4px;
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
      width: 220px;
      height: 30px;
      border: 1px solid rgba(210, 210, 210, 1) !important;
      border-radius: 2px;
    }
  }
  .submit-class {
    position: absolute;
    top: 0px;
    left: 40%;
    button {
      background: rgba(248, 172, 89, 1);
      border-radius: 2px;
      border-color: rgba(248, 172, 89, 1);
      width: 51px;
      height: 25px;
      line-height: 0px;
      text-align: left;
    }
  }
  /deep/.el-input__suffix {
    // display: none;
    right: -40px !important;
  }
  /deep/ .el-form-item__error {
    top: 83% !important;
  }
}
.chen {
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
    width: 18.23%;
    border-radius: 5px;
    height: 210px;

    .el-dialog__header {
      padding: 10px 0 10px 16px;
      text-align: left;
      border-bottom: 1px solid #eff2f5;
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
        .el-dialog__close {
          // background: #f00;
          top: 1px !important;
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
      padding: 50px 0 50px 0 !important;
      position: relative;

      div {
        width: 100%;
        height: 110px;
        font-size: 16px;
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
          width: 72px;
          height: 30px;
          line-height: 0;
          font-size: 14px;
          border-radius: 3px !important;
          font-family: Microsoft YaHei;
          font-weight: 400;
          border: 1px solid #25bad9;
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
    border-radius: 3px;
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 400;
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
/deep/ .el-select .el-input__inner {
  font-size: 14px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: #333;
  display: inline-block;
  width: 126%;
  height: 32px !important;
  // border-radius: 4px;
  border: 1px solid rgb(210, 210, 210) !important;
  border-radius: 4px;
  outline: none;
}
.chenp {
  display: block;
  width: 100%;
}
.mistack-toast {
  position: absolute;
  top: 3px;
  text-align: center;
  color: red;
  width: 260px;
  height: 20px;
}
/deep/.el-table td {
  padding: 15px -2px !important;
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
/deep/ .el-select-dropdown__list {
  background-color: #f00 !important;
}
/deep/ .demo-table-expand .el-form-item {
  width: 100% !important;
}
.building-class {
  position: relative;
  height: 60px !important;
  .loudong-class {
    position: absolute;
    top: 26px;
    color: red;
  }
}
.add-class {
  /deep/.el-loading-spinner {
    top: 100%;
  }
  /deep/.el-dialog {
    // background-color: #f00;
    border-radius: 5px;
    position: absolute;
    margin: 0 !important;
    left: 50%;
    top: 50%;
    transform: translateX(-50%) translateY(-50%);
    display: inline-block;
    max-width: 1150px;
    width: auto;
    /deep/ .el-input__inner {
      height: 32px !important;
      color: #333;
      border-radius: 4px !important;
    }
    /deep/.el-dialog__header {
      padding: 12px 0 10px 16px;
      text-align: left;
      border-bottom: 1px solid #eff2f5;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #333;
      .el-dialog__close {
        top: -4px;
      }
    }
  }
}

/deep/.el-dialog__body {
  display: inline-block;
}
.div-row {
  width: 300px;
  margin-top: 13px;
}
.div-row1 {
  display: inline-block;
  margin-top: 12px;

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
}
.btn-confirm {
  position: relative;
  bottom: 24px;
  border-radius: 3px;
  top: 26px;
  left: 50%;
  background: #f8ac59;
  border-color: #f8ac59;
  min-width: 72px;
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
/deep/.el-scrollbar__wrap {
  width: 238px !important;
}
</style>
