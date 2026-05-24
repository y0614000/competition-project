import { createRouter, createWebHistory } from 'vue-router'
import Layout from '../views/Layout.vue'
import { ElMessage } from 'element-plus'
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
  {
    path: '/',
    component: Layout,
    children: [
      // 🏠 系统首页
      { path: 'home', name: 'Home', component: () => import('../views/Home.vue') },

      // 🚀 职位中心（全部合并在这里）
      { path: 'jobList', name: 'JobList', component: () => import('../views/job/JobList.vue') }, // 全部职位
      { path: 'matchJob', name: 'MatchJob', component: () => import('../views/job/MatchJob.vue') }, // 智能匹配岗位
      { path: 'resumeEdit', name: 'ResumeEdit', component: () => import('../views/user/ResumeEdit.vue') }, // 简历管理
      { path: 'myApply', name: 'MyApply', component: () => import('../views/user/MyApply.vue') }, // 我的投递
      { path: 'companyInfo', name: 'CompanyInfo', component: () => import('../views/company/CompanyInfo.vue') }, // 企业信息
      { path: 'publishJob', name: 'PublishJob', component: () => import('../views/company/PublishJob.vue') }, // 发布职位
      { path: 'jobManage', name: 'JobManage', component: () => import('../views/company/JobManage.vue') }, // 职位管理
      { path: 'applyManage', name: 'ApplyManage', component: () => import('../views/company/ApplyManage.vue') }, // 简历投递管理

      // 📚 资讯课程
      { path: 'newsList', name: 'NewsList', component: () => import('../views/info/NewsList.vue') }, // 资讯
      { path: 'courseList', name: 'CourseList', component: () => import('../views/info/CourseList.vue') }, // 课程

      // 📝 社区论坛（保留）
      { path: 'topicList', name: 'TopicList', component: () => import('../views/forum/TopicList.vue') }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 登录拦截 + 角色权限拦截
router.beforeEach((to, from, next) => {
  // 放行登录、注册
  if (to.path === '/login' || to.path === '/register') return next()

  // 获取用户信息
  const userInfo = localStorage.getItem('userInfo')

  // 未登录 → 去登录
  if (!userInfo) {
    return next('/login')
  }

  // 已登录 → 解析角色
  const user = JSON.parse(userInfo)
  const role = user.role

  // 企业才能访问的页面
  const companyPages = [
    '/companyInfo',
    '/publishJob',
    '/jobManage',
    '/applyManage'
  ]

  // 求职者才能访问的页面
  const userPages = [
    '/resumeEdit',
    '/myApply'
  ]

  // 1. 求职者 访问 企业页面 → 拦截
  if (role === 'user' && companyPages.includes(to.path)) {
    ElMessage.warning('无权访问：企业专属功能')
    return next('/home')
  }

  // 2. 企业 访问 求职者页面 → 拦截
  if (role === 'company' && userPages.includes(to.path)) {
    ElMessage.warning('无权访问：求职者专属功能')
    return next('/home')
  }

  // 正常放行
  next()
})

export default router