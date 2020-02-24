import request from '@/utils/request'

// 查询套餐
export function postSelect_setmeal (data) {
  return request({
    url: '/come/Setmeal/select_setmeal',
    method: 'post',
    data
  })
}
//查询套餐下的年份
export function postSelect_year (data) {
  return request({
    url: '/come/Setmeal/select_year',
    method: 'post',
    data
  })
}
//微信支付(生成订单，获取支付二维码)
export function postPayment_add (data) {
  return request({
    url: '/come/Recharge/payment_add',
    method: 'post',
    data
  })
}
//查询订单状态
export function postSetmeals_select (data) {
  return request({
    url: '/come/Recharge/setmeals_select',
    method: 'post',
    data
  })
}
//关闭订单
export function postSetmeals_closeorder (data) {
  return request({
    url: '/come/Recharge/select_closeorder',
    method: 'post',
    data
  })
}
//查询票据
export function postSelect_invoice (data) {
  return request({
    url: '/come/Invoice/select_invoice',
    method: 'post',
    data
  })
}
//开票
export function postInvoice_add (data) {
  return request({
    url: '/come/Invoice/invoice_add',
    method: 'post',
    data
  })
}