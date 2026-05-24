<template>
    <div class="match-page">
        <!-- 顶部标题栏（和首页风格统一） -->
        <div class="page-header-card">
            <div class="header-left">
                <el-icon class="header-icon">
                    <Star />
                </el-icon>
                <div>
                    <h2>智能职位匹配</h2>
                    <p>根据个人意向与技能标签，系统自动精准推送最适合你的岗位</p>
                </div>
            </div>
        </div>

        <!-- 匹配统计面板 -->
        <div class="stat-panel">
            <el-row :gutter="20">
                <el-col :span="6">
                    <div class="stat-item blue">
                        <div class="stat-number">{{ matchJobList.length }}</div>
                        <div class="stat-label">为你匹配岗位</div>
                    </div>
                </el-col>
                <el-col :span="6">
                    <div class="stat-item green">
                        <div class="stat-number">{{ highMatchCount }}</div>
                        <div class="stat-label">高匹配度(≥90%)</div>
                    </div>
                </el-col>
                <el-col :span="6">
                    <div class="stat-item orange">
                        <div class="stat-number">{{ userTag.length }}</div>
                        <div class="stat-label">我的意向标签</div>
                    </div>
                </el-col>
                <el-col :span="6">
                    <div class="stat-item purple">
                        <div class="stat-number">{{ avgScore }}%</div>
                        <div class="stat-label">平均匹配度</div>
                    </div>
                </el-col>
            </el-row>
        </div>

        <!-- 意向标签设置区 -->
        <div class="condition-card">
            <div class="condition-title">
                <el-icon>
                    <Edit />
                </el-icon>
                <span>我的求职意向（可自定义添加/删除）</span>
            </div>
            <div class="tag-container">
                <el-tag v-for="(tag, index) in userTag" :key="index" size="default" type="primary" closable
                    @close="delTag(index)">
                    {{ tag }}
                </el-tag>

                <el-input v-model="inputTag" size="default" style="width: 180px" placeholder="回车添加意向"
                    @keyup.enter="addTag" />

                <el-button type="primary" icon="Refresh" @click="refreshMatch" :loading="loading">
                    重新智能匹配
                </el-button>
            </div>
        </div>

        <!-- 匹配岗位列表 -->
        <div class="job-list" v-if="matchJobList.length > 0">
            <el-row :gutter="20">
                <el-col :span="8" v-for="item in matchJobList" :key="item.id">
                    <el-card class="job-card" shadow="hover">
                        <div class="card-top">
                            <div class="job-name">{{ item.jobName }}</div>
                            <div class="job-salary">{{ item.salary }}</div>
                        </div>

                        <!-- 匹配度指示器 -->
                        <div class="match-bar">
                            <div class="match-label">匹配度</div>
                            <div class="progress-bg">
                                <div class="progress-line" :style="{ width: item.score + '%' }"
                                    :class="scoreClass(item.score)"></div>
                            </div>
                            <span class="score-text" :class="scoreClass(item.score)">
                                {{ item.score }}%
                            </span>
                        </div>

                        <div class="company-info">
                            <el-icon>
                                <OfficeBuilding />
                            </el-icon>
                            {{ item.companyName }}
                        </div>

                        <div class="tag-group">
                            <el-tag size="small" icon="LocationFilled">{{ item.city }}</el-tag>
                            <el-tag size="small" type="success">{{ item.jobType }}</el-tag>
                            <el-tag size="small" type="warning">{{ item.needExp }}</el-tag>
                        </div>

                        <div class="job-desc">
                            {{ item.jobDesc || '暂无岗位描述' }}
                        </div>

                        <div class="card-footer">
                            <el-button type="primary" size="small" @click="toApply(item.id)">立即投递</el-button>
                            <el-button size="small" @click="openDetail(item)">查看详情</el-button>
                        </div>
                    </el-card>
                </el-col>
            </el-row>
        </div>

        <!-- 空状态 -->
        <el-empty v-else description="暂无匹配岗位，请调整意向标签后重新匹配" style="padding: 60px 0" />

        <!-- 详情弹窗 -->
        <el-dialog v-model="detailVisible" title="职位详情" width="650px" center>
            <div class="detail-box">
                <h3>{{ detailInfo.jobName }}</h3>
                <div class="detail-salary">{{ detailInfo.salary }}</div>
                <div class="detail-tags">
                    <el-tag size="small">{{ detailInfo.city }}</el-tag>
                    <el-tag size="small">{{ detailInfo.jobType }}</el-tag>
                    <el-tag size="small">{{ detailInfo.needExp }}</el-tag>
                </div>
                <el-divider>职位描述</el-divider>
                <div class="detail-content">{{ detailInfo.jobDesc || '暂无描述' }}</div>
            </div>
            <template #footer>
                <el-button @click="detailVisible = false">关闭</el-button>
                <el-button type="primary" @click="toApply(detailInfo.id)">立即投递简历</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { Star, Edit, OfficeBuilding, LocationFilled } from '@element-plus/icons-vue'
import axios from 'axios'

const inputTag = ref('')
const userTag = ref(['Vue开发', '前端', '海口', '应届生'])
const matchJobList = ref([])
const loading = ref(false)
const detailVisible = ref(false)
const detailInfo = ref({})

// 删除标签
const delTag = (index) => {
    userTag.value.splice(index, 1)
}

// 添加标签
const addTag = () => {
    const val = inputTag.value.trim()
    if (!val) return ElMessage.warning('请输入意向内容')
    if (userTag.value.includes(val)) return ElMessage.warning('标签已存在')
    userTag.value.push(val)
    inputTag.value = ''
}

// 匹配度样式
const scoreClass = (num) => {
    if (num >= 90) return 'high'
    if (num >= 80) return 'mid'
    return 'low'
}

// 统计计算
const highMatchCount = computed(() => {
    return matchJobList.value.filter(i => i.score >= 90).length
})

const avgScore = computed(() => {
    if (matchJobList.value.length === 0) return 0
    const total = matchJobList.value.reduce((sum, cur) => sum + cur.score, 0)
    return (total / matchJobList.value.length).toFixed(1)
})

// 获取用户ID
const getUserId = () => {
    const user = localStorage.getItem('userInfo')
    if (!user) return null
    return JSON.parse(user).id
}

// 获取匹配列表（你原来的接口！！！）
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
        }
    } catch (e) {
        ElMessage.error('获取匹配数据失败')
    }
}

// 重新匹配（你原来的接口！！！）
const refreshMatch = async () => {
    const user_id = getUserId()
    if (!user_id) {
        ElMessage.warning('请先登录')
        return
    }
    loading.value = true
    try {
        const res = await axios.get('http://127.0.0.1:8000/JobMatchController/refresh', {
            params: {
                user_id,
                tag: userTag.value.join(',')
            }
        })
        if (res.data.code === 1) {
            ElMessage.success('匹配完成，已为你更新最佳岗位')
            getMatchList()
        }
    } catch (e) {
        ElMessage.error('匹配失败')
    } finally {
        loading.value = false
    }
}

// 查看详情
const openDetail = (item) => {
    detailInfo.value = item
    detailVisible.value = true
}

// 投递简历
const toApply = async (id) => {
    if (!id) return ElMessage.warning('职位ID错误')
    try {
        const res = await axios.post('/api/apply/add', { job_id: id })
        if (res.data.code === 200) {
            ElMessage.success('投递成功！')
        }
    } catch (e) {
        ElMessage.warning('请先完善简历')
    }
}

onMounted(() => {
    getMatchList()
})
</script>

<style scoped>
.match-page {
    padding: 24px;
    background: #f5f7fa;
    min-height: 100vh;
}

/* 顶部标题卡片（和首页统一） */
.page-header-card {
    background: linear-gradient(135deg, #409eff, #69b1ff);
    padding: 20px 24px;
    border-radius: 12px;
    color: white;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    box-shadow: 0 4px 12px rgba(0, 102, 179, 0.15);
}

.header-left {
    display: flex;
    align-items: center;
    gap: 14px;
}

.header-icon {
    font-size: 28px;
}

.header-left h2 {
    margin: 0;
    font-size: 22px;
}

.header-left p {
    margin: 4px 0 0;
    opacity: 0.9;
    font-size: 14px;
}

/* 统计面板 */
.stat-panel {
    margin-bottom: 20px;
}

.stat-item {
    padding: 20px;
    border-radius: 12px;
    color: white;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
}

.stat-number {
    font-size: 26px;
    font-weight: bold;
    margin-bottom: 6px;
}

.stat-label {
    font-size: 14px;
    opacity: 0.9;
}

.stat-item.blue {
    background: linear-gradient(135deg, #409eff, #69b1ff);
}

.stat-item.green {
    background: linear-gradient(135deg, #67c23a, #95d475);
}

.stat-item.orange {
    background: linear-gradient(135deg, #e6a23c, #eebe77);
}

.stat-item.purple {
    background: linear-gradient(135deg, #9062f0, #b392f5);
}

/* 意向设置卡片 */
.condition-card {
    background: white;
    padding: 18px 22px;
    border-radius: 12px;
    margin-bottom: 24px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.condition-title {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 16px;
    font-weight: 500;
    color: #333;
    margin-bottom: 14px;
}

.tag-container {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
}

/* 岗位卡片 */
.job-card {
    border-radius: 12px;
    overflow: hidden;
    transition: all 0.3s;
}

.job-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 102, 179, 0.12);
}

.card-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
}

.job-name {
    font-size: 16px;
    font-weight: 600;
    color: #222;
}

.job-salary {
    color: #f56c6c;
    font-weight: bold;
    font-size: 15px;
}

/* 匹配进度条 */
.match-bar {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 12px;
}

.match-label {
    font-size: 13px;
    color: #666;
    width: 50px;
}

.progress-bg {
    flex: 1;
    height: 6px;
    background: #eee;
    border-radius: 10px;
    overflow: hidden;
}

.progress-line {
    height: 100%;
    border-radius: 10px;
    transition: width 0.6s;
}

.progress-line.high {
    background: #67c23a;
}

.progress-line.mid {
    background: #e6a23c;
}

.progress-line.low {
    background: #909399;
}

.score-text {
    font-size: 13px;
    font-weight: bold;
    min-width: 40px;
    text-align: right;
}

.score-text.high {
    color: #67c23a;
}

.score-text.mid {
    color: #e6a23c;
}

.score-text.low {
    color: #909399;
}

.company-info {
    font-size: 14px;
    color: #666;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    gap: 4px;
}

.tag-group {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-bottom: 12px;
}

.job-desc {
    font-size: 13px;
    color: #888;
    line-height: 1.5;
    margin-bottom: 14px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.card-footer {
    display: flex;
    gap: 8px;
    justify-content: flex-end;
}

.detail-box {
    padding: 10px;
}

.detail-box h3 {
    font-size: 18px;
    margin: 0 0 8px 0;
}

.detail-salary {
    font-size: 17px;
    color: #f56c6c;
    font-weight: bold;
    margin-bottom: 10px;
}

.detail-tags {
    display: flex;
    gap: 6px;
    margin-bottom: 10px;
}

.detail-content {
    line-height: 1.7;
    color: #333;
    padding: 4px 0;
}
</style>