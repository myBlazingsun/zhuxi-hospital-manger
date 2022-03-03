import request from '@/utils/request'


/**
 * 删除
 * @param {string} id true
 */
 export function delStoreImage(id) {
  return request({
    url:`/brand-image/delete/${id}`,
    method:'post',
  })
}



/**
 * 分页获取列表
 * @param {string} keyword query false
 * @param {int32} pageNum false
 * @param {int32} pageSize false
 */

 export function storeImageList(params) {
  return request({
    url:`/brand-image/list`,
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

export function updateStoreImage(id, data) {
  return request({
    url:`/brand-image/update/${id}`,
    method:'post',
    data
  })
}



/**
 * 添加
 * @param {string} content 内容 true
 * @param {string} imgUrl 图片 false
 * @param {string} title 标题  true
 * @return {Promise}
 */
 export function addStoreImage(data) {
  return request({
    url:`/brand-image/add`,
    method:'post',
    data
  })
}


//通过id获取单个
export function getStoreImageById(id) {
  return request({
    url:`/brand-image/${id}`,
    method:'get',
  })
}