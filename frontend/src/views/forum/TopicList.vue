<template>
    <div class="topic-list-container">
        <!-- 顶部标题 -->
        <div class="page-header">
            <h2>话题管理</h2>
            <el-button type="primary" @click="handleAdd">
                <el-icon>
                    <Plus />
                </el-icon>
                发布话题
            </el-button>
        </div>

        <!-- 搜索筛选 -->
        <div class="search-box">
            <el-form :inline="true" :model="searchForm" class="search-form">
                <el-form-item label="话题标题">
                    <el-input v-model="searchForm.title" placeholder="请输入标题" style="width: 240px" clearable />
                </el-form-item>
                <el-form-item label="状态">
                    <el-select v-model="searchForm.status" placeholder="请选择" style="width: 150px" clearable>
                        <el-option label="正常" value="1" />
                        <el-option label="隐藏" value="0" />
                    </el-select>
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
            <el-table :data="tableData" border stripe style="width: 100%" header-cell-class-name="table-header"
                v-loading="loading">
                <el-table-column label="序号" type="index" width="70" align="center" />
                <el-table-column label="话题标题" prop="title" min-width="220" />
                <el-table-column label="发布人" prop="author" width="120" />
                <el-table-column label="查看人数" prop="views" width="100" align="center" />
                <el-table-column label="评论数" prop="comments" width="100" align="center" />
                <el-table-column label="发布时间" prop="create_time" width="180" />
                <el-table-column label="状态" width="100" align="center">
                    <template #default="scope">
                        <el-tag :type="scope.row.status === 1 ? 'success' : 'danger'">
                            {{ scope.row.status === 1 ? '正常' : '隐藏' }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="260" align="center">
                    <template #default="scope">
                        <el-button type="primary" size="small" @click="handleEdit(scope.row)">编辑</el-button>
                        <el-button type="warning" size="small" @click="handleDetail(scope.row)">详情</el-button>
                        <el-button type="danger" size="small" @click="handleDelete(scope.row.id)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 分页 -->
            <div class="pagination-box">
                <el-pagination v-model:current-page="page" v-model:page-size="limit" :total="total"
                    layout="total, sizes, prev, pager, next, jumper" @size-change="getList" @current-change="getList" />
            </div>
        </div>

        <!-- 新增 / 编辑弹窗 -->
        <el-dialog v-model="dialogVisible" title="话题信息" width="650px" destroy-on-close>
            <el-form ref="formRef" :model="form" label-width="100px" class="dialog-form">
                <el-form-item label="话题标题" prop="title">
                    <el-input v-model="form.title" placeholder="请输入标题" />
                </el-form-item>
                <el-form-item label="话题内容">
                    <el-input v-model="form.content" type="textarea" rows="5" placeholder="请输入内容" />
                </el-form-item>
                <el-form-item label="状态">
                    <el-radio-group v-model="form.status">
                        <el-radio :label="1">正常</el-radio>
                        <el-radio :label="0">隐藏</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="dialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="submitForm" :loading="submitLoading">确认提交</el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Search, Refresh } from '@element-plus/icons-vue'
import axios from 'axios'

const baseURL = 'http://127.0.0.1:8000/api'

// 查询条件
const searchForm = reactive({
    title: '',
    status: ''
})

// 表格数据与分页
const tableData = ref([])
const loading = ref(false)
const page = ref(1)
const limit = ref(10)
const total = ref(0)

// 弹窗与表单
const dialogVisible = ref(false)
const submitLoading = ref(false)
const form = reactive({
    id: '',
    title: '',
    content: '',
    author: '管理员',
    view: 0,
    comment: 0,
    status: 1
})

// 获取话题列表
const getList = async () => {
    loading.value = true
    try {
        const res = await axios.get(baseURL + '/forum/topic/list', {
            params: {
                page: page.value,
                limit: limit.value,
                title: searchForm.title,
                status: searchForm.status
            }
        })
        tableData.value = res.data.data.list
        total.value = res.data.data.total
    } catch (e) {
        ElMessage.error('加载话题列表失败')
    } finally {
        loading.value = false
    }
}

// 重置搜索
const resetSearch = () => {
    searchForm.title = ''
    searchForm.status = ''
    page.value = 1
    getList()
}

// 新增话题
const handleAdd = () => {
    dialogVisible.value = true
    Object.assign(form, {
        id: '',
        title: '',
        content: '',
        status: 1
    })
}

// 编辑话题
const handleEdit = (row) => {
    dialogVisible.value = true
    Object.assign(form, row)
}

// 查看详情
const handleDetail = (row) => {
    ElMessage.info(`查看：${row.title}`)
}

// 删除话题
const handleDelete = async (id) => {
    await ElMessageBox.confirm('确定删除该话题吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    })
    await axios.post(baseURL + '/forum/topic/delete', { id })
    ElMessage.success('删除成功！')
    getList()
}

// 提交表单（新增/编辑）
const submitForm = async () => {
    if (!form.title) {
        ElMessage.warning('请输入标题')
        return
    }
    submitLoading.value = true
    try {
        await axios.post(baseURL + '/forum/topic/save', form)
        ElMessage.success('操作成功！')
        dialogVisible.value = false
        getList()
    } finally {
        submitLoading.value = false
    }
}

onMounted(() => {
    getList()
})
</script>

<style scoped>
.topic-list-container {
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
    padding: 18px 20px;
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

.dialog-footer {
    text-align: right;
}
</style>