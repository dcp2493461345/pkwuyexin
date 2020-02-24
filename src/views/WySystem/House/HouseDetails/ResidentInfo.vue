<template>
  <div id="enterprise-info" class="infor-warp">
    <span v-if="!isShowExcel" v-show="xiazai" class="load-class" @click="clickDownLoad">下载住户模板</span>
    <div v-if="isShowHis" slot="header" class="clearfix">
      <div v-if="!isShowExcel" class="box-header-right">
        <span class="add-btn" @click="exitBefore">返回上一级</span>
        <span class="add-btn add-btn2" @click="addUser" style="width:72px; margin:0 8px;">添加住户</span>
        <el-upload
          v-if="!isShowExcel"
          action="#"
          multiple
          :before-upload="beforeUpload"
          :limit="1"
          :show-file-list="false"
        >
          <el-button size="small" type="primary" class="add-btn" style="width:72px;">导入住户</el-button>
        </el-upload>
      </div>
      <div v-if="!isShowExcel" class="box-header-left" @click="historyHandler">历史住户</div>
      <!-- 点击到入住户 -->
      <div v-if="isShowExcel" v-show="!isError" class="box-header-right" style="width:165px;">
        <span class="add-btn" @click="exitHandler">返回上一级</span>
        <span class="add-btn add-btn2" @click="querenUpload" style="width:72px;">确认导入</span>
      </div>
    </div>
    <!-- 历史住户的返回上一级 -->
    <div v-if="!isShowHis" slot="header" class="clearfix">
      <div class="box-right">
        <span class="add-btn1" @click="exitHisHandler">返回上一级</span>
      </div>
    </div>
    <div v-if="isError" class="clearfix" style="height:0px">
      <span
        v-if="isError"
        v-show="isShowExcel"
        style="background:#F8AC59;position:absolute;left:
        0px;top:10px;cursor:pointer; width:52px; height:30px; border-radius:4px; padding:5px 12px; font-size:14px; margin-top:-10px; color:#fff;"
        class="add-btn"
        @click="querenHandler"
      >确认</span>
      <span
        v-if="isError"
        style="position:absolute;left:72px;top:5px;color:#f44; font-size:14px;"
      >提示: 您有数据未导入成功,请记录并修改后再次重新导入</span>
    </div>
    <!-- <div class="noInfo" v-if="!isShowCard">
      目前还没有相关数据!!
    </div>-->
    <el-card class="list-card" shadow="never">
      <!-- 住户信息列表 -->
      <el-table
        v-if="!isShowExcel"
        v-show="isShowHis"
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
        <el-table-column prop="housenumber" label="房屋编号" min-width="120" />
        <el-table-column prop="username" label="住户姓名" min-width="120" />
        <el-table-column prop="phone" label="联系电话" min-width="175">
          <template slot-scope="scope">
            <p
              v-for="(item,index) in scope.row.phone.split(',')"
              :key="index"
              class="phone-class"
            >{{item}}</p>
          </template>
        </el-table-column>

        <el-table-column prop="type" label="住户身份" min-width="100" style="padding-left:200px;">
          <template slot-scope="scope">
            <p v-html="scope.row.type === 1 ? '房主':scope.row.type === 2?'家属':'租客'" />
          </template>
        </el-table-column>

        <el-table-column prop="conet" label="备注" min-width="120">
          <template slot-scope="scope">
            <p class="note">{{scope.row.conet}}</p>
          </template>
        </el-table-column>
        <el-table-column v-if="!isShowExcel" label="操作" min-width="350">
          <template slot-scope="scope">
            <el-button
              v-if="!isShowExcel"
              v-show="isShowHis"
              type="text"
              size="small"
              class="operateBtn btn-modify"
              @click="handleModifyClick(scope.row)"
              style="height:30px; width:52px; "
            >修改</el-button>
            <el-button
              v-if="!isShowExcel"
              size="small"
              class="operateBtn btn-licence"
              @click="handleDetailClick(scope.row)"
              style="width:52px; height:30px; margin-left:8px; border:1px solid #1FBBA6;"
            >更多</el-button>
            <span v-if="isRlDevice">
              <el-button
                v-if="!isShowExcel"
                v-show="isShowHis"
                ref="faceNames"
                type="text"
                size="small"
                class="operateBtn btn-modify"
                @click="handleFaceClick(scope.row)"
                style="width:72px; height:30px; margin-left:8px;"
                v-html="scope.row.imgtype === 2 ? '人脸录入':'查看人脸'"
              />
            </span>
            <el-button
              v-if="!isShowExcel"
              v-show="isShowHis"
              type="text"
              size="small"
              class="operateBtn btn-record"
              style="height:30px; width:52px; margin-left:8px;"
              @click="handleExchangeClick(scope.row)"
            >变更</el-button>
            <el-button
              v-if="!isShowExcel"
              type="text"
              size="small"
              class="operateBtn btn-record"
              style="width:72px; height:30px; margin-left:8px;background:#cccccc;"
              @click="handleRecordClick(scope.row)"
            >操作记录</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 历史住户 -->
      <el-table
        v-if="!isShowHis"
        empty-text="暂无数据"
        :data="tableData"
        row-class-name="myRow"
        cell-class-name="myCell"
        style="width: 100%; height:100%;"
      >
        <el-table-column prop="housenumber" label="房屋编号" min-width="200" />
        <el-table-column prop="username" label="历史住户姓名" min-width="200" />
        <el-table-column prop="phone" label="联系电话" min-width="175">
          <template slot-scope="scope">
            <p
              v-for="(item,index) in scope.row.phone.split(',')"
              :key="index"
              class="phone-class"
            >{{item}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="历史住户身份" min-width="200">
          <template slot-scope="scope">
            <p v-html="scope.row.type === 1 ? '房主':scope.row.type === 2?'家属':'租客'" />
          </template>
        </el-table-column>
        <el-table-column prop="conet" label="备注" min-width="250">
          <template slot-scope="scope">
            <p class="note">{{scope.row.conet}}</p>
          </template>
        </el-table-column>
        <el-table-column v-if="!isShowExcel" label="操作" min-width="350">
          <template slot-scope="scope">
            <el-button
              v-if="!isShowExcel"
              v-show="isShowHis"
              type="text"
              size="small"
              class="operateBtn btn-modify"
              style="height:30px; width:52px; "
              @click="handleModifyClick(scope.row)"
            >修改</el-button>
            <el-button
              v-if="!isShowExcel"
              size="small"
              class="operateBtn btn-licence"
              style="width:52px; height:30px; margin-left:2px; border:1px solid #1FBBA6;"
              @click="handleDetailClick(scope.row)"
            >更多</el-button>
            <span v-if="isRlDevice">
              <el-button
                v-if="!isShowExcel"
                v-show="isShowHis"
                ref="faceNames"
                type="text"
                size="small"
                class="operateBtn btn-modify"
                @click="handleFaceClick(scope.row)"
                style="width:72px; height:30px; margin-left:8px;"
                v-html="scope.row.imgtype === 2 ? '人脸录入':'查看人脸'"
              />
            </span>
            <el-button
              v-if="!isShowExcel"
              v-show="isShowHis"
              type="text"
              size="small"
              class="operateBtn btn-record"
              style="height:30px; width:52px; margin-left:8px;"
              @click="handleExchangeClick(scope.row)"
            >变更</el-button>
            <el-button
              v-if="!isShowExcel"
              type="text"
              size="small"
              class="operateBtn btn-record"
              @click="handleRecordClick(scope.row)"
              style="width:72px; height:30px; margin-left:8px; background:#cccccc !important;"
            >操作记录</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 展示Excel -->
      <div v-if="isShowExcel">
        <el-table
          empty-text="暂无数据"
          :data="excelData"
          row-class-name="myRow"
          cell-class-name="myCell"
          style="overflow-x:hidden;"
          class="excel-class"
          v-loading.fullscreen="loadingExcel1"
          element-loading-text="导入中，请耐心等待..."
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.8)"
        >
          <el-table-column :prop="prop[0]" label="姓名" min-width="85" />
          <el-table-column :prop="prop[1]" label="电话" min-width="110">
            <template slot-scope="scope">
              <p
                v-for="(item,index) in scope.row[2] ? scope.row[2] : scope.row.phone"
                :key="index"
              >{{item}}</p>
            </template>
          </el-table-column>
          <el-table-column :prop="prop[2]" label="房屋类型" min-width="65" />
          <el-table-column :prop="prop[3]" label="房屋编号" min-width="85" />
          <el-table-column :prop="prop[4]" label="房屋身份" min-width="85" />
          <el-table-column :prop="prop[5]" label="工作单位（选填)" min-width="120" />
          <el-table-column :prop="prop[6]" label="身份证号（选填)" min-width="120" />
          <el-table-column :prop="prop[7]" label="是否是党员（选填)" min-width="86" />
          <el-table-column :prop="prop[8]" label="备注" min-width="86" />
          <el-table-column v-if="prop.length===10" :prop="prop[9]" label="失败原因" min-width="85" />
        </el-table>
      </div>
      <!-- 历史住户 -->
    </el-card>
    <!-- 分页 -->
    <div v-if="!isShowExcel" class="block">
      <my-pages :pageInfo="pageInfo" @handleCurrentChange="handleCurrentChange" class="myfenye1"></my-pages>
      <!-- 添加住户弹框 -->
      <el-dialog
        title="添加住户"
        custom-class="myAddForm"
        class="position:fixed;top:10px;"
        :append-to-body="true"
        :visible.sync="dialogFormVisible"
        :close-on-click-modal="false"
      >
        <el-form ref="form" :model="addData" label-width="86px">
          <el-form-item label="房屋编号:">
            <el-input v-model="addData.housenumber" disabled />
          </el-form-item>
          <span class="tips" />
          <el-form-item label="住户姓名:">
            <el-input v-model="addData.name" />
          </el-form-item>
          <span ref="userToast1" class="tips">请输入住户姓名</span>
          <!-- 联系电话box -->
          <section v-for="(value, index) in contactData" :key="index">
            <!-- 联系电话加 -->
            <section v-if="index === 0">
              <el-form-item label="联系电话:" class="connect-class">
                <el-input v-model="contactData[index]" />
                <i class="el-icon-plus" @click="addlastitems(index)" />
              </el-form-item>
              <span :ref="`contactData${index}`" class="tips">请输入电话号码</span>
            </section>
            <!-- 联系电话减(添加的子项目) -->
            <section v-if="index > 0">
              <el-form-item label="联系电话:" class="connect-class">
                <el-input v-model="contactData[index]" />
                <i class="el-icon-close" @click="rmlastitems(index)" />
              </el-form-item>
              <span :ref="`contactData${index}`" class="tips">请输入电话号码</span>
            </section>
          </section>
          <!-- 身份证号 -->
          <el-form-item label="身份证号:">
            <el-input v-model="addData.identity" placeholder="选填" />
          </el-form-item>
          <span ref="identifyToast1" class="tips">请输入联系电话</span>
          <el-form-item label="工作单位:">
            <el-input v-model="addData.Workunit" placeholder="选填" />
          </el-form-item>
          <span ref="phoneNum" class="tips">请输入联系电话</span>
          <el-form-item label="选择类别:">
            <el-radio-group v-model="radio">
              <el-radio :label="1">房主</el-radio>
              <el-radio :label="2">家属</el-radio>
              <el-radio :label="3">租客</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="是否是党员:">
            <el-radio-group v-model="radio1">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="2">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <!-- 备注 -->
          <el-form-item label="备注:" style="height:100px !important;">
            <el-input v-model="addData.conet" style="resize:none;" type="textarea" />
          </el-form-item>

          <div
            class="addNow"
            @click="submitHandler"
            v-loading="loading2"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.8)"
          >确认添加</div>
        </el-form>
      </el-dialog>
      <!-- 修改住户弹框 -->
      <el-dialog
        title="修改住户"
        custom-class="myAddForm"
        class="position:fixed;top:10px;"
        :append-to-body="true"
        :visible.sync="dialogFormVisible2"
        :close-on-click-modal="false"
      >
        <el-form ref="form" :model="addData" label-width="100px">
          <el-form-item label="房屋编号:">
            <el-input v-model="modifyData.housenumber" disabled />
          </el-form-item>
          <span class="tips" />
          <el-form-item label="住户姓名:">
            <el-input v-model="modifyData.name" />
          </el-form-item>
          <span ref="userToast" class="tips" style="margin-left:100px">请输入住户姓名</span>
          <!-- 不会变动的联系电话 -->
          <!-- <el-form-item label="联系电话:">
          <el-input />
          </el-form-item>-->
          <!-- <span class="tips">请输入公司名称</span> -->
          <!-- 联系电话box -->
          <section v-for="(value, index) in contactData1" :key="index">
            <!-- 联系电话加 -->
            <section v-if="index === 0">
              <el-form-item label="联系电话:" class="connect-class">
                <el-input v-model="contactData1[index]" />
                <i class="el-icon-plus" @click="addlastitems1(index)" />
              </el-form-item>
              <span :ref="`contactData1${index}`" class="tips" style="margin-left:100px">请输入电话号码</span>
            </section>
            <!-- 联系电话减(添加的子项目) -->
            <section v-if="index > 0">
              <el-form-item label="联系电话:" class="connect-class">
                <el-input v-model="contactData1[index]" />
                <i class="el-icon-close" @click="rmlastitems1(index)" />
              </el-form-item>
              <span :ref="`contactData1${index}`" class="tips" style="margin-left:100px">请输入电话号码</span>
            </section>
          </section>
          <!-- 身份证号 -->
          <el-form-item label="身份证号:">
            <el-input v-model="modifyData.identity" placeholder="选填" />
          </el-form-item>
          <span ref="identifyToast2" class="tips" style="margin-left:100px" />
          <el-form-item label="工作单位:">
            <el-input v-model="modifyData.Workunit" placeholder="选填" />
          </el-form-item>
          <span ref="phoneNum" class="tips">请输入联系电话</span>
          <el-form-item label="选择类别:">
            <el-radio-group v-model="radio">
              <el-radio :label="1">房主</el-radio>
              <el-radio :label="2">家属</el-radio>
              <el-radio :label="3">租客</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="是否是党员:">
            <el-radio-group v-model="radio1">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="2">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <!-- 备注 -->
          <el-form-item label="备注:" style="height:100pxpx !important;">
            <el-input v-model="modifyData.conet" style="resize:none;" type="textarea" />
          </el-form-item>

          <div class="addNow" @click="modifyHandler">确认修改</div>
        </el-form>
      </el-dialog>
      <!-- 人脸录入 -->
      <el-dialog
        title="人脸录入"
        custom-class="myAddForm"
        :append-to-body="true"
        class="face-class"
        :visible.sync="fcDialogFormVisible"
        :close-on-click-modal="false"
      >
        <!-- 上传人脸照 -->
        <div class="upimg-class upimg-bottom">
          <span style="width:178px;position:absolute">上传人脸照:</span>
          <div class="up-img" style="left:80px;">
            <el-upload
              action="#"
              :limit="1"
              ref="upload"
              :on-remove="handleRemove1"
              :on-preview="handlePictureCardPreview"
              :on-change="handleChange1"
              list-type="picture-card"
              :auto-upload="false"
              :class="{hide:hideUpload1}"
            >
              <i slot="default" class="el-icon-plus" />
              <div slot="file" slot-scope="{file}">
                <img class="el-upload-list__item-thumbnail" :src="file.url" alt />
                <span class="el-upload-list__item-actions">
                  <span
                    class="el-upload-list__item-preview"
                    @click="handlePictureCardPreview(file)"
                  >
                    <i class="el-icon-zoom-in" />
                  </span>
                  <span class="el-upload-list__item-delete" @click="handleDownload(file)">
                    <i class="el-icon-download" />
                  </span>
                  <span class="el-upload-list__item-delete" @click="handleRemove(file)">
                    <i class="el-icon-delete" />
                  </span>
                </span>
              </div>
            </el-upload>
            <!-- 图片预览box下半部分 -->
            <el-dialog
              style="width:100%;background:#999;padding-top:90px;"
              :visible.sync="ImgDiaLog.add"
              title="详情"
              :modal="mod"
              :append-to-body="true"
              :fullscreen="true"
              :close-on-click-modal="false"
            >
              <img width="100%;height:100%;" :src="ImgDiaLog.addSrc" alt />
            </el-dialog>
          </div>
          <span ref="faceToast1" class="tips" style="top:0px;left:90px;">请上传人脸图片</span>
        </div>
        <button
          v-loading="loading"
          class="addNow"
          style="top:74%;"
          :disabled="isDisable"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.8)"
          @click="uploadFaceHandler"
        >确认上传</button>
      </el-dialog>

      <!-- 查看人脸 -->
      <el-dialog
        title="查看人脸"
        custom-class="myAddForm"
        :append-to-body="true"
        class="face-class face-class1"
        :visible.sync="fcDialogFormVisible1"
        :close-on-click-modal="false"
        :before-close="chakanClick"
      >
        <!-- 查看人脸上传人脸照 -->
        <div class="upimg-class upimg-bottom">
          <p class="reupload" style="font-size:14px;left:140px;">重新上传</p>
          <span style="position: absolute;">人脸照:</span>
          <div class="up-img" style="left:45px;">
            <el-upload
              :limit="2"
              action="#"
              :on-remove="handleRemove4"
              :on-preview="handlePictureCardPreview"
              :on-change="handleChange4"
              list-type="picture-card"
              :auto-upload="false"
              :file-list="temImgArr2"
            >
              <svg-icon icon-class="upload" />
              <div slot="file" slot-scope="{file}">
                <img class="el-upload-list__item-thumbnail" :src="file.url" alt />
              </div>
            </el-upload>
            <!-- 图片预览box下半部分 -->
            <el-dialog
              style="width:100%;background:#999;padding-top:90px;"
              :visible.sync="ImgDiaLog.add"
              title="详情"
              :modal="mod"
              :append-to-body="true"
              :fullscreen="true"
              :close-on-click-modal="false"
            >
              <img width="100%;height:100%;" :src="ImgDiaLog.addSrc" alt />
            </el-dialog>
          </div>
          <span ref="faceToast" class="tips" style="top:45px;margin-left:10px;left:48px;">请上传人脸图片</span>
        </div>
        <button
          v-loading="loading1"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.8)"
          class="addNow"
          :disabled="isDisable1"
          style="top:74%;"
          @click="onsubmitModify"
        >确认</button>
      </el-dialog>
    </div>
    <!-- 确认导入弹框 -->
    <el-dialog
      title="提示"
      :visible.sync="centerDialogVisible3"
      :append-to-body="true"
      center
      class="chen"
      :close-on-click-modal="false"
    >
      <!-- <p>提示</p> -->
      <div>确认导入以下住户?</div>
      <span slot="footer" class="dialog-footer">
        <el-button class="quxiao1" @click="centerDialogVisible3 = false">取 消</el-button>
        <el-button type="primary" @click="deleteQuerenHandler">确 认</el-button>
      </span>
    </el-dialog>
    <!-- 确认变更弹框 -->
    <el-dialog
      title="提示"
      :visible.sync="centerDialogVisible4"
      :append-to-body="true"
      center
      class="chen"
      :close-on-click-modal="false"
    >
      <div>{{biangengToast}}</div>
      <span slot="footer" class="dialog-footer">
        <el-button class="quxiao1" @click="centerDialogVisible4 = false">取 消</el-button>
        <el-button type="primary" @click="changeQuerenHandler">确 认</el-button>
      </span>
    </el-dialog>
    <!-- 查看详情弹框 -->
    <el-dialog
      title="查看详情"
      custom-class="myAddForm"
      :append-to-body="true"
      :visible.sync="dialogFormVisibleDetail"
      class="detaill-class"
      :close-on-click-modal="false"
    >
      <el-form ref="form" :model="detailData" label-width="100px">
        <el-form-item label="工作单位:">
          <el-input v-model="detailData.Workunit" disabled />
        </el-form-item>
        <span class="tips" />
        <el-form-item label="身份证号:">
          <el-input v-model="detailData.identity" disabled />
        </el-form-item>
        <span ref="identifyToast" class="tips" />
        <el-form-item label="是否是党员:">
          <el-radio-group v-model="radio2">
            <el-radio :label="1" disabled>是</el-radio>
            <el-radio :label="2" disabled>否</el-radio>
          </el-radio-group>
        </el-form-item>
        <span ref="dangToast" class="tips">请选择住户党员身份</span>
        <span class="tips" />
        <div class="addNow" @click="dialogFormVisibleDetail=false" style="width:72px;">确认</div>
      </el-form>
    </el-dialog>
    <!-- 操作记录弹框 -->
    <el-dialog
      title="操作记录"
      custom-class="myAddForm"
      :append-to-body="true"
      :visible.sync="dialogFormVisibleRecord"
      class="detaill-class"
      :close-on-click-modal="false"
    >
      <el-form ref="form" :model="recordData" label-width="118px">
        <el-form-item label="上次操作员:">
          <el-input v-model="recordData.uname" disabled />
        </el-form-item>
        <span class="tips" style="display: block;height:15px;" />
        <el-form-item label="上次操作时间:">
          <el-input v-model="recordData.time" disabled />
        </el-form-item>
        <span class="tips" style="display: block;height:15px;" />
        <el-form-item label="上次操作IP地址:">
          <el-input v-model="recordData.ip" disabled />
        </el-form-item>
        <span class="tips" style="display: block;height:15px;" />
        <div class="addNow" @click="dialogFormVisibleRecord=false" style="width:72px;">确认</div>
      </el-form>
    </el-dialog>
    <!-- 添加住户弹框1 -->
    <el-dialog
      title="添加住户"
      custom-class="myAddForm"
      class="position:fixed;top:10px;"
      :append-to-body="true"
      :visible.sync="dialogFormVisible8"
    >
      <el-form ref="form" :model="addData" label-width="100px">
        <el-form-item label="房屋编号:">
          <el-input v-model="addData.housenumber" disabled />
        </el-form-item>
        <span class="tips" />
        <el-form-item label="住户姓名:">
          <el-input v-model="addData.name" />
        </el-form-item>
        <span ref="userToast" class="tips" style="margin-left:100px">请输入住户姓名</span>
        <!-- 不会变动的联系电话 -->
        <!-- 联系电话box -->
        <section v-for="(value, index) in contactData2" :key="index">
          <!-- 联系电话加 -->
          <section v-if="index === 0">
            <el-form-item label="联系电话:" class="connect-class">
              <el-input v-model="contactData2[index]" />
              <i class="el-icon-plus" @click="addlastitems2(index)" />
            </el-form-item>
            <span :ref="`contactData2${index}`" class="tips" style="margin-left:100px">请输入正确的手机号码</span>
          </section>
          <!-- 联系电话减(添加的子项目) -->
          <section v-if="index > 0">
            <el-form-item label="联系电话:" class="connect-class">
              <el-input v-model="contactData2[index]" />
              <i class="el-icon-close" @click="rmlastitems2(index)" />
            </el-form-item>
            <span :ref="`contactData2${index}`" class="tips" style="margin-left:100px">请输入正确的手机号码</span>
          </section>
        </section>
        <!-- 身份证号 -->
        <el-form-item label="身份证号:">
          <el-input v-model="addData.identity" placeholder="选填" />
        </el-form-item>
        <span ref="identifyToast3" class="tips" style="margin-left:100px" />
        <el-form-item label="工作单位:">
          <el-input v-model="addData.Workunit" placeholder="选填" />
        </el-form-item>
        <span ref="phoneNum" class="tips">请输入联系电话</span>
        <el-form-item label="选择类别:">
          <el-radio-group v-model="radio">
            <el-radio :label="1">房主</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否是党员:">
          <el-radio-group v-model="radio1">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="2">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- 备注 -->
        <el-form-item label="备注:" style="height:100px !important;">
          <el-input v-model="addData.conet" style="resize:none;" type="textarea" />
        </el-form-item>
        <div class="addNow" @click="submitHandler1">下一步</div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios'
import { Message } from 'element-ui'
import { postDownLoad, postHouseholdSelect, postHouseholdInsert, postHouseExcel, postExcelImport, postFace, postHistory, postChange, postSelect, postUpdete, postFaces, postFace_select } from '@/api/residerInfo'
import { getInfo } from '@/utils/auth'
import { postDownLoad1 } from '@/api/House'
import { postSelect_button } from '@/api/Jurisdiction'
export default {
  name: 'ResidentInfo',
  props: ['houseid', 'housenumber'],
  // data数据
  data () {
    return {
      biangengToast:'',//变更提示语
      loadingExcel: false,//Excel的加载中
      loadingExcel1: false,//Excel的二次加载中
      isDisable1: false,
      isDisable: false,
      isRlDevice: true,
      hideUpload1: false,
      hideUpload: false,
      limitCount: 1,
      uploadIdenty: true,
      xiazai: true,
      isRepeatData: null,
      isRepeatData1: null,
      isRepeatData2: null,
      loading1: false,
      loading: false,
      loading2: false,
      temImgArr1: [], // 缩略
      temImgArr2: [],
      faceName: '人脸录入',
      isError: false,
      isShowExcel: false,
      isShowHis: true,
      excelData: [],
      dr_nameId: '', // 点击确认导入传给后台
      // prop:
      mod: false, // 不需要遮罩层
      fileLists: [], // 添加身份证
      fileLists1: [], // 添加人脸
      fileLists3: [],
      fileLists4: [],
      ImgDiaLog: { // 图片弹窗显示与否
        origin: false,
        originSrc: '',
        add: false,
        addSrc: '',
        modify: false,
        modifySrc: ''
      },
      totalPage: null, // 总条数
      listNum: 10,
      currentPage: 1, // 当前页数
      pageNums: null, // 总页数
      radio: null,
      radio1: null,
      radio2: null,
      contactData: [''],//添加
      contactData1: [''],//修改
      contactData2: [''],//当只有一个户主时
      rightConct: [],
      dialogFormVisible: false, // 添加住户dialog
      dialogFormVisible2: false,
      fcDialogFormVisible: false,
      fcDialogFormVisible1: false,
      centerDialogVisible3: false,
      centerDialogVisible4: false, // 变更
      dialogFormVisibleDetail: false,
      dialogFormVisibleRecord: false, // 操作记录
      dialogFormVisible8: false, // 第二个添加住户弹出框
      // 查询企业信息
      tableData: [
        // {
        //   id: 4, // 住户主键id
        //   username: '李梦莹', // 住户名字
        //   phone: '18981275447, 15183994119', // 住户电话
        //   Houseid: 1, // 房屋主键id
        //   Communityid: 15, // 小区id
        //   type: 1, // 1为户主2为家属3为租客
        //   time: '2019-04-15 10:55:58', // 添加修改时间
        //   state: 1, // 1为未对比2为已对比(app用户对比用)
        //   userid: null, // app用户id
        //   Workunit: null, // 工作单位
        //   identity: null, // 身份证号
        //   zt: 1, // 1为正常2为注销
        //   conet: null, // 备注
        //   dang: 2, // 1是党员2不是党员
        //   uname: null, // 操作人
        //   ip: null, // ip地址
        //   img: null, // 人脸图片
        //   picture: '', // 身份证图片
        //   housenumber: '1111' // 房屋编号
        // }
      ],
      changeQuery: {}, // 当只有一个住户时点击变更进入添加的页面点击下一步到是否变更住户接口需要的参数
      changeQuery1: {},
      addData: {
        housenumber: '', // 房屋编号
        name: '', // 住户姓名
        phone: '', // 住户电话
        identity: '', // 住户身份证号
        Workunit: '', // 住户工作单位
        type: '',
        dang: '',
        conet: ''
      },
      modifyData: {
        housenumber: '', // 房屋编号
        name: '', // 住户姓名
        phone: '', // 住户电话
        identity: '', // 住户身份证号
        Workunit: '', // 住户工作单位
        type: '',
        dang: '',
        conet: ''
      },
      detailData: {
        Workunit: '',
        identity: ''
      },
      recordData: {
        time: '',
        ip: '',
        uname: ''
      },
      userInfoData: {},
      userId: null,// 住户id
      //分页的信息
      pageInfo: {
        total: null,//总条数
        listRows: 10,//page-size
        page: 1,//当前页
      },
      biangengId: null,//变更的id
      fenyeType: 1,//1为普通分页，2为历史住户分页
      isShowFace: false,//按钮权限之人脸录入
      isShowAddZhuhu: false,//按钮权限之添加住户
      isShowDaoru: false,//按钮权限之导入住户
      isShowModify: false,//按钮权限之修改
      isShowMore: false,//按钮权限之更多
      isShowChange: false,//按钮权限之变更
      isShowRecord: false,//按钮权限之操作记录
      isShowLishi: false,//按钮权限之历史住户
      isShowXiazai: false,//按钮权限之下载住户模板
    }
  },
  created () {
    // 拉取用户信息
    this.userInfoData = JSON.parse(localStorage.getItem('userInfo'))
    const { Communityid, uid } = this.userInfoData
    const auth_id = 18
    //按钮权限控制
    postSelect_button({ Communityid, uid, auth_id }).then(resp => {
      if (resp.code === 200) {
        this.buttonLists = resp.data
        var btnList = this.buttonLists
        btnList.forEach(list => {
          if (list.auth_name === '人脸录入') {
            this.isShowFace = true
          }
          if (list.auth_name === '添加住户') {
            this.isShowAddZhuhu = true
          }
          if (list.auth_name === '导入住户') {
            this.isShowDaoru = true
          }
          if (list.auth_name === '修改') {
            this.isShowModify = true
          }
          if (list.auth_name === '更多') {
            this.isShowMore = true
          }
          if (list.auth_name === '变更') {
            this.isShowChange = true
          }
          if (list.auth_name === '操作记录') {
            this.isShowRecord = true
          }
          if (list.auth_name === '历史住户') {
            this.isShowLishi = true
          }
          if (list.auth_name === '下载住户模板') {
            this.isShowXiazai = true
          }
        })
      }
    })
    //查询列表
    this.getHouseuserLists()
  },
  methods: {
    // 请求渲染数据列表
    getHouseuserLists () {
      const { Communityid } = this.userInfoData
      const userHouseId = this.houseid
      const page = this.pageInfo.page
      postHouseholdSelect({ page, userHouseId, Communityid }).then(resp => {
        // console.log(resp.msg.data,'数据句句')
        if (resp.device === 1) {
          this.isRlDevice = true
        } else {
          this.isRlDevice = false
        }
        this.pageInfo.total = resp.msg.total
        this.pageInfo.page = Number(resp.msg.page)
        this.tableData = resp.msg.data
      })
    },
    // 事件EXCEL下载住户模板
    async clickDownLoad () {
      let res = await postDownLoad();
      if (res.code === 200) {
        postDownLoad1({ name: res.msg }).then(res => {
          let blob = new Blob([res], {
            type:
              "application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          });
          //console.log(blob);
          const fileName = "住户模板.xlsx";
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
    // 导入住户
    beforeUpload (file) {
      this.loadingExcel = true
      var fd = new window.FormData()
      fd.append('excel', file)
      postHouseExcel(fd).then(resp => {
    
        this.loadingExcel = false
        if (resp.code === 200) {
          var arr = resp.msg.data
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
         case 7:
 if(arr[i][1]||arr[i][2]||arr[i][3] || arr[i][4]||arr[i][5]||arr[i][6] ||arr[i][7]){
array.push(arr[i])
      }
      break;
         case 8:
   if(arr[i][1]||arr[i][2]||arr[i][3] || arr[i][4]||arr[i][5]||arr[i][6]||arr[i][7]||arr[i][8]){
array.push(arr[i])
      }
      break;
    default:
     if(arr[i][1]||arr[i][2]||arr[i][3] || arr[i][4]||arr[i][5]||arr[i][6] ||arr[i][7]||arr[i][8]||arr[i][9]){
array.push(arr[i])
      }
} 
          }
          array.forEach(item => {
            var newItem = item[2].toString()
            item[2] = newItem.split('/')
            // console.log(item[1])
            // if(item[1] && )
          })
          this.excelData = array
          this.dr_nameId = resp.msg.dr_nameId
          this.prop = ['1', '2', '3', '4', '5', '6', '7', '8', '9']
          this.isShowExcel = true
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
      })
    },
    // 导入住户返回上一级
    exitHandler () {
      this.isShowExcel = false
    },
    // 确认导入
    querenUpload () {
      this.centerDialogVisible3 = true
    },
    deleteQuerenHandler () {
      this.centerDialogVisible3 = false
      this.loadingExcel1 = true
      const { uname, Communityid } = this.userInfoData
      const dr_nameId = this.dr_nameId
      postExcelImport({ uname, Communityid, dr_nameId }).then(resp => {
        this.loadingExcel1 = false
        if (resp.code === 200) {
          if (resp.data.length > 0) {
            var arr = resp.data
            var i = 0
            var array = []
            for(i=0;i<arr.length;i++){
              if(arr[i]['username']||arr[i]['phone']||arr[i]['typename']||arr[i]['House']||arr[i]['type']||arr[i]['Workunit']||arr[i]['identity']||arr[i]['dang']||arr[i]['conet']){
                array.push(arr[i])
              }
            }
            array.forEach(item => {
              var newItem1 = item.phone.toString()
              item.phone = newItem1.split('/')
            })
            this.isError = true
            this.excelData = array
            this.prop = ['username', 'phone', 'typename', 'House', 'type', 'Workunit', 'identity', 'dang', 'conet', 'Reason']
          }
          if (resp.data.length === 0) {
            this.$message({
              message: '数据导入成功',
              type: 'success'
            })
            this.isShowExcel = false
          }

          this.getHouseuserLists()
        }
      })
    },
    // 提示: 您有数据未导入成功,请记录并修改后再次重新导入
    querenHandler () {
      this.isError = false
      this.isShowExcel = false
    },
    // 图片事件
    handleRemove (file, fileList) {
      this.fileLists = fileList
      this.hideUpload = fileList.length >= this.limitCount
    },
    handleRemove1 (file, fileList) {
      this.fileLists1 = fileList
      this.hideUpload1 = fileList.length >= this.limitCount
    },
    handleRemove4 (file, fileList) {
      this.fileLists4 = fileList
    },
    handlePictureCardPreview (file) {
      this.ImgDiaLog.addSrc = file.url
      this.ImgDiaLog.add = true // 添加预览
    },
    handleChange1 (file, fileList) {
      this.fileLists1 = file
      this.hideUpload1 = fileList.length >= this.limitCount
    },
    handleChange4 (file, fileList) {
      this.fileLists4 = file
      this.temImgArr2 = [{ url: fileList[1].url }]
    },
    //上传人脸和修改人脸请求接口
    askFace (formData) {
      postFace(formData).then(resp => {
        if (resp.code === 401) {
          this.loading = false
          this.loading1 = false
          if (this.fcDialogFormVisible1) {
            this.$refs.faceToast.style.color = 'red'
            setTimeout(() => {
              this.$refs.faceToast.style.color = ''
            }, 2000)
          } else {
            this.$refs.faceToast1.style.color = 'red'
            setTimeout(() => {
              this.$refs.faceToast1.style.color = ''
            }, 2000)
          }

        } else if (resp.code === 400) {
          //请录入人脸设备
          this.loading = false
          this.loading1 = false
          this.$message({
            message: resp.msg,
            type: 'warning'
          })
          this.fcDialogFormVisible = false
          this.fcDialogFormVisible1 = false
        } else if (resp.code === 200) {
          setTimeout(() => {
            postSelect(resp.msg).then(resp => {
              this.loading = false
              this.loading1 = false
              if (resp.code === 200) {
                this.fcDialogFormVisible = false
                this.fcDialogFormVisible1 = false
                this.$message({
                  message: resp.msg,
                  type: 'success'
                })
                this.getHouseuserLists()
              } else if (resp.code === 400) {
                this.fcDialogFormVisible = false
                this.fcDialogFormVisible1 = false
                this.$message({
                  message: resp.msg,
                  type: 'warning'
                })

              }
            })
          }, 5000)
        }
      })
    },
    // 确认上传人脸
    uploadFaceHandler () {
      this.loading = true
      const { Communityid, uname } = this.userInfoData
      const id = this.userId
      const formData = new FormData()
      formData.append('id', id)
      formData.append('Communityid', Communityid)
      formData.append('uname', uname)
      formData.append('img', this.fileLists1.raw)
      this.askFace(formData)
    },
    //分页设置
    handleCurrentChange (val) {
      this.pageInfo.page = val
      if (this.fenyeType === 1) {
        this.getHouseuserLists()
      } else {
        this.historyHandler()
      }
    },
    // 添加房屋里的添加联系电话
    addlastitems (index) {
      this.contactData.push('')
    },
    addlastitems1 (index) {
      this.contactData1.push('')
    },
    addlastitems2 (index) {
      this.contactData2.push('')
    },
    // 添加房屋里的删除联系电话
    rmlastitems (index) {
      this.contactData.splice(index, 1)
    },
    rmlastitems1 (index) {
      this.contactData1.splice(index, 1)
    },
    rmlastitems2 (index) {
      this.contactData2.splice(index, 1)
    },
    // 返回上一级
    exitBefore () {
      this.$emit('isShowHouse')
    },
    // 点击添加住户
    addUser () {
      // this.addData = {}
      this.addData.name = ''
      this.addData.housenumber = this.housenumber
      this.addData.identity = ''
      this.addData.Workunit = ''
      this.addData.type = ''
      this.addData.dang = ''
      this.addData.conet = ''
      this.radio1 = 2
      this.radio = 1
      this.rightConct = []
      this.contactData = ['']
      this.dialogFormVisible = !this.dialogFormVisible
    },
    // 点击修改
    handleModifyClick (row) {
      this.dialogFormVisible2 = true
      this.modifyData.name = row.username
      this.modifyData.phone = row.phone
      this.modifyData.identity = row.identity
      this.modifyData.Workunit = row.Workunit
      this.modifyData.conet = row.conet
      this.modifyData.type = row.type
      this.modifyData.dang = row.dang
      // 手机号码的渲染
      this.contactData1 = row.phone.split(',')
      this.modifyData.housenumber = this.housenumber
      this.radio = row.type
      this.radio1 = row.dang
      this.userId = row.id
    },
    // 修改
    modifyHandler () {
      if (this.modifyData.name === '') {
        this.$refs.userToast.style.color = 'red'
        setTimeout(() => {
          this.$refs.userToast.style.color = ''
        }, 2000)
      } else {
        // 循环验证
        this.contactData1.forEach((item, index) => {
          if (index) {
            // 如果为添加的项目，则为空时不提示，有内容且填错才提示
            if (item === '') {
              this.$refs[`contactData1${index}`][0].style.color = ''
            } else {
              if ((/^1[3456789]\d{9}$/.test(item))) {
                this.$refs[`contactData1${index}`][0].style.color = ''
              } else {
                this.$refs[`contactData1${index}`][0].innerHTML = '请输入正确的电话号码'
                this.$refs[`contactData1${index}`][0].style.color = 'red'
                setTimeout(() => {
                  this.$refs[`contactData1${index}`][0].style.color = ''
                }, 2000)
              }
            }
          } else {
            // 如果为第一项
            if (item === '') {
              this.$refs[`contactData1${index}`][0].style.color = 'red'
              setTimeout(() => {
                this.$refs[`contactData1${index}`][0].style.color = ''
              }, 2000)
            } else {
              if ((/^1[3456789]\d{9}$/.test(item))) {
                this.$refs[`contactData1${index}`][0].style.color = ''
              } else {
                this.$refs[`contactData1${index}`][0].style.color = 'red'
                this.$refs[`contactData1${index}`][0].innerHTML = '请输入正确的电话号码'
                setTimeout(() => {
                  this.$refs[`contactData1${index}`][0].style.color = ''
                }, 2000)
              }
            }
          }
        })
      }
      // 数组去重
      const cc6 = this.checkIdentify1(this.modifyData.identity)
      const cc = this.distinct(this.contactData1)
      const cc3 = this.contactData1.filter(this.filterConcat)
      this.isRepeat2(cc3)
      const cc2 = cc3.every(this.checkContact)
      const cc1 = cc.filter(this.checkContact)
      const phone = cc1.join(',')
      if (cc6 && cc2 && this.isRepeat1(cc3) && this.isRepeat1(this.contactData1) && this.isRepeatData1 === null) {
        const type = this.radio
        const dang = this.radio1
        const { uname } = this.userInfoData
        const { name, identity, Workunit, conet } = this.modifyData
        const id = this.userId
        postUpdete({ id, uname, name, phone, identity, Workunit, conet, type, dang }).then(resp => {
          const page = this.currentPage
          const { Communityid } = this.userInfoData
          const Houseid = this.houseid
          if (resp.code === 200) {
            this.$message({
              message: resp.msg,
              type: 'success'
            })
            this.getHouseuserLists()
            this.dialogFormVisible2 = false
          } else if (resp.code === 400) {
            this.$message({
              message: resp.msg,
              type: "warning"
            })
            this.dialogFormVisible2 = false
          }
        })
      }
    },
    //身份证正则验证
    //添加时
    checkIdentify (item) {
      if (item) {
        if ((/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(item))) {
          return item
        } else {
          this.$refs.identifyToast1.innerHTML = '请输入正确的身份证'
          setTimeout(() => {
            this.$refs.identifyToast1.innerHTML = ''
          }, 2000)
          this.$refs.identifyToast1.style.color = 'red'
        }
      } else {
        return true
      }
    },
    //修改
    checkIdentify1 (item) {
      if (item) {
        if ((/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(item))) {
          return item
        } else {
          this.$refs.identifyToast2.innerHTML = '请输入正确的身份证'
          setTimeout(() => {
            this.$refs.identifyToast2.innerHTML = ''
          }, 2000)
          this.$refs.identifyToast2.style.color = 'red'
        }
      } else {
        return true
      }
    },
    //当只有一个户主时
    checkIdentify2 (item) {
      if (item) {
        if ((/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(item))) {
          return item
        } else {
          this.$refs.identifyToast3.innerHTML = '请输入正确的身份证'
          setTimeout(() => {
            this.$refs.identifyToast3.innerHTML = ''
          }, 2000)
          this.$refs.identifyToast3.style.color = 'red'
        }
      } else {
        return true
      }
    },
    // 电话号码正则验证
    checkContact (item) {
      if ((/^1[3456789]\d{9}$/.test(item))) {
        return item
      }
    },
    // 空电话号码赛选
    filterConcat (item) {
      if (item === '') {
        return
      } else {
        return item
      }
    },
    isRepeat (arr) {
      this.isRepeatData = null
      var hash = {}
      for (let i = 0; i < arr.length; i++) {
        if (typeof hash[arr[i]] === 'undefined') {
          hash[arr[i]] = i
        } else {
          this.isRepeatData = 1
          console.log(hash, i, 'hash')
          this.$refs[`contactData${i}`][0].innerHTML = '该号码与以上号码重复，请重新填写'
          setTimeout(() => {
            this.$refs[`contactData${i}`][0].innerHTML = ''
          }, 2000)
          this.$refs[`contactData${i}`][0].style.color = 'red'
        }
      }
    },
    // 检测数组重复项
    isRepeat1 (arr) {
      const nArr = arr.slice().sort()
      for (let i = 0; i < arr.length; i++) {
        if (nArr[i] === nArr[i + 1]) {
          return false
        } else {
          return true
        }
      }
    },
    // 修改时的isRepeat
    isRepeat2 (arr) {
      this.isRepeatData1 = null
      var hash = {}
      for (let i = 0; i < arr.length; i++) {
        if (typeof hash[arr[i]] === 'undefined') {
          hash[arr[i]] = i
        } else {
          this.isRepeatData1 = 1
          this.$refs[`contactData1${i}`][0].innerHTML = '该号码与以上号码重复，请重新填写'
          setTimeout(() => {
            this.$refs[`contactData1${i}`][0].innerHTML = ''
          }, 2000)
          this.$refs[`contactData1${i}`][0].style.color = 'red'
        }
      }
    },
    // 当只有一个房主时的isRepeat
    isRepeat3 (arr) {
      this.isRepeatData2 = null
      var hash = {}
      for (let i = 0; i < arr.length; i++) {
        if (typeof hash[arr[i]] === 'undefined') {
          hash[arr[i]] = i
        } else {
          this.isRepeatData2 = 1
          this.$refs[`contactData2${i}`][0].innerHTML = '该号码与以上号码重复，请重新填写'
          setTimeout(() => {
            this.$refs[`contactData2${i}`][0].innerHTML = ''
          }, 2000)
          this.$refs[`contactData2${i}`][0].style.color = 'red'
        }
      }
      console.log('进入repeat3')
    },
    // 点击查看详情
    handleDetailClick (row) {
      this.detailData.Workunit = row.Workunit
      this.detailData.identity = row.identity
      this.dialogFormVisibleDetail = true
      this.radio2 = row.dang
    },
    // 点击人脸录入或者查看人脸
    handleFaceClick (row) {
      console.log(row, 'row')
      const { Communityid } = this.userInfoData
      postFace_select({ id: row.id, Communityid }).then(resp => {
        console.log(resp, 'oooo')
        if (resp.code === 200) {
          if (row.imgtype === 2) {
            this.file = ''
            this.userId = row.id
            this.fcDialogFormVisible = true
            this.fileLists1 = []
            this.fileLists = []
            this.$refs.upload.clearFiles()
            this.hideUpload = false
            this.hideUpload1 = false
            this.loading = false
          } else {
            //查看
            this.userId = row.id
            this.fcDialogFormVisible1 = true
            const img = row.img
            const picture = row.img
            this.temImgArr1 = [{ url: picture }]
            this.temImgArr2 = [{ url: img }]
            this.fileLists3 = []
            this.fileLists4 = []
            this.loading1 = false
          }
        } else if (resp.code === 400) {
          this.$message({
            message: resp.msg,
            type: 'warning'
          })
        }
      })
    },
    //修改人脸
    onsubmitModify () {
      if (!this.fileLists4.raw) {
        this.fcDialogFormVisible1 = false
      } else {
        this.loading1 = true
        const { Communityid, uname } = this.userInfoData
        const id = this.userId
        const formData = new FormData()
        formData.append('id', id)
        formData.append('Communityid', Communityid)
        formData.append('uname', uname)
        formData.append('img', this.fileLists4.raw)
        this.isDisable1 = false
        this.askFace(formData)
      }
    },
    chakanClick () {
      this.isDisable1 = false
      this.fcDialogFormVisible1 = false
    },
    // 点击变更
    handleExchangeClick (row) {
      this.biangengId = row.id
      if (row.count === 1 && row.type === 1) {
        this.biangengToast = '变更后将从此房屋移除所有人，是否变更'
        this.addData.name = ''
        this.addData.housenumber = this.housenumber
        this.addData.identity = ''
        this.addData.Workunit = ''
        this.addData.type = ''
        this.addData.dang = ''
        this.addData.conet = ''
        this.rightConct = []
        this.contactData2 = ['']
        this.dialogFormVisible8 = true
        this.radio = 1
        this.radio1 = 2
        this.addData.housenumber = this.housenumber
      } else {
        this.biangengToast = '变更后将从此房屋移除此人，是否变更'
        this.centerDialogVisible4 = true
      }
    },
    //确认变更
    changeQuerenHandler () {
      this.xiazai = false
      const { userHouseId, name, identity, Workunit, conet, dang, type, phone } = this.changeQuery1
      const { Communityid, uname } = this.userInfoData
      const id = this.biangengId
      postChange({ id, uname, phone, Workunit, identity, type, dang, conet, Communityid, name, userHouseId }).then(resp => {
        if (resp.code === 200) {
          this.centerDialogVisible4 = false
          this.$message({
            message: resp.msg,
            type: 'success'
          })
          this.historyHandler()
        } else {
          this.$message({
            message: resp.msg,
            type: 'warning'
          })
          this.centerDialogVisible4 = false
        }
      })
    },
    //点击历史住户
    historyHandler () {
      const { Communityid } = this.userInfoData
      const userHouseId = this.houseid
      const page = this.pageInfo.page
      postHistory({ Communityid, userHouseId, page }).then(resp => {
        if (!resp.msg.data.length) {
          this.$message({
            message: '没有历史住户',
            type: 'warning'
          })
        } else {
          this.fenyeType = 2
          this.xiazai = false
          this.isShowHis = false
          this.pageInfo.total = resp.msg.total
          this.pageInfo.page = Number(resp.msg.page)
          this.tableData = resp.msg.data
        }
      })
    },
    //历史住户点击返回上一级
    exitHisHandler () {
      this.fenyeType = 1
      this.xiazai = true
      this.getHouseuserLists()
      this.isShowHis = true
    },
    // 点击操作记录
    handleRecordClick (row) {
      this.recordData.ip = row.ip
      this.recordData.time = row.time
      this.recordData.uname = row.uname
      this.dialogFormVisibleRecord = true
    },
    // 数组去重
    distinct (arr) {
      return Array.from(new Set(arr))
    },
    // 点击添加房屋弹框的确认添加
    submitHandler () {
      if (this.addData.name === '') {
        //对住户姓名的验证
        this.$refs.userToast1.style.color = 'red'
        setTimeout(() => {
          this.$refs.userToast1.style.color = ''
        }, 2000)
      } else {
        // 循环验证
        this.contactData.forEach((item, index) => {
          if (index) {
            // 如果为添加的项目，则为空时不提示，有内容且填错才提示
            if (item === '') {
              this.$refs[`contactData${index}`][0].style.color = ''
            } else {
              if ((/^1[3456789]\d{9}$/.test(item))) {
                this.$refs[`contactData${index}`][0].style.color = ''
              } else {
                this.$refs[`contactData${index}`][0].innerHTML = '请输入正确的电话号码'
                this.$refs[`contactData${index}`][0].style.color = 'red'
                setTimeout(() => {
                  this.$refs[`contactData${index}`][0].style.color = ''
                }, 2000)
              }
            }
          } else {
            // 如果为第一项
            if (item === '') {
              this.$refs[`contactData${index}`][0].style.color = 'red'
              setTimeout(() => {
                this.$refs[`contactData${index}`][0].style.color = ''
              }, 2000)
            } else {
              if ((/^1[3456789]\d{9}$/.test(item))) {
                this.$refs[`contactData${index}`][0].style.color = ''
              } else {
                this.$refs[`contactData${index}`][0].style.color = 'red'
                this.$refs[`contactData${index}`][0].innerHTML = '请输入正确的电话号码'
                setTimeout(() => {
                  this.$refs[`contactData${index}`][0].style.color = ''
                }, 2000)
              }
            }
          }
        })
      }
      const cc6 = this.checkIdentify(this.addData.identity)
      const cc3 = this.contactData.filter(this.filterConcat)
      this.isRepeat(cc3)
      const cc = this.distinct(this.contactData)
      const cc2 = cc3.every(this.checkContact)
      const cc1 = cc.filter(this.checkContact)
      const phone = cc1.join(',')
      const type = this.radio
      const dang = this.radio1
      const { Communityid, uname } = this.userInfoData
      const userHouseId = this.houseid
      const { name, identity, Workunit, conet } = this.addData
      if (cc2 && cc6 && this.isRepeat1(cc3) && this.isRepeat1(this.contactData) && this.isRepeatData === null) {
        this.loading2 = true
        postHouseholdInsert({ Communityid, userHouseId, uname, name, identity, Workunit, conet, dang, type, phone }).then(resp => {
          this.loading2 = false
          if (resp.code === 200) {
            this.$message({
              message: resp.msg,
              type: "success"
            })
            this.dialogFormVisible = false
            const nume = Number(this.totalPage) / Number(10)
            var shu = ''
            if (Math.round(nume) === nume) {
              // num是整数
              shu = Number(nume) + Number(1)
            } else {
              shu = Math.ceil(nume)
            }
            const page = shu
            this.handleCurrentChange(shu)
          } else if (resp.code === 403) {
            this.$refs.typeToast.style.color = 'red'
            setTimeout(() => {
              this.$refs.typeToast.style.color = ''
            }, 2000)
          } else if (resp.code === 404) {
            this.$refs.dangToast.style.color = 'red'
            setTimeout(() => {
              this.$refs.dangToast.style.color = ''
            }, 2000)
          } else if (resp.code === 405) {
            Message(resp.msg)
          } else if (resp.code === 401) {
            this.$refs.userToast.style.color = 'red'
          } else if (resp.code === 406) {
            Message(resp.msg)
            this.dialogFormVisible = false
          } else if (resp.code === 400) {
            this.$message({
              message: resp.msg,
              type: 'warning'
            })
          }
        })
      }
    },
    //当只有一个户主的时候，弹出添加弹框，点击下一步
    submitHandler1 () {
      if (this.addData.name === '') {
        this.$refs.userToast.style.color = 'red'
        setTimeout(() => {
          this.$refs.userToast.style.color = ''
        }, 2000)
      } else {
        // 循环验证
        this.contactData2.forEach((item, index) => {
          if (index) {
            // 如果为添加的项目，则为空时不提示，有内容且填错才提示
            if (item === '') {
              this.$refs[`contactData2${index}`][0].style.color = ''
            } else {
              if ((/^1[3456789]\d{9}$/.test(item))) {
                this.$refs[`contactData2${index}`][0].style.color = ''
              } else {
                this.$refs[`contactData2${index}`][0].innerHTML = '请输入正确的电话号码'
                this.$refs[`contactData2${index}`][0].style.color = 'red'
                setTimeout(() => {
                  this.$refs[`contactData2${index}`][0].style.color = ''
                }, 2000)
              }
            }
          } else {
            // 如果为第一项
            if (item === '') {
              this.$refs[`contactData2${index}`][0].style.color = 'red'
              setTimeout(() => {
                this.$refs[`contactData2${index}`][0].style.color = ''
              }, 2000)
            } else {
              if ((/^1[3456789]\d{9}$/.test(item))) {
                this.$refs[`contactData2${index}`][0].style.color = ''
              } else {
                this.$refs[`contactData2${index}`][0].style.color = 'red'
                this.$refs[`contactData2${index}`][0].innerHTML = '请输入正确的电话号码'
                setTimeout(() => {
                  this.$refs[`contactData2${index}`][0].style.color = ''
                }, 2000)
              }
            }
          }
        })
      }
      console.log(this.contactData2, 'this.contactData2')
      const cc6 = this.checkIdentify2(this.addData.identity)
      const cc = this.distinct(this.contactData2)
      const cc3 = this.contactData2.filter(this.filterConcat)
      this.isRepeat3(cc3)
      const cc2 = cc3.every(this.checkContact)
      const cc1 = cc.filter(this.checkContact)
      const phone = cc1.join(',')
      const type = this.radio
      const dang = this.radio1
      const userHouseId = this.houseid
      const { name, identity, Workunit, conet } = this.addData
      this.changeQuery1 = { userHouseId, name, identity, Workunit, conet, dang, type, phone }
      // console.log(cc6, cc2, this.isRepeat1(cc3), this.isRepeat3(this.contactData2), '验证')
      if (cc6 && cc2 && this.isRepeat1(cc3) && this.isRepeat1(this.contactData2)) {
        this.dialogFormVisible8 = false
        this.centerDialogVisible4 = true
      }
    }
  }
}
</script>
<style lang="scss" scoped>
/deep/.myRow {
  height: 30px;
  padding: 0;
}
/deep/.myRow > td {
  padding: 15px 0 !important;
}
/deep/.myCell {
  border-collapse: collapse;
  .cell {
    // white-space: nowrap !important;
  }
}
/deep/.el-card__body {
  padding: 0 !important;
}
/deep/.infor-warp {
  height: 500px;
  background-color: green;
}

.operateBtn {
  color: #fff;
  display: inline-block;
  border-radius: 4px;
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
  background-color: #bfbfbf;
}
.btn-record {
  background-color: #bfbfbf;
}
/deep/.note {
  width: 150px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

/deep/.up-img {
  z-index: 999;
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
  border: none;
  outline: none;
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
  width: 24.43%;
  height: 607px;
  background-color: #fff;
  .el-dialog__header {
    height: 43px;
    padding: 12px 0 10px 16px;
    border-bottom: 1px solid #eff2f5;
    .el-dialog__title {
      cursor: default;
      position: absolute;
      top: 0;
      left: 20px;
      line-height: 44px;
      font-size: 16px;
      color: #333;
      font-weight: 400;
    }
    button {
      position: absolute;
      top: 12px;
    }
    .el-dialog__headerbtn .el-dialog__close {
      width: 16px;
      height: 16px;
      color: #333;
      top: 12px;
      right: 21px;
      font-size: 16px;
      &:hover {
        color: #5fafe4;
      }
    }
  }
}

.tips {
  color: #fff;
  position: relative;
  font-size: 14px;
  top: -5px;
  margin-left: 85px;
  display: block;
  height: 20px;
  width: 111%;
}
.text-waring {
  color: #f44;
}
/deep/ .el-dialog__body {
  padding: 24px 50px 0 48px !important;
  height: 490px;
  overflow-x: hidden;
  .el-form {
    .el-form-item {
      height: 32px !important;
      margin: 0 0 5px 0;
      .el-form-item__label {
        padding-right: 12px;
        text-align: left;
        height: 32px;
        line-height: 32px;
        color: #666666;
      }
      .el-form-item__content {
        line-height: 32px;
        height: 32px;
        .el-input {
          height: 32px;
          border: 1px solid #d2d2d2;
          border-radius: 4px;
          .el-input__inner {
            padding: 8px;
            cursor: default;
            height: 28px !important;
            color: #333;
            width: 95% !important;
          }
        }
        .el-textarea {
          height: 100px;
          width: 93%;
          .el-textarea__inner {
            padding: 6px 8px;
            height: 100% !important;
            width: 107% !important;
            color: #333;
            border: 1px solid #d2d2d2;
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
/deep/.myRecordForm {
  height: 300px;
  top: 50% !important;
  margin-top: -150px !important;
  /deep/.el-dialog__header {
    position: relative;
    padding: 12px 0 10px 16px !important;
    border-bottom: 1px solid rgb(207, 201, 201);
    .el-dialog__title {
      font-size: 16px;
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
          width: 86px !important;
          text-align: left !important;
        }
        .el-form-item__content {
          .el-input {
            height: 31px;
            padding-left: 5px;
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
//添加工商执照预览图片
/deep/.el-dialog.is-fullscreen {
  width: 800px !important;
}
//点击工商执照出现的大图
/deep/.myLiscencePre {
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
  // position: relative;
  border: none;
  width: 100%;
  min-height: 710px !important;
  margin-bottom: 10px;
  min-width: 1000px;
}
#enterprise-info {
  min-height: 730px;
  height: 760px;
  // position: relative;
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
.clearfix {
  width: 100%;
  height: 30px;
  margin-bottom: 12px;
  .box-right {
    box-sizing: border-box;
    height: 30px;
    .add-btn1 {
      cursor: pointer;
      background-color: #25bad9;
      color: #fff;
      font-size: 14px;
      position: absolute;
      height: 30px;
      padding: 5px 8px 6px 8px;
      border-radius: 4px;
      box-sizing: border-box;
    }
  }
  .box-header-right {
    float: left;
    display: flex;
    justify-content: space-around;

    .add-btn {
      cursor: pointer;
      background-color: #25bad9;
      border: 1px solid #25bad9;
      color: #fff;
      height: 30px;
      text-align: center;
      font-size: 14px;
      width: 86px;
      padding: 0;
      border-radius: 4px;
      line-height: 28px;
      box-sizing: border-box;
    }
    .add-btn2 {
      background-color: #1fbba6ff;
      margin: 0 8px;
    }
  }
  .box-header-left {
    float: right;
    cursor: pointer;
    background-color: #66cfe4;
    color: #fff;
    height: 30px;
    line-height: 30px;
    font-size: 14px;
    padding: 0 8px;
    border-radius: 4px;
    box-sizing: border-box;
  }
}
.connect-class {
  position: relative;
  // background-color: #f00;
  .el-icon-plus {
    position: absolute;
    cursor: pointer;
    top: 9px;
    right: -20px;
    // background-color: green;
  }
  .el-icon-close {
    position: absolute;
    cursor: pointer;
    top: 9px;
    right: -20px;
  }
}
// 分页样式
//分页器的样式
//分页器的样式
.block {
  .record-data {
    cursor: default;
    display: inline-block;
    line-height: 18px;
    margin-top: 16px;
    position: absolute;
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
  }
  // position: relative;
  // top: -51px;
  height: 40px;
  width: 100%;
  .el-pagination {
    position: absolute;
    bottom: 0px;
    right: 69px;
    /deep/button {
      min-width: 24px !important;
      height: 24px;
      cursor: default;
    }
    /deep/.el-pagination__jump {
      position: relative;
      margin-left: 0px;
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
        width: 38px;
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
          margin-left: 48px;
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
          margin-left: 2px;
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
    height: 24px;
    line-height: 24px;
  }
}
.face-class {
  // background-color: #f00;
  /deep/.el-dialog {
    width: 230px;
    height: 204px !important;
    // min-width: 230px !important;
    .el-dialog__body {
      padding: 20px;
      box-sizing: border-box;
    }
  }
}
/deep/.up-img {
  //width: 60px;
  z-index: 999;
  height: 60px;
  margin-left: 12px;
  overflow: hidden;

  .el-icon-plus {
    position: absolute;
    left: 15px;
    top: 15px;
  }
  .el-upload--picture-card {
    position: relative;
    // margin-left: 12px;
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
.upimg-class {
  display: flex;
  position: relative;
  margin-top: 26px;
  height: 54px;
}
.load-class {
  cursor: pointer;
  color: #25bad9;
  position: absolute;
  font-size: 12px;
  right: 0;
  top: -45px;
}
.excel-class {
  /deep/.el-table__body-wrapper {
    height: 100% !important;
    overflow-x: hidden !important;
  }
}
//确认导入弹框
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
    border-radius: 5px;
    width: 18.23%;
    height: 210px;
    .el-dialog__header {
      padding: 12px 0 10px 16px;
      text-align: left;
      border-bottom: 1px solid #eff2f5;
      font-size: 16px;
      height: 47px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: rgba(51, 51, 51, 1);
      .el-dialog__title {
        text-align: left;
        font-size: 16px;
        line-height: 48px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: rgba(51, 51, 51, 1);
      }

      button {
        position: absolute;
        top: 14px;
      }
    }
    .el-dialog--center {
      text-align: left;
    }
    .el-dialog__body {
      background-color: #fff;
      width: 100%;
      padding: 48px 0 50px 0 !important;
      position: relative;
      height: 0;
      overflow-y: hidden;
      div {
        width: 100%;
        height: 110px;
        font-size: 16px;
        text-align: center;
      }
    }
    .el-dialog__footer {
      position: absolute;
      top: 147px;
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
.detaill-class {
  /deep/.el-dialog {
    height: 287px;
    width: 24.43%;
    min-width: 380px;
    // background: #f00;
    .el-input__inner {
      color: #666;
    }
  }
}
.face-class1 {
  // background: #f00;
  /deep/ .el-upload-list__item-delete {
    display: none !important;
  }
  .reupload {
    color: #5fafe4ff;
    position: absolute;
    top: 0px;
    left: 169px;
    font-size: 16px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: rgba(95, 175, 228, 1);
  }
  .reupload1 {
    color: #5fafe4ff;
    position: absolute;
    top: 0px;
    left: 219px;
    font-size: 16px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: rgba(95, 175, 228, 1);
  }
  /deep/.el-upload--picture-card {
    background-color: rgba(0, 0, 0, 0);
    border: none;
    width: 100px !important;
    position: relative;
    .svg-icon {
      color: #5fafe4ff;
      position: absolute;
      top: 16px;
      left: 80px;
      font-size: 18px;
    }
  }
  /deep/.el-upload-list {
    // background-color: #f00 !important;
    position: relative;
  }
}
/deep/.el-upload-list__item {
  transition: none !important;
}

/deep/.hide .el-upload--picture-card {
  display: none !important;
}
/deep/.el-radio__label {
  cursor: default !important;
}
/deep/.el-radio__input.is-disabled .el-radio__inner {
  cursor: default !important;
}
/deep/.el-radio__original {
  cursor: default !important;
  z-index: 12;
}
/deep/.myfenye1 {
  top: 0px !important;
  height: 38px !important;
  .record-data {
    left: 0px;
    margin-top: 0px !important;
  }
  .el-pagination {
    right: 67px;
    bottom: 10px !important;
  }
}
/deep/.el-radio__input.is-checked + .el-radio__label {
  color: #666 !important;
}
// .phone-class {
//   width: 96px;
//   height: 50px;
//   word-wrap: break-word !important;
//   // line-height: 22px;
// }
// /deep/ .el-upload-list {
//   display: none !important;
// }
/deep/.el-loading-spinner {
  top: 62%;
}
/deep/.el-radio__input.is-checked .el-radio__inner {
  background: #409eff !important;
  color: red;
  &:after {
    color: #fff;
    background: #fff;
  }
}
</style>
