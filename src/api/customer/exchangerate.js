import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/blade-customer/exchangerate/list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}

export const getDetail = (id) => {
  return request({
    url: '/api/blade-customer/exchangerate/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/blade-customer/exchangerate/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/blade-customer/exchangerate/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/blade-customer/exchangerate/update',
    method: 'post',
    data: row
  })
}

