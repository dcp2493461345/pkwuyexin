import request from '@/utils/request'
import QS from 'qs'
// 车位类型列表
export function parkList (data) {
  return request({
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/park/v1.Cartype/car_type_list',
    method: 'post',
    data: QS.stringify(data)
  })
}
// / 新增车位类型
export function addPark (data) {
  return request({
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/park/v1.Cartype/car_type_add',
    method: 'post',
    data: QS.stringify(data)
  })
}
//增加车位类型获取单条数据
export function addParkone (data) {
  return request({
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/park/v1.cartype/find_car_list',
    method: 'post',
    data: QS.stringify(data)
  })
}
// 修改车位类型
export function modifyPark (data) {
  return request({
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/park/v1.Cartype/car_type_update',
    method: 'post',
    data: QS.stringify(data)
  })
}
//车位列表模板下载
export function downloadcar (data) {
  return request({
    url: '/park/v1.Cartype/excel_download',
    method: 'post',
    data
  })
}
// 操作记录
export function operatingRecord (data) {
  return request({
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/park/v1.Cartype/record_list',
    method: 'post',
    data: QS.stringify(data)
  })
}
// 新增特殊车辆
export function addspecialcar (data) {
  return request({
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/park/v1.Cartype/vehicle_add',
    method: 'post',
    data: QS.stringify(data)
  })
}
// 特殊车辆列表
export function specialcarlist (data) {
  return request({
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/park/v1.Cartype/vehicle_list',
    method: 'post',
    data: QS.stringify(data)
  })
}
// 修改特殊车辆
export function amendcarlist (data) {
  return request({
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/park/v1.Cartype/vehicle_update',
    method: 'post',
    data: QS.stringify(data)
  })
}
// 删除
export function deletecar (data) {
  return request({
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/park/v1.Cartype/vehicle_del',
    method: 'post',
    data: QS.stringify(data)
  })
}
// 搜索
export function searchList (data) {
  return request({
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/park/v1.Cartype/vehicle_search',
    method: 'post',
    data: QS.stringify(data)
  })
}
// 启用和禁用
export function startusing (data) {
  return request({
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/park/v1.Cartype/vehicle_state',
    method: 'post',
    data: QS.stringify(data)
  })
}
// 车位类型下拉列表
export function pullList (data) {
  return request({
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/park/v1.Cartype/car_type__list',
    method: 'post',
    data: QS.stringify(data)
  })
}
// 添加车位
export function addparklist (data) {
  return request({
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/park/v1.Cartype/add_space',
    method: 'post',
    data: QS.stringify(data)
  })
}
// 获取车位列表
export function gainparklist (data) {
  return request({
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/park/v1.Cartype/park_space',
    method: 'post',
    data: QS.stringify(data)
  })
}
// 确认导入
export function addguide (data) {
  return request({
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/park/v1.Cartype/car_dao_datch',
    method: 'post',
    data: QS.stringify(data)
  })
}
// 普通修改
export function revisioncar (data) {
  return request({
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/park/v1.Cartype/car_list_update',
    method: 'post',
    data: QS.stringify(data)
  })
}
// 申请修改
export function applycar (data) {
  return request({
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/park/v1.Cartype/car_list_update_shen',
    method: 'post',
    data: QS.stringify(data)
  })
}
// 验证车位号
export function verifynumber (data) {
  return request({
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/park/v1.Cartype/house_number',
    method: 'post',
    data: QS.stringify(data)
  })
}
// 车位搜索
export function carSearch (data) {
  return request({
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/park/v1.Cartype/review_seach',
    method: 'post',
    data: QS.stringify(data)
  })
}
// 审核列表
export function auditList (data) {
  return request({
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/park/v1.Cartype/review',
    method: 'post',
    data: QS.stringify(data)
  })
}
// 审核详情
export function particulars (data) {
  return request({
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/park/v1.Cartype/agree_info',
    method: 'post',
    data: QS.stringify(data)
  })
}
// 同意拒绝审核
export function Agreetorefuse (data) {
  return request({
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/park/v1.Cartype/agree',
    method: 'post',
    data: QS.stringify(data)
  })
}
// 车位详情
export function parkdata (data) {
  return request({
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/park/v1.Cartype/car_info',
    method: 'post',
    data: QS.stringify(data)
  })
}
// 在场车位列表
export function parkingSpaces (data) {
  return request({
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/park/v1.Carpresent/car_list',
    method: 'post',
    data: QS.stringify(data)
  })
}
// 在场车辆结算输出
export function Settlement (data) {
  return request({
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/park/v1.Carpresent/settlement',
    method: 'post',
    data: QS.stringify(data)
  })
}
// 提交结算数据
export function sumbitdata (data) {
  return request({
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/park/v1.Carpresent/settlement_batch',
    method: 'post',
    data: QS.stringify(data)
  })
}
// 获取批量出场列表
export function getcomelist (data) {
  return request({
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/park/v1.Carpresent/car_out',
    method: 'post',
    data: QS.stringify(data)
  })
}
// 提交批量出场
export function sumbitcomelist (data) {
  return request({
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/park/v1.Carpresent/car_out_batch',
    method: 'post',
    data: QS.stringify(data)
  })
}
// 修改车牌号，电话
export function amendphone (data) {
  return request({
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/park/v1.Carpresent/datil_car',
    method: 'post',
    data: QS.stringify(data)
  })
}
//搜索
export function searchnewlist (data) {
  return request({
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/park/v1.Carpresent/car_seach',
    method: 'post',
    data: QS.stringify(data)
  })
}
//搜索
export function searchnewlists (data) {
  return request({
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/park/v1.Carpresent/histroy',
    method: 'post',
    data: QS.stringify(data)
  })
}
// 获取历史车位列表
export function historylist (data) {
  return request({
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/park/v1.Carpresent/history',
    method: 'post',
    data: QS.stringify(data)
  })
}
// 查看历史车辆详情
export function viewdetails (data) {
  return request({
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/park/v1.Carpresent/history_info',
    method: 'post',
    data: QS.stringify(data)
  })
}
// 修改历史车辆优惠金额
export function discounts (data) {
  return request({
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/park/v1.Carpresent/history_price',
    method: 'post',
    data: QS.stringify(data)
  })
}

// 长租车列表
export function longcarlist (data) {
  return request({
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/park/v1.Carrental/car_long_list',
    method: 'post',
    data: QS.stringify(data)
  })
}
// 长租车检查车位是否存在
export function longcarcw (data) {
  return request({
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/park/v1.Carrental/car_type',
    method: 'post',
    data: QS.stringify(data)
  })
}
// 长租车添加
export function addlongcar (data) {
  return request({
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/park/v1.Carrental/Carrentaladd',
    method: 'post',
    data: QS.stringify(data)
  })
}
// 长租车账单列表
export function longcarbill (data) {
  return request({
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/park/v1.Carrental/car_price',
    method: 'post',
    data: QS.stringify(data)
  })
}
// 长租车账单列表
export function longlistshow (data) {
  return request({
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/park/v1.Carrental/car',
    method: 'post',
    data: QS.stringify(data)
  })
}
// 删除长租车
export function dellonglist (data) {
  return request({
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/park/v1.Carrental/delelt',
    method: 'post',
    data: QS.stringify(data)
  })
}
// 长租车申请退款
export function longdrawback (data) {
  return request({
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/park/v1.Carrental/refund_price',
    method: 'post',
    data: QS.stringify(data)
  })
}
// 退款审核列表
export function Refundlist (data) {
  return request({
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/park/v1.Carrental/review',
    method: 'post',
    data: QS.stringify(data)
  })
}
// 续费解绑
export function unbundle (data) {
  return request({
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/park/v1.Carrental/car_untie',
    method: 'post',
    data: QS.stringify(data)
  })
}
// 退款审核同意拒绝
export function agreetorefuse (data) {
  return request({
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/park/v1.Carrental/review_t',
    method: 'post',
    data: QS.stringify(data)
  })
}
// 账单操作记录
export function recordList (data) {
  return request({
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/park/v1.Carrental/refund_price_jilu',
    method: 'post',
    data: QS.stringify(data)
  })
}
// 长租车搜索
export function longsearch (data) {
  return request({
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/park/v1.Carrental/sech',
    method: 'post',
    data: QS.stringify(data)
  })
}
// 长租车模板下载
export function longdownloadcar (data) {
  return request({
    url: '/park/v1.Carrental/excel_download',
    method: 'post',
    data
  })
}
// 长租车模板确认导入
export function introgression (data) {
  return request({
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/park/v1.Carrental/excle_que',
    method: 'post',
    data: QS.stringify(data)
  })
}
// 长租车续费确认
export function confirmation (data) {
  return request({
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/park/v1.Carrental/price_update',
    method: 'post',
    data: QS.stringify(data)
  })
}
// 长租车车位号选择
export function longcarcheweihao (data) {
  return request({
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/park/v1.Carrental/car_type_list_srch',
    method: 'post',
    data: QS.stringify(data)
  })
}
// 下载停车场公共模板
export function postdownloads (data) {
  return request({
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/park/v1.user/download',
    method: 'post',
    data: QS.stringify(data),
    responseType: 'arraybuffer'
  })
}
// 车位停车场选择
export function Parkingselection (data) {
  return request({
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/park/v1.Cartype/car_type',
    method: 'post',
    data: QS.stringify(data)
  })
}