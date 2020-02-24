export const createRoutes = (arr) => {
  arr.map(item => {
    console.log(item)
    const {
      auth_a,
      auth_c,
      auth_name
    } = {
      ...item
    }
    const info = auth_a.split(',,,')

    let obj = {
      path: '/' + info[0],
      component: 'Layout',
      name: info[0],
      redirect: info[1].includes('re:') ? info[1].slice(3, -1) : '',
      meta: {
        title: auth_name,
        icon: auth_c
      }
    }

    if (item.zi !== undefined) {
      if (item.zi.zi !== undefined) {
        createRoutes(item.zi)()
      } else {
        obj = {
          ...obj,
          children: item.zi.map(unit => {
            const newArr = unit['auth_a'].split(',,,')
            return {
              path: newArr[0],
              name: newArr[0],
              hidden: true,
              component: newArr[1].includes('path:') ? import(`@/views${newArr[1].slice(5, -1)}/index`) : '',
              meta: {
                title: unit.auth_name
              }
            }
          })
        }
      }
    }
    // if(item.zi.zi !== undefined) {
    //   createRoutes
    // }
    return obj
  })
}
