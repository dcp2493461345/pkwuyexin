<template>
  <div class="navbar">
    <hamburger
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />
    <div class="second">
      <div class="form-btn" style="background-color:#fff;cursor:default;">
        <!-- <input type="text" placeholder=""> -->
        <div class="serach">搜索</div>
      </div>
      <span class="huanyin" style="cursor:default;">欢迎您，{{ huanyingName }}</span>
      <!-- <span class="nothing" /> -->
    </div>
    <ul class="right-menu">
      <li @click="triggerHandler" style="margin:0 14px; white-space:nowrap;width:100px;">
        <svg-icon icon-class="dingwei" />
        <span>{{ dingweiName }}</span>
      </li>
      <li style="margin:0 14px">
        <svg-icon icon-class="bianqian1" />
      </li>
      <li style="margin:0 14px">
        <svg-icon icon-class="shezhi1" />
      </li>
      <li @click="isShowT3" style="margin:0 14px">
        <svg-icon icon-class="tuichu1" />
      </li>
    </ul>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import Hamburger from '@/components/Hamburger'
// import store from '../../store'
export default {
  components: {
    Hamburger
  },
  data () {
    return {
      userInfo: {},
      dingweiName: ''
    }
  },
  props: ['huanyingName'],
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar'
    ]),
    // ...mapState(['userInfo'])
  },
  created () {
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'))
    this.dingweiName = this.userInfo.propertyName
  },
  methods: {
    toggleSideBar () {
      // console.log('svgxvsghfbyjegfe3g')
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout () {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
    isShowT3 () {
      this.$emit('isShowTHander')
    },
    triggerHandler () {
      if (this.userInfo.Jurisdiction === 2) {
        return
      } else {
        this.$store.commit('permission/CLEAR_PERMISSION')
        this.$emit('isShowT4Hander')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 45px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  display: flex;
  min-width: 51.24vw;
  margin-right: 0 !important;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 6px 5px 0px rgba(204, 204, 204, 0.1);
  .hamburger-container {
    padding: 0 !important;
    line-height: 45px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: 0.3s;
    -webkit-tap-highlight-color: transparent;

    // &:hover {
    //   background: rgba(0, 0, 0, .025)
    // }
  }
  .second {
    width: 82%;
    // min-width: 700px;
    height: 100%;
    margin-right: 1.2vw;
    box-sizing: border-box;
    padding-left: 2.04vw;
    display: flex;
    justify-content: space-between;
    align-items: center;
    float: left;
    .huanyin {
      display: inline-block;
      cursor: pointer;
      width: auto;
      font-size: 14px;
      white-space: nowrap;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: rgba(51, 51, 51, 1);
    }
    .form-btn {
      // width: 228px;
      height: 26px;
      background: rgba(255, 255, 255, 1);
      // border: 1px solid rgba(95, 175, 228, 1);
      border-radius: 2px;
      display: flex;
      input {
        outline: none;
        float: left;
        width: 5%;
        background: rgba(255, 255, 255, 1);
        border-right: none;
        outline: none;
        flex: 5;
        padding-left: 7px;
        border: none;
        font-size: 10px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: rgba(153, 153, 153, 1);
        &::-webkit-input-placeholder {
          font-size: 10px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          color: rgba(153, 153, 153, 1);
          // padding: 0 0 20px 0;
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
        font-size: 16px;
        border-left: none;
        // background: #5fafe4;
        text-align: center;
        line-height: 26px;
        cursor: default;
        color: #fff;
        font-size: 10px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: rgba(255, 255, 255, 1);
        // border-radius: 0px 2px 2px 0px;
      }
    }
    //将搜索框隐藏
    .nothing {
      display: inline-block;
      width: 228px;
      min-width: 700px;
      height: 100%;
      margin-right: 1.2vw;
      box-sizing: border-box;
      background-color: #fff;
      color: #fff;
      position: absolute;
      top: 0;
    }
  }

  .right-menu {
    float: right;
    height: 100%;
    cursor: pointer;
    // background-color: #ccc;
    // padding-right: 0.73vw !important;
    display: flex;
    // justify-content: space-around;
    align-items: center;
    flex: 1;
    // width: 23vw;
    // min-width: 14.6vw;
    font-size: 0.9vw;
    text-align: center;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: rgba(102, 102, 102, 1);
    .svg-icon {
      font-size: 24px;
      vertical-align: -0.3em !important;
    }
  }
  .right-menu li span {
    font-size: 14px;
    margin-left: 3px;
  }
}
</style>
