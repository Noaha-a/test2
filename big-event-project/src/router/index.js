import { userStore } from '@/stores'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/login', component: () => import('@/views/login/LoginPage.vue') },
    {
      path: '/',
      component: () => import('@/views/layout/LayoutPage.vue'),
      redirect: '/article/manage',
      children: [
        { path: '/article/manage', component: () => import('@/views/article/ManagePage.vue') },
        { path: '/article/channel', component: () => import('@/views/article/ChannelPage.vue') },
        { path: '/user/avatar', component: () => import('@/views/user/AvatarPage.vue') },
        { path: '/user/profile', component: () => import('@/views/user/ProfilePage.vue') },
        { path: '/user/password', component: () => import('@/views/user/PasswordPage.vue') },
      ]
    }
  ],
})

// 路由导航守卫
router.beforeEach((to) => {
  const userSto = userStore()
  if (!userSto.token && to.path !== '/login') {
    return '/login'
  }
})

export default router
