<template>
    <div class="home-page">
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

        <div class="service-container">
            <el-row :gutter="20">
                <el-col :span="4" v-for="item in serviceList" :key="item.name">
                    <div class="service-item" @click="goTo(item.path)">
                        <el-icon size="32" color="#409eff">
                            <component :is="item.icon" />
                        </el-icon>
                        <p>{{ item.name }}</p>
                    </div>
                </el-col>
            </el-row>
        </div>

        <el-main class="content-main">
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-card shadow="hover" class="card">
                        <div class="card-header">
                            <h3>热门职位</h3>
                            <el-button type="text" @click="goTo('/job/list')">更多</el-button>
                        </div>
                        <el-table :data="jobList" border size="small" v-loading="loading">
                            <el-table-column prop="job_name" label="职位名称" />
                            <el-table-column prop="salary" label="薪资" />
                            <el-table-column prop="city" label="工作地点" />
                        </el-table>
                    </el-card>
                </el-col>

                <el-col :span="12">
                    <el-card shadow="hover" class="card">
                        <div class="card-header">
                            <h3>自贸港政策资讯</h3>
                            <el-button type="text" @click="goTo('/info/news-list')">更多</el-button>
                        </div>
                        <div class="news-list">
                            <div v-for="item in newsList" :key="item.id" class="news-item">
                                <span class="dot">•</span>
                                <span class="title">{{ item.title }}</span>
                                <span class="date">{{ item.create_time }}</span>
                            </div>
                        </div>
                    </el-card>
                </el-col>
            </el-row>

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
                                <span class="count">评论 {{ item.comment_num }}</span>
                            </div>
                        </div>
                    </el-card>
                </el-col>
            </el-row>
        </el-main>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { OfficeBuilding, House, Wallet, User, ChatDotRound, Star } from '@element-plus/icons-vue'

const router = useRouter()
const loading = ref(false)
const jobList = ref([])
const newsList = ref([])
const topicList = ref([])

const serviceList = ref([
    { name: '人才认定', icon: Star, path: '/certify' },
    { name: '求职招聘', icon: OfficeBuilding, path: '/company/job-manage' },
    { name: '住房补贴', icon: House, path: '/subsidy' },
    { name: '落户办理', icon: User, path: '/settle' },
    { name: '政策补贴', icon: Wallet, path: '/policy' },
    { name: '社区论坛', icon: ChatDotRound, path: '/forum/topic-list' },
])

onMounted(() => {
    axios.get('/api/home').then(res => {
        jobList.value = res.data.job
        newsList.value = res.data.news
        topicList.value = res.data.topic
    })
})

const goTo = (path) => {
    router.push(path)
}
</script>

<style scoped>
.home-page {
    width: 100%;
    background: #f5f7fa;
}

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
    background: url('/images/banner/slideshow1.png') center / cover no-repeat;
}

.bg2 {
    background: url('/images/banner/slideshow2.png') center / cover no-repeat;
}

.bg3 {
    background: url('/images/banner/slideshow3.png') center / cover no-repeat;
}

.carousel-item h1 {
    font-size: 28px;
    margin-bottom: 10px;
}

.carousel-item p {
    font-size: 16px;
    opacity: 0.9;
}

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