import Layout from '@/layout'
// 门禁路由表
// var pathR = '/entranceGuard/'
// const lists = JSON.parse(localStorage.getItem('RouterLists'))
// if (lists) {
//   const routerLists = lists
//   if (routerLists) {
//     routerLists.forEach(item => {
//       if (item.auth_name === '门禁管理') {
//         // console.log(item, '门禁管理')
//         if (item.zi) {
//           if (item.zi.length) {
//             const ziRoutes = item.zi
//             pathR += ziRoutes[0].auth_a
//           }
//         } else {
//           pathR += 'index'
//           // console.log(pathR, "1111111111111111111111111111")
//         }
//       }
//     })
//   }
// }
const entranceRouter = {
  path: '/entranceGuard',
  component: Layout,
  name: 'entranceGuard',
  redirect: '/entranceGuard/communitygate',
  meta: {
    title: '门禁管理',
    icon: 'door1',
    auth_id: 50,
    isReload: true,
    isToken: true
  },
  children: [
    {
      path: 'communitygate',
      name: 'communitygate',
      hidden: true,
      // component:() => import('@/views/WySystem/Account/Jurisdiction/EditAccount'),
      component: () => import('@/views/WySystem/EntranceGuard/CommunityGate/index'),
      meta: { title: '小区大门', auth_id: 51, isReload: true, isToken: true }
    },
    {
      path: 'BuildDoor',
      name: 'BuildDoor',
      hidden: true,
      component: () => import('@/views/WySystem/EntranceGuard/BuildDoor/index'),
      meta: { title: '楼栋单元门', auth_id: 51, isReload: true, isToken: true }
    }
  ]
}
export default entranceRouter
