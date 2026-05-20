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
                        </el-icon>查询
                    </el-button>
                    <el-button @click="resetSearch">
                        <el-icon>
                            <Refresh />
                        </el-icon>重置
                    </el-button>
                </el-form-item>
            </el-form>
        </div>

        <!-- 卡片榜单列表 -->
        <div class="card-list" v-loading="loading">
            <div class="card-item" v-for="(item, index) in tableData" :key="item.id">
                <div class="rank" :class="`rank-${index + 1}`">{{ index + 1 }}</div>
                <div class="card-body">
                    <div class="title">{{ item.title }}</div>
                    <div class="info">
                        <span>浏览：{{ item.view }}</span>
                        <span>评论：{{ item.comment }}</span>
                        <span>时间：{{ item.createTime }}</span>
                        <el-tag :type="item.status === 1 ? 'success' : 'danger'" size="small">
                            {{ item.status === 1 ? '正常' : '隐藏' }}
                        </el-tag>
                    </div>
                </div>
                <div class="card-operate">
                    <el-button type="primary" size="small" @click="handleEdit(item)">编辑</el-button>
                    <el-button type="warning" size="small" @click="handleDetail(item)">详情</el-button>
                    <el-button type="danger" size="small" @click="handleDelete(item.id)">删除</el-button>
                </div>
            </div>
        </div>

        <!-- 分页 纯中文 -->
        <div class="pagination-box">
            <el-pagination v-model:current-page="page" v-model:page-size="limit" :total="total"
                layout="total, sizes, prev, pager, next, jumper" @size-change="getList" @current-change="getList"
                background total-text="共 {total} 条" prev-text="上一页" next-text="下一页" jumper-text="前往" />
        </div>

        <!-- 弹窗 -->
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
const form = reactive({ id: '', title: '', content: '', status: 1 })

// 获取列表
const getList = async () => {
    loading.value = true
    try {
        const res = await axios.get(baseURL + '/forum/topic/list', {
            params: { page: page.value, limit: limit.value, title: searchForm.title, status: searchForm.status }
        })
        if (res.data.code === 200) {
            tableData.value = res.data.data.list
            total.value = res.data.data.total
        }
    } catch (e) {
        ElMessage.error('数据加载失败')
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
    ElMessage.info('查看话题：' + row.title)
}

// 删除
const handleDelete = async (id) => {
    try {
        await ElMessageBox.confirm('确定要删除该话题吗？', '系统提示')
        await axios.post(baseURL + '/forum/topic/delete', { id })
        ElMessage.success('删除成功')
        getList()
    } catch {
        ElMessage.info('已取消删除')
    }
}

// 提交
const submitForm = async () => {
    if (!form.title) return ElMessage.warning('请输入话题标题')
    submitLoading.value = true
    try {
        await axios.post(baseURL + '/forum/topic/save', form)
        ElMessage.success('操作成功')
        dialogVisible.value = false
        getList()
    } catch (e) {
        ElMessage.error('操作失败，请稍后重试')
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

/* 卡片列表样式 */
.card-list {
    background: #fff;
    border-radius: 8px;
    padding: 10px;
    margin-bottom: 20px;
}

.card-item {
    display: flex;
    align-items: center;
    padding: 14px 10px;
    border-bottom: 1px solid #f5f5f5;
}

.card-item:last-child {
    border-bottom: none;
}

/* 排名 */
.rank {
    width: 26px;
    height: 26px;
    line-height: 26px;
    text-align: center;
    border-radius: 4px;
    color: #fff;
    font-size: 14px;
    margin-right: 12px;
}

.rank-1 {
    background: #ff4d4f;
}

.rank-2 {
    background: #ff7875;
}

.rank-3 {
    background: #ff9c9e;
}

.rank-4,
.rank-5,
.rank-6,
.rank-7,
.rank-8,
.rank-9,
.rank-10 {
    background: #d9d9d9;
}

/* 内容 */
.card-body {
    flex: 1;
}

.title {
    font-size: 16px;
    font-weight: 500;
    color: #333;
    margin-bottom: 6px;
}

.info {
    font-size: 13px;
    color: #999;
    display: flex;
    gap: 15px;
    align-items: center;
}

/* 操作按钮 */
.card-operate {
    display: flex;
    gap: 6px;
}

.pagination-box {
    text-align: right;
}

.dialog-footer {
    text-align: right;
}
</style>