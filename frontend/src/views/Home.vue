<template>
    <div class="home">
        <el-main style="padding: 30px;">
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-card shadow="hover">
                        <h3>热门职位</h3>
                        <el-table :data="jobList" border size="small">
                            <el-table-column prop="title" label="职位名称"></el-table-column>
                            <el-table-column prop="salary" label="薪资"></el-table-column>
                            <el-table-column prop="address" label="工作地点"></el-table-column>
                        </el-table>
                    </el-card>
                </el-col>

                <el-col :span="12">
                    <el-card shadow="hover">
                        <h3>自贸港政策资讯</h3>
                        <div v-for="item in newsList" :key="item.id"
                            style="padding:10px 0;border-bottom:1px solid #eee">
                            {{ item.title }}
                        </div>
                    </el-card>
                </el-col>
            </el-row>
        </el-main>
    </div>
</template>

<script setup>
import { ref, onMounted, getCurrentInstance } from 'vue'
const { proxy } = getCurrentInstance()

const jobList = ref([
    { title: '前端开发工程师', salary: '7K-12K', address: '海口' },
    { title: '后端开发工程师', salary: '8K-14K', address: '三亚' },
    { title: 'UI设计师', salary: '6K-10K', address: '儋州' }
])
const newsList = ref([
    { id: 1, title: '海南自贸港人才引进新政策发布' },
    { id: 2, title: '就业补贴、住房补贴申请指南' },
    { id: 3, title: '企业招聘专场活动预告' }
])

// 模拟数据，不请求后端
onMounted(() => {
    console.log('首页已加载')
})
</script>

<style scoped>
.home {
    width: 100%;
    height: 100%;
}
</style>