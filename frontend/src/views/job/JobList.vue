<template>
    <div class="page-container">
        <div class="page-header">
            <div class="page-title">
                <h2>企业职位管理</h2>
                <p>发布、管理、编辑招聘岗位，统筹岗位招聘状态</p>
            </div>
            <el-button type="primary" icon="Plus" @click="openAddDialog" class="add-btn">
                新增招聘职位
            </el-button>
        </div>

        <!-- 筛选栏 -->
        <div class="filter-box">
            <el-input v-model="searchKey" placeholder="搜索职位名称/工作地点" style="width: 300px" clearable
                @keyup.enter="getJobList" />
            <el-select v-model="statusFilter" placeholder="招聘状态" style="width: 140px" @change="getJobList">
                <el-option label="全部状态" value="" />
                <el-option label="正常招聘" value="1" />
                <el-option label="暂停招聘" value="0" />
            </el-select>
            <el-button icon="Search" @click="getJobList">搜索</el-button>
        </div>

        <!-- 职位卡片列表 -->
        <div class="job-list">
            <el-row :gutter="20">
                <el-col :span="8" v-for="item in jobList" :key="item.id">
                    <el-card class="job-card" shadow="hover">
                        <div class="job-top">
                            <div class="job-name">{{ item.job_name }}</div>
                            <div class="job-salary">{{ item.salary }}</div>
                        </div>
                        <div class="job-company">
                            <el-icon>
                                <OfficeBuilding />
                            </el-icon>
                            企业ID：{{ item.company_id }}
                        </div>
                        <div class="job-info">
                            <el-tag size="small" type="info">{{ item.city }}</el-tag>
                            <el-tag size="small" type="success">{{ item.edu }}</el-tag>
                            <el-tag size="small" type="warning">{{ item.exp }}</el-tag>
                            <el-tag size="small" :type="item.status ? 'success' : 'danger'">
                                {{ item.status ? '招聘中' : '已暂停' }}
                            </el-tag>
                        </div>
                        <div class="job-skill">
                            <el-icon>
                                <Tools />
                            </el-icon>
                            <span>技能要求：{{ item.skill }}</span>
                        </div>
                        <div class="job-desc">{{ item.content }}</div>
                        <div class="job-btn">
                            <el-button type="primary" size="small" @click="openEditDialog(item)">编辑</el-button>
                            <el-button :type="item.status ? 'warning' : 'success'" size="small"
                                @click="handleSwitchStatus(item)">
                                {{ item.status ? '暂停招聘' : '开启招聘' }}
                            </el-button>
                            <el-button type="danger" size="small" @click="handleDelete(item.id)">删除</el-button>
                        </div>
                    </el-card>
                </el-col>
            </el-row>
        </div>

        <!-- 空数据 -->
        <el-empty v-if="jobList.length === 0 && !loading" description="暂无招聘职位"></el-empty>

        <!-- 分页 -->
        <div class="pagination-box">
            <el-pagination v-model:current-page="page" v-model:page-size="limit" :total="total"
                layout="prev, pager, next, jumper, ->, total" @current-change="getJobList" @size-change="getJobList" />
        </div>

        <!-- 新增/编辑弹窗 -->
        <el-dialog v-model="dialogVisible" title="职位编辑" width="650px" destroy-on-close>
            <el-form :model="formData" label-width="90px">
                <el-form-item label="企业ID">
                    <el-input v-model="formData.company_id" placeholder="请输入企业ID"></el-input>
                </el-form-item>
                <el-form-item label="职位名称">
                    <el-input v-model="formData.job_name" placeholder="请输入职位名称"></el-input>
                </el-form-item>
                <el-form-item label="薪资范围">
                    <el-input v-model="formData.salary" placeholder="例如：6000-10000"></el-input>
                </el-form-item>
                <el-form-item label="工作地点">
                    <el-input v-model="formData.city" placeholder="海口/三亚/琼海"></el-input>
                </el-form-item>
                <el-form-item label="学历要求">
                    <el-select v-model="formData.edu">
                        <el-option label="不限" value="不限" />
                        <el-option label="大专" value="大专" />
                        <el-option label="本科" value="本科" />
                        <el-option label="硕士" value="硕士" />
                    </el-select>
                </el-form-item>
                <el-form-item label="经验要求">
                    <el-select v-model="formData.exp">
                        <el-option label="不限" value="不限" />
                        <el-option label="1年以上" value="1年以上" />
                        <el-option label="1-3年" value="1-3年" />
                        <el-option label="2年以上" value="2年以上" />
                    </el-select>
                </el-form-item>
                <el-form-item label="技能要求">
                    <el-input v-model="formData.skill" placeholder="例如：Java,MySQL,SpringBoot"></el-input>
                </el-form-item>
                <el-form-item label="职位描述">
                    <el-input v-model="formData.content" type="textarea" rows="4" placeholder="填写岗位职责与工作内容"></el-input>
                </el-form-item>
                <el-form-item label="招聘状态">
                    <el-radio-group v-model="formData.status">
                        <el-radio :label="1">正常招聘</el-radio>
                        <el-radio :label="0">暂停招聘</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="submitForm" :loading="submitLoading">保存提交</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { OfficeBuilding, Tools } from '@element-plus/icons-vue'
import axios from 'axios'

// 基础配置
const baseURL = 'http://127.0.0.1:8000/api' // 你的后端地址

// 状态
const loading = ref(false)
const submitLoading = ref(false)
const searchKey = ref('')
const statusFilter = ref('')
const dialogVisible = ref(false)
const page = ref(1)
const limit = ref(10)
const total = ref(0)
const jobList = ref([])

// 表单数据（和数据库字段对齐）
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

// 获取职位列表
const getJobList = async () => {
    loading.value = true
    try {
        const res = await axios.get(`${baseURL}/job/list`, {
            params: {
                page: page.value,
                limit: limit.value,
                searchKey: searchKey.value,
                status: statusFilter.value
            }
        })
        if (res.data.code === 200) {
            jobList.value = res.data.data.list
            total.value = res.data.data.total
        }
    } catch (err) {
        ElMessage.error('获取列表失败')
        console.error(err)
    } finally {
        loading.value = false
    }
}

// 打开新增弹窗
const openAddDialog = () => {
    dialogVisible.value = true
    Object.assign(formData, {
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
}

// 打开编辑弹窗
const openEditDialog = (item) => {
    dialogVisible.value = true
    Object.assign(formData, item)
}

// 切换状态
const handleSwitchStatus = async (item) => {
    try {
        const res = await axios.post(`${baseURL}/job/switchStatus`, {
            id: item.id,
            status: item.status ? 0 : 1
        })
        if (res.data.code === 200) {
            ElMessage.success(item.status ? '已暂停招聘' : '已开启招聘')
            getJobList()
        }
    } catch (err) {
        ElMessage.error('状态更新失败')
    }
}

// 删除职位
const handleDelete = async (id) => {
    await ElMessageBox.confirm('确定删除该招聘职位？删除后不可恢复', '温馨提示', { type: 'warning' })
    try {
        const res = await axios.post(`${baseURL}/job/delete/${id}`)
        if (res.data.code === 200) {
            ElMessage.success('删除成功')
            getJobList()
        }
    } catch (err) {
        ElMessage.error('删除失败')
    }
}

// 提交表单
const submitForm = async () => {
    if (!formData.job_name) return ElMessage.warning('请填写职位名称')
    if (!formData.salary) return ElMessage.warning('请填写薪资范围')
    submitLoading.value = true
    try {
        const res = await axios.post(`${baseURL}/job/save`, formData)
        if (res.data.code === 200) {
            ElMessage.success('保存成功')
            dialogVisible.value = false
            getJobList()
        } else {
            ElMessage.warning(res.data.msg || '保存失败')
        }
    } catch (err) {
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
.page-container {
    padding: 20px;
    background: #f5f7fa;
    min-height: calc(100vh - 120px);
}

.page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
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

.filter-box {
    display: flex;
    gap: 15px;
    align-items: center;
    background: #fff;
    padding: 15px 20px;
    border-radius: 8px;
    margin-bottom: 20px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.job-list {
    margin-bottom: 20px;
}

.job-card {
    border-radius: 12px;
    transition: all 0.3s ease;
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
    font-weight: 600;
    color: #333;
}

.job-salary {
    color: #f56c6c;
    font-weight: bold;
    font-size: 15px;
}

.job-company {
    color: #666;
    font-size: 14px;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    gap: 4px;
}

.job-info {
    margin-bottom: 12px;
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
}

.job-skill {
    font-size: 13px;
    color: #666;
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    gap: 4px;
}

.job-desc {
    font-size: 13px;
    color: #999;
    line-height: 1.5;
    margin-bottom: 15px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.job-btn {
    text-align: right;
    display: flex;
    gap: 8px;
    justify-content: flex-end;
}

.pagination-box {
    display: flex;
    justify-content: flex-end;
    padding: 10px 0;
}
</style>