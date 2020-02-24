import request from '@/utils/request'
import QS from 'qs'
// 查询房屋类型
export function postHouseSelectType (data) {
  return request({
    url: '/property/House/select_type',
    method: 'post',
    data
  })
}
//添加房屋类型
export function postInesrt_type (data) {
  return request({
    url: '/property/House/inesrt_type',
    method: 'post',
    data
  })
}
//修改房屋类型
export function postUpdete_type (data) {
  return request({
    url: '/property/House/updete_type',
    method: 'post',
    data
  })
}
//查询房屋
export function postSelect_house (data) {
  return request({
    url: '/property/House/select_house',
    method: 'post',
    data
  })
}
//房屋查询房屋类型
export function postinsert_type1 (data) {
  return request({
    url: '/property/House/insert_type',
    method: 'post',
    data
  })
}

//添加房屋
export function postInsert_house (data) {
  return request({
    url: '/property/House/insert_house',
    method: 'post',
    data
  })
}
//添加成功后查询单个房屋
export function postSelect_single (data) {
  return request({
    url: '/property/House/select_single',
    method: 'post',
    data
  })
}
//搜索房屋
export function postSelect_search (data) {
  return request({
    url: '/property/House/select_search',
    method: 'post',
    data
  })
}
//修改房屋(修改交房时间或和备注)
export function postUpde_house (data) {
  return request({
    url: '/property/House/upde_house',
    method: 'post',
    data
  })
}
// 已交房和未交房修改房屋(修改面积等)
export function postUpdet_house (data) {
  console.log(data, '修改详情传递的参数')
  return request({
    url: '/property/House/updet_house',
    method: 'post',
    data
  })
}
//Excel导入数据库
export function postExcel_import (data) {
  return request({
    url: '/property/House/excel_import',
    method: 'post',
    data
  })
}
//申请删除房屋
export function postdetele_house (data) {
  return request({
    url: '/property/House/detele_house',
    method: 'post',
    data
  })
}
//查询审核房屋
export function postSelect_examine (data) {
  return request({
    url: '/property/House/select_examine',
    method: 'post',
    data
  })
}
//修改同意
export function postupdelet_agree (data) {
  return request({
    url: '/property/House/updelet_agree',
    method: 'post',
    data
  })
}
//删除同意
export function postdatele_list (data) {
  return request({
    url: '/property/House/datele_list',
    method: 'post',
    data
  })
}
//删除拒绝
export function postdeirte_list (data) {
  return request({
    url: '/property/House/deirte_list',
    method: 'post',
    data
  })
}
//修改拒绝
export function postupdelet_refuse (data) {
  return request({
    url: '/property/House/updelet_refuse',
    method: 'post',
    data
  })
}
//下载房屋模板第一次请求
export function postDownLoad (data) {
  return request({
    url: '/property/House/download_file',
    method: 'post',
    data
  })
}
//导入房屋
export function postDownLoadHouse (data) {
  return request({
    url: '/property/House/insert_excel',
    method: 'post',
    data,
  })
}
//下载模板第二次请求
export function postDownLoad1 (data) {
  return request({
    url: '/property/Household/download',
    method: 'post',
    data,
    responseType: 'arraybuffer'
  })
}