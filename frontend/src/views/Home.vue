<template>
    <div class="home">
        <el-header style="height:60px;background:#409eff;color:#fff;line-height:60px;padding:0 30px;font-size:18px">
            自贸港人才服务平台
            <el-button style="float:right;margin-top:10px" @click="$router.push('/login')">登录/注册</el-button>
        </el-header>
        <el-container>
            <el-main>
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
        </el-container>
    </div>
</template>

<script setup>
import { ref, onMounted, getCurrentInstance } from 'vue'
const { proxy } = getCurrentInstance()

const jobList = ref([])
const newsList = ref([])

const getJobList = async () => {
    try {
        let res = await proxy.$http.get('/job/list')
        jobList.value = res.data.data || []
    } catch (e) {
        console.log('后端未启动')
    }
}

const getNews = async () => {
    try {
        let res = await proxy.$http.get('/news/list')
        newsList.value = res.data.data || []
    } catch (e) {
        console.log('后端未启动')
    }
}

onMounted(() => {
    getJobList()
    getNews()
})
</script>