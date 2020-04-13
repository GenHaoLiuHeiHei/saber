import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/blade-customer/sensitive/list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/blade-customer/sensitive/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const update = (row) => {
  return request({
    url: '/api/blade-customer/sensitive/update',
    method: 'post',
    data: row
  })
}

