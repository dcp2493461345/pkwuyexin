import Layout from '@/layoutpk'
// import store from '@/store'
// console.log(store, '56565656565')
// 帐号分配路由列表
// var pathR = '/accountpk/'
// const lists = JSON.parse(localStorage.getItem('RouterLists'))
// if (lists) {
//   const routerLists = lists
//   if (routerLists) {
//     routerLists.forEach(item => {
//       if (item.auth_name === '帐号分配') {
//         if (item.zi) {
//           if (item.zi.length) {
//             const ziRoutes = item.zi
//             pathR += ziRoutes[0].auth_a
//             console.log(pathR, 'pathRpathRpathRpathR')
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
  path: '/accountpk',
  component: Layout,
  name: 'accountpk',
  redirect: '/accountpk/Jurisdiction1/EditAccount',
  meta: {
    title: '帐号分配',
    icon: 'account3',
    auth_id: 6,
    isReload: true,
    isToken: true
  },
  children: [
    {
      path: 'Jurisdiction1/EditAccount',
      name: 'Jurisdiction1',
      hidden: true,
      component: () => import('@/views/ParkSystem/Account/Jurisdiction/EditAccount.vue'),
      meta: { title: '权限管理', auth_id: 7, isReload: true, isToken: true },
    },
    {
      path: 'AccountManage1',
      name: 'AccountManage1',
      hidden: true,
      component: () => import('@/views/ParkSystem/Account/AccountManage/index'),
      meta: { title: '帐号管理', auth_id: 8, isReload: true, isToken: true }
    },
    {
      path: 'AccountAudit1',
      name: 'AccountAudit1',
      hidden: true,
      component: () => import('@/views/ParkSystem/Account/AccountAudit/index'),
      meta: { title: '帐号审核', auth_id: 9, isReload: true, isToken: true }
    }
  ]
}
export default accountInfoRouter
