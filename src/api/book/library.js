import request from '@/router/axios';

// 字典---是否完结
export const getIsOver = () => {
  return request({
    url: '/api/blade-system/dict/dictionary?code=bookIsOver',
    method: 'get'
  })
}
// 字典---博文排序
export const getBlogSort = () => {
  return request({
    url: '/api/blade-system/dict/dictionary?code=blogSort',
    method: 'get'
  })
}
// 字典---书籍排序
export const getPromote = () => {
  return request({
    url: '/api/blade-system/dict/dictionary?code=bookPromote',
    method: 'get'
  })
}
// 字典---违规
export const getViolation = () => {
  return request({
    url: '/api/blade-system/dict/dictionary?code=violation',
    method: 'get'
  })
}
// 字典---不友善
export const getUnfriendly = () => {
  return request({
    url: '/api/blade-system/dict/dictionary?code=unfriendly',
    method: 'get'
  })
}
// 字典---收费模式
export const getTollMode = () => {
  return request({
    url: '/api/blade-system/dict/dictionary?code=bookTollMode',
    method: 'get'
  })
}

// 获取书库列表
export const getList = (current, size, isPutaway, params) => {
  let url = '/api/blade-book/booklibrary/page';
  if (JSON.stringify(params) !=="{}") {
    url = '/api/blade-book/booklibrary/search'
  }
  return request({
    url,
    method: 'get',
    params: {
      ...params,
      isPutaway,
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
    url: '/api/blade-book/chapter/save_chapter',
    method: 'post',
    data: row
  })
}

// 修改章节
export const chapTerUpdate = (row) => {
  return request({
    url: '/api/blade-book/chapter/save',
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

// 评论用户
export const get_violation_book_list = (current, size, id, params) => {
  return request({
    url: '/api/blade-book/bookviolation/book_list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
      id
    }
  })
}

