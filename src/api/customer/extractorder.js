import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/blade-customer/extractorder/list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}

export const getRevenueList = (current, size, id, params) => {
  return request({
    url: '/api/blade-customer/revenue/list_byid',
    method: 'get',
    params: {
      ...params,
      current,
      size,
      id
    }
  })
}

export const getDetail = (id) => {
  return request({
    url: '/api/blade-customer/extractorder/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/blade-customer/extractorder/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/blade-customer/extractorder/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/blade-customer/extractorder/update',
    method: 'post',
    data: row
  })
}

