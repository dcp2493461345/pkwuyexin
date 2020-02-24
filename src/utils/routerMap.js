// import Layout from '../layout'
export default [
  {
    path: 'dashboard',
    name: 'dashboard',
    component: () => import('@/views/dashboard/index'),
    // meta: { title: '', icon: 'logo' }
    meta: {
      auth_id: 1,
      title: '首页',
      icon: 'hone',
      isToken: true
    }
  },
  {
    path: 'charge',
    name: 'charge',
    component: () => import('@/views/Charge/index'),
    meta: {
      auth_id: 2,
      title: '物业收费',
      icon: 'eye'
    }
  }
]
