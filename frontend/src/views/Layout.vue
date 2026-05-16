<template>
    <div class="layout-container">
        <!-- 顶部头部 -->
        <el-header class="layout-header">
            <div class="title">自贸港人才服务系统</div>
            <div class="user-info" v-if="userInfo">
                <span>欢迎：{{ userInfo.username }}</span>
                <el-button text type="danger" @click="logout">退出登录</el-button>
            </div>
        </el-header>

        <el-container class="layout-main">
            <!-- 左侧侧边栏导航 -->
            <el-aside width="220px" class="layout-aside">
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

            <!-- 右侧主体内容 -->
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
    House, Briefcase, User, OfficeBuilding,
    Document, ChatDotRound
} from '@element-plus/icons-vue'

const router = useRouter()
const userInfo = ref(null)

// 获取登录用户
onMounted(() => {
    const info = localStorage.getItem('userInfo')
    if (info) {
        userInfo.value = JSON.parse(info)
    }
})

// 退出登录
const logout = () => {
    localStorage.removeItem('userInfo')
    userInfo.value = null
    ElMessage.success('已退出登录')
    router.push('/login')
}
</script>

<style scoped>
.layout-container {
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
}

.layout-header {
    height: 60px;
    background: #409eff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 30px;
    color: #fff;
    font-size: 18px;
}

.layout-main {
    flex: 1;
}

.layout-aside {
    background: #fff;
    border-right: 1px solid #e6e6e6;
}

.side-menu {
    height: 100%;
    border-right: none;
}

.layout-content {
    background: #f5f7fa;
    padding: 20px;
    overflow-y: auto;
}
</style>