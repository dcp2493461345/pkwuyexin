import Layout from '@/layoutpk'
// 硬件管理路由表
// var pathR = '/hardware/'
// const lists = JSON.parse(localStorage.getItem('RouterLists'))
// if (lists) {
//   const routerLists = lists
//   if (routerLists) {
//     // console.log(routerLists)
//     routerLists.forEach(item => {
//       if (item.auth_name === '硬件管理') {
//         if (item.zi) {
//           if (item.zi.length) {
//             const ziRoutes = item.zi
//             pathR += ziRoutes[0].auth_a
//             // console.log(pathR, 'pathR00')
//           }
//         } else {
//           pathR += 'index'
//           console.log(pathR)
//         }
//       }
//     })
//   }
// }

const hardwareRouter = {
  path: '/hardware',
  component: Layout,
  hidden: false,
  name: 'hardware',
  redirect: '/hardware/SetParamss',
  meta: {
    title: '硬件管理',
    icon: 'yjgl',
    auth_id: 63,
    isToken: true
  },
  children: [
    {
      path: 'SetParamss',
      hidden: true,
      name: 'SetParamss',
      component: () => import('@/views/ParkSystem/HardWare/SetParamss/index'),
      meta: { title: '参数设置', auth_id: 206, isToken: true }
    },


    {
      path: 'PastSets',
      hidden: true,
      name: 'PastSets',
      component: () => import('@/views/ParkSystem/HardWare/PastSets/index'),
      meta: { title: '门岗管理', auth_id: 207, isToken: true }
    },

    {
      path: 'CameraManages',
      hidden: true,
      name: 'CameraManages',
      component: () => import('@/views/ParkSystem/HardWare/CameraManages/index'),
      meta: { title: '摄像头管理', auth_id: 208, isToken: true }
    },
    {
      path: 'InSet',
      hidden: true,
      name: 'InSet',
      component: () => import('@/views/ParkSystem/HardWare/InSet/index'),
      meta: { title: '内场参数设置', auth_id: 209, isToken: true }
    },

  ]
}
export default hardwareRouter
