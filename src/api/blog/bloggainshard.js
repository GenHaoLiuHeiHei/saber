import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/blade-blog/bloggainshard/page',
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
    url: '/api/blade-blog/bloggainshard/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/blade-blog/bloggainshard/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/blade-blog/bloggainshard/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/blade-blog/bloggainshard/update',
    method: 'post',
    data: row
  })
}

