import Layout from '@/layout'

const cooperationRouter = {
  path: '/cooperation',
  component: Layout,
  name: 'cooperation',
  redirect: 'cooperation/EnterpriseInfo',
  meta: {
    title: '合作企业',
    icon: 'cooper3',
    auth_id: 32,
    isReload: true,
    isToken: true
  },
  children: [
    {
      path: 'EnterpriseInfo',
      name: 'EnterpriseInfo',
      hidden: true,
      component: () => import('@/views/WySystem/Cooperation/EnterpriseInfo/index'),
      meta: { title: '企业信息', auth_id: 33, isReload: true, isToken: true }
    },
    {
      path: 'CompCharge',
      name: 'CompCharge',
      hidden: true,
      redirect: '/cooperation/CompCharge/DepositList',
      component: () => import('@/views/WySystem/Cooperation/CompCharge/index'),
      meta: { title: '企业收费', auth_id: 34, isReload: true, isToken: true },
      children: [
        {
          path: 'DepositList',
          component: () => import('@/views/WySystem/Cooperation/CompCharge/DepositList/index'),
          name: 'DepositList',
          meta: { title: '押金列表', auth_id: 37, isReload: true, isToken: true }
        }
      ]
    },
    {
      path: 'ReviewList',
      name: 'ReviewList',
      hidden: true,
      component: () => import('@/views/WySystem/Cooperation/RefundList/index'),
      meta: { title: '退款列表', auth_id: 35, isReload: true, isToken: true }
    },

    {
      path: 'RefundList',
      name: 'RefundList',
      hidden: true,
      component: () => import('@/views/WySystem/Cooperation/ReviewList/index'),
      meta: { title: '审核列表', auth_id: 36, isReload: true, isToken: true }
    }
  ]
}
export default cooperationRouter
