import request from '@/utils/request'

export function fetchList(params) {
  return request({
    url:'/backstage/carousel-img/list',
    method:'get',
    params
  })
}



//添加首页轮播
export function addIndexCarousel(data) {
  return request({
    url:'/backstage/carousel-img/add',
    method:'post',
    data
  })
}

export function updateIndexCarousel(id, data) {
  return request({
    url: `/backstage/carousel-img/update/${id}`,
    method:'post',
    data
  })
}


export function getCarousel(id) {
  return request({
    url: `/backstage/carousel-img/${id}`,
    method:'get',
  })
}


export function delIndexCarousel(ids) { //array
  return request({
    url: `/backstage/carousel-img/batch/delete`,
    method:'post',
    params: {
      ids
    },
    headers: {
      'content-type' : 'application/x-www-form-urlencoded'
    }
  })
}



// id, status
export function modifyStatus(id, params) {
  return request({
    url: `
    /backstage/carousel-img/update/status/${id}`,
    method:'post',
    params,
    headers: {
      'content-type' : 'application/x-www-form-urlencoded'
    }
  })
}


