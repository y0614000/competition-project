<template>
    <div class="page-container">
        <div class="page-title">
            <h2>智能职位匹配</h2>
            <p>根据个人简历与技能标签，精准推送适配岗位</p>
        </div>

        <!-- 匹配条件栏 -->
        <div class="match-condition">
            <span class="label">我的意向：</span>
            <el-tag v-for="tag in userTag" :key="tag" size="small" type="primary">{{ tag }}</el-tag>
            <el-button type="primary" size="small" icon="Refresh" @click="refreshMatch">重新智能匹配</el-button>
        </div>

        <!-- 匹配职位列表 -->
        <el-row :gutter="20" style="margin-top: 20px">
            <el-col :span="8" v-for="item in matchJobList" :key="item.id">
                <el-card class="job-card" shadow="hover">
                    <div class="job-top">
                        <div class="job-name">{{ item.jobName }}</div>
                        <div class="job-salary">{{ item.salary }}</div>
                    </div>
                    <div class="match-degree">
                        岗位匹配度：<span :class="scoreClass(item.score)">{{ item.score }}%</span>
                    </div>
                    <div class="job-company">{{ item.companyName }}</div>
                    <div class="job-info">
                        <el-tag size="small">{{ item.city }}</el-tag>
                        <el-tag size="small" type="success">{{ item.jobType }}</el-tag>
                        <el-tag size="small" type="info">{{ item.needExp }}</el-tag>
                    </div>
                    <div class="job-desc">{{ item.jobDesc }}</div>
                    <div class="job-btn">
                        <el-button type="primary" size="small">立即投递</el-button>
                        <el-button size="small">查看详情</el-button>
                    </div>
                </el-card>
            </el-col>
        </el-row>

        <!-- 暂无匹配岗位 -->
        <el-empty v-if="matchJobList.length === 0" description="暂无高度匹配职位，可重新匹配"></el-empty>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

// 个人意向标签
const userTag = ref(['Vue开发', '前端', '海口', '应届生'])

// 智能匹配岗位数据
const matchJobList = ref([
    {
        id: 1,
        jobName: '前端开发工程师',
        salary: '7K-13K',
        companyName: '海南自贸港数字科技公司',
        city: '海口',
        jobType: '全职',
        needExp: '应届生',
        score: 96,
        jobDesc: '负责公司后台管理系统、官网页面开发，熟练使用Vue框架，适配移动端与PC端'
    },
    {
        id: 2,
        jobName: 'Web前端开发',
        salary: '6K-11K',
        companyName: '海南智慧政务服务平台',
        city: '海口',
        jobType: '全职',
        needExp: '1年以内',
        score: 89,
        jobDesc: '参与政务平台页面迭代优化，编写通用组件，配合后端完成接口联调'
    },
    {
        id: 3,
        jobName: '前端实习工程师',
        salary: '3K-6K',
        companyName: '三亚互联网产业园',
        city: '三亚',
        jobType: '实习',
        needExp: '不限',
        score: 82,
        jobDesc: '协助正式员工完成页面制作，学习项目开发流程，积累实战项目经验'
    },
    {
        id: 4,
        jobName: '小程序开发工程师',
        salary: '8K-15K',
        companyName: '海南人才服务集团',
        city: '儋州',
        jobType: '全职',
        needExp: '1-3年',
        score: 75,
        jobDesc: '负责微信小程序、H5页面开发，对接人才服务相关业务功能开发'
    },
    {
        id: 5,
        jobName: 'UI前端融合开发',
        salary: '7K-12K',
        companyName: '琼海文旅科技有限公司',
        city: '琼海',
        jobType: '全职',
        needExp: '1年',
        score: 85,
        jobDesc: '兼顾页面视觉还原与交互实现，熟悉常用组件库，热爱前端行业'
    },
    {
        id: 6,
        jobName: '技术运维助理',
        salary: '5K-9K',
        companyName: '海南软件职业技术合作企业',
        city: '海口',
        jobType: '全职',
        needExp: '应届生',
        score: 70,
        jobDesc: '负责网站日常维护、页面简单修改、数据整理与基础技术支持工作'
    }
])

// 匹配度文字颜色
const scoreClass = (num) => {
    if (num >= 90) return 'high-score'
    if (num >= 80) return 'mid-score'
    return 'low-score'
}

// 重新匹配
const refreshMatch = () => {
    ElMessage.success('正在为你重新精准匹配岗位~')
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

.match-condition {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
    padding: 15px 20px;
    background: #f0f7ff;
    border-radius: 10px;
}

.label {
    color: #333;
    font-weight: 500;
}

.job-card {
    border-radius: 12px;
    transition: all 0.3s;
}

.job-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 20px rgba(64, 158, 255, 0.15);
}

.job-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
}

.job-name {
    font-size: 16px;
    font-weight: 500;
    color: #333;
}

.job-salary {
    color: #f56c6c;
    font-weight: bold;
}

.match-degree {
    font-size: 13px;
    margin-bottom: 8px;
}

.high-score {
    color: #67c23a;
    font-weight: bold;
}

.mid-score {
    color: #e6a23c;
    font-weight: bold;
}

.low-score {
    color: #909399;
}

.job-company {
    color: #666;
    font-size: 14px;
    margin-bottom: 10px;
}

.job-info {
    margin-bottom: 12px;
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
}

.job-desc {
    font-size: 13px;
    color: #999;
    line-height: 1.5;
    margin-bottom: 15px;
}

.job-btn {
    text-align: right;
    display: flex;
    gap: 8px;
    justify-content: flex-end;
}
</style>