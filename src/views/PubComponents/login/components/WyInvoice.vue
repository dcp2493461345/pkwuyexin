<template>
  <!-- eslint-disable -->

  <!-- 开票组件-->
  <div class="wy-invoice-container">
    <div class="wy-invoice-container_title" style="cursor:default;">请提供开票信息</div>
    <div class="wy-form">
      <div v-for="(list,index) in lists" :key="index" class="form-item">
        <label for="male">{{ list.name }}</label>
        <input v-model="list.value" type="text" />
        <span :ref="`list${index}`" class="tips"></span>
        <br />
      </div>
      <div class="wy-invoice-container_btn" @click="invoiceHandler()">确认</div>
    </div>
  </div>
</template>

<script>
import { postSelect_invoice, postInvoice_add } from '@/api/pay'
import { Message } from 'element-ui'
export default {
  name: 'WyInvoice',
  data () {
    return {
      labelPosition: 'right',
      lists: [
        { value: '', name: '公司名称 :', id: 1 },
        { value: '', name: '公司税号 :', id: 2 },
        { value: '', name: '地  址 :', id: 3 },
        { value: '', name: '开户银行 :', id: 4 },
        { value: '', name: '帐  号 :', id: 5 },
        { value: '', name: '收票地址 :', id: 6 },
        { value: '', name: '收 票 人 :', id: 7 },
        { value: '', name: '联系电话 :', id: 8 }
      ],
      userInfo: {},
    }
  },
  created () {
    this.getInvoiceData()
  },
  methods: {
    getInvoiceData () {
      this.userInfo = JSON.parse(localStorage.getItem('userInfo'))
      const Communityid = this.userInfo.Communityid
      postSelect_invoice({ Communityid }).then(resp => {
        // console.log(resp, 'dd')
        if (resp.code === 200) {
          this.lists[0].value = resp.msg.company_name
          this.lists[1].value = resp.msg.company_paragraph
          this.lists[2].value = resp.msg.company_address
          this.lists[3].value = resp.msg.company_Bank
          this.lists[4].value = resp.msg.company_user
          this.lists[5].value = resp.msg.Invoice_Address
          this.lists[6].value = resp.msg.Invoice_user
          this.lists[7].value = resp.msg.Invoice_phone
        }
      })
    },
    invoiceHandler () {
      // console.log('开票')
      localStorage.setItem('isRefresh', true)
      const order = localStorage.getItem('out_trade_no')
      const user = this.userInfo.uname
      const Communityid = this.userInfo.Communityid
      const data2 = {
        Communityid,
        user,
        order,
        company_name: this.lists[0].value,
        company_paragraph: this.lists[1].value,
        company_address: this.lists[2].value,
        company_Bank: this.lists[3].value,
        company_user: this.lists[4].value,
        Invoice_Address: this.lists[5].value,
        Invoice_user: this.lists[6].value,
        Invoice_phone: this.lists[7].value
      }
      console.log(data2)
      postInvoice_add(data2).then(resp => {
        console.log(resp, '开票')
        if (resp.code === 401) {
          this.$refs[`list${0}`][0].innerHTML = resp.msg
          this.$refs[`list${0}`][0].style.color = 'red'
          setTimeout(() => {
            this.$refs[`list${0}`][0].innerHTML = ''
            this.$refs[`list${0}`][0].style.color = '#fff'
          }, 2000)
        } else if (resp.code === 402) {
          this.$refs[`list${1}`][0].innerHTML = resp.msg
          this.$refs[`list${1}`][0].style.color = 'red'
          setTimeout(() => {
            this.$refs[`list${1}`][0].innerHTML = ''
            this.$refs[`list${1}`][0].style.color = '#fff'
          }, 2000)
        } else if (resp.code === 403) {
          this.$refs[`list${2}`][0].innerHTML = resp.msg
          this.$refs[`list${2}`][0].style.color = 'red'
          setTimeout(() => {
            this.$refs[`list${2}`][0].innerHTML = ''
            this.$refs[`list${2}`][0].style.color = '#fff'
          }, 2000)
        } else if (resp.code === 404) {
          this.$refs[`list${3}`][0].innerHTML = resp.msg
          this.$refs[`list${3}`][0].style.color = 'red'
          setTimeout(() => {
            this.$refs[`list${3}`][0].innerHTML = ''
            this.$refs[`list${3}`][0].style.color = '#fff'
          }, 2000)
        } else if (resp.code === 405) {
          this.$refs[`list${4}`][0].innerHTML = resp.msg
          this.$refs[`list${4}`][0].style.color = 'red'
          setTimeout(() => {
            this.$refs[`list${4}`][0].innerHTML = ''
            this.$refs[`list${4}`][0].style.color = '#fff'
          }, 2000)
        } else if (resp.code === 406) {
          this.$refs[`list${5}`][0].innerHTML = resp.msg
          this.$refs[`list${5}`][0].style.color = 'red'
          setTimeout(() => {
            this.$refs[`list${5}`][0].innerHTML = ''
            this.$refs[`list${5}`][0].style.color = '#fff'
          }, 2000)
        } else if (resp.code === 407) {
          this.$refs[`list${6}`][0].innerHTML = resp.msg
          this.$refs[`list${6}`][0].style.color = 'red'
          setTimeout(() => {
            this.$refs[`list${6}`][0].innerHTML = ''
            this.$refs[`list${6}`][0].style.color = '#fff'
          }, 2000)
        } else if (resp.code === 408) {
          this.$refs[`list${7}`][0].innerHTML = resp.msg
          this.$refs[`list${7}`][0].style.color = 'red'
          setTimeout(() => {
            this.$refs[`list${7}`][0].innerHTML = ''
            this.$refs[`list${7}`][0].style.color = '#fff'
          }, 2000)
        } else if (resp.code === 400) {
          this.$message({
            message: resp.msg,
            type: 'warning'
          })
        } else if (resp.code === 200) {
          this.$message({
            message: resp.msg,
            type: 'success'
          })
          this.$router.push('/login/community')
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.wy-invoice-container {
  background-color: #fff;
  margin-top: 0% !important;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  -webkit-transform: translate(-50%, -50%);
  -moz-transform: translate(-50%, -50%);
  border-radius: 10px;
  padding: 24px 20px 20px 20px;
  width: 460px;
  height: 540px;
  &_title {
    font-size: 20px;
    font-family: Microsoft YaHei;
    font-weight: bold;
    color: rgba(51, 51, 51, 1);
    margin-bottom: 30px;
    text-align: center;
  }
  .wy-form {
    font-size: 14px;
    padding: 0 20px;
    width: 475px;
    height: 474px;
    font-family: Microsoft YaHei;
    font-weight: bold;
    color: rgba(102, 102, 102, 1);
    label {
      width: 80px;
      display: inline-block;
      padding-right: 12px;
      text-align: left;
    }
    input {
      width: 300px;
      margin-bottom: 32px;
      outline: none;
      border: none;
      padding-left: 6px;
      font-size: 14px;
      margin-right: 15px;
      border-bottom: 1px solid #999;
      // text-align: center;
    }
    .wy-invoice-container_btn {
      border: 1px solid;
      width: 72px;
      height: 30px;
      line-height: 28px;
      margin-top: 10px;
      text-align: center;
      margin: 0 153px;
      background: rgba(248, 172, 89, 1);
      border-radius: 4px;
      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: rgba(255, 255, 255, 1);
      cursor: pointer;
    }
  }
}
</style>

<style lang="scss" scoped>
.choice-main {
  width: 50%;
  height: 50%;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  margin: auto;
  overflow: hidden;
  // padding: 4.7vh 1.7vw 4vh 1.7vw;
  // background-color: #fff;
  background: rgb(247, 169, 169);
  border-radius: 11px;
  .el-col {
    margin-top: 30px;
    // cursor: pointer;
  }
}
.form-item {
  // background-color: #ccc;
  position: relative;
}
.tips {
  position: absolute;
  top: 24px;
  left: 80px;
  font-family: Microsoft YaHei;
  font-weight: normal;
}
</style>
