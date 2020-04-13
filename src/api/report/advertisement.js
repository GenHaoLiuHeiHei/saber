import request from '@/router/axios';

export const getLoding = () => {
  return request({
    url: '/api/blade-customer/advertisement/getloding',
    method: 'get'
  })
}
export const getBanner = () => {
  return request({
    url: '/api/blade-customer/advertisement/getbanner',
    method: 'get',
  })
}

export const getDetail = (id) => {
  return request({
    url: '/api/blade-customer/advertisement/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/blade-customer/advertisement/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/blade-customer/advertisement/save',
    method: 'post',
    data: row
  })
}

// export const update = (row) => {
//   return request({
//     url: '/api/blade-customer/advertisement/submit',
//     method: 'post',
//     data: row
//   })
// }

