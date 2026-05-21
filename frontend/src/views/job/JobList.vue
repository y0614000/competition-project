<template>
    <div class="job-manage-page">
        <!-- 顶部标题栏 -->
        <div class="page-header-card">
            <div class="header-left">
                <el-icon class="header-icon">
                    <OfficeBuilding />
                </el-icon>
                <div>
                    <h2>企业职位管理</h2>
                    <p>发布、管理、编辑招聘岗位，统筹岗位招聘状态</p>
                </div>
            </div>
            <el-button type="primary" icon="Plus" @click="openAddDialog">
                新增招聘职位
            </el-button>
        </div>

        <!-- 数据统计面板 -->
        <div class="stat-panel">
            <el-row :gutter="20">
                <el-col :span="6">
                    <div class="stat-item blue">
                        <div class="stat-number">{{ total }}</div>
                        <div class="stat-label">总发布职位</div>
                    </div>
                </el-col>
                <el-col :span="6">
                    <div class="stat-item green">
                        <div class="stat-number">{{jobList.filter(i => i.status).length}}</div>
                        <div class="stat-label">正在招聘</div>
                    </div>
                </el-col>
                <el-col :span="6">
                    <div class="stat-item orange">
                        <div class="stat-number">{{jobList.filter(i => !i.status).length}}</div>
                        <div class="stat-label">已暂停</div>
                    </div>
                </el-col>
                <el-col :span="6">
                    <div class="stat-item purple">
                        <div class="stat-number">{{ cityCount }}</div>
                        <div class="stat-label">覆盖城市</div>
                    </div>
                </el-col>
            </el-row>
        </div>

        <!-- 筛选区 -->
        <div class="filter-card">
            <div class="filter-left">
                <el-input v-model="searchKey" placeholder="搜索职位名称/地点/技能" style="width: 280px" clearable
                    @keyup.enter="getJobList" />
                <el-select v-model="statusFilter" placeholder="招聘状态" style="width: 150px" @change="getJobList">
                    <el-option label="全部" value="" />
                    <el-option label="招聘中" value="1" />
                    <el-option label="已暂停" value="0" />
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
                            企业ID：{{ item.company_id }}
                        </div>

                        <div class="tag-group">
                            <el-tag size="small" icon="LocationFilled">{{ item.city }}</el-tag>
                            <el-tag size="small" type="success">{{ item.edu }}</el-tag>
                            <el-tag size="small" type="warning">{{ item.exp }}</el-tag>
                            <el-tag size="small" :type="item.status ? 'success' : 'danger'">
                                {{ item.status ? '招聘中' : '已暂停' }}
                            </el-tag>
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
                            <el-button type="primary" size="small" @click="openEditDialog(item)">编辑</el-button>
                            <el-button :type="item.status ? 'warning' : 'success'" size="small"
                                @click="handleSwitchStatus(item)">
                                {{ item.status ? '暂停' : '启用' }}
                            </el-button>
                            <el-button type="danger" size="small" @click="handleDelete(item.id)">删除</el-button>
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

        <!-- 弹窗 -->
        <el-dialog v-model="dialogVisible" title="职位信息" width="700px" center>
            <el-form :model="formData" label-width="100px" label-position="top">
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="企业ID">
                            <el-input v-model="formData.company_id" placeholder="请输入企业ID" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="职位名称">
                            <el-input v-model="formData.job_name" placeholder="请输入职位名称" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="薪资范围">
                            <el-input v-model="formData.salary" placeholder="如：6000-10000" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="工作地点">
                            <el-input v-model="formData.city" placeholder="海口/三亚等" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="学历要求">
                            <el-select v-model="formData.edu">
                                <el-option label="不限" value="不限" />
                                <el-option label="大专" value="大专" />
                                <el-option label="本科" value="本科" />
                                <el-option label="硕士" value="硕士" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="经验要求">
                            <el-select v-model="formData.exp">
                                <el-option label="不限" value="不限" />
                                <el-option label="1年以上" value="1年以上" />
                                <el-option label="1-3年" value="1-3年" />
                                <el-option label="3-5年" value="3-5年" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="技能要求">
                            <el-input v-model="formData.skill" type="textarea" rows="2" placeholder="Java/MySQL/前端等" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="职位描述">
                            <el-input v-model="formData.content" type="textarea" rows="4" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="招聘状态">
                            <el-radio-group v-model="formData.status">
                                <el-radio :label="1">正常招聘</el-radio>
                                <el-radio :label="0">暂停招聘</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <template #footer>
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="submitForm" :loading="submitLoading">保存提交</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { OfficeBuilding, Tools, LocationFilled } from '@element-plus/icons-vue'
import axios from '../../utils/request'

const loading = ref(false)
const submitLoading = ref(false)
const searchKey = ref('')
const statusFilter = ref('')
const eduFilter = ref('')
const dialogVisible = ref(false)
const page = ref(1)
const limit = ref(12)
const total = ref(0)
const jobList = ref([])

const formData = reactive({
    id: '',
    company_id: '',
    job_name: '',
    salary: '',
    city: '',
    edu: '大专',
    exp: '不限',
    skill: '',
    content: '',
    status: 1
})

// 统计城市数量
const cityCount = computed(() => {
    let arr = jobList.value.map(i => i.city)
    return new Set(arr).size
})

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
        ElMessage.error('获取失败')
    } finally {
        loading.value = false
    }
}

// 重置筛选
const resetFilter = () => {
    searchKey.value = ''
    statusFilter.value = ''
    eduFilter.value = ''
    getJobList()
}

// 新增
const openAddDialog = () => {
    dialogVisible.value = true
    Object.assign(formData, {
        id: '', company_id: '', job_name: '', salary: '', city: '',
        edu: '大专', exp: '不限', skill: '', content: '', status: 1
    })
}

// 编辑
const openEditDialog = (item) => {
    dialogVisible.value = true
    Object.assign(formData, item)
}

// 状态切换
const handleSwitchStatus = async (item) => {
    try {
        const res = await axios.post('/api/job/switchStatus', {
            id: item.id,
            status: item.status ? 0 : 1
        })
        if (res.data.code === 200) {
            ElMessage.success('状态已更新')
            getJobList()
        }
    } catch (e) { ElMessage.error('操作失败') }
}

// 删除
const handleDelete = async (id) => {
  if (!id) {
    ElMessage.error('ID不能为空')
    return
  }

  try {
    await ElMessageBox.confirm('确认删除该职位？', '提示', {
      type: 'warning'
    })
  } catch {
    return
  }

  try {
    // 重点：后端是 post 参数 id，不是 url 拼接！
    const res = await axios.post('/api/job/delete', {
      id: id
    })

    if (res.data.code === 200) {
      ElMessage.success('删除成功')
      getJobList()
    } else {
      ElMessage.error(res.data.msg || '删除失败')
    }
  } catch (e) {
    console.error(e)
    ElMessage.error('删除请求异常')
  }
}

// 提交
const submitForm = async () => {
    if (!formData.job_name || !formData.salary) return ElMessage.warning('请完善必填项')
    submitLoading.value = true
    try {
        const res = await axios.post('/api/job/save', formData)
        if (res.data.code === 200) {
            ElMessage.success('保存成功')
            dialogVisible.value = false
            getJobList()
        }
    } catch (e) {
        ElMessage.error('保存失败')
    } finally {
        submitLoading.value = false
    }
}

onMounted(() => {
    getJobList()
})
</script>

<style scoped>
.job-manage-page {
    padding: 24px;
    background: #f5f7fa;
    min-height: 100vh;
}

/* 顶部标题卡片 */
.page-header-card {
    background: linear-gradient(135deg, #0066b3, #409eff);
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

/* 筛选栏 */
.filter-card {
    background: white;
    padding: 16px 20px;
    border-radius: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
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
</style>