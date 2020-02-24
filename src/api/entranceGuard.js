import request from '@/utils/request'
// 门禁管理
// // 查询权限
// export function postAddto(data) {
//   const { Communityid, page = 1, sition } = data
//   return request.get(`/index/Jurisdiction/addto?page=${page}&sition=${sition}&Communityid=${Communityid}`)
// }

// 查询小区大门门禁
export function postGateSelect (data) {
  return request({
    url: '/property/Access/gateSelect',
    method: 'post',
    data
  })
}
// 添加小区大门门禁

export function postGateInsert (data) {
  return request({
    url: '/property/Access/gateInsert',
    method: 'post',
    data
  })
}
// 删除
export function postGateDelete (data) {
  return request({
    url: '/property/Access/gateDelete',
    method: 'post',
    data
  })
}
// 搜索
export function postGateSearch (data) {
  return request({
    url: '/property/Access/gateSearch',
    method: 'post',
    data
  })
}
// 修改
export function postGateUpdate (data) {
  return request({
    url: '/property/Access/gateUpdate',
    method: 'post',
    data
  })
}
// 第二模块
// 查询单元门禁
export function postUnitSelect (data) {
  return request({
    url: '/property/Access/unitSelect',
    method: 'post',
    data
  })
}
// 查询楼栋
export function postUnitStoried (data) {
  return request({
    url: '/property/Access/unitStoried',
    method: 'post',
    data
  })
}
// 查询单元
export function postUnitSingle (data) {
  return request({
    url: '/property/Access/unitSingle',
    method: 'post',
    data
  })
}
// 添加单元门门禁
export function postUnitInsert (data) {
  return request({
    url: '/property/Access/unitInsert',
    method: 'post',
    data
  })
}
// 修改单元门门禁
export function postUnitUpdate (data) {
  return request({
    url: '/property/Access/unitUpdate',
    method: 'post',
    data
  })
}
// 删除单元门门禁
export function postUnitDelete (data) {
  return request({
    url: '/property/Access/unitDelete',
    method: 'post',
    data
  })
}
// 搜索单元门门禁
export function postUnitSearch (data) {
  return request({
    url: '/property/Access/unitSearch',
    method: 'post',
    data
  })
}