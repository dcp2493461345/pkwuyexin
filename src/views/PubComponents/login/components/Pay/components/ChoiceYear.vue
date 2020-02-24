<template>
  <div class="wy-choice-container">
    <!-- 返回 -->
    <div class="wy-choice-container-wrap">
      <div class="wy-choice-container-wrap_btn" @click="handleClickQueren()">确认</div>
    </div>
    <span class="fanhui" @click="hadlerFanhui">
      <svg-icon icon-class="fanhui" />
    </span>
    <!-- 卡片 -->
    <div class="wy-choice-container_row">
      <!-- 卡片last -->
      <div
        v-for="(item,index) in getYearLists1"
        :key="item.year_id"
        class="btn1"
        :class="actived===index ? 'bt2':'bt1'"
        @click="handleClickYaerCard(item,index)"
      >
        <p class="zhai-class">{{Setmeal_name }}</p>
        <p class="year">{{ item.number }}年</p>
        <div class="price" style="height:30%;">
          <p class="new-price">
            <span style="font-size: 14px;width:10px;display:inline-block;">￥</span>
            {{ item.year_Prices }}
          </p>
          <del class="old-price" v-show="item.year_Price || item.year_Price === '0'">
            <span v-show="item.year_Price || item.year_Price === '0'" style="font-size: 14px;">￥</span>
            {{ item.year_Price }}
          </del>
        </div>
      </div>
    </div>
    <!-- 蒙层 -->
    <!-- 请支付页面 -->
    <div v-if="openZhifu">
      <el-dialog
        title="请支付"
        :modal-append-to-body="false"
        :visible.sync="openZhifu"
        :before-close="handleClose"
        :close-on-click-modal="false"
      >
        <div class="container-box">
          <div class="pay-way wx-pay pay-way" @click="showQr">
            <div class="img">
              <svg-icon icon-class="weixin" />
            </div>
            <span>微信支付</span>
          </div>
          <div class="pay-way zfb-pay">
            <div class="img">
              <svg-icon icon-class="zhifubao" />
            </div>
            <span>支付宝支付</span>
          </div>
        </div>
      </el-dialog>
    </div>
    <!-- 支付二维码 -->
    <div v-if="openQrcode">
      <el-dialog
        title="请支付"
        :modal-append-to-body="false"
        :visible.sync="openQrcode"
        :close-on-click-modal="false"
        :before-close="handleCloseQr"
        center
      >
        <div class="container-box">
          <div class="pay-way wx-pay pay-way">
            <div class="img">
              <svg-icon icon-class="weixin" />
            </div>
            <span>微信支付</span>
          </div>
          <div class="pay-way zfb-pay qr-code">
            <canvas ref="box" />
          </div>
        </div>
      </el-dialog>
    </div>
    <!-- 支付成功 -->
    <el-dialog
      :visible.sync="show_cg"
      :show-close="false"
      :modal-append-to-body="false"
      center
      :close-on-click-modal="false"
    >
      <div
        style="text-align: center;padding-top: 0px; font-size:55px;margin-bottom:10px;margin-top:20px;"
      >
        <svg-icon icon-class="pay_success" />
      </div>
      <div
        style="text-align: center;font-family:Microsoft YaHei;font-weight:400;color:rgba(51,51,51,1);"
      >支付成功</div>
    </el-dialog>
    <!-- 取消支付 -->
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="show_fail"
      :show-close="false"
      :modal-append-to-body="false"
      center
    >
      <div
        style="text-align: center;padding-top:24px; font-size:55px;margin-bottom:10px;margin-top:0px;"
      >
        <svg-icon icon-class="forgive_pay" />
      </div>
      <div
        style="text-align: center;font-family:Microsoft YaHei;font-weight:400;color:rgba(51,51,51,1);"
      >取消支付</div>
    </el-dialog>
    <!-- 支付成功后是否开票-->
    <div v-if="VisiblesInvoice">
      <el-dialog
        :close-on-click-modal="false"
        :visible.sync="VisiblesInvoice"
        center
        :modal-append-to-body="false"
        :show-close="false"
        custom-class="invoice-class"
      >
        <span slot="title" />
        <div
          style="text-align:center;font-family:MicrosoftYaHei;font-weight:400;color:rgba(51,51,51,1);font-size:16px;margin-top:40px;"
        >是否需要开票？</div>
        <div class="kaipiao-btn1">
          <span class="sb-btn quxiao-btn" @click="quxiaoBtn()">取 消</span>
          <span class="sb-btn quedin-btn" @click="quedinBtn()">确 定</span>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { postSelect_year, postPayment_add, postSetmeals_select, postSetmeals_closeorder } from '@/api/pay'
import { mapMutations, mapActions, mapState } from 'vuex'
import Q from 'qrcode'
import Message from 'element-ui'
export default {
  name: 'ChoiceTc',
  data () {
    return {
      Setmeal_name: '',
      PayWaysVisibel: false,//蒙层组件是否显示
      item1: {},//被选中的列表
      actived: 0,//选中样式
      getYearLists1: [],//列表数据
      userInfo: {},
      openZhifu: false,//选择支付页面显示
      openQrcode: false,//支付二维码页面出现
      show_fail: false,//取消支付
      show_cg: false,//支付成功
      VisiblesInvoice: false,//开票页面
      timer: null,//轮询
    }
  },
  computed: {
    // ...mapState(['Setmeal_id', 'Setmeal_name'])
  },
  watch: {
    show_cg: function (newQuestion, oldQuestion) {
      if (newQuestion) {
        clearInterval(this.timer)
        setTimeout(() => {
          this.VisiblesInvoice = true
          this.show_cg = false
        }, 3000)
      }
    }
  },
  created () {
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'))
    const choiceTcItem = JSON.parse(localStorage.getItem('choiceTcItem'))
    const Setmeal_id = choiceTcItem.Setmeal_id
    this.Setmeal_name = choiceTcItem.Setmeal_name
    const Communityid = this.userInfo.Communityid
    const propertyId = this.userInfo.propertyId
    postSelect_year({ Setmeal_id, Communityid, propertyId }).then(resp => {
      this.getYearLists1 = resp.msg
      this.item1 = this.getYearLists1[0]
    })
  },
  beforeDestroy () {
  },
  methods: {
    // 点击确认
    handleClickQueren () {
      this.openZhifu = true
    },
    // 点击卡片
    handleClickYaerCard (item, index) {
      this.actived = index
      this.item1 = item
    },
    //点击返回
    hadlerFanhui () {
      this.$router.push('/login/pay/ChoiceTc')
    },
    //关闭选择支付方式页面前的回调
    handleClose () {
      this.openZhifu = false
    },
    //点击微信支付
    showQr () {
      this.openZhifu = false
      this.openQrcode = true
      const Communityid = this.userInfo.Communityid
      const year_id = this.item1.year_id
      postPayment_add({ Communityid, year_id }).then(resp => {
        // console.log(resp, 'er')
        localStorage.setItem('out_trade_no', resp.msg.out_trade_no)
        this.useqrcode(resp.msg.code_url)
      })
    },
    // 生成支付二维码
    useqrcode (code_url) {
      // console.log(this.qrCodeUrl)
      this.$nextTick(() => {
        var canvas = this.$refs.box
        Q.toCanvas(canvas, code_url, (error) => {
          if (error) console.error(error)
          this.queryStatus()
        })
      })
    },
    // 查询订单支付状态
    queryStatus () {
      const out_trade_no = localStorage.getItem('out_trade_no')
      // console.log(out_trade_no, '订单号')
      this.timer = setInterval(() => {
        postSetmeals_select({ out_trade_no })
          .then(resp => {
            if (resp.code === 400) {
              Message('支付失败')
            } else if (resp.code === 200) {
              //关闭轮训
              // clearInterval(this.timer)
              this.openQrcode = false
              this.show_cg = true

              // setTimeout(() => {
              // this.show_cg = false
              // this.VisiblesInvoice = true
              // }, 3000)
            }
          })
      }, 1000)
    },
    //支付二维码关闭前的回调
    handleCloseQr () {
      // this.show_fail = true
      const out_trade_no = localStorage.getItem('out_trade_no')
      postSetmeals_closeorder({ out_trade_no }).then(resp => {
        if (resp.code === 200) {
          this.show_fail = true
          this.openZhifu = false
          this.openQrcode = false
          //关闭轮训
          clearInterval(this.timer)
          setTimeout(() => {
            this.show_fail = false
          }, 1000)
        } else {
          Message('关闭失败')
        }
      })
    },
    //取消开票
    quxiaoBtn () {
      this.$router.push('/login/community')
    },
    quedinBtn () {
      this.$router.push('/login/WyInvoice')
    }
  }
}
</script>

<style lang="scss" scoped>
.wy-choice-container {
  /deep/ .v-modal {
     width: 850px;
        height: 568px;
        position: absolute;
        top: 30px;
        right: 0;
        bottom: 0;
        left: -23px;
        margin: auto;
        overflow: hidden;
        background: #000;
        border-radius: 11px;
  }
  //支付遮罩背景//
  .fanhui {
    cursor: pointer;
    font-size: 24px;
  }
  &_row {
    width: 100%;
    height: 100%;
    padding: 22px 25px;
    display: flex;
    justify-content: space-between;
    .bt2 {
      background: rgba(255, 255, 255, 1);
      border: 1px solid rgba(248, 172, 89, 1);
      box-shadow: 0px 6px 5px 0px rgba(248, 172, 89, 0.15);
      border-radius: 0px;

      width: 175px;
      height: 260px;
      position: relative;
      cursor: pointer;
      .year {
        width: 100%;
        height: 45%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 24px;
      }

      .price {
        width: 100%;
        height: 50%;
        text-align: center;
      }
    }
    .btn1 {
      .year {
        width: 100%;
        height: 45%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 26px;
      }
      .zhai-class {
        width: 100%;
        height: 20%;
        color: #666666;
        display: flex;
        padding-top: 60px;
        justify-content: center;
        align-items: center;
        font-size: 20px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: rgba(51, 51, 51, 1);
      }
      .price {
        width: 100%;
        height: 50%;
        text-align: center;
        .new-price {
          width: 100%;
          text-align: center;
          color: red;
          font-size: 22px;
        }
        .old-price {
          width: 100%;
          text-align: center;
          font-size: 16px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          text-decoration: line-through;
          color: rgba(153, 153, 153, 1);
        }
      }
    }
    .bt1 {
      width: 175px;
      height: 260px;
      position: relative;
      cursor: pointer;
      border: 1px solid rgba(243, 243, 243, 1);
      box-shadow: 0px 4px 4px 0px rgba(204, 204, 204, 0.15);
      background: rgba(255, 255, 255, 1);
      .year {
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 26px;
      }

      .price {
        width: 100%;
        height: 50%;
        text-align: center;
      }
    }
  }

  .el-button {
    width: 72px;
    height: 30px;
    border-color: #f8ac59;
    background: rgba(248, 172, 89, 1);
    border-radius: 4px;
    line-height: 0;
    font-size: 14px;
    text-align: center;
    cursor: pointer;
    position: absolute;
    color: #fff;
    bottom: -25px;
    text-align: center;
  }
  .kaipiao-btn {
    width: 100%;
    height: 100%;
    position: relative;
    .sb-btn {
      position: absolute;
      text-align: center;
      bottom: 0px;
      border: 1px solid rgba(204, 204, 204, 1);
      font-size: 10px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: rgba(153, 153, 153, 1);
      cursor: pointer;
    }
    .quxiao-btn {
      left: -14px;
    }
    .quedin-btn {
      right: -14px;
      background: rgba(37, 186, 217, 1);
      color: #fff;
    }
  }
}
.wy-choice-container-wrap {
  position: absolute;
  width: 100%;
  height: 45px;
  top: 370px;
  display: flex;
  justify-content: center;
  &_btn {
    width: 72px;
    height: 32px;
    background: rgba(248, 172, 89, 1);
    border-radius: 4px;
    line-height: 32px;
    text-align: center;
    font-size: 14px;
    color: white;
    cursor: pointer;
    position: absolute;
    bottom: 37px;
  }
}
.container-box {
  display: flex;
  justify-content: space-between;
  margin: 24px 80px 64px 80px;

  .pay-way {
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 14px;
    justify-content: space-between;
    cursor: default;

    .img {
      font-size: 44px;
      margin-bottom: 8px;
      cursor: pointer;
    }
  }
}
</style>
<style lang="scss">
.wy-choice-container {
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
    width: 18.23% !important;
    border-radius: 5px;
    height: 210px !important;
    .el-dialog__header {
      cursor: default;
      padding: 18px 0 14px 0px !important;
      text-align: center;
      text-align: center;
      font-size: 16px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: rgba(51, 51, 51, 1);
      .el-dialog__title {
        cursor: default;
        font-size: 16px;
        text-align: center;
        border-radius: 5px;
      }
      .el-dialog__close {
        margin-right: -1px;
      }
    }
    .el-dialog__body {
      height: 154px;
      // padding: 24px 80px 64px 80px !important;
      /微信支付，支付宝支付/ .kaipiao {
        font-size: 14px;
        text-align: center;
      }
    }
  }

  /deep/ .v-modal {
    width: 850px;
    height: 568px;
    position: absolute;
    top: 30px;
    right: 0;
    bottom: 0;
    left: -33px;
    margin: auto;
    overflow: hidden;
    background: #000;
    border-radius: 11px;
  }
  width: 100%;
  border-radius: 11px;
  position: relative;

  &_row {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-between;
    .card {
      .year {
        width: 100%;
        height: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .price {
        width: 100%;
        height: 50%;
        text-align: center;
      }
    }
  }

  .kaipiao-btn {
    width: 100%;
    height: 100%;
    position: relative;
    .sb-btn {
      position: absolute;
      width: 72px;
      height: 30px;
      line-height: 28px;
      text-align: center;
      bottom: 0px;
      border-radius: 4px;
      border: 1px solid rgba(204, 204, 204, 1);
      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: rgba(153, 153, 153, 1);
      cursor: pointer;
    }
    .quxiao-btn {
      left: -14px;
    }
    .quedin-btn {
      right: -14px;
      background: rgba(37, 186, 217, 1);
      color: #fff;
      border-color: rgba(37, 186, 217, 1);
    }
  }

  .kaipiao-btn1 {
    width: 95%;
    height: 100%;
    position: relative;
    bottom: -43px;
    padding: 0 5px;
    .sb-btn {
      position: absolute;
      width: 72px;
      height: 30px;
      line-height: 28px;
      text-align: center;
      border-radius: 4px;
      bottom: 0px;
      border: 1px solid rgba(204, 204, 204, 1);
      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: rgba(153, 153, 153, 1);
      cursor: pointer;
    }
    .quxiao-btn {
      left: -18px;
    }
    .quedin-btn {
      right: -18px;
      background: rgba(37, 186, 217, 1);
      color: #fff;
      border-color: rgba(37, 186, 217, 1);
    }
  }
}
//支付二维码
//@import url(); 引入公共css类
.el-dialog__body {
  overflow: hidden;
  padding: 0 !important;
  width: 100%;
  height: 65%;
  position: relative;
  .pay-image {
    width: 100%;
    height: 100%;
    display: flex;
    text-align: center;
    margin: 34px 80px;
    justify-content: space-between;
    .weixin {
      background-color: #fff;
      span {
        font-size: 14px;
        transform: scale(0.5);
        cursor: default;
      }
    }
  }
}
/deep/.invoice-weixinpay {
  .el-dialog__body {
    padding: 30px !important;
  }
}
.qr-code {
  width: 10%;
  height: 10%;
  background-color: #fff;
  position: absolute;
  margin-left: 180px;
  img {
    display: inline-block;
    span {
      font-size: 44px !important;
    }
  }
  canvas {
    position: absolute;
    top: 0;
    width: 120px !important;
    height: 120px !important;
    position: absolute;
    top: -14px;
    right: -27px;
  }
  span {
    font-size: 14px;
    transform: scale(0.5);
  }
}
.invoice-class {
  .kaipiao-btn1 {
    width: 100%;
    bottom: 24px;
    .quxiao-btn {
      left: 65px;
      top: 75px;
    }
    .quedin-btn {
      right: 65px;
      top: 75px;
    }
  }
}
</style>

