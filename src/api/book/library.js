import request from '@/router/axios';

// 字典---是否完结
export const getIsOver = () => {
  return request({
    url: '/api/blade-system/dict/dictionary?code=bookIsOver',
    method: 'get'
  })
}

// 字典---排序
export const getPromote = () => {
  return request({
    url: '/api/blade-system/dict/dictionary?code=bookPromote',
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



