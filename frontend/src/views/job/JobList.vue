<template>
    <div class="job-user-page">
        <!-- 顶部标题栏 -->
        <div class="page-header-card">
            <div class="header-left">
                <el-icon class="header-icon">
                    <Briefcase />
                </el-icon>
                <div>
                    <h2>职位中心</h2>
                    <p>浏览全岛优质岗位，一键投递求职</p>
                </div>
            </div>
        </div>

        <!-- 筛选区 -->
        <div class="filter-card">
            <div class="filter-left">
                <el-input v-model="searchKey" placeholder="搜索职位名称/地点/薪资" style="width: 280px" clearable
                    @keyup.enter="getJobList" />
                <el-select v-model="statusFilter" placeholder="招聘状态" style="width: 150px" @change="getJobList">
                    <el-option label="全部" value="" />
                    <el-option label="招聘中" value="1" />
                </el-select>
                <el-select v-model="eduFilter" placeholder="学历要求" style="width: 130px" @change="getJobList">
                    <el-option label="全部学历" value="" />
                    <el-option label="大专" value="大专" />
                    <el-option label="本科" value="本科" />
                    <el-option label="硕士" value="硕士" />
                </el-select>
            </div>
            <div class="filter-right">
                <el-button icon="Refresh" @click="resetFilter">重置</el-button>
                <el-button type="primary" icon="Search" @click="getJobList">搜索</el-button>
            </div>
        </div>

        <!-- 职位卡片 -->
        <div class="job-list-container">
            <el-row :gutter="20">
                <el-col :span="8" v-for="item in jobList" :key="item.id">
                    <el-card class="job-card" shadow="hover">
                        <div class="card-top">
                            <div class="job-name">{{ item.job_name }}</div>
                            <div class="job-salary">{{ item.salary }}</div>
                        </div>

                        <div class="job-company-info">
                            <el-icon>
                                <OfficeBuilding />
                            </el-icon>
                            企业编号：{{ item.company_id }}
                        </div>

                        <div class="tag-group">
                            <el-tag size="small" icon="LocationFilled">{{ item.city }}</el-tag>
                            <el-tag size="small" type="success">{{ item.edu }}</el-tag>
                            <el-tag size="small" type="warning">{{ item.exp }}</el-tag>
                            <el-tag size="small" type="success">招聘中</el-tag>
                        </div>

                        <div class="skill-info">
                            <el-icon>
                                <Tools />
                            </el-icon>
                            <span>技能要求：{{ item.skill || '无' }}</span>
                        </div>

                        <div class="job-content">
                            {{ item.content || '暂无描述' }}
                        </div>

                        <div class="card-footer">
                            <el-button type="primary" size="small" @click="toApply(item.id)">
                                立即投递
                            </el-button>
                            <el-button size="small" @click="openDetail(item)">查看详情</el-button>
                        </div>
                    </el-card>
                </el-col>
            </el-row>
        </div>

        <el-empty v-if="jobList.length === 0 && !loading" description="暂无职位数据" style="padding:40px" />

        <!-- 分页 -->
        <div class="pagination-box">
            <el-pagination v-model:current-page="page" v-model:page-size="limit" :total="total"
                layout="total, sizes, prev, pager, next, jumper" background @current-change="getJobList" />
        </div>

        <!-- 详情弹窗 -->
        <el-dialog v-model="detailVisible" title="职位详情" width="650px" center>
            <div class="detail-box">
                <h3>{{ detailInfo.job_name }}</h3>
                <div class="detail-salary">{{ detailInfo.salary }}</div>
                <div class="detail-tags">
                    <el-tag size="small">{{ detailInfo.city }}</el-tag>
                    <el-tag size="small">{{ detailInfo.edu }}</el-tag>
                    <el-tag size="small">{{ detailInfo.exp }}</el-tag>
                </div>
                <el-divider>职位描述</el-divider>
                <div class="detail-content">{{ detailInfo.content || '暂无描述' }}</div>
                <el-divider>技能要求</el-divider>
                <div class="detail-skill">{{ detailInfo.skill || '无' }}</div>
            </div>
            <template #footer>
                <el-button @click="detailVisible = false">关闭</el-button>
                <el-button type="primary" @click="toApply(detailInfo.id)">立即投递简历</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Briefcase, OfficeBuilding, Tools, LocationFilled } from '@element-plus/icons-vue'
import axios from '../../utils/request'

const loading = ref(false)
const searchKey = ref('')
const statusFilter = ref('1') // 只看招聘中
const eduFilter = ref('')
const page = ref(1)
const limit = ref(12)
const total = ref(0)
const jobList = ref([])

// 详情
const detailVisible = ref(false)
const detailInfo = reactive({})

// 获取职位
const getJobList = async () => {
    loading.value = true
    try {
        const res = await axios.get('/api/job/list', {
            params: {
                page: page.value,
                limit: limit.value,
                searchKey: searchKey.value,
                status: statusFilter.value,
                edu: eduFilter.value
            }
        })
        if (res.data.code === 200) {
            jobList.value = res.data.data.list
            total.value = res.data.data.total
        }
    } catch (err) {
        ElMessage.error('获取职位失败')
    } finally {
        loading.value = false
    }
}

// 重置筛选
const resetFilter = () => {
    searchKey.value = ''
    statusFilter.value = '1'
    eduFilter.value = ''
    getJobList()
}

// 查看详情
const openDetail = (item) => {
    Object.assign(detailInfo, item)
    detailVisible.value = true
}

// 投递简历
const toApply = async (id) => {
    if (!id) return ElMessage.warning('职位ID错误')
    try {
        const res = await axios.post('/api/apply/add', { job_id: id })
        if (res.data.code === 200) {
            ElMessage.success('投递成功！')
        } else {
            ElMessage.error(res.data.msg || '投递失败')
        }
    } catch (e) {
        ElMessage.error('请先完善简历')
    }
}

onMounted(() => {
    getJobList()
})
</script>

<style scoped>
.job-user-page {
    padding: 24px;
    background: #f7f8fa;
    min-height: 100vh;
}

/* 顶部标题 */
.page-header-card {
    background: linear-gradient(135deg, #409eff, #69b1ff);
    padding: 20px 24px;
    border-radius: 14px;
    color: #fff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    box-shadow: 0 4px 12px rgba(64, 158, 255, 0.15);
}

.header-left {
    display: flex;
    align-items: center;
    gap: 14px;
}

.header-icon {
    font-size: 26px;
}

.header-left h2 {
    margin: 0;
    font-size: 22px;
}

.header-left p {
    margin: 4px 0 0;
    opacity: 0.92;
    font-size: 14px;
}

/* 筛选 */
.filter-card {
    background: #fff;
    padding: 16px 20px;
    border-radius: 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.filter-left {
    display: flex;
    gap: 12px;
    align-items: center;
}

/* 职位卡片 */
.job-list-container {
    margin-bottom: 20px;
}

.job-card {
    border-radius: 14px;
    overflow: hidden;
    transition: all 0.28s ease;
}

.job-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 20px rgba(64, 158, 255, 0.1);
}

.card-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
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

.job-company-info {
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

.skill-info {
    font-size: 13px;
    color: #666;
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    gap: 4px;
}

.job-content {
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

.pagination-box {
    display: flex;
    justify-content: center;
    padding: 10px 0;
}

/* 详情样式 */
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

.detail-content,
.detail-skill {
    line-height: 1.7;
    color: #333;
    padding: 4px 0;
}
</style>