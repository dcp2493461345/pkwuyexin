import request from '@/utils/requestPk'
import QS from 'qs'
//硬件管理
// ++++++++++++++++++++++++++++++++++
// 查询门岗列表
export function postDoorList (data) {
  // console.log(data,'doorlist需要的参数')
  return request({
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/park/v1.door/door_list',
    method: 'post',
    data: QS.stringify(data)
  })
}
//新增门岗
export function postDoorAdd (data) {

  return request({
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/park/v1.door/door_add',
    method: 'post',
    data: QS.stringify(data)
  })
}

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//参数设置
export function postSettingadd (data) {
  return request({
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/park/v1.setting/setting_add',
    method: 'post',
    data: QS.stringify(data)
  })
}
// 修改++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//主副停车场参数输出
export function postSetInfo (data) {
  // console.log(data, '修改摄像头状态小串的参数')
  return request({
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/park/v1.setting/setInfo',
    method: 'post',
    data: QS.stringify(data)
  })
}
//包月入口提示语言
export function postMonthly (data) {
  // console.log(data, '修改摄像头状态小串的参数')
  return request({
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/park/v1.setting/monthly',
    method: 'post',
    data: QS.stringify(data)
  })
}
//包月出口提示语言
export function postMonthlyOut (data) {
  // console.log(data, '修改摄像头状态小串的参数')
  return request({
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/park/v1.setting/monthly_out',
    method: 'post',
    data: QS.stringify(data)
  })
}
//非包月车辆入口
export function postNonMonthly (data) {
  // console.log(data, '修改摄像头状态小串的参数')
  return request({
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/park/v1.setting/non_monthly',
    method: 'post',
    data: QS.stringify(data)
  })
}
// 非包月车辆出口
export function postNonMonthlyOut (data) {
  // console.log(data, '修改摄像头状态小串的参数')
  return request({
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/park/v1.setting/non_monthly_out',
    method: 'post',
    data: QS.stringify(data)
  })
}
//修改停车场(修改全部)
export function postSetupdateAll (data) {
  // console.log(data, '修改摄像头状态小串的参数')
  return request({
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/park/v1.setting/setting_update',
    method: 'post',
    data: QS.stringify(data)
  })
}
//基础设置修改
export function postSetupdateBasis (data) {
  // console.log(data, '修改摄像头状态小串的参数')
  return request({
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/park/v1.setting/basis',
    method: 'post',
    data: QS.stringify(data)
  })
}
//开闸管理修改
export function postSetupdateBrake (data) {
  // console.log(data, '修改摄像头状态小串的参数')
  return request({
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/park/v1.setting/brake',
    method: 'post',
    data: QS.stringify(data)
  })
}
// 收费修改
export function postSetupdatePrice (data) {
  // console.log(data, '修改摄像头状态小串的参数')
  return request({
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/park/v1.setting/park_priceset',
    method: 'post',
    data: QS.stringify(data)
  })
}
//led设置修改
export function postSetupdateLed (data) {
  // console.log(data, '修改摄像头状态小串的参数')
  return request({
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/park/v1.setting/led_update',
    method: 'post',
    data: QS.stringify(data)
  })
}
// 以上为参数修改修改++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//摄像头列表
export function postCameraList (data) {
  // console.log(data, '摄像头列表response的参数')
  return request({
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/park/v1.door/camera_list',
    method: 'post',
    data: QS.stringify(data)
  })
}
//添加摄像头里面的门岗数据
export function postDoorListId (data) {
  return request({
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/park/v1.door/door_list_info',
    method: 'post',
    data: QS.stringify(data)
  })
}
//新增摄像头
export function postCamerAdd (data) {
  // console.log(data, '添加摄像头的参数')
  return request({
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/park/v1.door/camer_add',
    method: 'post',
    data: QS.stringify(data)
  })
}
//启用摄像头
//禁用摄像头
export function postCamerType (data) {
  // console.log(data, '修改摄像头状态小串的参数')
  return request({
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/park/v1.door/camera_type',
    method: 'post',
    data: QS.stringify(data)
  })
}
//修改摄像头输出
export function postCameraUpdate (data) {
  // console.log(data, '修改摄像头状态小串的参数')
  return request({
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/park/v1.door/camera_update',
    method: 'post',
    data: QS.stringify(data)
  })
}
//修改摄像头
export function postCamer_update_batch (data) {
  // console.log(data, '修改摄像头状态小串的参数')
  return request({
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/park/v1.door/camer_update_batch',
    method: 'post',
    data: QS.stringify(data)
  })
}
//传入二维码
export function postCameraCode (data) {
  // console.log(data, '修改摄像头状态小串的参数')
  return request({
    headers: {
      'Content-Type': 'multipart/form-data;'
    },
    url: '/park/v1.door/camer_code',
    method: 'post',
    data
  })
}
//副参数列表输出
export function postBindingCar (data) {
  // console.log(data, '修改摄像头状态小串的参数')
  return request({
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/park/v1.setting/binding_car',
    method: 'post',
    data: QS.stringify(data)
  })
}
//绑定停车场参数输出
export function postBindingInfo (data) {
  console.log(data, '绑定摄像头状态小串的参数')
  return request({
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/park/v1.setting/binding_info',
    method: 'post',
    data: QS.stringify(data)
  })
}
// /停车场参数绑定
export function postBindingInfoBach (data) {
  console.log(data, '绑定摄像头状态小串的参数')
  return request({
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/park/v1.setting/binding_info_batch',
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
//新增特殊车辆
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
//特殊车辆列表
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
//修改特殊车辆
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
//删除
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
//搜索
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
//启用和禁用
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
//车位类型下拉列表
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
//添加车位
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
//获取车位列表
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
//确认导入
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
//普通修改
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
//申请修改
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
//验证车位号
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
//车位搜索
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
//审核列表
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
//审核详情
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
//同意拒绝审核
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
//车位详情
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
////摄像头分类
export function parkcamer_code_xiala (data) {
  return request({
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/park/v1.door/camer_code_xiala',
    method: 'post',
    data: QS.stringify(data)
  })
}