import request from '@/utils/request'
import QS from 'qs'
// 查询人脸审核数据
export function postSelect_faceList (data) {
  return request({
    url: '/property/Home/select_faceList',
    method: 'post',
    data
  })
}
//获取人脸审核数量
export function postSelect_count (data) {
  return request({
    url: '/property/Home/fetch_count',
    method: 'post',
    data
  })
}
//搜索的数据
export function postSearchSelect (data) {
  return request({
    url: '/property/Home/searchSelect',
    method: 'post',
    data
  })
}
//查看人脸是否上传成功
export function postSelect_list (data) {
  return request({
    url: 'property/Home/Select_list',
    method: 'post',
    data
  })
}
//拒绝
export function postRefuseSelect (data) {
  return request({
    url: '/property/Home/RefuseSelect',
    method: 'post',
    data
  })
}
//同意
export function postToexamine_list (data) {
  return request({
    url: '/property/Home/toexamine_list',
    method: 'post',
    data
  })
}
//判断参数设置状态
export function parkState (data) {
  return request({
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: 'park/v1.common/run',
    method: 'post',
    data: QS.stringify(data)
  })
}