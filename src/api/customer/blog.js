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
// 根据评论ID修改评论状态
export const update_comment = (row) => {
  return request({
    url: '/api/blade-book/bookcomment/update_comment',
    method: 'post',
    data: row
  })
}

// 根据博文ID修改评论状态
export const update_blogLost_comment = (row) => {
  return request({
    url: '/api/blade-blog/blogcomment/editstatus',
    method: 'post',
    data: row
  })
}

//  根据博文ID获取评论
export const getCommentList = (current, size, blogId, params) => {
  return request({
    url: '/api/blade-blog/blogcomment/page_by_blog',
    method: 'get',
    params: {
      ...params,
      current,
      size,
      blogId
    }
  })
}
//根据博文ID获取博文违规评论
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

//违规评论(博文中的)----删除
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

// 获取所有图片列表
export const getImgList = (current, size, id) => {
  return request({
    url: '/api/blade-blog/blog/getPicture',
    method: 'get',
    params: {
      current,
      size,
      id
    }
  })
}

// 获取所有书籍列表
export const getBookList = (current, size, authorId) => {
  return request({
    url: '/api/blade-book/booklibrary/list',
    method: 'get',
    params: {
      current,
      size,
      authorId
    }
  })
}

// 获取所有视频列表
export const getVideoList = (current, size, id) => {
  return request({
    url: '/api/blade-blog/blog/getVideo',
    method: 'get',
    params: {
      current,
      size,
      id
    }
  })
}