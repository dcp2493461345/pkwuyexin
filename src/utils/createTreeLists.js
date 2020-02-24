// import routerMap from '../utils/routerMap'
// export const createRoute = (authList) => {
//   const list = []
//   let childrenList = []
//   routerMap.map(mapItem => {
//     authList.forEach(listItem => {
//       if (mapItem.meta && mapItem.meta.auth_id && mapItem.meta.auth_id === listItem.auth_id) {
//         console.log(listItem.children, 'children')
//         if (listItem.children && listItem.children.length > 0) {
//           childrenList = createRoute(listItem.children)
//         }
//         list.push({
//           ...mapItem,
//           meta: { ...mapItem.meta, ...listItem },
//           children: childrenList
//         })
//       }
//     })
//   })
//   return list
// }
export function createTreeLists(arr) {
  console.log(arr, '后端传来的需要被转换的数据')
  return arr.map(item => {
    // console.log(item)
    const {
      id,
      label
    } = {
      ...item
    }

    let obj = {
      id: id,
      label: label
    }
    // console.log(obj)
    if (item.children !== undefined) {
      // console.log(item.children)
      // if (item.children.children !== undefined) {
      //   createTreeLists(item.children)()
      //   // console.log(obj)
      // }
      item.children.map(item => {
        // console.log(item, '454545')
        // createTreeLists(item)()
        if (item.children !== undefined) {
          obj = {
            ...obj,
            children: item.children.map(unit => {
              return {
                id: unit.id,
                label: unit.label
              }
            })
          }
        }
        return obj
      })
      obj = {
        ...obj,
        children: item.children.map(unit => {
          return {
            id: unit.id,
            label: unit.label
          }
        })
      }
    }
    // console.log(obj, 'listsTree54')
    return obj
  })
  // return obj
}

