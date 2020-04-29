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

// 收藏书籍
export const getHoardList = (current, size, customerId, params) => {
  return request({
    url: '/api/blade-book/bookhoard/getcustomerhoard',
    method: 'get',
    params: {
      ...params,
      current,
      size,
      customerId,
      hoardType: 1
    }
  })
}

// 点赞书籍
export const getLikeList = (current, size, customerId, params) => {
  return request({
    url: '/api/blade-book/bookpraise/getcustomerpraise',
    method: 'get',
    params: {
      ...params,
      current,
      size,
      customerId
    }
  })
}

// 点赞博文
export const getBlogLikeList = (current, size, blogId, params) => {
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
// 用户信息中违规博文
export const get_dynamic_violation_list = (current, size, customerId, params) => {
  return request({
    url: '/api/blade-blog/bloginform/page-by-relate_id',
    method: 'get',
    params: {
      ...params,
      current,
      size,
      customerId
    }
  })
}

// 评论博文
export const getBlogCommentList = (current, size, customerId, params) => {
  return request({
    url: '/api/blade-blog/blogcomment/page-by-customer',
    method: 'get',
    params: {
      ...params,
      current,
      size,
      customerId
    }
  })
}


// 点赞评论
export const getCommentList = (current, size, id, params) => {
  return request({
    url: '/api/blade-book/bookcomment/getcustomercomment',
    method: 'get',
    params: {
      ...params,
      current,
      size,
      id
    }
  })
}

// 违规用户
export const get_violation_user_list = (current, size, id, params) => {
  return request({
    url: '/api/blade-book/bookviolation/customer_list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
      id
    }
  })
}

// 修改客户表（金币等）
export const userUpdate = (row) => {
  return request({
    url: '/api/blade-customer/customer/update',
    method: 'post',
    data: row
  })
}

// 屏蔽评论----->违规
export const update_comment = (row) => {
  return request({
    url: '/api/blade-customer/customer/update_comment',
    method: 'post',
    data: row
  })
}

// 删除违规-----》不违规
export const bookviolation_remove = (ids) => {
  return request({
    url: '/api/blade-book/bookviolation/remove',
    method: 'post',
    params: {
      ids,
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
