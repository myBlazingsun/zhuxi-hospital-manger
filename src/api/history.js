import request from '@/utils/request'


/**
 * 添加
 * @param {string} eventTime 时间 true
 * @param {string} eventContent 内容 true
 * @return {Promise}
 */
export function addHistory(data) {
  return request({
    url:'/brand-history/add',
    method:'post',
    data
  })
}


/**
 * 删除
 * @param {string} id true
 */
 export function delHistory(id) {
  return request({
    url:`/brand-history/delete/${id}`,
    method:'post',
  })
}



/**
 * 分页获取列表
 * @param {string} keyword query false
 * @param {int32} pageNum false
 * @param {int32} pageSize false
 */

 export function historyList(params) {
  return request({
    url:`/brand-history/list`,
    method:'get',
    params
  })
}




/**
 * 修改
 * @param {string} id 内容 true
 * @param {string} eventTime 时间 true
 * @param {string} eventContent 内容 false
 * @return {Promise}
 */

export function updateHistory(id, data) {
  return request({
    url:`/brand-history/update/${id}`,
    method:'post',
    data
  })
}



//通过id获取单个
export function getHistoryById(id) {
  return request({
    url:`/brand-history/${id}`,
    method:'get',
  })
}