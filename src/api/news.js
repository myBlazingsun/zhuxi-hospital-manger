import request from '@/utils/request'


/**
 * 添加
 * @param {string} content 内容 true
 * @param {string} intro 简介  true
 * @param {string} coverImg 封面图片 true
 * @param {string} createTime 时间 
 * @param {string} title 简介 true
 * @return {Promise}
 */
export function addNews(data) {
  return request({
    url:'/brand-news/add',
    method:'post',
    data
  })
}


/**
 * 删除
 * @param {string} id true
 */
 export function delNews(id) {
  return request({
    url:`/brand-news/delete/${id}`,
    method:'post',
  })
}



/**
 * 分页获取列表
 * @param {string} keyword query false
 * @param {int32} pageNum false
 * @param {int32} pageSize false
 */

 export function newsList(params) {
  return request({
    url:`/brand-news/list`,
    method:'get',
    params
  })
}




/**
 * 修改
 * @param {string} id 内容 true
 * @param {string} content 内容 true
 * @param {string} imgUrl 图片 false
 * @param {string} title 内标题  true
 * @return {Promise}
 */

export function updateNews(id, data) {
  return request({
    url:`/brand-news/update/${id}`,
    method:'post',
    data
  })
}



//通过id获取单个
export function getNewsById(id) {
  return request({
    url:`/brand-news/${id}`,
    method:'get',
  })
}