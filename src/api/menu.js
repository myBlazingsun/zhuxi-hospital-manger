import request from '@/utils/request'

export function fetchList(parentId, params) {
  return request({
    url: '/menu/list/' + parentId,
    method: 'get',
    params: params
  })
}

export function deleteMenu(id) {
  return request({
    url: '/menu/delete/' + id,
    method: 'post'
  })
}

export function createMenu(data) {
  return request({
    url: '/backstage/category/add',
    method: 'post',
    data: data
  })
}

export function updateMenu(id, data) {
  return request({
    url: `/backstage/category/update/${id}`,
    method: 'post',
    data: data
  })
}


export function getMenu(id) {
  return request({
    url: '/menu/' + id,
    method: 'get',
  })
}

export function delMenu(id, params) {
  return request({
    url: `/backstage/category/delete/${id}`,
    method: 'post',
    params,
    headers: {
      'content-type' : 'application/x-www-form-urlencoded'
    }
  })
}
