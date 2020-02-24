import Layout from '@/layoutpk'

const incomeRouter = {
  path: '/incomestatic/index',
  component: Layout,
  hidden: false,
  name: 'incomestatic',
  meta: {
    title: '收入统计',
    icon: 'srtj',
    auth_id: 54
  }
  // children: [
  //   {
  //     path: 'index',
  //     hidden: true,
  //     component: () => import('@/views/income/index')
  //   }
  // ]
}
export default incomeRouter
