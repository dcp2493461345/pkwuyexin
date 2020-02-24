// eslint-disable-next-line no-unused-vars
// import createPersistedState from 'vuex-persistedstate'
const state = {
  userInfo: JSON.parse(localStorage.getItem('userInfo')) || '',
  userInfoData: JSON.parse(localStorage.getItem('replcaeData')) || '',
  isWyCover2: false,
  hasWyCover1: false,
  isWyCoverAll: false,
  setMealInfo: {},
  setYearInfo: {},
  setQrInfo: {},
  // 提示小区还有多久到期
  dueToTheTime: null,
  secondRouterLists: [],
  uid: null,//用户uid
  amg: null,//判断是否加蒙层
  dueTotime: null,//到期时间
  Setmeal_id: null,//套餐ID
  Setmeal_name: '',//套餐名称
}
export default state
