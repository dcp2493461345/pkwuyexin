/**
 *
 * @param  {Array} userRouter 后台返回的用户权限json
 * @param  {Array} allRouter  前端配置好的所有动态路由的集合
 * @return {Array} realRoutes 过滤后的路由
 */

export function recursionRouter (userRouter = [], allRouter = []) {
  // console.log(userRouter, allRouter, 'jjjjjjj')
  var realRoutes = []
  allRouter.forEach((v, i) => {
    if (userRouter) {
      userRouter.forEach((item, index) => {
        // console.log(item.auth_a, v.name, 'jjjjjjj')
        if (item.auth_a === v.name) {
          if (item.zi && item.zi.length > 0) {
            v.children = recursionRouter(item.zi, v.children)
          }
          realRoutes.push(v)
        }
      })
    }
  })
  return realRoutes
}

/**
*
* @param {Array} routes 用户过滤后的路由
*
* 递归为所有有子路由的路由设置第一个children.path为默认路由
*/
export function setDefaultRoute (routes) {
  routes.forEach((v, i) => {
    if (v.children && v.children.length > 0) {
      v.redirect = { name: v.children[0].name }
      setDefaultRoute(v.children)
    }
  })
}
