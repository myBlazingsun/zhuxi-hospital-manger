import request from '@/utils/request'

export function getEmailList(params) {
  return request({
    url:'/backstage/dean-mailbox/list',
    method:'get',
    params:params
  })
}
export function updateEmailStatus(params) {
  return request({
    url: '/backstage/dean-mailbox/batch/edit-status',
    method: 'post',
    params,
    headers: {
      'content-type' : 'application/x-www-form-urlencoded'
    }
  })
}


export function auditEmail(id, data) {
  return request({
    url: `/backstage/dean-mailbox/update/${id}`,
    method: 'post',
    data,
  })
}

export function getEmailDetail(id) {
  return request({
    url:`/backstage/dean-mailbox/${id}`,
    method:'get',
  })
}
