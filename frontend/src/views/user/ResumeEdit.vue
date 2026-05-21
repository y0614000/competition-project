<template>
  <div class="resume-page">
    <!-- 顶部标题区 -->
    <div class="resume-header">
      <div class="header-box">
        <h2>📋 个人简历编辑</h2>
        <p>完善信息后可导出与示例一致的正式简历</p>
      </div>
    </div>

    <el-alert title="信息越完整，简历越专业！" type="success" show-icon class="tip-card" />
    <div class="progress-box">
      <span>简历完成度</span>
      <el-progress :percentage="completePercent" stroke-width="16" />
    </div>

    <!-- 表单 -->
    <el-card class="form-card" shadow="hover">
      <el-form label-width="130px" model="form" label-position="right">
        <el-divider content-position="left" class="card-divider"><i class="el-icon-user"></i> 基本信息</el-divider>
        <el-row :gutter="20">
          <el-col :span="12"><el-form-item label="姓名"><el-input v-model="form.name" placeholder="请输入" /></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="出生年月"><el-input v-model="form.birth" placeholder="2004.01.09" /></el-form-item></el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12"><el-form-item label="电话"><el-input v-model="form.phone" /></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="邮箱"><el-input v-model="form.email" /></el-form-item></el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12"><el-form-item label="现居地址"><el-input v-model="form.address" /></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="意向岗位"><el-input v-model="form.job_hope" /></el-form-item></el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12"><el-form-item label="期望薪资"><el-input v-model="form.salary" /></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="性别"><el-select v-model="form.gender"><el-option label="男" value="男" /><
            <el-option label="女" value="女" /></el-select></el-form-item></el-col>
        </el-row>

        <el-divider content-position="left" class="card-divider"><i class="el-icon-school"></i> 教育背景</el-divider>
        <el-form-item label="教育经历"><el-input v-model="form.education" type="textarea" rows="3" placeholder="请按时间倒序填写" /></el-form-item>

        <el-divider content-position="left" class="card-divider"><i class="el-icon-suitcase"></i> 实习/工作经历</el-divider>
        <el-form-item label="实习经历"><el-input v-model="form.experience" type="textarea" rows="4" /></el-form-item>

        <el-divider content-position="left" class="card-divider"><i class="el-icon-setting"></i> 专业技能</el-divider>
        <el-form-item label="专业技能"><el-input v-model="form.skill" type="textarea" rows="3" /></el-form-item>

        <el-divider content-position="left" class="card-divider"><i class="el-icon-trophy"></i> 荣誉奖励</el-divider>
        <el-form-item label="荣誉奖项"><el-input v-model="form.award" type="textarea" rows="3" /></el-form-item>

        <el-divider content-position="left" class="card-divider"><i class="el-icon-chat-dot-round"></i> 自我评价</el-divider>
        <el-form-item label="自我评价"><el-input v-model="form.desc" type="textarea" rows="4" /></el-form-item>

        <div class="btn-group">
          <el-button type="primary" @click="saveResume" :loading="saving">保存简历</el-button>
          <el-button type="success" @click="generatePreview">预览简历</el-button>
          <el-button type="warning" @click="exportPDF">导出PDF</el-button>
        </div>
      </el-form>
    </el-card>

    <!-- 👉 精致简历预览（和你PDF一模一样） -->
    <el-card v-if="showPreview" class="preview-card" shadow="hover">
      <div class="preview-header"><h3>📄 简历预览（正式版）</h3></div>
      <div class="resume-pdf-box" id="resumePreview">
        <div class="resume-pdf-inner">
          <div class="pdf-title">PERSONAL RESUME</div>
          <div class="pdf-name">{{ form.name || '姓名' }} &nbsp;&nbsp; 求职意向：{{ form.job_hope || '意向岗位' }}</div>

          <div class="pdf-info-line">
            <span>期望薪资：{{ form.salary || '无' }}</span>
            <span>出生年月：{{ form.birth || '无' }}</span>
            <span>电话：{{ form.phone || '无' }}</span>
            <span>现居：{{ form.address || '无' }}</span>
            <span>邮箱：{{ form.email || '无' }}</span>
          </div>

          <div class="pdf-section">
            <div class="pdf-head">教育背景</div>
            <div class="pdf-text">{{ form.education || '暂无填写' }}</div>
          </div>

          <div class="pdf-section">
            <div class="pdf-head">实习经历</div>
            <div class="pdf-text">{{ form.experience || '暂无填写' }}</div>
          </div>

          <div class="pdf-section">
            <div class="pdf-head">专业技能</div>
            <div class="pdf-text">{{ form.skill || '暂无填写' }}</div>
          </div>

          <div class="pdf-section">
            <div class="pdf-head">荣誉奖励</div>
            <div class="pdf-text">{{ form.award || '暂无填写' }}</div>
          </div>

          <div class="pdf-section">
            <div class="pdf-head">自我评价</div>
            <div class="pdf-text">{{ form.desc || '暂无填写' }}</div>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage } from 'element-plus'
import axios from '../../utils/request'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

const form = reactive({
  name: '', birth: '', phone: '', email: '', address: '',
  job_hope: '', salary: '', gender: '',
  education: '', experience: '', skill: '', award: '', desc: ''
})

const saving = ref(false)
const showPreview = ref(false)

const getUserId = () => {
  const u = localStorage.getItem('userInfo')
  return u ? JSON.parse(u).id : null
}

const loadResume = async () => {
  const uid = getUserId()
  if (!uid) return
  try {
    const res = await axios.get('/api/resume/get', { params: { user_id: uid } })
    if (res.data.code === 1) Object.assign(form, res.data.data)
  } catch (e) {}
}

const saveResume = async () => {
  const uid = getUserId()
  if (!uid) return ElMessage.warning('请先登录')
  saving.value = true
  try {
    const res = await axios.post('/api/resume/save', { user_id: uid, ...form })
    res.data.code === 1 ? ElMessage.success('保存成功') : ElMessage.error('保存失败')
  } catch (e) { ElMessage.error('保存失败') }
  saving.value = false
}

const generatePreview = () => {
  showPreview.value = true
  ElMessage.success('预览成功')
}

const exportPDF = () => {
  if (!showPreview.value) showPreview.value = true
  ElMessage.info('正在生成正式简历PDF...')
  setTimeout(() => {
    const dom = document.getElementById('resumePreview')
    html2canvas(dom, { scale: 3, useCORS: true, backgroundColor: '#fff' }).then(canvas => {
      const img = canvas.toDataURL('image/jpeg', 1.0)
      const pdf = new jsPDF('p', 'mm', 'a4')
      const w = pdf.internal.pageSize.getWidth()
      const h = canvas.height * w / canvas.width
      pdf.addImage(img, 'JPEG', 0, 0, w, h)
      pdf.save(`${form.name || '个人'}_简历.pdf`)
      ElMessage.success('导出成功！')
    })
  }, 800)
}

const completePercent = computed(() => {
  let total = 13
  let c = 0
  Object.values(form).forEach(v => v && v.trim() !== '' && c++)
  return Math.min(Math.round(c / total * 100), 100)
})

onMounted(() => loadResume())
</script>

<style scoped>
/* 整体页面 */
.resume-page {
  padding: 20px;
  max-width: 900px;
  margin: 0 auto;
}

.resume-header {
  background: linear-gradient(135deg, #3064c8, #4b82e5);
  border-radius: 16px;
  padding: 28px 24px;
  color: #fff;
  margin-bottom: 18px;
}
.header-box h2 { margin: 0; font-size: 24px; }
.header-box p { margin: 6px 0 0; opacity: 0.92; }

.tip-card { border-radius: 12px; margin-bottom: 16px; }
.progress-box { background: #fff; padding: 14px 18px; border-radius: 12px; margin-bottom: 20px; }
.progress-box span { font-size: 14px; color: #555; margin-bottom: 8px; display: block; }

.form-card { border-radius: 16px; padding: 24px; }
.card-divider { font-size: 16px; font-weight: 600; color: #3064c8; margin: 20px 0 14px; }
.btn-group { margin-top: 24px; display: flex; gap: 14px; justify-content: center; }

/* 简历预览（完全复刻你给的PDF样式） */
.preview-card { border-radius: 16px; overflow: hidden; margin-top: 20px; }
.preview-header { background: #f3f7ff; padding: 16px 24px; border-bottom: 1px solid #e3ecff; }
.preview-header h3 { margin: 0; font-size: 18px; color: #3064c8; }

.resume-pdf-box {
  background: #f5f7fa;
  padding: 40px 20px;
  display: flex;
  justify-content: center;
}
.resume-pdf-inner {
  width: 210mm;
  min-height: 297mm;
  background: #fff;
  padding: 40px 30px;
  font-family: "Microsoft YaHei", sans-serif;
  line-height: 1.7;
}

/* 标题（和你PDF一致） */
.pdf-title {
  text-align: right;
  font-size: 14px;
  color: #666;
  margin-bottom: 6px;
  letter-spacing: 1px;
}
.pdf-name {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 10px;
  color: #111;
}

/* 信息行（紧凑专业） */
.pdf-info-line {
  display: flex;
  flex-wrap: wrap;
  column-gap: 20px;
  row-gap: 4px;
  font-size: 14px;
  color: #333;
  margin-bottom: 24px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

/* 区块样式 */
.pdf-section {
  margin-bottom: 20px;
}
.pdf-head {
  font-size: 15px;
  font-weight: 600;
  color: #111;
  margin-bottom: 6px;
}
.pdf-text {
  font-size: 14px;
  color: #333;
  text-align: justify;
  line-height: 1.75;
}
</style>