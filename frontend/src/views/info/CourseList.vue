<template>
    <div class="page-container">
        <div class="page-title">
            <h2>人才培训课程</h2>
            <p>技能提升、职业认证、自贸港专项培训</p>
        </div>

        <el-row :gutter="20">
            <el-col :span="8" v-for="item in courseList" :key="item.id">
                <el-card class="course-card" shadow="hover">
                    <div class="course-tag" :class="item.tag === '推荐' ? 'tag-recommend' : 'tag-normal'">
                        {{ item.tag }}
                    </div>
                    <div class="course-name">{{ item.title }}</div>
                    <div class="course-desc">{{ item.desc }}</div>
                    <div class="course-info">
                        <span>{{ item.teacher }}</span>
                        <span>{{ item.time }}</span>
                    </div>
                    <div class="course-bottom">
                        <div class="price">{{ item.price }}</div>
                        <el-button type="primary" size="small">立即报名</el-button>
                    </div>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script setup>
import { ref } from 'vue'

const courseList = ref([
    {
        id: 1,
        title: 'Vue3 + ElementPlus 实战开发',
        desc: '从零搭建后台管理系统，掌握前端核心技能',
        teacher: '资深讲师',
        time: '40课时',
        price: '免费',
        tag: '推荐'
    },
    {
        id: 2,
        title: '海南自贸港人才政策解读',
        desc: '落户、补贴、认定、税收优惠全解析',
        teacher: '官方讲师',
        time: '12课时',
        price: '免费',
        tag: '热门'
    },
    {
        id: 3,
        title: 'Java后端开发进阶',
        desc: 'SpringBoot / Vue 全栈项目实战',
        teacher: '高级架构师',
        time: '50课时',
        price: '免费',
        tag: '推荐'
    },
    {
        id: 4,
        title: '职场沟通与职业素养',
        desc: '提升职场竞争力，快速适应企业环境',
        teacher: '职业导师',
        time: '8课时',
        price: '免费',
        tag: '基础'
    },
    {
        id: 5,
        title: '面试技巧与简历优化',
        desc: '名企面试真题讲解，简历高分技巧',
        teacher: 'HR专家',
        time: '10课时',
        price: '免费',
        tag: '热门'
    },
    {
        id: 6,
        title: '计算机软考考证辅导',
        desc: '职称评定、积分落户必备证书培训',
        teacher: '考证专家',
        time: '30课时',
        price: '免费',
        tag: '推荐'
    }
])
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

.course-card {
    border-radius: 12px;
    overflow: hidden;
    position: relative;
    transition: all 0.3s;
}

.course-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 20px rgba(64, 158, 255, 0.15);
}

.course-tag {
    position: absolute;
    top: 10px;
    right: 10px;
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 12px;
    color: #fff;
}

.tag-recommend {
    background: #409eff;
}

.tag-normal {
    background: #67c23a;
}

.course-name {
    font-size: 16px;
    font-weight: 500;
    color: #333;
    margin-bottom: 8px;
    margin-top: 10px;
}

.course-desc {
    font-size: 13px;
    color: #999;
    line-height: 1.5;
    margin-bottom: 12px;
}

.course-info {
    font-size: 12px;
    color: #666;
    display: flex;
    justify-content: space-between;
    margin-bottom: 15px;
}

.course-bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.price {
    color: #f56c6c;
    font-weight: bold;
    font-size: 16px;
}
</style>