<template>
  <div class="app-main">
    <!-- //二级菜单 -->
    <div class="zhanwei" />
    <div v-if="isShowDash">
      <ul>
        <router-link
          v-for="item in secondRouterLists.children"
          :key="item.path"
          :to="{ name: item.name}"
          class="selectLi"
        >
          <li :class="{listClass:isDivShow}" tabindex="2" @click="cc(item)">{{ item.meta.title }}</li>
        </router-link>
        <!-- //三级菜单 -->
        <div
          v-if="isThreeMenu"
          class="threeMenu"
          :class="{threeMenu1:isDivShow}"
          @click="isThreeMenu = !isThreeMenu"
        >
          <!-- <span>押金列表</span>
          <span>押金列表</span>-->
          <router-link
            v-for="list in childrenLists"
            v-show="isThreeMenu"
            :key="list.name"
            tag="span"
            :to="{ name: list.name}"
          >{{ list.meta.title }}</router-link>
        </div>
      </ul>
    </div>
    <router-view :key="key" />
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
// console.log(eventBus, 'ven5555555555555555555555555555555555555555555555t')
export default {
  name: 'AppMain',
  data () {
    return {
      isShowDash: true,
      isDash: false,
      isThreeMenu: false,
      threeMenuLists: [],
      isDivShow: false,
      secondRoutes: [],
      childrenLists: []
    }
  },
  computed: {
    ...mapState(['secondRouterLists']),
    ...mapState('permission', ['sidebarMenu']),
    key () {
      return this.$route.path
    }
  },
  watch: {
    '$route' (to, from) {
      // console.log(to.meta.title, 'appmain-watch-创建')
      this.isThreeMenu = false
      this.isDivShow = false
      // 对路由变化作出响应...
      if (to.meta.title === '首页111') {
        this.isShowDash = false
        this.isDash = false
        this.$forceUpdate()
      } else {
        this.isShowDash = true
        this.isDash = true
      }
      const threeMenuItems = this.secondRouterLists.children
      this.threeMenuLists = threeMenuItems.filter(item => Boolean(item.children) === true)
      const childrenLists1 = []
      this.threeMenuLists.forEach(item => {
        console.log(item.children[0], '99999999999993333')
        childrenLists1.push(item.children[0])
      })
      this.childrenLists = childrenLists1
      // console.log(this.childrenLists, 'lanzhou')
      const fullPath = to.fullPath
      const str = fullPath.split('/')
      const strData = str[3]
      // console.log(strData, 'tototootototot')
      childrenLists1.forEach(item => {
        // console.log(item, strData, 'wunaiargraaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')
        if (item.name === strData) {
          if (item.meta.isNoThreeShow) {
            this.isThreeMenu = false
          } else {
            this.isThreeMenu = true
            this.isDivShow = true
          }
        }
      })
    }
  },
  beforeRouteEnter (to, from, next) {
    console.log(to, 'ttoototoot')
    next(vm => {
      // 通过 `vm` 访问组件实例
      if (to.meta.title === '首页111') {
        vm.isShowDash = false
        vm.isDash = false
      } else {
        vm.isShowDash = true
        vm.isDash = true
      }
    })
  },
  created () {
    console.log(this.secondRouterLists, '二级菜单')
    this.isThreeMenu = false
    if (this.$route.name === "dashboard") {
      this.isShowDash = false
      this.isDash = false
    }
  },
  methods: {
    ...mapMutations(['clearRouterAsync']),
    cc (item) {
      this.isThreeMenu = true
    }
    // changeTreeMenu1() {
    //   // DOM 还没有更新
    //   this.$nextTick(function() {
    //     console.log('dianwo ')
    //     // DOM 现在更新了
    //     // `this` 绑定到当前实例
    //     // this.doSomethingElse()
    //     this.changeTreeMenu()
    //   })
    // },

    // changeTreeMenu() {
    //   console.log('ppppp')
    // }
  }
}
</script>

<style lang="scss"  scoped>
.app-main {
  position: relative;
  margin-right: 152px;
  min-width: 880px;
  height: 93.5%;
  // max-height: 565px;
  overflow-y: auto;
  background-color: #fff;
  .zhanwei {
    width: 100%;
    height: 20px;
    background-color: #f3f3f3;
  }
  ul {
    background-color: #f3f3f3;
    display: flex;
    width: 100%;
    font-size: 11px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: rgba(153, 153, 153, 1);
    .selectLi {
      display: inline-block;
      position: relative;
      li {
        min-height: 28px;
        padding: 6px 13px;
        text-align: center;
        background: rgba(255, 255, 255, 1);
        border: 1px solid rgba(239, 242, 245, 1);
        border-radius: 4px 4px 0 0;
        border-bottom: 1px solid #fff;
        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: rgba(102, 102, 102, 1);
        position: relative;
        cursor: pointer;
        &:first-child {
          border-left: none;
        }
        &:hover {
          color: #5fafe4;
          border-bottom: none;
        }
        &:focus {
          color: #5fafe4;
          outline: none;
        }
      }
    }
    .router-link-exact-active {
      border: 1px solid #5fafe4;
      border-bottom: 0px !important;
      outline: none;
      border-radius: 4px 4px 0 0;
      li {
        color: #5fafe4;
        border-bottom: none;
      }
    }
    .threeMenu {
      position: absolute;
      width: 114px;
      height: auto;
      top: 6.33vh;
      left: 11vw;
      background-color: #f00;
      padding: 0px 6px;
      background: rgba(255, 255, 255, 1);
      box-shadow: 0px 4px 5px 0px rgba(204, 204, 204, 0.3);
      display: none;
      span {
        display: inline-block;
        width: 100%;
        height: 36px;
        line-height: 36px;
        text-align: center;
        border-bottom: 1px solid #eff2f5;
        cursor: pointer;
        font-size: 0.8vw;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: rgba(102, 102, 102, 1);
        &:last-child {
          border: none;
        }
        &:hover {
          color: #5fafe4;
        }
      }
    }
    .threeMenu1 {
      display: block;
    }
  }
}

.fixed-header + .app-main {
  padding-top: 50px;
}
</style>

<style lang="scss">
// .el-popover {
//   padding: 0px 6px;
//   top: 80px !important;
//   position: absolute !important;
//   background: rgba(255, 255, 255, 1);
//   box-shadow: 0px 4px 5px 0px rgba(204, 204, 204, 0.3);
//   li {
//     width: 100%;
//     height: 36px;
//     line-height: 36px;
//     text-align: center;
//     border-bottom: 1px solid #eff2f5;
//     cursor: pointer;
//     font-size: 11px;
//     font-family: Microsoft YaHei;
//     font-weight: 400;
//     color: rgba(102, 102, 102, 1);
//     &:last-child {
//       border: none;
//     }
//     &:hover {
//       color: #5fafe4;
//     }
//   }
// }
//
</style>
// // 主要内容
