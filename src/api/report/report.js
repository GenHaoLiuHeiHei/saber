import request from '@/router/axios';

// 未处理违规列表
export const outstanding_report = (current, size, params) => {
  return request({
    url: '/api//blade-book/bookcomentinform/outstanding_report',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}
// 已处理违规列表
export const report_processed = (current, size, params) => {
  return request({
    url: '/api//blade-book/bookcomentinform/report_processed',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}
// 违规处理
export const handle_report = (row) => {
  return request({
    url: '/api/blade-book/bookcomentinform/handle_report',
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

