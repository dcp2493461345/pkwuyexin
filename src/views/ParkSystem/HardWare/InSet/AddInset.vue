<template>
  <div class="modify-main" style="position:relative;">
    <div class="card-main">
      <span id="newadd" @click="isExit">返回上一级</span>
    </div>
    <el-collapse v-model="activeNames" @change="handleChange">
      <!-- 基础设置 -->
      <el-collapse-item title="基础设置" name="1">
        <!-- 总 -->
        <div class="sum-class">
          <!-- 左部分 -->
          <div class="sumbox left-class">
            <el-form
              ref="ruleFormBasisLeft"
              :label-position="labelPosition"
              label-width="80px"
              :disabled="disableShow"
              :model="formLabelAlign"
              :rules="rules"
            >
              <el-form-item label="内场名称:" prop="name">
                <el-input v-model="formLabelAlign.name" placeholder="请输入内场名称" />
              </el-form-item>
            </el-form>
          </div>
          <!-- 右部分 -->
          <div class="sumbox right-class">
            <el-form
              :label-position="labelPosition"
              label-width="80px"
              :disabled="disableShow"
              ref="ruleFormBasisRight"
              :model="formLabelAlign"
              :rules="rules"
            >
              <el-form-item label="内场车位总数:" prop="basis_number">
                <el-input v-model="formLabelAlign.basis_number" placeholder="请输入停车位数量" />
              </el-form-item>
            </el-form>
          </div>
        </div>
      </el-collapse-item>
      <!-- 开闸管理 -->
      <el-collapse-item title="开闸管理" name="2">
        <!-- 总 -->
        <div class="sum-class">
          <!-- 左部分 -->
          <div class="sumbox left-class">
            <el-form
              :label-position="labelPosition"
              label-width="80px"
              :disabled="disableShow"
              ref="ruleFormKaiZhaLeft"
              :model="formLabelAlign"
              :rules="rules"
            >
              <el-form-item label="是否匹配车牌地域名称（例：京、川）:">
                <el-radio-group v-model="formLabelAlign.car_number">
                  <el-radio :label="1">是</el-radio>
                  <el-radio :label="2">否</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="入口处，非长租车辆是否开闸:">
                <el-radio-group v-model="formLabelAlign.car_rent">
                  <el-radio :label="1">是</el-radio>
                  <el-radio :label="2">否</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="出口是否无条件开闸:">
                <el-radio-group v-model="formLabelAlign.car_export">
                  <el-radio :label="1">是</el-radio>
                  <el-radio :label="2">否</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="同一道口，重复识别车牌间隔时间（秒）:" prop="car_endtime">
                <el-input v-model="formLabelAlign.car_endtime" />
              </el-form-item>
              <!-- TODOS: -->
              <el-form-item label="支付后多少分钟内需要离场（分钟）:" prop="end_time">
                <el-input v-model="formLabelAlign.end_time" />
              </el-form-item>
              <el-form-item label="一位或多位多车的情况下，当车位已有停放车辆时，所属车位下其他车辆入场是否允许抬杆放行:" class="more-class">
                <el-radio-group v-model="formLabelAlign.car_double">
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
              :disabled="disableShow"
              ref="ruleFormKaiZhaRight"
              :model="formLabelAlign"
              :rules="rules"
            >
              <el-form-item label="黄牌车指定通道:" class="yellow-class">
                <el-radio-group v-model="car_yellow1" @change="mengangChange">
                  <el-radio :label="1">是</el-radio>
                  <el-radio :label="0">否</el-radio>
                </el-radio-group>
              </el-form-item>
              <!-- //请选择门岗 -->
              <el-select v-model="ChoiceDoor_value" v-if="car_yellow1 === 1" placeholder="请选择门岗">
                <!-- v-model="value"中'value"的值为el-option的value属性值 -->
                <el-option
                  v-for="item in options_ChoiceDoor"
                  :key="item.id"
                  :label="item.door_post_name"
                  :value="item.door_post_name"
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
                style="margin:8px 0 9px;height:3px;"
              >{{mengangToast}}</p>
              <el-form-item label="军警车是否自动开闸:">
                <el-radio-group v-model="formLabelAlign.car_police">
                  <el-radio :label="1">是</el-radio>
                  <el-radio :label="2">否</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="是否检测有无物业欠费情况:">
                <el-radio-group v-model="formLabelAlign.car_wuye">
                  <el-radio :label="1">是</el-radio>
                  <el-radio :label="2">否</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item
                label="物业费欠费时是否不放行:"
                v-if="formLabelAlign.car_wuye === 1 ? true : false"
                class="qianfei-calss"
              >
                <el-radio-group v-model="formLabelAlign.car_wuye_release" @change="centonsCahnge">
                  <el-radio :label="1">是</el-radio>
                  <el-radio :label="2">否</el-radio>
                </el-radio-group>
                <el-input
                  v-model="formLabelAlign.car_centons"
                  placeholder="请输入自定义提示语"
                  v-if="formLabelAlign.car_wuye_release === 1 ? true : false"
                  @blur="myselfBlur"
                />
              </el-form-item>
              <p
                v-if="formLabelAlign.car_wuye_release=== 1"
                class="ledtoast-class"
                style="height:5px;margin:-2px 0 10px"
              >{{myselfToast}}</p>
              <el-form-item label="使用APP或公众号申请绑定车辆时，是否需要后台操作人员审核:">
                <el-radio-group v-model="formLabelAlign.car_app">
                  <el-radio :label="1">是</el-radio>
                  <el-radio :label="2">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </el-collapse-item>
      <!-- 收费设置 -->
      <el-collapse-item title="收费设置" name="3">
        <!-- 总 -->
        <div class="sum-class">
          <!-- 左部分 -->
          <div class="sumbox left-class">
            <el-form
              :label-position="labelPosition"
              label-width="80px"
              :disabled="disableShow"
              ref="ruleFormShoufeiLeft"
              :model="formLabelAlign"
              :rules="rules"
            >
              <el-form-item label="免费停车时间（分钟）:" prop="car_time">
                <el-input v-model="formLabelAlign.car_time" />
              </el-form-item>
              <el-form-item label="基本收费时长（小时）:" prop="car_price_time">
                <el-input v-model="formLabelAlign.car_price_time" />
              </el-form-item>
              <el-form-item label="基本收费费用（元）:" prop="car_price">
                <el-input v-model="formLabelAlign.car_price	" />
              </el-form-item>
              <el-form-item label="超时后收费计时单位（小时）:" prop="time_out">
                <el-input v-model="formLabelAlign.time_out" />
              </el-form-item>
              <el-form-item label="超时后收费单价（元）:" prop="time_out_price">
                <el-input v-model="formLabelAlign.time_out_price" />
              </el-form-item>
              <!-- <p class="oten-class">若上方四个值分别为:2，3，2，3，则超过免费时长后2小时内收费3元,超过2个小时,每2个小时收费3元</p> -->
              <p class="oten-class">
                超过免费停车时长后，
                <span
                  v-html="formLabelAlign.car_price_time ? formLabelAlign.car_price_time : 'X'"
                ></span>小时内收费
                <span v-html="formLabelAlign.car_price ? formLabelAlign.car_price : 'X'"></span>元，超过
                <span
                  v-html="formLabelAlign.car_price_time ? formLabelAlign.car_price_time : 'X'"
                ></span>小时后，每
                <span v-html="formLabelAlign.time_out ? formLabelAlign.time_out : 'X'"></span>小时加收
                <span
                  v-html="formLabelAlign.time_out_price ? formLabelAlign.time_out_price : 'X'"
                ></span>元
              </p>
              <el-form-item label="单日收费最高限制（元）:">
                <el-input v-model="formLabelAlign.max_price" placeholder="不填代表无限制" />
              </el-form-item>
            </el-form>
          </div>
          <!-- 右部分 -->
          <div class="sumbox right-class">
            <el-form
              :label-position="labelPosition"
              label-width="80px"
              :disabled="disableShow"
              ref="ruleFormShoufeiRigh"
              :model="formLabelAlign"
              :rules="rules"
            >
              <el-form-item label="单日结算周期:">
                <el-select v-model="formLabelAlign.cycle">
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
                <el-radio-group v-model="formLabelAlign.single_max" @change="validata1">
                  <el-radio :label="1">是</el-radio>
                  <el-radio :label="2">否</el-radio>
                </el-radio-group>
              </el-form-item>
              <div v-if="formLabelAlign.single_max === 1" class="hoight-class">
                <el-input
                  v-model="formLabelAlign.single_max_price"
                  placeholder="请输入最高收费金额"
                  v-if="formLabelAlign.single_max === 1"
                  @blur="hightBlur"
                />
                <span style="display:inline-block;height:20px;line-height:30px;">元</span>
              </div>
              <p
                v-if="formLabelAlign.single_max === 1"
                class="ledtoast-class"
                style="margin-top:5px;"
              >{{HightestToast}}</p>
              <el-form-item label="一位多车情况下，当车位已有停放车辆时，所属车位下其他车辆入场是否持续计费:">
                <el-radio-group v-model="formLabelAlign.car_double_price">
                  <el-radio :label="1">是</el-radio>
                  <el-radio :label="2">否</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="一位多车情况下，当车位所剩车辆和车位数量相符时是否停止收费:">
                <el-radio-group v-model="formLabelAlign.car_double_price_2">
                  <el-radio :label="1">是</el-radio>
                  <el-radio :label="2">否</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="长租车欠费缓冲时长（天）:" prop="car_rent_price">
                <el-input v-model="formLabelAlign.car_rent_price" placeholder="请输入停车场负责人" />
              </el-form-item>
              <el-form-item label="长租车出场时若租期已满，是否从过期时间计算费用:">
                <el-radio-group v-model="formLabelAlign.car_rent_price_2">
                  <el-radio :label="1">是</el-radio>
                  <el-radio :label="2">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-form>
          </div>
        </div>
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
              :disabled="disableShow"
              :model="formLabelAlign"
              :rules="rules"
              ref="ruleFormLedLeft"
            >
              <el-form-item label="显示屏显示行数:">
                <!-- //下拉框 -->
                <el-select
                  v-model="formLabelAlign.led_number"
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
              <div v-for="(item,index) in formLabelAlign.led_number" :key="index+'b'">
                <span class="hang-class">第{{chineseNum[index]}}行</span>
                <el-select
                  filterable
                  v-model="car_rent_admission1[index]"
                  :allow-create="true"
                  reserve-keyword
                  class="selectClass"
                  placeholder
                  @change="cc(index)"
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
              <div v-for="(item,index) in formLabelAlign.led_number" :key="index+'c'">
                <span class="hang-class">第{{chineseNum[index]}}行</span>
                <el-select
                  filterable
                  v-model="car_stop_admission1[index]"
                  class="selectClass"
                  :allow-create="true"
                  default-first-option
                  reserve-keyword
                  placeholder
                  @change="cc1(index)"
                >
                  <div v-if="selectShow">
                    <el-option
                      v-for="(item,index) in screenConten.car_stop_admission1"
                      :key="index"
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
              <div v-for="(item,index) in formLabelAlign.led_number" :key="index+'d'">
                <span class="hang-class">第{{chineseNum[index]}}行</span>
                <el-select
                  filterable
                  v-model="car_no_admission1[index]"
                  class="selectClass"
                  :allow-create="true"
                  reserve-keyword
                  placeholder
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
              <el-form-item label="长租车提前提示车位到期时间（天）:" prop="car_rent_day">
                <el-input v-model="formLabelAlign.car_rent_day" />
              </el-form-item>
              <el-form-item label="扬声器声音大小(0-10):" prop="sound">
                <!-- <span>扬声器{{formLabelAlign.sound}}</span> -->
                <div class="block" style="width: 400px;">
                  <el-slider v-model="formLabelAlign.sound" show-stops :max="10" :step="1"></el-slider>
                </div>
                <p class="ledtoast-class">{{soundToast}}</p>
              </el-form-item>
            </el-form>
          </div>
          <!-- 右部分 -->
          <div class="sumbox right-class" style="margin-top:96px;">
            <el-form
              :label-position="labelPosition"
              label-width="80px"
              :disabled="disableShow"
              :model="formLabelAlign"
              :rules="rules"
              ref="ruleFormLedRight"
            >
              <!-- 长租车,入场时显示屏显示的信息:长租车,入场时显示屏显示的信息:长租车,入场时显示屏显示的信息:长租车,入场时显示屏显示的信息:长租车,入场时显示屏显示的信息: -->

              <p class="plabel-class">长租车,出场时显示屏显示的信息:</p>
              <!-- //下拉框 -->
              <div v-for="(item,index) in formLabelAlign.led_number" :key="index+'e'">
                <span class="hang-class">第{{chineseNum[index]}}行</span>
                <el-select
                  filterable
                  v-model="car_rent_appearance1[index]"
                  class="selectClass"
                  :allow-create="true"
                  reserve-keyword
                  placeholder
                  @change="cc3(index)"
                >
                  <div v-if="selectShow">
                    <el-option
                      v-for="(item,index) in screenConten.car_rent_appearance1"
                      :key="index"
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
              <div v-for="(item,index) in formLabelAlign.led_number" :key="index+'f'">
                <span class="hang-class">第{{chineseNum[index]}}行</span>
                <el-select
                  filterable
                  v-model="car_stop_appearance1[index]"
                  class="selectClass"
                  :allow-create="true"
                  default-first-option
                  reserve-keyword
                  placeholder
                  @change="cc4(index)"
                >
                  <!-- v-model="value"中'value"的值为el-option的value属性值 -->
                  <span slot="empty" class="select-dropdown__empty">没有此选项</span>
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
              <!-- 无车时,出口显示屏显示的内容信息无车时,出口显示屏显示的内容信息无车时,出口显示屏显示的内容信息 -->
              <p class="plabel-class">无车时,出口显示屏显示的内容信息:</p>
              <!-- //下拉框 -->
              <div v-for="(item,index) in formLabelAlign.led_number" :key="index+'g'">
                <span class="hang-class">第{{chineseNum[index]}}行</span>
                <el-select
                  filterable
                  v-model="car_no_appearance1[index]"
                  class="selectClass"
                  :allow-create="true"
                  reserve-keyword
                  placeholder
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
              <!-- 车辆通过时，显示屏重复显示信息的时间（秒）车辆通过时，显示屏重复显示信息的时间（秒） -->
              <el-form-item label="车辆通过时，显示屏重复显示信息的时间（秒）:" prop="time">
                <el-input v-model="formLabelAlign.time" />
              </el-form-item>
            </el-form>
          </div>
        </div>
      </el-collapse-item>
    </el-collapse>
    <div class="button-class">
      <span class="button" @click="addSetting">确认</span>
    </div>
  </div>
</template>

<script>
import { postDoorListId, postSettingadd, postMonthly, postMonthlyOut, postNonMonthly, postNonMonthlyOut } from '@/api/hardware'
import { Message } from 'element-ui'
// data数据
export default {
  components: {},
  data () {
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
      chineseNum: ['一', '二', '三', '四', '五', '六'],
      validataformName: false,
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
      validataLed1: false,
      validataLed2: false,
      validataLed3: false,
      validataLed4: false,
      validataLed5: false,
      validataLed6: false,
      soundToast: '',//扬声器
      myselfToast: '',//自定义提示语
      HightestToast: '',//单次停车是否有最高收费限制提示语
      mengangToast: '',//门岗提示语
      disableShow: false,
      centerDialogVisible1: false, // 新增门岗
      isShowCard2: true,
      setModifyVisble: true,//判断是否为设置参数还是修改参数
      selectShow: true,//当显示屏的下拉框变成输入框时对应的下拉框是否消失
      activeNames: ['1', '2', '3', '4'], // 展开列
      labelPosition: 'top',
      radio: 3, // 开闸管理
      formLabelAlign: {
        name: '',//负责人
        basis_number: null,//车位总数
        // 开闸管理
        car_number: 2,//是否匹配车牌地域名称（例：京、川）:
        car_rent: 1,//入口处，非长租车辆是否开闸:
        car_export: 2,//出口是否无条件开闸:
        car_endtime: 60,//同一道口，重复识别车牌间隔时间（秒）:
        car_double: 2,//一位多车情况下，当车位已有停放车辆时，所属车位下其他车辆入场是否允许抬杆放行
        car_yellow: 0,//黄牌车指定通道
        car_police: 1,//军警车是否自动开闸
        car_wuye: 2,//是否检测有无物业欠费情况
        car_wuye_release: 2,//物业费欠费时是否不放行
        end_time: null,
        car_app: 1,//使用APP或公众号申请绑定车辆时，是否需要后台操作人员审核
        car_centons: '',//自定义提示语
        //收费设置
        car_time: 15,//免费停车时间（分钟）
        car_price_time: null,//基本收费时长（小时）
        car_price: null,//基本收费费用（元）
        time_out: null,//超时后收费计时单位（小时）
        time_out_price: null,//超时后收费单价（元）
        max_price: null,//单日收费最高限制（元）
        cycle: 1,//单日结算周期
        single_max: 2,//单次停车是否有最高收费限制
        single_max_price: null,//请输入最高收费金额
        car_double_price: 1,//一位多车情况下，当车位已有停放车辆时，所属车位下其他车辆入场是否持续计费
        car_double_price_2: 2,//一位多车情况下，当车位所剩车辆和车位数量相符时是否停止收费
        car_rent_price: 0,//长租车欠费缓冲时长（天）
        car_rent_price_2: 2,//长租车出场时若租期已满，是否从过期时间计算费用
        //显示屏
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
        state: 2,
        pid: 0,
        parkid: null
      },
      car_yellow1: 0,//黄牌车指定通道
      formContent: {
        myself_msg: '',//自定义提示语
      },
      options_ChoiceDoor: [],//门岗类型
      ChoiceDoor_value: '',//选择门岗的值//TODOS是否填在formLabelAlign
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
      userInfoList: {},//localStorage的userInfo
      rules: {
        name: [
          { required: true, message: '请输入停车场负责人', trigger: 'blur' }
        ],
        basis_number: [
          {
            required: true,
            message: '请输入车位总数',
            trigger: 'blur'
          }
        ],
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
        // 收费设置
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
        car_rent_price: [
          {
            required: true,
            message: '请输入长租车欠费缓冲时长',
            trigger: 'blur'
          }
        ],
        car_rent_day: [
          {
            required: true,
            message: '请输入大于0的长租车提前提示车位到期时间',
            trigger: 'blur'
          }
        ],
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
    // 车位总数
    'formLabelAlign.basis_number': {
      handler (n, o) {
        n = String(n)
        if (Number(n) == n) {
          if (n.includes('.')) {
            this.formLabelAlign.basis_number = n.slice(0, n.indexOf('.'))
          }
          if (n.slice(0, 1) === '0') {
            this.formLabelAlign.basis_number = n.slice(1)
          }
        } else {
          this.formLabelAlign.basis_number = o
        }
      },

    },
    // 同一道口，重复识别车牌间隔时间（秒）
    'formLabelAlign.car_endtime': {
      handler (n, o) {
        n = String(n)
        if (Number(n) == n) {
          if (n.includes('.')) {
            this.formLabelAlign.car_endtime = n.slice(0, n.indexOf('.'))
          }
          if (n.slice(0, 1) === '0') {
            this.formLabelAlign.car_endtime = n.slice(1)
          }
        } else {
          this.formLabelAlign.car_endtime = o
        }
      },

    },
    // 支付后多少分钟内需要离场（分钟）(不能只输入0并且只能为整数)
    'formLabelAlign.end_time': {
      handler (n, o) {
        n = String(n)
        if (Number(n) == n) {
          if (n.includes('.')) {
            this.formLabelAlign.end_time = n.slice(0, n.indexOf('.'))
          }
          if (n.slice(0, 1) === '0') {
            this.formLabelAlign.end_time = n.slice(1)
          }
        } else {
          this.formLabelAlign.end_time = o
        }
      },

    },
    // 免费停车时间（分钟）(不能只输入0并且只能为整数)
    'formLabelAlign.car_time': {
      handler (n, o) {
        n = String(n)
        if (Number(n) == n) {
          if (n.includes('.')) {
            this.formLabelAlign.car_time = n.slice(0, n.indexOf('.'))
          }
          if (n.slice(0, 1) === '0') {
            this.formLabelAlign.car_time = n.slice(1)
          }
        } else {
          this.formLabelAlign.car_time = o
        }
      },

    },
    // 基本收费时长（小时）(不能只输入0并且只能为整数)
    'formLabelAlign.car_price_time': {
      handler (n, o) {
        n = String(n)
        if (Number(n) == n) {
          if (n.includes('.')) {
            this.formLabelAlign.car_price_time = n.slice(0, n.indexOf('.'))
          }
          if (n.slice(0, 1) === '0') {
            this.formLabelAlign.car_price_time = n.slice(1)
          }
        } else {
          this.formLabelAlign.car_price_time = o
        }
      },

    },
    // 基本收费费用（元）:(不能只输入0并且只能为两位小数)
    'formLabelAlign.car_price': {
      handler (n, o) {
        n = String(n)
        if (Number(n) == n) {
          if (n.includes('.')) {
            this.formLabelAlign.car_price = n.slice(0, n.indexOf('.') + 3)
          }
          if (n.slice(0, 2) === '00') {
            this.formLabelAlign.car_price = 0
          }
        } else {
          this.formLabelAlign.car_price = o
        }
      },

    },
    //超时后收费计时单位（小时）:(不能只输入0并且只能为整数)
    'formLabelAlign.time_out': {
      handler (n, o) {
        n = String(n)
        if (Number(n) == n) {
          if (n.includes('.')) {
            this.formLabelAlign.time_out = n.slice(0, n.indexOf('.'))
          }
          if (n.slice(0, 1) === '0') {
            this.formLabelAlign.time_out = n.slice(1)
          }
        } else {
          this.formLabelAlign.time_out = o
        }
      },

    },
    // 超时后收费单价（元）:(不能只输入0并且只能为两位小数)
    'formLabelAlign.time_out_price': {
      handler (n, o) {
        n = String(n)
        if (Number(n) == n) {
          if (n.includes('.')) {
            this.formLabelAlign.time_out_price = n.slice(0, n.indexOf('.') + 3)
          }
          if (n.slice(0, 2) === '00') {
            this.formLabelAlign.time_out_price = 0
          }
        } else {
          this.formLabelAlign.time_out_price = o
        }
      },

    },
    // 单日收费最高限制（元）:(不能只输入0并且只能为两位小数)
    'formLabelAlign.max_price': {
      handler (n, o) {
        n = String(n)
        if (Number(n) == n) {
          if (n.includes('.')) {
            this.formLabelAlign.max_price = n.slice(0, n.indexOf('.') + 3)
          }
          if (n.slice(0, 2) === '00') {
            this.formLabelAlign.max_price = 0
          }
        } else {
          this.formLabelAlign.max_price = o
        }
      },

    },
    // 最高收费金额(不能只输入0并且只能为两位小数)
    'formLabelAlign.single_max_price': {
      handler (n, o) {
        n = String(n)
        if (Number(n) == n) {
          if (n.includes('.')) {
            this.formLabelAlign.single_max_price = n.slice(0, n.indexOf('.') + 3)
          }
          if (n.slice(0, 2) === '00') {
            this.formLabelAlign.single_max_price = 0
          }
        } else {
          this.formLabelAlign.single_max_price = o
        }
      },

    },
    // 长租车提前提示车位到期时间（天）(不能只输入0并且只能整数)
    'formLabelAlign.car_rent_day': {
      handler (n, o) {
        n = String(n)
        if (Number(n) == n) {
          if (n.includes('.')) {
            this.formLabelAlign.car_rent_day = n.slice(0, n.indexOf('.'))
          }
          if (n.slice(0, 1) === '0') {
            this.formLabelAlign.car_rent_day = n.slice(1)
          }
        } else {
          this.formLabelAlign.car_rent_day = o
        }
      },

    },
    //车辆通过时，显示屏重复显示信息的时间(不能只输入0并且只能整数)
    'formLabelAlign.time': {
      handler (n, o) {
        n = String(n)
        if (Number(n) == n) {
          if (n.includes('.')) {
            this.formLabelAlign.time = n.slice(0, n.indexOf('.'))
          }
          if (n.slice(0, 1) === '0') {
            this.formLabelAlign.time = n.slice(1)
          }
        } else {
          this.formLabelAlign.time = o
        }
      },

    },
    //长租车欠费缓冲时长（天）(不能只输入0并且只能整数)
    'formLabelAlign.car_rent_price': {
      handler (n, o) {
        n = String(n)
        if (Number(n) == n) {
          if (n.includes('.')) {
            this.formLabelAlign.car_rent_price = n.slice(0, n.indexOf('.'))
          }
        } else {
          this.formLabelAlign.car_rent_price = o
        }
      },

    },
  },
  created () {
    this.userInfoList = JSON.parse(localStorage.getItem('userInfo'))
    this.parkid = this.userInfoList.Communityid
    // 请求门岗列表
    postDoorListId({ parkid: this.parkid }).then(resp => {
      this.options_ChoiceDoor = resp.data
    })
    //led下拉提示语
    postMonthly({}).then(resp => {
      // console.log(resp, '列表')
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
  mounted () {

  },
  methods: {
    //子组件像父组件传值
    isExit () {
      this.$emit('isShowCardFunc1', this.isShowCard2)
    },
    handleChange (val) {
      // console.log(val)
    },
    hanPoid_DoorType (id) {
      this.mengangToast = ''
      this.formLabelAlign.car_yellow = id
    },
    //门岗改变
    mengangChange () {
      this.mengangToast = ''
      this.ChoiceDoor_value = ''
    },
    //自定义提示语的选择改变
    centonsCahnge () {
      this.formLabelAlign.car_centons = ''
      this.myselfToast = ''
    },
    myselfBlur () {
      if (this.formLabelAlign.car_centons === '') {
        this.myselfToast = '请输入自定义提示语'
      } else {
        this.myselfToast = ''
      }
    },
    //最高收费金额失去焦点
    hightBlur () {
      if (!this.formLabelAlign.single_max_price) {
        this.HightestToast = '请输入最高收费金额'
      } else if (this.formLabelAlign.single_max_price === '0' || this.formLabelAlign.single_max_price === '0.') {
        this.HightestToast = '请输入大于零的最高收费金额'
      }
      else {
        this.HightestToast = ''
      }
    },
    validata1 () {
      if (this.formLabelAlign.single_max === 1) {
        this.HightestToast = ''
        this.formLabelAlign.single_max_price = ''
      }
    },
    //显示屏事件
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
    addSetting () {
      this.formLabelAlign.car_rent_admission = this.car_rent_admission1.join(',')
      this.formLabelAlign.car_stop_admission = this.car_stop_admission1.join(',')
      this.formLabelAlign.car_no_admission = this.car_no_admission1.join(',')
      this.formLabelAlign.car_rent_appearance = this.car_rent_appearance1.join(',')
      this.formLabelAlign.car_stop_appearance = this.car_stop_appearance1.join(',')
      this.formLabelAlign.car_no_appearance = this.car_no_appearance1.join(',')
      this.formLabelAlign.car_price = this.formLabelAlign.car_price
      this.formLabelAlign.car_price_time = this.formLabelAlign.car_price_time
      this.formLabelAlign.car_rent_day = this.formLabelAlign.car_rent_day
      this.formLabelAlign.car_rent_price = this.formLabelAlign.car_rent_price
      this.formLabelAlign.max_price = this.formLabelAlign.max_price
      this.formLabelAlign.end_time = this.formLabelAlign.end_time
      this.formLabelAlign.time = this.formLabelAlign.time
      this.formLabelAlign.time_out = this.formLabelAlign.time_out
      this.formLabelAlign.car_time = this.formLabelAlign.car_time
      this.formLabelAlign.parkid = this.parkid
      // 基础设置左边部分判断
      // alert('验证')
      this.$refs.ruleFormBasisLeft.validate((valid) => {
        if (valid) {
          // alert('submit!');
          this.validataformName = true
        } else {
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
      // 开闸管理右边判断验证自定义提示语
      if (this.formLabelAlign.car_wuye_release === 1) {
        // 物业费欠费时是否不放行，如果为是，则验证自定义提示语
        if (this.formLabelAlign.car_centons === '') {
          this.myselfToast = '请输入自定义提示语'
          this.validataformName4 = false
        } else {
          this.myselfToast = ''
          this.validataformName4 = true
        }
      } else {
        this.validataformName4 = true
      }
      // 开闸管理右边判断验证黄牌车指定通道是否选择门岗
      if (this.car_yellow1 === 1) {
        //黄牌车指定通道，如果为是，则验证是否选择门岗
        if (this.ChoiceDoor_value) {
          this.mengangToast = ''
          this.validataformName8 = true
        } else {
          this.validataformName8 = false
          this.mengangToast = '请选择门岗'
        }
      } else {
        this.validataformName8 = true
      }
      // 收费设置左边判断
      this.$refs.ruleFormShoufeiLeft.validate((valid) => {
        if (valid) {
          this.validataformName5 = true
        } else {
          this.validataformName5 = false
        }
      })
      //收费设置右边判断
      //长租车欠费缓冲时长的验证
      this.$refs.ruleFormShoufeiRigh.validate((valid) => {
        if (valid) {
          this.validataformName6 = true
        } else {
          this.validataformName6 = false
        }
      })
      // 单次停车是否有最高收费限制，如果为是，则验证最高收费金额
      if (this.formLabelAlign.single_max === 1) {
        if (!this.formLabelAlign.single_max_price) {
          // alert('kkk')
          this.validataformName7 = false
          this.HightestToast = '请输入最高收费金额'
        } else if (this.formLabelAlign.single_max_price === 0 || this.formLabelAlign.single_max_price === '0.' || this.formLabelAlign.single_max_price === '0.0' || this.formLabelAlign.single_max_price === '0.00') {
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
      //led左边
      this.$refs.ruleFormLedLeft.validate((valid) => {
        if (valid) {
          this.validataformName9 = true
        } else {
          this.validataformName9 = false
        }
      })
      //扬声器判断
      if (this.formLabelAlign.sound < 1) {
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
      if (this.formLabelAlign.led_number) {
        const len = this.formLabelAlign.led_number
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
          this.validataLed1 = true
          this.formLabelAlign.car_rent_admission = newArr2Car_rent_admission1.join(',')
          if (item === "") {
            this.validataLed1 = false
            this.$refs[`car_rent_admission1${i}`][0].innerHTML = '长租车,入场时显示屏显示的信息不能为空'
          } else {
            this.$refs[`car_rent_admission1${i}`][0].innerHTML = ''
          }
        })
        //临停车,入场时显示屏显示的信息
        newArr2Car_stop_admission1.forEach((item, i) => {
          this.validataLed2 = true
          this.formLabelAlign.car_stop_admission = newArr2Car_stop_admission1.join(',')
          if (item === "") {
            this.validataLed2 = false
            this.$refs[`car_stop_admission1${i}`][0].innerHTML = '临停车,入场时显示屏显示的信息不能为空'
          } else {
            this.$refs[`car_stop_admission1${i}`][0].innerHTML = ''
          }
        })
        //无车时,入口显示屏显示的内容信息:
        newArr2Car_no_admission1.forEach((item, i) => {
          this.validataLed3 = true
          this.formLabelAlign.car_no_admission = newArr2Car_no_admission1.join(',')
          if (item === "") {
            this.validataLed3 = false
            this.$refs[`car_no_admission1${i}`][0].innerHTML = '无车时,入口显示屏显示的内容信息不能为空'
          } else {
            this.$refs[`car_no_admission1${i}`][0].innerHTML = ''
          }
        })
        // 长租车,出场时显示屏显示的信息:
        newArr2Car_rent_appearance1.forEach((item, i) => {
          this.validataLed4 = true
          this.formLabelAlign.car_rent_appearance = newArr2Car_rent_appearance1.join(',')
          if (item === "") {
            this.validataLed4 = false
            this.$refs[`car_rent_appearance1${i}`][0].innerHTML = '长租车,出场时显示屏显示的信息不能为空'
          } else {
            this.$refs[`car_rent_appearance1${i}`][0].innerHTML = ''
          }
        })
        // 临停车,出场时显示屏显示的信息:
        newArr2Car_stop_appearance1.forEach((item, i) => {
          this.validataLed5 = true
          this.formLabelAlign.car_stop_appearance = newArr2Car_stop_appearance1.join(',')
          if (item === "") {
            this.validataLed5 = false
            this.$refs[`car_stop_appearance1${i}`][0].innerHTML = '临停车,出场时显示屏显示的信息不能为空'
          } else {
            this.$refs[`car_stop_appearance1${i}`][0].innerHTML = ''
          }
        })
        // 无车时,出口显示屏显示的内容信息
        newArr2Car_no_appearance1.forEach((item, i) => {
          this.validataLed6 = true
          this.formLabelAlign.car_no_appearance = newArr2Car_no_appearance1.join(',')
          if (item === "") {
            this.validataLed6 = false
            this.$refs[`car_no_appearance1${i}`][0].innerHTML = '无车时,出口显示屏显示的内容信息不能为空'
          } else {
            this.$refs[`car_no_appearance1${i}`][0].innerHTML = ''
          }
        })
      }
      console.log({
        'validataformName': this.validataformName,
        'validataformName1': this.validataformName1,
        'validataformName3': this.validataformName3,
        'validataformName4': this.validataformName4,
        'validataformName5': this.validataformName5,
        'validataformName6': this.validataformName6,
        'validataformName7': this.validataformName7,
        'validataformName8': this.validataformName8,
        'validataformName9': this.validataformName9,
        'validataformName10': this.validataformName10,
        'validataformName11': this.validataformName11,
        'validataLed1': this.validataLed1,
        'validataLed2': this.validataLed2,
        'validataLed3': this.validataLed3,
        'validataLed4': this.validataLed4,
        'validataLed5': this.validataLed5,
        'validataLed6': this.validataLed6,
      }
      )
      if (this.validataformName && this.validataformName1 && this.validataformName3 && this.validataformName4 && this.validataformName5
        && this.validataformName6 && this.validataformName7 && this.validataformName8 && this.validataformName9 && this.validataformName10 && this.validataformName11 &&
        this.validataLed1 && this.validataLed2 && this.validataLed3 && this.validataLed4 && this.validataLed5 && this.validataLed6
      ) {
        //所有验证成功，访问接口
        postSettingadd(this.formLabelAlign).then(resp => {
          // console.log(resp, 'postSettingadd')
          this.$message({
            message: resp.data,
            type: 'success'
          })
          if (resp.data === '参数添加成功') {
            this.disableShow = true
            this.isExit()
          }
          // localStorage.setItem('setParamState', 1)
        })
      }
      // console.log(this.formLabelAlign, 'formLabelAlignformLabelAlignformLabelAlign')

    }
  }
}
</script>
<style lang="scss" scoped>
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
  min-height: 775px;
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
      line-height: 30px;
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

/deep/ .el-dialog {
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
    padding: 20px 50px 6px 48px !important;
    .form-item {
      height: 60px;
      .zhiwei {
        margin-bottom: 0px;
        .el-form-item__label {
          display: inline-block;
          font-size: 14px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          padding: 0 !important;
          white-space: nowrap;
          color: rgba(102, 102, 102, 1);
          text-align: right !important;
        }
        .el-form-item__content {
          input {
            width: 87% !important;
            border: 1px solid rgba(210, 210, 210, 1);
            border-radius: 3px;
            outline: none;
            color: #333333;
            padding-left: 8px;
          }
        }
      }
      .el-form-item {
        margin-bottom: 0px;
        margin-top: 1px;
        text-align: center;
        &__label {
          height: 30px;
          display: inline-block;
          font-size: 14px;
          padding: 0 !important;
          font-family: Microsoft YaHei;
          font-weight: 400;
          color: rgba(102, 102, 102, 1);
        }
        &__content {
          input {
            position: relative;
            height: 30px;
            width: 87% !important;
            border: 1px solid rgba(210, 210, 210, 1);
            border-radius: 3px;
            outline: none;
            color: #333333;
            padding-left: 8px;
          }
        }
      }

      .mistack-message {
        position: relative;
        top: -13px;
        text-align: left;
        margin-left: 5px;
        box-sizing: border-box;
        font-size: 14px;
        transform: scale(0.9);
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: rgba(255, 0, 0, 1);
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

.chen {
  /deep/.el-dialog {
    background-color: #fff !important;
    width: 18.23%;
    height: 210px;
    /deep/.el-dialog__header {
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
  left: 6px;
  top: 2px;
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

#newadd {
  display: inline-block;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  width: 85px;
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
/deep/.el-pagination__editor {
  background-color: #5fafe4 !important;
  height: 20px;
  width: 30px;
  color: white;
  cursor: pointer;
}
.hard-setparamClass {
  height: 100%;
  min-width: 1000px;
}
.setparam-container {
  // height: 2000px;
  // background-color: green;
  position: relative;
  width: 100%;
  .card-main {
    //   background-color: #f00;
    margin: 20px;
  }
  .sum-class {
    display: flex;
    // height: ;
    margin: 0px 20px;
    .left-class {
      margin-right: 100px;
      margin-left: 78px;
      box-sizing: border-box;
    }
    // .right-class {
    //   margin-right: ;
    // }
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
  line-height: 25px;
}
.button-class {
  position: absolute;
  height: 30px;
  bottom: -150px;
  width: 100%;
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
    cursor: pointer;
    color: rgba(255, 254, 254, 1);
  }
}
/deep/.el-table .cell {
  height: 30px !important;
}
.ledtoast-class {
  height: 15px;
  line-height: 10px;
  font-size: 14px;
  color: #ff0000;
}
/deep/.selectClass {
  margin-bottom: 6px;
  /deep/.el-input__inner {
    width: 350px !important;
  }
}
/deep/.el-form-item.is-required:not(.is-no-asterisk)
  > .el-form-item__label:before {
  display: none !important;
}
/deep/ .el-collapse-item__header {
  padding: 20px;
  padding-left: 40px;
  font-size: 14px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: rgba(51, 51, 51, 1);
}
/deep/.el-form-item__error {
  color: #f56c6c;
  font-size: 14px;
  line-height: 1;
  padding-top: 5px;
  position: absolute;
  top: 100%;
  left: 0;
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
  /deep/ .el-input__icon {
    line-height: 32px !important;
  }
}
.qianfei-calss {
  // background-color: #f00;
  margin-bottom: 10px;
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
  margin-bottom: 6px;
}
.hang-class {
  margin-right: 10px;
  font-size: 14px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: rgba(102, 102, 102, 1);
}
.plabel-class {
  font-size: 14px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: rgba(102, 102, 102, 1);
}
.oten-class {
  font-size: 14px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: rgba(102, 102, 102, 1);
  margin-bottom: 8px;
      margin-top: -8px;
}
/deep/ .el-input__icon {
  line-height: 30px !important;
}
</style>
