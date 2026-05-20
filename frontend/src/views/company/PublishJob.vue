<template>
  <div class="page-box">
    <div class="page-head">
      <h2>发布招聘职位</h2>
      <p>快速发布岗位，招揽优秀求职人才</p>
    </div>

    <el-card shadow="hover" class="pub-form">
      <el-form :model="form" label-width="110px">
        <el-form-item label="岗位名称">
          <el-input v-model="form.job_name" placeholder="如：Web前端开发、行政专员"></el-input>
        </el-form-item>

        <el-form-item label="薪资范围">
          <el-input v-model="form.salary" placeholder="如：6K-9K、面议"></el-input>
        </el-form-item>

        <el-form-item label="工作地点">
          <el-input v-model="form.city" placeholder="填写城市及区域"></el-input>
        </el-form-item>

        <el-form-item label="经验要求">
          <el-select v-model="form.exp" style="width:100%" placeholder="选择经验">
            <el-option label="应届生" value="应届生" />
            <el-option label="1-3年" value="1-3年" />
            <el-option label="3-5年" value="3-5年" />
            <el-option label="5年以上" value="5年以上" />
          </el-select>
        </el-form-item>

        <el-form-item label="学历要求">
          <el-select v-model="form.edu" style="width:100%" placeholder="选择学历">
            <el-option label="不限" value="不限" />
            <el-option label="大专" value="大专" />
            <el-option label="本科" value="本科" />
          </el-select>
        </el-form-item>

        <el-form-item label="职位描述">
          <el-input v-model="form.content" type="textarea" rows="4" placeholder="岗位职责+要求"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" size="large" @click="submitJob" :loading="loading">
            立即发布职位
          </el-button>
          <el-button size="large" @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import axios from 'axios'

const baseURL = 'http://127.0.0.1:8000/api'
const loading = ref(false)

// ✅ 只保留后端支持的字段，绝对不多传！
const form = reactive({
  job_name: '',
  salary: '',
  city: '',
  exp: '',
  edu: '不限',
  content: '',
  status: 1
})

// 提交发布
const submitJob = async () => {
  if (!form.job_name) {
    ElMessage.warning('请输入岗位名称')
    return
  }

  loading.value = true
  try {
    await axios.post(baseURL + '/job/save', form)
    ElMessage.success('发布成功！已同步到职位管理')
    resetForm()
  } catch (e) {
    ElMessage.error('发布失败')
  } finally {
    loading.value = false
  }
}

// 重置
const resetForm = () => {
  form.job_name = ''
  form.salary = ''
  form.city = ''
  form.exp = ''
  form.edu = '不限'
  form.content = ''
}
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
  margin: 0 0 5px;
}

.page-head p {
  color: #999;
  margin: 0;
}

.pub-form {
  border-radius: 14px;
  padding: 20px;
  max-width: 820px;
}
</style>