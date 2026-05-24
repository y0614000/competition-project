<template>
  <div class="company-page">
    <!-- 顶部标题 -->
    <div class="page-header-card">
      <div class="header-left">
        <el-icon class="header-icon">
          <OfficeBuilding />
        </el-icon>
        <div>
          <h2>企业信息与岗位管理</h2>
          <p>维护企业资料，发布与管理招聘岗位</p>
        </div>
      </div>
    </div>

    <!-- 只保留一个有用按钮：发布岗位 -->
    <div class="btn-box">
      <el-button type="success" icon="EditPen" @click="openJobDialog">
        发布招聘岗位
      </el-button>
    </div>

    <!-- 企业信息列表 -->
    <el-card class="table-card" shadow="hover">
      <el-table :data="list" border size="default" style="width:100%">
        <el-table-column prop="name" label="企业名称" align="center" />
        <el-table-column prop="industry" label="所属行业" align="center" />
        <el-table-column prop="address" label="企业地址" align="center" />
        <el-table-column prop="contact" label="联系人" align="center" />
        <el-table-column prop="tel" label="联系电话" align="center" />
        <el-table-column label="状态" align="center">
          <template #default="{ row }">
            <el-tag :type="row.status == 1 ? 'success' : row.status == 0 ? 'warning' : 'danger'">
              {{ row.status == 1 ? '正常' : row.status == 0 ? '待审核' : '已禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="180">
          <template #default="{ row }">
            <el-button size="small" type="primary" @click="editCompany(row)">编辑信息</el-button>
            <el-button size="small" type="danger" @click="delCompany(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 企业信息弹窗（只用来编辑） -->
    <el-dialog v-model="dialogVisible" title="企业信息编辑" width="600px" center>
      <el-form ref="formRef" :rules="rules" label-width="110px" :model="form" label-position="right">
        <el-form-item label="企业名称" prop="name">
          <el-input v-model="form.name" placeholder="请填写企业全称"></el-input>
        </el-form-item>
        <el-form-item label="企业LOGO">
          <el-input v-model="form.logo" placeholder="LOGO地址（选填）"></el-input>
        </el-form-item>
        <el-form-item label="所属行业" prop="industry">
          <el-select v-model="form.industry" style="width:100%">
            <el-option label="互联网/IT" value="互联网/IT" />
            <el-option label="教育培训" value="教育培训" />
            <el-option label="文化传媒" value="文化传媒" />
            <el-option label="金融服务" value="金融服务" />
            <el-option label="医疗健康" value="医疗健康" />
            <el-option label="生产制造" value="生产制造" />
          </el-select>
        </el-form-item>
        <el-form-item label="企业地址" prop="address">
          <el-input v-model="form.address" placeholder="详细地址"></el-input>
        </el-form-item>
        <el-form-item label="联系人" prop="contact">
          <el-input v-model="form.contact" placeholder="招聘联系人"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="tel">
          <el-input v-model="form.tel" placeholder="企业招聘电话"></el-input>
        </el-form-item>
        <el-form-item label="企业简介" prop="intro">
          <el-input v-model="form.intro" type="textarea" rows="4" placeholder="简单介绍企业业务、规模、优势"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="form.status" style="width:100%">
            <el-option label="正常" value="1" />
            <el-option label="待审核" value="0" />
            <el-option label="禁用" value="-1" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveCompany">保存</el-button>
      </template>
    </el-dialog>

    <!-- 发布岗位弹窗 -->
    <el-dialog v-model="jobDialogVisible" title="发布招聘岗位" width="600px" center>
      <el-form ref="jobFormRef" :rules="jobRules" :model="jobForm" label-width="110px" label-position="right">
        <el-form-item label="岗位名称" prop="job_name">
          <el-input v-model="jobForm.job_name" placeholder="如：Web前端开发、行政专员"></el-input>
        </el-form-item>
        <el-form-item label="薪资范围" prop="salary">
          <el-input v-model="jobForm.salary" placeholder="如：6K-9K、面议"></el-input>
        </el-form-item>
        <el-form-item label="经验要求" prop="exp">
          <el-select v-model="jobForm.exp" style="width:100%" placeholder="选择经验要求">
            <el-option label="应届生" value="应届生" />
            <el-option label="1-3年" value="1-3年" />
            <el-option label="3-5年" value="3-5年" />
            <el-option label="5年以上" value="5年以上" />
          </el-select>
        </el-form-item>
        <el-form-item label="学历要求" prop="edu">
          <el-select v-model="jobForm.edu" style="width:100%" placeholder="选择学历要求">
            <el-option label="不限" value="不限" />
            <el-option label="大专" value="大专" />
            <el-option label="本科" value="本科" />
          </el-select>
        </el-form-item>
        <el-form-item label="职位描述" prop="content">
          <el-input v-model="jobForm.content" type="textarea" rows="4" placeholder="岗位职责、任职要求"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="jobDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitJob" :loading="jobLoading">发布岗位</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { OfficeBuilding, EditPen } from '@element-plus/icons-vue'
import axios from 'axios'

// 企业信息相关
const list = ref([])
const dialogVisible = ref(false)
const formRef = ref(null)
const form = ref({})
const editId = ref(null)

// 岗位发布相关
const jobDialogVisible = ref(false)
const jobFormRef = ref(null)
const jobLoading = ref(false)
const jobForm = reactive({
  job_name: '', salary: '', exp: '', edu: '不限', content: '', status: 1
})

// 企业信息校验
const rules = reactive({
  name: [{ required: true, message: '请填写企业名称', trigger: 'blur' }],
  industry: [{ required: true, message: '请选择行业', trigger: 'change' }],
  address: [{ required: true, message: '请填写企业地址', trigger: 'blur' }],
  contact: [{ required: true, message: '请填写联系人', trigger: 'blur' }],
  tel: [{ required: true, message: '请填写联系电话', trigger: 'blur' }],
  intro: [{ required: true, message: '请填写企业简介', trigger: 'blur' }],
})

// 岗位校验
const jobRules = reactive({
  job_name: [{ required: true, message: '请输入岗位名称', trigger: 'blur' }],
  salary: [{ required: true, message: '请输入薪资范围', trigger: 'blur' }],
  exp: [{ required: true, message: '请选择经验要求', trigger: 'change' }],
  edu: [{ required: true, message: '请选择学历要求', trigger: 'change' }],
  content: [{ required: true, message: '请填写职位描述', trigger: 'blur' }],
})

// 加载企业列表
const getList = async () => {
  const res = await axios.get('http://127.0.0.1:8000/CompanyController/all')
  list.value = res.data.data || []
}

// 编辑企业
const editCompany = (row) => {
  editId.value = row.id
  form.value = { ...row }
  dialogVisible.value = true
}

// 保存企业信息
const saveCompany = async () => {
  await formRef.value.validate(async valid => {
    if (!valid) return ElMessage.warning('请完善必填信息')
    try {
      await axios.post('http://127.0.0.1:8000/CompanyController/update', { id: editId.value, ...form.value })
      ElMessage.success('修改成功')
      dialogVisible.value = false
      getList()
    } catch {
      ElMessage.error('保存失败')
    }
  })
}

// 删除企业
const delCompany = async (id) => {
  try {
    await ElMessageBox.confirm('确定删除该企业信息？')
  } catch { return }
  try {
    await axios.post('http://127.0.0.1:8000/CompanyController/delete', { id })
    ElMessage.success('删除成功')
    getList()
  } catch {
    ElMessage.error('删除失败')
  }
}

// 打开岗位弹窗
const openJobDialog = () => {
  jobForm.job_name = ''
  jobForm.salary = ''
  jobForm.exp = ''
  jobForm.edu = '不限'
  jobForm.content = ''
  jobDialogVisible.value = true
}

// 提交岗位
const submitJob = async () => {
  await jobFormRef.value.validate(async valid => {
    if (!valid) return ElMessage.warning('完善岗位信息')
    jobLoading.value = true
    try {
      await axios.post('http://127.0.0.1:8000/api/job/save', jobForm)
      ElMessage.success('岗位发布成功')
      jobDialogVisible.value = false
    } catch {
      ElMessage.error('发布失败')
    } finally {
      jobLoading.value = false
    }
  })
}

onMounted(() => getList())
</script>

<style scoped>
.company-page {
  padding: 24px;
  background: #f7f9fc;
  min-height: 100vh;
}

.page-header-card {
  background: linear-gradient(135deg, #409eff, #58a9ff);
  padding: 24px 28px;
  border-radius: 16px;
  color: white;
  display: flex;
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

.btn-box {
  margin-bottom: 18px;
}

.btn-box :deep(.el-button) {
  border-radius: 8px;
}

.table-card {
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.05);
}
</style>