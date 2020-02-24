import Layout from '@/layoutpk'

const qrcodeChargeRouter = {
  path: '/qrcodeCharge/index',
  component: Layout,
  hidden: false,
  name: 'qrcodeCharge',
  meta: {
    title: '二维码收费管理',
    icon: 'cooper3',
    auth_id: 57
  }
  // children: [
  //   {
  //     path: 'index',
  //     hidden: true,
  //     component: () => import('@/views/income/index')
  //   }
  // ]
}
export default qrcodeChargeRouter
