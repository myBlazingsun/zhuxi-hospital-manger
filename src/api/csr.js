import request from '@/utils/request'


/**
 * 添加
 * @param {string} content 内容 true
 * @param {string} imgUrl 图片 false
 * @param {string} title 标题  true
 * @return {Promise}
 */
export function addCsr(data) {
  return request({
    url:'/brand-csr/add',
    method:'post',
    data
  })
}


/**
 * 删除
 * @param {string} id true
 */
 export function delCsr(id) {
  return request({
    url:`/brand-csr/delete/${id}`,
    method:'post',
  })
}



/**
 * 分页获取列表
 * @param {string} keyword query false
 * @param {int32} pageNum false
 * @param {int32} pageSize false
 */

 export function csrList(params) {
  return request({
    url:`/brand-csr/list`,
    method:'get',
    params
  })
}




/**
 * 修改
 * @param {string} id 内容 true
 * @param {string} content 内容 true
 * @param {string} imgUrl 图片 false
 * @param {string} title 标题  true
 * @return {Promise}
 */

export function updateCsr(id, data) {
  return request({
    url:`/brand-csr/update/${id}`,
    method:'post',
    data
  })
}



//通过id获取单个
export function getCsrById(id) {
  return request({
    url:`/brand-csr/${id}`,
    method:'get',
  })
}