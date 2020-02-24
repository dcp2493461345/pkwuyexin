import request from '@/utils/request'
// 账号分配（停车场）
// 查询权限
export function postAddto (data) {
  const { Communityid, page = 1, sition } = data
  return request.get(`/index/Jurisdiction/addto?page=${page}&sition=${sition}&Communityid=${Communityid}`)
}

// 查询按钮权限
export function postSelect_button (data) {
  return request({
    url: '/park/v1.Auth/select_button',
    method: 'post',
    data
  })
}

//查询权限列表数据
export function postSelect_list (data) {
  return request({
    url: '/park/v1.Auth/select_list',
    method: 'post',
    data
  })
}
//查询权限组
export function postSelect_jurisdiction (data) {
  return request({
    url: '/park/v1.Auth/select_jurisdiction',
    method: 'post',
    data
  })
}
//添加权限
export function postSelect_add (data) {
  return request({
    url: '/park/v1.Auth/select_add',
    method: 'post',
    data
  })
}
//查询职位是否存在
export function postSelect_add_list (data) {
  return request({
    url: '/park/v1.Auth/select_add_list',
    method: 'post',
    data
  })
}
//删除权限
export function postDelete_list (data) {
  return request({
    url: '/park/v1.Auth/delete_list',
    method: 'post',
    data
  })
}
//修改查询职位是否存在
export function postUpdete_add_list (data) {
  return request({
    url: '/park/v1.Auth/updete_add_list',
    method: 'post',
    data
  })
}
//修改权限
export function postUpdete_list (data) {
  return request({
    url: '/park/v1.Auth/updete_list',
    method: 'post',
    data
  })
}
//查询用户
export function postSelect_user (data) {
  return request({
    url: 'park/v1.user/select_user',
    method: 'post',
    data
  })
}
//查询权限
export function postSelect_jurisdiction1 (data) {
  return request({
    url: 'park/v1.user/select_jurisdiction',
    method: 'post',
    data
  })
}
// 添加用户
export function postInsert_add (data) {
  return request({
    url: 'park/v1.user/insert_add',
    method: 'post',
    data
  })
}
//修改用户
export function postUpdete_list1 (data) {
  return request({
    url: 'park/v1.user/updete_list',
    method: 'post',
    data
  })
}
//冻结用户
export function postfrozen_list (data) {
  return request({
    url: 'park/v1.user/frozen_list',
    method: 'post',
    data
  })
}
//删除用户
export function postdelete_list (data) {
  return request({
    url: 'park/v1.user/delete_list',
    method: 'post',
    data
  })
}
//搜索用户
export function postSearch_list (data) {
  return request({
    url: 'park/v1.user/search_list',
    method: 'post',
    data
  })
}
//查询审核账号
export function postToexamine_list (data) {
  return request({
    url: 'park/v1.user/toexamine_list',
    method: 'post',
    data
  })
}
//同意审核
export function postToexamine_add (data) {
  return request({
    url: 'park/v1.user/toexamine_add',
    method: 'post',
    data
  })
}
//拒绝审核
export function postToexamine_test (data) {
  return request({
    url: 'park/v1.user/toexamine_test',
    method: 'post',
    data
  })
}