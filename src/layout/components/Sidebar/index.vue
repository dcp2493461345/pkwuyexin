<template>
  <div :class="{'has-logo':showLogo}">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="true"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="true"
      >
        <sidebar-item
          v-for="route in sidebarMenu1"
          :key="route.path"
          :item="route"
          :base-path="route.path"
          :index="route.name"
          @click="routerHandler(route)"
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters, mapState, mapMutations } from 'vuex'
import Logo from './Logo'
import SidebarItem from './SidebarItem'
import { postSelect_position_list } from '@/api/user'
import variables from '@/styles/variables.scss'
import { eventBus } from '@/main'
export default {
  components: { SidebarItem, Logo },
  data () {
    return {
      userInfo: {},
      sidebarMenu1: []
    }
  },
  methods: {
    ...mapMutations(['setRouterAsync']),
    routerHandler (item) {
      console.log(item, '我的item')
      eventBus.$emit('firstRouter', item)
    }
  },
  watch: {
    '$route' (to, from) {
      // console.log(to, 'tototootototototot')
      const fullPath = to.fullPath
      const str = fullPath.split('/')
      const strData = str[1]
      const routerOptions = this.sidebarMenu1
      const lists = routerOptions.filter(item => item.name === strData)

      if (strData === 'dashboard') {
        // console.log(strData)
      } else {
        this.setRouterAsync(lists[0])
      }
    }
  },
  computed: {
    ...mapState('permission', ['sidebarMenu']),
    ...mapGetters([
      'sidebar'
    ]),
    routes () {
      return this.$router.options.routes
    },
    activeMenu () {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      let newPath = path.split("/")
      const newPath1 = '/' + newPath[1]
      return newPath1
    },
    showLogo () {
      return this.$store.state.settings.sidebarLogo
    },
    variables () {
      return variables
    },
    isCollapse () {
      return !this.sidebar.opened
    }
  },

  created () {
    // console.log('侧边栏创建')
    const userInfo = JSON.parse(localStorage.getItem('userInfo'))
    const { uid, Communityid, type } = userInfo
    postSelect_position_list({ uid, Communityid, type }).then(resp => {
      if (resp.code === 200) {
        // console.log(resp, '后端返回的路由数据122')
        localStorage.setItem('RouterLists', JSON.stringify(resp.msg))
        // if (!this.$store.state.permission.permissionList) {
        console.log('处理侧边栏数据方法调用1120')
        this.$store.dispatch('permission/FETCH_PERMISSION')
        // }
      }
    })

    setTimeout(() => {
      this.sidebarMenu1 = this.sidebarMenu
      // console.log(this.sidebarMenu, 'this.sidebarMenu侧边栏渲染')
      const fullPath = this.$route.fullPath
      const str = fullPath.split('/')
      const strData = str[1]
      const routerOptions = this.sidebarMenu1
      const lists = routerOptions.filter(item => item.name === strData)
      // console.log(lists, 'lists')
      if (strData === 'dashboard') {
      } else {
        this.setRouterAsync(lists[0])
      }
    }, 500)
    if (localStorage.getItem('isRefresh') === 'true') {
      //框架刷新
      // location.reload()
      setTimeout(() => {
        location.reload()
      }, 500)
      localStorage.setItem('isRefresh', false)
    }
  }
}
</script>
