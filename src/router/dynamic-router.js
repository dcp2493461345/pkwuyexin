import Layout from '@/layout'
import layoutpk from '@/layoutpk'
import cooperationRouter from './modules/cooperation'
import Propertycharge from './modules/Propertychargess'
import houseInfoRouter from './modules/houseInfo'
import accountInfoRouter from './modules/accountInfo'
import entranceRouter from './modules/entranceguard'
import parkManageRouter from './modules/parkManage'
import hardwareRouter from './modules/hardware'
import accountInfoRouterPk from './modules/accountInfoPk'
import incomeRouter from './modules/income'
import parkconcessionRouter from './modules/parkconcession'
// import carmanageRouter from './modules/carmanage'
// import qrcodeChargeRouter from './modules/qrcodeCharge'
import statisticInfoRouter from './modules/statisticInfo'
// const dashboard = () => import('@/views/WySystem/dashboard/index')
/* 需要权限判断的路由 */
const dynamicRoutes = [
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
  //停车场的首页
  {
    path: '/parkdashboard',
    component: layoutpk,
    name: 'parkdashboard',
    meta: {
      title: '首页',
      icon: 'home3',
      isToken: true,
      auth_id: 1
    }
  },
  // {
  //   path: '/charge',
  //   component: Layout,
  //   hidden: true,
  //   children: [
  //     {
  //       path: 'index',
  //       name: 'charge',
  //       component: () => import('@/views/WySystem/Charge/index'),
  //       meta: {
  //         title: '物业收费',
  //         icon: 'wycharge3'
  //       }
  //     }
  //   ]
  // },
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
  //房屋
  houseInfoRouter,

  Propertycharge,
  // 合作企业
  cooperationRouter,
  // 帐号分配
  accountInfoRouter,
  //门禁
  entranceRouter,

  parkManageRouter,//停车场管理
  hardwareRouter,//硬件管理
  accountInfoRouterPk,//停车场帐号分配
  // incomeRouter,
  parkconcessionRouter,
  // carmanageRouter,
  // qrcodeChargeRouter,
  statisticInfoRouter
]

export default dynamicRoutes
