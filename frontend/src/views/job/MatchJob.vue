<template>
    <div class="page-container">
        <div class="page-title">
            <h2>智能职位匹配</h2>
            <p>根据个人意向与技能标签，精准推送适配岗位</p>
        </div>

        <!-- 可编辑意向标签区域 -->
        <div class="match-condition">
            <span class="label">我的意向：</span>
            <!-- 动态标签 可删除 -->
            <el-tag v-for="(tag, index) in userTag" :key="index" size="small" type="primary" closable
                @close="delTag(index)">
                {{ tag }}
            </el-tag>
            <!-- 输入框添加标签 -->
            <el-input v-model="inputTag" size="small" style="width: 160px" placeholder="输入意向回车添加"
                @keyup.enter.native="addTag"></el-input>
            <el-button type="primary" size="small" icon="Refresh" @click="refreshMatch" :loading="loading">
                重新智能匹配
            </el-button>
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
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import axios from 'axios'

// 输入框绑定值
const inputTag = ref('')
// 用户意向标签 初始默认值
const userTag = ref(['Vue开发', '前端', '海口', '应届生'])

// 岗位列表
const matchJobList = ref([])
const loading = ref(false)

// 删除标签
const delTag = (index) => {
    userTag.value.splice(index, 1)
}

// 添加标签
const addTag = () => {
    const val = inputTag.value.trim()
    if (!val) return ElMessage.warning('请输入意向内容')
    if (userTag.value.includes(val)) return ElMessage.warning('该意向已存在')
    userTag.value.push(val)
    inputTag.value = ''
}

// 匹配度颜色
const scoreClass = (num) => {
    if (num >= 90) return 'high-score'
    if (num >= 80) return 'mid-score'
    return 'low-score'
}

// 获取用户ID
const getUserId = () => {
    const user = localStorage.getItem('userInfo')
    if (!user) return null
    return JSON.parse(user).id
}

// 获取匹配列表
const getMatchList = async () => {
    const user_id = getUserId()
    if (!user_id) {
        ElMessage.warning('请先登录')
        return
    }
    try {
        const res = await axios.get('http://127.0.0.1:8000/JobMatchController/list', {
            params: { user_id }
        })
        if (res.data.code === 1) {
            matchJobList.value = res.data.data
        } else {
            ElMessage.error(res.data.msg)
        }
    } catch (e) {
        ElMessage.error('请求失败')
    }
}

// 重新匹配
const refreshMatch = async () => {
    const user_id = getUserId()
    if (!user_id) {
        ElMessage.warning('请先登录')
        return
    }
    loading.value = true
    try {
        // 把用户自定义意向传给后端做精准匹配
        const res = await axios.get('http://127.0.0.1:8000/JobMatchController/refresh', {
            params: {
                user_id,
                tag: userTag.value.join(',')
            }
        })
        if (res.data.code === 1) {
            ElMessage.success('匹配成功')
            getMatchList()
        } else {
            ElMessage.error(res.data.msg)
        }
    } catch (e) {
        ElMessage.error('匹配失败')
    } finally {
        loading.value = false
    }
}

onMounted(() => {
    getMatchList()
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

.match-condition {
    display: flex;
    align-items: center;
    gap: 10px;
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