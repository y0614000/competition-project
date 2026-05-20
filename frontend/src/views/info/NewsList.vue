<template>
    <div class="news-page">
        <!-- 顶部标题外框区域 -->
        <div class="title-wrap">
            <div class="page-title">
                <h2>自贸港资讯中心</h2>
                <p>汇聚海南最新人才政策、就业补贴、线下招聘活动、行业发展动态</p>
            </div>
        </div>

        <!-- 资讯数据统计卡片 -->
        <div class="stat-row">
            <div class="stat-card">
                <div class="stat-num">{{ newsList.length }}</div>
                <div class="stat-text">资讯总数</div>
            </div>
            <div class="stat-card blue">
                <div class="stat-num">{{ policyCount }}</div>
                <div class="stat-text">政策资讯</div>
            </div>
            <div class="stat-card green">
                <div class="stat-num">{{ jobActCount }}</div>
                <div class="stat-text">招聘活动</div>
            </div>
        </div>

        <!-- 分类筛选栏 -->
        <div class="filter-bar">
            <el-button :type="activeType === '' ? 'primary' : ''" size="small" @click="filterNews('')">
                全部资讯
            </el-button>
            <el-button :type="activeType === 1 ? 'primary' : ''" size="small" @click="filterNews(1)">
                人才政策
            </el-button>
            <el-button :type="activeType === 2 ? 'primary' : ''" size="small" @click="filterNews(2)">
                招聘活动
            </el-button>
        </div>

        <!-- 资讯列表 -->
        <div class="news-list">
            <div class="news-item" v-for="item in filterList" :key="item.id" @click="goDetail(item)">
                <div class="news-left">
                    <div class="news-tag">
                        {{ item.type === 1 ? '政策资讯' : '招聘活动' }}
                    </div>
                    <div class="news-main">
                        <div class="news-title">{{ item.title }}</div>
                        <div class="news-desc" v-if="item.intro">{{ item.intro }}</div>
                        <div class="news-meta">
                            <span class="time">{{ item.create_time }}</span>
                            <span class="source">来源：{{ item.source }}</span>
                        </div>
                    </div>
                </div>
                <div class="news-arrow">
                    <el-icon size="18">
                        <ArrowRight />
                    </el-icon>
                </div>
            </div>
        </div>

        <el-empty v-if="filterList.length === 0" description="暂无相关资讯" />
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { ArrowRight } from '@element-plus/icons-vue'
import axios from 'axios'

const newsList = ref([])
const activeType = ref('')
const baseURL = 'http://127.0.0.1:8000/api'

// 筛选后列表
const filterList = computed(() => {
    if (activeType.value === '') return newsList.value
    return newsList.value.filter(item => item.type === activeType.value)
})

// 统计数量
const policyCount = computed(() => newsList.value.filter(i => i.type === 1).length)
const jobActCount = computed(() => newsList.value.filter(i => i.type === 2).length)

// 获取资讯列表
const getNewsList = async () => {
    const res = await axios.get(baseURL + '/news/list')
    newsList.value = res.data.data
}

// 筛选资讯
const filterNews = (type) => {
    activeType.value = type
}

// 查看详情
const goDetail = async (item) => {
    const res = await axios.get(baseURL + '/news/detail/' + item.id)
    ElMessage.success('正在查看资讯详情')
    console.log('资讯详情：', res.data.data)
}

onMounted(() => {
    getNewsList()
})
</script>

<style scoped>
.news-page {
    padding: 24px;
    background: #f5f7fa;
    min-height: 100vh;
}

/* 标题外框 */
.title-wrap {
    background: #fff;
    border: 1px solid #e5eaf3;
    border-radius: 14px;
    padding: 22px 26px;
    margin-bottom: 20px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
}

.page-title h2 {
    font-size: 24px;
    color: #222;
    margin: 0 0 6px;
}

.page-title p {
    color: #888;
    margin: 0;
    font-size: 14px;
}

/* 数据统计行 */
.stat-row {
    display: flex;
    gap: 16px;
    margin-bottom: 20px;
}

.stat-card {
    flex: 1;
    background: #fff;
    border-radius: 12px;
    padding: 16px;
    text-align: center;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.stat-card.blue {
    background: linear-gradient(135deg, #409eff, #74b6ff);
    color: #fff;
}

.stat-card.green {
    background: linear-gradient(135deg, #67c23a, #94e066);
    color: #fff;
}

.stat-num {
    font-size: 26px;
    font-weight: bold;
    margin-bottom: 4px;
}

.stat-text {
    font-size: 14px;
    color: #666;
}

.stat-card.blue .stat-text,
.stat-card.green .stat-text {
    color: #fff;
    opacity: 0.9;
}

/* 筛选栏 */
.filter-bar {
    background: #fff;
    padding: 14px 20px;
    border-radius: 12px;
    margin-bottom: 20px;
    display: flex;
    gap: 12px;
}

/* 资讯列表样式升级 */
.news-list {
    width: 100%;
}

.news-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 24px;
    background: #fff;
    border-radius: 12px;
    margin-bottom: 14px;
    cursor: pointer;
    transition: all 0.3s ease;
    border: 1px solid #f0f3f8;
}

.news-item:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 16px rgba(64, 158, 255, 0.1);
    border-color: #c9dcf5;
}

.news-left {
    display: flex;
    align-items: flex-start;
    gap: 16px;
    flex: 1;
}

.news-tag {
    flex-shrink: 0;
    padding: 4px 10px;
    background: #ecf5ff;
    color: #409eff;
    border-radius: 6px;
    font-size: 13px;
}

.news-main {
    flex: 1;
}

.news-title {
    font-size: 17px;
    color: #2d3748;
    font-weight: 550;
    margin-bottom: 8px;
}

.news-desc {
    font-size: 14px;
    color: #777;
    line-height: 1.5;
    margin-bottom: 10px;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.news-meta {
    font-size: 13px;
    color: #999;
    display: flex;
    gap: 20px;
}

.news-arrow {
    color: #ccd0d8;
    transition: 0.3s;
}

.news-item:hover .news-arrow {
    color: #409eff;
    transform: translateX(4px);
}
</style>