<template>
    <div class="job-manage-container">
        <!-- 顶部标题 -->
        <div class="page-header">
            <h2>职位管理</h2>
            <el-button type="primary" @click="handleAdd">
                <el-icon>
                    <Plus />
                </el-icon>
                新增职位
            </el-button>
        </div>

        <!-- 搜索筛选区域 -->
        <div class="search-box">
            <el-form :inline="true" :model="searchForm" class="search-form">
                <el-form-item label="职位名称">
                    <el-input v-model="searchForm.name" placeholder="请输入职位名称" style="width: 220px" clearable />
                </el-form-item>
                <el-form-item label="招聘状态">
                    <el-select v-model="searchForm.status" placeholder="请选择状态" style="width: 160px" clearable>
                        <el-option label="招聘中" value="1" />
                        <el-option label="已停止" value="0" />
                    </el-select>
                </el-form-item>
                <el-form-item label="工作城市">
                    <el-input v-model="searchForm.city" placeholder="请输入城市" style="width: 160px" clearable />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="getList">
                        <el-icon>
                            <Search />
                        </el-icon>
                        查询
                    </el-button>
                    <el-button @click="resetSearch">
                        <el-icon>
                            <Refresh />
                        </el-icon>
                        重置
                    </el-button>
                </el-form-item>
            </el-form>
        </div>

        <!-- 表格 -->
        <div class="table-box">
            <el-table :data="tableData" border stripe style="width: 100%" header-cell-class-name="table-header">
                <el-column label="序号" type="index" width="80" align="center" />
                <el-column label="职位名称" prop="name" min-width="180" />
                <el-column label="薪资范围" prop="salary" width="160" />
                <el-column label="工作城市" prop="city" width="140" />
                <el-column label="招聘人数" prop="num" width="120" align="center" />
                <el-column label="发布时间" prop="createTime" width="180" />
                <el-column label="状态" width="120" align="center">
                    <template #default="{ row }">
                        <el-tag :type="row.status === 1 ? 'success' : 'danger'">
                            {{ row.status === 1 ? '招聘中' : '已停止' }}
                        </el-tag>
                    </template>
                </el-column>
                <el-column label="操作" width="240" align="center">
                    <template #default="{ row }">
                        <el-button type="primary" icon="Edit" size="small" @click="handleEdit(row)">
                            编辑
                        </el-button>
                        <el-button type="warning" icon="View" size="small" @click="handleDetail(row)">
                            详情
                        </el-button>
                        <el-button type="danger" icon="Delete" size="small" @click="handleDelete(row.id)">
                            删除
                        </el-button>
                    </template>
                </el-column>
            </el-table>

            <!-- 分页 -->
            <div class="pagination-box">
                <el-pagination v-model:current-page="page" v-model:page-size="limit" total="100"
                    layout="total, sizes, prev, pager, next, jumper" @size-change="getList" @current-change="getList" />
            </div>
        </div>

        <!-- 新增/编辑弹窗 -->
        <el-dialog v-model="dialogVisible" title="职位信息" width="600px" destroy-on-close>
            <el-form ref="formRef" :model="form" label-width="100px" class="dialog-form">
                <el-form-item label="职位名称" prop="name">
                    <el-input v-model="form.name" placeholder="请输入职位名称" />
                </el-form-item>
                <el-form-item label="薪资范围" prop="salary">
                    <el-input v-model="form.salary" placeholder="例：15K-25K" />
                </el-form-item>
                <el-form-item label="工作城市" prop="city">
                    <el-input v-model="form.city" placeholder="请输入工作城市" />
                </el-form-item>
                <el-form-item label="招聘人数" prop="num">
                    <el-input-number v-model="form.num" :min="1" :max="99" />
                </el-form-item>
                <el-form-item label="招聘状态" prop="status">
                    <el-radio-group v-model="form.status">
                        <el-radio :label="1">招聘中</el-radio>
                        <el-radio :label="0">已停止</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="职位描述">
                    <el-input v-model="form.desc" type="textarea" rows="4" placeholder="请输入职位描述" />
                </el-form-item>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="dialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="submitForm">
                        确认提交
                    </el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
    Plus,
    Search,
    Refresh,
    Edit,
    View,
    Delete
} from '@element-plus/icons-vue'

// 查询条件
const searchForm = reactive({
    name: '',
    status: '',
    city: ''
})

// 表格数据
const tableData = ref([])
const page = ref(1)
const limit = ref(10)

// 弹窗
const dialogVisible = ref(false)
const formRef = ref()
const form = reactive({
    id: '',
    name: '',
    salary: '',
    city: '',
    num: 1,
    status: 1,
    desc: ''
})

// 模拟数据
const mockData = [
    { id: 1, name: '前端开发工程师', salary: '15K-25K', city: '北京', num: 3, createTime: '2025-01-01 10:00', status: 1 },
    { id: 2, name: '后端Java工程师', salary: '18K-30K', city: '上海', num: 2, createTime: '2025-01-02 09:30', status: 1 },
    { id: 3, name: '产品经理', salary: '20K-35K', city: '广州', num: 1, createTime: '2025-01-03 14:20', status: 0 },
    { id: 4, name: 'UI设计师', salary: '12K-20K', city: '深圳', num: 2, createTime: '2025-01-04 11:10', status: 1 },
]

// 获取列表
const getList = () => {
    tableData.value = mockData
}

// 重置查询
const resetSearch = () => {
    searchForm.name = ''
    searchForm.status = ''
    searchForm.city = ''
    getList()
}

// 新增
const handleAdd = () => {
    dialogVisible.value = true
    Object.assign(form, {
        id: '',
        name: '',
        salary: '',
        city: '',
        num: 1,
        status: 1,
        desc: ''
    })
}

// 编辑
const handleEdit = (row) => {
    dialogVisible.value = true
    Object.assign(form, row)
}

// 详情
const handleDetail = (row) => {
    ElMessage.info(`查看【${row.name}】详情`)
}

// 删除
const handleDelete = async (id) => {
    await ElMessageBox.confirm('确定要删除该职位吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    })
    tableData.value = tableData.value.filter(item => item.id !== id)
    ElMessage.success('删除成功！')
}

// 提交
const submitForm = () => {
    if (!form.name) {
        ElMessage.warning('请填写职位名称')
        return
    }
    dialogVisible.value = false
    ElMessage.success('提交成功！')
    getList()
}

onMounted(() => {
    getList()
})
</script>

<style scoped>
.job-manage-container {
    padding: 20px;
    background: #f5f7fa;
    min-height: calc(100vh - 60px);
}

.page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.page-header h2 {
    margin: 0;
    font-size: 22px;
    font-weight: 600;
    color: #333;
}

.search-box {
    background: #fff;
    padding: 16px 20px;
    border-radius: 8px;
    margin-bottom: 20px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.table-box {
    background: #fff;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.pagination-box {
    margin-top: 20px;
    text-align: right;
}

:deep(.table-header) {
    background-color: #f8f9fc !important;
    font-weight: 600;
}

.dialog-form {
    padding: 10px 0;
}

.dialog-footer {
    text-align: right;
}
</style>