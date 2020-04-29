import request from '@/router/axios';

export const getList = (current, size, customerId, params) => {
  return request({
    url: '/api/blade-blog/blog/page',
    method: 'get',
    params: {
      ...params,
      current,
      size,
      customerId
    }
  })
}

export const getReportList = (current, size, relateId, params) => {
  return request({
    url: '/api/blade-blog/bloginform/list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
      relateId
    }
  })
}
// 屏蔽评论
export const update_comment = (row) => {
  return request({
    url: '/api/blade-customer/customer/update_comment',
    method: 'post',
    data: row
  })
}

// 修改博文管理中博文的评论状态 
export const update_blogLost_comment = (row) => {
  return request({
    url: '/api/blade-blog/blogcomment/editstatus',
    method: 'post',
    data: row
  })
}

//博文评论
export const getCommentList = (current, size, blogId, params) => {
  return request({
    url: '/api/blade-blog/blogcomment/page',
    method: 'get',
    params: {
      ...params,
      current,
      size,
      blogId
    }
  })
}
//博文违规评论
export const get_violation_blog_list = (current, size, id, params) => {
  return request({
    url: '/api/blade-blog/blogviolation/blog_list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
      id
    }
  })
}

//博文违规评论删除
export const blogviolation_remove = (ids) => {
  return request({
    url: '/api/blade-blog/blogviolation/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}



export const getShareList = (current, size, blogId, params) => {
  return request({
    url: '/api/blade-blog/blogforward/list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
      blogId
    }
  })
}

export const getLikeList = (current, size, blogId, params) => {
  return request({
    url: '/api/blade-blog/blogpraise/page',
    method: 'get',
    params: {
      ...params,
      current,
      size,
      blogId
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

// 博文修改状态
export const blog_editstatus = (row) => {
  return request({
    url: '/api/blade-blog/blog/editstatus',
    method: 'post',
    data: row
  })
}

