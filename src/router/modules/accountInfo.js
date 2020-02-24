import Layout from '@/layout'
// import store from '@/store'
// console.log(store, '56565656565')
// 帐号分配路由列表
// var pathR = '/account/'
// const lists = JSON.parse(localStorage.getItem('RouterLists'))
// // console.log(userInfoDatas, 'qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq')
// if (lists) {
//   // console.log(userInfoDatas, '路由')
//   const routerLists = lists
//   if (routerLists) {
//     routerLists.forEach(item => {
//       if (item.auth_name === '帐号分配') {
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

const accountInfoRouter = {
  path: '/account',
  component: Layout,
  name: 'account',
  redirect: '/account/Jurisdiction/EditAccount',
  meta: {
    title: '帐号分配',
    icon: 'account3',
    auth_id: 6,
    isReload: true,
    isToken: true
  },
  children: [
    {
      path: 'Jurisdiction/EditAccount',
      name: 'Jurisdiction',
      hidden: true,
      component: () => import('@/views/WySystem/Account/Jurisdiction/EditAccount.vue'),
      meta: { title: '权限管理', auth_id: 7, isReload: true, isToken: true },
    },
    {
      path: 'AccountManage',
      name: 'AccountManage',
      hidden: true,
      component: () => import('@/views/WySystem/Account/AccountManage/index'),
      meta: { title: '帐号管理', auth_id: 8, isReload: true, isToken: true }
    },
    {
      path: 'AccountAudit',
      name: 'AccountAudit',
      hidden: true,
      component: () => import('@/views/WySystem/Account/AccountAudit/index'),
      meta: { title: '帐号审核', auth_id: 9, isReload: true, isToken: true }
    }
  ]
}
export default accountInfoRouter
