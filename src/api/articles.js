import request from '@/utils/request'


export function fetchArticlesList(params) {
  return request({
    url:'/brand-news/list',
    method:'get',
    params:params
  })
}

export function getArticlesById(id) {
  return request({
    url:`/brand-news/${id}`,
    method:'get',
  })
}