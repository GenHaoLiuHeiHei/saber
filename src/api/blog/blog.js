
import request from '@/router/axios';

// 获取博文列表
export const getList = (current, size, blogStatus, params) => {
  return request({
    url: '/api/blade-blog/blog/list',
    method: 'get',
    params: {
      ...params,
      blogStatus,
      current,
      size,
    }
  })
}

// 获取书籍详情
export const getDetail = (id) => {
  return request({
    url: '/api/blade-book/booklibrary/detail',
    method: 'get',
    params: {
      id
    }
  })
}

// 删除书籍
export const remove = (ids) => {
  return request({
    url: '/api/blade-book/booklibrary/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

// 新增书籍
export const add = (row) => {
  return request({
    url: '/api/blade-book/booklibrary/save',
    method: 'post',
    data: row
  })
}

// 修改书籍
export const update = (row) => {
  return request({
    url: '/api/blade-book/booklibrary/update',
    method: 'post',
    data: row
  })
}

// 设置书籍
export const forceinstall = (row) => {
  return request({
    url: '/api/blade-book/booklibrary/forceinstall',
    method: 'post',
    data: row
  })
}
// 设置书籍2
export const bookInstall = (row) => {
  return request({
    url: '/api/blade-book/booklibrary/install',
    method: 'post',
    data: row
  })
}

// 上架
export const editPutaway = (row) => {
  return request({
    url: '/api/blade-book/booklibrary/putaway',
    method: 'post',
    data: row
  })
}

// 下架
export const clickSoldout = (row) => {
  return request({
    url: '/api/blade-book/booklibrary/soldout',
    method: 'post',
    data: row
  })
}

// 获取章节列表
export const getChapTerList = (current, size, id, params) => {
  return request({
    url: '/api/blade-book/chapter/selectChapterById',
    method: 'get',
    params: {
      ...params,
      id,
      current,
      size,
    }
  })
}

// 删除章节
export const chapTerRemove = (ids) => {
  return request({
    url: '/api/blade-book/chapter/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

// 新增章节
export const chapTerAdd = (row) => {
  return request({
    url: '/api/blade-book/chapter/save',
    method: 'post',
    data: row
  })
}

// 修改章节
export const chapTerUpdate = (row) => {
  return request({
    url: '/api/blade-book/chapter/update',
    method: 'post',
    data: row
  })
}

// 收藏用户
export const get_book_hoard = (current, size, id, params) => {
  return request({
    url: '/api/blade-book/bookhoard/get_book_hoard',
    method: 'get',
    params: {
      ...params,
      current,
      size,
      id
    }
  })
}

// 点赞用户
export const get_book_praise = (current, size, id, params) => {
  return request({
    url: '/api/blade-book/bookpraise/get_book_praise',
    method: 'get',
    params: {
      ...params,
      current,
      size,
      id
    }
  })
}

// 评论用户
export const get_book_comment = (current, size, id, params) => {
  return request({
    url: '/api/blade-book/bookcomment/get_book_comment',
    method: 'get',
    params: {
      ...params,
      current,
      size,
      id
    }
  })
}

