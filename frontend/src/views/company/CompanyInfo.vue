<template>
  <div class="page-box">
    <div class="page-head">
      <h2>企业管理</h2>
      <p>查看、添加、编辑、删除企业信息</p>
    </div>

    <!-- 按钮 -->
    <div style="margin-bottom:15px">
      <el-button type="primary" @click="add">+ 新增企业</el-button>
    </div>

    <!-- 列表 -->
    <el-card shadow="hover">
      <el-table :data="list" border size="small" style="width:100%">
        <el-table-column prop="name" label="企业名称" align="center" />
        <el-table-column prop="industry" label="所属行业" align="center" />
        <el-table-column prop="address" label="地址" align="center" />
        <el-table-column prop="contact" label="联系人" align="center" />
        <el-table-column prop="tel" label="电话" align="center" />
        <el-table-column label="状态" align="center">
          <template #default="{ row }">
            <el-tag :type="row.status == 1 ? 'success' : row.status == 0 ? 'warning' : 'danger'">
              {{ row.status == 1 ? '正常' : row.status == 0 ? '待审核' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="200">
          <template #default="{ row }">
            <el-button size="small" type="primary" @click="edit(row)">编辑</el-button>
            <el-button size="small" type="danger" @click="del(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 新增/编辑 弹窗 -->
    <el-dialog v-model="dialogVisible" title="企业信息" width="600px">
      <el-form label-width="110px" :model="form">
        <el-form-item label="企业名称">
          <el-input v-model="form.name" placeholder="请填写企业全称"></el-input>
        </el-form-item>
        <el-form-item label="企业LOGO">
          <el-input v-model="form.logo" placeholder="LOGO地址"></el-input>
        </el-form-item>
        <el-form-item label="所属行业">
          <el-select v-model="form.industry" style="width:100%">
            <el-option label="互联网/IT" value="互联网/IT" />
            <el-option label="教育培训" value="教育培训" />
            <el-option label="文化传媒" value="文化传媒" />
            <el-option label="金融服务" value="金融服务" />
            <el-option label="医疗健康" value="医疗健康" />
            <el-option label="生产制造" value="生产制造" />
          </el-select>
        </el-form-item>
        <el-form-item label="企业地址">
          <el-input v-model="form.address" placeholder="详细地址"></el-input>
        </el-form-item>
        <el-form-item label="联系人">
          <el-input v-model="form.contact" placeholder="联系人"></el-input>
        </el-form-item>
        <el-form-item label="联系电话">
          <el-input v-model="form.tel" placeholder="电话"></el-input>
        </el-form-item>
        <el-form-item label="企业简介">
          <el-input v-model="form.intro" type="textarea" rows="4"></el-input>
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
        <el-button type="primary" @click="save">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import axios from 'axios'

const list = ref([])
const dialogVisible = ref(false)
const form = ref({
  name: '',
  logo: '',
  industry: '',
  address: '',
  contact: '',
  tel: '',
  intro: '',
  status: 1
})
const editId = ref(null)

// 加载所有企业
const getList = async () => {
  const res = await axios.get('http://127.0.0.1:8000/CompanyController/all')
  list.value = res.data.data || []
}

// 新增
const add = () => {
  editId.value = null
  form.value = { name: '', logo: '', industry: '', address: '', contact: '', tel: '', intro: '', status: 1 }
  dialogVisible.value = true
}

// 编辑
const edit = (row) => {
  editId.value = row.id
  form.value = { ...row }
  dialogVisible.value = true
}

// 保存
const save = async () => {
  if (!form.value.name) {
    ElMessage.warning('请填写企业名称')
    return
  }

  if (editId.value) {
    await axios.post('http://127.0.0.1:8000/CompanyController/update', {
      id: editId.value, ...form.value
    })
    ElMessage.success('修改成功')
  } else {
    await axios.post('http://127.0.0.1:8000/CompanyController/create', form.value)
    ElMessage.success('新增成功')
  }

  dialogVisible.value = false
  getList()
}

// 删除
const del = async (id) => {
  await ElMessageBox.confirm('确定删除？')
  await axios.post('http://127.0.0.1:8000/CompanyController/delete', { id })
  ElMessage.success('删除成功')
  getList()
}

onMounted(() => {
  getList()
})
</script>

<style scoped>
.page-box {
  padding: 10px 0;
}

.page-head {
  margin-bottom: 25px;
}

.page-head h2 {
  font-size: 24px;
  color: #333;
}

.page-head p {
  color: #999;
}
</style>