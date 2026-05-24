<template>
  <div class="job-manage-container">
    <!-- 顶部标题 -->
    <div class="page-header-card">
      <div class="header-left">
        <el-icon class="header-icon">
          <Briefcase />
        </el-icon>
        <div>
          <h2>职位管理</h2>
          <p>管理所有招聘职位，开启/停止招聘，编辑岗位信息</p>
        </div>
      </div>
      <el-button type="primary" @click="handleAdd">
        <el-icon>
          <Plus />
        </el-icon>
        新增职位
      </el-button>
    </div>

    <!-- 搜索 -->
    <div class="search-box">
      <el-form :inline="true" :model="searchForm">
        <el-form-item label="职位名称">
          <el-input v-model="searchForm.searchKey" placeholder="请输入职位名称" style="width: 240px" clearable />
        </el-form-item>
        <el-form-item label="招聘状态">
          <el-select v-model="searchForm.status" style="width: 160px" clearable>
            <el-option label="全部" value="" />
            <el-option label="招聘中" value="1" />
            <el-option label="已停止" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getList">
            <el-icon>
              <Search />
            </el-icon> 查询
          </el-button>
          <el-button @click="resetSearch">
            <el-icon>
              <Refresh />
            </el-icon> 重置
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 表格 -->
    <div class="table-box">
      <el-table :data="tableData" border stripe v-loading="loading" header-cell-class-name="table-header">
        <el-table-column label="序号" type="index" width="70" align="center" />
        <el-table-column label="职位名称" prop="job_name" min-width="180" />
        <el-table-column label="薪资" prop="salary" width="140" />
        <el-table-column label="城市" prop="city" width="120" />
        <el-table-column label="学历" prop="edu" width="100" />
        <el-table-column label="经验" prop="exp" width="100" />
        <el-table-column label="状态" width="110" align="center">
          <template #default="{ row }">
            <el-tag :type="row.status == 1 ? 'success' : 'danger'">
              {{ row.status == 1 ? '招聘中' : '已停止' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="发布时间" prop="create_time" width="180" />
        <el-table-column label="操作" width="320" align="center">
          <template #default="{ row }">
            <el-button size="small" type="primary" @click="handleEdit(row)">编辑</el-button>
            <el-button size="small" type="warning" @click="toggleStatus(row)">
              {{ row.status == 1 ? '停止' : '开启' }}
            </el-button>
            <el-button size="small" type="danger" @click="handleDelete(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-box">
        <el-pagination v-model:current-page="page" v-model:page-size="limit" :total="total"
          layout="total, sizes, prev, pager, next, jumper" @current-change="getList" @size-change="getList" />
      </div>
    </div>

    <!-- 弹窗 -->
    <el-dialog v-model="dialogVisible" title="职位信息编辑" width="650px" destroy-on-close>
      <el-form :model="form" label-width="100px" label-position="right">
        <el-form-item label="职位名称">
          <el-input v-model="form.job_name" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="薪资范围">
          <el-input v-model="form.salary" placeholder="例：8K-15K" />
        </el-form-item>
        <el-form-item label="工作城市">
          <el-input v-model="form.city" placeholder="海口/三亚/儋州" />
        </el-form-item>
        <el-form-item label="学历要求">
          <el-select v-model="form.edu">
            <el-option label="不限" value="不限" />
            <el-option label="大专" value="大专" />
            <el-option label="本科" value="本科" />
          </el-select>
        </el-form-item>
        <el-form-item label="经验要求">
          <el-select v-model="form.exp">
            <el-option label="应届生" value="应届生" />
            <el-option label="1-3年" value="1-3年" />
            <el-option label="3-5年" value="3-5年" />
          </el-select>
        </el-form-item>
        <el-form-item label="职位描述">
          <el-input v-model="form.content" type="textarea" rows="4" placeholder="岗位职责、任职要求" />
        </el-form-item>
        <el-form-item label="招聘状态">
          <el-radio-group v-model="form.status">
            <el-radio :label="1">招聘中</el-radio>
            <el-radio :label="0">已停止</el-radio>
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
import { Plus, Search, Refresh, Briefcase } from '@element-plus/icons-vue'
import axios from 'axios'

const baseURL = 'http://127.0.0.1:8000/api'

// 搜索
const searchForm = reactive({
  searchKey: '',
  status: ''
})

// 列表
const tableData = ref([])
const loading = ref(false)
const page = ref(1)
const limit = ref(10)
const total = ref(0)

// 弹窗
const dialogVisible = ref(false)
const submitLoading = ref(false)
const form = reactive({
  id: '',
  job_name: '',
  salary: '',
  city: '',
  edu: '不限',
  exp: '不限',
  content: '',
  status: 1
})

// 获取列表
const getList = async () => {
  loading.value = true
  try {
    const res = await axios.get(baseURL + '/job/list', {
      params: {
        page: page.value,
        limit: limit.value,
        searchKey: searchForm.searchKey,
        status: searchForm.status
      }
    })
    tableData.value = res.data.data.list
    total.value = res.data.data.total
  } catch (e) {
    ElMessage.error('加载失败')
  } finally {
    loading.value = false
  }
}

// 重置
const resetSearch = () => {
  searchForm.searchKey = ''
  searchForm.status = ''
  getList()
}

// 新增
const handleAdd = () => {
  dialogVisible.value = true
  Object.assign(form, {
    id: '', job_name: '', salary: '', city: '', edu: '不限', exp: '不限', content: '', status: 1
  })
}

// 编辑
const handleEdit = (row) => {
  dialogVisible.value = true
  Object.assign(form, row)
}

// 切换状态
const toggleStatus = async (row) => {
  await ElMessageBox.confirm('确定要' + (row.status == 1 ? '停止' : '开启') + '该职位？')
  await axios.post(baseURL + '/job/switchStatus', {
    id: row.id,
    status: row.status == 1 ? 0 : 1
  })
  ElMessage.success('操作成功')
  getList()
}

// 删除
const handleDelete = async (id) => {
  await ElMessageBox.confirm('确定删除该职位？')
  await axios.post(baseURL + '/job/delete', { id })
  ElMessage.success('删除成功')
  getList()
}

// 提交
const submitForm = async () => {
  if (!form.job_name) return ElMessage.warning('请填写职位名称')
  submitLoading.value = true
  try {
    await axios.post(baseURL + '/job/save', form)
    ElMessage.success('保存成功')
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
.job-manage-container {
  padding: 24px;
  background: #f7f9fc;
  min-height: 100vh;
}

/* 顶部 == 企业端统一蓝色 */
.page-header-card {
  background: linear-gradient(135deg, #409eff, #58a9ff);
  padding: 24px 28px;
  border-radius: 16px;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
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

.search-box {
  background: #ffffff;
  padding: 20px 24px;
  border-radius: 12px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.table-box {
  background: #ffffff;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.pagination-box {
  margin-top: 20px;
  text-align: right;
}

:deep(.table-header) {
  background: #f8f9fc !important;
  font-weight: 600 !important;
  color: #333 !important;
}

.dialog-footer {
  text-align: right;
}
</style>