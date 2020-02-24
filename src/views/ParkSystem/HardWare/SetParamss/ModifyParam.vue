<template>
  <div>
    <span v-if="buttonallShow">
      <div class="modify-all">
        <span class="modify-all_span" @click="modifyAllHandler" :class="{ active: isActiveAll }">
          <i class="el-icon-edit"></i>
          <span v-html="this.isActiveAll === true ? '修改中' : '修改全部'"></span>
        </span>
      </div>
    </span>

    <div class="hard-setparamClass">
      <div class="setparam-container">
        <el-collapse v-model="activeNames" @change="handleChange" :disabled="true">
          <!-- 基础设置 -->
          <el-collapse-item title="基础设置" name="1">
            <!-- 总 -->
            <div class="sum-class">
              <!-- 左部分 -->
              <div class="sumbox left-class">
                <el-form
                  :label-position="labelPosition"
                  label-width="80px"
                  ref="ruleFormBasisLeft"
                  :model="formLabelAlign.basisinfo"
                  :rules="rules"
                >
                  <el-form-item label="负责人:" prop="basis_name">
                    <el-input
                      v-model="formLabelAlign.basisinfo.basis_name"
                      :disabled="basisDisable"
                      placeholder="请输入停车场负责人"
                    />
                  </el-form-item>
                  <el-form-item label="联系电话:" prop="basis_phone">
                    <el-input
                      v-model="formLabelAlign.basisinfo.basis_phone"
                      :disabled="basisDisable"
                      placeholder="请输入停车场负责人联系电话"
                      oninput="value=value.replace(/[^\d]/g,'')"
                    />
                  </el-form-item>
                </el-form>
              </div>
              <!-- 右部分 -->
              <div class="sumbox right-class">
                <el-form
                  :label-position="labelPosition"
                  label-width="80px"
                  ref="ruleFormBasisRight"
                  :model="formLabelAlign.basisinfo"
                  :rules="rules1"
                >
                  <el-form-item label="详细地址:" prop="basis_address">
                    <el-input
                      v-model="formLabelAlign.basisinfo.basis_address"
                      :disabled="basisDisable"
                      placeholder="请输入停车场详细地址"
                    />
                  </el-form-item>
                  <el-form-item label="车位总数:" prop="basis_number">
                    <el-input
                      v-model="formLabelAlign.basisinfo.basis_number"
                      :disabled="basisDisable"
                      placeholder="请输入停车位数量"
                    />
                  </el-form-item>
                </el-form>
              </div>
            </div>
            <!-- 修改 -->
            <span v-if="buttonbasisShow">
              <div class="modify-some" :class="{ active: isActive1 }" v-if="modifybasisShow">
                <span class="modify-some_span" @click="modifybasis">
                  <i class="el-icon-edit"></i>
                  <span v-html="this.isActive1 === true ? '修改中' : '修改'"></span>
                </span>
              </div>
            </span>
          </el-collapse-item>
          <!-- 开闸管理 -->
          <el-collapse-item title="开闸管理" name="2">
            <!-- 总 -->
            <div class="sum-class">
              <!-- 左部分 -->
              <div class="sumbox left-class">
                <el-form
                  ref="ruleFormKaiZhaLeft"
                  :label-position="labelPosition"
                  label-width="80px"
                  :disabled="brakeDisable"
                  :model="formLabelAlign.brakeinfo"
                  :rules="rules2"
                >
                  <el-form-item label="是否匹配车牌地域名称（例：京、川）:">
                    <el-radio-group v-model="formLabelAlign.brakeinfo.car_number">
                      <el-radio :label="1">是</el-radio>
                      <el-radio :label="2">否</el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item label="入口处，非长租车辆是否开闸:">
                    <el-radio-group v-model="formLabelAlign.brakeinfo.car_rent">
                      <el-radio :label="1">是</el-radio>
                      <el-radio :label="2">否</el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item label="出口是否无条件开闸:">
                    <el-radio-group v-model="formLabelAlign.brakeinfo.car_export">
                      <el-radio :label="1">是</el-radio>
                      <el-radio :label="2">否</el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item label="同一道口，重复识别车牌间隔时间（秒）:" prop="car_endtime">
                    <el-input v-model="formLabelAlign.brakeinfo.car_endtime" />
                  </el-form-item>
                  <!-- TODOS: -->
                  <el-form-item label="支付后多少分钟内需要离场（分钟）:" prop="end_time">
                    <el-input v-model="formLabelAlign.brakeinfo.end_time" />
                  </el-form-item>
                  <el-form-item
                    label="一位或多位多车的情况下，当车位已有停放车辆时，所属车位下其他车辆入场是否允许抬杆放行:"
                    class="more-class"
                  >
                    <el-radio-group v-model="formLabelAlign.brakeinfo.car_double">
                      <el-radio :label="1">是</el-radio>
                      <el-radio :label="2">否</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-form>
              </div>
              <!-- 右部分 -->
              <div class="sumbox left-class">
                <el-form
                  :label-position="labelPosition"
                  label-width="80px"
                  :disabled="brakeDisable"
                >
                  <el-form-item label="黄牌车指定通道:" class="yellow-class">
                    <el-radio-group v-model="car_yellow1" @change="mengangChange">
                      <el-radio :label="1">是</el-radio>
                      <el-radio :label="0">否</el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <!-- //请选择门岗 -->
                  <el-select
                    v-model="ChoiceDoor_value"
                    v-if="car_yellow1 === 1"
                    placeholder="请选择门岗"
                  >
                    <!--  v-model="value"中'value"的值为el-option的value属性值 -->
                    <el-option
                      v-for="item in options_ChoiceDoor"
                      :key="item.id"
                      :label="item.door_post_name"
                      :value="item.id"
                    >
                      <span
                        class="chenp"
                        @click="hanPoid_DoorType(item.id)"
                        style="display:block;"
                      >{{ item.door_post_name }}</span>
                    </el-option>
                  </el-select>
                  <p
                    class="ledtoast-class"
                    v-if="car_yellow1 === 1"
                    style="margin-top: 9px;"
                  >{{mengangToast}}</p>
                  <el-form-item label="军警车是否自动开闸:">
                    <el-radio-group v-model="formLabelAlign.brakeinfo.car_police">
                      <el-radio :label="1">是</el-radio>
                      <el-radio :label="2">否</el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item label="是否检测有无物业欠费情况:">
                    <el-radio-group v-model="formLabelAlign.brakeinfo.car_wuye">
                      <el-radio :label="1">是</el-radio>
                      <el-radio :label="2">否</el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item
                    label="物业费欠费时是否不放行:"
                    v-if="formLabelAlign.brakeinfo.car_wuye === 1 ? true : false"
                    class="qianfei-calss"
                  >
                    <el-radio-group
                      v-model="formLabelAlign.brakeinfo.car_wuye_release"
                      @change="centonsCahnge"
                    >
                      <el-radio :label="1">是</el-radio>
                      <el-radio :label="2">否</el-radio>
                    </el-radio-group>
                    <el-input
                      v-model="formLabelAlign.brakeinfo.car_centons"
                      placeholder="请输入自定义提示语"
                      @blur="myselfBlur"
                      v-if="formLabelAlign.brakeinfo.car_wuye_release === 1 ? true : false"
                    />
                  </el-form-item>
                  <p
                    v-if="formLabelAlign.brakeinfo.car_wuye_release=== 1"
                    class="ledtoast-class"
                    style="margin-top:42px;"
                  >{{myselfToast}}</p>
                  <el-form-item label="使用APP或公众号申请绑定车辆时，是否需要后台操作人员审核:">
                    <el-radio-group v-model="formLabelAlign.brakeinfo.car_app">
                      <el-radio :label="1">是</el-radio>
                      <el-radio :label="2">否</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-form>
              </div>
            </div>
            <!-- 修改 -->
            <span v-if="buttonbrakeShow">
              <div class="modify-some" :class="{ active: isActive2 }" v-if="modifybrakeShow">
                <span class="modify-some_span" @click="modifybrake">
                  <i class="el-icon-edit"></i>
                  <span v-html="this.isActive2 === true ? '修改中' : '修改'"></span>
                </span>
              </div>
            </span>
          </el-collapse-item>
          <!-- 收费设置 -->
          <el-collapse-item title="收费设置" name="3">
            <!-- 总 -->
            <div class="sum-class">
              <!-- 左部分 -->
              <div class="sumbox left-class">
                <el-form
                  ref="ruleFormShoufeiLeft"
                  :label-position="labelPosition"
                  label-width="80px"
                  :disabled="priceDisable"
                  :model="formLabelAlign.priceinfo"
                  :rules="rules3"
                >
                  <el-form-item label="免费停车时间（分钟）:" prop="car_time">
                    <el-input v-model="formLabelAlign.priceinfo.car_time" />
                  </el-form-item>
                  <el-form-item label="基本收费时长（小时）:" prop="car_price_time">
                    <el-input v-model="formLabelAlign.priceinfo.car_price_time" />
                  </el-form-item>
                  <el-form-item label="基本收费费用（元）:" prop="car_price">
                    <el-input v-model="formLabelAlign.priceinfo.car_price	" />
                  </el-form-item>
                  <el-form-item label="超时后收费计时单位（小时）:" prop="time_out">
                    <el-input v-model="formLabelAlign.priceinfo.time_out" />
                  </el-form-item>
                  <el-form-item label="超时后收费单价（元）:" prop="time_out_price">
                    <el-input v-model="formLabelAlign.priceinfo.time_out_price" />
                  </el-form-item>
                  <!-- <p class="oten-class">若上方四个值分别为:2，3，2，3，则超过免费时长后2小时内收费3元,超过2个小时,每2个小时收费3元</p> -->
                  <p class="oten-class">
                    超过免费停车时长后，
                    <span
                      v-html="formLabelAlign.priceinfo.car_price_time ? formLabelAlign.priceinfo.car_price_time : 'X'"
                    ></span>小时内收费
                    <span
                      v-html="formLabelAlign.priceinfo.car_price ? formLabelAlign.priceinfo.car_price : 'X'"
                    ></span>元，超过
                    <span
                      v-html="formLabelAlign.priceinfo.car_price_time ? formLabelAlign.priceinfo.car_price_time : 'X'"
                    ></span>小时后，每
                    <span
                      v-html="formLabelAlign.priceinfo.time_out ? formLabelAlign.priceinfo.time_out : 'X'"
                    ></span>小时加收
                    <span
                      v-html="formLabelAlign.priceinfo.time_out_price ? formLabelAlign.priceinfo.time_out_price : 'X'"
                    ></span>元
                  </p>
                  <el-form-item label="单日收费最高限制（元）:">
                    <el-input v-model="formLabelAlign.priceinfo.max_price" placeholder="不填代表无限制" />
                  </el-form-item>
                </el-form>
              </div>
              <!-- 右部分 -->
              <div class="sumbox right-class">
                <el-form
                  :label-position="labelPosition"
                  ref="ruleFormShoufeiRigh"
                  label-width="80px"
                  :disabled="priceDisable"
                  :model="formLabelAlign.priceinfo"
                  :rules="rules4"
                >
                  <el-form-item label="单日结算周期:">
                    <el-select v-model="formLabelAlign.priceinfo.cycle">
                      <!-- v-model="value"中'value"的值为el-option的value属性值 -->
                      <el-option
                        v-for="item in options_ondayCycle"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="单次停车是否有最高收费限制:" class="single-class">
                    <!-- //single_max -->
                    <el-radio-group
                      v-model="formLabelAlign.priceinfo.single_max"
                      @change="validata1"
                    >
                      <el-radio :label="1">是</el-radio>
                      <el-radio :label="2">否</el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <div v-if="formLabelAlign.priceinfo.single_max=== 1" class="hoight-class">
                    <el-input
                      v-model="formLabelAlign.priceinfo.single_max_price"
                      placeholder="请输入最高收费金额"
                      v-if="formLabelAlign.priceinfo.single_max === 1"
                      @blur="hightBlur"
                    />
                    <span style="display:inline-block;height:20px;line-height:30px;">元</span>
                  </div>
                  <p
                    class="ledtoast-class"
                    style="margin-top:5px;"
                    v-if="formLabelAlign.priceinfo.single_max === 1"
                  >{{HightestToast}}</p>
                  <el-form-item label="一位多车情况下，当车位已有停放车辆时，所属车位下其他车辆入场是否持续计费:">
                    <el-radio-group v-model="formLabelAlign.priceinfo.car_double_price">
                      <el-radio :label="1">是</el-radio>
                      <el-radio :label="2">否</el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item label="一位多车情况下，当车位所剩车辆和车位数量相符时是否停止收费:">
                    <el-radio-group v-model="formLabelAlign.priceinfo.car_double_price_2">
                      <el-radio :label="1">是</el-radio>
                      <el-radio :label="2">否</el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item label="长租车欠费缓冲时长（天）:" prop="car_rent_price">
                    <el-input
                      v-model="formLabelAlign.priceinfo.car_rent_price"
                      placeholder="请输入长租车欠费缓冲时长"
                    />
                  </el-form-item>
                  <el-form-item label="长租车出场时若租期已满，是否从过期时间计算费用:">
                    <el-radio-group v-model="formLabelAlign.priceinfo.car_rent_price_2">
                      <el-radio :label="1">是</el-radio>
                      <el-radio :label="2">否</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-form>
              </div>
            </div>
            <!-- 修改 -->
            <span v-if="buttonpriceShow">
              <div class="modify-some" :class="{ active: isActive3 }" v-if="modifypriceShow">
                <span class="modify-some_span" @click="modifyprice">
                  <i class="el-icon-edit"></i>
                  <span v-html="this.isActive3 === true ? '修改中' : '修改'"></span>
                </span>
              </div>
            </span>
          </el-collapse-item>
          <!-- 显示屏设置 -->
          <el-collapse-item title="显示屏设置" name="4">
            <!-- 总 -->
            <div class="sum-class">
              <!-- 左部分 -->
              <div class="sumbox left-class">
                <el-form
                  :label-position="labelPosition"
                  label-width="80px"
                  :disabled="ledDisable"
                  :model="formLabelAlign.ledinfo"
                  :rules="rules5"
                  ref="ruleFormLedLeft"
                >
                  <el-form-item label="显示屏显示行数:">
                    <!-- //下拉框 -->
                    <el-select
                      v-model="formLabelAlign.ledinfo.led_number"
                      placeholder="请选择显示屏显示行数"
                      @change="ledNumChange"
                    >
                      <!-- v-model="value"中'value"的值为el-option的value属性值 -->
                      <el-option
                        v-for="item in options_screenNum"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                  <!-- 长租车,入场时显示屏显示的信息:长租车,入场时显示屏显示的信息:长租车,入场时显示屏显示的信息:长租车,入场时显示屏显示的信息:长租车,入场时显示屏显示的信息: -->
                  <p class="plabel-class">长租车,入场时显示屏显示的信息:</p>
                  <!-- //下拉框 -->
                  <div v-for="(item,index) in formLabelAlign.ledinfo.led_number" :key="index+'b'">
                    <span class="hang-class">第{{chineseNum[index]}}行</span>
                    <!-- ++++++++++++++++++++++++++++++++++++++++++++++++ -->
                    <!-- <el-autocomplete
                      popper-class="my-autocomplete"
                      v-model="car_rent_admission1[index]"
                      :fetch-suggestions="querySearch"
                      placeholder="请输入或选择内容"
                      @select="handleSelect"
                    >
                      <i class="el-icon-edit el-input__icon" slot="suffix" @click="handleIconClick"></i>
                      <template slot-scope="{ item }">
                        <div class="name">{{ item.value }}</div>
                      </template>
                    </el-autocomplete>-->
                    <el-select
                      placeholder
                      :filterable="true"
                      v-model="car_rent_admission1[index]"
                      :allow-create="true"
                      class="selectClass"
                      reserve-keyword
                      @change="cc(index)"
                      @blur="ccBlur(index)"
                    >
                      <div v-if="selectShow">
                        <el-option
                          v-for="(item,n) in screenConten.car_rent_admission1"
                          :key="n+'c'"
                          :label="item.value"
                          :value="item.value"
                        ></el-option>
                      </div>
                    </el-select>
                    <p class="ledtoast-class" :ref="`car_rent_admission1${index}`"></p>
                  </div>
                  <!-- 临停车,入场时显示屏显示的信息:临停车,入场时显示屏显示的信息:临停车,入场时显示屏显示的信息:临停车,入场时显示屏显示的信息: -->
                  <p class="plabel-class">临停车,入场时显示屏显示的信息:</p>
                  <!-- //下拉框 -->
                  <div v-for="(item,index) in formLabelAlign.ledinfo.led_number" :key="index+'c'">
                    <span class="hang-class">第{{chineseNum[index]}}行</span>
                    <el-select
                      placeholder
                      filterable
                      v-model="car_stop_admission1[index]"
                      class="selectClass"
                      :allow-create="true"
                      reserve-keyword
                      @change="cc1(index)"
                    >
                      <!-- v-model="value"中'value"的值为el-option的value属性值 -->
                      <div v-if="selectShow">
                        <el-option
                          v-for="(item,n) in screenConten.car_stop_admission1"
                          :key="n"
                          :label="item.value"
                          :value="item.value"
                        ></el-option>
                      </div>
                    </el-select>
                    <p class="ledtoast-class" :ref="`car_stop_admission1${index}`"></p>
                  </div>
                  <!-- 无车时,入口显示屏显示的内容信息无车时,入口显示屏显示的内容信息无车时,入口显示屏显示的内容信息无车时,入口显示屏显示的内容信息无车时,入口显示屏显示的内容信息 -->

                  <p class="plabel-class">无车时,入口显示屏显示的内容信息:</p>
                  <!-- //下拉框 -->
                  <div v-for="(item,index) in formLabelAlign.ledinfo.led_number" :key="index+'d'">
                    <span class="hang-class">第{{chineseNum[index]}}行</span>
                    <el-select
                      placeholder
                      filterable
                      v-model="car_no_admission1[index]"
                      class="selectClass"
                      :allow-create="true"
                      reserve-keyword
                      @change="cc2(index)"
                    >
                      <div v-if="selectShow">
                        <el-option
                          v-for="(item,index) in screenConten.car_no_admission1"
                          :key="index"
                          :label="item.value"
                          :value="item.value"
                        ></el-option>
                      </div>
                    </el-select>
                    <p class="ledtoast-class" :ref="`car_no_admission1${index}`"></p>
                  </div>
                  <!-- 长租车提前提示车位到期时间（天长租车提前提示车位到期时间（天）长租车提前提示车位到期时间（天）） -->
                  <el-form-item label="长租车提前提示车位到期时间（天）:" prop="car_rent_day">
                    <el-input v-model="formLabelAlign.ledinfo.car_rent_day" />
                  </el-form-item>
                  <!-- 扬声器声音大小(0-10): -->
                  <el-form-item label="扬声器声音大小(0-10):" prop="sound">
                    <div class="block" style="width: 406px;">
                      <el-slider
                        :max="10"
                        v-model="formLabelAlign.ledinfo.sound"
                        :step="1"
                        show-stops
                      ></el-slider>
                    </div>
                    <p class="ledtoast-class">{{soundToast}}</p>
                  </el-form-item>
                </el-form>
              </div>
              <!-- 右部分 -->
              <div class="sumbox right-class">
                <el-form
                  :label-position="labelPosition"
                  label-width="80px"
                  :disabled="ledDisable"
                  :model="formLabelAlign.ledinfo"
                  :rules="rules6"
                  ref="ruleFormLedRight"
                >
                  <!-- 长租车,入场时显示屏显示的信息:长租车,入场时显示屏显示的信息:长租车,入场时显示屏显示的信息:长租车,入场时显示屏显示的信息:长租车,入场时显示屏显示的信息: -->

                  <p class="plabel-class" style="margin-top:86px;">长租车,出场时显示屏显示的信息:</p>
                  <!-- //下拉框 -->
                  <div v-for="(item,index) in formLabelAlign.ledinfo.led_number" :key="index+'e'">
                    <span class="hang-class">第{{chineseNum[index]}}行</span>
                    <el-select
                      placeholder
                      filterable
                      v-model="car_rent_appearance1[index]"
                      class="selectClass"
                      :allow-create="true"
                      reserve-keyword
                      @change="cc3(index)"
                    >
                      <div v-if="selectShow">
                        <el-option
                          v-for="(item,n) in screenConten.car_rent_appearance1"
                          :key="n+'v'"
                          :label="item.value"
                          :value="item.value"
                        ></el-option>
                      </div>
                    </el-select>
                    <p class="ledtoast-class" :ref="`car_rent_appearance1${index}`"></p>
                  </div>
                  <!-- 临停车,入场时显示屏显示的信息:临停车,入场时显示屏显示的信息:临停车,入场时显示屏显示的信息:临停车,入场时显示屏显示的信息: -->

                  <p class="plabel-class">临停车,出场时显示屏显示的信息:</p>
                  <!-- //下拉框 -->
                  <div v-for="(item,index) in formLabelAlign.ledinfo.led_number" :key="index+'f'">
                    <span class="hang-class">第{{chineseNum[index]}}行</span>
                    <el-select
                      placeholder
                      filterable
                      v-model="car_stop_appearance1[index]"
                      class="selectClass"
                      :allow-create="true"
                      reserve-keyword
                      @change="cc4(index)"
                    >
                      <div v-if="selectShow">
                        <el-option
                          v-for="(item,index) in screenConten.car_stop_appearance1"
                          :key="index"
                          :label="item.value"
                          :value="item.value"
                        ></el-option>
                      </div>
                    </el-select>
                    <p class="ledtoast-class" :ref="`car_stop_appearance1${index}`"></p>
                  </div>
                  <!-- 无车时,出口显示屏显示的内容信息:无车时,出口显示屏显示的内容信息:无车时,出口显示屏显示的内容信息: -->
                  <p class="plabel-class">无车时,出口显示屏显示的内容信息:</p>
                  <!-- //下拉框 -->
                  <div v-for="(item,index) in formLabelAlign.ledinfo.led_number" :key="index+'g'">
                    <span class="hang-class">第{{chineseNum[index]}}行</span>
                    <el-select
                      placeholder
                      filterable
                      v-model="car_no_appearance1[index]"
                      class="selectClass"
                      :allow-create="true"
                      reserve-keyword
                      @change="cc5(index)"
                    >
                      <div v-if="selectShow">
                        <el-option
                          v-for="(item,index) in screenConten.car_no_appearance1"
                          :key="index"
                          :label="item.value"
                          :value="item.value"
                        ></el-option>
                      </div>
                    </el-select>
                    <p class="ledtoast-class" :ref="`car_no_appearance1${index}`"></p>
                  </div>
                  <!-- 车辆通过时，显示屏重复显示信息的时间（秒）车辆通过时，显示屏重复显示信息的时间（秒）车辆通过时，显示屏重复显示信息的时间（秒） -->
                  <el-form-item label="车辆通过时，显示屏重复显示信息的时间（秒）:" prop="time">
                    <el-input v-model="formLabelAlign.ledinfo.time" />
                  </el-form-item>
                </el-form>
              </div>
            </div>
            <!-- 修改 -->
            <span v-if="buttonLedShow">
              <div class="modify-some" :class="{ active: isActive4 }">
                <span class="modify-some_span" @click="modifyLed" v-if="modifyLedShow">
                  <i class="el-icon-edit"></i>
                  <span v-html="this.isActive4 === true ? '修改中' : '修改'"></span>
                </span>
              </div>
            </span>
          </el-collapse-item>
        </el-collapse>
        <div class="button-class" v-if="querenVisible">
          <span
            class="button"
            @click="addSetting"
            v-loading="loadingQueren"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.8)"
          >确认</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { postDoorListId, postSettingadd, postSetInfo, postSetupdateAll, postSetupdateBasis, postSetupdateBrake, postSetupdatePrice, postMonthly, postMonthlyOut, postNonMonthly, postNonMonthlyOut, postSetupdateLed } from '@/api/hardware'
import { Message } from 'element-ui'
import ModifyParam from './ModifyParam.vue'
import { postSelect_button } from '@/api/Jurisdiction1'
export default {
  components: {
    ModifyParam
  },
  // data数据
  data () {
    //电话号码正则验证
    var checkPhone = (rule, value, callback) => {
      const phoneReg = /^1[3|4|5|7|8][0-9]{9}$/
      if (!value) {
        return callback(new Error('电话号码不能为空'))
      }
      setTimeout(() => {
        // Number.isInteger是es6验证数字是否为整数的方法,但是我实际用的时候输入的数字总是识别成字符串
        // 所以在前面加了一个+实现隐式转换
        if (!Number.isInteger(+value)) {
          callback(new Error('请输入数字值'))
        } else {
          if (phoneReg.test(value)) {
            callback()
          } else {
            callback(new Error('电话号码格式不正确'))
          }
        }
      }, 100)
    }
    const checkPrice = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入基本收费费用'));
      } else {
        if (value == 0 || value == 0.) {
          callback(new Error('请输入大于零基本收费费用'));
        } else {
          callback();
        }
      }
    }
    const checkPrice1 = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入超时后收费单价'));
      } else {
        if (value == 0 || value == 0.) {
          callback(new Error('请输入大于零的超时后收费单价'));
        } else {
          callback();
        }
      }
    }
    const checkPrice2 = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入单日收费最高限制'));
      } else {
        if (value == 0 || value == 0.) {
          callback(new Error('请输入大于零的单日收费最高限制'));
        } else {
          callback();
        }
      }
    }
    return {
      buttonallShow: false,//按钮权限判定按钮是否显示
      buttonbasisShow: false,//按钮权限判定按钮是否显示
      buttonbrakeShow: false,//按钮权限判定按钮是否显示
      buttonpriceShow: false,//按钮权限判定按钮是否显示
      buttonLedShow: false,//按钮权限判定按钮是否显示
      isActiveAll: false,
      isActive4: false,//led
      isActive3: false,//收费
      isActive2: false,//开闸
      isActive1: false,//基础
      modifybasisShow: true,//基础设置修改按钮是否显示
      modifybrakeShow: true,//基础设置修改按钮是否显示
      modifypriceShow: true,//基础设置修改按钮是否显示
      modifyLedShow: true,//基础设置修改按钮是否显示
      loadingQueren: false, //确认的加载控制
      chineseNum: ['一', '二', '三', '四', '五', '六'],//显示屏
      validataformName: false,//基础设置左边部分验证
      validataformName1: false,
      validataformName3: false,
      validataformName4: false,
      validataformName5: false,
      validataformName6: false,
      validataformName7: false,
      validataformName8: false,//验证门岗
      validataformName9: false,//验证led左边
      validataformName10: false,//验证led右边
      validataformName11: false,//验证扬声器
      validataLed1: true,
      validataLed2: true,
      validataLed3: true,
      validataLed4: true,
      validataLed5: true,
      validataLed6: true,
      soundToast: '',//扬声器
      myselfToast: '',//自定义提示语
      HightestToast: '',//单次停车是否有最高收费限制提示语
      mengangToast: '',//门岗提示语
      querenVisible: false,//确认按钮是否显示
      selectShow: true,//当显示屏的下拉框变成输入框时对应的下拉框是否消失
      activeNames: [], // 展开列
      labelPosition: 'top',
      radio: 3, // 开闸管理
      formLabelAlign: {
        basisinfo: {
          basis_name: '',//负责人
          basis_phone: '',//联系电话
          basis_address: '',//详细地址
          basis_number: '',//车位总数
        },
        // 开闸管理
        brakeinfo: {
          car_number: 2,//是否匹配车牌地域名称（例：京、川）:
          car_rent: 1,//入口处，非长租车辆是否开闸:
          car_export: 2,//出口是否无条件开闸:
          car_endtime: 60,//同一道口，重复识别车牌间隔时间（秒）:
          car_double: 2,//一位多车情况下，当车位已有停放车辆时，所属车位下其他车辆入场是否允许抬杆放行
          car_yellow: 0,//黄牌车指定通道
          car_police: 1,//军警车是否自动开闸
          car_wuye: 2,//是否检测有无物业欠费情况
          car_wuye_release: 2,//物业费欠费时是否不放行
          car_app: 1,//使用APP或公众号申请绑定车辆时，是否需要后台操作人员审核
          end_time: null,//支付后多少分钟内需要离场（分钟）
          car_centons: ''//自定义提示语
        },
        //收费设置
        priceinfo: {
          car_time: 15,//免费停车时间（分钟）
          car_price_time: null,//基本收费时长（小时）
          car_price: null,//基本收费费用（元）
          time_out: null,//超时后收费计时单位（小时）
          time_out_price: '2,3,2,3',//超时后收费单价（元）
          max_price: null,//单日收费最高限制（元）
          cycle: 1,//单日结算周期
          single_max: 2,//单次停车是否有最高收费限制
          single_max_price: 0,//请输入最高收费金额
          car_double_price: 1,//一位多车情况下，当车位已有停放车辆时，所属车位下其他车辆入场是否持续计费
          car_double_price_2: 2,//一位多车情况下，当车位所剩车辆和车位数量相符时是否停止收费
          car_rent_price: null,//长租车欠费缓冲时长（天）
          car_rent_price_2: 2,//长租车出场时若租期已满，是否从过期时间计算费用
        },
        //显示屏
        ledinfo: {
          led_number: 2,//下拉选择行数
          car_rent_day: null,//长租车提前提示车位到期时间（天）
          car_rent_admission: '',
          car_stop_admission: '',
          car_no_admission: '',
          car_rent_appearance: '',
          car_stop_appearance: '',
          car_no_appearance: '',
          sound: 0,//扬声器声音大小(0-10)
          time: null,//车辆通过时，显示屏重复显示信息的时间（秒）
        },
        state: 1,
        pid: 0,
        parkid: null,
      },
      modifyNum: 0,//判断为修改全部还是修改其他单独四项,0代表修改全部,1(修改基础设置),2(开闸管理),3(收费设置),4(led)
      //控制四个个模块disabled
      basisDisable: true,
      brakeDisable: true,
      priceDisable: true,
      ledDisable: true,
      car_yellow1: 0,//黄牌车指定通道
      options_ChoiceDoor: [],//门岗类型
      ChoiceDoor_value: null,//选择门岗的值//TODOS是否填在formLabelAlign.ledinfo
      //下拉选择显示屏幕行数
      options_screenNum: [
        {
          value: 2,
          label: 2
        }, {
          value: 4,
          label: 4
        }, {
          value: 6,
          label: 6
        }

      ],
      //显示屏下拉框的数据
      screenConten: {
        //长租车入场
        car_rent_admission1: {},
        car_rent_admission2: {},
        car_rent_admission3: {},
        car_rent_admission4: {},
        car_rent_admission5: {},
        car_rent_admission6: {},
        //临停车入场
        car_stop_admission1: {},
        car_stop_admission2: {},
        car_stop_admission3: {},
        car_stop_admission4: {},
        car_stop_admission5: {},
        car_stop_admission6: {},
        //无车时入场
        car_no_admission1: {},
        car_no_admission2: {},
        car_no_admission3: {},
        car_no_admission4: {},
        car_no_admission5: {},
        car_no_admission6: {},
        //长租车出厂
        car_rent_appearance1: {},
        car_rent_appearance2: {},
        car_rent_appearance3: {},
        car_rent_appearance4: {},
        car_rent_appearance5: {},
        car_rent_appearance6: {},
        //临停车出厂
        car_stop_appearance1: {},
        car_stop_appearance2: {},
        car_stop_appearance3: {},
        car_stop_appearance4: {},
        car_stop_appearance5: {},
        car_stop_appearance6: {},
        //无车时出厂
        car_no_appearance1: {},
        car_no_appearance2: {},
        car_no_appearance3: {},
        car_no_appearance4: {},
        car_no_appearance5: {},
        car_no_appearance6: {},

      },
      //显示屏用户输入的数据
      car_rent_admission1: ['', '', '', '', '', ''],
      car_stop_admission1: ['', '', '', '', '', ''],
      car_no_admission1: ['', '', '', '', '', ''],
      car_rent_appearance1: ['', '', '', '', '', ''],
      car_stop_appearance1: ['', '', '', '', '', ''],
      car_no_appearance1: ['', '', '', '', '', ''],
      options_ondayCycle: [
        {
          value: 1,
          label: '凌晨12点'
        }, {
          value: 2,
          label: '24小时'
        }
      ],
      parkid: null,
      userInfo: {},//localStorage的userInfo
      outId: null,//最外层Id
      inID: null,//内层ID
      //修改全部时需要的参数
      // priceQuery: {},
      // ledQuery: {},
      // brakeQuery: {},
      // basisQuery: {}
      //基础设置左边验证
      rules: {//rules验证
        basis_name: [
          { required: true, message: '请输入停车场负责人', trigger: 'blur' }
        ],
        basis_phone: [
          { validator: checkPhone, trigger: 'blur' }
        ]
      },
      //基础设置右边验证
      rules1: {//rules验证
        basis_address: [
          { required: true, message: '请输入停车场详细地址', trigger: 'blur' }
        ],
        basis_number: [
          {
            required: true,
            message: '请输入车位总数',
            trigger: 'blur'
          }
        ],
      },
      //开闸管理左边
      rules2: {
        car_endtime: [
          {
            required: true,
            message: '请输入同一道口，重复识别车牌间隔时间',
            trigger: 'blur'
          }
        ],
        end_time: [
          {
            required: true,
            message: '请输入支付后多少分钟内需要离场',
            trigger: 'blur'
          }
        ],
      },
      //收费管理左边
      rules3: {
        car_time: [
          {
            required: true,
            message: '请输入免费停车时间',
            trigger: 'blur'
          }
        ],
        car_price_time: [
          {
            required: true,
            message: '请输入基本收费时长',
            trigger: 'blur'
          }
        ],
        car_price: [
          { validator: checkPrice, trigger: 'blur' }
        ],
        time_out: [
          {
            required: true,
            message: '请输入超时后收费计时单位',
            trigger: 'blur'
          }
        ],
        time_out_price: [
          { validator: checkPrice1, trigger: 'blur' }
        ],
        // max_price: [
        //   { validator: checkPrice2, trigger: 'blur' }
        // ],
      },
      rules4: {
        car_rent_price: [
          {
            required: true,
            message: '请输入长租车欠费缓冲时长',
            trigger: 'blur'
          }
        ],
      },
      rules5: {
        car_rent_day: [
          {
            required: true,
            message: '请输入大于0的长租车提前提示车位到期时间',
            trigger: 'blur'
          }
        ],
      },
      rules6: {
        time: [
          {
            required: true,
            message: '请输入车辆通过时，显示屏重复显示信息的时间',
            trigger: 'blur'
          }
        ],
      }
    }
  },
  computed: {},
  watch: {
    // 电话号码不能输入汉字
    'formLabelAlign.basisinfo.basis_phone': {
      handler (n, o) {
        n = String(n)
        if (Number(n) == n) {
          if (n.includes('.')) {
            this.formLabelAlign.basisinfo.basis_phone = n.slice(0, n.indexOf('.'))
          }
          if (n.slice(0, 1) === '0') {
            this.formLabelAlign.basisinfo.basis_phone = n.slice(1)
          }
        } else {
          this.formLabelAlign.basisinfo.basis_phone = o
        }
      },
    },
    // 车位总数只能输入汉字
    'formLabelAlign.basisinfo.basis_number': {
      handler (n, o) {
        n = String(n)
        if (Number(n) == n) {
          if (n.includes('.')) {
            this.formLabelAlign.basisinfo.basis_number = n.slice(0, n.indexOf('.'))
          }
          if (n.slice(0, 1) === '0') {
            this.formLabelAlign.basisinfo.basis_number = n.slice(1)
          }
        } else {
          this.formLabelAlign.basisinfo.basis_number = o
        }
      },
    },
    // 同一道口，重复识别车牌间隔时间（秒）(只能为不为0的整数，不能有小数点)
    'formLabelAlign.brakeinfo.car_endtime': {
      handler (n, o) {
        n = String(n)
        if (Number(n) == n) {
          if (n.includes('.')) {
            this.formLabelAlign.brakeinfo.car_endtime = n.slice(0, n.indexOf('.'))
          }
          if (n.slice(0, 1) === '0') {
            this.formLabelAlign.brakeinfo.car_endtime = n.slice(1)
          }
        } else {
          this.formLabelAlign.brakeinfo.car_endtime = o
        }
      },
    },
    // 支付后多少分钟内需要离场（分钟）(不能只输入0并且只能为整数)
    'formLabelAlign.brakeinfo.end_time': {
      handler (n, o) {
        n = String(n)
        if (Number(n) == n) {
          if (n.includes('.')) {
            this.formLabelAlign.brakeinfo.end_time = n.slice(0, n.indexOf('.'))
          }
          if (n.slice(0, 1) === '0') {
            this.formLabelAlign.brakeinfo.end_time = n.slice(1)
          }
        } else {
          this.formLabelAlign.brakeinfo.end_time = o
        }
      },
    },
    //免费停车时间（分钟）(不能只输入0并且只能为整数)
    'formLabelAlign.priceinfo.car_time': {
      handler (n, o) {
        n = String(n)
        if (Number(n) == n) {
          if (n.includes('.')) {
            this.formLabelAlign.priceinfo.car_time = n.slice(0, n.indexOf('.'))
          }
          if (n.slice(0, 1) === '0') {
            this.formLabelAlign.priceinfo.car_time = n.slice(1)
          }
        } else {
          this.formLabelAlign.priceinfo.car_time = o
        }
      },
    },
    // 基本收费时长（小时）(不能只输入0并且只能为整数)
    'formLabelAlign.priceinfo.car_price_time': {
      handler (n, o) {
        n = String(n)
        if (Number(n) == n) {
          if (n.includes('.')) {
            this.formLabelAlign.priceinfo.car_price_time = n.slice(0, n.indexOf('.'))
          }
          if (n.slice(0, 1) === '0') {
            this.formLabelAlign.priceinfo.car_price_time = n.slice(1)
          }
        } else {
          this.formLabelAlign.priceinfo.car_price_time = o
        }
      },
    },
    // 基本收费费用（元）:(不能只输入0并且只能为两位小数)
    'formLabelAlign.priceinfo.car_price': {
      handler (n, o) {
        n = String(n)
        if (Number(n) == n) {
          if (n.includes('.')) {
            this.formLabelAlign.priceinfo.car_price = n.slice(0, n.indexOf('.') + 3)
          }
          if (n.slice(0, 2) === '00') {
            this.formLabelAlign.priceinfo.car_price = 0
          }
        } else {
          this.formLabelAlign.priceinfo.car_price = o
        }
      },
    },
    //超时后收费计时单位（小时）:(不能只输入0并且只能为整数)
    'formLabelAlign.priceinfo.time_out': {
      handler (n, o) {
        n = String(n)
        if (Number(n) == n) {
          if (n.includes('.')) {
            this.formLabelAlign.priceinfo.time_out = n.slice(0, n.indexOf('.'))
          }
          if (n.slice(0, 1) === '0') {
            this.formLabelAlign.priceinfo.time_out = n.slice(1)
          }
        } else {
          this.formLabelAlign.priceinfo.time_out = o
        }
      },
    },
    // 超时后收费单价（元）:(不能只输入0并且只能为两位小数)
    'formLabelAlign.priceinfo.time_out_price': {
      handler (n, o) {
        n = String(n)
        if (Number(n) == n) {
          if (n.includes('.')) {
            this.formLabelAlign.priceinfo.time_out_price = n.slice(0, n.indexOf('.') + 3)
          }
          if (n.slice(0, 2) === '00') {
            this.formLabelAlign.priceinfo.time_out_price = 0
          }
        } else {
          this.formLabelAlign.priceinfo.time_out_price = o
        }
      },
    },
    // 单日收费最高限制（元）:(不能只输入0并且只能为两位小数)
    'formLabelAlign.priceinfo.max_price': {
      handler (n, o) {
        n = String(n)
        if (Number(n) == n) {
          if (n.includes('.')) {
            this.formLabelAlign.priceinfo.max_price = n.slice(0, n.indexOf('.') + 3)
          }
          if (n.slice(0, 2) === '00') {
            this.formLabelAlign.priceinfo.max_price = 0
          }
        } else {
          this.formLabelAlign.priceinfo.max_price = o
        }
      },
    },
    // 最高收费金额(元)(不能只输入0并且只能为两位小数)
    'formLabelAlign.priceinfo.single_max_price': {
      handler (n, o) {
        n = String(n)
        if (Number(n) == n) {
          if (n.includes('.')) {
            this.formLabelAlign.priceinfo.single_max_price = n.slice(0, n.indexOf('.') + 3)
          }
          if (n.slice(0, 2) === '00') {
            this.formLabelAlign.priceinfo.single_max_price = 0
          }
        } else {
          this.formLabelAlign.priceinfo.single_max_price = o
        }
      },
    },
    //长租车欠费缓冲时长（天）(不能只输入0并且只能整数)
    'formLabelAlign.priceinfo.car_rent_price': {
      handler (n, o) {
        n = String(n)
        if (Number(n) == n) {
          if (n.includes('.')) {
            this.formLabelAlign.priceinfo.car_rent_price = n.slice(0, n.indexOf('.'))
          }
        } else {
          this.formLabelAlign.priceinfo.car_rent_price = o
        }
      },
    },
    // 长租车提前提示车位到期时间（天）(不能只输入0并且只能整数)
    'formLabelAlign.ledinfo.car_rent_day': {
      handler (n, o) {
        n = String(n)
        if (Number(n) == n) {
          if (n.includes('.')) {
            this.formLabelAlign.ledinfo.car_rent_day = n.slice(0, n.indexOf('.'))
          }
          if (n.slice(0, 1) === '0') {
            this.formLabelAlign.ledinfo.car_rent_day = n.slice(1)
          }
        } else {
          this.formLabelAlign.ledinfo.car_rent_day = o
        }
      },
    },
    //车辆通过时，显示屏重复显示信息的时间(不能只输入0并且只能整数)
    'formLabelAlign.ledinfo.time': {
      handler (n, o) {
        n = String(n)
        if (Number(n) == n) {
          if (n.includes('.')) {
            this.formLabelAlign.ledinfo.time = n.slice(0, n.indexOf('.'))
          }
          if (n.slice(0, 1) === '0') {
            this.formLabelAlign.ledinfo.time = n.slice(1)
          }
        } else {
          this.formLabelAlign.ledinfo.time = o
        }
      },
    },
  },
  created () {
    // console.log(this.screenConten.car_rent_admission, 'screenConten.car_rent_admission')
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'))
    const { Communityid, uid } = this.userInfo
    this.parkid = this.userInfo.Communityid
    const auth_id = this.$route.meta.auth_id
    //修改的数据回显
    this.setInfoHandler()
    //请求门岗数据
    this.getDoorList()
    // 按钮权限判定
    postSelect_button({ Communityid, uid, auth_id }).then(resp => {
      console.log(resp, 'resp按钮权限')
      if (resp.code === 200) {
        this.buttonLists = resp.data
        var btnList = this.buttonLists
        btnList.forEach(list => {
          if (list.auth_name === '修改全部') {
            this.buttonallShow = true
          }
          if (list.auth_name === '修改基础设置') {
            this.buttonbasisShow = true
          }
          if (list.auth_name === '修改开闸管理') {
            this.buttonbrakeShow = true
          }
          if (list.auth_name === '修改收费设置') {
            this.buttonpriceShow = true
          }
          if (list.auth_name === '修改显示屏设置') {
            this.buttonLedShow = true
          }
        })
      }
    })
  },
  mounted () {
    //显示屏下拉提示语
    //led下拉提示语
    postMonthly({}).then(resp => {
      this.screenConten.car_rent_admission1 = resp.data
    })
    postMonthlyOut({}).then(resp => {
      this.screenConten.car_rent_appearance1 = resp.data
    })
    postNonMonthly({}).then(resp => {
      this.screenConten.car_stop_admission1 = resp.data
      //无车时
      this.screenConten.car_no_admission1 = resp.data
    })
    postNonMonthlyOut({}).then(resp => {
      this.screenConten.car_stop_appearance1 = resp.data
      //无车时
      this.screenConten.car_no_appearance1 = resp.data
    })
  },

  methods: {
    //参数数据回显
    setInfoHandler () {
      postSetInfo({ parkid: this.parkid, type: 1 }).then(resp => {
        console.log(resp.data.priceinfo, 'resp参数数据回显')
        this.outId = resp.data.id
        this.formLabelAlign.basisinfo = resp.data.basisinfo
        this.formLabelAlign.brakeinfo = resp.data.brakeinfo
        this.formLabelAlign.ledinfo = resp.data.ledinfo
        this.formLabelAlign.priceinfo = resp.data.priceinfo
        // console.log(this.formLabelAlign.brakeinfo.car_yellow, typeof (this.formLabelAlign.brakeinfo.car_yellow), 'this.formLabelAlign')
        if (resp.data.brakeinfo) {
          // console.log('kkk')
          if (this.formLabelAlign.brakeinfo.car_yellow === null) {
            return
          } else if (this.formLabelAlign.brakeinfo.car_yellow > 0) {
            this.car_yellow1 = 1
            this.ChoiceDoor_value = this.formLabelAlign.brakeinfo.car_yellow
          }
        }
        //显示屏的回显数据处理
        const ledNum = this.formLabelAlign.ledinfo.led_number
        for (var i = 0; i < ledNum; i++) {
          this.car_rent_admission1[i] = resp.data.ledinfo.car_rent_admission[i]
          this.car_stop_admission1[i] = resp.data.ledinfo.car_stop_admission[i]
          this.car_no_admission1[i] = resp.data.ledinfo.car_no_admission[i]
          this.car_rent_appearance1[i] = resp.data.ledinfo.car_rent_appearance[i]
          this.car_stop_appearance1[i] = resp.data.ledinfo.car_stop_appearance[i]
          this.car_no_appearance1[i] = resp.data.ledinfo.car_no_appearance[i]
        }
      })
    },
    // 请求门岗数据
    getDoorList () {
      //请求门岗数据
      postDoorListId({ parkid: this.parkid }).then(resp => {
        this.options_ChoiceDoor = resp.data
      })
    },
    //门岗选择为否时，清除选择的数据
    mengangChange (num) {
      console.log(num, 'mengangChange')
      if (num === 0) {
        this.formLabelAlign.brakeinfo.car_yellow = num
      }
      this.mengangToast = ''
      this.ChoiceDoor_value = null
    },
    //自定义提示语的选择改变
    centonsCahnge () {
      this.formLabelAlign.brakeinfo.car_centons = ''
      this.myselfToast = ''
    },
    //自定义提示语失焦
    myselfBlur () {
      if (this.formLabelAlign.brakeinfo.car_centons === '') {
        this.myselfToast = '请输入自定义提示语'
      } else {
        this.myselfToast = ''
      }
    },
    //最高收费金额失去焦点
    hightBlur () {
      if (!this.formLabelAlign.priceinfo.single_max_price) {
        this.HightestToast = '请输入最高收费金额'
      } else if (this.formLabelAlign.priceinfo.single_max_price === '0' || this.formLabelAlign.priceinfo.single_max_price === '0.') {
        this.HightestToast = '请输入大于零的最高收费金额'
      }
      else {
        this.HightestToast = ''
      }
    },
    //单次停车是否有最高收费限制
    validata1 () {
      this.formLabelAlign.priceinfo.single_max_price = ''
      this.HightestToast = ''
    },
    ccBlur (index) {
      console.log(this.car_rent_admission1[index], 'gggggg')
      // this.car_rent_admission1[index] = 
    },
    createFilter (queryString) {
      return (restaurant) => {
        // console.log(restaurant,'restaurant')
        return (restaurant.name.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },
    querySearch (queryString, cb) {
      var restaurants = this.screenConten.car_rent_admission1;
      var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    handleIconClick (ev) {
      console.log(ev);
    },
    handleSelect (index) {
      console.log(this.car_rent_admission1[index], '1111111')

    },
    cc (index) {
      this.$refs[`car_rent_admission1${index}`][0].innerHTML = ''
    },
    cc1 (index) {
      this.$refs[`car_stop_admission1${index}`][0].innerHTML = ''
    },
    cc2 (index) {
      this.$refs[`car_no_admission1${index}`][0].innerHTML = ''
    },
    cc3 (index) {
      this.$refs[`car_rent_appearance1${index}`][0].innerHTML = ''
    },
    cc4 (index) {
      this.$refs[`car_stop_appearance1${index}`][0].innerHTML = ''
    },
    cc5 (index) {
      this.$refs[`car_no_appearance1${index}`][0].innerHTML = ''
    },
    //当显示屏行数改变时，提示语消失
    ledNumChange (num) {
      for (var i = 0; i < num; i++) {
        this.$refs[`car_rent_admission1${i}`][0].innerHTML = ''
        this.$refs[`car_stop_admission1${i}`][0].innerHTML = ''
        this.$refs[`car_no_admission1${i}`][0].innerHTML = ''
        this.$refs[`car_rent_appearance1${i}`][0].innerHTML = ''
        this.$refs[`car_stop_appearance1${i}`][0].innerHTML = ''
        this.$refs[`car_no_appearance1${i}`][0].innerHTML = ''
      }
    },
    handleChange (val) {
      console.log(val)
    },
    hanPoid_DoorType (id) {
      this.mengangToast = ''
      this.formLabelAlign.brakeinfo.car_yellow = id
    },

    //修改全部
    modifyAllHandler () {
      this.isActive1 = false
      this.isActive2 = false
      this.isActive3 = false
      this.isActive4 = false
      this.isActiveAll = true
      // alert('修改全部')
      //折叠栏全部展开
      this.activeNames = ['1', '2', '3', '4']
      //四项全部可编辑
      this.basisDisable = false
      this.brakeDisable = false
      this.ledDisable = false
      this.priceDisable = false
      //确认按钮出现
      this.querenVisible = true
      this.modifyNum = 0
      //其他四个修改全部消失
      this.modifybasisShow = false//基础设置修改按钮是否显示
      this.modifybrakeShow = false//基础设置修改按钮是否显示
      this.modifypriceShow = false//基础设置修改按钮是否显示
      this.modifyLedShow = false//基础设置修改按钮是否显示
    },
    //修改基础设置
    modifybasis () {
      this.isActiveAll = false
      this.isActive1 = true
      this.isActive2 = false
      this.isActive3 = false
      this.isActive4 = false
      //折叠栏全部展开
      this.activeNames = ['1']
      //基础设置可编辑
      this.basisDisable = false
      //确认按钮出现
      this.querenVisible = true
      this.modifyNum = 1

    },
    //修改开闸管理
    modifybrake () {
      this.isActiveAll = false
      this.isActive2 = true
      this.isActive1 = false
      this.isActive3 = false
      this.isActive4 = false
      //折叠栏全部展开
      this.activeNames = ['2']
      //开闸管理可编辑
      this.brakeDisable = false
      //确认按钮出现
      this.querenVisible = true
      this.modifyNum = 2
    },
    //修改收费设置
    modifyprice () {
      this.isActiveAll = false
      this.isActive3 = true
      this.isActive2 = false
      this.isActive1 = false
      this.isActive4 = false
      //折叠栏全部展开
      this.activeNames = ['3']
      //收费设置可编辑
      this.priceDisable = false
      //确认按钮出现
      this.querenVisible = true
      this.modifyNum = 3
    },
    //修改LED
    modifyLed () {
      this.isActiveAll = false
      this.isActive4 = true
      this.isActive2 = false
      this.isActive1 = false
      this.isActive3 = false
      //折叠栏全部展开
      this.activeNames = ['4']
      //LED可编辑
      this.ledDisable = false
      //确认按钮出现
      this.querenVisible = true
      this.modifyNum = 4
    },
    // 点击确认
    addSetting () {

      // alert(this.loadingQueren)
      // this.$forceUpdate()
      //前端验证
      // this.setInfoHandler()
      // 基础设置左边部分判断
      this.$refs.ruleFormBasisLeft.validate((valid) => {
        if (valid) {
          // alert('正确')
          this.validataformName = true
        } else {
          // alert('错误')
          this.validataformName = false
        }
      })
      // 基础设置右边部分判断
      this.$refs.ruleFormBasisRight.validate((valid) => {
        if (valid) {
          this.validataformName1 = true
        } else {
          this.validataformName1 = false
        }
      })
      // 开闸管理左部分判断
      this.$refs.ruleFormKaiZhaLeft.validate((valid) => {
        if (valid) {
          this.validataformName3 = true
        } else {
          this.validataformName3 = false
        }
      })
      // console.log(this.car_yellow1, 'this.car_yellow1 === 1this.car_yellow1 === 1')
      //开闸管理右部分判断
      if (this.car_yellow1 === 1) {
        //黄牌车指定通道，如果为是，则验证是否选择门岗
        if (this.ChoiceDoor_value) {
          // alert('不为空')
          this.mengangToast = ''
          this.validataformName8 = true
        } else {
          // alert('为空')
          this.validataformName8 = false
          this.mengangToast = '请选择门岗'
        }
      } else {
        this.validataformName8 = true
      }
      // 开闸管理右边判断验证自定义提示语
      if (this.formLabelAlign.brakeinfo.car_wuye_release === 1) {
        // 物业费欠费时是否不放行，如果为是，则验证自定义提示语
        if (this.formLabelAlign.brakeinfo.car_centons === '') {
          this.myselfToast = '请输入自定义提示语'
          this.validataformName4 = false
        } else {
          this.myselfToast = ''
          this.validataformName4 = true
        }
      } else {
        this.validataformName4 = true
      }
      // 收费设置左边判断
      this.$refs.ruleFormShoufeiLeft.validate((valid) => {
        if (valid) {
          this.validataformName5 = true
        } else {
          this.validataformName5 = false
        }
      })
      //收费管理右边最高收费金额验证
      if (this.formLabelAlign.priceinfo.single_max === 1) {

        if (!this.formLabelAlign.priceinfo.single_max_price) {
          // alert('kkk')
          this.validataformName7 = false
          this.HightestToast = '请输入最高收费金额'
        } else if (this.formLabelAlign.priceinfo.single_max_price === '0' || this.formLabelAlign.priceinfo.single_max_price === '0.' || this.formLabelAlign.priceinfo.single_max_price === '0.0' || this.formLabelAlign.priceinfo.single_max_price === '0.00') {
          this.validataformName7 = false
          this.HightestToast = '请输入大于零的最高收费金额'
        }
        else {
          this.validataformName7 = true
          this.HightestToast = ''
        }
      } else {

        this.validataformName7 = true
      }
      //收费设置右边判断
      //长租车欠费缓冲时长的验证
      this.$refs.ruleFormShoufeiRigh.validate((valid) => {
        if (valid) {
          this.validataformName6 = true
        } else {
          this.validataformName6 = false
        }
      })
      //led左边
      this.$refs.ruleFormLedLeft.validate((valid) => {
        if (valid) {
          this.validataformName9 = true
        } else {
          this.validataformName9 = false
        }
      })
      //扬声器判断
      if (this.formLabelAlign.ledinfo.sound < 1) {
        this.soundToast = "请选择扬声器声音大小"
        this.validataformName11 = false
      } else {
        this.soundToast = ""
        this.validataformName11 = true
      }
      //led右边
      this.$refs.ruleFormLedRight.validate((valid) => {
        if (valid) {
          this.validataformName10 = true
        } else {
          this.validataformName10 = false
        }
      })
      //显示屏设置的验证显示屏设置的验证显示屏设置的验证显示屏设置的验证(提示语设置)
      if (this.formLabelAlign.ledinfo.led_number) {
        const len = this.formLabelAlign.ledinfo.led_number
        console.log(this.car_rent_admission1, 'this.car_rent_admission1')
        // 深克隆数组
        const newArrCar_rent_admission1 = JSON.parse(JSON.stringify(this.car_rent_admission1))
        const newArrCar_stop_admission1 = JSON.parse(JSON.stringify(this.car_stop_admission1))
        const newArrCar_no_admission1 = JSON.parse(JSON.stringify(this.car_no_admission1))
        const newArrCar_rent_appearance1 = JSON.parse(JSON.stringify(this.car_rent_appearance1))
        const newArrCar_stop_appearance1 = JSON.parse(JSON.stringify(this.car_stop_appearance1))
        const newArrCar_no_appearance1 = JSON.parse(JSON.stringify(this.car_no_appearance1))
        //截取数组
        const newArr2Car_rent_admission1 = newArrCar_rent_admission1.splice(0, len)
        const newArr2Car_stop_admission1 = newArrCar_stop_admission1.splice(0, len)
        const newArr2Car_no_admission1 = newArrCar_no_admission1.splice(0, len)
        const newArr2Car_rent_appearance1 = newArrCar_rent_appearance1.splice(0, len)
        const newArr2Car_stop_appearance1 = newArrCar_stop_appearance1.splice(0, len)
        const newArr2Car_no_appearance1 = newArrCar_no_appearance1.splice(0, len)
        // 长租车,入场时显示屏显示的信息:
        newArr2Car_rent_admission1.forEach((item, i) => {

          this.formLabelAlign.ledinfo.car_rent_admission = newArr2Car_rent_admission1.join(',')
          if (item === "") {
            this.validataLed1 = false
            this.$refs[`car_rent_admission1${i}`][0].innerHTML = '长租车,入场时显示屏显示的信息不能为空'
          } else {
            this.validataLed1 = true
            this.$refs[`car_rent_admission1${i}`][0].innerHTML = ''
          }
        })
        //临停车,入场时显示屏显示的信息
        newArr2Car_stop_admission1.forEach((item, i) => {

          this.formLabelAlign.ledinfo.car_stop_admission = newArr2Car_stop_admission1.join(',')
          if (item === "") {
            this.validataLed2 = false
            this.$refs[`car_stop_admission1${i}`][0].innerHTML = '临停车,入场时显示屏显示的信息不能为空'
          } else {
            this.validataLed2 = true
            this.$refs[`car_stop_admission1${i}`][0].innerHTML = ''
          }
        })
        //无车时,入口显示屏显示的内容信息:
        newArr2Car_no_admission1.forEach((item, i) => {

          this.formLabelAlign.ledinfo.car_no_admission = newArr2Car_no_admission1.join(',')
          if (item === "") {
            this.validataLed3 = false
            this.$refs[`car_no_admission1${i}`][0].innerHTML = '无车时,入口显示屏显示的内容信息不能为空'
          } else {
            this.validataLed3 = true
            this.$refs[`car_no_admission1${i}`][0].innerHTML = ''
          }
        })
        // 长租车,出场时显示屏显示的信息:
        newArr2Car_rent_appearance1.forEach((item, i) => {

          this.formLabelAlign.ledinfo.car_rent_appearance = newArr2Car_rent_appearance1.join(',')
          if (item === "") {
            this.validataLed4 = false
            this.$refs[`car_rent_appearance1${i}`][0].innerHTML = '长租车,出场时显示屏显示的信息不能为空'
          } else {
            this.validataLed4 = true
            this.$refs[`car_rent_appearance1${i}`][0].innerHTML = ''
          }
        })
        // 临停车,出场时显示屏显示的信息:
        newArr2Car_stop_appearance1.forEach((item, i) => {

          this.formLabelAlign.ledinfo.car_stop_appearance = newArr2Car_stop_appearance1.join(',')
          if (item === "") {
            this.validataLed5 = false
            this.$refs[`car_stop_appearance1${i}`][0].innerHTML = '临停车,出场时显示屏显示的信息不能为空'
          } else {
            this.validataLed5 = true
            this.$refs[`car_stop_appearance1${i}`][0].innerHTML = ''
          }
        })
        // 无车时,出口显示屏显示的内容信息
        newArr2Car_no_appearance1.forEach((item, i) => {

          this.formLabelAlign.ledinfo.car_no_appearance = newArr2Car_no_appearance1.join(',')
          if (item === "") {
            this.validataLed6 = false
            this.$refs[`car_no_appearance1${i}`][0].innerHTML = '无车时,出口显示屏显示的内容信息不能为空'
          } else {
            this.validataLed6 = true
            this.$refs[`car_no_appearance1${i}`][0].innerHTML = ''
          }
        })
      }

      //1(修改基础设置)
      if (this.modifyNum === 1) {

        var basisQuery = {}//传递给后端的参数
        basisQuery.basis_name = this.formLabelAlign.basisinfo.basis_name
        basisQuery.basis_phone = this.formLabelAlign.basisinfo.basis_phone
        basisQuery.basis_address = this.formLabelAlign.basisinfo.basis_address
        basisQuery.basis_number = this.formLabelAlign.basisinfo.basis_number
        basisQuery.id = this.outId
        basisQuery.parkid = this.parkid
        this.basisQuery = basisQuery
        setTimeout(() => {
          if (this.validataformName && this.validataformName1) {
            this.loadingQueren = true
            //全部验证成功后
            postSetupdateBasis(basisQuery).then(resp => {
              this.loadingQueren = false
              if (resp.data = '修改成功') {
                this.$message({
                  message: '修改成功',
                  type: 'success'
                })
                this.basisDisable = true
                this.querenVisible = false
                //修改中变为修改
                this.isActive1 = false
                //数据回显
                this.setInfoHandler()
              } else if (resp.data = '您未修改内容或修改失败') {
                this.$message({
                  message: '您未修改任何内容或修改失败',
                  type: 'warning'
                })
                this.basisDisable = true
                this.querenVisible = false
                //修改中变为修改完成
                this.isActive1 = false
              }
            })
          }
        }, 500);
      } else if (this.modifyNum === 2) {
        // 2(开闸管理)

        var brakeQuery = {}
        brakeQuery.car_app = this.formLabelAlign.brakeinfo.car_app
        brakeQuery.end_time = this.formLabelAlign.brakeinfo.end_time
        brakeQuery.id = this.formLabelAlign.brakeinfo.id
        brakeQuery.car_number = this.formLabelAlign.brakeinfo.car_number
        brakeQuery.car_rent = this.formLabelAlign.brakeinfo.car_rent
        brakeQuery.car_export = this.formLabelAlign.brakeinfo.car_export
        brakeQuery.car_endtime = this.formLabelAlign.brakeinfo.car_endtime
        brakeQuery.car_double = this.formLabelAlign.brakeinfo.car_double
        brakeQuery.car_yellow = this.formLabelAlign.brakeinfo.car_yellow
        // basisQuery.car_yellow = this.formLabelAlign.brakeinfo.car_yellow
        brakeQuery.car_police = this.formLabelAlign.brakeinfo.car_police
        brakeQuery.car_wuye = this.formLabelAlign.brakeinfo.car_wuye
        brakeQuery.car_wuye_release = this.formLabelAlign.brakeinfo.car_wuye_release
        brakeQuery.parkid = this.parkid
        brakeQuery.car_centons = this.formLabelAlign.brakeinfo.car_centons
        console.log(brakeQuery, 'brakeQuery')
        this.brakeQuery = brakeQuery
        setTimeout(() => {
          if (this.validataformName3 && this.validataformName4 && this.validataformName8) {
            this.loadingQueren = true
            //全部验证成功后
            postSetupdateBrake(brakeQuery).then(resp => {
              this.loadingQueren = false
              if (resp.data = '修改成功') {
                this.$message({
                  message: resp.data,
                  type: 'success'
                })
                this.brakeDisable = true
                //确认按钮消失
                this.querenVisible = false
                this.isActive2 = false
                this.setInfoHandler()
              } else if (resp.data = '您未修改内容或修改失败') {
                this.$message({
                  message: '您未修改任何内容或修改失败',
                  type: 'warning'
                })
                this.brakeDisable = true
                //确认按钮消失
                this.querenVisible = false
                this.isActive2 = false
              }
            })
          }
        }, 500);
      } else if (this.modifyNum === 3) {
        // this.loadingQueren = false
        // 3(收费设置)
        // console.log(this.formLabelAlign, '222222222收费设置222222222222222222222')
        var priceQuery = {}
        priceQuery.car_time = this.formLabelAlign.priceinfo.car_time
        priceQuery.car_price_time = this.formLabelAlign.priceinfo.car_price_time
        priceQuery.car_price = this.formLabelAlign.priceinfo.car_price
        priceQuery.time_out = this.formLabelAlign.priceinfo.time_out
        priceQuery.time_out_price = this.formLabelAlign.priceinfo.time_out_price
        priceQuery.max_price = this.formLabelAlign.priceinfo.max_price
        priceQuery.cycle = this.formLabelAlign.priceinfo.cycle
        priceQuery.single_max = this.formLabelAlign.priceinfo.single_max
        priceQuery.single_max_price = this.formLabelAlign.priceinfo.single_max_price
        priceQuery.car_double_price = this.formLabelAlign.priceinfo.car_double_price
        priceQuery.car_double_price_2 = this.formLabelAlign.priceinfo.car_double_price_2
        priceQuery.car_rent_price = this.formLabelAlign.priceinfo.car_rent_price
        priceQuery.car_rent_price_2 = this.formLabelAlign.priceinfo.car_rent_price_2
        priceQuery.id = this.formLabelAlign.priceinfo.id
        priceQuery.parkid = this.parkid
        this.priceQuery = priceQuery
        setTimeout(() => {
          if (this.validataformName5 && this.validataformName6 && this.validataformName7) {
            this.loadingQueren = true
            //全部验证成功后
            postSetupdatePrice(priceQuery).then(resp => {
              this.loadingQueren = false
              if (resp.data = '修改成功') {
                this.$message({
                  message: resp.data,
                  type: 'success'
                })
                this.priceDisable = true
                //确认按钮出现
                this.querenVisible = false
                this.isActive3 = false
                this.setInfoHandler()
              } else if (resp.data = '您未修改内容或修改失败') {
                this.$message({
                  message: '您未修改任何内容或修改失败',
                  type: 'warning'
                })
                this.priceDisable = true
                //确认按钮出现
                this.querenVisible = false
                this.isActive3 = false
              }
            })
          }
        }, 500);

      } else if (this.modifyNum === 4) {
        //显示屏修改
        var ledQuery = {}
        ledQuery.car_rent_admission = this.car_rent_admission1.join(',')
        ledQuery.car_rent_appearance = this.car_rent_appearance1.join(',')
        ledQuery.car_stop_admission = this.car_stop_admission1.join(',')
        ledQuery.car_stop_appearance = this.car_stop_appearance1.join(',')
        ledQuery.car_no_admission = this.car_no_admission1.join(',')
        ledQuery.car_no_appearance = this.car_no_appearance1.join(',')
        ledQuery.led_number = this.formLabelAlign.ledinfo.led_number
        ledQuery.car_rent_day = this.formLabelAlign.ledinfo.car_rent_day
        ledQuery.sound = this.formLabelAlign.ledinfo.sound
        ledQuery.time = this.formLabelAlign.ledinfo.time
        ledQuery.id = this.formLabelAlign.ledinfo.id
        ledQuery.parkid = this.parkid
        this.ledQuery = ledQuery
        setTimeout(() => {
          if (this.validataformName9 && this.validataformName10 && this.validataformName11
            && this.validataLed1 && this.validataLed2 && this.validataLed3 && this.validataLed4 &&
            this.validataLed5 && this.validataLed6
          ) {
            this.loadingQueren = true
            //全部验证成功后
            postSetupdateLed(ledQuery).then(resp => {
              this.loadingQueren = false

              if (resp.data = '修改成功') {
                this.$message({
                  message: resp.data,
                  type: 'success'
                })
                this.ledDisable = true
                //确认按钮出现
                this.querenVisible = false
                this.isActive4 = false
                this.setInfoHandler()
              } else if (resp.data = '您未修改内容或修改失败') {
                this.$message({
                  message: '您未修改任何内容或修改失败',
                  type: 'warning'
                })
                this.ledDisable = true
                //确认按钮出现
                this.querenVisible = false
                this.isActive4 = false
              }
            })
          }
        }, 500);
      } else if (this.modifyNum === 0) {

        //全部修改
        var modifyAllQuery = {}
        modifyAllQuery.basis_name = this.formLabelAlign.basisinfo.basis_name
        modifyAllQuery.basis_address = this.formLabelAlign.basisinfo.basis_address
        modifyAllQuery.basis_phone = this.formLabelAlign.basisinfo.basis_phone
        modifyAllQuery.basis_number = this.formLabelAlign.basisinfo.basis_number
        modifyAllQuery.car_number = this.formLabelAlign.brakeinfo.car_number
        modifyAllQuery.car_rent = this.formLabelAlign.brakeinfo.car_rent
        modifyAllQuery.car_export = this.formLabelAlign.brakeinfo.car_export
        modifyAllQuery.car_endtime = this.formLabelAlign.brakeinfo.car_endtime
        modifyAllQuery.car_double = this.formLabelAlign.brakeinfo.car_double
        modifyAllQuery.car_yellow = this.formLabelAlign.brakeinfo.car_yellow
        modifyAllQuery.car_police = this.formLabelAlign.brakeinfo.car_police
        modifyAllQuery.car_wuye = this.formLabelAlign.brakeinfo.car_wuye
        modifyAllQuery.car_wuye_release = this.formLabelAlign.brakeinfo.car_wuye_release
        modifyAllQuery.car_app = this.formLabelAlign.brakeinfo.car_app
        modifyAllQuery.led_number = this.formLabelAlign.ledinfo.led_number
        modifyAllQuery.car_rent_admission = this.car_rent_admission1.join(',')
        modifyAllQuery.car_rent_appearance = this.car_rent_appearance1.join(',')
        modifyAllQuery.car_stop_admission = this.car_stop_admission1.join(',')
        modifyAllQuery.car_stop_appearance = this.car_stop_appearance1.join(',')
        modifyAllQuery.car_no_admission = this.car_no_admission1.join(',')
        modifyAllQuery.car_no_appearance = this.car_no_appearance1.join(',')
        modifyAllQuery.car_rent_day = this.formLabelAlign.ledinfo.car_rent_day
        modifyAllQuery.sound = this.formLabelAlign.ledinfo.sound
        modifyAllQuery.car_time = this.formLabelAlign.priceinfo.car_time
        modifyAllQuery.car_price_time = this.formLabelAlign.priceinfo.car_price_time
        modifyAllQuery.car_price = this.formLabelAlign.priceinfo.car_price
        modifyAllQuery.time_out = this.formLabelAlign.priceinfo.time_out
        modifyAllQuery.time_out_price = this.formLabelAlign.priceinfo.time_out_price
        modifyAllQuery.max_price = this.formLabelAlign.priceinfo.max_price
        modifyAllQuery.cycle = this.formLabelAlign.priceinfo.cycle
        modifyAllQuery.single_max = this.formLabelAlign.priceinfo.single_max
        modifyAllQuery.single_max_price = this.formLabelAlign.priceinfo.single_max_price
        modifyAllQuery.car_double_price = this.formLabelAlign.priceinfo.car_double_price
        modifyAllQuery.car_double_price_2 = this.formLabelAlign.priceinfo.car_double_price_2
        modifyAllQuery.car_rent_price = this.formLabelAlign.priceinfo.car_rent_price
        modifyAllQuery.car_rent_price_2 = this.formLabelAlign.priceinfo.car_rent_price_2
        modifyAllQuery.pid = 0
        modifyAllQuery.car_centons = this.formLabelAlign.brakeinfo.car_centons
        modifyAllQuery.time = this.formLabelAlign.ledinfo.time
        modifyAllQuery.id = this.outId
        modifyAllQuery.state = 1
        modifyAllQuery.id = this.outId
        modifyAllQuery.parkid = this.parkid
        modifyAllQuery.end_time = this.formLabelAlign.brakeinfo.end_time
        // console.log(modifyAllQuery, '修改全部时的参数')
        //   console.log({
        //   'validataformName': this.validataformName,
        //   'validataformName1': this.validataformName1,
        //   'validataformName3': this.validataformName3,
        //   'validataformName4': this.validataformName4,
        //   'validataformName5': this.validataformName5,
        //   'validataformName6': this.validataformName6,
        //   'validataformName7': this.validataformName7,
        //   'validataformName8': this.validataformName8,
        //   'validataformName9': this.validataformName9,
        //   'validataformName10': this.validataformName10,
        //   'validataformName11': this.validataformName11,
        //   'validataLed1': this.validataLed1,
        //   'validataLed2': this.validataLed2,
        //   'validataLed3': this.validataLed3,
        //   'validataLed4': this.validataLed4,
        //   'validataLed5': this.validataLed5,
        //   'validataLed6': this.validataLed6,
        // }
        // )
        setTimeout(() => {
          if (this.validataformName && this.validataformName1 && this.validataformName3 && this.validataformName4 && this.validataformName5
            && this.validataformName6 && this.validataformName7 && this.validataformName8 && this.validataformName9 && this.validataformName10 && this.validataformName11 &&
            this.validataLed1 && this.validataLed2 && this.validataLed3 && this.validataLed4 && this.validataLed5 && this.validataLed6
          ) {
            this.loadingQueren = true
            //全部验证成功后
            postSetupdateAll(modifyAllQuery).then(resp => {
              if (resp.data === '参数修改成功') {
                this.loadingQueren = false
                this.$message({
                  message: resp.data,
                  type: 'success'
                })
                this.basisDisable = true
                this.brakeDisable = true
                this.ledDisable = true
                this.priceDisable = true
                //确认按钮出现
                this.querenVisible = false
                this.isActiveAll = false
                //其他四个修改全部出现
                this.modifybasisShow = true//基础设置修改按钮是否显示
                this.modifybrakeShow = true//基础设置修改按钮是否显示
                this.modifypriceShow = true//基础设置修改按钮是否显示
                this.modifyLedShow = true//基础设置修改按钮是否显示
                this.setInfoHandler()
              } else if (resp.data === '您未修改内容或修改失败') {
                this.loadingQueren = false
                this.$message({
                  message: '您未修改任何内容或修改失败',
                  type: 'warning'
                })
                this.querenVisible = false
                this.isActiveAll = false
                //其他四个修改全部出现
                this.modifybasisShow = true//基础设置修改按钮是否显示
                this.modifybrakeShow = true//基础设置修改按钮是否显示
                this.modifypriceShow = true//基础设置修改按钮是否显示
                this.modifyLedShow = true//基础设置修改按钮是否显示
              }
            })
          }
        }, 500);
      }
    }
  }
}
</script>
<style lang='scss' scoped>
.hard-setparamClass {
  height: 93%;
  // overflow: hidden;
}
.setparam-container {
  position: relative;
  padding: 0px 20px;
  // box-sizing: border-box;
  // overflow: hi;
  width: 100%;
  .sum-class {
    display: flex;
    // height: ;
    margin: 0px 20px;
    .left-class {
      margin-right: 100px;
      margin-left: 78px;
      box-sizing: border-box;
    }
  }
}
/deep/.el-input__inner {
  border: 1px solid #dcdfe6ff !important;
  width: 400px !important;
  height: 32px !important;
}
.sumbox {
  width: 50%;
  height: 100%;
}
/deep/.el-form--label-top .el-form-item__label {
  padding: 0px !important;
  height: 27px;
  margin-bottom: 5px;
  font-size: 14px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: rgba(102, 102, 102, 1);
}
.button-class {
  cursor: pointer;
  position: absolute;
  height: 30px;
  bottom: -150px;
  width: 97%;
  display: flex;
  justify-content: center;
  margin-bottom: 50px;
  box-sizing: border-box;
  .button {
    background-color: #f00;
    border: none;
    width: 72px;
    height: 30px;
    background: rgba(252, 176, 72, 1);
    border-radius: 4px;
    line-height: 30px;
    text-align: center;
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: rgba(255, 254, 254, 1);
  }
}
/deep/ .el-form-item {
  height: 75px !important;
}
.selectClass {
  margin-bottom: 8px;
  /deep/.el-input__inner {
    width: 340px !important;
  }
}
.modify-all {
  width: 100%;
  position: relative;
  &_span {
    cursor: pointer;
    position: absolute;
    right: 15px;
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: rgba(102, 102, 102, 1);
  }
}
/deep/.el-collapse-item {
  // background: #f00 !important;
  color: red !important;
  min-width: 1000px;
}
.modify-some {
  width: 100%;
  height: 32px;
  position: relative;
  &_span {
    cursor: pointer;
    position: absolute;
    right: 20px;
  }
}
.ledtoast-class {
  height: 15px;
  line-height: 10px;
  font-size: 14px;
  // padding-top: 3px;
  color: #ff0000;
}
.more-class {
  // background-color: #f00;
  height: 50px !important;
  line-height: 35px;
  /deep/.el-form-item__label {
    line-height: 18px !important;
  }
  .el-radio-group {
    margin-top: -10px;
  }
}
.yellow-class {
  height: 60px !important;
  margin-bottom: 5px;
  /deep/.el-select {
    top: -9px !important;
    margin-bottom: 25px !important;
  }
  /deep/ .el-input__icon {
    line-height: 32px !important;
  }
}
/deep/.qianfei-calss {
  height: 100px !important;
  margin-bottom: 10px;
}
/deep/.el-form-item__content {
  line-height: 32px;
}
.single-class {
  // background-color: #f00;
  margin-bottom: 0px !important;
  /deep/.el-form-item__content {
    line-height: 30px;
  }
}
.hoight-class {
  width: 180px;
  display: flex;
  /deep/.el-input__inner {
    width: 160px !important;
  }
}
.plabel-class {
  margin-bottom: 8px;
  font-size: 14px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: rgba(102, 102, 102, 1);
}
.hang-class {
  font-size: 14px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: rgba(102, 102, 102, 1);
  display: inline-block;
  margin-right: 10px;
}
.oten-class {
  font-size: 14px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: rgba(102, 102, 102, 1);
  margin-bottom: 8px;
  margin-top: -8px;
}
/deep/.el-input.is-disabled .el-input__icon {
  cursor: default !important;
}
/deep/.el-autocomplete-suggestion {
  width: 349px !important;
}
/deep/.el-autocomplete {
  width: 349px !important;
  input {
    width: 349px !important;
  }
}
/deep/ .el-input__icon {
  line-height: 30px !important;
}
/deep/.el-loading-spinner {
  top: 68%;
}
.active {
  color: #5fafe4;
}
.modify-all_span {
  bottom: 5px !important;
}
</style>
