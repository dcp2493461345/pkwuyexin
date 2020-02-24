<template>
  <div class="hard-setparamClass">
    <div class="setparam-container">
      <el-card class="box-card">
        <div class="mm">
          <span id="newadd" @click="addCamer" v-if="addBtn">新增摄像头</span>
          <el-select v-model="optionsChuruValue" placeholder="请选择" class="nn">
            <el-option v-for="item in optionsChuru" :key="item.value" :value="item.label">
              <span class="chenp" @click="hanPoid_fenlei(item.value)">{{ item.label }}</span>
            </el-option>
          </el-select>
        </div>
        <el-table :data="tableData" style="width: 100%" empty-text="暂无数据">
          <el-table-column prop="door_name" label="门岗名称" width="120" />
          <el-table-column label="出/入口" width="120">
            <template slot-scope="scope">
              <span v-html="scope.row.camera_door === 1 ? '入口' : '出口'" />
            </template>
          </el-table-column>
          <el-table-column prop="camera_name" label="设备名称" width="150" />
          <el-table-column prop="camera_sn" label="设备序列号" width="200" />
          <el-table-column prop="camera_host" label="设备IP地址" width="190" />
          <el-table-column prop="end_time" label="最后一次提交时间" width="180">
            <template slot-scope="scope">
              <span v-html="scope.row.end_time == 0 ? '-' : scope.row.end_time" />
            </template>
          </el-table-column>
          <el-table-column label="设备状态" width="160">
            <template slot-scope="scope">
              <span
                class="qiyong-calss"
                v-html="scope.row.camera_state === 1 ? '已启用' : '已禁用'"
                :class="scope.row.camera_state === 1 ? '' : 'red-class'"
              />
            </template>
          </el-table-column>
          <el-table-column label="网络状态" width="150">
            <template slot-scope="scope">
              <span
                v-html="scope.row.camera_internet_state === 1 ? '已连接' : '断网'"
                :class="scope.row.camera_internet_state === 1 ? '' : 'red-class'"
              />
            </template>
          </el-table-column>
          <el-table-column prop="camera_time" label="设备时间" width="160">
            <template slot-scope="scope">
              <span v-html="scope.row.camera_time == 0 ? '-' : scope.row.camera_time" />
            </template>
          </el-table-column>
          <!-- 操作 -->
          <el-table-column label="操作" min-width="350">
            <template slot-scope="scope">
              <el-button
                v-if="modiBtn"
                size="mini"
                style="background:#25BAD9; color:#fff; font-size:14px;height:30px; width:52px;
            border-color:#25BAD9; padding:5px;"
                @click="handleEdit(scope.$index, scope.row)"
              >修改</el-button>
              <el-button
                v-show="jinyongBtn"
                v-if="scope.row.camera_state === 1"
                class="el-btn2"
                size="mini"
                type="danger"
                style="background:#FA5C5CFF; color:#fff; font-size:14px;height:30px; width:52px;
            border-color:#FA5C5CFF; padding:5px;"
                @click="handleJinyong(scope.$index, scope.row)"
              >禁用</el-button>
              <el-button
                v-show="qiyongBtn"
                v-else
                class="el-btn2"
                size="mini"
                type="danger"
                style="background:#46C346FF; color:#fff; font-size:14px;height:30px; width:52px;
            border-color:#46C346FF; padding:5px;"
                @click="handleQiyong(scope.$index, scope.row)"
              >启用</el-button>
              <el-button
                v-if="scope.row.camera_door === 2 ? true:false"
                v-show="shoukuanmaBtn"
                class="el-btn2"
                size="mini"
                style="background:#1FBBA6; color:#fff; font-size:14px;height:30px; width:auto;
            border-color:#1FBBA6; padding:5px;"
                @click="handleQr(scope.$index, scope.row)"
                v-html="scope.row.image === null ? '收款码':'查看收款码'"
              />
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
    <!-- 分页 -->
    <my-pages :pageInfo="pageInfo" @handleCurrentChange="handleCurrentChange" class="myfenye"></my-pages>
    <!--启用 遮罩三 -->
    <el-dialog
      title="提示"
      :visible.sync="centerDialogVisible1"
      :append-to-body="true"
      center
      class="chen"
      top="35vh"
      :close-on-click-modal="false"
    >
      <div style="font-size:16px;">是否启用该摄像头?</div>
      <span slot="footer" class="dialog-footer">
        <el-button class="quxiao1" style="font-size:14px;" @click="centerDialogVisible1 = false">取 消</el-button>
        <el-button type="primary" style="font-size:14px;" @click="qiyongHandler">确 认</el-button>
      </span>
    </el-dialog>
    <!-- 禁用遮罩 -->
    <el-dialog
      title="提示"
      :visible.sync="centerDialogVisible4"
      :append-to-body="true"
      center
      class="chen"
      top="35vh"
      :close-on-click-modal="false"
    >
      <div style="font-size:16px;">是否禁用该摄像头?</div>
      <span slot="footer" class="dialog-footer">
        <el-button class="quxiao1" style="font-size:14px;" @click="centerDialogVisible4 = false">取 消</el-button>
        <el-button type="primary" style="font-size:14px;" @click="jingongHandler">确 认</el-button>
      </span>
    </el-dialog>
    <!-- 新增摄像头遮罩层 -->
    <el-dialog
      :visible.sync="centerDialogVisible2"
      width="400px"
      center
      custom-class="addCame-class"
      :append-to-body="true"
      :close-on-click-modal="false"
      top="30vh"
    >
      <span slot="title">新增摄像头</span>
      <el-form :label-position="labelPosition" label-width="120px">
        <div class="form-item">
          <el-form-item label="门岗名称:" class="region-class">
            <el-select v-model="door_post_name" placeholder="请选择门岗" style="width:100% !important">
              <el-option v-for="item in doorNameLists" :key="item.id" :value="item.door_post_name">
                <span class="chenp" @click="hanPoid_AddCamera(item.id)">{{ item.door_post_name }}</span>
                <!-- <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span> -->
              </el-option>
            </el-select>
            <p class="red-class" style="height: 2px;margin-top: -12px;">{{ addToast.doorIdTips }}</p>
          </el-form-item>
        </div>
        <div class="form-item" style="height:60px">
          <el-form-item label="设备名称:">
            <input
              ref="nameInput"
              v-model="formAddContent.camera_name"
              type="text"
              placeholder="请输入设备名称"
            />
            <p class="red-class">{{ addToast.cameraNameTips }}</p>
          </el-form-item>
        </div>
        <div class="form-item" style="height:60px">
          <el-form-item label="设备序列号:">
            <input
              ref="nameInput"
              v-model="formAddContent.camera_sn"
              type="text"
              placeholder="请输入设备序列号"
            />
            <p class="red-class">{{ addToast.cameraSnTips }}</p>
          </el-form-item>
        </div>
        <div class="form-item" style="height:60px">
          <el-form-item label="设备IP地址:">
            <input v-model="formAddContent.camera_host" type="text" placeholder="请输入设备IP地址" />
            <p class="red-class">{{ addToast.cameraHostTips }}</p>
          </el-form-item>
        </div>
        <div class="form-item">
          <el-form-item label="选择出/入口:" class="region-class">
            <el-select
              v-model="inOut"
              class="width:73.5% !important"
              empty-text="暂无数据"
              placeholder="请选择出/入口"
            >
              <el-option v-for="item in options_In_outLists" :key="item.value" :value="item.label">
                <span class="chenp" @click="hanPoid_InOut(item.value)">{{ item.label }}</span>
                <!-- <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span> -->
              </el-option>
            </el-select>
            <p class="red-class">{{ addToast.cameraDoorTips }}</p>
          </el-form-item>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer" @click="addCamerDid">
        <span>确认</span>
      </span>
    </el-dialog>
    <!-- 修改摄像头 -->
    <el-dialog
      :visible.sync="centerDialogVisible3"
      width="400px"
      center
      custom-class="addCame-class"
      :append-to-body="true"
      :close-on-click-modal="false"
    >
      <span slot="title">修改摄像头</span>
      <el-form :label-position="labelPosition" label-width="120px">
        <div class="form-item">
          <el-form-item label="门岗名称:" class="region-class">
            <el-select v-model="door_post_name1" placeholder="请选择门岗" class="width:73.5% !important">
              <el-option v-for="item in doorNameLists" :key="item.id" :value="item.door_post_name">
                <span class="chenp" @click="hanPoid_AddCamera1(item.id)">{{ item.door_post_name }}</span>
                <!-- <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span> -->
              </el-option>
            </el-select>
            <p class="red-class" style="height: 2px;margin-top: -12px;">{{ modifyToast.doorIdTips }}</p>
          </el-form-item>
        </div>

        <div class="form-item" style="height:60px">
          <el-form-item label="设备名称:">
            <input
              ref="nameInput1"
              v-model="formModifyContent.camera_name"
              type="text"
              placeholder="请输入设备名称"
            />
            <p class="red-class">{{ modifyToast.cameraNameTips }}</p>
          </el-form-item>
        </div>
        <div class="form-item" style="height:60px">
          <el-form-item label="设备序列号:">
            <input
              ref="nameInput"
              v-model="formModifyContent.camera_sn"
              type="text"
              placeholder="请输入设备序列号"
            />
            <p class="red-class">{{ modifyToast.cameraSnTips }}</p>
          </el-form-item>
        </div>
        <div class="form-item" style="height:60px">
          <el-form-item label="设备IP地址:">
            <input v-model="formModifyContent.camera_host" type="text" />
            <p class="red-class">{{ modifyToast.cameraHostTips }}</p>
          </el-form-item>
        </div>
        <div class="form-item">
          <el-form-item label="选择出/入口:" class="region-class">
            <el-select v-model="inOut1" class="width:73.5% !important">
              <el-option v-for="item in options_In_outLists" :key="item.value" :value="item.label">
                <span class="chenp" @click="hanPoid_InOut1(item.value)">{{ item.label }}</span>
                <!-- <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span> -->
              </el-option>
            </el-select>
            <p class="red-class">{{ modifyToast.cameraDoorTips }}</p>
          </el-form-item>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer" @click="handleEditDid">
        <span>确认</span>
      </span>
    </el-dialog>
    <!-- 录入收款码 -->
    <el-dialog
      title="收款码"
      custom-class="myAddForm"
      :append-to-body="true"
      class="face-class"
      :visible.sync="fcDialogFormVisible"
      :close-on-click-modal="false"
    >
      <!-- 上传二维码 -->
      <div class="upimg-class upimg-top">
        <p style="color:red;position: absolute;left: 257px;top: 92px;">{{imageAddToast}}</p>
        <span style="width:158px;top:92px;position:absolute;left:100px;">收款码:</span>
        <div class="up-img">
          <el-upload
            ref="upload"
            :limit="1"
            action="#"
            :on-remove="handleRemove"
            :on-preview="handlePictureCardPreview"
            :on-change="handleChange"
            list-type="picture-card"
            :auto-upload="false"
            :class="{hide:hideUpload}"
          >
            <i slot="default" class="el-icon-plus" />
            <div slot="file" slot-scope="{file}">
              <img class="el-upload-list__item-thumbnail" :src="file.url" alt />
              <span class="el-upload-list__item-actions">
                <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)">
                  <i class="el-icon-zoom-in" />
                </span>
              </span>
            </div>
          </el-upload>

          <!-- 图片预览部分 -->
          <el-dialog
            style="width:100%;background:#999;height:100%;z-index:25689;"
            custom-class="detailForm"
            title="查看详情"
            :modal="mod"
            :visible.sync="ImgDiaLog.add"
            :append-to-body="true"
            :fullscreen="true"
            :close-on-click-modal="false"
          >
            <img width="100%;height:100%;" :src="ImgDiaLog.addSrc" alt />
          </el-dialog>
        </div>
      </div>
      <div
        v-loading="loading"
        class="addNow"
        style="top:74%;"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
        @click="uploadFaceHandler"
      >确认上传</div>
    </el-dialog>
    <!-- 查看收款码 -->
    <el-dialog
      title="查看收款码"
      custom-class="myAddForm"
      :append-to-body="true"
      class="face-class face-class1"
      :visible.sync="fcDialogFormVisible1"
      :close-on-click-modal="false"
    >
      <!-- 查看收款码 -->
      <div class="upimg-class upimg-bottom">
        <!-- <p style="color:red;position: absolute;left: 257px;top: 83px;">{{imageModiToast}}</p> -->
        <p
          class="reupload"
          style="font-size:14px;left:245px;position:absolute;top:90px;color:#5FAFE4;"
        >
          重新上传
          <svg-icon icon-class="upload" />
        </p>
        <span style="width:158px;top:92px;position:absolute;left:60px;">收款码:</span>
        <div class="up-img" style="left:150px;top:71px;width:200px;">
          <el-upload
            ref="upload1"
            :limit="2"
            action="#"
            :on-remove="handleRemove1"
            :on-preview="handlePictureCardPreview1"
            :on-change="handleChange1"
            :file-list="temImgArr"
            list-type="picture-card"
            :auto-upload="false"
            class="upload-image1"
          >
            <div slot="file" slot-scope="{file}">
              <img class="el-upload-list__item-thumbnail" :src="file.url" alt />
            </div>
          </el-upload>
          <!-- 图片预览box下半部分 -->
          <el-dialog
            style="width:100%;background:#999;height:100%;z-index:25689;"
            custom-class="detailForm"
            title="查看详情"
            :modal="mod"
            :visible.sync="ImgDiaLog.modify"
            :append-to-body="true"
            :fullscreen="true"
            :close-on-click-modal="false"
          >
            <img width="100%;height:100%;" :src="ImgDiaLog.modifySrc" alt />
          </el-dialog>
        </div>
      </div>
      <div
        class="addNow"
        style="top:74%;"
        v-loading="loading1"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
        @click="uploadFaceHandler"
      >确认</div>
    </el-dialog>
  </div>
</template>

<script>
import { Message } from 'element-ui'
import { postCameraList, parkcamer_code_xiala, postDoorListId, postCamerAdd, postCamerType, postCameraUpdate, postCameraCode, postCamer_update_batch } from '@/api/hardware'
import M from 'minimatch'
import { postSelect_button } from '@/api/Jurisdiction1'
// data数据
export default {
  components: {},
  data () {
    return {
      optionsChuru: [{
        value: 0,
        label: '所有'
      }, {
        value: 1,
        label: '入口'
      }, {
        value: 2,
        label: '出口'
      }],
      optionsChuruValue: "所有",
      qiyongBtn: false,//按钮权限判定之启用
      fenleiId: null,
      jinyongBtn: false,//按钮权限判定之禁用
      modiBtn: false,//按钮权限判定之修改
      addBtn: false,//按钮权限判定之新增摄像头
      shoukuanmaBtn: false,//按钮权限判定之收款码
      chakanBtn: false,//按钮权限判定之查看收款码
      temImgArr: [], // 缩略图
      loading: false,
      loading1: false,
      flagDele: 1,//2代表查看收款码进行了删除这一步操作
      // outId: null,//本条数据的id
      limitCount: 1,
      hideUpload: false,
      hideUpload1: false,
      mod: false, // 不需要遮罩层
      imageAddToast: "",//收款码提示语
      imageModiToast: "",//收款码提示语
      fileLists: [], // 添加图片
      fileLists1: [],//查看图片
      fcDialogFormVisible: false,
      fcDialogFormVisible1: false, // 查看收款码
      ImgDiaLog: { // 图片弹窗显示与否
        origin: false,
        originSrc: '',
        add: false,
        addSrc: '',
        modify: false,
        modifySrc: ''
      },
      camareId: null, // 摄像头id
      centerDialogVisible2: false, // 新增摄像头
      centerDialogVisible3: false, // 修改摄像头
      centerDialogVisible1: false, // 启用
      centerDialogVisible4: false, // 禁用
      isActived: false,
      formAlign1: {
        name: '',
        phone: ''
      },
      poname: '', // 新增摄像头下拉选择数据
      mistakeToast1: '',
      mistakeToast2: '',
      add: {//添加的验证
        doorIdValidata: false,//门岗名称验证
        cameraNameValidata: false,//设备名称验证
        cameraSnValidata: false,//设备序列号验证
        cameraHostValidata: false,//设备IP地址验证
        cameraDoorValidata: false,//选择出入口验证
      },
      addToast: {//添加的提示语
        doorIdTips: '',//门岗名称提示语
        cameraNameTips: '',//设备名称提示语
        cameraSnTips: '',//设备序列号提示语
        cameraHostTips: '',//设备IP地址提示语
        cameraDoorTips: '',//选择出入口提示语
      },
      modifyToast: {//修改的提示语
        doorIdTips: '',//门岗名称提示语
        cameraNameTips: '',//设备名称提示语
        cameraSnTips: '',//设备序列号提示语
        cameraHostTips: '',//设备IP地址提示语
        cameraDoorTips: '',//选择出入口提示语
      },
      tableData: [],
      userInfo: {}, // localStorage的userInfo

      pageInfo: {
        total: 0,//总条数
        listRows: 10,//page-size
        page: 1,//当前页
      },
      doorName: '', // 增加的门岗名称
      labelPosition: 'right',
      parkid: null,
      currentPage: null, // 当前页
      doorNameLists: [
      ],
      options_In_outLists: [
        {
          label: '出口',
          value: 2
        }, {
          label: '入口',
          value: 1
        }
      ],
      // 新增摄像头传给后端的参数
      formAddContent: {
        door_id: '', // 门岗绑定的id
        camera_name: '', // 摄像头名称
        camera_sn: '', // 摄像头设备序列号
        camera_host: '', // 设备的ip地址
        camera_door: null// 1是入口2是出口
      },
      door_post_name: '', // 门岗名称
      door_post_name1: '', // 修改时的门岗名称
      inOut: '', // 出入口
      inOut1: '', // 出入口
      // 修改摄像头传给后端的参数
      formModifyContent: {
        door_id: '', // 门岗绑定的id
        camera_name: '', // 摄像头名称
        camera_sn: '', // 摄像头设备序列号
        camera_host: '', // 设备的ip地址
        camera_door: null// 1是入口2是出口
      }

    }
  },
  created () {
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'))
    const { Communityid, uid } = this.userInfo
    this.parkid = this.userInfo.Communityid
    const auth_id = this.$route.meta.auth_id
    this.getCamereList(1, 10, this.parkid)
    //请求门岗列表
    this.getDOorLists()
    // 按钮权限判定
    postSelect_button({ Communityid, uid, auth_id }).then(resp => {
      if (resp.code === 200) {
        this.buttonLists = resp.data
        var btnList = this.buttonLists
        btnList.forEach(list => {
          if (list.auth_name === '启用/禁用') {
            this.qiyongBtn = true
          }
          if (list.auth_name === '启用/禁用') {
            this.jinyongBtn = true
          }
          if (list.auth_name === '修改') {
            this.modiBtn = true
          }
          if (list.auth_name === '新增摄像头') {
            this.addBtn = true
          }
          if (list.auth_name === '收款码/查看收款码') {
            this.shoukuanmaBtn = true
          }
        })
      }
    })
  },
  methods: {
    //门岗列表请求
    getDOorLists () {
      postDoorListId({ parkid: this.parkid }).then(resp => {
        this.doorNameLists = resp.data
      })
    },
    //新增时的下拉选择框事件
    hanPoid_AddCamera (id) {
      this.formAddContent.door_id = id
    },
    hanPoid_InOut (value) {
      this.formAddContent.camera_door = value
    },
    //修改时的下拉选择框事件
    hanPoid_AddCamera1 (id) {
      this.formModifyContent.door_id = id
    },
    hanPoid_InOut1 (value) {
      this.formModifyContent.camera_door = value
    },
    hanPoid_fenlei (value) {
      parkcamer_code_xiala({ camera_door: value, parkid: this.parkid }).then(resp => {
        this.tableData = resp.data.data
        this.pageInfo.total = resp.data.total
        this.pageInfo.page = resp.data.page
      })
    },
    //点击新增摄像头
    addCamer () {
      //清空数据
      this.formAddContent.door_id = ''
      this.formAddContent.camera_name = ''
      this.formAddContent.camera_sn = ''
      this.formAddContent.camera_host = ''
      this.formAddContent.camera_door = null
      this.centerDialogVisible2 = true
      this.inOut = ''
      this.door_post_name = ''
    },
    //确认添加
    addCamerDid () {
      //++++++++++++++++++++++++++++++++++++++++++++++++
      const addCamerQuery = {
        ...this.formAddContent,
        park_id: this.parkid
      }
      //验证是否选择了门岗
      if (!addCamerQuery.door_id) {
        // console.log('lll')
        this.addToast.doorIdTips = '请选择门岗'
        setTimeout(() => {
          this.addToast.doorIdTips = ''
        }, 2000)
      } else if (!addCamerQuery.camera_name) {
        //验证是否输入了设备名称
        this.addToast.cameraNameTips = '请输入设备名称'
        setTimeout(() => {
          this.addToast.cameraNameTips = ''
        }, 2000)
      } else if (!addCamerQuery.camera_sn) {
        //验证是否输入了设备序列号
        this.addToast.cameraSnTips = '请输入设备序列号'
        setTimeout(() => {
          this.addToast.cameraSnTips = ''
        }, 2000)
      } else if (!addCamerQuery.camera_host) {
        //验证是否输入了设备IP地址
        this.addToast.cameraHostTips = '请输入设备IP地址'
        setTimeout(() => {
          this.addToast.cameraHostTips = ''
        }, 2000)
      } else if (!addCamerQuery.camera_door) {
        //验证是否选择了出入口
        this.addToast.cameraDoorTips = '请选择出/入口'
        setTimeout(() => {
          this.addToast.cameraDoorTips = ''
        }, 2000)
      } else if (addCamerQuery.door_id && addCamerQuery.camera_name && addCamerQuery.camera_sn && addCamerQuery.camera_host && addCamerQuery.camera_door) {
        //全部验证完成
        postCamerAdd(addCamerQuery).then(resp => {
          if (resp.data === '设备添加成功') {
            this.$message({
              message: resp.data,
              type: 'success'
            })
            this.centerDialogVisible2 = false
            const nume = Number(this.pageInfo.total) / Number(10)
            var shu = ''
            if (Math.round(nume) === nume) {
              // num是整数
              shu = Number(nume) + Number(1)
            } else {
              shu = Math.ceil(nume)
            }
            const page = shu
            this.getCamereList(shu, 10, this.parkid)
            this.pageInfo.page = shu
            this.handleCurrentChange(page)
          } else if (resp.data === "有序列号相同不允许添加") {
            this.addToast.cameraSnTips = '设备序列号已存在'
            setTimeout(() => {
              this.addToast.cameraSnTips = ''
            }, 2000)
          }
        })
      }

    },
    // 点击修改摄像头
    handleEdit (index, row) {
      // 数据回显
      this.formModifyContent.door_id = row.door_id
      this.formModifyContent.camera_name = row.camera_name
      this.formModifyContent.camera_sn = row.camera_sn
      this.formModifyContent.camera_host = row.camera_host
      this.formModifyContent.camera_door = row.camera_door
      this.inOut1 = row.camera_door === 1 ? '入口' : '出口'
      this.door_post_name1 = row.door_name
      this.formModifyContent.id = row.id
      this.centerDialogVisible3 = true
    },
    // 确认修改摄像头
    handleEditDid () {
      const ModifyCamerQuery = {
        ...this.formModifyContent,
        park_id: this.parkid
      }
      //验证是否选择了门岗
      if (!ModifyCamerQuery.door_id) {
        this.modifyToast.doorIdTips = '请选择门岗'
        setTimeout(() => {
          this.modifyToast.doorIdTips = ''
        }, 2000)
      } else if (!ModifyCamerQuery.camera_name) {
        //验证是否输入了设备名称
        this.modifyToast.cameraNameTips = '请输入设备名称'
        setTimeout(() => {
          this.modifyToast.cameraNameTips = ''
        }, 2000)
      } else if (!ModifyCamerQuery.camera_sn) {
        //验证是否输入了设备序列号
        this.modifyToast.cameraSnTips = '请输入设备序列号'
        setTimeout(() => {
          this.modifyToast.cameraSnTips = ''
        }, 2000)
      } else if (!ModifyCamerQuery.camera_host) {
        //验证是否输入了设备IP地址
        this.modifyToast.cameraHostTips = '请输入设备IP地址'
        setTimeout(() => {
          this.modifyToast.cameraHostTips = ''
        }, 2000)
      } else if (!ModifyCamerQuery.camera_door) {
        //验证是否选择了出入口
        this.modifyToast.cameraDoorTips = '请选择出/入口'
        setTimeout(() => {
          this.modifyToast.cameraDoorTips = ''
        }, 2000)
      } else if (ModifyCamerQuery.door_id && ModifyCamerQuery.camera_name && ModifyCamerQuery.camera_sn && ModifyCamerQuery.camera_host && ModifyCamerQuery.camera_door) {
        // console.log(ModifyCamerQuery, 'ModifyCamerQuery')
        postCamer_update_batch(ModifyCamerQuery).then(resp => {
          console.log(resp, '修改摄像头的response')
          if (resp.data === '设备修改成功') {
            this.$message({
              message: resp.data,
              type: 'success'
            })
            this.centerDialogVisible3 = false
            this.getCamereList(this.pageInfo.page, 10, this.park_id)
          } else if (resp.data === '设备修改失败') {
            //什么都没修改
            this.$message({
              message: '您未修改任何内容或修改失败',
              type: 'warning'
            })
            this.centerDialogVisible3 = false
          } else if (resp.data === "有序列号相同不允许添加") {
            this.modifyToast.cameraSnTips = '设备序列号已存在'
            setTimeout(() => {
              this.modifyToast.cameraSnTips = ''
            }, 2000)
          }
        })
      }
    },
    handleQiyong (index, row) {
      this.centerDialogVisible1 = true
      this.camareId = row.id
      const type = 1 // 1是启用,2是禁用
    },
    qiyongHandler () {
      const type = 1 // 1是启用,2是禁用
      postCamerType({ parkid: this.parkid, type: type, id: this.camareId }).then(resp => {
        if (resp.data == '设备信息状态修改成功') {

          this.$message({
            message: '设备启用成功',
            type: 'success'
          })
          this.centerDialogVisible1 = false
          this.getCamereList(this.pageInfo.page, 10, this.park_id)
        } else {
          this.$message({
            message: '设备启用失败',
            type: 'error'
          })
          this.centerDialogVisible1 = false
        }
      })
    },
    handleJinyong (index, row) {
      this.centerDialogVisible4 = true
      this.camareId = row.id
    },
    jingongHandler () {
      const type = 2
      postCamerType({ parkid: this.parkid, type: type, id: this.camareId }).then(resp => {
        if (resp.data == '设备信息状态修改成功') {

          this.$message({
            message: '设备禁用成功',
            type: 'success'
          })
          this.centerDialogVisible4 = false
          this.getCamereList(this.pageInfo.page, 10, this.park_id)
        } else {
          this.$message({
            message: '设备禁用失败',
            type: 'error'
          })
          this.centerDialogVisible4 = false
        }
      })
    },
    // 分页设置
    handleCurrentChange (val) {
      this.pageInfo.page = val
      this.getCamereList(val, 10, this.parkid)
    },
    // 查询摄像头列表
    getCamereList (page = 1, size = 10, parkid = this.parkid) {
      postCameraList({ page, size, parkid }).then(resp => {
        this.tableData = resp.data.data
        this.pageInfo.total = resp.data.total
        this.pageInfo.page = resp.data.page
      })
    },
    //点击收款码或者查看收款码
    handleQr (index, row) {
      this.temImgArr = [{}]
      if (row.image === null) {
        this.fcDialogFormVisible = true
        this.camareId = row.id
        this.hideUpload = false
        this.$refs.upload.clearFiles()
        this.fileLists = []
        this.loading = false
      } else {
        // 此时为查看二维码
        this.fcDialogFormVisible1 = true
        this.camareId = row.id
        this.hideUpload1 = true
        this.temImgArr = [{ url: row.image }]
        this.fileLists1 = []
        this.fileLists = []
        this.loading1 = false
      }
    },
    // 图片事件
    handleRemove (file, fileList) {
      this.fileLists = fileList
      this.hideUpload = fileList.length >= this.limitCount
    },
    handleRemove1 (file, fileList) {
      this.flagDele = 2
      this.fileLists1 = fileList
      this.hideUpload1 = fileList.length >= this.limitCount
    },
    handlePictureCardPreview (file) {
      this.ImgDiaLog.addSrc = file.url
      this.ImgDiaLog.add = true // 添加预览
    },
    handlePictureCardPreview1 (file) {
      this.ImgDiaLog.modifySrc = file.url
      this.ImgDiaLog.modify = true // 添加预览
    },
    // 录入收款码本地选中的图片变化
    handleChange (file, fileList) {
      this.fileLists = fileList
      this.hideUpload = fileList.length >= this.limitCount
    },
    handleChange1 (file, fileList) {
      this.fileLists1 = fileList
      this.temImgArr = [{ url: fileList[1].url }]
      this.hideUpload1 = fileList.length >= this.limitCount
    },
    uploadFaceHandler () {
      if (this.fcDialogFormVisible) {
        //录入收款码
        if (this.fileLists[0]) {
          this.loading = true
          const formData = new FormData()
          formData.append('image', this.fileLists[0].raw)
          const id = this.camareId
          formData.append('id', id)
          formData.append('parkid', this.parkid)
          postCameraCode(formData).then(resp => {
            if (resp.data === '修改二维码成功') {
              this.loading = false
              this.fcDialogFormVisible = false
              this.$message({
                message: '添加收款码成功',
                type: 'success'
              })
              this.getCamereList(this.pageInfo.page, 10, this.park_id)
            }
          })
        } else {
          //验证是否选择图片
          this.imageAddToast = '请添加收款码'
          setTimeout(() => {
            this.imageAddToast = ''
          }, 2000)
        }
      } else {
        //查看收款码
        if (this.fileLists1.length !== 0) {
          this.loading1 = true
          const id = this.camareId
          const formData = new FormData()
          formData.append('id', id)
          formData.append('parkid', this.parkid)
          formData.append('image', this.fileLists1[1].raw)
          postCameraCode(formData).then(resp => {
            if (resp.data === '修改二维码成功') {
              this.loading = false
              this.fcDialogFormVisible1 = false
              this.flagDele === 1
              this.$message({
                message: resp.data,
                type: 'success'
              })
              this.getCamereList(this.pageInfo.page, 10, this.park_id)
            } else if (resp.data === "修改二维码失败") {
              this.loading = false
              this.fcDialogFormVisible1 = false
              this.$message({
                message: '您未修改任何内容或者修改失败',
                type: 'warning'
              })
            }
          })
        } else {
          this.loading = false
          this.fcDialogFormVisible1 = false
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
//折叠样式
/deep/.demo-table-expand {
  font-size: 0;
  margin: 8px 0 8px 58px;
}
/deep/.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
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
  min-height: 510px;
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
  padding: 0px 35px 0px 54px !important;
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
}
.chen {
  /deep/.el-dialog {
    background-color: #fff !important;
    width: 380px;
    min-height: 210px;
    border-radius: 5px;
    height: 210px;
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
/deep/.el-table {
  display: relative;
  overflow: inherit;
}
.entry-table-class {
  overflow-x: hidden !important;
  border-bottom: none !important;
  top: 12px;
  // min-width: 940px;
}
/deep/.entry-table-class td {
  padding: 15px 0px !important;
}
.gatename-mistacktoast {
  color: red;
  width: auto;
  position: absolute;
  height: 20px;
  left: 120px;
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

.add-class {
  /deep/.el-dialog {
    position: absolute;
    margin: 0 !important;
    left: 50%;
    top: 50%;
    border-radius: 4px;
    transform: translateX(-50%) translateY(-50%);
    display: inline-block;
    max-width: 1150px;
    height: 665px;
    width: auto;
    .el-dialog__title {
      font-size: 16px;
    }
    /deep/ .el-input__inner {
      // background-color: #f00 !important;
      height: 32px !important;
      border-radius: 4px !important;
      color: #f00;
    }
  }
}
/deep/.el-dialog__header {
  padding: 1.2vh 0px 0.8vh 20px;
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
}
.div-row1 {
  display: inline-block;
  margin-top: 14px;

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
  bottom: 24px;
  border-radius: 3px;
  top: 30px;
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
  top: -7px;
  right: 0px;
}
/deep/.el-dialog__title {
  cursor: default;
}
.modify-class {
  /deep/.el-dialog {
    // background-color: #f00 !important;
    height: 420px;
  }
}
.hard-setparamClass {
  height: 93%;
}
.setparam-container {
  // min-width: 1445px;
  width: 100%;
  height: 700px;
}
/deep/.el-table .cell {
  height: 30px !important;
}
.chenp {
  display: block;
}

.face-class {
  // background-color: #f00;
  /deep/.el-dialog {
    width: 400px;
    height: 216px !important;
    min-width: 420px !important;
    .el-dialog__title {
      font-size: 16px;
    }
    .el-dialog__body {
      padding: 40px;
      box-sizing: border-box;
    }
  }
}
/deep/.up-img {
  z-index: 999;
  height: 60px;
  overflow: hidden;
  position: absolute;
  top: 75px;
  left: 175px;

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
/deep/.myAddForm {
  background-color: #fff;
  margin-top: 0% !important;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  -webkit-transform: translate(-50%, -50%);
  -moz-transform: translate(-50%, -50%);
  min-width: 420px;
  border-radius: 5px;
}
.addNow {
  display: block;
  padding: 0 12px;
  height: 32px;
  background: rgba(248, 172, 89, 1);
  border-radius: 4px;
  position: absolute;
  bottom: 24px;
  left: 43%;
  font-size: 14px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: rgba(255, 254, 254, 1);
  line-height: 32px;
  text-align: center;
  cursor: pointer;
}
/deep/.hide .el-upload--picture-card {
  display: none !important;
}
.detailForm {
  /deep/.el-dialog__body {
    padding: 30px 20px;
    color: #606266;
    font-size: 14px;
    height: 590px !important;
    overflow-x: auto !important;
}
}
/deep/.el-dialog.is-fullscreen {
  width: 800px !important;
  height: 640px !important;
  margin-top: 140px !important;
   /deep/.el-dialog__body {
    padding: 30px 20px;
    color: #606266;
    font-size: 14px;
    height: 590px !important;
    overflow-x: auto !important;
}
}
/deep/.addCame-class {
  overflow: hidden;
  width: 500px;
  height: 434px;
  background: rgba(255, 255, 255, 1);
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  margin: 0 !important;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  .el-dialog__header {
    font-size: 16px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
    padding: 14px 0px 12px 20px;
    .el-dialog__headerbtn {
      top: 24px;
    }
  }
  .el-dialog__body {
    overflow: hidden;
    box-sizing: border-box;
    padding: 24px 61px 0px 28px !important;
    /deep/.el-select {
      input {
        border: 1px solid #d2d2d2 !important;
        padding-left: 10px;
        outline: none !important;
      }
    }
    input {
      width: 200px;
      height: 32px;
      color: #666666;
      border: 1px solid rgba(210, 210, 210, 1);
      border-radius: 4px;
      padding-left: 10px;
      outline: none !important;
    }
    input::-webkit-input-placeholder {
      color: #ccc;
    }
    input::-moz-placeholder {
      color: #ccc;
    }
    input:-ms-input-placeholder {
      color: #ccc;
    }
  }
  .el-dialog__footer {
    padding: 0px 20px 20px !important;
    display: flex;
    justify-content: center;
    span {
      width: 72px;
      height: 30px;
      line-height: 30px;
      background: rgba(252, 176, 72, 1);
      border-radius: 4px;
      border: 1px solid rgba(252, 176, 72, 1) !important;
      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: rgba(255, 254, 254, 1);
      cursor: pointer;
    }
  }
}
.red-class {
  color: red;
  height: 2px;
  margin-top: -12px;
}
/deep/.el-icon-close-tip {
  display: none !important;
}
/deep/.el-upload-list__item {
  transition: none !important;
}
/deep/.el-pagination button:disabled {
  cursor: default;
}
/deep/.myfenye {
  top: 100px;
  .record-data {
    left: 20px;
  }
  .el-pagination {
    right: 90px;
  }
}
/deep/.el-select-dropdown__item {
  // background: red;
  padding: 0 !important;
}
.upload-image1 {
  /deep/.el-upload-list__item-delete {
    display: none !important;
  }
}
.upimg-bottom {
  // display: flex;
  //   height: 54px;
  /deep/.up-img {
    // z-index: 999;
    height: 60px;
    overflow: hidden;
    position: absolute;
    top: -16px;
    left: 140px;

    .el-icon-plus {
      position: absolute;
      left: 15px;
      top: 15px;
    }
    /deep/.el-upload--picture-card {
      position: relative;
      width: 60px !important;
      height: 60px !important;
      background: #fff;
      width: 100px !important;
      border: none !important;
      opacity: 0;
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
}
.reupload {
  .svg-icon {
    font-size: 25px !important;
  }
}
#newadd {
  float: left;
}
.mm {
  display: block;
  height: 30px;
  .nn {
    float: right;
    width: 160px;
    height: 30px;
    border: 1px solid rgba(220, 222, 226, 1);
    border-radius: 5px;
    overflow: hidden;
    /deep/.el-input__inner {
      height: 44px !important;
    margin-top: -8px;
    }
    /deep/.el-input__suffix {
      // top: 0px !important;
    }
  }
}

</style>
