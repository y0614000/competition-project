<template>
    <div class="page-container">
        <div class="page-title">
            <h2>自贸港资讯中心</h2>
            <p>最新政策、人才补贴、招聘活动、行业动态</p>
        </div>

        <div class="news-list">
            <div class="news-item" v-for="item in newsList" :key="item.id" @click="goDetail(item)">
                <div class="left">
                    <div class="title">{{ item.title }}</div>
                    <div class="info">
                        <span>{{ item.create_time }}</span>
                        <span>{{ item.source }}</span>
                        <el-tag size="small" :type="item.type === 1 ? 'primary' : 'success'">
                            {{ item.type }}
                        </el-tag>
                    </div>
                </div>
                <div class="right">
                    <el-icon>
                        <ArrowRight></ArrowRight>
                    </el-icon>
                </div>
            </div>
        </div>

        <el-empty v-if="newsList.length === 0" description="暂无资讯" />
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { ArrowRight } from '@element-plus/icons-vue'
import axios from 'axios'

const newsList = ref([])
const baseURL = 'http://127.0.0.1:8000/api'

// 获取资讯列表
const getNewsList = async () => {
    const res = await axios.get(baseURL + '/news/list')
    newsList.value = res.data.data
}

// 查看详情
const goDetail = async (item) => {
    const res = await axios.get(baseURL + '/news/detail/' + item.id)
    ElMessage.info('查看：' + item.title)
    console.log('资讯详情：', res.data.data)
}

onMounted(() => {
    getNewsList()
})
</script>

<style scoped>
.page-container {
    padding: 20px 0;
}

.page-title {
    margin-bottom: 25px;
}

.page-title h2 {
    font-size: 24px;
    color: #333;
    margin: 0 0 6px;
}

.page-title p {
    color: #999;
    margin: 0;
}

.news-list {
    width: 100%;
}

.news-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 20px;
    background: #fff;
    border-radius: 10px;
    margin-bottom: 12px;
    cursor: pointer;
    transition: all 0.3s;
    border: 1px solid #f0f0f0;
}

.news-item:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
    border-color: #dfeaff;
}

.left {
    flex: 1;
}

.title {
    font-size: 16px;
    color: #333;
    font-weight: 500;
    margin-bottom: 6px;
}

.info {
    display: flex;
    gap: 15px;
    font-size: 13px;
    color: #999;
}

.right {
    color: #999;
    transition: 0.3s;
}

.news-item:hover .right {
    color: #409eff;
}
</style>