import request from '@/utils/request'
// 门禁管理
// // 查询权限
// export function postAddto(data) {
//   const { Communityid, page = 1, sition } = data
//   return request.get(`/index/Jurisdiction/addto?page=${page}&sition=${sition}&Communityid=${Communityid}`)
// }

// 查询查询房主信息
export function postHouseholdSelect (data) {
  return request({
    url: '/property/Household/select_household',
    method: 'post',
    data
  })
}
// 添加住户
export function postHouseholdInsert (data) {
  return request({
    url: '/property/Household/insert_household',
    method: 'post',
    data
  })
}
// 查询Excel类容
export function postHouseExcel (data) {
  return request({
    url: '/property/Household/select_excel',
    method: 'post',
    data
  })
}
// 确认导入

export function postExcelImport (data) {
  return request({
    url: '/property/Household/excel_import',
    method: 'post',
    data
  })
}
// 上传人脸和修改人脸
export function postFace (data) {
  return request({
    url: '/property/Household/insert_face',
    method: 'post',
    data
  })
}
// 历史住户
export function postHistory (data) {
  return request({
    url: '/property/Household/select_history',
    method: 'post',
    data
  })
}
// 变更住户
export function postChange (data) {
  console.log(data, '变更住户的参数')
  return request({
    url: '/property/Household/updelet_change',
    method: 'post',
    data
  })
}
// 查看人脸是否上传成功
export function postSelect (data) {
  console.log(data, '上传人脸参数')
  return request({
    url: '/property/Household/Select_add',
    method: 'post',
    data
  })
}
// 修改住户
export function postUpdete (data) {
  console.log(data, '修改住户参数')
  return request({
    url: '/property/Household/updete_list',
    method: 'post',
    data
  })
}
//下载住户模板第一次请求
export function postDownLoad (data) {
  return request({
    url: '/property/Household/downloadFile',
    method: 'post',
    data,
  })
}
// 查看是否录入设备号
export function postFace_select (data) {
  console.log(data, '变更住户的参数')
  return request({
    url: '/property/Household/face_select',
    method: 'post',
    data
  })
}