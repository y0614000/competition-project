<template>
    <div class="home-page">
        <!-- 🔴 轮播图：完全不动 -->
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

        <!-- ====================================== -->
        <!-- ✅ 你要的悬浮图标服务入口 原样加回来 -->
        <!-- ====================================== -->
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

        <!-- 🔵 你要的官网三栏布局 完整保留 -->
        <div class="main-container">
            <el-row :gutter="20">
                <!-- 左侧：平台简介 + 快捷入口 -->
                <el-col :span="6">
                    <div class="panel-box">
                        <div class="panel-header">
                            <h3>平台简介</h3>
                            <el-button type="text" class="more-btn">更多>></el-button>
                        </div>
                        <div class="panel-content intro-box">
                            <div class="intro-logo">
                                <svg width="60" height="60" viewBox="0 0 100 100">
                                    <circle cx="50" cy="50" r="48" fill="#fff" stroke="#0066b3" stroke-width="2" />
                                    <text x="50" y="55" text-anchor="middle" fill="#0066b3" font-size="12">LOGO</text>
                                </svg>
                            </div>
                            <p>海南自贸港人才服务中心成立于1998年12月，是为人才提供就业、创业、落户、补贴等一站式服务的平台，助力自贸港人才引进与发展。</p>
                        </div>
                    </div>

                    <div class="panel-box mt20">
                        <div class="panel-header">
                            <h3>快捷服务入口</h3>
                        </div>
                        <div class="entry-buttons">
                            <div class="entry-btn" :class="{ activeBtn: index === 0 }"
                                v-for="(item, index) in serviceList" :key="item.name" @click="goTo(item.path)">
                                {{ item.name }}
                                <span class="arrow">›</span>
                            </div>
                        </div>
                    </div>
                </el-col>

                <!-- 中间：资讯 + 职位 -->
                <el-col :span="12">
                    <div class="panel-box">
                        <div class="panel-header">
                            <h3>最新资讯</h3>
                            <el-button type="text" class="more-btn">更多>></el-button>
                            <div class="search-box">
                                <el-input placeholder="站内搜索" size="small">
                                    <template #append>
                                        <el-button type="primary" size="small">全站搜索</el-button>
                                    </template>
                                </el-input>
                            </div>
                        </div>
                        <div class="news-list">
                            <div v-for="item in newsList" :key="item.id" class="news-item">
                                <span class="dot">•</span>
                                <span class="title">{{ item.title }}</span>
                                <span class="date">{{ item.create_time }}</span>
                            </div>
                        </div>
                    </div>

                    <div class="panel-box mt20">
                        <div class="panel-header">
                            <h3>热门职位</h3>
                            <el-button type="text" @click="goTo('/job/list')" class="more-btn">更多>></el-button>
                        </div>
                        <el-table :data="jobList" border size="small" v-loading="loading">
                            <el-table-column prop="job_name" label="职位名称" />
                            <el-table-column prop="salary" label="薪资" />
                            <el-table-column prop="city" label="工作地点" />
                        </el-table>
                    </div>
                </el-col>

                <!-- 右侧：话题 + 服务 -->
                <el-col :span="6">
                    <div class="panel-box">
                        <div class="panel-header">
                            <h3>社区热门话题</h3>
                            <el-button type="text" @click="goTo('/forum/topic-list')" class="more-btn">更多>></el-button>
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
                    </div>

                    <div class="panel-box mt20">
                        <div class="panel-header">
                            <h3>人才服务项目</h3>
                        </div>
                        <div class="right-buttons">
                            <el-button type="primary" plain class="right-btn" center>
                                全国卫生专业技术资格考试（中初级）
                            </el-button>
                            <el-button type="primary" plain class="right-btn" center>
                                护士执业资格考试
                            </el-button>
                            <el-button type="primary" plain class="right-btn" center>
                                高级卫生专业技术资格考试
                            </el-button>
                            <el-button type="primary" plain class="right-btn" center>
                                职业技能鉴定
                            </el-button>
                        </div>
                    </div>
                </el-col>
            </el-row>
        </div>
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
/* 轮播样式不变 */
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

/* ====================================== */
/* ✅ 悬浮图标样式 100% 原样保留 */
/* ====================================== */
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

/* 三栏布局样式不变 */
.main-container {
    max-width: 1200px;
    margin: 20px auto;
    padding: 0 20px;
}

.panel-box {
    background: white;
    border-radius: 4px;
    overflow: hidden;
    border: 1px solid #e0e7ef;
}

.mt20 {
    margin-top: 20px;
}

.panel-header {
    display: flex;
    align-items: center;
    background: #f0f4f8;
    padding: 10px 15px;
    font-size: 16px;
    font-weight: bold;
    color: #0066b3;
    border-bottom: 1px solid #e0e7ef;
}

.panel-header h3 {
    margin: 0;
    font-size: 16px;
}

.more-btn {
    margin-left: auto;
    color: #0066b3;
    font-size: 14px;
}

.search-box {
    margin-left: 15px;
}

.intro-box {
    padding: 15px;
    display: flex;
    gap: 15px;
}

.intro-logo {
    flex-shrink: 0;
}

.intro-box p {
    margin: 0;
    line-height: 1.6;
    color: #333;
    font-size: 14px;
}

.entry-buttons {
    padding: 15px;
}

.entry-btn {
    background: #e6f0f8;
    color: #0066b3;
    border: 1px solid #b3d8f0;
    text-align: left;
    padding: 10px 15px;
    margin-bottom: 10px;
    border-radius: 4px;
    cursor: pointer;
    transition: 0.2s;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.entry-btn.activeBtn {
    background: #0066b3;
    color: white;
    border-color: #0066b3;
}

.entry-btn:hover {
    background: #cce0f5;
}

.arrow {
    font-size: 16px;
}

.news-list {
    padding: 15px;
}

.news-item {
    display: flex;
    justify-content: space-between;
    padding: 8px 0;
    border-bottom: 1px dashed #eee;
    font-size: 14px;
}

.news-item:last-child {
    border-bottom: none;
}

.dot {
    color: #0066b3;
    margin-right: 8px;
}

.title {
    flex: 1;
    color: #333;
}

.date {
    color: #999;
    font-size: 12px;
    margin-left: 10px;
}

.topic-list {
    padding: 15px;
}

.topic-item {
    padding: 10px 0;
    border-bottom: 1px solid #f0f0f0;
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 14px;
}

.topic-item:last-child {
    border-bottom: none;
}

.count {
    margin-left: auto;
    color: #999;
    font-size: 12px;
}

.right-buttons {
    padding: 15px;
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.right-btn {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    border: 1px solid #0066b3;
    color: #0066b3;
    white-space: normal;
    word-break: break-all;
}
</style>