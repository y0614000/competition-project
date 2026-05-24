<template>
  <div class="resume-page">
    <!-- 顶部标题区 -->
    <div class="resume-header">
      <div class="header-box">
        <h2>📋 个人简历编辑</h2>
        <p>完善信息后可生成专业正式简历，支持一键预览 / 导出PDF</p>
      </div>
    </div>

    <el-alert title="信息越完整，简历越专业！" type="success" show-icon class="tip-card" />
    <div class="progress-box">
      <span>简历完成度</span>
      <el-progress :percentage="completePercent" stroke-width="16" />
    </div>

    <!-- 表单 -->
    <el-card class="form-card" shadow="hover">
      <el-form ref="resumeRef" :rules="rules" label-width="130px" model="form" label-position="right">
        <el-divider content-position="left" class="card-divider"><i class="el-icon-user"></i> 基本信息</el-divider>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="姓名" prop="name">
              <el-input v-model="form.name" placeholder="请输入真实姓名" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="出生年月" prop="birth">
              <el-input v-model="form.birth" placeholder="格式：2004.01.09" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="电话" prop="phone">
              <el-input v-model="form.phone" placeholder="11位手机号码" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="form.email" placeholder="填写常用邮箱" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="现居地址" prop="address">
              <el-input v-model="form.address" placeholder="详细居住地址" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="意向岗位" prop="job_hope">
              <el-input v-model="form.job_hope" placeholder="例如：前端开发工程师" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="期望薪资" prop="salary">
              <el-input v-model="form.salary" placeholder="例如：5000-8000" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="性别" prop="gender">
              <el-select v-model="form.gender">
                <el-option label="男" value="男" />
                <el-option label="女" value="女" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-divider content-position="left" class="card-divider"><i class="el-icon-school"></i> 教育背景</el-divider>
        <el-form-item label="教育经历" prop="education">
          <el-input v-model="form.education" type="textarea" rows="3" placeholder="请按时间倒序填写院校、专业、学历" />
        </el-form-item>

        <el-divider content-position="left" class="card-divider"><i class="el-icon-suitcase"></i> 实习/工作经历</el-divider>
        <el-form-item label="实习经历" prop="experience">
          <el-input v-model="form.experience" type="textarea" rows="4" placeholder="填写工作内容与项目经验" />
        </el-form-item>

        <el-divider content-position="left" class="card-divider"><i class="el-icon-setting"></i> 专业技能</el-divider>
        <el-form-item label="专业技能" prop="skill">
          <el-input v-model="form.skill" type="textarea" rows="3" placeholder="罗列掌握的技术、证书、语言能力" />
        </el-form-item>

        <el-divider content-position="left" class="card-divider"><i class="el-icon-trophy"></i> 荣誉奖励</el-divider>
        <el-form-item label="荣誉奖项">
          <el-input v-model="form.award" type="textarea" rows="3" placeholder="选填，无则留空" />
        </el-form-item>

        <el-divider content-position="left" class="card-divider"><i class="el-icon-chat-dot-round"></i>
          自我评价</el-divider>
        <el-form-item label="自我评价" prop="desc">
          <el-input v-model="form.desc" type="textarea" rows="4" placeholder="简述个人优势与职业规划" />
        </el-form-item>

        <div class="btn-group">
          <el-button type="primary" @click="saveResume" :loading="saving">保存简历</el-button>
          <el-button type="success" @click="generatePreview">预览简历</el-button>
          <el-button type="warning" @click="exportPDF">导出PDF</el-button>
        </div>
      </el-form>
    </el-card>

    <!-- 👉 精致简历预览 -->
    <el-card v-if="showPreview" class="preview-card" shadow="hover">
      <div class="preview-header">
        <h3>📄 简历正式预览</h3>
      </div>
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

const resumeRef = ref(null)
const form = reactive({
  name: '', birth: '', phone: '', email: '', address: '',
  job_hope: '', salary: '', gender: '',
  education: '', experience: '', skill: '', award: '', desc: ''
})

// 表单校验规则
const rules = reactive({
  name: [{ required: true, message: '请填写姓名', trigger: 'blur' }],
  birth: [{ required: true, message: '请填写出生年月', trigger: 'blur' },
  { pattern: /^\d{4}\.\d{2}\.\d{2}$/, message: '格式示例：2004.01.09', trigger: 'blur' }],
  phone: [{ required: true, message: '请填写手机号', trigger: 'blur' },
  { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }],
  email: [{ required: true, message: '请填写邮箱', trigger: 'blur' },
  { pattern: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, message: '邮箱格式错误', trigger: 'blur' }],
  address: [{ required: true, message: '请填写现居地址', trigger: 'blur' }],
  job_hope: [{ required: true, message: '请选择意向岗位', trigger: 'blur' }],
  salary: [{ required: true, message: '请填写期望薪资', trigger: 'blur' }],
  gender: [{ required: true, message: '请选择性别', trigger: 'change' }],
  education: [{ required: true, message: '请填写教育经历', trigger: 'blur' }],
  experience: [{ required: true, message: '请填写实习工作经历', trigger: 'blur' }],
  skill: [{ required: true, message: '请填写专业技能', trigger: 'blur' }],
  desc: [{ required: true, message: '请填写自我评价', trigger: 'blur' }]
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
  } catch (e) { }
}

const saveResume = async () => {
  resumeRef.value.validate(async valid => {
    if (!valid) return ElMessage.warning('请完善必填信息')
    const uid = getUserId()
    if (!uid) return ElMessage.warning('请先登录')
    saving.value = true
    try {
      const res = await axios.post('/api/resume/save', { user_id: uid, ...form })
      res.data.code === 1 ? ElMessage.success('保存成功') : ElMessage.error('保存失败')
    } catch (e) { ElMessage.error('保存失败') }
    saving.value = false
  })
}

const generatePreview = () => {
  resumeRef.value.validate(valid => {
    if (!valid) return ElMessage.warning('必填项未完善，无法预览')
    showPreview.value = true
    ElMessage.success('预览成功')
  })
}

const exportPDF = () => {
  resumeRef.value.validate(valid => {
    if (!valid) return ElMessage.warning('必填项未完善，无法导出')
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
  })
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
  padding: 28px;
  max-width: 960px;
  margin: 0 auto;
  background: #f7f9fc;
  min-height: 100vh;
}

/* 顶部标题 */
.resume-header {
  background: linear-gradient(135deg, #409eff, #69b1ff);
  border-radius: 18px;
  padding: 32px 28px;
  color: #fff;
  margin-bottom: 20px;
  box-shadow: 0 6px 20px rgba(64, 158, 255, 0.15);
}

.header-box h2 {
  margin: 0;
  font-size: 26px;
  font-weight: 600;
}

.header-box p {
  margin: 8px 0 0;
  opacity: 0.95;
  font-size: 15px;
}

/* 提示条 */
.tip-card {
  border-radius: 14px;
  margin-bottom: 18px;
  border: none;
}

/* 进度条 */
.progress-box {
  background: #ffffff;
  padding: 20px 24px;
  border-radius: 14px;
  margin-bottom: 24px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.04);
}

.progress-box span {
  font-size: 15px;
  color: #333;
  margin-bottom: 10px;
  display: block;
  font-weight: 500;
}

/* 表单卡片 */
.form-card {
  border-radius: 18px;
  padding: 32px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
  border: none;
}

.card-divider {
  font-size: 17px;
  font-weight: 600;
  color: #409eff;
  margin: 26px 0 18px;
}

/* 按钮组 */
.btn-group {
  margin-top: 32px;
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
}

.btn-group :deep(.el-button) {
  border-radius: 8px;
  padding: 10px 24px;
  font-size: 15px;
}

/* 预览卡片 */
.preview-card {
  border-radius: 18px;
  overflow: hidden;
  margin-top: 28px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.06);
  border: none;
}

.preview-header {
  background: #f3f7ff;
  padding: 20px 28px;
  border-bottom: 1px solid #e3ecff;
}

.preview-header h3 {
  margin: 0;
  font-size: 19px;
  color: #409eff;
  font-weight: 600;
}

/* 简历预览内容 */
.resume-pdf-box {
  background: #f7f9fc;
  padding: 50px 20px;
  display: flex;
  justify-content: center;
}

.resume-pdf-inner {
  width: 210mm;
  min-height: 297mm;
  background: #fff;
  padding: 45px 35px;
  font-family: "Microsoft YaHei", sans-serif;
  line-height: 1.8;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
}

.pdf-title {
  text-align: right;
  font-size: 14px;
  color: #777;
  margin-bottom: 8px;
  letter-spacing: 1px;
}

.pdf-name {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 14px;
  color: #222;
}

.pdf-info-line {
  display: flex;
  flex-wrap: wrap;
  column-gap: 22px;
  row-gap: 6px;
  font-size: 14px;
  color: #333;
  margin-bottom: 28px;
  padding-bottom: 14px;
  border-bottom: 1px solid #eee;
}

.pdf-section {
  margin-bottom: 26px;
}

.pdf-head {
  font-size: 16px;
  font-weight: 600;
  color: #222;
  margin-bottom: 10px;
  padding-bottom: 4px;
  border-bottom: 1px dashed #eee;
}

.pdf-text {
  font-size: 14px;
  color: #333;
  text-align: justify;
  line-height: 1.8;
}
</style>