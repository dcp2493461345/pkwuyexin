<template>
  <div>
    <div
      style="padding:20px;background:#f3f3f3;width:100%;height:97.7%;position:absolute;"
      v-if="showMain"
    >
      <div class="wy-homepage" v-if="showMain">
        <p
          v-if="showMain"
          v-show="ask.faceJudge"
          style="padding-bottom:18px;color:#333;font-size:22px;font-weight:500"
        >待办事项</p>
        <MyCard v-show="ask.faceJudge" v-if="showMain" :count="count" />
      </div>
    </div>
    <div style="padding:20px;">
      <Form v-if="!showMain" :present="present" />
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import MyCard from '@/components/MyCard'
import Form from './Form'
import { postSelect_count, postSelect_faceList } from '@/api/dash'
import { postSelect_button } from '@/api/Jurisdiction'
export default {
  components: {
    MyCard,
    Form,
  },
  data () {
    return {
      ask: {
        faceJudge: "",
        houseDetail: '',
        judge: '',
        delete: '',
        add: '',
        import: '',
        modify: '',
        houseInfo: '',
        carInfo: '',
        record: '',
        download: ''
      },
      userInfo: { // 用户信息
      },
      count: 0,
      showMain: true,
      present: true //住户认证
    }
  },
  created () {
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'))
    const { Communityid, uid } = this.userInfo
    const auth_id = this.$route.meta.auth_id
    postSelect_button({ Communityid, uid, auth_id }).then(resp => {
      if (resp.code === 200) {
        this.buttonLists = resp.data
        var btnList = this.buttonLists
      }
      btnList.forEach(item => {
        if (item.auth_name === '人脸审核') {
          this.ask.faceJudge = true
        }
      })
    })
  },
  methods: {
    askRequest () {
      console.log(this.userInfo)
      const { uid, Communityid, Jurisdiction, token } = this.userInfo
    },
    change () {
      this.present = !this.present // 住户认证 人脸认证
      this.show = false
      setTimeout(() => {
        this.show = true
      }, 0)
    },
  }
}
</script>

<style lang="scss" scoped>
.wy-homepage {
  height: 100%;
}
.card-container {
  border-radius: 5px;
}
</style>