const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => {
    return state.userInfo ? state.userInfo.token : null
  }
}
export default getters
