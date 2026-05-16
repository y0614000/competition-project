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
                        <span>{{ item.date }}</span>
                        <span>{{ item.source }}</span>
                        <el-tag size="small" :type="item.type === '政策' ? 'primary' : 'success'">
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
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { ArrowRight } from '@element-plus/icons-vue'

const newsList = ref([
    {
        id: 1,
        title: '海南自贸港人才引进政策最新调整，落户条件进一步放宽',
        date: '2025-05-20',
        source: '海南省人社厅',
        type: '政策'
    },
    {
        id: 2,
        title: '人才住房补贴申请流程简化，线上即可办理无需跑腿',
        date: '2025-05-19',
        source: '海南政务服务网',
        type: '政策'
    },
    {
        id: 3,
        title: '2025年海南春季大型人才招聘会即将开启，上万岗位等你来',
        date: '2025-05-18',
        source: '海南人才集团',
        type: '公告'
    },
    {
        id: 4,
        title: '自贸港企业吸纳高校毕业生可享受税收减免与社保补贴',
        date: '2025-05-17',
        source: '海南省税务局',
        type: '政策'
    },
    {
        id: 5,
        title: '海南人才子女入学、医疗保障、安居房政策全面落地',
        date: '2025-05-16',
        source: '海南省教育厅',
        type: '公告'
    },
    {
        id: 6,
        title: '数字经济、新能源、生物医药成为海南紧缺人才重点行业',
        date: '2025-05-15',
        source: '海南发改委',
        type: '资讯'
    }
])

const goDetail = (item) => {
    ElMessage.info('查看：' + item.title)
}
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