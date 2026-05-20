<template>
    <div class="layout-container">
        <!-- 顶部悬浮头部 -->
        <el-header class="layout-header fixed-header">
            <div class="header-left">
                <div class="logo">
                    <el-icon size="26" color="#fff" style="margin-right: 12px">
                        <OfficeBuilding />
                    </el-icon>
                    <div class="title">自贸港人才服务系统</div>
                </div>
            </div>

            <div class="header-right">
                <div class="user-info" v-if="userInfo">
                    <el-icon color="#fff" style="margin-right: 6px">
                        <User />
                    </el-icon>
                    <span class="username">欢迎：{{ userInfo.username }}</span>
                    <el-button text type="warning" @click="logout" class="logout-btn">
                        退出登录
                    </el-button>
                </div>

                <div class="login-box" v-else>
                    <el-button text class="login-btn" @click="goLogin">
                        登录
                    </el-button>
                    <el-button type="primary" class="register-btn" @click="goRegister">
                        注册
                    </el-button>
                </div>
            </div>
        </el-header>

        <el-container class="layout-main">
            <!-- 左侧悬浮侧边栏 -->
            <el-aside width="220px" class="layout-aside fixed-aside">
                <el-menu default-active="$route.path" router class="side-menu">
                    <el-menu-item index="/home">
                        <el-icon>
                            <House />
                        </el-icon>
                        <span>系统首页</span>
                    </el-menu-item>

                    <el-sub-menu index="job">
                        <template #title>
                            <el-icon>
                                <Briefcase />
                            </el-icon>
                            <span>职位中心</span>
                        </template>
                        <el-menu-item index="/jobList">全部职位</el-menu-item>
                        <el-menu-item index="/matchJob">智能匹配岗位</el-menu-item>
                    </el-sub-menu>

                    <el-sub-menu index="user">
                        <template #title>
                            <el-icon>
                                <User />
                            </el-icon>
                            <span>求职者中心</span>
                        </template>
                        <el-menu-item index="/userInfo">个人资料</el-menu-item>
                        <el-menu-item index="/resumeEdit">简历编辑</el-menu-item>
                        <el-menu-item index="/myApply">我的投递</el-menu-item>
                    </el-sub-menu>

                    <el-sub-menu index="company">
                        <template #title>
                            <el-icon>
                                <OfficeBuilding />
                            </el-icon>
                            <span>企业管理</span>
                        </template>
                        <el-menu-item index="/companyInfo">企业信息</el-menu-item>
                        <el-menu-item index="/publishJob">发布职位</el-menu-item>
                        <el-menu-item index="/jobManage">职位管理</el-menu-item>
                        <el-menu-item index="/applyManage">简历投递管理</el-menu-item>
                    </el-sub-menu>

                    <el-sub-menu index="info">
                        <template #title>
                            <el-icon>
                                <Document />
                            </el-icon>
                            <span>资讯课程</span>
                        </template>
                        <el-menu-item index="/newsList">政策资讯</el-menu-item>
                        <el-menu-item index="/courseList">学习课程</el-menu-item>
                    </el-sub-menu>

                    <el-sub-menu index="forum">
                        <template #title>
                            <el-icon>
                                <ChatDotRound />
                            </el-icon>
                            <span>交流论坛</span>
                        </template>
                        <el-menu-item index="/topicList">帖子广场</el-menu-item>
                        <el-menu-item index="/addTopic">发布帖子</el-menu-item>
                    </el-sub-menu>
                </el-menu>
            </el-aside>

            <!-- 右侧内容区 -->
            <el-main class="layout-content">
                <router-view />
            </el-main>
        </el-container>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
    House,
    Briefcase,
    User,
    OfficeBuilding,
    Document,
    ChatDotRound,
} from '@element-plus/icons-vue'

const router = useRouter()
const userInfo = ref(null)

onMounted(() => {
    const info = localStorage.getItem('userInfo')
    if (info) {
        userInfo.value = JSON.parse(info)
    }
})

const logout = () => {
    localStorage.removeItem('userInfo')
    userInfo.value = null
    ElMessage.success('已退出登录')
    router.push('/login')
}

const goLogin = () => {
    router.push('/login')
}

const goRegister = () => {
    router.push('/register')
}
</script>

<style scoped>
.layout-container {
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
}

/* ========== 顶部悬浮 ========== */
.layout-header {
    height: 65px;
    background: linear-gradient(135deg, #409eff 0%, #2e86de 100%);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 30px;
    color: #fff;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    z-index: 99;
}

.fixed-header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 9999;
}

/* ========== 左侧悬浮 ========== */
.layout-aside {
    background: #fff;
    border-right: 1px solid #e6e6e6;
    height: calc(100vh - 65px);
}

.fixed-aside {
    position: fixed;
    top: 65px;
    left: 0;
    width: 220px;
    z-index: 999;
    overflow-y: auto;
}

.side-menu {
    height: 100%;
    border-right: none;
}

/* ========== 🔥 侧边栏悬浮效果 核心代码 ========== */
:deep(.el-menu-item) {
    border-radius: 8px !important;
    margin: 4px 10px !important;
    transition: all 0.25s ease !important;
}

:deep(.el-menu-item:hover) {
    background-color: #f0f7ff !important;
    color: #409eff !important;
    transform: translateX(4px) scale(1.03);
    box-shadow: 0 2px 8px rgba(64, 158, 255, 0.15);
}

:deep(.el-sub-menu__title) {
    border-radius: 8px !important;
    margin: 4px 10px !important;
    transition: all 0.25s ease !important;
}

:deep(.el-sub-menu__title:hover) {
    background-color: #f0f7ff !important;
    color: #409eff !important;
    transform: translateX(4px) scale(1.03);
    box-shadow: 0 2px 8px rgba(64, 158, 255, 0.15);
}

/* 激活状态更美观 */
:deep(.el-menu-item.is-active) {
    background-color: #e8f3ff !important;
    color: #409eff !important;
    font-weight: 500;
    box-shadow: 0 2px 6px rgba(64, 158, 255, 0.12);
}

/* ========== 主体布局 ========== */
.layout-main {
    flex: 1;
    margin-top: 65px;
    padding-left: 220px;
    /* 给左侧悬浮菜单留出位置 */
}

.layout-content {
    background: #f5f7fa;
    padding: 20px 30px;
    min-height: calc(100vh - 65px);
}

/* ========== 头部样式 ========== */
.header-left {
    display: flex;
    align-items: center;
}

.logo {
    display: flex;
    align-items: center;
    cursor: pointer;
}

.title {
    font-size: 20px;
    font-weight: 600;
    letter-spacing: 1px;
}

.header-right {
    display: flex;
    align-items: center;
    gap: 15px;
}

.login-box {
    display: flex;
    gap: 12px;
}

.login-btn {
    color: #fff !important;
    border: 1px solid rgba(255, 255, 255, 0.5) !important;
    padding: 6px 18px !important;
    border-radius: 6px !important;
    transition: all 0.3s;
}

.login-btn:hover {
    background: rgba(255, 255, 255, 0.15) !important;
    border-color: #fff !important;
}

.register-btn {
    background: #fff !important;
    color: #409eff !important;
    font-weight: 500;
    padding: 6px 20px !important;
    border-radius: 6px !important;
    transition: all 0.3s;
}

.register-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
}

.user-info {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 15px;
}

.username {
    font-weight: 500;
    margin-right: 6px;
}

.logout-btn {
    color: #ffefef !important;
    background: rgba(255, 255, 255, 0.12) !important;
    border-radius: 4px;
    padding: 4px 12px;
}

.logout-btn:hover {
    background: rgba(255, 255, 255, 0.2) !important;
}
</style>