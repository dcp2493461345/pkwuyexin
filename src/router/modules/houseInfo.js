import Layout from '@/layout'
const HouseDetails = () => import('@/views/WySystem/House/HouseDetails/index')
const HouseTypes = () => import('@/views/WySystem/House/HouseTypes/index')
const AuditChanges = () => import('@/views/WySystem/House/AuditChanges/index')
// 房屋信息路由列表
const houseInfoRouter = {
  path: '/house',
  component: Layout,
  name: 'house',
  redirect: '/house/HouseDetails',
  meta: {
    title: '房屋信息',
    icon: 'house3',
    auth_id: 2,
    isReload: true,
    isToken: true
  },
  children: [
    {
      path: 'HouseDetails',
      name: 'HouseDetails',
      hidden: true,
      component: HouseDetails,
      // redirect: 'house/HouseDetails',
      meta: { title: '房屋详情', auth_id: 3, isReload: true, isToken: true }
    },
    {
      path: 'HouseTypes',
      name: 'HouseTypes',
      hidden: true,
      component: HouseTypes,
      meta: { title: '房屋类型', auth_id: 4, isReload: true, isToken: true }
    },

    {
      path: 'AuditChanges',
      name: 'AuditChanges',
      hidden: true,
      component: AuditChanges,
      meta: { title: '审核列表', auth_id: 5, isReload: true, isToken: true }
    }
  ]
}
export default houseInfoRouter
