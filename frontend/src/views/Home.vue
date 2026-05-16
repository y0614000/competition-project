<template>
    <div class="home-page">
        <!-- 轮播图 -->
        <el-carousel height="280px" indicator-position="bottom" arrow="hover">
            <el-carousel-item>
                <div class="carousel-item bg1">
                    <h1>海南自贸港人才服务平台</h1>
                    <p>聚天下英才 建自贸港</p>
                </div>
            </el-carousel-item>
            <el-carousel-item>
                <div class="carousel-item bg2">
                    <h1>人才引进 · 就业创业 · 政策扶持</h1>
                    <p>一站式人才服务体系</p>
                </div>
            </el-carousel-item>
            <el-carousel-item>
                <div class="carousel-item bg3">
                    <h1>住房补贴 · 落户办理 · 子女教育</h1>
                    <p>全方位人才保障</p>
                </div>
            </el-carousel-item>
        </el-carousel>

        <!-- 快捷服务入口 -->
        <div class="service-container">
            <el-row :gutter="20">
                <el-col :span="4" v-for="item in serviceList" :key="item.icon">
                    <div class="service-item" @click="goTo(item.path)">
                        <el-icon size="32" color="#409eff">
                            <component :is="item.icon" />
                        </el-icon>
                        <p>{{ item.name }}</p>
                    </div>
                </el-col>
            </el-row>
        </div>

        <!-- 内容区域 -->
        <el-main class="content-main">
            <el-row :gutter="20">

                <!-- 左侧：热门职位 -->
                <el-col :span="12">
                    <el-card shadow="hover" class="card">
                        <div class="card-header">
                            <h3>热门职位</h3>
                            <el-button type="text" @click="goTo('/company/job-manage')">更多</el-button>
                        </div>
                        <el-table :data="jobList" border size="small" :show-header="true">
                            <el-table-column prop="title" label="职位名称" />
                            <el-table-column prop="salary" label="薪资" />
                            <el-table-column prop="address" label="工作地点" />
                        </el-table>
                    </el-card>
                </el-col>

                <!-- 右侧：政策资讯 -->
                <el-col :span="12">
                    <el-card shadow="hover" class="card">
                        <div class="card-header">
                            <h3>自贸港政策资讯</h3>
                            <el-button type="text">更多</el-button>
                        </div>
                        <div class="news-list">
                            <div v-for="item in newsList" :key="item.id" class="news-item">
                                <span class="dot">•</span>
                                <span class="title">{{ item.title }}</span>
                                <span class="date">{{ item.date }}</span>
                            </div>
                        </div>
                    </el-card>
                </el-col>
            </el-row>

            <!-- 下方：社区话题 -->
            <el-row style="margin-top:20px">
                <el-col :span="24">
                    <el-card shadow="hover" class="card">
                        <div class="card-header">
                            <h3>社区热门话题</h3>
                            <el-button type="text" @click="goTo('/forum/topic-list')">进入社区</el-button>
                        </div>
                        <div class="topic-list">
                            <div v-for="item in topicList" :key="item.id" class="topic-item">
                                <el-icon>
                                    <ChatDotRound />
                                </el-icon>
                                <span>{{ item.title }}</span>
                                <span class="count">评论 {{ item.comment }}</span>
                            </div>
                        </div>
                    </el-card>
                </el-col>
            </el-row>
        </el-main>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import {
    OfficeBuilding,
    House,
    Wallet,
    User,
    ChatDotRound,
    Star
} from '@element-plus/icons-vue'

const router = useRouter()

// 快捷入口
const serviceList = ref([
    { name: '人才认定', icon: Star, path: '/certify' },
    { name: '求职招聘', icon: OfficeBuilding, path: '/company/job-manage' },
    { name: '住房补贴', icon: House, path: '/subsidy' },
    { name: '落户办理', icon: User, path: '/settle' },
    { name: '政策补贴', icon: Wallet, path: '/policy' },
    { name: '社区论坛', icon: ChatDotRound, path: '/forum/topic-list' },
])

// 热门职位
const jobList = ref([
    { title: '前端开发工程师', salary: '8K-15K', address: '海口' },
    { title: '后端Java工程师', salary: '10K-18K', address: '三亚' },
    { title: '产品经理', salary: '12K-20K', address: '琼海' },
    { title: 'UI设计师', salary: '7K-12K', address: '儋州' },
])

// 政策资讯
const newsList = ref([
    { id: 1, title: '海南自贸港人才引进新政正式实施', date: '2025-01-10' },
    { id: 2, title: '人才住房补贴申请流程与材料清单', date: '2025-01-09' },
    { id: 3, title: '企业吸纳高校毕业生可享税收优惠', date: '2025-01-08' },
    { id: 4, title: '海南人才落户条件放宽 办理更便捷', date: '2025-01-07' },
])

// 社区话题
const topicList = ref([
    { id: 1, title: '海南人才补贴到底怎么申请？', comment: 32 },
    { id: 2, title: '应届生落户海南全流程分享', comment: 48 },
    { id: 3, title: '在海南做前端开发的体验', comment: 26 },
    { id: 4, title: '自贸港就业环境真实感受', comment: 55 },
])

// 跳转
const goTo = (path) => {
    router.push(path)
}
</script>

<style scoped>
.home-page {
    width: 100%;
    background: #f5f7fa;
}

/* 轮播 */
.carousel-item {
    width: 100%;
    height: 280px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: white;
    border-radius: 8px;
}

.bg1 {
    background: linear-gradient(to right, #409eff, #36cffc);
}

.bg2 {
    background: linear-gradient(to right, #67c23a, #95de64);
}

.bg3 {
    background: linear-gradient(to right, #f56c6c, #f78989);
}

.carousel-item h1 {
    font-size: 28px;
    margin-bottom: 10px;
}

.carousel-item p {
    font-size: 16px;
    opacity: 0.9;
}

/* 服务入口 */
.service-container {
    max-width: 1200px;
    margin: -60px auto 20px;
    position: relative;
    z-index: 10;
    padding: 0 20px;
}

.service-item {
    background: white;
    height: 100px;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    transition: 0.3s;
}

.service-item:hover {
    transform: translateY(-5px);
}

.service-item p {
    margin-top: 6px;
    font-size: 14px;
    color: #333;
}

/* 内容 */
.content-main {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px 30px;
}

.card {
    border-radius: 10px;
    overflow: hidden;
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
}

.card-header h3 {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
    color: #333;
}

/* 新闻 */
.news-item {
    display: flex;
    justify-content: space-between;
    padding: 10px 0;
    border-bottom: 1px solid #f0f0f0;
    font-size: 14px;
}

.dot {
    color: #409eff;
    margin-right: 8px;
}

.date {
    color: #999;
    font-size: 12px;
}

/* 话题 */
.topic-item {
    padding: 12px 0;
    border-bottom: 1px solid #f0f0f0;
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 14px;
}

.count {
    margin-left: auto;
    color: #999;
    font-size: 12px;
}
</style>