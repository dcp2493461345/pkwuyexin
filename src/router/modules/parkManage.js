import Layout from '@/layoutpk'
// 停车场管理路由表
// var pathR = '/parkmanage/'
// const lists = JSON.parse(localStorage.getItem('RouterLists'))
// if (lists) {
//   const routerLists = lists
//   if (routerLists) {
//     routerLists.forEach(item => {
//       if (item.auth_name === '停车场管理') {
//         if (item.zi) {
//           if (item.zi.length) {
//             const ziRoutes = item.zi
//             pathR += ziRoutes[0].auth_a
//           }
//         } else {
//           pathR += 'index'
//           console.log(pathR)
//         }
//       }
//     })
//   }
// }

const parkManageRouter = {
  path: '/parkmanage',
  component: Layout,
  hidden: false,
  name: 'parkmanage',
  redirect: '/parkmanage/Longcar',
  meta: {
    title: '停车场管理',
    icon: 'tccgl',
    auth_id: 166
  },
  children: [
    {
      path: 'Longcar',
      hidden: true,
      name: 'Longcar',
      component: () => import('@/views/ParkSystem/ParkManage/Longcar/index'),
      meta: { title: '长租车管理', auth_id: 167 }
    },
    {
      path: 'reimburse',
      hidden: true,
      name: 'reimburse',
      component: () => import('@/views/ParkSystem/ParkManage/Reimburse/index'),
      meta: { title: '退款审核', auth_id: 168 }
    },
    {
      path: 'inquirecar',
      hidden: true,
      name: 'inquirecar',
      component: () => import('@/views/ParkSystem/ParkManage/presence/index'),
      meta: { title: '在场车辆查询', auth_id: 169 }
    },
    {
      path: 'history',
      hidden: true,
      name: 'history',
      component: () => import('@/views/ParkSystem/ParkManage/History/index'),
      meta: { title: '历史停车记录', auth_id: 170 }
    },
    {
      path: 'specialVehicle',
      hidden: true,
      name: 'specialVehicle',
      component: () => import('@/views/ParkSystem/ParkManage/specialVehicle/Index'),
      meta: { title: '特殊车辆', auth_id: 171 }
    },
    {
      path: 'Parklists',
      hidden: true,
      name: 'Parklists',
      component: () => import('@/views/ParkSystem/ParkManage/Parklists/index'),
      meta: { title: '车位列表', auth_id: 172 }
    },
    {
      path: 'carType',
      hidden: true,
      name: 'carType',
      component: () => import('@/views/ParkSystem/ParkManage/CarType/index'),
      meta: { title: '车位类型', auth_id: 173 }
    },
    {
      path: 'AuditList',
      hidden: true,
      name: 'AuditList',
      component: () => import('@/views/ParkSystem/ParkManage/AuditList/index'),
      meta: { title: '审核车位', auth_id: 174 }
    }
  ]
}
export default parkManageRouter
