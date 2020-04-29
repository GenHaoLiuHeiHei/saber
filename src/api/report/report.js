import request from '@/router/axios';
// 未处理博文违规列表
export const dynamic_report = (current, size, params) => {
  return request({
    url: '/api/blade-blog/bloginform/list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}
// 未处理书籍违规列表
export const outstanding_report = (current, size, params) => {
  return request({
    url: '/api/blade-book/bookinform/list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}
// 已处理书籍违规列表
export const report_processed = (current, size, params) => {
  return request({
    url: '/api/blade-book/bookcomentinform/report_processed',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}

// 书籍举报详情
export const bookUpdatelist = (relateId) => {
  return request({
    url: '/api/blade-book/bookinform/updatelist',
    method: 'get',
    params: {
      relateId
    }
  })
}
// 动态举报详情
export const blogUpdatelist = (relateId) => {
  return request({
    url: '/api/blade-blog/bloginform/updatelist',
    method: 'get',
    params: {
      relateId
    }
  })
}

// 书籍违规处理
export const book_handle_report = (row) => {
  return request({
    url: '/api/blade-book/bookinform/update',
    method: 'post',
    data: row
  })
}

// 动态违规处理
export const blog_handle_report = (row) => {
  return request({
    url: '/api/blade-blog/bloginform/update',
    method: 'post',
    data: row
  })
}


export const getDetail = (id) => {
  return request({
    url: '/api/blade-book/bookcomentinform/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/blade-book/bookcomentinform/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/blade-book/bookcomentinform/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/blade-book/bookcomentinform/submit',
    method: 'post',
    data: row
  })
}

