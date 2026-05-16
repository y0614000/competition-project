<template>
    <div class="page-container">
        <!-- 顶部渐变标题栏 -->
        <div class="page-top">
            <div class="title-wrap">
                <h2>人才培训课程</h2>
                <p>技能提升、职业认证、自贸港专项精品培训课程</p>
            </div>
        </div>

        <!-- 课程卡片列表 -->
        <el-row :gutter="24" class="course-wrap">
            <el-col :span="8" v-for="item in courseList" :key="item.id">
                <div class="course-card">
                    <!-- 顶部标签 -->
                    <div class="card-label" :class="item.price == 0 ? 'free-label' : 'pay-label'">
                        {{ item.price == 0 ? '免费课程' : '精品付费' }}
                    </div>

                    <!-- 课程封面占位 -->
                    <div class="course-cover">
                        <img :src="item.course_img" alt="课程封面" />
                    </div>

                    <!-- 课程内容 -->
                    <div class="course-content">
                        <h3 class="course-title">{{ item.course_name }}</h3>
                        <p class="course-intro">{{ item.course_intro }}</p>

                        <div class="course-data">
                            <div class="data-item">
                                <i class="el-icon-user-solid"></i>
                                <span>{{ item.study_num }}人已学习</span>
                            </div>
                            <div class="data-item">
                                <i class="el-icon-time"></i>
                                <span>{{ item.create_time }}</span>
                            </div>
                        </div>

                        <!-- 底部价格与按钮 -->
                        <div class="course-footer">
                            <div class="course-price">
                                <span v-if="item.price == 0">免费学习</span>
                                <span v-else class="money">¥{{ item.price }}</span>
                            </div>
                            <el-button type="primary" size="small" class="join-btn">立即报名</el-button>
                        </div>
                    </div>
                </div>
            </el-col>
        </el-row>

        <!-- 空数据提示 -->
        <el-empty v-if="courseList.length === 0" description="暂无上架培训课程" />
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const courseList = ref([])
const baseUrl = 'http://127.0.0.1:8000/api'

// 获取课程数据
const getCourseData = async () => {
    const res = await axios.get(`${baseUrl}/course/list`)
    courseList.value = res.data.data
}

onMounted(() => {
    getCourseData()
})
</script>

<style scoped>
/* 页面整体 */
.page-container {
    padding: 30px;
    background-color: #f7f9fc;
    min-height: 100vh;
}

/* 顶部渐变标题区 */
.page-top {
    background: linear-gradient(135deg, #409eff 0%, #73c0fc 100%);
    border-radius: 16px;
    padding: 35px 40px;
    margin-bottom: 30px;
    box-shadow: 0 6px 18px rgba(64, 158, 255, 0.25);
}

.title-wrap h2 {
    font-size: 28px;
    color: #ffffff;
    margin: 0 0 10px;
    font-weight: 600;
    letter-spacing: 1px;
}

.title-wrap p {
    font-size: 15px;
    color: #e8f4ff;
    margin: 0;
    opacity: 0.9;
}

/* 课程外层布局 */
.course-wrap {
    margin: 0 auto;
}

/* 课程卡片主样式 */
.course-card {
    background: #fff;
    border-radius: 18px;
    overflow: hidden;
    position: relative;
    margin-bottom: 28px;
    transition: all 0.35s ease;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
}

.course-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 30px rgba(64, 158, 255, 0.18);
}

/* 课程标签 */
.card-label {
    position: absolute;
    top: 16px;
    left: 16px;
    padding: 4px 12px;
    border-radius: 30px;
    font-size: 12px;
    color: #fff;
    z-index: 2;
}

.free-label {
    background: linear-gradient(90deg, #67c23a, #85e05c);
}

.pay-label {
    background: linear-gradient(90deg, #e6a23c, #f7c466);
}

/* 课程封面 */
.course-cover {
    width: 100%;
    height: 160px;
    background-color: #f2f6fb;
    display: flex;
    align-items: center;
    justify-content: center;
}

.course-cover img {
    width: 80px;
    opacity: 0.7;
}

/* 课程文字内容 */
.course-content {
    padding: 20px;
}

.course-title {
    font-size: 17px;
    color: #2a3342;
    margin: 0 0 12px;
    font-weight: 600;
    line-height: 1.4;
}

.course-intro {
    font-size: 13px;
    color: #8892a0;
    line-height: 1.6;
    margin: 0 0 18px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

/* 数据统计行 */
.course-data {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    color: #667486;
    margin-bottom: 20px;
}

.data-item {
    display: flex;
    align-items: center;
    gap: 4px;
}

/* 底部价格按钮 */
.course-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 15px;
    border-top: 1px solid #f0f3f8;
}

.course-price span {
    font-size: 15px;
    font-weight: 600;
    color: #409eff;
}

.course-price .money {
    color: #f56c6c;
    font-size: 18px;
}

.join-btn {
    border-radius: 20px;
    padding: 5px 16px !important;
}
</style>