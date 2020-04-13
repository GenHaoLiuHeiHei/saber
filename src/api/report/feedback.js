import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/blade-customer/feedback/list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}


export const update = (row) => {
  return request({
    url: '/api/blade-customer/feedback/update',
    method: 'post',
    data: row
  })
}

export const save = (row) => {
  return request({
    url: '/api/blade-customer/reply/save',
    method: 'post',
    data: row
  })
}

