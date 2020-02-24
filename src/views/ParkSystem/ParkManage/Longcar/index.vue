<template>
  <div class="hard-setparamClass">
    <div class="setparam-container">
      <span @click="Eclipse" class="download" v-show="moban" v-if="!isShowExcel">下载长租车模板</span>
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
          <span v-if="zengjiaczc">
            <el-button
              v-if="!back"
              v-show="!istable"
              class="newadd"
              type="text"
              @click="addor"
            >新增长租车</el-button>
          </span>
          <span>
            <el-button v-show="istable" class="newaddcp" type="text" @click="clear">返回上一级</el-button>
          </span>
          <span>
            <el-button v-show="back" class="newaddcp" type="text" @click="clear1">返回上一级</el-button>
          </span>
          <el-upload
            v-show="!isShowExcel"
            v-if="daoruczc"
            action="#"
            multiple
            :before-upload="beforeUpload"
            :limit="1"
          >
            <el-button
              v-if="!back"
              v-show="!istable"
              size="small"
              type="primary"
              class="add-btn1"
            >导入长租车</el-button>
          </el-upload>
          <div>
            <span v-if="!isShowExcel" v-show="!istable">
              <input
                v-if="!back"
                class="search"
                @keyup.enter="search"
                v-model="orderNo"
                placeholder="请输入搜索内容"
              />
            </span>
            <!-- 清除按钮和查询按钮 -->
            <span class="btn" v-if="!isShowExcel" v-show="!istable&&!back" @click="search">
              <svg-icon icon-class="search1" />
            </span>
          </div>
        </div>
        <!-- 长租车列表 -->
        <el-table
          v-if="!isShowExcel"
          v-show="!istable"
          :data="tableData"
          style="width: 100%"
          empty-text="暂无数据"
          class="tablesss"
         >
          <el-table-column prop="car_number" label="车牌号" min-width="200">
            <template slot-scope="scope">
              <p class="car_number">{{scope.row.car_number}}</p>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="车主姓名" min-width="200">
            <template slot-scope="scope">
              <p class="car_number">{{scope.row.name}}</p>
            </template>
          </el-table-column>
          <el-table-column prop="phone" label="车主电话" min-width="200">
            <template slot-scope="scope">
              <p class="car_number">{{scope.row.phone}}</p>
            </template>
          </el-table-column>
          <el-table-column
            prop="car_position"
            label="车位号"
            min-width="260"
            :render-header="renderHeader"
          >
            <template slot-scope="scope">
              <p class="car_number">{{scope.row.car_position}}</p>
            </template>
            <!-- <template slot-scope="scope">
              <span :class="{active:scope.row.state===1}">{{scope.row.state===1?"未售":'' }}</span>
              <span>{{scope.row.state===2?"已售":'' }}</span>
              <span :class="{actived:scope.row.state===3}">{{scope.row.state===3?"已出租":'' }}</span>
            </template>-->
          </el-table-column>
          <el-table-column prop="order_number" label="订单号" min-width="200"></el-table-column>
          <el-table-column prop="centons" label="备注信息" min-width="280"></el-table-column>
          <el-table-column label="操作" min-width="280">
            <template slot-scope="scope">
              <el-button class="el-btn11" v-if="xufei" type="text" @click="compile(scope.row)">续费</el-button>
              <el-button class="el-btn22" v-if="zhangdan" type="text" @click="bill(scope.row)">账单</el-button>
              <el-button class="el-btn33" v-if="shanchu" type="text" @click="del(scope.row)">删除</el-button>
              <el-button
                class="el-btn44"
                v-if="caozuojl"
                type="text"
                @click="handle(scope.row)"
              >操作记录</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 长租车账单列表 -->
        <el-table
          v-if="istable"
          :data="tablelist"
          style="width: 100%"
          empty-text="暂无数据"
          class="table_FOUR"
         >
          <el-table-column prop="car_type" label="车位号" min-width="300"></el-table-column>
          <el-table-column prop="start_time" label="开始时间" min-width="300" />
          <el-table-column label="续费时长" width="300">
            <template slot-scope="scope">
              <span v-if="scope.row.moth!=='0'">{{scope.row.moth}}个月</span><span v-if="scope.row.moth==='0'">导入数据，结束时间为：{{scope.row.end_time}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="price" label="收费金额（元）" min-width="300">
            <template slot-scope="scope">
              <span class="svg_tubiao" style="margin-right:5px;" v-if="scope.row.price_type===1">
                <svg-icon icon-class="weixin" />
              </span>
              <span class="svg_tubiao" style="margin-right:5px;" v-if="scope.row.price_type===2">
                <svg-icon icon-class="zhifubao" />
              </span>
              <span class="svg_tubiao" style="margin-right:5px;" v-if="scope.row.price_type===3">
                <svg-icon icon-class="xianjin" />
              </span>
              <span class="svg_tubiao" style="margin-right:5px;" v-if="scope.row.price_type===4">
                <svg-icon icon-class="yinghangka" />
              </span>
              <span>{{ scope.row.price}}</span>
              <span v-if="scope.row.refund_price!=='0.00'">(已退{{scope.row.refund_price}})</span>
            </template>
          </el-table-column>
          <el-table-column prop="price" label="余额（元）" min-width="300"></el-table-column>
          <el-table-column label="操作" min-width="200">
            <template slot-scope="scope">
              <el-button class="el-btn55" type="text" @click="refund(scope.row)">申请退款</el-button>
              <el-button class="el-btn44" type="text" @click="handlees(scope.row)">操作记录</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
      <!-- 展示Excel -->
      <div v-if="isShowExcel" class="table-box-one">
        <div class="table-box">
          <el-table
            v-if="isShowExcel"
            class="tablesss1"
            empty-text="正在解析..."
            :data="excelData"
            row-class-name="myRow"
            cell-class-name="myCell"
            style="width: 100%; height:100%;"
          >
            <el-table-column prop="car_number" label="车牌号" min-width="100" />
            <el-table-column prop="name" label="车主姓名" min-width="100" />
            <el-table-column prop="phone" label="车主电话" min-width="100" />
            <el-table-column label="车位号" min-width="300">
              <template slot-scope="scope">
                <div >
                  <p
                    v-for="(itme,index) in scope.row.list"
                    :key="index"
                  >{{itme.car_type}}（开始时间：{{itme.start_time}}；结束时间：{{itme.end_time}}）</p>
                </div>
                <!-- <p>{{scope.row.car_type}}（开始时间：{{scope.row.start_time}}；长租时长：{{scope.row.moth}}个月）</p> -->
              </template>
            </el-table-column>
            <el-table-column v-if="prop.length===5" prop="centons" label="原因" min-width="100" />
          </el-table>
        </div>
      </div>
      <!-- 搜索分页 -->
      <div class="block" v-if="!isShowExcel" v-show="searchs&&!zhangdanfenye">
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
      <div class="block" v-if="!isShowExcel" v-show="!searchs&&!zhangdanfenye">
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
       <!-- 账单分页 -->
      <div class="block" v-if="!isShowExcel" v-show="!searchs&&zhangdanfenye">
        <p class="record-data">共 {{ pageNums }}页,共 {{ totalPage }}条</p>
        <el-pagination
          background
          :page-size="10"
          layout="prev, pager, next, jumper"
          :total="totalPage"
          :current-page.sync="currentPage"
          @current-change="handleCurrentChange2"
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
    <!-- 新增长租车 -->
    <el-dialog
      title="新增长租车"
      :visible.sync="centerDialogVisible1"
      :append-to-body="true"
      center
      class="addparkings"
      top="16vh"
      :close-on-click-modal="false"
      width="822px"
     >
      <div class="box-fold">
        <div class="box-fold-one">添加车牌号</div>

        <div v-for="(item,index) in dynamicValidateForm" :key="index" class="my-form-item">
          <div :class="isshow(index)">
            <div class="main-inp">
              <span class="label-name">车牌号{{index+1}}：</span>
              <input v-model="item.num" class="input_one form_item1" />
              <span class="add-icon" @click="addNewItem" v-if="index==0">
                <i class="el-icon-plus"></i>
              </span>
              <span class="add-icon" @click="deleteThisItem(index)" v-if="index!=0">
                <i class="el-icon-close"></i>
              </span>
              <span class="add-icon add-btnss" @click="zhedie(index)">
                <i :class="item.show?'el-icon-arrow-down' :'el-icon-arrow-right' "></i>
              </span>
            </div>
            <div class="yanzheng">
              <div v-if="shows" v-show="index2===index">请输入车牌号</div>
              <div v-if="showsss" v-show="index2===index">请输入正确的车牌号</div>
            </div>
            <div class="main-inp">
              <span class="label-name">车主名：</span>
              <input v-model="item.name" class="input_name" />
              <span class="label-name3 label-left">车主电话：</span>
              <input v-model="item.phone" oninput="value=value.replace(/[^\d]/g,'')" />
            </div>
            <div class="yanzheng1" style="display:flex;">
              <div class="one-d" v-if="shows1" v-show="index2===index">请输入姓名</div>
              <div class="two-d" v-if="shows2" v-show="index2===index">请输入电话号码</div>
              <div class="two-d" v-if="showsss1" v-show="index2===index">请输入正确的电话号码</div>
            </div>
            <div class="main-inp">
              <span class="label-name">车辆品牌：</span>
              <input v-model="item.brand" placeholder="选填" class="input_name" />
              <span class="label-name3 label-left">车辆颜色：</span>
              <input v-model="item.color" placeholder="选填" />
            </div>
            <div class="yanzheng"></div>
            <div class="main-inp">
              <span class="label-name">车辆型号：</span>
              <input v-model="item.model" placeholder="选填" class="input_name" />
              <span class="label-name3 label-left">购车日期：</span>
              <el-date-picker
              @blur="changedcp_one1(index)"
                v-model="item.times"
                type="date"
                placeholder="选填">
              </el-date-picker>
              <!-- <input v-model="item.times" placeholder="选填" /> -->
            </div>
            <div class="yanzheng"></div>
            <div class="main-inp">
              <span class="label-name1">是否指定进出口：</span>
              <el-radio-group v-model="item.raido" @change="labelfou(index)">
                <el-radio label="2">是</el-radio>
                <el-radio  label="1">否</el-radio>
              </el-radio-group>
            </div>
            <div class="main-inp" v-if="item.raido==='2'">
              <el-checkbox-group v-model="item.type">
                <el-checkbox  v-for="(itam,indexs) in mengang" :key="indexs" class="checkboxs" :label="itam.id" name="type">{{ itam.door_post_name }}</el-checkbox>
              </el-checkbox-group>
            </div>
            <div class="main-inp main-inp1" style="position:relative">
              <span class="label-name5">备注：</span>
              <textarea v-model="item.centes" class="input_beizhu" />
            </div>
          </div>
        </div>

        <div class="box-fold-one box-fold-one-dcp">绑定车位</div>
        <div v-for="(item,index) in bindparking" :key="index+10" class="my-form-item">
          <div :class="isshows(index)">
            <div class="main-inp">
              <span class="label-name">车位号{{index+1}}：</span>
              <!-- <input v-model="item.carport" @input="changcar" /> -->
              <el-select
                class="form_item1"
                v-model="item.carport"
                filterable
                placeholder
                @change="changcar(index)"
              >
                <el-option
                  v-for="item1 in chewei"
                  :key="item1.id"
                  :label="chewihao+item1.car_number+louceng+item1.floor"
                  :value="item1.car_number+','+item1.floor"
                ></el-option>
              </el-select>
              <span class="add-icon" @click="addNewItemss" v-if="index==0">
                <i class="el-icon-plus"></i>
              </span>
              <span class="add-icon" @click="deleteThisItemss(index)" v-if="index!=0">
                <i class="el-icon-close"></i>
              </span>
            </div>
            <div class="yanzheng">
              <div v-if="shows3" v-show="index4==index">请输入车位号</div>
              <div v-show="shows6" v-if="index3==index">此车位已被出租</div>
              <!-- <div v-show="shows7" v-if="index3==index">该车位不存在</div> -->
            </div>
            <div class="main-inp">
              <span class="label-name2">长租开始时间：</span>
                <el-date-picker
                @blur="changedcp_one(index)"
                v-model="item.longtime"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
              <!-- <input v-model="item.longtime" /> -->
              <span class="label-name3 label-left">长租时长：</span>
              <input
                type="text"
                v-model="item.longduration"
                @input="changeNumber"
                oninput="value=value.replace(/[^\d]/g,'')"
              />
              <span class="yue" style="margin-left:8px;">月</span>
            </div>
            <div class="yanzheng1" style="display:flex;">
              <div class="two-d" v-if="shows5" v-show="index4==index">请输入长租时长</div>
            </div>
            <div class="main-inp">
              <span class="label-name">应收金额：</span>
              <input
                @change="changejine"
                onkeyup="this.value= this.value.match(/\d+(\.\d{0,2})?/) ? this.value.match(/\d+(\.\d{0,2})?/)[0] : ''"
                v-model="item.shouldbe"
              />
              <span class="yue" style="margin-left:8px;">元</span>
            </div>
          </div>
        </div>
      </div>
      <!-- 合计金额 -->
      <div class="money">
        合计金额:
        <span class="money-one">{{ inputmoney }}</span> 元
      </div>
      <div class="footer-class">
        <span @click="submitForm">确认</span>
      </div>
    </el-dialog>
    <!-- 续费 -->
    <el-dialog
      title="续费"
      :visible.sync="vtrenew"
      :append-to-body="true"
      center
      class="addparkings"
      top="16vh"
      :close-on-click-modal="false"
      width="822px"
     >
      <div class="box-fold">
        <div class="box-fold-one">添加车牌号</div>
        <div v-for="(item,index) in xufeuFrom1" :key="index" class="my-form-item">
          <div :class="isshow1(index)">
            <div class="main-inp">
              <span class="label-name">车牌号{{index+1}}：</span>
              <input v-model="item.car_number" class="input_one form_item1" />
              <span class="add-icon" @click="addNewItem1" v-if="index==0">
                <i class="el-icon-plus"></i>
              </span>
              <span class="add-icon" @click="deleteThisItem1(index)" v-if="index!=0">
                <i class="el-icon-close"></i>
              </span>
              <span class="add-icon add-btnss" @click="zhedie1(index)">
                <i :class="item.show?'el-icon-arrow-down' :'el-icon-arrow-right' "></i>
              </span>
            </div>
            <div class="yanzheng">
              <div v-if="shows" v-show="index2===index">请输入车牌号</div>
              <div v-if="showsss" v-show="index2===index">请输入正确的车牌号</div>
            </div>
            <div class="main-inp">
              <span class="label-name">车主名：</span>
              <input v-model="item.car_name" class="input_name" />
              <span class="label-name3 label-left">车主电话：</span>
              <input v-model="item.phone" oninput="value=value.replace(/[^\d]/g,'')" />
            </div>
            <div class="yanzheng1" style="display:flex;">
              <div class="one-d" v-if="shows1" v-show="index2===index">请输入姓名</div>
              <div class="two-d" v-if="shows2" v-show="index2===index">请输入电话号码</div>
              <div class="two-d" v-if="showsss1" v-show="index2===index">请输入正确的电话号码</div>
            </div>
            <div class="main-inp">
              <span class="label-name">车辆品牌：</span>
              <input v-model="item.car_brand" placeholder="选填" class="input_name" />
              <span class="label-name3 label-left">车辆颜色：</span>
              <input v-model="item.car_color" placeholder="选填" />
            </div>
            <div class="yanzheng"></div>
            <div class="main-inp">
              <span class="label-name">车辆型号：</span>
              <input v-model="item.car_model" placeholder="选填" class="input_name" />
              <span class="label-name3 label-left">购车日期：</span>
               <el-date-picker
               @blur="changedcp_one2(index)"
                v-model="item.car_date"
                type="date"
                placeholder="选填">
              </el-date-picker>
              <!-- <input v-model="item.car_date" placeholder="选填" /> -->
            </div>
            <div class="yanzheng"></div>
            <div class="main-inp">
              <span class="label-name1">是否指定进出口：</span>
              <el-radio-group v-model="item.car_into" @change="labelfou1(index)" >
                <el-radio :label="2">是</el-radio>
                <el-radio :label="1">否</el-radio>
              </el-radio-group>
            </div>
            <div class="main-inp" v-if="item.car_into===2">
              <el-checkbox-group v-model="item.door_id">
                   <el-checkbox  v-for="(itam,indexs) in mengang" :key="indexs" class="checkboxs" :label="itam.id" name="type">{{ itam.door_post_name }}</el-checkbox>
              </el-checkbox-group>
            </div>
            <div class="main-inp main-inp1" style="position:relative">
              <span class="label-name5">备注：</span>
              <textarea v-model="item.centons" class="input_beizhu" />
            </div>
          </div>
        </div>

        <div class="box-fold-one box-fold-one-dcp">
          绑定车位
          <span class="add-iconss" @click="unify">统一续时</span>
        </div>
        <div v-for="(item,index) in xufeiFrom2" :key="index+10" class="my-form-item">
          <div :class="isshows1(index)">
            <div class="main-inp">
              <span class="label-name">车位号{{index+1}}：</span>
              <input v-model="item.car_type" v-if="index<=isjiebang" :disabled="index<=isjiebang" />
              <el-select
                class="form_item1"
                v-model="item.carport"
                filterable
                placeholder
                @change="changcar1(index)"
                v-if="index>isjiebang"
              >
                <el-option
                  v-for="item1 in chewei"
                  :key="item1.id"
                  :label="chewihao+item1.car_number+louceng+item1.floor"
                  :value="item1.car_number+','+item1.floor"
                ></el-option>
              </el-select>
              <span class="add-icon" @click="addNewItemss1" v-if="index==0">
                <i class="el-icon-plus"></i>
              </span>

              <span
                class="add-icons"
                @click="deleteThisItemss1(index)"
                v-if="index!=0 && index <lengths"
              >解绑</span>
              <span class="add-icon" @click="deleteThisItemssdcp(index)" v-if="index>=lengths">
                <i class="el-icon-close"></i>
              </span>
            </div>
            <div class="yanzheng">
              <div v-if="shows3" v-show="index4==index">请输入车位号</div>
              <div v-show="shows6" v-if="index3==index">此车位已被出租</div>
            </div>
            <div class="main-inp">
              <span class="label-name2">长租开始时间：</span>
                <el-date-picker
                @blur="changedcp_one3(index)"
                v-model="item.start_time"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
              <!-- <input v-model="item.start_time" /> -->
              <span class="label-name3 label-left">长租时长：</span>
              <input
                type="text"
                v-model="item.moth"
                @input="changeNumber1"
                oninput="value=value.replace(/[^\d]/g,'')"
              />
              <span class="yue" style="margin-left:8px;">月</span>
            </div>
            <div class="yanzheng1" style="display:flex;">
              <div class="two-d" v-if="shows5" v-show="index4==index">请输入长租时长</div>
            </div>
            <div class="main-inp">
              <span class="label-name">应收金额：</span>
              <input
                v-model="item.price"
                onkeyup="this.value= this.value.match(/\d+(\.\d{0,2})?/) ? this.value.match(/\d+(\.\d{0,2})?/)[0] : ''"
              />
              <span class="yue" style="margin-left:8px;">元</span>
            </div>
          </div>
        </div>
      </div>
      <!-- 合计金额 -->
      <div class="money">
        合计金额:
        <span class="money-one">{{inputmoney1}}</span> 元
      </div>
      <div class="footer-class">
        <span @click="renewalconfirmation">确认</span>
      </div>
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
    <!-- 账单操作记录 -->
    <el-dialog
      title="操作记录"
      :visible.sync="operationss1"
      :append-to-body="true"
      center
      class="operationnote2"
      top="35vh"
      :close-on-click-modal="false"
      width="24.43%"
     >
      <el-form
        :label-position="labelPosition"
        label-width="110px"
        :model="check"
        class="el-myclass"
        ref="Specialvehicle"
        hide-required-asterisk
        disabled
      >
        <el-form-item label="上次收费员:">
          <el-input v-model="check.user_name" @keydown.native.enter="from" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="上次收费时间:">
          <el-input v-model="check.time" @keydown.native.enter="from" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div class="footer-class">
        <span @click="from">确认</span>
      </div>
    </el-dialog>
    <!-- //操作记录详情 -->
    <el-dialog
      title="操作记录"
      :visible.sync="operationss2"
      :append-to-body="true"
      center
      class="operationnotess"
      top="30vh"
      :close-on-click-modal="false"
      width="26.04%"
     >
      <el-form
        :label-position="labelPosition"
        label-width="120px"
        :model="check"
        class="el-myclass"
        ref="Specialvehicle"
        hide-required-asterisk
        disabled
      >
        <el-form-item label="上次收费员:">
          <el-input v-model="check.user_name" @keydown.native.enter="from" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="上次收费时间:">
          <el-input v-model="check.time" @keydown.native.enter="from" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="上次退款人:">
          <el-input v-model="check.user_refund" @keydown.native.enter="from" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="上次退款时间:">
          <el-input v-model="check.time" @keydown.native.enter="from" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="上次审核人:">
          <el-input
            v-model="check.shenhe_user_name"
            @keydown.native.enter="from"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="上次审核时间:">
          <el-input v-model="check.shenhe_time" @keydown.native.enter="from" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="上次审核结果:">
          <el-input
            @keydown.native.enter="from"
            autocomplete="off"
            :value="'拒绝：'+check.shenhe_jieguo"
          ></el-input>
        </el-form-item>
      </el-form>
      <div class="footer-class">
        <span @click="from">确认</span>
      </div>
    </el-dialog>
    <!-- 删除 -->
    <el-dialog
      title="提示"
      :visible.sync="remove"
      :append-to-body="true"
      center
      class="reminder"
      top="35vh"
      :close-on-click-modal="false"
      width="380px"
     >
      <div class="footer-one">
        <p>将该数据下的长租车与车位解绑并删除账单明细，您确定要删除吗？</p>
      </div>
      <div class="footer-class">
        <span class="one" @click="cancel">取消</span>
        <span class="two" @click="sumbitshanchu">确认</span>
      </div>
    </el-dialog>

    <!-- 绑定并收费 -->
    <el-dialog
      title="绑定并收费"
      :visible.sync="Bindandcharge"
      :append-to-body="true"
      center
      class="reminders"
      top="35vh"
      :close-on-click-modal="false"
      width="500px"
     >
      <div class="footer-one">
        <p>
          您将收取:
          <span>{{ inputmoney }}</span> 元
        </p>
      </div>
      <div class="footer-two" style="display:flex">
        <label class="footer-dcp">请选择收费方式：</label>
        <el-radio-group v-model="charge">
          <el-radio label="1" style="margin-left:10px">
            <svg-icon class="svg_tubiao_two" icon-class="weixin" style="margin-right:10px;" />微信
          </el-radio>
          <el-radio label="2" style="margin-left:30px">
            <svg-icon class="svg_tubiao_two" icon-class="zhifubao" style="margin-right:10px;" />支付宝
          </el-radio>
          <el-radio label="3" style="margin-left:10px">
            <svg-icon class="svg_tubiao_two" icon-class="xianjin" style="margin-right:10px;" />现金
          </el-radio>
          <el-radio label="4" style="margin-left:30px">
            <svg-icon class="svg_tubiao_two" icon-class="yinghangka" style="margin-right:10px;" />银行卡
          </el-radio>
        </el-radio-group>
      </div>
      <div class="footer-class">
        <span class="two" @click="minitabtwo">确认</span>
      </div>
    </el-dialog>
    <!-- 续费 -->
    <el-dialog
      title="续费"
      :visible.sync="Bindandvntrew"
      :append-to-body="true"
      center
      class="reminders"
      top="35vh"
      :close-on-click-modal="false"
      width="500px"
     >
      <div class="footer-one">
        <p>
          您将收取:
          <span>{{inputmoney1}}</span> 元
        </p>
      </div>
      <div class="footer-two" style="display:flex">
        <label class="footer-dcp">请选择收费方式：</label>
        <el-radio-group v-model="zhifu">
          <el-radio label="1" style="margin-left:10px">
            <svg-icon class="svg_tubiao_two" icon-class="weixin" style="margin-right:10px;" />微信
          </el-radio>
          <el-radio label="2" style="margin-left:30px">
            <svg-icon class="svg_tubiao_two" icon-class="zhifubao" style="margin-right:10px;" />支付宝
          </el-radio>
          <el-radio label="3" style="margin-left:10px">
            <svg-icon class="svg_tubiao_two" icon-class="xianjin" style="margin-right:10px;" />现金
          </el-radio>
          <el-radio label="4" style="margin-left:30px">
            <svg-icon class="svg_tubiao_two" icon-class="yinghangka" style="margin-right:10px;" />银行卡
          </el-radio>
        </el-radio-group>
      </div>
      <div class="footer-class">
        <span class="two" @click="querenFrom">确认</span>
      </div>
    </el-dialog>
    <!-- 解绑车位 -->
    <el-dialog
      title="提示"
      :visible.sync="Unbundlingparking"
      :append-to-body="true"
      center
      class="reminder1"
      top="35vh"
      :close-on-click-modal="false"
      width="380px"
      :before-close="handleClose"
     >
      <div class="footer-one">
        <p class="p1">
          您确认要解绑车位
          <span class="p_span">{{jiebangchewei}}</span>？
        </p>
        <p class="p2">注：解绑后会少一个车位名额</p>
      </div>
      <div class="footer-class">
        <span class="one" @click="callof">取消</span>
        <span class="two" @click="acknowledgement">确认</span>
      </div>
    </el-dialog>
    <!-- 申请退款 -->
    <el-dialog
      title="申请退款"
      :visible.sync="application"
      :append-to-body="true"
      center
      class="specialvehicles"
      top="35vh"
      :model="drawback"
      :close-on-click-modal="false"
      width="450px"
     >
      <el-form
        :label-position="labelPosition"
        label-width="75px"
        class="el-myclass"
        ref="Specialvehicle"
        hide-required-asterisk
      >
        <el-form-item label="退租时长:">
          <el-input
            @input="changeinput"
            placeholder="可以退半月"
            v-model="drawback.hire"
            class="form_item"
            @keydown.native.enter="Submitarefund"
            autocomplete="off"
          ></el-input>
          <span class="unls">月</span>
        </el-form-item>
        <div class="yanzhengss">
          <div v-show="tuikuan">请输入退租时长</div>
        </div>
        <el-form-item label="退款金额:">
          <el-input
            class="default"
            disabled
            v-model="drawback.money"
            @keydown.native.enter="Submitarefund"
            autocomplete="off"
          ></el-input>
          <span class="unls">元</span>
        </el-form-item>

        <div class="yanzhengss">
          <div v-show="tuikuan1">请输入退款金额</div>
        </div>

        <el-form-item label="*退款理由:" class="input_two">
          <el-input
            v-model="drawback.reason"
            @keydown.native.enter="Submitarefund"
            autocomplete="off"
            class="input textarea"
            rows="4"
            type="textarea"
          ></el-input>
          <div class="yanzhengss1">
            <div v-show="tuikuan2">请输入退款理由</div>
          </div>
        </el-form-item>
      </el-form>
      <div class="footer-class">
        <span @click="Submitarefund">确认</span>
      </div>
    </el-dialog>
    <!-- 统一续时 -->
    <el-dialog
      title="统一续时"
      :visible.sync="unifiedrenewal"
      :append-to-body="true"
      center
      class="reminder_lable"
      top="35vh"
      :before-close="handleClose1"
      :close-on-click-modal="false"
      width="500px"
     >
      <div class="footer-one">
        <span class="lable_name_">请输入长租时长：</span>
        <input
          type="text"
          v-model="renewal"
          oninput="value=value.replace(/[^\d]/g,'')"
          placeholder="所有车位续同样月数"
        />
      </div>
      <div class="footer-class">
        <span class="two" @click="uniform">确认</span>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import "@/assets/fonts/iconfont.js";
import axios from "axios";
import { Message } from "element-ui";
import {
  longcarlist,
  longcarcw,
  addlongcar,
  longcarbill,
  longlistshow,
  dellonglist,
  longdrawback,
  unbundle,
  recordList,
  longsearch,
  longdownloadcar,
  introgression,
  confirmation,
  longcarcheweihao,
  postdownloads,
  //
  operatingRecord,
  carSearch
} from "@/api/parkCar";
import { postSelect_button } from "@/api/Jurisdiction1";
import moment from "moment";
import $ from "jquery";
import {  postDoorListId } from '@/api/hardware'
// data数据
export default {
  components: {},
  data() {
    return {
      mengang:[],
      chewihao: "车位号：",
      louceng: " 楼层：",
      chewinicheng: `车位号（ — 已到期  — 快到期 ）`,
      tuikuandanjia: "",
      moban: false,
      renewal: "",
      unifiedrenewal: false,
      operationss2: false,
      check: {
        shenhe_user_name: "",
        shenhe_time: "",
        time: "",
        user_name: "",
        shenhe_jieguo: "",
        user_refund: ""
      },
      operationss1: false,
      drawback: {
        hire: "",
        money: "",
        reason: ""
      },
      carid: "",
      jiebangi: "",
      Unbundlingparking: false,
      key: null,
      index2: null,
      index3: null,
      index4: null,
      showsss: false,
      showsss1: false,
      index1: null,
      tuikuan: false,
      tuikuan1: false,
      tuikuan2: false,
      application: false,
      istable: false,
      Bindandvntrew: false, //确认续费
      vtrenew: false, //续费
      charge: "1", //收费方式
      zhifu: "1",
      Bindandcharge: false, //绑定并收费
      remove: false, //删除
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
      shows: false,
      shows1: false,
      shows2: false,
      shows3: false,
      shows4: false,
      shows5: false,
      shows6: false,
      shows7: false,
      centerDialogVisible1: false,
      tablelist: [],
      //车牌号
      dynamicValidateForm: [
        {
          name: "", //车主名字
          num: "", //车牌号
          phone: "", //电话
          brand: "", //品牌
          model: "", //型号
          color: "", //颜色
          times: "", //日期
          raido: "1", //指定进出口
          type: [], //门岗
          centes: "", //备注
          show: true
        }
      ],
      //绑定车位
      bindparking: [
        {
          carport: "",
          car_type: "", //车位号
          longtime: "", //长租开始时间
          longduration: "", //长租时长
          shouldbe: "", //应式金额
          price_dan: "", //单价
          car_position_id: "", //车位类型id
          floor: "",
          shows: true
        }
      ],
      //添加表单数据
      AddFrom: {
        car_number: "", //车牌号
        car_name: "", //姓名
        phone: "", //电话
        car_brand: "", //品牌
        car_color: "", //颜色
        car_model: "", //型号
        car_date: "", //日期
        car_into: "", //指点进出口
        door_id: [], //门岗
        centons: "", //备注
        car_position: "", //车位号
        car_position_id: "", //车位类型id
        start_time: "", //开始时间
        moth: "", //月
        price: "", //总价
        price_dan: "", //单价
        price_type: "", //付费方式
        floor: ""
      },
      xufeuFrom1: [
        {
          car_name: "", //车主名字
          car_number: "", //车牌号
          phone: "", //电话
          car_brand: "", //品牌
          car_model: "", //型号
          car_color: "", //颜色
          car_date: "", //日期
          car_into: 1, //指定进出口
          door_id: [], //门岗
          centons: "", //备注
          show: null
        }
      ],
      //绑定车位
      xufeiFrom2: [
        {
          carport: "",
          car_type: "", //车位号
          start_time: "", //长租开始时间
          moth: "", //长租时长
          price: "", //应式金额
          price_dan: "", //单价
          car_position_id: "", //车位类型id
          show: null
        }
      ],
      Changeparkingcar: {
        car_type_name: null, //车位类型
        number: null, //车位号
        centons: null, //备注
        state: null, //车位状态
        house_number: null, //关联房屋
        car_price: null,
        car_type: null,
        floor: null
      },
      Changecar: {
        car_type_id: null, //车位类型id
        number: null, //车位号
        centons: null, //备注
        house_number: null, //关联房屋
        price: null,
        floor: null
      },
      //操作记录
      operations: {
        name: "",
        time: "",
        ip: ""
      },
      chewei: [],
      //查询
      orderNo: null,
      user: {}, //当前列信息
      excelData: [],
      prop: ["1", "2", "3", "4"],
      listid: null, //导入文件id
      longlistid: null, //当前列id
      ids: null,
      uid: null,
      tuikuanid: null,
      car_number_state: "",
      ispanding: null,
      tuikuanzhuangtai: "",
      jiebangchewei: "",
      lengths: "",
      isjiebang: false,
      time_one: null,
      xufeiid: "",
      zengjiaczc: false,
      daoruczc: false,
      xufei: false,
      zhangdan: false,
      shanchu: false,
      caozuojl: false,
      timesd: "",
      cindex: 0,
      cindex1: 0,
      lengthyz: "",
      biaozhunshij:'',
      zhangdanfenye:false,
      fenyeid:''
    };
  },
  async created() {
    this.time();
    //获取列表
    const user = JSON.parse(localStorage.getItem("userInfo"));
    this.parkid = user.Communityid;
    this.park_id = user.Communityid;
    this.uid = user.uid;
    //获取车位列表
    this.parkList();
    // 拉取用户信息按钮权限
    this.userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const { Communityid, uid } = this.userInfo;
    const auth_id = this.$route.meta.auth_id;
    const { data } = await postSelect_button({ Communityid, uid, auth_id });
    console.log(data);
    data.forEach(v => {
      if (v.auth_name === "新增长租车") {
        this.zengjiaczc = true;
      }
      if (v.auth_name === "导入长租车") {
        this.daoruczc = true;
      }
      if (v.auth_name === "续费") {
        this.xufei = true;
      }
      if (v.auth_name === "账单") {
        this.zhangdan = true;
      }
      if (v.auth_name === "删除") {
        this.shanchu = true;
      }
      if (v.auth_name === "操作记录") {
        this.caozuojl = true;
      }
      if (v.auth_name === "下载长租车模板") {
        this.moban = true;
      }
    });
    const data1 = await longcarcheweihao({ parkid: this.parkid });
    console.log(data1, "车位号");
    this.chewei = data1.data;
     const data2 = await postDoorListId ({
      parkid:this.parkid
    })
    console.log(data2, "mengang");
    this.mengang=data2.data
  },
  methods: {
    changedcp_one(index){
      console.log( this.bindparking[index].longtime );
      var year =  this.bindparking[index].longtime.getFullYear();
      var month= this.bindparking[index].longtime.getMonth()+1;
      var day = this.bindparking[index].longtime.getDate()
      var formatting = year+'-'+month+'-'+day
      console.log( formatting );
      this.bindparking[index].longtime=formatting
      
},
 changedcp_one1(index){
//  this.dynamicValidateForm.forEach(v => {
//    v.times= //修改数据date
//         new Date().getFullYear() +
//         "-" +
//         this.appendZero(new Date().getMonth() + 1) +
//         "-" +
//         this.appendZero(new Date().getDate());
      
//  })
      var year =  this.dynamicValidateForm[index].times.getFullYear();
      var month= this.dynamicValidateForm[index].times.getMonth()+1;
      var day = this.dynamicValidateForm[index].times.getDate()
      var formatting = year+'-'+month+'-'+day
      this.dynamicValidateForm[index].times=formatting
},
changedcp_one2(index){
      // this.xufeuFrom1.forEach(v => {
      //    v.car_date= //修改数据date
      //   new Date().getFullYear() +
      //   "-" +
      //   this.appendZero(new Date().getMonth() + 1) +
      //   "-" +
      //   this.appendZero(new Date().getDate());
      // console.log( this.formDate(v.car_date) );
      
      // })
       var year =  this.xufeuFrom1[index].car_date.getFullYear();
      var month= this.xufeuFrom1[index].car_date.getMonth()+1;
      var day = this.xufeuFrom1[index].car_date.getDate()
      var formatting = year+'-'+month+'-'+day
      this.xufeuFrom1[index].car_date=formatting
},
changedcp_one3(index){
      // this.xufeiFrom2.forEach(v => {
      //    v.start_time= //修改数据date
      //   new Date().getFullYear() +
      //   "-" +
      //   this.appendZero(new Date().getMonth() + 1) +
      //   "-" +
      //   this.appendZero(new Date().getDate());
      // console.log( this.formDate(v.start_time) );
      
      // })
        var year =  this.xufeiFrom2[index].start_time.getFullYear();
      var month= this.xufeiFrom2[index].start_time.getMonth()+1;
      var day = this.xufeiFrom2[index].start_time.getDate()
      var formatting = year+'-'+month+'-'+day
      this.xufeiFrom2[index].start_time=formatting
},
    labelfou(index){
        this.dynamicValidateForm[index].type=[]
    },
    labelfou1(index){
        this.xufeuFrom1[index].door_id=[]
    },
    renderHeader(h, { column, $index }) {
      return (
        <div>
          <span>{column.label}</span>（<span style="color:#FF0000"> — </span>
          已到期<span style="color:#FF6600"> — </span>快到期 ）
        </div>
      );
    },
    handleClose1() {
      this.vtrenew = true;
      this.unifiedrenewal = false;
    },
    handleClose() {
      this.Unbundlingparking = false;
      this.vtrenew = true;
    },
    changeinput() {
      console.log(123);
      this.drawback.money = this.tuikuandanjia * this.drawback.hire || 0;
    },
    //续费提交
    async querenFrom() {
      this.xufeuFrom1.forEach(v => {
        if (v.car_number) {
          this.AddFrom.car_number += v.car_number + ",";
        }
        if (v.car_number) {
          this.AddFrom.car_name += v.car_name + ",";
        }
        if (v.car_number) {
          this.AddFrom.phone += v.phone + ",";
        }
        if (v.car_number) {
          this.AddFrom.car_brand += v.car_brand + ",";
        }
        if (v.car_number) {
          this.AddFrom.car_color += v.car_color + ",";
        }
        if (v.car_number) {
          this.AddFrom.car_model += v.car_model + ",";
        }
        if (v.car_number) {
          this.timesd = this.formDate(v.car_date) || 0;
          this.AddFrom.car_date += this.timesd + ",";
        }
        if (!v.door_id.length && v.car_number) {
          this.AddFrom.door_id += v.door_id + ",";
        } else if (v.door_id.length && v.car_number) {
          // console.log(v.door_id, "12222222");
          v.door_id = v.door_id.join("-");
          this.AddFrom.door_id += v.door_id + ",";
        }
        if (v.car_number) {
          this.AddFrom.centons += v.centons + ",";
        }
        if (v.car_number) {
          this.AddFrom.car_into += v.car_into + ",";
        }
      });
      this.AddFrom.centons = this.AddFrom.centons.substring(
        0,
        this.AddFrom.centons.lastIndexOf(",")
      );
      this.AddFrom.door_id = this.AddFrom.door_id.substring(
        0,
        this.AddFrom.door_id.lastIndexOf(",")
      );
      this.AddFrom.car_into = this.AddFrom.car_into.substring(
        0,
        this.AddFrom.car_into.lastIndexOf(",")
      );
      this.AddFrom.car_date = this.AddFrom.car_date.substring(
        0,
        this.AddFrom.car_date.lastIndexOf(",")
      );
      this.AddFrom.car_model = this.AddFrom.car_model.substring(
        0,
        this.AddFrom.car_model.lastIndexOf(",")
      );
      this.AddFrom.car_color = this.AddFrom.car_color.substring(
        0,
        this.AddFrom.car_color.lastIndexOf(",")
      );
      this.AddFrom.car_brand = this.AddFrom.car_brand.substring(
        0,
        this.AddFrom.car_brand.lastIndexOf(",")
      );
      this.AddFrom.phone = this.AddFrom.phone.substring(
        0,
        this.AddFrom.phone.lastIndexOf(",")
      );
      this.AddFrom.car_name = this.AddFrom.car_name.substring(
        0,
        this.AddFrom.car_name.lastIndexOf(",")
      );
      this.AddFrom.car_number = this.AddFrom.car_number.substring(
        0,
        this.AddFrom.car_number.lastIndexOf(",")
      );
      this.xufeiFrom2.forEach(v => {
        if (v.car_type) {
          this.AddFrom.car_position += v.car_type + ",";
        }
        if (v.start_time && v.car_type) {
          this.time_one = this.formDate(v.start_time);
          this.AddFrom.start_time += this.time_one + ",";
        }
        if (v.car_type) {
          this.AddFrom.moth += v.moth + ",";
        }
        if (v.car_type) {
          this.AddFrom.price += v.price + ",";
        }
        if (v.car_type) {
          this.AddFrom.price_dan += v.price_dan + ",";
        }
        if (v.car_type) {
          this.AddFrom.car_position_id += v.car_position_id + ",";
        }
        if (v.car_type) {
          this.AddFrom.floor += v.floor + ",";
        }
      });
      this.AddFrom.car_position = this.AddFrom.car_position.substring(
        0,
        this.AddFrom.car_position.lastIndexOf(",")
      );
      this.AddFrom.start_time = this.AddFrom.start_time.substring(
        0,
        this.AddFrom.start_time.lastIndexOf(",")
      );
      this.AddFrom.moth = this.AddFrom.moth.substring(
        0,
        this.AddFrom.moth.lastIndexOf(",")
      );
      this.AddFrom.price = this.AddFrom.price.substring(
        0,
        this.AddFrom.price.lastIndexOf(",")
      );
      this.AddFrom.price_dan = this.AddFrom.price_dan.substring(
        0,
        this.AddFrom.price_dan.lastIndexOf(",")
      );
      this.AddFrom.car_position_id = this.AddFrom.car_position_id.substring(
        0,
        this.AddFrom.car_position_id.lastIndexOf(",")
      );
      this.AddFrom.floor = this.AddFrom.floor.substring(
        0,
        this.AddFrom.floor.lastIndexOf(",")
      );
      console.log(this.AddFrom, "数据");

      let data = await confirmation({
        car_number: this.AddFrom.car_number,
        car_name: this.AddFrom.car_name,
        phone: this.AddFrom.phone,
        car_brand: this.AddFrom.car_brand,
        car_color: this.AddFrom.car_color,
        car_model: this.AddFrom.car_model,
        car_date: this.AddFrom.car_date,
        car_into: this.AddFrom.car_into,
        door_id: this.AddFrom.door_id,
        centons: this.AddFrom.centons,
        car_position: this.AddFrom.car_position,
        car_position_id: this.AddFrom.car_position_id,
        start_time: this.AddFrom.start_time,
        moth: this.AddFrom.moth,
        price: this.AddFrom.price,
        parkid: this.parkid,
        price_dan: this.AddFrom.price_dan,
        price_type: this.zhifu,
        id: this.xufeiid,
        uid: this.uid,
        floor: this.AddFrom.floor
      });
      // console.log(data, "数据");
      // console.log(this.AddFrom);
      // console.log(this.charge);
      if (data.msg === 1) {
        Message({
          type: "success",
          message: "修改成功"
        });
        this.parkList();
        this.Bindandvntrew = false;
      } else {
        Message.error("修改失败");
      }
    },
    //续费确认
    renewalconfirmation() {
      var phoneReg = /^1[34578]\d{9}$/;
      var carNumberReg = /^(([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z](([0-9]{5}[DF])|([DF]([A-HJ-NP-Z0-9])[0-9]{4})))|([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z][A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳使领]))$/;
      for (var i = 0; i < this.xufeuFrom1.length; i++) {
        for (var j = 0; j < this.xufeiFrom2.length; j++) {
          if (this.xufeuFrom1.length == 1 && this.xufeiFrom2.length == 1) {
                  if (!this.xufeuFrom1[i].car_number) {
                      this.shows = true;
                      this.index2 = i;
                      setTimeout(() => {
                        this.shows = false;
                      }, 2000);
                    } else if (!this.xufeuFrom1[i].car_name) {
                      this.index2 = i;
                      this.shows1 = true;
                      setTimeout(() => {
                        this.shows1 = false;
                      }, 2000);
                    } else if (!this.xufeuFrom1[i].phone) {
                      this.index2 = i;
                      this.shows2 = true;
                      setTimeout(() => {
                        this.shows2 = false;
                      }, 2000);
                    } else if (this.xufeuFrom1[i].car_number && this.xufeuFrom1[i].phone) {
                    this.xufeuFrom1[i].car_number=this.xufeuFrom1[i].car_number.toUpperCase()
                      if (!carNumberReg.test(this.xufeuFrom1[i].car_number)) {
                        this.index2 = i;
                        this.showsss = true;
                        setTimeout(() => {
                          this.showsss = false;
                        }, 2000);
                      } else if (!phoneReg.test(this.xufeuFrom1[i].phone)) {
                        this.index2 = i;
                        this.showsss1 = true;
                        setTimeout(() => {
                          this.showsss1 = false;
                        }, 2000);
                      } else if (!this.xufeiFrom2[j].moth) {
                        this.shows5 = true;
                        this.index4 = j;
                        setTimeout(() => {
                          this.shows5 = false;
                        }, 2000);
                      } else if (this.xufeuFrom1[i].car_number && this.xufeuFrom1[i].phone && this.xufeuFrom1[i].car_name && this.xufeiFrom2[j].moth) {
                        this.vtrenew = false;
                        this.Bindandvntrew = true;
                      }
                    }
          }else if (this.xufeuFrom1.length !== 1 && this.xufeiFrom2.length == 1){
                   if(!this.xufeuFrom1[0].car_number){
                        this.shows = true;
                        this.index2 = 0;
                        setTimeout(() => {
                          this.shows = false;
                        }, 2000);
                   }else if(!this.xufeuFrom1[0].car_name){
                        this.index2 = i;
                        this.shows1 = true;
                        setTimeout(() => {
                          this.shows1 = false;
                        }, 2000);
                   }else if (!this.xufeuFrom1[0].phone) {
                        this.index2 = 0;
                        this.shows2 = true;
                        setTimeout(() => {
                          this.shows2 = false;
                        }, 2000);
                      }else if (this.xufeuFrom1[0].car_number && this.xufeuFrom1[0].phone){
                         this.xufeuFrom1[0].car_number=this.xufeuFrom1[0].car_number.toUpperCase()
                         console.log( this.xufeuFrom1[0].car_number);
                           if (!carNumberReg.test(this.xufeuFrom1[0].car_number)) {
                          this.index2 = 0;
                          this.showsss = true;
                          setTimeout(() => {
                            this.showsss = false;
                          }, 2000);
                        } else if (!phoneReg.test(this.xufeuFrom1[0].phone)) {
                          this.index2 = 0;
                          this.showsss1 = true;
                          setTimeout(() => {
                            this.showsss1 = false;
                          }, 2000);
                        } else if(!this.xufeuFrom1[i].car_number){
                            if(!this.xufeiFrom2[0].moth){
                               this.shows5 = true;
                                this.index4 = 0;
                                setTimeout(() => {
                                  this.shows5 = false;
                                }, 2000);
                            }else {
                              if(!this.shows6){
                                this.vtrenew = false;
                                this.Bindandvntrew = true;
                              }
                            }
                        }else if(this.xufeuFrom1[i].car_number) {
                          this.xufeuFrom1[i].car_number=this.xufeuFrom1[i].car_number.toUpperCase()
                                if (!carNumberReg.test(this.xufeuFrom1[i].car_number)) {
                              this.index2 = i;
                              this.showsss = true;
                              setTimeout(() => {
                                this.showsss = false;
                              }, 2000);
                            } else if (!this.xufeiFrom2[0].moth){
                               this.shows5 = true;
                                this.index4 = 0;
                                setTimeout(() => {
                                  this.shows5 = false;
                                }, 2000);
                            }else {
                              if(!this.shows6){
                                this.vtrenew = false;
                                this.Bindandvntrew = true;
                              }
                            }
                        }
                      } 
                 
        }else if (this.xufeuFrom1.length == 1 && this.xufeiFrom2.length !== 1){
            if (!this.xufeuFrom1[0].car_number) {
              this.shows = true;
              this.index2 = 0;
              setTimeout(() => {
                this.shows = false;
              }, 2000);
            } else if (!this.xufeuFrom1[0].car_name) {
              this.index2 = 0;
              this.shows1 = true;
              setTimeout(() => {
                this.shows1 = false;
              }, 2000);
            } else if (!this.xufeuFrom1[0].phone) {
              this.index2 = 0;
              this.shows2 = true;
              setTimeout(() => {
                this.shows2 = false;
              }, 2000);
            }else if (this.xufeuFrom1[0].car_number && this.xufeuFrom1[0].phone){
               this.xufeuFrom1[0].car_number=this.xufeuFrom1[0].car_number.toUpperCase()
                 if (!carNumberReg.test(this.xufeuFrom1[0].car_number)) {
                this.index2 = 0;
                this.showsss = true;
                setTimeout(() => {
                  this.showsss = false;
                }, 2000);
              } else if (!phoneReg.test(this.xufeuFrom1[0].phone)) {
                this.index2 = 0;
                this.showsss1 = true;
                setTimeout(() => {
                  this.showsss1 = false;
                }, 2000);
              } else if(this.cindex1===this.key){
               if (!this.xufeiFrom2[j].moth) {
                this.shows5 = true;
                this.index4 = j;
                setTimeout(() => {
                  this.shows5 = false;
                }, 2000);
              }else if (this.xufeiFrom2[j].moth&&!this.shows6&&! this.shows5){
                   this.vtrenew = false;
                     this.Bindandvntrew = true;
              }
              }else if (this.cindex1!==this.key){
                  if(!this.xufeiFrom2[this.cindex1].carport){
                            if (!this.xufeiFrom2[j].moth) {
                        this.shows5 = true;
                        this.index4 = j;
                        setTimeout(() => {
                          this.shows5 = false;
                        }, 2000);
                      }else if (this.xufeiFrom2[j].moth&&!this.shows6&&!this.shows5){
                          this.vtrenew = false;
                            this.Bindandvntrew = true;
                      }
                  }else if(this.xufeiFrom2[this.cindex1].carport){
                     if (!this.xufeiFrom2[this.cindex1].moth) {
                        this.shows5 = true;
                        this.index4 = this.cindex1;
                        setTimeout(() => {
                          this.shows5 = false;
                        }, 2000);
                      }else if (this.xufeiFrom2[this.cindex1].moth &&!this.shows6&&!this.shows5){
                             this.vtrenew = false;
                            this.Bindandvntrew = true;
                      }
                  }
              }
              
            }





        }else if(this.xufeuFrom1.length !== 1 && this.xufeiFrom2.length !== 1){
             if(!this.xufeuFrom1[0].car_number){
                        this.shows = true;
                        this.index2 = 0;
                        setTimeout(() => {
                          this.shows = false;
                        }, 2000);
                   }else if(!this.xufeuFrom1[0].car_name){
                        this.index2 = i;
                        this.shows1 = true;
                        setTimeout(() => {
                          this.shows1 = false;
                        }, 2000);
                   }else if (!this.xufeuFrom1[0].phone) {
                        this.index2 = 0;
                        this.shows2 = true;
                        setTimeout(() => {
                          this.shows2 = false;
                        }, 2000);
                      }else if (this.xufeuFrom1[0].car_number && this.xufeuFrom1[0].phone){
                         this.xufeuFrom1[0].car_number=this.xufeuFrom1[0].car_number.toUpperCase()
                         console.log( this.xufeuFrom1[0].car_number);
                           if (!carNumberReg.test(this.xufeuFrom1[0].car_number)) {
                          this.index2 = 0;
                          this.showsss = true;
                          setTimeout(() => {
                            this.showsss = false;
                          }, 2000);
                        } else if (!phoneReg.test(this.xufeuFrom1[0].phone)) {
                          this.index2 = 0;
                          this.showsss1 = true;
                          setTimeout(() => {
                            this.showsss1 = false;
                          }, 2000);
                        } else if(!this.xufeuFrom1[i].car_number){
                            if(!this.xufeiFrom2[0].moth){
                               this.shows5 = true;
                                this.index4 = 0;
                                setTimeout(() => {
                                  this.shows5 = false;
                                }, 2000);
                            }else {
                              if(!this.shows6){
                                this.vtrenew = false;
                                this.Bindandvntrew = true;
                              }
                            }
                        }else if(this.xufeuFrom1[i].car_number) {
                          this.xufeuFrom1[i].car_number=this.xufeuFrom1[i].car_number.toUpperCase()
                                if (!carNumberReg.test(this.xufeuFrom1[i].car_number)) {
                              this.index2 = i;
                              this.showsss = true;
                              setTimeout(() => {
                                this.showsss = false;
                              }, 2000);
                            } else if(this.cindex1===this.key){
               if (!this.xufeiFrom2[j].moth) {
                this.shows5 = true;
                this.index4 = j;
                setTimeout(() => {
                  this.shows5 = false;
                }, 2000);
              }else if (this.xufeiFrom2[j].moth&&!this.shows6&&! this.shows5){
                   this.vtrenew = false;
                     this.Bindandvntrew = true;
              }
              }else if (this.cindex1!==this.key){
                  if(!this.xufeiFrom2[this.cindex1].carport){
                            if (!this.xufeiFrom2[j].moth) {
                        this.shows5 = true;
                        this.index4 = j;
                        setTimeout(() => {
                          this.shows5 = false;
                        }, 2000);
                      }else if (this.xufeiFrom2[j].moth&&!this.shows6&&!this.shows5){
                          this.vtrenew = false;
                            this.Bindandvntrew = true;
                      }
                  }else if(this.xufeiFrom2[this.cindex1].carport){
                     if (!this.xufeiFrom2[this.cindex1].moth) {
                        this.shows5 = true;
                        this.index4 = this.cindex1;
                        setTimeout(() => {
                          this.shows5 = false;
                        }, 2000);
                      }else if (this.xufeiFrom2[this.cindex1].moth &&!this.shows6&&!this.shows5){
                             this.vtrenew = false;
                            this.Bindandvntrew = true;
                      }
                  }
              }



















                          }
                      } 










        }
            }
          }
      console.log(this.xufeuFrom1, this.xufeiFrom2);
    },
    //续时确认
    uniform() {
      console.log(this.renewal);
      this.xufeiFrom2.forEach(v => {
        v.moth = Number(this.renewal);
        v.price = v.moth * Number(v.price_dan);
      });
      this.vtrenew = true;
      this.unifiedrenewal = false;
    },
    //统一续时
    unify() {
      this.vtrenew = false;
      this.unifiedrenewal = true;
      this.renewal = "";
    },
    //账单操作记录
    async handlees(row) {
      // console.log(row)
      let id = row.id;
      this.typeseate = false;
      this.check = {
        shenhe_user_name: "",
        shenhe_time: "",
        time: "",
        user_name: "",
        shenhe_jieguo: ""
      };
      const data = await recordList({ id });
      console.log(data);
      if (data.data.state === 0) {
        this.operationss1 = true;
      } else {
        if (data.data.state === 1) {
          this.operationss1 = true;
        } else if (data.data.state === 2) {
          this.operationss2 = true;
        }
      }
      data.data.time = moment(data.data.time * 1000).format(
        "YYYY-MM-DD HH:mm:ss"
      );
      data.data.shenhe_time = moment(data.data.shenhe_time * 1000).format(
        "YYYY-MM-DD HH:mm:ss"
      );
      this.check = data.data;
    },
    //确认解绑
    async acknowledgement() {
      const data = await unbundle({
        id: this.carid
      });
      if (data.msg == 1) {
        Message({
          type: "success",
          message: "解绑成功"
        });
        this.parkList();
        this.Unbundlingparking = false;
      } else {
        Message.error("解绑失败");
        this.Unbundlingparking = false;
      }
    },
    //取消解绑
    callof() {
      this.Unbundlingparking = false;
      this.vtrenew = true;
    },
    //提交退款
    async Submitarefund() {
      if (!this.drawback.hire) {
        this.tuikuan = true;
        setTimeout(() => {
          this.tuikuan = false;
        }, 2000);
      } else if (!this.drawback.money) {
        this.tuikuan1 = true;
        setTimeout(() => {
          this.tuikuan1 = false;
        }, 2000);
      } else if (!this.drawback.reason) {
        this.tuikuan2 = true;
        setTimeout(() => {
          this.tuikuan2 = false;
        }, 2000);
      } else if (this.tuikuanzhuangtai === 2) {
        this.application = false;
        Message.error("抱歉，不能重复申请");
      } else {
        const data = await longdrawback({
          id: this.tuikuanid,
          time: this.drawback.hire,
          price: this.drawback.money,
          centon: this.drawback.reason,
          parkid: this.parkid,
          uid: this.uid
        });
        console.log(data);
        if (data.msg === 1) {
          Message({
            type: "success",
            message: "申请成功"
          });
          this.application = false;
          this.$bus.$emit("updataes");
        } else {
          Message.error("删除失败");
          this.application = false;
        }
      }
    },
    //申请退款
    refund(row) {
      this.tuikuandanjia = row.car_type_price;
      console.log(row);
      this.tuikuanid = row.id;
      this.tuikuanzhuangtai = row.state;
      this.drawback = {
        hire: "",
        money: "",
        reason: ""
      };
      this.application = true;
    },
    //确认续费
    confirm() {
      this.vtrenew = false;
      this.Bindandvntrew = true;
    },
    //新增
    addNewItem() {
      this.dynamicValidateForm.push({
        name: "", //车主名字
        num: "", //车牌号
        phone: "", //电话
        brand: "", //品牌
        model: "", //型号
        color: "", //颜色
        times: "", //日期
        raido: "1", //指定进出口
        type: [], //门岗
        centes: "", //备注
        show: false
      });
      this.lengthyz = this.dynamicValidateForm.length - 1;
    },
    zhedie(index) {
      console.log(index);
      this.dynamicValidateForm[index].show = !this.dynamicValidateForm[index]
        .show;
    },
    isshow(index) {
      if (!this.dynamicValidateForm[index].show) {
        return "item-disable";
      }
    },
    deleteThisItem(index) {
      this.dynamicValidateForm.splice(index, 1);
    },

    addNewItemss() {
      this.bindparking.push({
        carport: "", //车位号
        longtime: this.time(), //长租开始时间
        longduration: "", //长租时长
        shouldbe: "", //应式金额
        price_dan: "", //单价
        car_position_id: "", //车位类型id
        shows: true,
        floor: ""
      });
      this.time();
    },
    zhediess(index) {
      console.log(index);
      this.bindparking[index].shows = !this.bindparking[index].shows;
    },
    isshows(index) {
      if (!this.bindparking[index].shows) {
        return "item-disable";
      }
    },
    deleteThisItemss(index) {
      this.bindparking.splice(index, 1);
    },
    //续费
    addNewItem1() {
      this.xufeuFrom1.push({
        car_name: "", //车主名字
        car_number: "", //车牌号
        phone: "", //电话
        car_brand: "", //品牌
        car_model: "", //型号
        car_color: "", //颜色
        car_date: "", //日期
        car_into: 1, //指定进出口
        door_id: [], //门岗
        centons: "", //备注
        show: false
      });
      this.cindex = this.xufeuFrom1.length - 1;
      this.shows6 = false;
    },
    zhedie1(index) {
      this.xufeuFrom1[index].show = !this.xufeuFrom1[index].show;
    },
    isshow1(index) {
      if (!this.xufeuFrom1[index].show) {
        return "item-disable";
      }
    },
    deleteThisItem1(index) {
      this.xufeuFrom1.splice(index, 1);
      this.cindex = this.xufeuFrom1.length - 1;
    },

    addNewItemss1() {
      this.xufeiFrom2.push({
        carport: "",
        car_type: "", //车位号
        start_time: this.time1(), //长租开始时间
        moth: "", //长租时长
        price: "", //应式金额
        price_dan: "", //单价
        car_position_id: "", //车位类型id
        show: true,
        floor: ""
      });
      this.cindex1 = this.xufeiFrom2.length - 1;
      console.log(this.cindex1, this.key);
    },
    zhediess1(index) {
      console.log(index);
      this.xufeiFrom2[index].shows = !this.xufeiFrom2[index].shows;
    },
    isshows1(index) {
      if (this.xufeiFrom2[index].shows) {
        return "item-disable";
      }
    },
    //解绑
    deleteThisItemss1(index) {
      this.Unbundlingparking = true;
      this.vtrenew = false;
      this.jiebangchewei = this.xufeiFrom2[index].car_type;
      this.carid = this.xufeiFrom2[index].car_position_id;
    },
    deleteThisItemssdcp(index) {
      this.xufeiFrom2.splice(index, 1);
      this.cindex1 = this.xufeiFrom2.length - 1;
    },
    //删除数据
    async del(row) {
      this.remove = true;
      let { id } = row;
      this.longlistid = id;
    },
    //确认删除
    async sumbitshanchu() {
      const { msg } = await dellonglist({ id: this.longlistid });
      if (msg === 1) {
        Message({
          type: "success",
          message: "删除成功"
        });
        this.parkList();
        this.remove = false;
      } else {
        this.remove = false;
        Message.error("删除失败");
      }
    },
    //确认绑定
    async minitabtwo() {
      this.dynamicValidateForm.forEach(v => {
        if (v.num) {
          this.AddFrom.car_number += v.num + ",";
        }
        if (v.num) {
          this.AddFrom.car_name += v.name + ",";
        }
        if (v.num) {
          this.AddFrom.phone += v.phone + ",";
        }
        if (v.num) {
          this.AddFrom.car_brand += v.brand + ",";
        }
        if (v.num) {
          this.AddFrom.car_color += v.color + ",";
        }
        if (v.num) {
          this.AddFrom.car_model += v.model + ",";
        }
        if (v.num) {
          v.times = this.formDate(v.times) || 0;
          this.AddFrom.car_date += v.times + ",";
        }
        if (v.num) {
          v.type = v.type.join("-");
          this.AddFrom.door_id += v.type + ",";
        }
        if (v.num) {
          this.AddFrom.centons += v.centes + ",";
        }
        if (v.num) {
          this.AddFrom.car_into += v.raido + ",";
        }
      });
      this.AddFrom.centons = this.AddFrom.centons.substring(
        0,
        this.AddFrom.centons.lastIndexOf(",")
      );
      this.AddFrom.door_id = this.AddFrom.door_id.substring(
        0,
        this.AddFrom.door_id.lastIndexOf(",")
      );
      this.AddFrom.car_into = this.AddFrom.car_into.substring(
        0,
        this.AddFrom.car_into.lastIndexOf(",")
      );
      this.AddFrom.car_date = this.AddFrom.car_date.substring(
        0,
        this.AddFrom.car_date.lastIndexOf(",")
      );
      this.AddFrom.car_model = this.AddFrom.car_model.substring(
        0,
        this.AddFrom.car_model.lastIndexOf(",")
      );
      this.AddFrom.car_color = this.AddFrom.car_color.substring(
        0,
        this.AddFrom.car_color.lastIndexOf(",")
      );
      this.AddFrom.car_brand = this.AddFrom.car_brand.substring(
        0,
        this.AddFrom.car_brand.lastIndexOf(",")
      );
      this.AddFrom.phone = this.AddFrom.phone.substring(
        0,
        this.AddFrom.phone.lastIndexOf(",")
      );
      this.AddFrom.car_name = this.AddFrom.car_name.substring(
        0,
        this.AddFrom.car_name.lastIndexOf(",")
      );
      this.AddFrom.car_number = this.AddFrom.car_number.substring(
        0,
        this.AddFrom.car_number.lastIndexOf(",")
      );
      this.bindparking.forEach(v => {
        if (v.carport) {
          this.AddFrom.car_position += v.car_type + ",";
        }
        if (v.longtime && v.carport) {
          this.time_one = this.formDate(v.longtime);
          this.AddFrom.start_time += this.time_one + ",";
        }
        if (v.carport) {
          this.AddFrom.moth += v.longduration + ",";
        }
        if (v.carport) {
          this.AddFrom.price += v.shouldbe + ",";
        }
        if (v.carport) {
          this.AddFrom.price_dan += v.price_dan + ",";
        }
        if (v.carport) {
          this.AddFrom.car_position_id += v.car_position_id + ",";
        }
        if (v.carport) {
          this.AddFrom.floor += v.floor + ",";
        }
      });
      this.AddFrom.car_position = this.AddFrom.car_position.substring(
        0,
        this.AddFrom.car_position.lastIndexOf(",")
      );
      this.AddFrom.start_time = this.AddFrom.start_time.substring(
        0,
        this.AddFrom.start_time.lastIndexOf(",")
      );
      this.AddFrom.moth = this.AddFrom.moth.substring(
        0,
        this.AddFrom.moth.lastIndexOf(",")
      );
      this.AddFrom.price = this.AddFrom.price.substring(
        0,
        this.AddFrom.price.lastIndexOf(",")
      );
      this.AddFrom.price_dan = this.AddFrom.price_dan.substring(
        0,
        this.AddFrom.price_dan.lastIndexOf(",")
      );
      this.AddFrom.car_position_id = this.AddFrom.car_position_id.substring(
        0,
        this.AddFrom.car_position_id.lastIndexOf(",")
      );
      this.AddFrom.floor = this.AddFrom.floor.substring(
        0,
        this.AddFrom.floor.lastIndexOf(",")
      );
      this.AddFrom.floor = this.AddFrom.floor.substring(9);
      console.log(this.AddFrom.floor);
      let data = await addlongcar({
        car_number: this.AddFrom.car_number,
        car_name: this.AddFrom.car_name,
        phone: this.AddFrom.phone,
        car_brand: this.AddFrom.car_brand,
        car_color: this.AddFrom.car_color,
        car_model: this.AddFrom.car_model,
        car_date: this.AddFrom.car_date,
        car_into: this.AddFrom.car_into,
        door_id: this.AddFrom.door_id,
        centons: this.AddFrom.centons,
        car_position: this.AddFrom.car_position,
        car_position_id: this.AddFrom.car_position_id,
        start_time: this.AddFrom.start_time,
        moth: this.AddFrom.moth,
        price: this.AddFrom.price,
        parkid: this.parkid,
        price_dan: this.AddFrom.price_dan,
        price_type: this.charge,
        uid: this.uid,
        floor: this.AddFrom.floor
      });
      // console.log(data, "数据");
      // console.log(this.AddFrom);
      // console.log(this.charge);
      if (data.msg === 1) {
        Message({
          type: "success",
          message: "添加成功"
        });
        this.parkList();
        this.Bindandcharge = false;
      } else {
        Message.error("添加失败");
      }
    },
    //返回列表页
    ok() {
      this.isShowExcel = false;
      this.isError = false;
      this.isError = false;
      this.parkList()
    },
    // 返回上一页
    backToLastPage() {
      this.isShowExcel = false;
      // this.pageInfo.total = this.pt
      // this.pageInfo.pageNum = this.pn
      this.parkList();
    },
    // 分页设置
    handleCurrentChange(val) {
      this.currentPage = val;
      this.parkList();
    },
    async handleCurrentChange1(val) {
      let { data } = await longsearch({
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
    async handleCurrentChange2(val){
        let data = await longcarbill({
        id:this.fenyeid,
        page: val,
        size: this.pageSize
      });
      console.log(data);
      data.data.data.forEach(v => {
        v.start_time = moment(v.start_time * 1000).format("YYYY-MM-DD");
      });
      data.data.data.forEach(v=>{
        v.end_time=moment(v.end_time * 1000).format("YYYY-MM-DD");
       
      })
      this.tablelist = data.data.data;
      this.totalPage = data.data.total; // 总条数
      this.pageNums = data.data.pageNum; //总页数
    },
    //续费
    async compile(row) {
      this.shows6 = false;
      (this.AddFrom = {
        car_number: "", //车牌号
        car_name: "", //姓名
        phone: "", //电话
        car_brand: "", //品牌
        car_color: "", //颜色
        car_model: "", //型号
        car_date: "", //日期
        car_into: "", //指点进出口
        door_id: [], //门岗
        centons: "", //备注
        car_position: "", //车位号
        car_position_id: "", //车位类型id
        start_time: "", //开始时间
        moth: "", //月
        price: "", //总价
        price_dan: "", //单价
        price_type: "", //付费方式
        floor: ""
      }),
        (this.time_one = null);
      this.xufeuFrom1 = [
        {
          car_name: "", //车主名字
          car_number: "", //车牌号
          phone: "", //电话
          car_brand: "", //品牌
          car_model: "", //型号
          car_color: "", //颜色
          car_date: "", //日期
          car_into: "", //指定进出口
          door_id: [], //门岗
          centons: "", //备注
          show: null
        }
      ];
      this.xufeiFrom2 = [
        {
          carport: "",
          car_type: "", //车位号
          start_time: "", //长租开始时间
          moth: "", //长租时长
          price: "", //应式金额
          price_dan: "", //单价
          car_position_id: "", //车位类型id
          floor: "",
          show: null
        }
      ];
      console.log(row);
      //this.user=row
      this.vtrenew = true;
      let id = row.id;
      this.xufeiid = row.id;
      const data = await longlistshow({ id });
      console.log(data);
      data.data.car_list.forEach(v => {
        if (v.door_id) {
          v.door_id = v.door_id.split("-");
          v.door_id=v.door_id.map(Number)
          console.log(v.door_id, "门岗");
        } else {
          v.door_id = [];
        }
        if (v.car_date === 0) {
          v.car_date = "";
        } else {
          v.car_date = moment(v.car_date * 1000).format("YYYY-MM-DD");
        }
      });
      this.xufeuFrom1 = data.data.car_list;
      data.data.price_list.forEach(v => {
        v.start_time = moment(v.start_time * 1000).format("YYYY-MM-DD");
        v.end_time = moment(v.end_time * 1000).format("YYYY-MM-DD");
      });
      this.xufeiFrom2 = data.data.price_list;
      this.lengths = data.data.price_list.length;
      this.isjiebang = this.lengths - 1;
      this.key = this.lengths - 1;
      this.cindex1 = this.lengths - 1;
      this.cindex = this.lengths - 1;
      this.xufeiFrom2.forEach(async v => {
        v.moth = "";
        v.price = "";
        v.start_time = v.end_time;
        const data = await longcarcw({
          name: v.car_type,
          parkid: this.parkid,
          floor: v.floor
        });
        v.price_dan = data.data.car_price;
        console.log(v.price_dan, "11111111111111111111");
        v.carport = v.car_type + "," + v.floor;
      });
    },
    //操作记录
    handle(row) {
      console.log(row);
      const { id } = row;
      this.ids = id;
      this.operatingRecord();
      this.operationss = true;
    },
    // 获取操作记录列表
    async operatingRecord() {
      const { data } = await operatingRecord({
        state: 5,
        id: this.ids
      });
      console.log(data, "操作记录");
      data.time = moment(data.time * 1000).format("YYYY-MM-DD HH:mm:ss");
      data.admin_time = moment(data.admin_time * 1000).format(
        "YYYY-MM-DD HH:mm:ss"
      );
      this.operations = data;
    },
    from() {
      this.operationss2 = false;
      this.operationss1 = false;
    },
    //新增弹框打开
    addor() {
      this.shows6 = false;
      this.time_one = null;
      this.key = null;
      this.centerDialogVisible1 = true;
      this.charge = "1";
      // 去除验证
      (this.AddFrom = {
        car_number: "", //车牌号
        car_name: "", //姓名
        phone: "", //电话
        car_brand: "", //品牌
        car_color: "", //颜色
        car_model: "", //型号
        car_date: "", //日期
        car_into: "", //指点进出口
        door_id: "", //门岗
        centons: "", //备注
        car_position: "", //车位号
        car_position_id: "", //车位类型id
        start_time: "", //开始时间
        moth: "", //月
        price: "", //总价
        price_dan: "", //单价
        price_type: "" //付费方式
      }),
        (this.Specialvehicle = {});
      this.Specialvehicle.state = 1;
      (this.dynamicValidateForm = [
        {
          name: "", //车主名字
          num: "", //车牌号
          phone: "", //电话
          brand: "", //品牌
          model: "", //型号
          color: "", //颜色
          times: "", //日期
          raido: "1", //指定进出口
          type: [], //门岗
          centes: "", //备注
          show: true
        }
      ]),
        (this.bindparking = [
          {
            carport: "", //车位号
            longtime: this.time(),
            longduration: "", //长租时长
            shouldbe: null, //应式金额
            shows: true
          }
        ]);
    },
    //新增提交
    async submitForm() {
      var phoneReg = /^1[34578]\d{9}$/;
      var carNumberReg = /^(([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z](([0-9]{5}[DF])|([DF]([A-HJ-NP-Z0-9])[0-9]{4})))|([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z][A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳使领]))$/;
      for (var i = 0; i < this.dynamicValidateForm.length; i++) {
        if (this.dynamicValidateForm.length == 1) {
          if (!this.dynamicValidateForm[i].num) {
            this.shows = true;
            this.index2 = i;
            setTimeout(() => {
              this.shows = false;
            }, 2000);
          } else if (!this.dynamicValidateForm[i].name) {
            this.index2 = i;
            this.shows1 = true;
            setTimeout(() => {
              this.shows1 = false;
            }, 2000);
          } else if (!this.dynamicValidateForm[i].phone) {
            this.index2 = i;
            this.shows2 = true;
            setTimeout(() => {
              this.shows2 = false;
            }, 2000);
          } else if (
            this.dynamicValidateForm[i].num &&
            this.dynamicValidateForm[i].phone
          ) {
            this.dynamicValidateForm[i].num = this.dynamicValidateForm[
              i
            ].num.toUpperCase();
            if (!carNumberReg.test(this.dynamicValidateForm[i].num)) {
              this.index2 = i;
              this.showsss = true;
              setTimeout(() => {
                this.showsss = false;
              }, 2000);
            } else if (!phoneReg.test(this.dynamicValidateForm[i].phone)) {
              this.index2 = i;
              this.showsss1 = true;
              setTimeout(() => {
                this.showsss1 = false;
              }, 2000);
            } else {
              for (var j = 0; j < this.bindparking.length; j++) {
                if (this.bindparking.length == 1) {
                  if (!this.bindparking[j].carport) {
                    this.shows3 = true;
                    this.shows7 = false;
                    this.shows6 = false;
                    this.index4 = j;
                    setTimeout(() => {
                      this.shows3 = false;
                    }, 2000);
                  } else if (!this.bindparking[j].longduration) {
                    this.shows5 = true;
                    this.index4 = j;
                    setTimeout(() => {
                      this.shows5 = false;
                    }, 2000);
                  } else if (
                    this.bindparking[j].carport &&
                    this.bindparking[j].longduration
                  ) {
                    if (!this.shows6) {
                      this.centerDialogVisible1 = false;
                      this.Bindandcharge = true;
                    }
                  }
                } else {
                  if (
                    this.bindparking[this.key].carport &&
                    !this.bindparking[this.key].longduration
                  ) {
                    this.shows5 = true;
                    this.index4 = this.key;
                    setTimeout(() => {
                      this.shows5 = false;
                    }, 2000);
                    // } else if (this.bindparking[j].carport && this.bindparking[j].longduration && !this.shows7&&!this.shows6) {
                    // this.centerDialogVisible1 = false;
                    // this.Bindandcharge = true;
                  } else if (
                    this.bindparking[this.key].carport &&
                    this.bindparking[this.key].longduration
                  ) {
                    if (!this.shows6) {
                      this.centerDialogVisible1 = false;
                      this.Bindandcharge = true;
                    }
                  }
                }
              }
            }
          }
        } else {
          if (!this.dynamicValidateForm[0].num) {
            this.shows = true;
            this.index2 = 0;
            setTimeout(() => {
              this.shows = false;
            }, 2000);
          } else if (!this.dynamicValidateForm[0].name) {
            this.index2 = 0;
            this.shows1 = true;
            setTimeout(() => {
              this.shows1 = false;
            }, 2000);
          } else if (!this.dynamicValidateForm[0].phone) {
            this.index2 = 0;
            this.shows2 = true;
            setTimeout(() => {
              this.shows2 = false;
            }, 2000);
          } else if (
            this.dynamicValidateForm[0].num &&
            this.dynamicValidateForm[0].phone
          ) {
            this.dynamicValidateForm[0].num = this.dynamicValidateForm[0].num.toUpperCase();
            if (!carNumberReg.test(this.dynamicValidateForm[0].num)) {
              this.index2 = 0;
              this.showsss = true;
              setTimeout(() => {
                this.showsss = false;
              }, 2000);
            } else if (!phoneReg.test(this.dynamicValidateForm[0].phone)) {
              this.index2 = 0;
              this.showsss1 = true;
              setTimeout(() => {
                this.showsss1 = false;
              }, 2000);
            } else if (!this.dynamicValidateForm[this.lengthyz].num) {
              for (var j = 0; j < this.bindparking.length; j++) {
                if (this.bindparking.length == 1) {
                  if (!this.bindparking[j].carport) {
                    this.shows3 = true;
                    this.shows7 = false;
                    this.shows6 = false;
                    this.index4 = j;
                    setTimeout(() => {
                      this.shows3 = false;
                    }, 2000);
                  } else if (!this.bindparking[j].longduration) {
                    this.shows5 = true;
                    this.index4 = j;
                    setTimeout(() => {
                      this.shows5 = false;
                    }, 2000);
                  } else if (
                    this.bindparking[j].carport &&
                    this.bindparking[j].longduration
                  ) {
                    if (!this.shows6) {
                      this.centerDialogVisible1 = false;
                      this.Bindandcharge = true;
                    }
                  }
                } else {
                  if (
                    this.bindparking[this.key].carport &&
                    !this.bindparking[this.key].longduration
                  ) {
                    this.shows5 = true;
                    this.index4 = this.key;
                    setTimeout(() => {
                      this.shows5 = false;
                    }, 2000);
                    // } else if (this.bindparking[j].carport && this.bindparking[j].longduration && !this.shows7&&!this.shows6) {
                    // this.centerDialogVisible1 = false;
                    // this.Bindandcharge = true;
                  } else if (
                    this.bindparking[this.key].carport &&
                    this.bindparking[this.key].longduration
                  ) {
                    if (!this.shows6) {
                      this.centerDialogVisible1 = false;
                      this.Bindandcharge = true;
                    }
                  }
                }
              }
            } else if (this.dynamicValidateForm[this.lengthyz].num) {
              this.dynamicValidateForm[
                this.lengthyz
              ].num = this.dynamicValidateForm[this.lengthyz].num.toUpperCase();
              if (
                !carNumberReg.test(this.dynamicValidateForm[this.lengthyz].num)
              ) {
                this.index2 = this.lengthyz;
                this.showsss = true;
                setTimeout(() => {
                  this.showsss = false;
                }, 2000);
              } else {
                for (var j = 0; j < this.bindparking.length; j++) {
                  if (this.bindparking.length == 1) {
                    if (!this.bindparking[j].carport) {
                      this.shows3 = true;
                      this.shows7 = false;
                      this.shows6 = false;
                      this.index4 = j;
                      setTimeout(() => {
                        this.shows3 = false;
                      }, 2000);
                    } else if (!this.bindparking[j].longduration) {
                      this.shows5 = true;
                      this.index4 = j;
                      setTimeout(() => {
                        this.shows5 = false;
                      }, 2000);
                    } else if (
                      this.bindparking[j].carport &&
                      this.bindparking[j].longduration
                    ) {
                      if (!this.shows6) {
                        this.centerDialogVisible1 = false;
                        this.Bindandcharge = true;
                      }
                    }
                  } else {
                    if (
                      this.bindparking[this.key].carport &&
                      !this.bindparking[this.key].longduration
                    ) {
                      this.shows5 = true;
                      this.index4 = this.key;
                      setTimeout(() => {
                        this.shows5 = false;
                      }, 2000);
                      // } else if (this.bindparking[j].carport && this.bindparking[j].longduration && !this.shows7&&!this.shows6) {
                      // this.centerDialogVisible1 = false;
                      // this.Bindandcharge = true;
                    } else if (
                      this.bindparking[this.key].carport &&
                      this.bindparking[this.key].longduration
                    ) {
                      if (!this.shows6) {
                        this.centerDialogVisible1 = false;
                        this.Bindandcharge = true;
                      }
                    }
                  }
                }
              }
            }
          }
          // if (!this.dynamicValidateForm[this.lengthyz].num) {

          // }
          // if (this.dynamicValidateForm[this.lengthyz].num) {
          //    this.dynamicValidateForm[this.lengthyz].num=this.dynamicValidateForm[ithis.lengthyz].num.toUpperCase()
          //   if (!carNumberReg.test(this.dynamicValidateForm[this.lengthyz].num)) {
          //     this.index2 = this.lengthyz;
          //     this.showsss = true;
          //     setTimeout(() => {
          //       this.showsss = false;
          //     }, 2000);
          //   }
          // }else if (!this.dynamicValidateForm[this.lengthyz].num){
          //        for (var j = 0; j < this.bindparking.length; j++) {
          //         if (this.bindparking.length == 1) {
          //           if (!this.bindparking[0].carport) {
          //             this.shows3 = true;
          //             this.shows7 = false;
          //             this.shows6 = false;
          //             this.index4 = j;
          //             setTimeout(() => {
          //               this.shows3 = false;
          //             }, 2000);
          //           }
          //         }

          //           } else if (!this.bindparking[0].longduration) {
          //             this.shows5 = true;
          //             this.index4 = 0;
          //             setTimeout(() => {
          //               this.shows5 = false;
          //             }, 2000);
          //           } else if (
          //             this.bindparking[0].carport &&
          //             this.bindparking[0].longduration
          //           ) {
          //               if(!this.shows6){
          //               this.centerDialogVisible1 = false;
          //               this.Bindandcharge = true;
          //           }
          //       }
          // }
          //   else if (!this.dynamicValidateForm[0].num) {
          //     this.shows = true;
          //     this.index2 = 0;
          //     setTimeout(() => {
          //       this.shows = false;
          //     }, 2000);
          //   } else if (!this.dynamicValidateForm[0].name) {
          //     this.index2 = 0;
          //     this.shows1 = true;
          //     setTimeout(() => {
          //       this.index2 = null;
          //       this.shows1 = false;
          //     }, 2000);
          //   } else if (!this.dynamicValidateForm[0].phone) {
          //     this.index2 = 0;
          //     this.shows2 = true;
          //     setTimeout(() => {
          //       this.shows2 = false;
          //     }, 2000);
          //   } else if (
          //     this.dynamicValidateForm[0].num &&
          //     this.dynamicValidateForm[0].phone
          //   ) {
          //    this.dynamicValidateForm[0].num=this.dynamicValidateForm[0].num.toUpperCase()
          //     if (!carNumberReg.test(this.dynamicValidateForm[0].num)) {
          //       this.index2 = 0;
          //       this.showsss = true;
          //       setTimeout(() => {
          //         this.showsss = false;
          //       }, 2000);
          //     } else if (!phoneReg.test(this.dynamicValidateForm[0].phone)) {
          //       this.index2 = 0;
          //       this.showsss1 = true;
          //       setTimeout(() => {
          //         this.showsss1 = false;
          //       }, 2000);
          //     } else {
          //       for (var j = 0; j < this.bindparking.length; j++) {
          //         if (this.bindparking.length == 1) {
          //           if (!this.bindparking[0].carport) {
          //             this.shows3 = true;
          //             this.shows7 = false;
          //             this.shows6 = false;
          //             this.index4 = j;
          //             setTimeout(() => {
          //               this.shows3 = false;
          //             }, 2000);
          //           } else if (!this.bindparking[0].longduration) {
          //             this.shows5 = true;
          //             this.index4 = 0;
          //             setTimeout(() => {
          //               this.shows5 = false;
          //             }, 2000);
          //           } else if (
          //             this.bindparking[0].carport &&
          //             this.bindparking[0].longduration
          //           ) {
          //               if(!this.shows6){
          //               this.centerDialogVisible1 = false;
          //               this.Bindandcharge = true;
          //           }
          //           }
          //         } else {
          //           if (
          //             this.bindparking[this.key].carport &&
          //             !this.bindparking[this.key].longduration
          //           ) {
          //             this.shows5 = true;
          //             this.index4 = this.key;
          //             setTimeout(() => {
          //               this.shows5 = false;
          //             }, 2000);
          //             // } else if (this.bindparking[j].carport && this.bindparking[j].longduration && !this.shows7&&!this.shows6) {
          //             // this.centerDialogVisible1 = false;
          //             // this.Bindandcharge = true;
          //           } else if (
          //             this.bindparking[this.key].carport &&
          //             this.bindparking[this.key].longduration
          //           ) {
          //             longcarcw({
          //               name: this.bindparking[this.key].carport,
          //               parkid: this.parkid
          //             }).then(res => {
          //               // console.log(res);
          //               if (res.data === "没有当前车位不允许添加") {
          //                 this.shows7 = true;
          //                 this.shows3 = false;
          //                 this.shows6 = false;
          //                 this.index3 = this.key;
          //                 setTimeout(() => {
          //                   this.shows7 = false;
          //                 }, 2000);
          //               } else if (res.data.car_number_state === 2) {
          //                 this.shows6 = true;
          //                 this.index3 = this.key;
          //                 setTimeout(() => {
          //                   this.shows6 = false;
          //                 }, 2000);
          //               } else if (res.data.car_number_state === 1) {
          //                 this.centerDialogVisible1 = false;
          //                 this.Bindandcharge = true;
          //               }
          //             });
          //           }
          //         }
          //       }
          //     }
          //   }
          //   //
          // }
        }
      }
      console.log(this.dynamicValidateForm);
      console.log(this.bindparking);
      console.log(this.AddFrom, "添加的数据");
    },
    async changcar(index) {
      let obj = this.bindparking[index].carport.split(",");
      console.log(obj, "索引值");
      this.key = index;
      this.bindparking[index].longduration = "";
      let data = await longcarcw({
        floor: obj[1],
        name: obj[0],
        parkid: this.parkid
      });
      this.bindparking[index].car_type = obj[0];
      this.bindparking[index].floor = obj[1];
      console.log(this.bindparking[index].floor, "8988888888888888");
      this.bindparking[index].car_position_id = data.data.id;
      this.bindparking[index].price_dan = data.data.car_price;
      if (data.data.car_number_state === 1) {
        this.shows6 = false;
        this.shows7 = false;
      } else {
        this.shows7 = false;
        this.shows3 = false;
        this.shows6 = true;
        this.index3 = index;
      }
    },
    async changcar1(index) {
      console.log(index, "索引值");
      let obj = this.xufeiFrom2[index].carport.split(",");
      this.key = index;
      this.xufeiFrom2[index].moth = "";
      let data = await longcarcw({
        floor: obj[1],
        name: obj[0],
        parkid: this.parkid
      });
      // console.log(data, "8988888888888888");
      this.xufeiFrom2[index].car_type = obj[0];
      this.xufeiFrom2[index].floor = obj[1];
      this.xufeiFrom2[index].car_position_id = data.data.id;
      this.xufeiFrom2[index].price_dan = data.data.car_price;
      if (data.data.car_number_state === 1) {
        this.shows6 = false;
        this.shows7 = false;
      } else {
        this.shows7 = false;
        this.shows3 = false;
        this.shows6 = true;
        this.index3 = index;
      }
    },
    //获取当前时间
    time() {
      var longtime = //修改数据date
        new Date().getFullYear() +
        "-" +
        this.appendZero(new Date().getMonth() + 1) +
        "-" +
        this.appendZero(new Date().getDate());
      return longtime;
    },
    //获取当前时间
    time1() {
      var start_time = //修改数据date
        new Date().getFullYear() +
        "-" +
        this.appendZero(new Date().getMonth() + 1) +
        "-" +
        this.appendZero(new Date().getDate());
      return start_time;
    },
    //时间过滤加0
    appendZero(obj) {
      if (obj < 10) {
        return "0" + obj;
      } else {
        return obj;
      }
    },
    formDate(time) {
      const thisTime = time.replace(/ /g, "/");
      var nowTime = new Date(thisTime);
      nowTime = nowTime.getTime() / 1000;
      return nowTime;
    },
    changeNumber() {
      this.bindparking.forEach(v => {
        v.shouldbe = v.longduration * v.price_dan || 0;
      });
    },
    changeNumber1() {
      this.xufeiFrom2.forEach(v => {
        v.price = v.moth * v.price_dan || 0;
        // v.price = v.moth * Number(v.price_dan) || 0;
      });
    },
    changejine() {},
    //账单查询
    async bill(row) {
      console.log(row);
      this.currentPage=1
      this.fenyeid = row.id;
      let data = await longcarbill({
        id:this.fenyeid,
        page: this.currentPage,
        size: this.pageSize
      });
      console.log(data);
      data.data.data.forEach(v => {
        v.start_time = moment(v.start_time * 1000).format("YYYY-MM-DD");
      });
      data.data.data.forEach(v=>{
        v.end_time=moment(v.end_time * 1000).format("YYYY-MM-DD");
       
      })
      this.tablelist = data.data.data;
      this.totalPage = data.data.total; // 总条数
      this.pageNums = data.data.pageNum; //总页数
      this.istable = true;
      this.zhangdanfenye=true;
      this.searchs=false;
    },
    //查询
    async search() {
      //console.log(this.searchForm.orderNo);
      if (this.orderNo) {
        let { data } = await longsearch({
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
          this.back = true;
          this.searchs = true;
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
    clear1() {
      this.currentPage = 1;
      this.orderNo = "";
      this.tablelist = [];
      this.back = false;
      this.searchs = false;
      this.parkList();
    },
    //获取列表
    async parkList() {
      const { data } = await longcarlist({
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
      data.data.forEach(v => {
        v.centons;
      });
      this.tableData = data.data;
      this.totalPage = data.total; // 总条数
      this.pageNums = data.pageNum; //总页数
    },
    //下载车位模板
    async Eclipse() {
      let res = await longdownloadcar();
      console.log(res, "res");
      if (res.code === 200) {
        postdownloads({ name: res.msg }).then(res => {
          let blob = new Blob([res], {
            type:
              "application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          }); //console.log(blob);
          const fileName = "长租车模板.xls";
          if ("download" in document.createElement("a")) {
            // 非IE下载
            const elink = document.createElement("a");
            elink.download = fileName;
            elink.style.display = "none";
            elink.href = URL.createObjectURL(blob);
            document.body.appendChild(elink);
            elink.click();
            URL.revokeObjectURL(elink.href); // 释放URL 对象
            document.body.removeChild(elink);
          } else {
            // IE10+下载
            navigator.msSaveBlob(blob, fileName);
          }
        });
      }
    },
    //导入车位
    beforeUpload(file) {
      const { token } = JSON.parse(localStorage.getItem("userInfo"));
      var fd = new window.FormData();
      fd.append("excel", file);
      fd.append("parkid", this.parkid);
      axios
        // .post("http://yapi.txsqtech.com/public/park/v1.Carrental/car_dao", fd, {
          .post("http://test.txsqtech.com/park/v1.Carrental/car_dao", fd, {
          headers: {
            token
          }
        })
        .then(res => {
          console.log(res, "hahahah ");
          if (res.data.msg === 1) {
            //console.log(res, '本地的excel')
            res.data.data.msg.forEach(v => {
              v.start_time = moment(v.start_time * 1000).format(
                "YYYY-MM-DD HH:mm:ss"
              );
            });
            this.excelData = res.data.data.msg;
            console.log(this.excelData, "本地的excel");
            this.listid = res.data.data.id;
            // this.prop = ['1', '2', '3', '4', '5', ]
            //console.log(this.listid);

            this.isShowExcel = true;
          } else if (res.msg === 3) {
            // this.$router.push('/')
            alert("格式错误");
          }
        });
      return false; // 返回false不会自动上传
    },
    excelImport() {
      this.remindercar = true;
    },
    //取消
    cancel() {
      this.remove = false;
    },
    //确认导入
    async minitab() {
      let res = await introgression({
        parkid: this.parkid,
        id: this.listid,
        uid: this.uid
      });
      console.log(res);
      if (!res.data.info.length) {
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
        this.excelData = res.data.info;
        (this.prop = ["1", "2", "3", "4", "5"]), (this.isError = true);
      }
    },
    //清除
    clear() {
        this.orderNo = "";
      this.back = false;
      this.currentPage=1;
      this.tablelist = [];
      this.istable = false;
      this.parkList();
      this.zhangdanfenye=false;
    }
  },
  computed: {
    // getmoney () {
    //   this.bindparking.forEach(v => {
    //     // console.log(v.price_dan, "单价");
    //     // console.log(v.longduration, "时长");
    //     return (v.shouldbe = v.longduration * v.price_dan || 0);
    //   });
    // },
    inputmoney() {
      let str = "";
      let strs = Number(str);
      this.bindparking.forEach(v => {
        strs += Number(v.shouldbe);
        strs = strs || 0;
      });
      return strs.toFixed(2);
    },
    inputmoney1() {
      let str = "";
      let strs = Number(str);
      this.xufeiFrom2.forEach(v => {
        strs += Number(v.price);
        strs = strs || 0;
      });
      return strs.toFixed(2);
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
    font-size: 12px;
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
// /deep/.el-table .cell {
//   height: 40px !important;
//   line-height: 40px;
//   //overflow: hidden; /*超出部分隐藏*/
//   //text-overflow: ellipsis; /* 超出部分显示省略号 */
//   //white-space: nowrap; /*规定段落中的文本不进行换行 */
// }
// /deep/.el-table td {
//   padding: 0 0 0 0 !important;
// }
// /deep/.el-table th {
//   padding: 0 0 0 0 !important;
// }
.table_FOUR {
  /deep/ .cell {
    height: 60px !important;
    line-height: 60px;
    //overflow: hidden; /*超出部分隐藏*/
    //text-overflow: ellipsis; /* 超出部分显示省略号 */
    //white-space: nowrap; /*规定段落中的文本不进行换行 */
  }
  /deep/ td {
    padding: 0 0 0 0 !important;
  }
  /deep/ th {
    padding: 0 0 0 0 !important;
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
      padding: 0px 0;
    }
    /deep/.myCell {
      border-collapse: collapse;
    }
    /deep/.note {
      position: relative;
      .cell {
        // white-space: nowrap;
        // overflow: hidden;
        // text-overflow: ellipsis;
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
  left: 94px;
  padding: 0 8px;
  border-radius: 4px;
  width: 86px;
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
    /deep/.el-table td {
      padding: 15px 0 !important;
      padding: 0 !important;
      z-index: 222;
    }
    /deep/.el-table th {
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: rgba(144, 147, 153, 1);
      padding: 0 !important;
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
.newaddcp {
  display: inline-block;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  width: 86px;
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

.el-btn11 {
  display: inline-block;
  text-align: center;
  color: #fff;
  width: 52px;
  height: 30px;
  line-height: 0px;
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
  background: #bfbfbf;
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
.el-btn55 {
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
  background: #1fbba6;
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
.operationnote2 {
  /deep/.el-dialog {
    min-width: 380px;
    height: 240px;
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
      margin-top: 54px;
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
    height: 500px;
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
      margin-top: 314px;
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
  width: 40px;
  font-size: 24px;
  text-align: center;
  color: #999999;
  cursor: pointer;
}
.unls {
  position: absolute;
  width: 15px;
  height: 12px;
  font-size: 14px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: rgba(102, 102, 102, 1);
  cursor: pointer;
  right: 26px;
  top: 0px;
}
.specialvehicles {
  /deep/.el-dialog {
    min-width: 400px;
    height: 382px;
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
      padding: 12px 19px 12px;
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
      padding: 24px 14px 25px 18px;
      .el-myclass {
        padding-left: 28px;
        height: 65px !important;
        /deep/ .el-form-item__label {
          padding: 0 8px 0 0;
          text-align: left;
        }
        .default {
          /deep/.el-input__inner {
            cursor: default;
          }
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
        .warnings {
          height: 30px !important;
          padding: 0px !important;
          margin-top: -26px !important;
          .el-form-item__content {
            margin-left: 296px !important;
            font-family: Microsoft YaHei;
            font-weight: 400;
            color: rgba(153, 153, 153, 1);
          }
          .warning {
            cursor: pointer;
            font-size: 12px;
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
      margin-top: 195px;
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
      margin-bottom: 6px;
      height: 32px !important;
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
            width: 266px;
            height: 112px;
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
      height: 43px !important;
      padding: 12px 19px 12px;
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
        padding: 0 70px;
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
.reminder_lable {
  /deep/.el-dialog {
    min-width: 380px;
    border-radius: 5px;
    height: 188px;
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
      padding: 12px 19px 12px;
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
        border: 1px solid rgba(210, 210, 210, 1);
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
      }
    }
    .el-form-item {
      margin-bottom: 0;
      height: 50px !important;
    }
  }
}
.reminders {
  /deep/.el-dialog {
    min-width: 380px;
    height: 282px;
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
      padding: 12px 19px 12px;
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
      width: 500px;
      height: 76px;
      display: flex;
      justify-content: center;
      align-items: center;
      p {
        font-size: 16px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: rgba(102, 102, 102, 1);
        padding: 0 70px;
        span {
          color: red;
        }
      }
    }
    .footer-two {
      .footer-dcp {
        display: inline-block;
        width: 212px;
      }
      padding: 0 36px 0 36px;
      /deep/.el-radio-group {
        .el-radio {
          margin-bottom: 24px;
        }
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
        background: rgba(248, 172, 89, 1);
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
.reminder1 {
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
      height: 43px !important;
      padding: 12px 19px 12px;
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
      padding-top: 40px;
      .p1 {
        font-size: 16px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: rgba(102, 102, 102, 1);
        text-align: center;
        .p_span {
          color: #ff0000;
        }
      }
      .p2 {
        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: rgba(144, 147, 153, 1);
        text-align: center;
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
    height: 650px;
    border-radius: 5px;
    display: flex;
    flex-direction: column;
    margin: 0 !important;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    .el-dialog__header {
      text-align: left !important;
      height: 43px !important;
      border-bottom: 1px solid #eff2f5 !important;
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
      padding: 14px 20px 0px 46px;
      /deep/.box-fold {
        height: 479px;
        overflow: auto;
        /deep/.box-fold-one {
          height: 15px;
          font-size: 16px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          color: rgba(166, 172, 195, 1);
          margin-bottom: 20px;
        }
        .box-fold-one-dcp {
          margin-top: 20px;
        }
        /deep/.el-collapse {
          /deep/.table-one {
            height: 60px;
            margin-top: 18px;
            /deep/.el-myclass {
              // padding-left: 37px;
              height: 65px !important;
              /deep/ .el-form-item__label {
                padding: 0 8px 0 0;
                text-align: left;
              }
              .el-form-item__content {
                width: 250px;
              }
              .el-input {
                width: 250px;
              }
              /deep/.el-input__inner {
                width: 248px !important;
                height: 32px !important;
                border: 1px solid rgba(210, 210, 210, 1) !important;
                border-radius: 4px !important;
                color: #333333;
                padding: 0px 7px;
              }
              .el-form-item {
                margin-bottom: 0px;
              }
            }
          }
          /deep/.el-collapse-item__header {
            height: 20px;
            width: 20px;
            position: absolute;
            right: 26px;
            top: 116px;
          }
          /deep/.el-collapse-item__content {
            padding-bottom: 20px !important;
            /deep/.one-box {
              /deep/.el-myclass {
                // padding-left: 37px;
                height: 65px !important;
                /deep/ .el-form-item__label {
                  padding: 0 8px 0 0;
                  text-align: left;
                }
                /deep/.el-input__inner {
                  width: 248px !important;
                  height: 32px !important;
                  border: 1px solid rgba(210, 210, 210, 1) !important;
                  border-radius: 4px !important;
                  color: #333333;
                  padding: 0px 7px;
                }
                .el-form-item {
                  margin-bottom: 16px;
                }
              }
            }
            /deep/.two-box {
              /deep/.el-myclass {
                // padding-left: 37px;
                height: 65px !important;
                /deep/ .el-form-item__label {
                  padding: 0 8px 0 0;
                  text-align: left;
                }
                /deep/.el-input__inner {
                  width: 248px !important;
                  height: 32px !important;
                  border: 1px solid rgba(210, 210, 210, 1) !important;
                  border-radius: 4px !important;
                  color: #333333;
                  padding: 0px 7px;
                }
                .el-form-item {
                  margin-bottom: 16px;
                }
              }
            }
            /deep/.first-two {
              /deep/.el-myclass {
                // padding-left: 37px;
                /deep/ .el-form-item__label {
                  padding: 0 8px 0 0;
                  text-align: left;
                }
                /deep/.el-input__inner {
                  width: 609px !important;
                  height: 46px !important;
                  border: 1px solid rgba(210, 210, 210, 1) !important;
                  border-radius: 4px !important;
                  color: #333333;
                  padding: 0px 7px;
                }
                .el-checkbox-group {
                  margin-bottom: 20px;
                }
                .el-form-item {
                  // margin-bottom: 16px;
                }
              }
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
//下载车位模板
.download {
  font-size: 12px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: rgba(95, 175, 228, 1);
  cursor: pointer;
  position: absolute;
  right: 20px;
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
  width: 86px;
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

.tablesss {
  /deep/.el-table__body-wrapper {
    /deep/tbody {
      /deep/tr {
        min-height: 60px !important;
        td {
          padding: 0px !important;
        }
      }
    }
  }
  /deep/.el-table__header-wrapper {
    /deep/.has-gutter {
      /deep/tr {
        min-height: 60px !important;
        td {
          padding: 0px !important;
        }
      }
    }
  }
  /deep/.cell {
    min-height: 60px !important;
    line-height: normal !important;
    display: flex;
    align-items: center;
  }
}
.tablesss1 {
  /deep/.el-table__body-wrapper {
    /deep/tbody {
      /deep/tr {
        min-height: 60px !important;
      }
    }
  }
  /deep/.el-table__header-wrapper {
    /deep/.has-gutter {
      /deep/tr {
        min-height: 60px !important;
      }
    }
  }
  /deep/.cell {
    min-height: 60px !important;
    line-height: normal !important;
    display: flex;
    align-items: center;
  }
}
.kuang {
  height: 32px;
  position: relative;
}
.my-form-item {
  padding-top: 12px;
  padding-bottom: 12px;
  border-top: 1px solid rgba(239, 242, 245, 1);
  border-bottom: 1px solid rgba(239, 242, 245, 1);
}
.add-icon {
  margin-left: 6px;
  cursor: pointer;
  display: inline-block;
  width: 20px;
  height: 50px;
  font-size: 18px;
  text-align: center;
  color: rgba(210, 210, 210, 1);
}
.add-iconss {
  margin-left: 580px;
  cursor: pointer;
  display: inline-block;
  width: 65px;
  height: 14px;
  font-size: 16px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: rgba(248, 172, 89, 1);
  text-align: center;
}
.add-icons {
  margin-left: 6px;
  cursor: pointer;
  display: inline-block;
  width: 28px;
  height: 50px;
  font-size: 14px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: rgba(166, 172, 195, 1);
  text-align: center;
  color: rgba(210, 210, 210, 1);
}
.add-btnss {
  margin-left: 354px;
  font-size: 14px;
  color: rgba(102, 102, 102, 1);
}
.item-disable {
  height: 36px;
  overflow: hidden;
}
.item-disable1 {
  height: 318px;
}
.main-inp1 {
  height: 52px !important;
}
.main-inp {
  height: 34px;
  // padding: 10px 0 5px 0;
  .form_item1 {
    text-transform: uppercase;
  }
  input {
    -moz-appearance: none;
    width: 228px;
    height: 32px;
    border: none;
    border: 1px solid rgba(210, 210, 210, 1);
    border-radius: 4px;
    color: #333333;
    font-size: inherit;
    text-indent: 8px;
    outline: 0;
    -moz-appearance: none;
    background: #fff;
  }
  .input_beizhu {
    -moz-appearance: none;
    width: 612px;
    height: 46px;
    border: none;
    border: 1px solid rgba(210, 210, 210, 1);
    border-radius: 4px;
    color: #333333;
    font-size: inherit;
    text-indent: 8px;
    outline: 0;
    -moz-appearance: none;
    background: #fff;
    margin-left: 102px;
  }
  .input_name {
    margin-top: 3px;
  }
  .input_one {
    padding-bottom: 0px;
  }

  input::-webkit-input-placeholder {
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: rgba(213, 216, 223, 1);
  }
  /deep/.el-input__suffix {
    display: none;
  }
  /deep/.el-input--suffix {
    /deep/input {
      -moz-appearance: none;
      width: 228px;
      height: 32px;
      border: none;
      border: 1px solid rgba(210, 210, 210, 1) !important;
      border-radius: 4px;
      color: #333333;
      font-size: inherit;
      text-indent: 0px;
      outline: 0;
      -moz-appearance: none;
      background: #fff;
    }
  }
  /deep/.el-input__prefix{
    display:none;
  }
}
.label-name5 {
  display: inline-block;
  width: 102px;
  height: 50px;
  font-size: 14px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: rgba(51, 51, 51, 1);
  position: absolute;
  top: 0px;
  left: 0px;
}
.label-name {
  display: inline-block;
  width: 102px;
  height: 50px;
  font-size: 14px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: rgba(51, 51, 51, 1);
}
.label-name1 {
  display: inline-block;
  width: 120px;
  height: 50px;
  font-size: 14px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: rgba(51, 51, 51, 1);
}
.label-name2 {
  display: inline-block;
  width: 102px;
  height: 50px;
  font-size: 14px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: rgba(51, 51, 51, 1);
}
.label-name3 {
  display: inline-block;
  width: 74px;
  height: 50px;
  font-size: 14px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: rgba(51, 51, 51, 1);
}
.yanzheng {
  width: 200px;
  height: 22px;
  font-size: 14px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: #ff0000;
  margin-left: 102px;
}
.yanzhengss {
  width: 150px;
  height: 22px;
  font-size: 14px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: #ff0000;
  margin-left: 70px;
}
.yanzhengss1 {
  width: 150px;
  height: 22px;
  font-size: 14px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: #ff0000;
  div {
    position: absolute;
    top: 106px;
  }
}
.yanzheng1 {
  height: 22px;
  .one-d {
    width: 100px;
    height: 22px;
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #ff0000;
    margin-left: 100px;
  }
  .two-d {
    width: 250px;
    height: 22px;
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #ff0000;
    margin-left: 460px;
  }
}
.label-left {
  margin-left: 52px;
}
.money {
  text-align: center;
  height: 20px;
  margin: 20px 0 20px 0;
  font-size: 14px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: rgba(51, 51, 51, 1);
  .money-one {
    font-size: 18px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: rgba(255, 0, 0, 1);
  }
}
.car_number {
  width: 229px;
}
.svg_tubiao {
  .svg-icon {
    width: 19px;
    height: 20px;
    vertical-align: middle;
    margin-bottom: 2px;
  }
}
.svg_tubiao_two {
  font-size: 28px;
  vertical-align: middle;
}
.xiegang {
  color: #ff0000 !important;
}
.xiegang1 {
  color: #ff6600 !important;
}
.form_item1 {
  text-transform: uppercase;
}
/deep/.form_item1 {
  /deep/.el-input {
    /deep/input {
      text-transform: uppercase;
    }
  }
}
.checkboxs{

}
</style>
