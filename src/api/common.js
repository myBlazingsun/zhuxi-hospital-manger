import request from '@/utils/request'


export function getMenuTree(id) {
  return request({
    url:`/backstage/category/list-with-child/${id || '0'}`,
    method:'get',
    headers: {
      'content-type' : 'application/x-www-form-urlencoded'
    }
  })
}