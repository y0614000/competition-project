import { createRouter, createWebHistory } from 'vue-router'
import Layout from '../views/Layout.vue'

const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/Register.vue')
  },
  // 后台布局所有子页面
  {
    path: '/',
    component: Layout,
    children: [
      // 首页
      { path: 'home', name: 'Home', component: () => import('../views/Home.vue') },
      // 职位
      { path: 'jobList', name: 'JobList', component: () => import('../views/job/JobList.vue') },
      { path: 'matchJob', name: 'MatchJob', component: () => import('../views/job/MatchJob.vue') },
      // 求职者
      { path: 'resumeEdit', name: 'ResumeEdit', component: () => import('../views/user/ResumeEdit.vue') },
      { path: 'myApply', name: 'MyApply', component: () => import('../views/user/MyApply.vue') },
      // 企业
      { path: 'companyInfo', name: 'CompanyInfo', component: () => import('../views/company/CompanyInfo.vue') },
      { path: 'publishJob', name: 'PublishJob', component: () => import('../views/company/PublishJob.vue') },
      { path: 'jobManage', name: 'JobManage', component: () => import('../views/company/JobManage.vue') },
      { path: 'applyManage', name: 'ApplyManage', component: () => import('../views/company/ApplyManage.vue') },
      // 资讯课程
      { path: 'newsList', name: 'NewsList', component: () => import('../views/info/NewsList.vue') },
      { path: 'courseList', name: 'CourseList', component: () => import('../views/info/CourseList.vue') },
      // 论坛
      { path: 'topicList', name: 'TopicList', component: () => import('../views/forum/TopicList.vue') }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 登录拦截
router.beforeEach((to, from, next) => {
  // 放行：登录页、注册页
  if (to.path === '/login' || to.path === '/register') return next()

  // 其他页面需要登录
  const token = localStorage.getItem('userInfo')
  if (!token) {
    next('/login')
  } else {
    next()
  }
})

export default router