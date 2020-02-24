<template>
  <!-- eslint-disable -->
  <div class="main">
    <h3 class="main-title" style="cursor:default;">请选择小区</h3>
    <div class="main-letter-container">
      <!-- <span>&lt;</span> -->
      <span @click="selectQb" :class="{qb:isActiveData2}" class="qb1">全部</span>
      <ul class="main-letter-container_list" v-for="letter in letters" :key="letter.id">
        <li
          @click="selectCommunityByLetter(letter.name)"
          :class="{active:isActiveData1 === letter.name}"
        >{{ letter.name }}</li>
      </ul>
    </div>

    <div class="item-container">
      <!-- 列表 -->
      <ul class="item-container_ul">
        <li v-for="(item, index) in dataLists" :key="index" class="item-container_li">
          <!-- 标题 -->
          <h1>{{ item.Community_name }}</h1>

          <!-- //停车场或者物业 -->
          <div class="container_div">
            <span
              class="container_span"
              style="border-radius:4px 0 0 4px;"
              @click="wyClickHandler(item.Communityid)"
              :class="item.wyhightLight ? 'activeStyle':''"
            >物业</span>
            <span
              class="container_span"
              style="border-radius:0 4px 4px 0;"
              @click="parkClickHandler(item.Communityid)"
              :class="item.pkhightLight  ? 'activeStyle':''"
            >停车场</span>
          </div>
          <!-- 到期时间，点击充值 -->
          <!-- 物业 -->
          <div class="delay-class" v-if="item.wyhightLight">
            <p style="margin-bottom:3px;">
              {{item.w_time}}
              <span
                style="color:#f00;cursor:pointer;"
                v-if="item.w_time.indexOf('暂未开通') !== -1"
                @click="Kaitong(item.Communityid,item.wyhightLight)"
              >去开通</span>
            </p>
            <p :class="item.w_Tips.includes('请续费') ? 'tips' : ''">
              <span style="color:#FF6600;">{{item.w_Time}}</span>
              {{item.w_Tips}}
              <span
                style="color:#FF6600;cursor:pointer;"
                v-if="item.w_Tips.indexOf('后到期') !== -1"
                @click="Kaitong(item.Communityid,item.wyhightLight)"
              >点击充值</span>
            </p>
          </div>
          <!-- 停车场 -->
          <div class="delay-class" v-if="item.pkhightLight">
            <p style="margin-bottom:3px;">
              {{item.t_time}}
              <span
                style="color:#f00;cursor:pointer;"
                v-if="item.t_time.indexOf('暂未开通') !== -1"
                @click="Kaitong(item.Communityid,item.wyhightLight)"
              >去开通</span>
            </p>
            <p :class="item.t_Tips.includes('请续费') ? 'tips' : ''">
              <span style="color:#FF6600;">{{item.t_Time}}</span>
              {{item.t_Tips}}
              <span
                style="color:#FF6600;cursor:pointer;"
                v-if="item.t_Tips.indexOf('后到期') !== -1"
                @click="Kaitong(item.Communityid,item.wyhightLight)"
              >点击充值</span>
            </p>
          </div>
          <!-- 圆圈按钮 -->
          <p
            class="span-cycle"
            @click="selectHandler(item.Communityid,item.wyhightLight,item.Community_name)"
          >
            <svg-icon icon-class="yjt1" />
          </p>
        </li>
      </ul>
    </div>
    <!-- 左箭头 -->
    <span class="fenye-click left-click" @click="leftBtn()">
      <svg-icon icon-class="leftjiantou" />
    </span>
    <!-- 右箭头 -->
    <span class="fenye-click right-click" @click="rightBtn()">
      <svg-icon icon-class="rightjiantou" />
    </span>
  </div>
</template>

<script>
/* eslint-disable */
// import { mapGetters, mapState } from "vuex";
import { mapGetters, mapActions, mapState, mapMutations } from 'vuex'
import { postSelect_community, postSelect_highest, postSelect_user } from '@/api/user'
import { Message } from 'element-ui'
import { getToken, setInfo, getReplaceData, setToken, setRoutes } from '@/utils/auth'
import { userInfo } from 'os';
export default {
  name: "Community",
  data () {
    // data数据
    return {
      letters: [
        { id: 1, name: 'A' },
        { id: 2, name: 'B' },
        { id: 3, name: 'C' },
        { id: 4, name: 'D' },
        { id: 5, name: 'E' },
        { id: 6, name: 'F' },
        { id: 7, name: 'G' },
        { id: 8, name: 'H' },
        { id: 9, name: 'I' },
        { id: 10, name: 'J' },
        { id: 11, name: 'K' },
        { id: 12, name: 'L' },
        { id: 13, name: 'M' },
        { id: 14, name: 'N' },
        { id: 15, name: 'O' },
        { id: 16, name: 'P' },
        { id: 17, name: 'Q' },
        { id: 18, name: 'R' },
        { id: 19, name: 'S' },
        { id: 20, name: 'T' },
        { id: 21, name: 'U' },
        { id: 22, name: 'V' },
        { id: 23, name: 'W' },
        { id: 24, name: 'X' },
        { id: 25, name: 'Y' },
        { id: 26, name: 'Z' },
      ],
      dataLists: [],
      page: null,//当前页码
      name: '',//字母
      itemid: null,
      dueToTime: '',//到期时间
      isActiveData1: '',
      isActiveData2: true,
      isCommunity: true,
      wyParkType: 1,//1代表物业2代表停车场
      userInfo: {},
      uid: '',
    }
  },
  computed: {
    ...mapState(['dueToTheTime']),
  },
  methods: {
    ...mapActions(['choiceCommunity', 'letterCommunity']),
    ...mapMutations(['isWyCover', 'replaceUserInfoData', 'setDueToTheTime', 'replaceUserInfoList']),
    //点击停车场
    parkClickHandler (id) {
      this.wyParkType = 2
      this.dataLists.forEach(item => {
        if (item.Communityid === id) {
          item.pkhightLight = true
          item.wyhightLight = false
        }
      })
      this.$forceUpdate()
      // console.log(this.dataLists, 'this.day')
    },
    wyClickHandler (id) {
      this.wyParkType = 1
      this.dataLists.forEach(item => {
        if (item.Communityid === id) {
          item.pkhightLight = false
          item.wyhightLight = true
        }
      })
      this.$forceUpdate()
      // console.log(this.dataLists, 'this.day')
    },
    //点击全部时获取小区数据lists
    getComunitLists (page = 1, uid = this.uid) {
      postSelect_community({ uid, page }).then(resp => {
        this.dataLists = resp.msg.data
        this.dataLists.forEach(item => {
          item.wyhightLight = true
          item.pkhightLight = false
        })
        this.page = resp.msg.page
        this.pages = resp.msg.pageNum
        // console.log(resp, '页面创建时的resp')
      })
    },
    //点击首字母获取小区列表
    getLettersLists (page = 1, name) {
      const uid = this.uid
      postSelect_highest({ page, uid, name }).then(resp => {
        console.log(resp, '点击首字母选择小区resp')
        this.dataLists = resp.msg.data
        this.dataLists.forEach(item => {
          item.wyhightLight = true
          item.pkhightLight = false
        })
        this.page = resp.msg.page
        this.pages = resp.msg.pageNum
      })
    },
    //圆圈按钮
    selectHandler (Communityid, wyhightLight, Community_name) {
      const type = wyhightLight ? 1 : 2
      // console.log(Communityid, type, 'Communityid')
      const uid = this.uid
      postSelect_user({ Communityid, type, uid }).then(resp => {
        // console.log(resp, 'resp11')
        if (resp.code === 401 || resp.code === 402) {
          this.$message.error(resp.msg);
        } else if (resp.code === 403) {
          this.userInfo = JSON.parse(localStorage.getItem('userInfo'))
          this.userInfo.Communityid = Communityid
          this.userInfo.type = type
          localStorage.setItem('userInfo', JSON.stringify(this.userInfo))
          this.$router.push('/login/pay/choiceTc')
        } else if (resp.code === 200) {
          localStorage.setItem('isRefresh', true)
          this.userInfo = JSON.parse(localStorage.getItem('userInfo'))
          this.userInfo.Communityid = Communityid
          this.userInfo.propertyName = Community_name
          this.userInfo.type = type
          localStorage.setItem('userInfo', JSON.stringify(this.userInfo))
          localStorage.setItem('dashQue1', JSON.stringify(resp.msg))
          if (type === 1) {
            //跳转物业框架
            this.$router.push('/dashboard')
          } else {
            //跳转停车框架
            localStorage.setItem('dashCreate', 1)
            this.$router.push('/parkdashboard')
          }
        }
      })
    },
    //去开通
    Kaitong (Communityid, wyhightLight) {
      const category = this.userInfo.category
      const type = wyhightLight ? 1 : 2
      if (category === 2) {
        this.userInfo = JSON.parse(localStorage.getItem('userInfo'))
        this.userInfo.Communityid = Communityid
        this.userInfo.type = type
        localStorage.setItem('userInfo', JSON.stringify(this.userInfo))
        this.$router.push('/login/pay/choiceTc')
      } else {
        this.$message.error('您暂无权限，请联系老板充值')
      }
    },
    // 点击全部
    selectQb () {
      this.isCommunity = true
      this.isActiveData1 = "全部"
      this.isActiveData2 = true
      this.name = ''
      this.getComunitLists(1)
    },
    // 按照小区首字母搜索小区
    selectCommunityByLetter (name) {
      this.isActiveData1 = name
      this.isActiveData2 = false
      this.name = name
      this.getLettersLists(1, name)
    },

    // 分页
    rightBtn () {
      const page = Number(this.page)
      const pages = Number(this.pages)
      if (this.name === '') {
        //name为全部时
        if (page < pages) {
          this.getComunitLists(page + 1)
        }
      } else {
        //name为字母时
        if (page < pages) {
          this.getLettersLists(page + 1, this.name)
        }
      }
    },
    leftBtn () {
      if (this.name === '') {
        //name为全部时
        const page = Number(this.page)
        if (page > 1) {
          this.getComunitLists(page - 1)
        }
      } else {
        //name为字母时
        const page = Number(this.page)
        if (page > 1) {
          this.getLettersLists(page - 1, this.name)
        }
      }
    },
  },

  created () {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'))
    this.userInfo = userInfo
    this.uid = userInfo.uid
    const uid = Number(userInfo.uid)

    postSelect_community({ uid }).then(resp => {
      this.dataLists = resp.msg.data
      this.dataLists.forEach(item => {
        item.wyhightLight = true
        item.pkhightLight = false
      })
      this.page = resp.msg.page
      this.pages = resp.msg.pageNum
      this.total = resp.msg.total
      // console.log(resp, '页面创建时的resp')
    })
  }
}
</script>

<style lang="scss" scoped>
.active {
  color: rgba(37, 186, 217, 1) !important;
  // background-color: #f00;
}
.main {
  position: relative;
  width: 1100px;
  height: 500px;
  padding: 20px 30px 30px;
  background: white;
  border-radius: 10px;
  position: absolute;
  left: 0;
  right: 0;
  top: 8px;
  bottom: 0;
  margin: auto;
  &-title {
    height: 26px;
    text-align: center;
    font-size: 22px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
  }
  &-letter-container {
    display: flex;
    width: 100%;
    margin-top: 20px;
    margin-left: 5px;
    box-sizing: border-box;
    font-size: 12px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: rgba(102, 102, 102, 1);
    // padding-top: 6px;
    cursor: pointer;
    .qb {
      color: rgba(37, 186, 217, 1);
      font-size: 13px !important;
      font-family: Microsoft YaHei;
      font-weight: 400;
      padding: 3px 15px 0px 5px;
      cursor: pointer;
      width: auto;
      display: inline-block;
    }
    .qb1 {
      font-size: 13px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      padding: 3px 25px 0px 5px;
      cursor: pointer;
      width: auto;
      display: inline-block;
    }
    &_list {
      display: flex;
      flex: 1;
      // padding-left: 10px;
      justify-content: space-between;
      li {
        font-size: 13px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: rgba(102, 102, 102, 1);
        padding-top: 3px;
        cursor: pointer;
        &:hover {
          color: rgba(37, 186, 217, 1);
        }
      }
    }
  }
  .item-container {
    padding: 4px 6px 0 43px;
    &_ul {
      width: 975px;
      display: flex;
      flex-flow: wrap;
      .item-container_li {
        width: 230px;
        height: 136px;
        border: 1px solid rgba(239, 242, 245, 1);
        box-shadow: 4px 7px 7px 0px rgba(0, 0, 0, 0.03);
        border-radius: 5px;
        margin-right: 12px;
        margin-top: 40px;
        position: relative;
        h1 {
          width: 100%;
          height: 42px;
          font-size: 18px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          color: rgba(51, 51, 51, 1);
          text-align: center;
          line-height: 42px;
          cursor: default;
        }
        .container_div {
          width: 160px;
          height: 23px;
          margin-left: 35px;
          // border: 1px solid rgba(95, 175, 228, 1);
          // border-radius: 4px;
          .container_span {
            cursor: pointer;
            display: inline-block;
            width: 50%;
            height: 22px;
            font-size: 14px;
            font-family: Microsoft YaHei;
            font-weight: 400;
            color: rgba(182, 182, 182, 1);
            text-align: center;
            line-height: 20px;
            border: 1px solid rgba(95, 175, 228, 1);
            // border-radius: 4px 0px 0px 4px;
          }
          .span-pk {
            border: 1px solid rgba(95, 175, 228, 1);
            border-radius: 0px 4px 4px 0px;
          }
          .span-wy {
            border: 1px solid rgba(95, 175, 228, 1);
            border-radius: 4px 0px 0px 4px;
          }
          .activeStyle {
            background: rgba(95, 175, 228, 1);
            color: #fff;
          }
        }
        .delay-class {
          cursor: default;
          height: 62px;
          width: 100%;
          font-size: 12px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          color: rgba(102, 102, 102, 1);
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-content: center;
          p {
            width: 100%;
            text-align: center;
          }
        }
        /deep/.span-cycle {
          position: absolute;
          right: 8px;
          top: 104px;
          display: block;
          line-height: 18px;
          width: 25px;
          height: 25px;
          font-size: 24px !important;
          cursor: pointer;
          /deep/svg-icon {
            color: #5fafe4 !important;
            display: inline-block;
            width: 18px;
            height: 18px;
          }
        }
      }
    }
  }
  .button {
    // background-color: #f00;
    position: absolute;
    right: 0;
    // top: 26px;
    bottom: 15px;
    width: 100%;
    height: 30px;
    display: flex;
    justify-content: center;
    .el-button {
      width: 72px;
      height: 30px;
      border: none;
      background: rgba(248, 172, 89, 1);
      border-radius: 4px;
      text-align: center;
      font-size: 14px;
      line-height: 0;
      position: relative;
    }
  }
  .fenye-click {
    display: inline-block;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 36px;
    height: 30px;
    // background-color: #c4c4c4;
    font-size: 40px;
    text-align: center;
    color: #fff;
    border-radius: 50%;
    cursor: pointer;
  }
  .left-click {
    position: absolute;
    top: 54%;
    left: 20px;
  }
  .right-click {
    position: absolute;
    top: 54%;
    right: 20px;
  }
}
.tips {
  color: red;
}
</style>
