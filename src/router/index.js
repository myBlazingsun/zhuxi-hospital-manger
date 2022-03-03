import Vue from 'vue'
import Router from 'vue-router'
import { getMenuConfig } from '@/api/menu'


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

const menus = getMenuConfig();
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
    path: '/articles',
    component: Layout,
    redirect: '/articles/index',
    name: 'articles',
    meta: { title: '文章管理', icon: 'articles' },
    children: [
      {
        path: 'index',
        name: 'articles-index',
        component: () => import('@/views/articles/index'),
        meta: { title: '文章管理', icon: 'articles-index' }
      },
    ]
  },
  {
    path: '/menu',
    component: Layout,
    redirect: '/menu/index',
    name: 'menu',
    meta: { title: '栏目管理', icon: 'menu' },
    children: [
      {
        path: 'index',
        name: 'menu-index',
        component: () => import('@/views/menu/index'),
        meta: { title: '栏目管理', icon: 'menu-index' }
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
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

