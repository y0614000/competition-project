<template>
    <div class="course-page">
        <!-- 顶部渐变标题区 -->
        <div class="course-header">
            <div class="header-box">
                <h2>人才技能培训中心</h2>
                <p>专业职业技能提升 | 行业认证培训 | 就业导向精品课程</p>
            </div>
        </div>

        <!-- 课程分类快捷入口 -->
        <div class="course-tab">
            <el-button text class="tab-btn active">全部课程</el-button>
            <el-button text class="tab-btn">免费课程</el-button>
            <el-button text class="tab-btn">付费精品</el-button>
            <el-button text class="tab-btn">最新上线</el-button>
        </div>

        <!-- 课程卡片 -->
        <el-row :gutter="26" class="course-list">
            <el-col :span="8" v-for="item in courseList" :key="item.id">
                <div class="course-card">
                    <!-- 标签 -->
                    <div class="card-tag" :class="item.price == 0 ? 'free' : 'premium'">
                        {{ item.price == 0 ? '免费学习' : '付费精品' }}
                    </div>

                    <!-- 课程封面 读取public/images/book/下图片 -->
                    <div class="card-cover">
                        <img :src="`/images/book/${item.course_img}`" alt="课程封面" class="cover-img" />
                    </div>

                    <!-- 内容 -->
                    <div class="card-body">
                        <h3 class="course-title">{{ item.course_name }}</h3>
                        <p class="course-desc">{{ item.course_intro }}</p>

                        <!-- 数据 -->
                        <div class="course-info">
                            <span><i class="el-icon-user"></i> {{ item.study_num }} 人学习</span>
                            <span><i class="el-icon-time"></i> {{ item.create_time }}</span>
                        </div>

                        <!-- 底部报名按钮 -->
                        <div class="card-footer">
                            <div class="price">
                                <span v-if="item.price == 0" class="free-text">免费学习</span>
                                <span v-else class="pay-text">¥{{ item.price }}</span>
                            </div>
                            <el-button type="primary" size="small" round @click="joinCourse(item)">立即报名</el-button>
                        </div>
                    </div>
                </div>
            </el-col>
        </el-row>

        <!-- 空状态 -->
        <el-empty v-if="courseList.length === 0" description="暂无课程" :image-size="120"
            style="margin-top:40px"></el-empty>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from '../../utils/request'
import { ElMessage } from 'element-plus'

const courseList = ref([])

// 获取登录用户信息
const getUserInfo = () => {
    return JSON.parse(localStorage.getItem('userInfo') || '{}')
}

// 获取课程列表
const getCourseList = async () => {
    const res = await axios.get('/api/course/list')
    if (res.data.code === 200) {
        courseList.value = res.data.data
    }
}

// 课程报名方法
const joinCourse = async (course) => {
    const user = getUserInfo()
    if (!user.id) {
        ElMessage.warning('请先登录账号再报名')
        return
    }
    const res = await axios.post('/api/course/join', {
        userId: user.id,
        courseId: course.id
    })
    if (res.data.code === 200) {
        ElMessage.success(res.data.msg)
        // 报名成功本地人数+1
        course.study_num = parseInt(course.study_num) + 1
    } else {
        ElMessage.warning(res.data.msg)
    }
}

onMounted(() => {
    getCourseList()
})
</script>

<style scoped>
/* 页面整体 */
.course-page {
    padding: 30px;
    background: #f5f7fa;
    min-height: 100vh;
}

/* 顶部渐变标题 */
.course-header {
    background: linear-gradient(135deg, #3b82f6, #60a5fa);
    border-radius: 20px;
    padding: 40px;
    margin-bottom: 25px;
    box-shadow: 0 8px 24px rgba(59, 130, 246, 0.15);
}

.header-box h2 {
    font-size: 28px;
    color: #fff;
    margin: 0 0 10px;
    font-weight: 600;
}

.header-box p {
    font-size: 15px;
    color: rgba(255, 255, 255, 0.85);
    margin: 0;
}

/* 课程分类 */
.course-tab {
    display: flex;
    gap: 12px;
    margin-bottom: 30px;
}

.tab-btn {
    padding: 8px 18px;
    border-radius: 30px;
    font-size: 14px;
}

.tab-btn.active {
    background: #eef4ff;
    color: #3b82f6;
    font-weight: 500;
}

/* 课程列表 */
.course-list {
    max-width: 1400px;
    margin: 0 auto;
}

/* 课程卡片 */
.course-card {
    background: #fff;
    border-radius: 20px;
    overflow: hidden;
    position: relative;
    transition: all 0.3s ease;
    box-shadow: 0 4px 18px rgba(0, 0, 0, 0.06);
}

.course-card:hover {
    transform: translateY(-10px);
    box-shadow: 0 12px 32px rgba(59, 130, 246, 0.15);
}

/* 标签 */
.card-tag {
    position: absolute;
    top: 15px;
    left: 15px;
    padding: 4px 12px;
    border-radius: 30px;
    font-size: 12px;
    color: #fff;
    z-index: 10;
}

.card-tag.free {
    background: linear-gradient(90deg, #10b981, #34d399);
}

.card-tag.premium {
    background: linear-gradient(90deg, #f59e0b, #fbbf24);
}

/* 封面 */
.card-cover {
    width: 100%;
    height: 190px;
    background: #f9fafb;
    display: flex;
    align-items: center;
    justify-content: center;
}

.cover-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

/* 内容 */
.card-body {
    padding: 22px;
}

.course-title {
    font-size: 17px;
    font-weight: 600;
    color: #1f2937;
    margin: 0 0 10px;
}

.course-desc {
    font-size: 13px;
    color: #6b7280;
    line-height: 1.6;
    margin: 0 0 16px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

/* 信息 */
.course-info {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    color: #9ca3af;
    margin-bottom: 18px;
}

/* 底部 */
.card-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 16px;
    border-top: 1px solid #f3f4f6;
}

.free-text {
    font-size: 15px;
    color: #10b981;
    font-weight: 600;
}

.pay-text {
    font-size: 18px;
    color: #ef4444;
    font-weight: bold;
}
</style>