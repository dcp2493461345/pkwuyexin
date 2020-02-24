<template>
  <div class="hard-setparamClass">
    <div class="setparam-container">
      <span @click="Eclipse" class="download" v-show="moban" v-if="!isShowExcel">下载车位模板</span>
      <div class="box-header" v-show="isShowExcel">
        <span v-if="!isError" v-show="isShowExcel" class="add-btn" @click="backToLastPage">返回上一级</span>
        <span
          v-if="!isError"
          v-show="isShowExcel"
          class="add-btn2"
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
      </div>
      <el-card class="box-card" v-if="!isShowExcel">
        <!-- 查询 -->
        <div class="kuang">
          <span>
            <el-button
              v-if="addcar1"
              v-show="tianjia"
              class="newadd"
              type="text"
              @click="addor"
            >新增车位</el-button>
          </span>
          <span>
            <el-button v-if="back" class="newaddcp" type="text" @click="clear">返回上一级</el-button>
          </span>
          <span>
            <el-button v-show="!tianjia" class="newaddcp" type="text" @click="clear1">返回上一级</el-button>
          </span>

          <el-button
            v-if="daoru1"
            v-show="tianjia"
            size="small"
            type="text"
            @click="daoruchew"
            class="add-btn1"
          >导入车位</el-button>
          <div>
            <span v-if="!isShowExcel ">
              <input
                v-if="!back"
                class="search"
                @keyup.enter="search"
                v-model="orderNo"
                placeholder="请输入搜索内容"
              />
            </span>
            <!-- 清除按钮和查询按钮 -->
            <span class="btn" v-if="!isShowExcel" v-show="!back " @click="search">
              <svg-icon icon-class="search1" />
            </span>
          </div>
        </div>
        <!-- 车位列表 -->
        <el-table v-if="!isShowExcel" :data="tableData" style="width: 100%" empty-text="暂无数据">
          <el-table-column prop="floor" label="楼层" min-width="100">
            <template slot-scope="scope">
              <span>{{scope.row.floor===1?"1层":'' }}</span>
              <span>{{scope.row.floor===2?"2层":'' }}</span>
              <span>{{scope.row.floor===3?"3层":'' }}</span>
              <span>{{scope.row.floor===4?"4层":'' }}</span>
              <span>{{scope.row.floor===5?"6层":'' }}</span>
              <span>{{scope.row.floor===7?"7层":'' }}</span>
              <span>{{scope.row.floor===8?"8层":'' }}</span>
              <span>{{scope.row.floor===9?"9层":'' }}</span>
              <span>{{scope.row.floor===10?"10层":'' }}</span>
              <span>{{scope.row.floor===-1?"负1层":'' }}</span>
              <span>{{scope.row.floor===-2?"负2层":'' }}</span>
              <span>{{scope.row.floor===-3?"负3层":'' }}</span>
              <span>{{scope.row.floor===-4?"负4层":'' }}</span>
              <span>{{scope.row.floor===-5?"负5层":'' }}</span>
              <span>{{scope.row.floor===-6?"负6层":'' }}</span>
              <span>{{scope.row.floor===-7?"负7层":'' }}</span>
              <span>{{scope.row.floor===-8?"负8层":'' }}</span>
              <span>{{scope.row.floor===-9?"负9层":'' }}</span>
              <span>{{scope.row.floor===-10?"负10层":'' }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="car_number" label="车位号" min-width="150" />
          <el-table-column prop="car_type_name" label="车位类型" min-width="150" />
          <el-table-column prop="car_price" label="长租车月租(元)" min-width="150" />
          <el-table-column prop="state" label="车位状态" width="150">
            <template slot-scope="scope">
              <span :class="{active:scope.row.state===1}">{{scope.row.state===1?"未售":'' }}</span>
              <span>{{scope.row.state===2?"已售":'' }}</span>
              <span :class="{actived:scope.row.state===3}">{{scope.row.state===3?"已出租":'' }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="Longplate" label="长租车牌号" min-width="150"></el-table-column>
          <el-table-column prop="car_house_number" label="关联房屋" min-width="150" class="remark"></el-table-column>
          <el-table-column prop="name" label="联系人" min-width="150" class="remark"></el-table-column>
          <el-table-column prop="phone" label="联系电话" min-width="150" class="remark"></el-table-column>
          <el-table-column prop="centons" label="车位备注" min-width="150" class="remark"></el-table-column>
          <el-table-column label="操作" min-width="150">
            <template slot-scope="scope">
              <el-button v-if="xiugai" class="el-btn11" type="text" @click="compile(scope.row)">修改</el-button>
              <el-button v-if="caozuo" class="el-btn44" type="text" @click="handle(scope.row)">操作记录</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
      <!-- 展示Excel -->
      <div v-if="isShowExcel" class="table-box-one">
        <div class="table-box">
          <el-table
            v-if="isShowExcel"
            class="rollTable"
            empty-text="正在解析..."
            :data="excelData"
            row-class-name="myRow"
            cell-class-name="myCell"
            style="width: 100%; height:100%;"
          >
            <el-table-column :prop="prop[7]" label="楼层" min-width="100">
              <template slot-scope="scope">
                <span>{{scope.row.floor===1?"1层":'' }}</span>
                <span>{{scope.row.floor===2?"2层":'' }}</span>
                <span>{{scope.row.floor===3?"3层":'' }}</span>
                <span>{{scope.row.floor===4?"4层":'' }}</span>
                <span>{{scope.row.floor===5?"6层":'' }}</span>
                <span>{{scope.row.floor===7?"7层":'' }}</span>
                <span>{{scope.row.floor===8?"8层":'' }}</span>
                <span>{{scope.row.floor===9?"9层":'' }}</span>
                <span>{{scope.row.floor===10?"10层":'' }}</span>
                <span>{{scope.row.floor===-1?"负1层":'' }}</span>
                <span>{{scope.row.floor===-2?"负2层":'' }}</span>
                <span>{{scope.row.floor===-3?"负3层":'' }}</span>
                <span>{{scope.row.floor===-4?"负4层":'' }}</span>
                <span>{{scope.row.floor===-5?"负5层":'' }}</span>
                <span>{{scope.row.floor===-6?"负6层":'' }}</span>
                <span>{{scope.row.floor===-7?"负7层":'' }}</span>
                <span>{{scope.row.floor===-8?"负8层":'' }}</span>
                <span>{{scope.row.floor===-9?"负9层":'' }}</span>
                <span>{{scope.row.floor===-10?"负10层":'' }}</span>
              </template>
            </el-table-column>
            <el-table-column :prop="prop[1]" label="车位号" min-width="100" />
            <el-table-column :prop="prop[2]" label="车位类型" min-width="100" />
            <el-table-column :prop="prop[3]" label="车位状态" min-width="100" />
            <el-table-column :prop="prop[4]" label="关联房屋" min-width="100" />
            <el-table-column :prop="prop[5]" label="联系人" min-width="100" />
            <el-table-column :prop="prop[6]" label="联系电话" min-width="100" />
            <el-table-column v-if="prop.length===9" :prop="prop[8]" label="失败原因" min-width="100" />
          </el-table>
        </div>
      </div>
      <!-- 搜索分页 -->
      <div class="block" v-if="!isShowExcel" v-show="searchs">
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
      <!-- 分页 -->
      <div class="block" v-if="!isShowExcel&&!searchs" v-show="tianjia">
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
    <!-- 确认导入 -->
    <el-dialog
      title="提示"
      :visible.sync="remindercar"
      :append-to-body="true"
      center
      class="reminder"
      top="35vh"
      :close-on-click-modal="false"
      width="380px"
     >
      <div class="footer-one">
        <p>确认导入车位？</p>
      </div>
      <div class="footer-class">
        <span class="one" @click="cancel">取消</span>
        <span class="two" @click="minitab">确认</span>
      </div>
    </el-dialog>
    <!-- 增加车位 -->
    <el-dialog
      title="新增车位"
      :visible.sync="centerDialogVisible1"
      :append-to-body="true"
      center
      class="addparkings"
      :close-on-click-modal="false"
      width="450px"
     >
      <el-form
        :label-position="labelPosition"
        label-width="90px"
        :model="Specialvehicle"
        class="el-myclass"
        ref="Specialvehicle"
        hide-required-asterisk
      >
        <el-form-item label="车位类型:">
          <el-select v-model="Specialvehicle.car_type_id" placeholder>
            <el-option
              :label="item.park_type"
              v-for="(item ,index) in pulllists"
              :key="index"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- 验证 -->
        <div class="yanzheng">
          <div v-show="yzheng1">请选择车位类型</div>
        </div>
          <el-form-item label="选择停车场:">
          <el-select v-model="Specialvehicle.settingid" placeholder>
            <el-option
            :label="item.setting_name"
            v-for="(item ,index) in parking"
            :key="index"
            :value="item.id"
          ></el-option>
          </el-select>
        </el-form-item>
          <div class="yanzheng">
          <div v-show="yzheng11">请选择停车场</div>
        </div>
        <el-form-item label="楼层:">
           <el-input
            v-model="Specialvehicle.floor"
            @keydown.native.enter="submitForm"
            onkeyup="value=value.replace(/[^\-?\d]/g,'')"
            autocomplete="off"
          ></el-input>
          <!-- <el-select v-model="Specialvehicle.floor" placeholder>
            <el-option
              :label="item.label"
              v-for="(item ,index) in park_floor"
              :key="index"
              :value="item.value"
            ></el-option>
          </el-select> -->
        </el-form-item>
        <div class="yanzheng">
          <div v-show="yzheng10">请输入楼层</div>
        </div>
        <el-form-item label="车位号:">
          <el-input
            v-model="Specialvehicle.number"
            @keydown.native.enter="submitForm"
            autocomplete="off"
            class="form_item1"
          ></el-input>
        </el-form-item>
        <!-- 验证 -->
        <div class="yanzheng">
          <div>
            <span v-show="yzheng2">请输入车位号</span>
            <span v-show="yzheng20">车位号已存在</span>
          </div>
        </div>

        <el-form-item label="车位状态:">
          <template>
            <el-radio-group v-model="Specialvehicle.state">
              <el-radio :label="2">已售</el-radio>
              <el-radio :label="1">未售</el-radio>
              <el-radio :label="3">已出租</el-radio>
            </el-radio-group>
          </template>
        </el-form-item>
        <div class="yanzheng"></div>
        <el-form-item label="关联房屋:">
          <el-input
            v-model="Specialvehicle.house_number"
            @keydown.native.enter="submitForm"
            autocomplete="off"
            placeholder="选填，填写后自动与房屋编号绑定"
          ></el-input>
        </el-form-item>
        <!-- 验证 -->
        <div class="yanzheng"></div>
        <el-form-item label="联系人:">
          <el-input
            v-model="Specialvehicle.name"
            @keydown.native.enter="submitForm"
            autocomplete="off"
            placeholder="选填"
          ></el-input>
        </el-form-item>
        <div class="yanzheng"></div>
        <el-form-item label="电话号码:">
          <el-input
            oninput="value=value.replace(/[^\d]/g,'')"
            v-model="Specialvehicle.phone"
            @keydown.native.enter="submitForm"
            autocomplete="off"
            placeholder="选填"
          ></el-input>
        </el-form-item>
        <div class="yanzheng">
          <div v-show="yzheng3">请输入正确的电话号码</div>
        </div>
        <el-form-item label="备注:" class="input_two">
          <el-input
            v-model="Specialvehicle.centons"
            @keydown.native.enter="submitForm"
            autocomplete="off"
            class="input textarea"
            rows="1"
            cols="40"
            type="textarea"
          ></el-input>
        </el-form-item>
      </el-form>
      <div class="footer-class">
        <span @click="submitForm">确认</span>
      </div>
    </el-dialog>

    <!-- 修改车位 -->
    <el-dialog
      title="修改车位"
      :visible.sync="Modification"
      :append-to-body="true"
      center
      class="specialvehicles"
      top="35vh"
      :close-on-click-modal="false"
      width="450px"
     >
      <el-form
        :label-position="labelPosition"
        label-width="80px"
        :model="Modificationcar"
        class="el-myclass"
        ref="Specialvehicle"
        hide-required-asterisk
      >
        <el-form-item class="warnings">
          <span class="warning" @click="applyfor">
            <svg
              style="position: absolute;
                right: 103px;
                top: 14px;
                cursor: pointer;
                color: rgb(153, 153, 153);
                font-size: 14px;
                width:14px;
                height:14px"
              class="icon"
              aria-hidden="true"
            >
              <use xlink:href="#icon-jinggao" style="width:14px;height:14ox;" />
            </svg>申请修改车位
          </span>
        </el-form-item>
        <el-form-item label="车位状态:">
          <template>
            <el-radio-group v-model="Modificationcar.state">
              <el-radio :label="2">已售</el-radio>
              <el-radio :label="1">未售</el-radio>
              <el-radio :label="3">已出租</el-radio>
            </el-radio-group>
          </template>
        </el-form-item>
        <el-form-item label="联系人:">
          <el-input
            placeholder="选填"
            v-model="Modificationcar.name"
            @keydown.native.enter="submittrer"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <div class="yanzheng"></div>
        <el-form-item label="联系电话:">
          <el-input
            placeholder="选填"
            oninput="value=value.replace(/[^\d]/g,'')"
            v-model.number="Modificationcar.phone"
            @keydown.native.enter="submittrer"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <div class="yanzheng">
          <div v-show="yzheng3">请输入正确的电话号码</div>
        </div>
        <el-form-item label="备注:" class="input_two">
          <el-input
            v-model="Modificationcar.centons"
            @keydown.native.enter="submittrer"
            autocomplete="off"
            class="input textarea"
            rows="4"
            type="textarea"
          ></el-input>
        </el-form-item>
      </el-form>
      <div class="footer-class">
        <span @click="submittrer">确认</span>
      </div>
    </el-dialog>
    <!-- 导入车位 -->
    <el-dialog
      title="导入车位"
      :visible.sync="daorukuang"
      :append-to-body="true"
      center
      class="reminder_lable"
      top="35vh"
      :close-on-click-modal="false"
      width="450px"
     >
      <div class="footer-one">
        <span class="lable_name_">选择停车场：</span>
        <el-select v-model="settingid" placeholder>
          <el-option
            :label="item.setting_name"
            v-for="(item ,index) in parking"
            :key="index"
            :value="item.id"
          ></el-option>
        </el-select>
        <p
          v-if="isExist2"
          class="tips"
          style="position:absolute;right: 215px !important;top:104px; font-size:14px;color:#FF0000;"
        >请选择停车场</p>
      </div>
      <div class="footer-class">
        <el-upload action="#" multiple :before-upload="beforeUpload" :limit="1">
          <el-button
            size="small"
            v-if="settingid"
            @click="uniform1"
            type="primary"
            class="add-btn1 two"
          >导入车位</el-button>
        </el-upload>
        <el-button
          size="small"
          v-if="!settingid"
          @click="uniform"
          type="primary"
          class="add-btn1 two"
        >导入车位</el-button>
      </div>
    </el-dialog>
    <!-- 修改车位详情 -->
    <el-dialog
      title="申请修改详情"
      custom-class="myAddForm"
      class="changepark"
      :append-to-body="true"
      :visible.sync="Changeparkingdetails"
      :close-on-click-modal="false"
     >
      <el-checkbox v-model="isDeleteHouse" @change="quxiao" class="de">申请删除车位</el-checkbox>
      <el-form ref="form2" :model="Changecar" label-width="380px">
        <div v-show="!isDeleteHouse">
          <div class="row">
            <span class="t1">车位类型:</span>
            <span class="t2">{{ Changeparkingcar.car_type_name}}</span>
            <span class="t3">修改为:</span>
            <el-select v-model="Changecar.car_type_id" placeholder @change="getValue">
              <el-option
                :label="item.park_type"
                v-for="(item ,index) in pulllists"
                :key="index"
                :value="item.id"
              ></el-option>
            </el-select>
          </div>
          <div class="row">
            <span class="t1">选择楼层:</span>
            <span class="t2">
              <span>{{Changeparkingcar.floor===1?"1层":'' }}</span>
              <span>{{Changeparkingcar.floor===2?"2层":'' }}</span>
              <span>{{Changeparkingcar.floor===3?"3层":'' }}</span>
              <span>{{Changeparkingcar.floor===4?"4层":'' }}</span>
              <span>{{Changeparkingcar.floor===5?"6层":'' }}</span>
              <span>{{Changeparkingcar.floor===7?"7层":'' }}</span>
              <span>{{Changeparkingcar.floor===8?"8层":'' }}</span>
              <span>{{Changeparkingcar.floor===9?"9层":'' }}</span>
              <span>{{Changeparkingcar.floor===10?"10层":'' }}</span>
              <span>{{Changeparkingcar.floor===-1?"负1层":'' }}</span>
              <span>{{Changeparkingcar.floor===-2?"负2层":'' }}</span>
              <span>{{Changeparkingcar.floor===-3?"负3层":'' }}</span>
              <span>{{Changeparkingcar.floor===-4?"负4层":'' }}</span>
              <span>{{Changeparkingcar.floor===-5?"负5层":'' }}</span>
              <span>{{Changeparkingcar.floor===-6?"负6层":'' }}</span>
              <span>{{Changeparkingcar.floor===-7?"负7层":'' }}</span>
              <span>{{Changeparkingcar.floor===-8?"负8层":'' }}</span>
              <span>{{Changeparkingcar.floor===-9?"负9层":'' }}</span>
              <span>{{Changeparkingcar.floor===-10?"负10层":'' }}</span>
            </span>
            <span class="t3">修改为:</span>
            <el-select v-model="Changecar.floor" placeholder>
              <el-option
                :label="item.label"
                v-for="(item ,index) in park_floor"
                :key="index"
                :value="item.value"
              ></el-option>
            </el-select>
            <p
              v-if="isExist1"
              class="tips"
              style="right: 80px !important; font-size:14px;color:#FF0000;"
            >请选择楼层</p>
          </div>
          <div class="row " >
            <span class="t1">车位号:</span>
            <span class="t2">{{ Changeparkingcar.number }}</span>
            <span class="t3">修改为:</span>
            <input v-model="Changecar.number" class="t4 form_item1" prop="number"  />
            <p
              v-if="isExist"
              class="tips"
              style="right: -4px !important; font-size:14px;color:#FF0000;"
            >您申请修改的车位已存在</p>
          </div>
          <div class="row">
            <span class="t1">长租车月租:</span>
            <span class="t2">{{ Changeparkingcar.car_price}}</span>
            <span class="t3">修改为:</span>
            <input v-model="Changecar.price" class="t4" />
          </div>
          <div class="row">
            <span class="t1">关联房屋:</span>
            <span class="t2">{{ Changeparkingcar.house_number }}</span>
            <span class="t3">修改为:</span>
            <input v-model="Changecar.house_number" class="t4" />
          </div>
        </div>
        <div class="row" style="position:relative; height:100px;">
          <span class="t1" style="margin-top:8px;">*申请理由:</span>
          <!-- <textarea
            v-model="Changecar.centons"
            rows="1"
            cols="40"
            style="min-height:110px;border-radius:4px;border:1px solid #d2d2d2;outline:none;position:absolute;left:85px;resize:none;width:320px;min-width:284px;padding:8px;overflow:scroll;overflow-y:hidden;overflow-x:hidden"
            onfocus="window.activeobj=this;this.clock=setInterval(function(){activeobj.style.height=activeobj.scrollHeight+'px';},10);"
            onblur="clearInterval(this.clock);"
          />-->
          <el-input
            placeholder="请输入申请理由"
            v-model="Changecar.centons"
            autocomplete="off"
            class="input textarea"
            rows="1"
            cols="40"
            type="textarea"
          ></el-input>
        </div>
        <div class="yanzheng1" v-show="!isDeleteHouse">
          <div v-show="yzheng">请输入修改理由</div>
        </div>
        <div class="yanzheng1">
          <div v-show="yzheng4">请输入删除理由</div>
        </div>
        <div v-if="!isDeleteHouse" class="addNow" style="cursor:pointer" @click="affirm">申请修改</div>
        <div
          v-if="isDeleteHouse"
          class="addNow"
          style="cursor:pointer"
          @click="clickConfirmModify2"
        >申请删除</div>
      </el-form>
    </el-dialog>
    <!-- 操作记录 -->
    <el-dialog
      title="操作记录"
      :visible.sync="operationss"
      :append-to-body="true"
      center
      class="operationnote"
      top="35vh"
      :close-on-click-modal="false"
      width="24.43%"
      v-if="!typeseate"
     >
      <el-form
        :label-position="labelPosition"
        label-width="110px"
        :model="operations"
        class="el-myclass"
        ref="Specialvehicle"
        hide-required-asterisk
        disabled
      >
        <el-form-item label="上次操作员:">
          <el-input v-model="operations.name" @keydown.native.enter="from" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="上次操作时间:">
          <el-input v-model="operations.time" @keydown.native.enter="from" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="上次操作IP地址:">
          <el-input v-model="operations.ip" @keydown.native.enter="from" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div class="footer-class">
        <span @click="from">确认</span>
      </div>
    </el-dialog>
    <!-- //操作记录详情 -->
    <el-dialog
      title="操作记录"
      :visible.sync="operationss"
      :append-to-body="true"
      center
      class="operationnotess"
      top="35vh"
      :close-on-click-modal="false"
      width="24.43%"
      v-if="typeseate"
     >
      <el-form
        :label-position="labelPosition"
        label-width="120px"
        :model="operations"
        class="el-myclass"
        ref="Specialvehicle"
        hide-required-asterisk
        disabled
      >
        <el-form-item label="上次操作员:">
          <el-input v-model="operations.name" @keydown.native.enter="from" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="上次操作时间:">
          <el-input v-model="operations.time" @keydown.native.enter="from" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="上次操作IP地址:">
          <el-input v-model="operations.ip" @keydown.native.enter="from" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="上次审核人:">
          <el-input v-model="operations.admin_name" @keydown.native.enter="from" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="上次审核时间:">
          <el-input v-model="operations.admin_time" @keydown.native.enter="from" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="上次审核结果:">
          <el-input
            @keydown.native.enter="from"
            autocomplete="off"
            :value="'拒绝：'+operations.centons"
          ></el-input>
        </el-form-item>
      </el-form>
      <div class="footer-class">
        <span @click="from">确认</span>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import "@/assets/fonts/iconfont.js";
import axios from "axios";
import { Message } from "element-ui";
import {
  pullList,
  addparklist,
  gainparklist,
  addguide,
  revisioncar,
  verifynumber,
  applycar,
  operatingRecord,
  carSearch,
  downloadcar,
  addParkone,
  parkList,
  postdownloads,
  Parkingselection
} from "@/api/parkCar";
import { postSelect_button } from "@/api/Jurisdiction1";
import moment from "moment";
// data数据
export default {
  components: {},
  data () {
    return {
      yzheng11:false,
      settingid:'',
      moban: false,
      tianjia: true,
      zengjiaid: "",
      ruless: {},
      rules: {
        car_type_id: [{ required: true, message: "车位类型不能为空" }],
        number: [{ required: true, message: "车位号不能为空" }],
        vehicle_phone: [
          { required: true, message: "电话不能为空" },
          { type: "number", message: "电话必须为数字" }
        ],
        house_number: [{ required: true, message: "房屋不能为空" }]
      },
      tianjiacheweileix:true,
      park_floor: [
        {
          value: "-10",
          label: "负10层"
        },
        {
          value: "-9",
          label: "负9层"
        },
        {
          value: "-8",
          label: "负8层"
        },
        {
          value: "-7",
          label: "负7层"
        },
        {
          value: "-6",
          label: "负6层"
        },
        {
          value: "-5",
          label: "负5层"
        },
        {
          value: "-4",
          label: "负4层"
        },
        {
          value: "-3",
          label: "负3层"
        },
        {
          value: "-2",
          label: "负2层"
        },
        {
          value: "-1",
          label: "负1层"
        },
        {
          value: "1",
          label: "1层"
        },
        {
          value: "2",
          label: "2层"
        },
        {
          value: "3",
          label: "3层"
        },
        {
          value: "4",
          label: "4层"
        },
        {
          value: "6",
          label: "6层"
        },
        {
          value: "7",
          label: "7层"
        },
        {
          value: "8",
          label: "8层"
        },
        {
          value: "9",
          label: "9层"
        },
        {
          value: "10",
          label: "10层"
        }
      ],
      yzheng20: false,
      isExist2: false,
      floor: null,
      daoru1: false,
      addcar1: false,
      addcar: false,
      daoru: false,
      xiugai: false,
      caozuo: false,
      searchs: false,
      typeseate: null,
      yzheng: false,
      yzheng1: false,
      yzheng2: false,
      yzheng3: false,
      yzheng4: false,
      yzheng10: false,
      isExist: false, // 要修改的车位号是否已存在
      remindercar: false,
      isShowExcel: false,
      isError: false,
      isDeleteHouse: false, // 申请删除房屋
      checked: true,
      pulllists: [],
      tableData: [],

      back: false, //返回上一级
      pageNums: 1, //总页数
      totalPage: null, //总条数
      disabled: true,
      labelPosition: "right",
      park_id: null, //停车场id
      parkid: null,
      currentPage: 1, // 当前页
      pageSize: 10, // 当前页条数
      centerDialogVisible1: false, //增加车位
      Modification: false, //修改车位
      operationss: false, //操作记录
      Changeparkingdetails: false, //申请修改车位
      //修改车辆
      Modificationcar: {
        centons: null, //备注
        state: null, //车位状态
        name: null,
        phone: null
      },
      parkfloor: '',
      isExist1: false,
      Changeparkingcar: {
        car_type_name: null, //车位类型
        number: null, //车位号
        centons: null, //备注
        state: null, //车位状态
        house_number: null, //关联房屋
        car_price: null,
        car_type: null,
        floor: null,
      },
      Changecar: {
        car_type_id: null, //车位类型id
        number: null, //车位号
        centons: null, //备注
        house_number: null, //关联房屋
        price: null,
        floor: null
      },
      //新增车位
      Specialvehicle: {
        car_type_id: null, //车位类型
        number: null, //车位号
        centons: null, //备注
        state: 1, //车位状态
        house_number: null, //关联房屋
        name: null,
        phone: null,
        floor: null,
        settingid:''
      },
      //操作记录
      operations: {},
      //查询
      orderNo: null,
      user: {}, //当前列信息
      excelData: [],
      prop: ["1", "2", "3", "4", "5", "6"],
      listid: null, //导入文件id
      carlistid: null, //当前列id
      ids: null,
      uid: null,
      daorukuang: false,
      parking:[]
    };
  },
  async created () {
    //获取列表
    const user = JSON.parse(localStorage.getItem("userInfo"));
    this.parkid = user.Communityid;
    this.park_id = user.Communityid;
    this.uid = user.uid;
    //获取车位类型下拉id
    this.Pulllist();
    //console.log(user.list );
    //获取车位列表
    this.parkList();
    // 拉取用户信息按钮权限
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'))
    const { Communityid, uid } = this.userInfo
    const auth_id = this.$route.meta.auth_id
    const { data } = await postSelect_button({ Communityid, uid, auth_id })
    data.forEach(v => {
      console.log(v);

      if (v.auth_name === "增加车位") {
        this.addcar = true;
        this.addcar1 = this.addcar;
      }
      if (v.auth_name === "导入车位") {
        this.daoru = true;
        this.daoru1 = this.daoru
      }
      if (v.auth_name === "修改") {
        this.xiugai = true;
      }
      if (v.auth_name === "操作记录") {
        this.caozuo = true;
      }
      if (v.auth_name === "下载车位模板") {
        this.moban = true;
      }
    })
     const datas = await parkList({
        page: this.currentPage,
        size: this.pageSize,
        parkid: this.parkid,
        uid: this.uid
    })
    console.log(datas);
    if(datas.data.data.length){
      this.tianjiacheweileix=false
    }else{
      this.tianjiacheweileix=true
    }

  const objs = await Parkingselection({
     parkid:this.parkid
  
  })
  console.log(objs,'停车场');
  this.parking=objs.data
  },
  methods: {
    clear1 () {
      this.tableData = []
      this.tianjia = true;
      this.parkList();
    },
    uniform () {
      if (!this.settingid) {
        this.isExist2 = true;
        setTimeout(() => {
          this.isExist2 = false;
        }, 2000)
      }
    },
    uniform1 () {
      this.daorukuang = false;
    },
    daoruchew () {
        if(this.tianjiacheweileix){
        this.$message({
            message: "请先添加车位类型",
            type: "warning"
          })
      }else{
      this.daorukuang = true;
      }
      this.settingid = null;
    },
    getValue () {
      //console.log(this.Changecar.car_type_id);
      // this.pulllists.forEach(v => {
      //   if (v.id == this.Changecar.car_type_id) {
      //     this.Changecar.price = v.park_car_long;
      //   }
      // });
    },
    //返回列表页
    ok () {
      this.isShowExcel = false;
      this.isError = false;
      this.isError = false;
    },
    // 返回上一页
    backToLastPage () {
      this.isShowExcel = false;
      // this.pageInfo.total = this.pt
      // this.pageInfo.pageNum = this.pn
      this.parkList();
    },
    //获取车位类型下拉id
    async Pulllist () {
      let { data } = await pullList({ parkid: this.parkid });
      console.log(data);

      this.pulllists = data;
      console.log(data);
    },
    // 分页设置
    handleCurrentChange (val) {
      this.currentPage = val;
      this.parkList();
    },
    async handleCurrentChange1 (val) {
      let { data } = await carSearch({
        page: val,
        size: this.pageSize,
        parkid: this.parkid,
        name: this.orderNo
      });
      console.log(data);

      this.tableData = data.data;
      this.totalPage = data.total; // 总条数
      this.pageNums = data.pageNum; //总页数
    },
    //编辑
    compile (row) {
      console.log(row);
      //this.user=row
      this.Modification = true;
      this.isDeleteHouse = false;
      this.Changecar.car_type_id = "";
      //  let { state, centons } =row;
      //  console.log(state,centons);
      this.Changecar.floor = null;
      this.parkfloor = row.floor;
      this.carlistid = row.id;
      this.Modificationcar.state = row.state;
      this.Modificationcar.centons = row.centons;
      this.Modificationcar.name = row.name;
      this.Modificationcar.phone = row.phone;
      this.Changeparkingcar.car_type_name = row.car_type_name;
      this.Changeparkingcar.number = row.car_number;
      this.Changeparkingcar.house_number = row.car_house_number;
      this.Changeparkingcar.state = row.state;
      this.Changeparkingcar.centons = row.centons;
      this.Changeparkingcar.car_price = row.car_price;
      this.Changeparkingcar.car_type = row.car_type;
      this.Changeparkingcar.floor = row.floor;
    },
    quxiao () {
      this.Changecar.centons = "";
      this.yzheng = false;
      this.yzheng4 = false;
    },
    //申请删除
    async clickConfirmModify2 () {
      if (!this.Changecar.centons) {
        this.yzheng4 = true;
        setTimeout(() => {
          this.yzheng4 = false;
        }, 2000);
      } else {
        let res = await applycar({
          id: this.carlistid,
          state: 2,
          centons: this.Changecar.centons,
          uid: this.uid,
          parkid: this.parkid
        });
        console.log(res);
        if (res.msg === 1) {
          Message({
            type: "success",
            message: "申请提交成功"
          });
          this.Changeparkingdetails = false;
          this.parkList();
          this.isDeleteHouse = false;
          this.$bus.$emit("update")
        } else {
          this.isDeleteHouse = false;

          // 失败
          Message.error("申请提交失败");
        }
      }
    },
    //操作记录
    handle (row) {
      console.log(row);
      const { id } = row;
      this.ids = id;
      this.operations = null;
      this.typeseate = null;
      this.operatingRecord();
      this.operationss = true;
    },
    // 获取操作记录列表
    async operatingRecord () {
      const { data } = await operatingRecord({
        state: 2,
        id: this.ids
      });
      console.log(data);
      data.time = moment(data.time * 1000).format("YYYY-MM-DD HH:mm:ss");
      data.admin_time = moment(data.admin_time * 1000).format(
        "YYYY-MM-DD hh:mm:ss"
      );
      this.operations = data;
      this.typeseate = data.centons;
    },
    from () {
      this.operationss = false;
    },
    //申请修改
    async affirm () {
      //console.log(this.Changecar.number,this.parkid);
      if (!this.Changecar.centons) {
        this.yzheng = true;
        setTimeout(() => {
          this.yzheng = false;
        }, 2000);
      }
      else {
        if (!this.Changecar.number) {
          if (this.Changecar.car_type_id || this.Changecar.house_number || this.Changecar.number || this.Changecar.price || this.Changecar.floor) {
            if (!this.Changecar.floor) {
                applycar({
              id: this.carlistid,
              car_type_id: this.Changecar.car_type_id,
              state: 1,
              house_number: this.Changecar.house_number,
              centons: this.Changecar.centons,
              number: this.Changecar.number,
              price: this.Changecar.price,
              uid: this.uid,
              floor: this.parkfloor
            }).then(res => {
              if (res.msg === 1) {
                this.Changeparkingdetails = false;
                this.parkList();
                Message({
                  type: "success",
                  message: "申请提交成功"
                });
                this.$bus.$emit("data")
              } else {
                // 失败
                Message.error("申请提交失败");
              }
            });
            }else{
                applycar({
              id: this.carlistid,
              car_type_id: this.Changecar.car_type_id,
              state: 1,
              house_number: this.Changecar.house_number,
              centons: this.Changecar.centons,
              number: this.Changecar.number,
              price: this.Changecar.price,
              uid: this.uid,
              floor: this.Changecar.floor
            }).then(res => {
              if (res.msg === 1) {
                this.Changeparkingdetails = false;
                this.parkList();
                Message({
                  type: "success",
                  message: "申请提交成功"
                });
                this.$bus.$emit("data")
              } else {
                // 失败
                Message.error("申请提交失败");
              }
            });
            }
          } else {
            this.$message({
              message: "您未修改任何内容或修改失败",
              type: "warning"
            })
          }

        }
        else if (this.Changecar.number && !this.Changecar.floor) {
             this.Changecar.number=this.Changecar.number.toUpperCase()
          // this.Changecar.floor=this.parkfloor
          let res = await verifynumber({
            parkid: this.parkid,
            number: this.Changecar.number,
            uid: this.uid,
            floor: this.parkfloor
          });

          //console.log(res);
          if (res.msg === 3) {
            this.isExist = true;
            setTimeout(() => {
              this.isExist = false;
            }, 4000);
          } else if (res.msg === 1) {
            console.log(this.Changecar.price);
            applycar({
              id: this.carlistid,
              car_type_id: this.Changecar.car_type_id,
              state: 1,
              house_number: this.Changecar.house_number,
              centons: this.Changecar.centons,
              number: this.Changecar.number,
              price: this.Changecar.price,
              uid: this.uid,
              floor: this.parkfloor
            }).then(res => {
              if (res.msg === 1) {
                this.Changeparkingdetails = false;
                this.parkList();
                this.$bus.$emit("data")
                Message({
                  type: "success",
                  message: "申请提交成功"
                });
              } else if (res.msg === 24) {
                this.$message({
                  message: "您未修改任何内容或修改失败",
                  type: "warning"
                })
              }
              else {
                // 失败
                Message.error("申请提交失败");
              }
            });
          }
        }
        else if (this.Changecar.number && this.Changecar.floor) {
          // this.Changecar.floor=this.parkfloor
          let res = await verifynumber({
            parkid: this.parkid,
            number: this.Changecar.number,
            uid: this.uid,
            floor: this.Changecar.floor
          });

          //console.log(res);
          if (res.msg === 3) {
            this.isExist = true;
            setTimeout(() => {
              this.isExist = false;
            }, 4000);
          } else if (res.msg === 1) {
            console.log(this.Changecar.price);
            applycar({
              id: this.carlistid,
              car_type_id: this.Changecar.car_type_id,
              state: 1,
              house_number: this.Changecar.house_number,
              centons: this.Changecar.centons,
              number: this.Changecar.number,
              price: this.Changecar.price,
              uid: this.uid,
              floor: this.Changecar.floor
            }).then(res => {
              if (res.msg === 1) {
                this.Changeparkingdetails = false;
                this.parkList();
                this.$bus.$emit("data")
                Message({
                  type: "success",
                  message: "申请提交成功"
                });
              } else if (res.msg === 24) {
                this.$message({
                  message: "您未修改任何内容或修改失败",
                  type: "warning"
                })
              }
              else {
                // 失败
                Message.error("申请提交失败");
              }
            });
          }
        }
      }
    },
    //申请修改弹框
    applyfor () {
      this.Modification = false;
      this.Changeparkingdetails = true;
      this.Changecar.centons = "";
      this.Changecar.price = "";
      this.Changecar.house_number = "";
      this.Changecar.number = "";
    },
    //新增弹框打开
    addor () {
      if(this.tianjiacheweileix){
        this.$message({
            message: "请先添加车位类型",
            type: "warning"
          })
      }else{
      this.centerDialogVisible1 = true;
      }
      // 去除验证
      this.Specialvehicle = {
        car_type_id: null, //车位类型
        number: null, //车位号
        centons: null, //备注
        state: 1, //车位状态
        house_number: null, //关联房屋
        name: null,
        phone: null,
        floor: null
      }
    },
    //新增提交
    async submitForm () {
      var phoneReg = /^1[34578]\d{9}$/;
      if(this.Specialvehicle.number){
        this.Specialvehicle.number= this.Specialvehicle.number.toUpperCase()
      }
      //console.log(this.Specialvehicle);
      if (!this.Specialvehicle.car_type_id) {
        this.yzheng1 = true;
        setTimeout(() => {
          this.yzheng1 = false;
        }, 2000);
      }else if (!this.Specialvehicle.settingid) {
        this.yzheng11 = true;
        setTimeout(() => {
          this.yzheng11 = false;
        }, 2000);
      }
      else if (!this.Specialvehicle.floor) {
        this.yzheng10 = true;
        setTimeout(() => {
          this.yzheng10 = false;
        }, 2000);
      }
      else if (!this.Specialvehicle.number) {
        this.yzheng2 = true;
        setTimeout(() => {
          this.yzheng2 = false;
        }, 2000);
      }
      else if (
        this.Specialvehicle.car_type_id &&
        this.Specialvehicle.number &&
        this.Specialvehicle.floor&&
        this.Specialvehicle.settingid
      ) {
        if (this.Specialvehicle.phone) {
          if (!phoneReg.test(this.Specialvehicle.phone)) {
            this.yzheng3 = true;
            setTimeout(() => {
              this.yzheng3 = false;
            }, 2000);
          } else {
            const obj = await verifynumber({
              parkid: this.parkid,
              number: this.Specialvehicle.number,
              uid: this.uid,
              floor: this.Specialvehicle.floor
            })
            console.log(obj);
            if (obj.data === "不允许添加") {
              this.yzheng20 = true;
              setTimeout(() => {
                this.yzheng20 = false;
              })
            } else {
              let res = await addparklist({
                parkid: this.parkid,
                car_type_id: this.Specialvehicle.car_type_id,
                state: this.Specialvehicle.state,
                house_number: this.Specialvehicle.house_number,
                number: this.Specialvehicle.number,
                centons: this.Specialvehicle.centons,
                uid: this.uid,
                name: this.Specialvehicle.name,
                phone: this.Specialvehicle.phone,
                floor: this.Specialvehicle.floor,
                settingid:this.Specialvehicle.settingid
              });
              if (res.msg === 1) {
                this.centerDialogVisible1 = false;
                // 再此获取列表
                // this.parkList();
                Message({
                  type: "success",
                  message: "添加成功"
                });
                this.zengjiaid = res.data
                const obj = await addParkone({ id: this.zengjiaid })
                this.tableData = obj.data;
                this.tianjia = false
              } else {
                // 失败
                this.centerDialogVisible1 = false;
                Message.error("添加失败");
              }
            }
          }
        } else {
          const obj = await verifynumber({
            parkid: this.parkid,
            number: this.Specialvehicle.number,
            uid: this.uid,
            floor: this.Specialvehicle.floor
          })
          console.log(obj);
          if (obj.data === "不允许添加") {
            this.yzheng20 = true;
            setTimeout(() => {
              this.yzheng20 = false;
            })
          } else {
            let res = await addparklist({
              parkid: this.parkid,
              car_type_id: this.Specialvehicle.car_type_id,
              state: this.Specialvehicle.state,
              house_number: this.Specialvehicle.house_number,
              number: this.Specialvehicle.number,
              centons: this.Specialvehicle.centons,
              uid: this.uid,
              name: this.Specialvehicle.name,
              phone: this.Specialvehicle.phone,
              floor: this.Specialvehicle.floor,
                settingid:this.Specialvehicle.settingid

            });
            if (res.msg === 1) {
              this.centerDialogVisible1 = false;
              // 再此获取列表
              // this.parkList();
              Message({
                type: "success",
                message: "添加成功"
              });
              this.zengjiaid = res.data
              const obj = await addParkone({ id: this.zengjiaid })
              this.tableData = obj.data;
              this.tianjia = false
            } else {
              // 失败
              this.centerDialogVisible1 = false;
              Message.error("添加失败");
            }
          }
        }


      }
    },
    //查询
    async search () {
      //console.log(this.searchForm.orderNo);
      if (this.orderNo) {
        let { data } = await carSearch({
          page: this.currentPage,
          size: this.pageSize,
          parkid: this.parkid,
          name: this.orderNo
        });
        console.log(data);
        if (data.total) {
          this.tableData = data.data;
          this.totalPage = data.total; // 总条数
          this.pageNums = data.pageNum; //总页数
          this.addcar1 = false;
          this.daoru1 = false;
          this.searchs = true;
          this.back = true;
        } else {
          Message.error("没有找到你想要的内容");
          this.orderNo = "";
        }
      }
      //  date=obj.data
      //   date.foreach(v=>{
      //     console.log(v);

      //   })
    },
    //获取列表
    async parkList () {
      const { data } = await gainparklist({
        page: this.currentPage,
        size: this.pageSize,
        parkid: this.parkid
      });
      console.log(data);
      if (!data.data.length && this.currentPage !== 1) {
        //如果当前页没有数据并且当前页码不是第一页
        this.currentPage--;
        this.parkList();
      }
      this.tableData = data.data;
      this.totalPage = data.total; // 总条数
      this.pageNums = data.pageNum; //总页数
    },
    // //下载车位模板
    // async Eclipse () {
    //   let res = await downloadcar();
    //   let blob = new Blob([res], {
    //     type:
    //       "application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    //   });
    //   //console.log(blob);
    //   const fileName = "车位列表模板.xls";
    //   if ("download" in document.createElement("a")) {
    //     // 非IE下载
    //     const elink = document.createElement("a");
    //     elink.download = fileName;
    //     elink.style.display = "none";
    //     elink.href = URL.createObjectURL(blob);
    //     document.body.appendChild(elink);
    //     elink.click();
    //     URL.revokeObjectURL(elink.href); // 释放URL 对象
    //     document.body.removeChild(elink);
    //   } else {
    //     // IE10+下载
    //     navigator.msSaveBlob(blob, fileName);
    //   }
    // },
     //下载车位模板
    async Eclipse () {
      let res = await downloadcar();
      if (res.code === 200) {
        postdownloads({ name: res.msg }).then(res => {
          let blob = new Blob([res], {
            type:
              "application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          });
          //console.log(blob);
         const fileName = "车位列表模板.xls";
          if ("download" in document.createElement("a")) {
            // 非IE下载
            const elink = document.createElement("a");
            elink.download = fileName;
            elink.style.display = "none";
            elink.href = URL.createObjectURL(blob);
            document.body.appendChild(elink);
            elink.click();
            URL.revokeObjectURL(elink.href); // 释放URL 对象
            document.body.removeChild(elink);
          } else {
            // IE10+下载
            navigator.msSaveBlob(blob, fileName)
          }
        })
      }
    },
    //导入车位
    beforeUpload (file) {
      const { token, Communityid } = JSON.parse(
        localStorage.getItem("userInfo")
      );

      var fd = new window.FormData();
      fd.append("excel", file);
      fd.append("parkid", this.parkid);
      axios
        .post("http://yapi.txsqtech.com/public/park/v1.Cartype/car_dao", fd, {
          // .post("http://test.txsqtech.com/park/v1.Cartype/car_dao", fd, {
          // .post("http://www.parking.com/park/v1.Cartype/car_dao", fd, {
          headers: {
            token
          }
        })
        .then(res => {
          if (res.data.msg === 1) {
            console.log(res, '本地的excel')
            this.prop = [ '1','2', '3', '4', '5', '6', "7","floor"]
            this.excelData = res.data.data.msg;
            console.log(this.excelData, "本地的excel");
            this.listid = res.data.data.id;

            //console.log(this.listid);

            this.isShowExcel = true;
          } else if (res.msg === 3) {
            // this.$router.push('/')
            alert("格式错误");
          }
        });
      return false; // 返回false不会自动上传
    },
    excelImport () {
      this.remindercar = true;
    },
    //取消
    cancel () {
      this.remindercar = false;
    },
    //确认导入
    async minitab () {
      let res = await addguide({
        parkid: this.parkid,
        id: this.listid,
        uid: this.uid,
        settingid:this.settingid
      });
      console.log(res);
      if (res.msg === 1) {
        this.isShowExcel = false;
        this.remindercar = false;
        this.parkList();
        Message({
          type: "success",
          message: "导入成功"
        });
      } else {
        // 失败
        this.remindercar = false;
          this.prop = [ '0','1', '2', '3', '4', '5', "6","floor","centons"]
        this.excelData = res.data.info;
        this.isError = true;
      }
    },
    //清除
    clear () {
      this.tableData = [];
      this.addcar1 = this.addcar;
      this.daoru1 = this.daoru;
      this.orderNo = "";
      this.searchs = false;
      this.back = false;
      this.currentPage = 1;
      this.parkList();
    },
    //普通修改确认
    async submittrer () {
      var phoneReg = /^1[34578]\d{9}$/;
      if (this.Modificationcar.phone) {
        if (!phoneReg.test(this.Modificationcar.phone)) {
          this.yzheng3 = true;
          setTimeout(() => {
            this.yzheng3 = false;
          }, 2000)
        } else {
          let res = await revisioncar({
            id: this.carlistid,
            centons: this.Modificationcar.centons,
            state: this.Modificationcar.state,
            phone: this.Modificationcar.phone,
            name: this.Modificationcar.name
          });
          console.log(res);
          if (res.msg === 1) {
            this.Modification = false;
            this.parkList();
            Message({
              type: "success",
              message: "修改成功"
            });
          } else if (res.data === "当前数据未做修改") {
            // 失败
            this.Modification = false;
            this.$message({
              message: "您未修改任何内容或修改失败",
              type: "warning"
            })
          } else {
            this.Modification = false;
            Message.error("修改失败");
          }
        }
      } else {
        let res = await revisioncar({
          id: this.carlistid,
          centons: this.Modificationcar.centons,
          state: this.Modificationcar.state,
          phone: this.Modificationcar.phone,
          name: this.Modificationcar.name
        });
        console.log(res);
        if (res.msg === 1) {
          this.Modification = false;
          this.parkList();
          Message({
            type: "success",
            message: "修改成功"
          });
        } else if (res.data === "当前数据未做修改") {
          // 失败
          this.Modification = false;
          this.$message({
            message: "您未修改任何内容或修改失败",
            type: "warning"
          })
        } else {
          this.Modification = false;
          Message.error("修改失败");
        }
      }

    }
  }
};
</script>
<style lang="scss" scoped>
.box-header {
  margin-top: 20px;
  margin-left: 20px;
  position: relative;
  height: 30px;
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
    font-size: 14px;
    right: 0px;
    top: -45px;
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
.table-box-one {
  position: relative;
  margin: 20px;
  margin-top: 0px;
  height: 89%;
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
}

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
.add-btn1 {
  cursor: pointer;
  background-color: #1fbba6;
  border: 1px solid #1fbba6;
  color: #fff;
  height: 30px;
  line-height: 28px;
  font-size: 14px;
  position: absolute;
  top: 0px;
  left: 80px;
  padding: 0 8px;
  border-radius: 4px;
}
.add-btn2 {
  cursor: pointer;
  background-color: rgba(37, 186, 217, 1);
  border: 1px solid rgba(37, 186, 217, 1);
  color: #fff;
  height: 30px;
  line-height: 28px;
  font-size: 14px;
  position: absolute;
  top: 0px;
  left: 80px;
  padding: 0 8px;
  border-radius: 4px;
}
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
  left: 4px;
  top: 0px;
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
.newaddcp {
  display: inline-block;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  width: 86px;
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
  background: rgba(37, 186, 217, 1);
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
  background: #fa5c5c;
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
  background: rgba(204, 204, 204, 1);
  border-radius: 4px;
}
.operationnote {
  /deep/.el-dialog {
    min-width: 380px;
    height: 286px;
    border-radius: 5px;
    display: flex;
    flex-direction: column;
    margin: 0 !important;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    .el-dialog__header {
      text-align: left;
      height: 43px !important;
      border-bottom: 1px solid #eff2f5;
      padding: 10px 19px 12px;
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
      padding: 24px 6% 25px 6%;
      .el-myclass {
        padding-left: 32px;
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
.operationnotess {
  /deep/.el-dialog {
    min-width: 380px;
    height: 442px;
    border-radius: 5px;
    display: flex;
    flex-direction: column;
    margin: 0 !important;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    .el-dialog__header {
      text-align: left;
      height: 43px !important;
      border-bottom: 1px solid #eff2f5;
      padding: 10px 19px 12px;
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
      padding: 24px 0 25px 0px;
      .el-myclass {
        padding-left: 55px;
        height: 65px !important;
        /deep/ .el-form-item__label {
          padding: 0 8px 0 0;
          text-align: left;
        }
        /deep/.el-input__inner {
          // background-color: #f00;
          width: 84% !important;
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
      margin-top: 252px;
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
.units {
  position: absolute;
  right: 42px;
}
.specialvehicles {
  /deep/.el-dialog {
    min-width: 400px;
    height: 400px;
    border-radius: 5px;
    display: flex;
    flex-direction: column;
    margin: 0 !important;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    .el-dialog__header {
      text-align: left;
      padding: 10px 19px 12px;
      height: 43px !important;
      border-bottom: 1px solid #eff2f5;
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
      padding: 25px 20px 30px 12px;
      .el-myclass {
        padding-left: 55px;
        height: 65px !important;
        /deep/ .el-form-item__label {
          padding: 0 8px 0 0;
          text-align: left;
        }
        /deep/.el-input__inner {
          // background-color: #f00;
          width: 248px !important;
          height: 32px !important;
          border: 1px solid rgba(210, 210, 210, 1) !important;
          border-radius: 4px !important;
          color: #333333;
          padding: 0px 7px;
        }
        .warnings {
          height: 30px !important;
          padding: 0px !important;
          margin-top: -26px !important;
          .el-form-item__content {
            margin-left: 265px !important;
            font-family: Microsoft YaHei;
            font-weight: 400;
            color: rgba(153, 153, 153, 1);
          }
          .warning {
            cursor: pointer;
            font-size: 14px;
            .icon-jinggao {
              fill: #f8ac59;
            }
          }
        }
      }
    }
    .footer-class {
      // background-color: #f00;
      cursor: pointer;
      height: 30px;
      display: flex;
      justify-content: center;
      margin-top: 239px;
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
      margin-bottom: 1px;
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
            width: 248px;
            height: 88px;
            color: #333;
            margin-top: 2px;
            padding: 5px 8px;
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
    border-radius: 5px;
    height: 210px;
    display: flex;
    flex-direction: column;
    margin: 0 !important;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    .el-dialog__header {
      text-align: left;
      height: 47px !important;
      padding: 10px 19px 12px;
      border-bottom: 1px solid #eff2f5;
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
        }
      }
    }
    .footer-one {
      width: 380px;
      height: 112px;
      display: flex;
      justify-content: center;
      align-items: center;
      p {
        font-size: 16px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: rgba(102, 102, 102, 1);
      }
    }
    .footer-class {
      // background-color: #f00;
      cursor: pointer;
      height: 30px;
      display: flex;
      justify-content: center;

      .two {
        width: 72px;
        height: 30px;
        border-radius: 4px;
        background-color: #25bad9;
        border-color: #25bad9;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #fff;
        margin-left: 98px;
      }
      .one {
        width: 72px;
        height: 30px;
        border-radius: 4px;
        background-color: #ffffff;
        border: 1px solid rgba(204, 204, 204, 1);
        display: flex;
        justify-content: center;
        align-items: center;
        color: #999999;
      }
    }
    .el-form-item {
      margin-bottom: 0;
      height: 50px !important;
    }
  }
}

//增加车位
.addparkings {
  /deep/.el-dialog {
    min-width: 400px;
    height: 680px;
    border-radius: 5px;
    display: flex;
    flex-direction: column;
    margin: 0 !important;
    position: absolute;
    top: 50%;
    left: 50%;
    //  transform:translate(-50%,-50%);
    transform: translate(-50%, -52%);
    .el-dialog__header {
      text-align: left !important;
      height: 43px !important;
      border-bottom: 1px solid #eff2f5 !important;
      padding: 10px 19px 12px;
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
      padding: 25px 30px 30px 2px;
      .el-myclass {
        padding-left: 55px;
        height: 65px !important;
        /deep/ .el-form-item__label {
          padding: 0 8px 0 0;
          text-align: left;
        }
        /deep/.el-input__inner {
          // background-color: #f00;
          width: 248px !important;
          height: 32px !important;
          border: 1px solid rgba(210, 210, 210, 1) !important;
          border-radius: 4px !important;
          color: #333333;
          padding: 0px 7px;
        }
        .warnings {
          height: 30px !important;
          padding: 0px !important;
          margin-top: -26px !important;
          .el-form-item__content {
            margin-left: 255px !important;
            font-family: Microsoft YaHei;
            font-weight: 400;
            color: rgba(153, 153, 153, 1);
          }
          .warning {
            cursor: pointer;
            font-size: 14px;
            .icon-jinggao {
              fill: #f8ac59;
            }
          }
        }
      }
    }
    .footer-class {
      // background-color: #f00;
      cursor: pointer;
      height: 30px;
      display: flex;
      justify-content: center;
      margin-top: 493px;
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
      margin-bottom: 4px;
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
            width: 248px;
            height: 88px;
            margin-top: 2px;
            color: #333;
            padding: 5px 8px;
          }
          .el-textarea__inner:focus {
            border-color: #d2d2d2;
          }
        }
      }
    }
  }
}
.actived {
  color: #1fbba6;
}
.changepark {
  .el-dialog__body {
    padding: 24px 40px 58px 75px !important;
    height: 573px;
    .de {
      position: absolute;
      left: 30px;
      top: 10px;
      padding-bottom: 10px;
    }
    .el-form {
      padding-top: 10px;
      font-size: 14px;
      .el-form-item__label {
        .el-form-item__content {
          .block {
            /deep/.el-date-editor.el-input {
              width: 280px !important;
            }
          }
        }
      }
      .row {
        position: relative;
        padding-bottom: 24px;
        .tips {
          position: absolute;
          right: 99px;
        }

        span {
          display: inline-block;
        }
        .t1 {
          width: 86px;
        }
        .textarea {
          /deep/.el-textarea__inner {
            position: absolute;
            font-family: "Microsoft" !important;
            font-size: 14px !important;
            // overflow-y: scroll;
            width: 264px;
            height: 111px;
            margin-top: 2px;
            padding: 5px 8px;
            left: 84px;
            color: #333;
            top: -4px;
          }
          /deep/.el-textarea__inner:focus {
            border-color: #d2d2d2;
          }
        }
        .t2 {
          width: 82px;
        }
        .t3 {
          padding-right: 15px;
          font-size: 14px !important;
        }
        .t4 {
          width: 140px;
          border: 1px solid #d2d2d2;
          height: 32px;
          padding-left: 5px;
          padding-right: 5px;
          outline: none;
          border-radius: 4px;
        }
        /deep/.el-select {
          width: 140px;
          padding-left: 5px;
          border: 1px solid #d2d2d2;
          height: 32px;
          border-radius: 4px;
          .el-input__inner {
            padding-left: 0;
            border: none;
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
  /deep/ .myAddForm {
    position: fixed;
    top: 10px;
    width: 450px !important;

    .de {
      height: 32px;
    }
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
    .el-dialog__header {
      //header
      border-bottom: 1px solid #efefef;
      padding: 10px 0 10px 16px;
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
      padding: 29px 40px 58px 54px !important;
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
          padding-bottom: 24px;
          .tips {
            position: absolute;
            right: 99px;
          }

          span {
            display: inline-block;
          }
          .t1 {
            width: 85px;
          }
          .t2 {
            width: 72px;
          }
          .t3 {
            padding-right: 8px;
          }
          .t4 {
            width: 140px;
            border: 1px solid #d2d2d2;
            height: 32px;
            padding-left: 5px;
            padding-right: 5px;
            outline: none;
            border-radius: 4px;
          }
          /deep/.el-select {
            width: 140px;
            padding-left: 5px;
            border: 1px solid #d2d2d2;
            height: 32px;
            border-radius: 4px;
            .el-input__inner {
              padding-left: 0;
            }
            .el-input__suffixP {
              top: 3px;
              .el-input__suffix-inner {
                height: 100%;
                .el-input__icon {
                  line-height: 0px !important;
                }
              }
            }
          }
        }
      }
    }
    .el-input__icon {
      line-height: 0px !important;
    }
    .el-input__suffix {
      top: 3px !important;
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
}

//下载车位模板
.download {
  font-size: 12px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: rgba(95, 175, 228, 1);
  cursor: pointer;
  position: absolute;
  right: 8px;
  top: 28px;
  display: inline-block;
  width: 84px;
  height: 12px;
}
.newadds {
  display: inline-block;
  display: flex;
  align-items: center;
  justify-content: center;
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
.el-button--text {
  color: #ffffff;
}
.yanzheng {
  color: #f00000;
  font-size: 14px;
  margin-top: -3px;
  margin-left: 90px;
  width: 150px;
  line-height: 12px;
  height: 12px;
}
.yanzheng1 {
  color: #f00000;
  font-size: 14px;
  margin-left: 84px;
  width: 150px;
  line-height: 12px;
  height: 12px;
  margin-top: 12px;
}
/deep/.el-table {
  /deep/.el-table__body-wrapper {
    /deep/tbody {
      /deep/tr {
        height: 60px !important;
        td{
overflow:hidden; //超出的文本隐藏
text-overflow:ellipsis; //溢出用省略号显示
white-space:nowrap; //溢出不换行
        }
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
.kuang {
  height: 32px;
  position: relative;
}
.reminder_lable {
  /deep/.el-dialog {
    min-width: 380px;
    border-radius: 5px;
    height: 188px;
    .el-dialog__header {
      text-align: left;
      height: 43px !important;
      padding: 10px 19px 12px;
      border-bottom: 1px solid #eff2f5;
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
        }
      }
    }
    .footer-one {
      height: 91px;
      display: flex;
      justify-content: center;
      align-items: center;
      input {
        width: 230px;
        height: 32px;
        border: 1px solid rgba(210, 210, 210, 1) !important;
        border-radius: 4px;
        -moz-appearance: none;
        text-indent: 8px;
      }
      input:focus {
        outline: none;
      }
      input::-webkit-input-placeholder {
        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: rgba(213, 216, 223, 1);
      } /*webkit 内核浏览器*/
      input::-moz-placeholder {
        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: rgba(213, 216, 223, 1);
      } /*Mozilla Firefox 19+*/
      input:-moz-placeholder {
        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: rgba(213, 216, 223, 1);
      } /*Mozilla Firefox 4 to 18*/
      input:-ms-input-placeholder {
        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: rgba(213, 216, 223, 1);
      } /*Internet Explorer 10+*/
    }
    .footer-class {
      // background-color: #f00;
      cursor: pointer;
      height: 30px;
      display: flex;
      justify-content: center;

      .two {
        width: 72px;
        height: 30px;
        border-radius: 4px;
        background-color: #f8ac59;
        border-color: #f8ac59;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #fff;
        margin-top: 134px;
        margin-left: 110px;
      }
    }
    .el-form-item {
      margin-bottom: 0;
      height: 50px !important;
    }
    .el-input__icon {
      line-height: 0px !important;
    }
  }
}
.form_item1{
      /deep/input{
          text-transform:uppercase;
      }
        }
        .form_item1{
          text-transform:uppercase;
        }
</style>
