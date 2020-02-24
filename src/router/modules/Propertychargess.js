import Layout from '@/layout'

const Propertychargess = {
  path: '/Propertycharge',
  hidden: false,
  component: Layout,
  name: 'Propertycharge',
  redirect: '/Propertycharge/Createcharging',
  meta: {
    title: '物业收费',
    icon: 'wycharge3',
    auth_id: 87,
    isReload: true,
    isToken: true
  },
  children: [
    {
      path: 'wycharge',
      name: 'wycharge',
      hidden: true,
      component: () => import('@/views/WySystem/Propertycharge/wycharge/index'),
      meta: { title: '收费', auth_id: 90, isReload: true, isToken: true }
    },
    {
      path: 'Createcharging',
      name: 'Createcharging',
      hidden: true,
      component: () => import('@/views/WySystem/Propertycharge/Createcharging/index'),
      meta: { title: '创建收费项目', auth_id: 88, isReload: true, isToken: true }
    }
    
  ]
}
export default Propertychargess
