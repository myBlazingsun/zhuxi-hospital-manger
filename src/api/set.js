
import request from '@/utils/request'

export function getSetting(params) {
  return request({
    url: '/backstage/universal-set',
    method: 'get',
    params: params
  })
}


export function setSetting(data) {
  return request({
    url: '/backstage/universal-set',
    method: 'put',
    data: data,
  })
}
