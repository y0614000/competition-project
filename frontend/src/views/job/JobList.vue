<template>
    <div class="page-container">
        <div class="page-title">
            <h2>全部热门职位</h2>
            <p>海量优质岗位，随心挑选心仪工作</p>
        </div>

        <el-row :gutter="20">
            <el-col :span="8" v-for="item in 6" :key="item">
                <el-card class="job-card" shadow="hover">
                    <div class="job-top">
                        <div class="job-name">前端开发工程师</div>
                        <div class="job-salary">6K-12K</div>
                    </div>
                    <div class="job-company">海南科技有限公司</div>
                    <div class="job-info">
                        <el-tag size="small">海口</el-tag>
                        <el-tag size="small" type="success">全职</el-tag>
                        <el-tag size="small" type="info">1-3年</el-tag>
                    </div>
                    <div class="job-desc">负责页面搭建与交互开发，参与项目迭代优化</div>
                    <div class="job-btn">
                        <el-button type="primary" size="small">立即投递</el-button>
                    </div>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script setup>

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

.job-company {
    color: #666;
    font-size: 14px;
    margin-bottom: 10px;
}

.job-info {
    margin-bottom: 12px;
}

.job-desc {
    font-size: 13px;
    color: #999;
    line-height: 1.5;
    margin-bottom: 15px;
}

.job-btn {
    text-align: right;
}
</style>