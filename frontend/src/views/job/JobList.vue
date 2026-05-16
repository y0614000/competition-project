<template>
    <div class="page-container">
        <div class="page-title">
            <h2>企业职位管理</h2>
            <p>发布、管理、编辑招聘岗位，统筹岗位招聘状态</p>
        </div>

        <!-- 顶部操作栏 -->
        <div class="operation-box">
            <el-input v-model="searchKey" placeholder="搜索职位名称/工作地点" style="width: 300px" clearable />
            <el-select v-model="statusFilter" placeholder="招聘状态" style="width: 140px">
                <el-option label="全部状态" value="" />
                <el-option label="正常招聘" value="1" />
                <el-option label="暂停招聘" value="0" />
            </el-select>
            <el-button type="primary" icon="Plus" @click="openAddDialog">新增招聘职位</el-button>
        </div>

        <!-- 职位卡片列表 -->
        <el-row :gutter="20" style="margin-top: 20px">
            <el-col :span="8" v-for="item in filterJobList" :key="item.id">
                <el-card class="job-card" shadow="hover">
                    <div class="job-top">
                        <div class="job-name">{{ item.name }}</div>
                        <div class="job-salary">{{ item.salary }}</div>
                    </div>
                    <div class="job-company">{{ item.company }}</div>
                    <div class="job-info">
                        <el-tag size="small">{{ item.city }}</el-tag>
                        <el-tag size="small" type="success">{{ item.type }}</el-tag>
                        <el-tag size="small" type="info">{{ item.experience }}</el-tag>
                        <el-tag size="small" :type="item.status ? 'success' : 'danger'">
                            {{ item.status ? '招聘中' : '已暂停' }}
                        </el-tag>
                    </div>
                    <div class="job-desc">{{ item.desc }}</div>
                    <div class="job-stat">
                        <span>招聘人数：{{ item.needNum }}人</span>
                        <span>投递简历：{{ item.resumeCount }}份</span>
                    </div>
                    <div class="job-btn">
                        <el-button type="primary" size="small" @click="openEditDialog(item)">编辑</el-button>
                        <el-button :type="item.status ? 'warning' : 'success'" size="small" @click="switchStatus(item)">
                            {{ item.status ? '暂停招聘' : '开启招聘' }}
                        </el-button>
                        <el-button type="danger" size="small" @click="deleteJob(item.id)">删除</el-button>
                    </div>
                </el-card>
            </el-col>
        </el-row>

        <!-- 空数据提示 -->
        <el-empty v-if="filterJobList.length === 0" description="暂无招聘职位"></el-empty>

        <!-- 新增/编辑职位弹窗 -->
        <el-dialog v-model="dialogVisible" title="职位编辑" width="650px" destroy-on-close>
            <el-form :model="formData" label-width="90px">
                <el-form-item label="职位名称">
                    <el-input v-model="formData.name" placeholder="请输入职位名称"></el-input>
                </el-form-item>
                <el-form-item label="薪资范围">
                    <el-input v-model="formData.salary" placeholder="例如：6K-12K"></el-input>
                </el-form-item>
                <el-form-item label="工作地点">
                    <el-input v-model="formData.city" placeholder="海口/三亚/儋州"></el-input>
                </el-form-item>
                <el-form-item label="招聘人数">
                    <el-input-number v-model="formData.needNum" :min="1"></el-input-number>
                </el-form-item>
                <el-form-item label="工作性质">
                    <el-select v-model="formData.type">
                        <el-option label="全职" value="全职" />
                        <el-option label="兼职" value="兼职" />
                        <el-option label="实习" value="实习" />
                    </el-select>
                </el-form-item>
                <el-form-item label="经验要求">
                    <el-select v-model="formData.experience">
                        <el-option label="不限经验" value="不限" />
                        <el-option label="应届生" value="应届生" />
                        <el-option label="1-3年" value="1-3年" />
                        <el-option label="3-5年" value="3-5年" />
                    </el-select>
                </el-form-item>
                <el-form-item label="职位简介">
                    <el-input v-model="formData.desc" type="textarea" rows="4" placeholder="填写岗位职责与工作内容"></el-input>
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
                <el-button type="primary" @click="submitForm">保存提交</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// 搜索筛选
const searchKey = ref('')
const statusFilter = ref('')

// 弹窗控制
const dialogVisible = ref(false)
// 表单数据
const formData = reactive({
    id: '',
    name: '',
    salary: '',
    city: '',
    needNum: 1,
    type: '全职',
    experience: '不限',
    desc: '',
    status: 1,
    company: '海南自贸港科技企业',
    resumeCount: 0
})

// 职位列表数据
const jobList = ref([
    {
        id: 1,
        name: '前端开发工程师',
        salary: '6K-12K',
        company: '海南科技有限公司',
        city: '海口',
        type: '全职',
        experience: '1-3年',
        desc: '负责页面搭建与交互开发，参与项目迭代优化，适配多端页面展示',
        needNum: 5,
        status: 1,
        resumeCount: 28
    },
    {
        id: 2,
        name: '后端Java工程师',
        salary: '8K-16K',
        company: '自贸港信息科技',
        city: '三亚',
        type: '全职',
        experience: '2-5年',
        desc: '负责接口开发、数据库设计、服务端业务实现，保障系统稳定运行',
        needNum: 3,
        status: 1,
        resumeCount: 16
    },
    {
        id: 3,
        name: 'UI设计师',
        salary: '5K-10K',
        company: '海南智慧医疗',
        city: '儋州',
        type: '全职',
        experience: '1年',
        desc: '负责产品界面设计、图标设计、视觉输出，把控整体页面风格',
        needNum: 2,
        status: 0,
        resumeCount: 9
    },
    {
        id: 4,
        name: '产品经理',
        salary: '10K-20K',
        company: '海南数字经济',
        city: '海口',
        type: '全职',
        experience: '3-5年',
        desc: '负责需求分析、产品规划、项目推进与迭代，对接多方需求',
        needNum: 2,
        status: 1,
        resumeCount: 35
    },
    {
        id: 5,
        name: '人事专员',
        salary: '4K-7K',
        company: '海南人才服务中心',
        city: '琼海',
        type: '全职',
        experience: '不限',
        desc: '负责招聘、员工关系、考勤管理等日常行政人事工作',
        needNum: 4,
        status: 1,
        resumeCount: 12
    },
    {
        id: 6,
        name: '测试工程师',
        salary: '7K-13K',
        company: '海南软件产业园',
        city: '三亚',
        type: '全职',
        experience: '1-3年',
        desc: '负责系统功能测试、接口测试、缺陷管理，出具测试报告',
        needNum: 3,
        status: 0,
        resumeCount: 7
    }
])

// 筛选过滤
const filterJobList = computed(() => {
    return jobList.value.filter(item => {
        const matchText = item.name.includes(searchKey.value) || item.city.includes(searchKey.value)
        const matchStatus = statusFilter.value === '' || item.status == statusFilter.value
        return matchText && matchStatus
    })
})

// 打开新增
const openAddDialog = () => {
    dialogVisible.value = true
    Object.assign(formData, {
        id: '',
        name: '',
        salary: '',
        city: '',
        needNum: 1,
        type: '全职',
        experience: '不限',
        desc: '',
        status: 1,
        resumeCount: 0
    })
}

// 打开编辑
const openEditDialog = (item) => {
    dialogVisible.value = true
    Object.assign(formData, item)
}

// 切换招聘状态
const switchStatus = (item) => {
    item.status = item.status ? 0 : 1
    ElMessage.success(item.status ? '已开启招聘' : '已暂停招聘')
}

// 删除职位
const deleteJob = async (id) => {
    await ElMessageBox.confirm('确定删除该招聘职位？删除后不可恢复', '温馨提示', { type: 'warning' })
    jobList.value = jobList.value.filter(item => item.id !== id)
    ElMessage.success('删除成功')
}

// 提交表单
const submitForm = () => {
    if (!formData.name) return ElMessage.warning('请填写职位名称')
    if (!formData.salary) return ElMessage.warning('请填写薪资范围')

    if (formData.id) {
        // 编辑
        const index = jobList.value.findIndex(v => v.id === formData.id)
        if (index > -1) {
            jobList.value[index] = { ...formData }
        }
    } else {
        // 新增
        const newId = Math.floor(Math.random() * 1000)
        jobList.value.unshift({ ...formData, id: newId })
    }
    dialogVisible.value = false
    ElMessage.success('职位信息保存成功')
}
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

.operation-box {
    display: flex;
    gap: 15px;
    align-items: center;
    flex-wrap: wrap;
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
    margin-bottom: 10px;
}

.job-stat {
    font-size: 13px;
    color: #666;
    display: flex;
    justify-content: space-between;
    margin-bottom: 15px;
}

.job-btn {
    text-align: right;
    display: flex;
    gap: 8px;
    justify-content: flex-end;
}
</style>