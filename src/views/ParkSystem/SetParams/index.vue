<template>
  <div>
    <div>设置参数页面</div>
    <button @click="exitHandler()">点击退出</button>
  </div>
</template>

<script>
import { removeToken } from '@/utils/auth'
// import { mapActions } from 'vuex'
export default {
  name: 'SetParams',
  data() {
    return {

    }
  },
  computed: {},
  watch: {

  },
  created() {
    // window.history.forward(-1)
  },
  mounted() {

  },
  methods: {
    // ...mapActions(['logout']),
    // stopExit() {
    //   if (window.history && window.history.pushState) {
    //     $(window).on('popstate', function() {
    //       window.history.forward(1)
    //     })
    //   }
    // }
    // 退出登录
    exitHandler() {
      // console.log('退出登录')
      // console.log(JSON.parse(localStorage.getItem('userInfo')))
      // const userInfoData = JSON.parse(localStorage.getItem('userInfo'))
      // // console.log(userInfoData)
      // this.logout(userInfoData).then(() => {
      //   console.log('退出退出')
      // })
      const Jurisd = JSON.parse(localStorage.getItem('userInfo')).Jurisdiction
      if (Jurisd === 3) {
        removeToken()
        localStorage.removeItem('userInfo')
        localStorage.clear()
        this.$router.push('/login')
      } else {
        // TODO:退出时清空小区id
        console.log('0000000000..........00000000000')
        this.$router.push('/community')
      }
    }
  }
}
</script>
<style lang='scss' scoped>
//@import url(); 引入公共css类
</style>
