import request from '@/utils/request'


export function getMenuTree(params) {
  return request({
    url:'/portal/home/route',
    method:'get',
    params:params
  })
}