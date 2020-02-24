const mutations = {
  setUserInfo: (state, info) => {
    state.userInfo = info
  },
  removeUserInfo: (state) => {
    state.userInfo = ''
    console.log(state, 'removeUserInforemoveUserInfo')
  },
  isWyCover1: (state) => {
    state.hasWyCover1 = !state.hasWyCover1
  },
  isWyCover2: (state) => {
    state.hasWyCover2 = !state.hasWyCover2
  },
  isWyCoverAll: (state) => {
    state.hasWyCoverAll = !state.hasWyCoverAll
  },
  replaceUserInfoData: (state, dataInfo) => {
    state.userInfo.data = dataInfo
    // console.log('state.userInfo.data is' + JSON.stringify(state.userInfo.data))
  },
  replaceUserInfoList: (state, listInfo) => {
    state.userInfo.list = listInfo
    // console.log('state.userInfo.data is' + JSON.stringify(state.userInfo.data))
  },
  setMealInfoHandler: (state, mealInfo) => {
    state.setMealInfo = mealInfo
  },
  setYearInfo: (state, yearInfo) => {
    state.setYearInfo = yearInfo
  },
  // 存储二维码
  setQrInfoHandler: (state, qrInfo) => {
    // console.log(qrInfo)
    state.setQrInfo = qrInfo
  },
  // 到期时间存储
  setDueToTheTime: (state, timeInfo) => {
    state.dueToTheTime = timeInfo
  },
  // 生成二级路由
  setRouterAsync: (state, routerInfo) => {
    state.secondRouterLists = routerInfo
  },
  // 清空二级路由
  clearRouterAsync: (state) => {
    state.secondRouterLists = null
  },
  //存用户id，resp.msg.uid
  uidHandler: (state, id) => {
    state.uid = id
  },
  //传蒙层，到期时间
  amgHandler: (state, info) => {
    console.log(info, 'resp.msg777777')
    state.amg = info.amg
    state.dueTotime = info.time
  },
  //蒙层值改变，再次创建不会出现created
  changeamgHandler: (state, data) => {
    state.amg = data
  },
  //改变套餐ID
  changeSetmeal_id: (state, data) => {
    state.Setmeal_id = data
  },
  //改变套餐名称
  changeSetmeal_name: (state, data) => {
    state.Setmeal_name = data
  },
}
export default mutations
