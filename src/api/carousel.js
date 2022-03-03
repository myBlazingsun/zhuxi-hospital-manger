import request from '@/utils/request'

export function fetchList(params) {
  return request({
    url:'/carousel-img/list',
    method:'get',
    params
  })
}



//添加首页轮播
export function addIndexCarousel(data) {
  return request({
    url:'/carousel-img/add',
    method:'post',
    data
  })
}


//添加首页轮播
export function addCateCarousel(data) {
  return request({
    url:'/carousel-img/add-category',
    method:'post',
    data
  })
}

//添加资讯轮播
export function addnewsCarousel(data) {
  return request({
    url:'/carousel-img/add-news',
    method:'post',
    data
  })
}


export function updateIndexCarousel(id, data) {
  return request({
    url: `/carousel-img/update/${id}`,
    method:'post',
    data
  })
}

export function delIndexCarousel(id) {
  return request({
    url: `/carousel-img/delete/${id}`,
    method:'post',
  })
}



// id, status
export function modifyStatus(id, params) {
  return request({
    url: `/carousel-img/update/status/${id}`,
    method:'post',
    params,
    headers: {
      'content-type' : 'application/x-www-form-urlencoded'
    }
  })
}


