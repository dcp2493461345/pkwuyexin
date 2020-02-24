/* eslint-disable */
import Vue from 'vue'
import Router from 'vue-router'
import cooperationRouter from './modules/cooperation'
import houseInfoRouter from './modules/houseInfo'
import accountInfoRouter from './modules/accountInfo'
import Propertycharge from './modules/Propertychargess'
import entranceRouter from './modules/entranceguard'
//停车场路由
import parkManageRouter from './modules/parkManage'
import hardwareRouter from './modules/hardware'
import accountInfoRouterPk from './modules/accountInfoPk'
import incomeRouter from './modules/income'
import parkconcessionRouter from './modules/parkconcession'
import carmanageRouter from './modules/carmanage'
import qrcodeChargeRouter from './modules/qrcodeCharge'
import statisticInfoRouter from './modules/statisticInfo'
Vue.use(Router)

/* Layout */
import Layout from '@/layout'
import Layoutpk from '@/layoutpk'

const dashboard = () => import('@/views/WySystem/dashboard/index')
const parkdashboard = () => import('@/views/ParkSystem/parkdashboard/index')
//首页和登录和一些不用权限的公共页面
export const constantRoutes = [
  {
    path: '/',
    component: Layout,
    redirect: '/login/welcome',
    hidden: true,
    children: [{
      path: 'dashboard',
      name: 'dashboard',
      hidden: true,
      component: dashboard,
      meta: {
        title: '首页111',
        icon: 'home3',
        auth_id: 1,
        isToken: true
      }
    }]
  },
  //停车场首页
  // {
  //   path: '/parkdashboard',
  //   component: Layoutpk,
  //   hidden: true,
  //   redirect: '/parkdashboard/index',
  //   children: [
  //     {
  //       path: 'index',
  //       name: 'parkdashboard',
  //       component: parkdashboard,
  //       meta: {
  //         title: '首页111',
  //         icon: 'home3'
  //       }
  //     }
  //   ]
  // },
  {
    path: '/',
    component: Layoutpk,
    redirect: '/login/welcome',
    hidden: true,
    children: [{
      path: 'parkdashboard',
      name: 'parkdashboard',
      hidden: true,
      component: parkdashboard,
      meta: {
        title: '首页111',
        icon: 'home3',
        auth_id: 1,
        isToken: true
      }
    }]
  },
  {
    path: '/login',
    component: () => import('@/views/PubComponents/login/index'),
    hidden: true,
    redirect: '/login/welcome',
    meta: {
      toClearLocalStorage: true
    },
    children: [{
      path: 'welcome',
      name: 'welcome',
      component: () => import('@/views/PubComponents/login/components/WelCome'),
      meta: {
        toClearLocalStorage: true
      }
    },
    //找回密码
    {
      path: 'loginretripwd',
      name: 'loginretripwd',
      component: () => import('@/views/PubComponents/login/components/loginretripwd'),
      meta: {
        toClearLocalStorage: true
      }
    },
    //input
    {
      path: 'input',
      name: 'input',
      component: () => import('@/views/ParkSystem/HardWare/SetParamss/test'),
      meta: {
        toClearLocalStorage: true
      }
    },
    //输入新密码
    {
      path: 'loginenternewpwd',
      name: 'loginenternewpwd',
      component: () => import('@/views/PubComponents/login/components/loginenternewpwd'),
      meta: {
        toClearLocalStorage: true
      }
    },
    //输入新密码2
    {
      path: 'loginentermore',
      name: 'loginentermore',
      component: () => import('@/views/PubComponents/login/components/loginentermore'),
      meta: {
        toClearLocalStorage: true
      }
    },
    //重置密码
    {
      path: 'loginresetpwd',
      name: 'loginresetpwd',
      component: () => import('@/views/PubComponents/login/components/loginresetpwd'),
      meta: {
        toClearLocalStorage: true
      }
    },
    //选择小区
    {
      path: 'community',
      name: 'community',
      component: () => import('@/views/PubComponents/login/components/community'),
      meta: {
        isToken: true
      }
    },
    //开票
    {
      path: 'WyInvoice',
      name: 'WyInvoice',
      component: () => import('@/views/PubComponents/login/components/WyInvoice'),
      meta: {
        isToken: true
      }
    },
    //付费页面
    {
      path: 'pay',
      name: 'pay',
      component: () => import('@/views/PubComponents/login/components/Pay/index'),
      meta: {
        isToken: true
      },
      children: [
        {
          path: 'choiceTc',
          name: 'choiceTc',
          component: () => import('@/views/PubComponents/login/components/Pay/components/ChoiceTc'),
          meta: {
            // toClearLocalStorage: true
          }
        }, {
          path: 'ChoiceYear',
          name: 'ChoiceYear',
          component: () => import('@/views/PubComponents/login/components/Pay/components/ChoiceYear'),
          meta: {
            // toClearLocalStorage: true
          }
        },
      ]
    },
    ]
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true },
  //asyncRouterMap————————————————————————————————————————
  //物业系统的首页
  {
    path: '/dashboard',
    component: Layout,
    name: 'dashboard',
    meta: {
      title: '首页',
      icon: 'home3',
      isToken: true,
      auth_id: 1
    }
  },
  //停车场系统的首页
  {
    path: '/parkdashboard',
    component: Layoutpk,
    name: 'parkdashboard',
    meta: {
      title: '首页',
      icon: 'home3',
      isToken: true,
      auth_id: 1
    }
  },
  //停车场首页
  // {
  //   path: '/parkdashboard',
  //   component: Layoutpk,
  //   hidden: true,
  //   redirect: '/parkdashboard/index',
  //   children: [
  //     {
  //       path: 'index',
  //       name: 'parkdashboard',
  //       component: parkdashboard,
  //       meta: {
  //         icon: 'home3',
  //         title: '首页',
  //         icon: 'home3',
  //         isToken: true,
  //         auth_id: 1
  //       }
  //     }
  //   ]
  // },
  {
    path: '/charge',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'index',
        name: 'charge',
        component: () => import('@/views/WySystem/Charge/index'),
        meta: {
          title: '物业收费',
          icon: 'wycharge3'
        }
      }
    ]
  },
  houseInfoRouter,
  {
    path: '/car',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'index',
        name: 'car',
        component: () => import('@/views/WySystem/Car/index'),
        meta: {
          title: '车位信息',
          icon: 'car3'
        }
      }
    ]
  },


  // 帐号分配
  accountInfoRouter,
  entranceRouter,

  {
    path: '/account/Jurisdiction',
    name: 'Jurisdiction',
    hidden: true,
    component: () => import('@/views/WySystem/Account/Jurisdiction/index'),
    meta: { title: '权限管理', auth_id: 7, isToken: true },
    redirect: '/account/Jurisdiction/EditAccount',
    children: [{
      path: 'EditAccount',
      name: 'EditAccount',
      hidden: true,
      component: () => import('@/views/WySystem/Account/Jurisdiction/EditAccount.vue'),
      meta: {
        title: '6666',
        isNoThreeShow: true,
        auth_id: 7,
        isToken: true
      }
    }]
  },
  {
    path: '/account/Jurisdiction/AccountManage',
    name: 'AccountManage',
    hidden: true,
    component: () => import('@/views/WySystem/Account/AccountManage/index'),
    meta: { title: '帐号管理', auth_id: 8, isToken: true }
  },
  {
    path: '/account/Jurisdiction/AccountAudit',
    name: 'AccountAudit',
    hidden: true,
    component: () => import('@/views/WySystem/Account/AccountAudit/index'),
    meta: { title: '帐号审核', auth_id: 9, isToken: true }
  }, Propertycharge,
  // 合作企业
  cooperationRouter,
  //停车场路由
  parkManageRouter,//停车场管理
  hardwareRouter,//硬件管理
  accountInfoRouterPk,//停车场帐号分配
  {
    path: '/accountpk/Jurisdiction1',
    name: 'Jurisdiction1',
    hidden: true,
    component: () => import('@/views/ParkSystem/Account/Jurisdiction/index'),
    meta: { title: '权限管理', auth_id: 7, isToken: true },
    redirect: '/accountpk/Jurisdiction1/EditAccount',
    children: [{
      path: 'EditAccount',
      name: 'EditAccount',
      hidden: true,
      component: () => import('@/views/ParkSystem/Account/Jurisdiction/EditAccount.vue'),
      meta: {
        title: '6666',
        isNoThreeShow: true,
        auth_id: 7,
        isToken: true
      }
    }]
  },
  {
    path: '/accountpk/Jurisdiction1/AccountManage1',
    name: 'AccountManage',
    hidden: true,
    component: () => import('@/views/ParkSystem/Account/AccountManage/index'),
    meta: { title: '帐号管理', auth_id: 8, isToken: true }
  },
  {
    path: '/accountpk/Jurisdiction1/AccountAudit1',
    name: 'AccountAudit',
    hidden: true,
    component: () => import('@/views/ParkSystem/Account/AccountAudit/index'),
    meta: { title: '帐号审核', auth_id: 9, isToken: true }
  },
  {
    path: '/incomestatic',
    component: Layoutpk,
    children: [
      {
        path: 'index',
        name: 'incomestatic',
        component: () => import('@/views/ParkSystem/IncomeStatistics/index'),
        meta: {
          title: '收入统计',
          icon: 'cooper3',
          auth_id: 54,
          isToken: true
        }
      }
    ]
  },
  {
    path: '/parkconcession',
    component: Layoutpk,
    children: [
      {
        path: 'index',
        name: 'parkconcession',
        component: () => import('@/views/ParkSystem/ParkConcession/index'),
        meta: {
          title: '停车场优惠',
          icon: 'cooper3',
          auth_id: 55,
          isToken: true
        }
      }
    ]
  },
  {
    path: '/qrcodeCharge',
    component: Layoutpk,
    children: [
      {
        path: 'index',
        name: 'qrcodeCharge',
        component: () => import('@/views/ParkSystem/QrcodeCharge/index'),
        meta: {
          title: '二维码收费管理',
          icon: 'cooper3',
          auth_id: 57
        }
      }
    ]
  },
  {
    path: '/carmanage',
    component: Layoutpk,
    children: [
      {
        path: 'index',
        name: 'carmanage',
        component: () => import('@/views/ParkSystem/CarManage/index'),
        meta: {
          title: '车辆车位管理',
          icon: 'cooper3',
          auth_id: 56
        }
      }
    ]
  },
  {
    path: '/statisticInfo',
    component: Layoutpk,
    children: [
      {
        path: 'index',
        name: 'statisticInfo',
        component: () => import('@/views/ParkSystem/statisticInfo/index'),
        meta: {
          title: '信息统计',
          icon: 'cooper3',
          auth_id: 58
        }
      }
    ]
  },
  incomeRouter,
  parkconcessionRouter,
  carmanageRouter,
  qrcodeChargeRouter,
  statisticInfoRouter
]
// 需要权限的动态路由
export const asyncRouterMap = [
  {
    path: '',
    component: Layout,
    name: 'container',
    redirect: '/login/WelCome',
    children: [

    ]
  }
];


const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()
// router.beforeEach((to, from, next) => {
//   console.log(to, 'to')
//   console.log(from, 'from')
//   next()
// })
// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter () {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
