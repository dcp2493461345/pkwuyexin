import Layout from '@/layoutpk'

const statisticInfoRouter = {
  path: '/statisticInfo/index',
  component: Layout,
  hidden: false,
  name: 'statisticInfo',
  meta: {
    title: '统计',
    icon: 'xinxi',
    auth_id: 58
  }
  // children: [
  //   {
  //     path: 'index',
  //     hidden: true,
  //     component: () => import('@/views/ParkSystem/statisticInfo/index')
  //   }
  // ]
}
export default statisticInfoRouter
