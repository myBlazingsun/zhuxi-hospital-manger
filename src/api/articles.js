import request from '@/utils/request'


export function fetchArticlesList(params) {
  return request({
    url:'/backstage/content/list',
    method:'get',
    params:params
  })
}

export function getArticlesById(id) {
  return request({
    url:`/backstage/content/${id}`,
    method:'get',
  })
}

export function addArticles(data) {
  return request({
    url:`/backstage/content/add`,
    method:'post',
    data:data
  })
}

export function updateArticles(id, data) {
  return request({
    url: `/backstage/content/update/${id}`,
    method: 'post',
    data: data
  })
}

export function delArticles(params) {
  return request({
    url:`/backstage/content/batch/delete`,
    method: 'post',
    params,
    headers: {
      'content-type' : 'application/x-www-form-urlencoded'
    }
  })
}
