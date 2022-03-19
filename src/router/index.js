import Vue from 'vue'
import Router from 'vue-router'


Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
 * hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
 *                                if not set alwaysShow, only more than one route under the children
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
 **/
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },
  // {
  //   path: '',
  //   component: Layout,
  //   redirect: '/home',
  //   children: [{
  //     path: 'home',
  //     name: 'home',
  //     component: () => import('@/views/home/index'),
  //     meta: { title: '首页', icon: 'home' }
  //   }]
  // }
  {
    path: '/content',
    component: Layout,
    redirect: '',
    meta: { title: '内容管理', icon: 'content' },
    children: [
      {
        path: 'articles',
        name: 'articles',
        component: () => import('@/views/content/articles'),
        meta: { title: '文章管理', icon: 'articles' }
      },
      {
        path: 'menu',
        name: 'menu',
        component: () => import('@/views/content/menu'),
        meta: { title: '栏目管理', icon: 'menu' }
      },
      {
        path: 'carousel',
        name: 'carousel',
        component: () => import('@/views/content/carousel'),
        meta: { title: '轮播管理', icon: 'carousel' }
      },
    ]
  },
]

//超管独有路由
// export const adminRoute =  {
//   path: '/ums',
//   component: Layout,
//   redirect: '/ums/admin',
//   name: 'ums',
//   meta: { title: '管理员管理', icon: 'ums' },
//   children: [
//     {
//       path: 'admin',
//       name: 'admin',
//       component: () => import('@/views/ums/admin'),
//       meta: { title: '管理员列表', icon: 'ums-admin' }
//     },
//   ]
// }

//其他异步路由
export const asyncRouterMap = [
  {
    path: '/set',
    component: Layout,
    redirect: '/set/universal',
    name: 'set',
    meta: { title: '通用设置', icon: 'set' },
    children: [
      {
        path: 'universal',
        name: 'set-universal',
        component: () => import('@/views/set/universal'),
        meta: { title: '通用设置', icon: 'set-universal' }
      },
    ]
  },


  { path: '*', redirect: '/404', hidden: true },
  { path: '/', redirect: '/set/universal' },
]

export default new Router({
  mode: 'history', //后端支持可开
  base: '/manager/',
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

