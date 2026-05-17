<template>
    <div class="topic-list-container">
        <div class="page-header">
            <h2>话题管理</h2>
            <el-button type="primary" @click="handleAdd">
                <el-icon>
                    <Plus />
                </el-icon>
                发布话题
            </el-button>
        </div>

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

        <div class="table-box">
            <el-table :data="tableData" border stripe style="width: 100%" header-cell-class-name="table-header"
                v-loading="loading">
                <el-table-column label="序号" type="index" width="70" align="center" />
                <el-table-column label="话题标题" prop="title" min-width="220" />
                <el-table-column label="发布人" prop="user_id" width="120" align="center" />
                <el-table-column label="查看人数" prop="view" width="100" align="center" />
                <el-table-column label="评论数" prop="comment" width="100" align="center" />
                <el-table-column label="发布时间" prop="createTime" width="180" align="center" />
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

            <div class="pagination-box">
                <el-pagination v-model:current-page="page" v-model:page-size="limit" :total="total"
                    layout="total, sizes, prev, pager, next, jumper" @size-change="getList" @current-change="getList" />
            </div>
        </div>

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

const searchForm = reactive({ title: '', status: '' })
const tableData = ref([])
const loading = ref(false)
const page = ref(1)
const limit = ref(10)
const total = ref(0)

const dialogVisible = ref(false)
const submitLoading = ref(false)
const form = reactive({
    id: '',
    title: '',
    content: '',
    status: 1
})

// 获取列表（已适配你的后端）
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
        if (res.data.code === 200) {
            tableData.value = res.data.data.list
            total.value = res.data.data.total
        }
    } catch (e) {
        ElMessage.error('加载失败')
    } finally {
        loading.value = false
    }
}

const resetSearch = () => {
    searchForm.title = ''
    searchForm.status = ''
    page.value = 1
    getList()
}

const handleAdd = () => {
    dialogVisible.value = true
    Object.assign(form, { id: '', title: '', content: '', status: 1 })
}

const handleEdit = (row) => {
    dialogVisible.value = true
    Object.assign(form, row)
}

const handleDetail = (row) => {
    ElMessage.info('查看：' + row.title)
}

// 删除
const handleDelete = async (id) => {
    try {
        await ElMessageBox.confirm('确定删除？', '提示')
        await axios.post(baseURL + '/forum/topic/delete', { id })
        ElMessage.success('删除成功')
        getList()
    } catch {
        ElMessage.info('已取消')
    }
}

// 提交
const submitForm = async () => {
    if (!form.title) return ElMessage.warning('请输入标题')
    submitLoading.value = true
    try {
        await axios.post(baseURL + '/forum/topic/save', form)
        ElMessage.success('操作成功')
        dialogVisible.value = false
        getList()
    } catch (e) {
        ElMessage.error('操作失败')
    } finally {
        submitLoading.value = false
    }
}

onMounted(() => { getList() })
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
    color: #333;
}

.search-box {
    background: #fff;
    padding: 18px;
    border-radius: 8px;
    margin-bottom: 20px;
}

.table-box {
    background: #fff;
    padding: 20px;
    border-radius: 8px;
}

.pagination-box {
    margin-top: 20px;
    text-align: right;
}

:deep(.table-header) {
    background: #f8f9fc !important;
    font-weight: 600;
}

.dialog-footer {
    text-align: right;
}
</style>