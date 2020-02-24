import request from '@/utils/request'
//登录
export function postLogin (data) {
  return request({
    url: '/come/Login/login',
    method: 'post',
    data
  })
}
//查询用户职位
export function postPosition (data) {
  return request({
    url: '/come/Position/select_position',
    method: 'post',
    data
  })
}
//查询小区是否到期
export function postCommunity (data) {
  return request({
    url: '/come/Community/select_community',
    method: 'post',
    data
  })
}
//退出登录
export function postLogout (data) {
  return request({
    url: '/come/user/Signout',
    method: 'post',
    data
  })
}
// ++++++++++++++++++++++++++++++++++++++++++++++修改密码（输入新密码）++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//
export function postUpdete (data) {
  // console.log(data, '获取找回密码的验证码1111')
  return request({
    url: '/come/Modify/modify_updete',
    method: 'post',
    data
  })
}
//找回密码
export function postRetrieve (data) {
  // console.log(data, '获取找回密码的验证码1111')
  return request({
    url: '/come/Modify/Retrieve',
    method: 'post',
    data
  })
}
// 获取验证码
export function postGetCode (data) {
  // console.log(data, '获取找回密码的验证码1111')
  return request({
    url: '/come/Modify/Code',
    method: 'post',
    data
  })
}
// 重置获取验证码
export function postGetCodes (data) {
  // console.log('重置获取验证码的参数111')
  return request({
    url: '/come/Reset/Code',
    method: 'post',
    data
  })
}
// 重置账号
export function postResetPwd (data) {
  return request({
    url: '/come/Reset/Retrieve',
    method: 'post',
    data
  })
}
// 选择小区
export function postSelect_community (data) {
  return request({
    url: '/come/Community/select_community_list',
    method: 'post',
    data
  })
}
// 按小区首字母搜索小区
export function postSelect_highest (data) {
  return request({
    url: '/come/Community/select_highest',
    method: 'post',
    data
  })
}
//查询用户进入小区权限
export function postSelect_user (data) {
  return request({
    url: '/come/User/select_user',
    method: 'post',
    data
  })
}
//菜单权限
export function postSelect_position_list (data) {
  return request({
    url: '/property/Auth/select_position_list',
    method: 'post',
    data
  })
}


