import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/blade-customer/autoreply/list',
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
    url: '/api/blade-customer/autoreply/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/blade-customer/autoreply/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/blade-customer/autoreply/save',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/blade-customer/autoreply/update',
    method: 'post',
    data: row
  })
}

