import request from '@/utils/request'
import QS from 'qs'
// 创建收费项目列表
export function chargeList (data) {
    return request({
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      url: '/property/Fees/select_fees',
      method: 'post',
      data: QS.stringify(data)
    })
  }
  // 添加收费项目列表
export function addcharge (data) {
    return request({
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      url: '/property/Fees/insert_fees',
      method: 'post',
      data: QS.stringify(data)
    })
  }
    // 删除收费项目列表
export function removelist (data) {
    return request({
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      url: '/property/Fees/delect_fees',
      method: 'post',
      data: QS.stringify(data)
    })
  }
      // 修改收费项目列表
export function xiugaixm (data) {
  return request({
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/property/Fees/updelet_fees',
    method: 'post',
    data: QS.stringify(data)
  })
}
      // 收费列表
      export function shoufeiList (data) {
        return request({
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          url: '/property/Paylist/select_arrears',
          method: 'post',
          data: QS.stringify(data)
        })
      }
    // 押金名称
    export function namedeposit (data) {
      return request({
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        url: '/property/Paylist/Pay_Service',
        method: 'post',
        data: QS.stringify(data)
      })
    }
  // 房屋信息
  export function Housing (data) {
    return request({
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      url: '/property/Paylist/select_list',
      method: 'post',
      data: QS.stringify(data)
    })
  } 
    // 添加押金账单
    export function Addyajin (data) {
      return request({
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        url: '/property/Paylist/deposit_list',
        method: 'post',
        data: QS.stringify(data)
      })
    } 
        // 删除订单
        export function removedingdan (data) {
          return request({
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            url: '/property/Paylist/delete_list',
            method: 'post',
            data: QS.stringify(data)
          })
        } 