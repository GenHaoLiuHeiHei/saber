import request from '@/router/axios';

export const get_blogger_list = (current, size, params) => {
  return request({
    url: '/api/blade-customer/customer/get_blogger_list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}
export const getList = (current, size, params) => {
  return request({
    url: '/api/blade-customer/customer/get_list',
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
    url: '/api/blade-customer/customer/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/blade-customer/customer/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/blade-customer/customer/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/blade-customer/customer/submit',
    method: 'post',
    data: row
  })
}

export const getHoardList = (current, size, id, params) => {
  return request({
    url: '/api/blade-customer/hoard/get_Page',
    method: 'get',
    params: {
      ...params,
      current,
      size,
      id,
      hoardType: 1
    }
  })
}

export const getLikeList = (current, size, id, params) => {
  return request({
    url: '/api/blade-customer/likein/get_Page',
    method: 'get',
    params: {
      ...params,
      current,
      size,
      id
    }
  })
}

export const getCommentList = (current, size, id, params) => {
  return request({
    url: '/api/blade-customer/comment/get_Page',
    method: 'get',
    params: {
      ...params,
      current,
      size,
      id
    }
  })
}

// 解封
export const removeban = (row) => {
  return request({
    url: '/api/blade-customer/customer/removeban',
    method: 'post',
    data: row
  })
}

// 停封
export const remove_customer = (row) => {
  return request({
    url: '/api/blade-customer/customer/remove_customer',
    method: 'post',
    data: row
  })
}

// 通知
export const save_notice = (row) => {
  return request({
    url: '/api/blade-customer/customer/save_notice',
    method: 'post',
    data: row
  })
}

// 设置博主
export const set_blogger = (row) => {
  return request({
    url: '/api/blade-customer/customer/set_blogger',
    method: 'post',
    data: row
  })
}

// 取消博主
export const cancel_blogger = (row) => {
  return request({
    url: '/api/blade-customer/customer/cancel_blogger',
    method: 'post',
    data: row
  })
}