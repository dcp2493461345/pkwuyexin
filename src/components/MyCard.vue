<template>
  <div class="card-container">
    <div class="icon" style="background-color:#8CCD7A;padding:14px;">
      <!-- <img src="" alt=""> -->
      <svg-icon icon-class="humanFace" style="font-size: 40px;line-height:50px;" />
    </div>
    <div class="txt1">
      <div class="txt">
        <span class="title">{{count}}</span>
      </div>
      <div class="txt">
        <span class="describ">人脸审核(待处理)</span>
      </div>
    </div>
    <div class="button" @click="judgeClick">审核</div>
  </div>
</template>

<script>
import { postSelect_count, postSelect_faceList } from '@/api/dash'
export default {
  data () {
    return {
      count: 0,
      userInfo: {}
    }
  },
  methods: {
    judgeClick () {
      this.$parent.showMain = false
    },
    sendCountRequest () {
      const { Communityid } = this.userInfo
      postSelect_count({ Communityid }).then(resp => {
        this.count = resp.msg
      })
    }

  },
  created () {
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'))
    // this.askRequest()
    this.sendCountRequest()
  }
}
</script>

<style lang="scss" scoped>
.card-container {
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  width: 500px;
  height: 150px;
  background-color: #fff;
  padding: 40px;
  background-color: #fff;
  .icon {
    width: 68px;
    height: 68px;
    background-color: #ddd;
    border-radius: 4px;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .txt {
    display: flex;
    width: 120px;
    justify-content: space-around;
    flex-direction: column;
    .title {
      width: 100%;
      height: 40px;
      display: inline-block;
      font-size: 26px;
      color: #fd3d3d;
    }
    .describ {
      font-size: 14px;
      color: #666666;
      margin-bottom: 10px;
    }
  }
  .button {
    margin: auto 0;
    width: 90px;
    height: 32px;
    color: #fff;
    background-color: #5fafe4;
    font-size: 16px;
    text-align: center;
    line-height: 32px;
    border-radius: 15px;
    cursor: pointer;
  }
}
</style>