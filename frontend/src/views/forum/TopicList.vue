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
            <el-table :data="tableData" border stripe style="width: 100%" header-cell-class-name="table-header">
                <el-table-column label="序号" type="index" width="70" align="center" />
                <el-table-column label="话题标题" prop="title" min-width="220" />
                <el-table-column label="发布人" prop="author" width="120" />
                <el-table-column label="浏览量" prop="view" width="100" align="center" />
                <el-table-column label="评论数" prop="comment" width="100" align="center" />
                <el-table-column label="发布时间" prop="createTime" width="180" />
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
                <el-pagination v-model:current-page="page" v-model:page-size="limit" total="86"
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
                    <el-button type="primary" @click="submitForm">确认提交</el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Search, Refresh } from '@element-plus/icons-vue'

// 查询条件
const searchForm = reactive({
    title: '',
    status: ''
})

// 表格
const tableData = ref([])
const page = ref(1)
const limit = ref(10)

// 弹窗
const dialogVisible = ref(false)
const form = reactive({
    id: '',
    title: '',
    content: '',
    author: '管理员',
    view: 0,
    comment: 0,
    status: 1
})

// 模拟数据
const mockData = [
    { id: 1, title: '大家觉得今年的比赛难度如何？', author: '张三', view: 120, comment: 35, createTime: '2025-01-05 15:30', status: 1 },
    { id: 2, title: '前端开发学习路线分享', author: '李四', view: 340, comment: 58, createTime: '2025-01-06 09:20', status: 1 },
    { id: 3, title: '后端技术交流群', author: '王五', view: 85, comment: 12, createTime: '2025-01-07 16:10', status: 0 },
    { id: 4, title: '项目部署遇到的坑', author: '赵六', view: 210, comment: 43, createTime: '2025-01-08 11:40', status: 1 },
]

// 获取列表
const getList = () => {
    tableData.value = mockData
}

// 重置
const resetSearch = () => {
    searchForm.title = ''
    searchForm.status = ''
    getList()
}

// 新增
const handleAdd = () => {
    dialogVisible.value = true
    Object.assign(form, { id: '', title: '', content: '', status: 1 })
}

// 编辑
const handleEdit = (row) => {
    dialogVisible.value = true
    Object.assign(form, row)
}

// 详情
const handleDetail = (row) => {
    ElMessage.info(`查看：${row.title}`)
}

// 删除
const handleDelete = async (id) => {
    await ElMessageBox.confirm('确定删除该话题吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    })
    tableData.value = tableData.value.filter(item => item.id !== id)
    ElMessage.success('删除成功！')
}

// 提交
const submitForm = () => {
    if (!form.title) {
        ElMessage.warning('请输入标题')
        return
    }
    dialogVisible.value = false
    ElMessage.success('操作成功！')
    getList()
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