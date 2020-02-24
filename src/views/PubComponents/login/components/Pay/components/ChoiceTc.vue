<template>
  <div>
    <!-- 选择套餐 -->
    <div class="wy-choice-container">
      <!-- 标题栏 -->
      <div class="wy-choice-container_title">
        <span class="dayu" @click="fanhui1()">
          <svg-icon icon-class="fanhui" />
        </span>
      </div>
      <div class="container-box">
        <div
          v-for="(item,index) in listData"
          :key="item.sort"
          class="choicetc-el-row"
          @click="handlerOne(item,index)"
        >
          <div :class="actived===index ? 'bt1':'bt2'" class="btn1">
            <div class="card-title1">
              <p class="title1">{{ item.Setmeal_name }}</p>
              <p class="title2">{{ item.Setmeal_capacity }}</p>
            </div>
            <div class="card-title2">
              <p class="title1">
                <span style="color: red; font-size: 16px">￥</span>
                {{ item.Setmeal_Prices }}
              </p>
              <del class="title2" v-if="item.Setmeal_Price!==0">
                <span v-show="item.Setmeal_Price">￥</span>
                {{ item.Setmeal_Price }}
              </del>
            </div>
            <!-- 推荐三角形 -->
            <div v-if="index===2" class="img-tuijian">
              <svg-icon icon-class="tuijian" />
            </div>
          </div>
        </div>
      </div>
      <div class="wy-choice-container-wrap">
        <div class="wy-choice-container-wrap_btn" @click="handleClickChoice()">确认</div>
      </div>
    </div>
  </div>
</template>

<script>
import { postSelect_setmeal } from '@/api/pay'
import { Message } from 'element-ui'
import { mapMutations, mapActions } from 'vuex'
export default {
  name: 'ChoiceTc',
  data () {
    return {
      listData: [],
      itemQueren: {},
      getYearLists: [],
      item1: {},//点击时的当前套餐数据
      actived: 0,
      userInfo: {},
      type: 1,//1是物业，2是停车
    }
  },
  created () {
    this.getData()
    //
    if (this.type === 2) {
      this.actived = 1
    }
  },
  methods: {
    ...mapMutations(['changeSetmeal_id', 'changeSetmeal_name']),
    // 得到套餐的数据
    getData () {
      this.userInfo = JSON.parse(localStorage.getItem('userInfo'))
      const Communityid = this.userInfo.Communityid
      const propertyId = this.userInfo.propertyId
      this.type = this.userInfo.type
      postSelect_setmeal({ Communityid, propertyId }).then(resp => {
        this.listData = resp.msg
        this.item1 = this.actived === 1 ? this.listData[1] : this.listData[0]
      })
    },
    // 点击某个套餐卡片
    handlerOne (item, index) {
      this.actived = index
      this.item1 = item
    },
    // 点击确认
    handleClickChoice () {
      console.log(this.item1, '点击确认')
      //将套餐id存入vuex/localStorage
      this.changeSetmeal_id(this.item1.Setmeal_id)
      this.changeSetmeal_name(this.item1.Setmeal_name)
      localStorage.setItem('choiceTcItem', JSON.stringify(this.item1))
      //跳转
      this.$router.push('/login/pay/ChoiceYear')
    },
    fanhui1 () {
      this.$router.push('/login/community')
    },
  }
}
</script>

<style lang="scss" scoped>
.wy-choice-container {
  .chioce-container {
    height: 54vh;
  }
  .container-box {
    display: flex;
    justify-content: space-between;
    width: 100%;
    height: 255px;
    padding: 0 25px;
  }

  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 1);
  border-radius: 11px;
  // margin: 4.7vh 1.7vw 4vh 1.7vw;
  &_title {
    display: flex;
    justify-content: space-between;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: rgba(102, 102, 102, 1);
    // margin-bottom: 4.3vh;
    .dayu {
      cursor: pointer;
      font-size: 24px;
      margin-top: 1px;
    }
  }
  &-wrap {
    margin-top: 33px;
    position: relative;
    width: 100%;
    height: 40px;
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
      bottom: -18px;
    }
  }
}
.svg-icon {
  vertical-align: -0.11em !important;
}
.choicetc-el-row {
  cursor: pointer;
  width: 175px;
  height: 185px;
  margin-top: 22px;
  margin-bottom: 30px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  .bt1 {
    background: rgba(255, 255, 255, 1);
    border: 1px solid rgba(248, 172, 89, 1);
    box-shadow: 0px 6px 5px 0px rgba(248, 172, 89, 0.15) !important;
    border-radius: 0px;
  }
  .bt2 {
    border: 1px solid rgba(243, 243, 243, 1);
    box-shadow: 0px 6px 5px 0px rgba(204, 204, 204, 0.15) !important;
    background: rgba(255, 255, 255, 1);
  }
  .btn1 {
    width: 190px;
    height: 140%;
    background: rgba(255, 255, 255, 1);
    // border:1px solid rgba(243,243,243,1);
    position: relative;
    .card-title1 {
      width: 100%;
      height: 45%;
      // background-color: #f00;
      display: flex;
      flex-direction: column;
      justify-content: center;
      .title1 {
        width: 100%;
        font-size: 22px;
        text-align: center;
        white-space: nowrap;
        margin-top: 67px;
      }
      .title2 {
        width: 100%;
        // white-space: nowrap;
        text-align: center;
        font-size: 14px;
        transform: scale(0.8);
        margin: 0 auto;
        margin-top: 1.6vh;
      }
    }
    .card-title2 {
      width: 100%;
      height: 50%;
      // background: blue;
      display: flex;
      flex-direction: column;
      justify-content: center;
      text-align: center;
      .title1 {
        width: 100%;
        font-size: 22px;
        white-space: nowrap;
        color: red;
      }
      .title2 {
        width: 100%;
        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        text-decoration: line-through;
        color: rgba(153, 153, 153, 1);
      }
    }
    .img-tuijian {
      font-size: 44px;
      position: absolute;
      top: -9px;
      right: 0;
    }
  }
}
</style>
