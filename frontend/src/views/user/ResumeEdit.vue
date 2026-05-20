<template>
    <div class="page-box">
        <div class="page-head">
            <h2>个人简历编辑</h2>
            <p>填写完整简历，更快被企业看中</p>
        </div>

        <el-alert title="简历越完整，匹配率越高！" type="success" show-icon style="margin-bottom:15px" />
        <el-progress :percentage="completePercent" stroke-width="14" style="margin-bottom:25px" />

        <el-card shadow="hover" class="resume-card">
            <el-form label-width="120px" model="form">

                <el-divider content-position="left">基础信息</el-divider>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="真实姓名">
                            <el-input v-model="form.real_name" placeholder="请输入真实姓名"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="性别">
                            <el-select v-model="form.gender" placeholder="请选择">
                                <el-option label="男" value="男"></el-option>
                                <el-option label="女" value="女"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="联系电话">
                            <el-input v-model="form.phone" placeholder="请输入电话"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="电子邮箱">
                            <el-input v-model="form.email" placeholder="请输入邮箱"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="意向城市">
                            <el-input v-model="form.city_hope" placeholder="海口/三亚等"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="意向岗位">
                            <el-input v-model="form.job_hope" placeholder="如：职业培训师"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="期望薪资">
                            <el-input v-model="form.salary_hope" placeholder="如：5K-10K"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="工作性质">
                            <el-select v-model="form.work_type" placeholder="请选择">
                                <el-option label="全职" value="全职"></el-option>
                                <el-option label="实习" value="实习"></el-option>
                                <el-option label="兼职" value="兼职"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-divider content-position="left">教育经历</el-divider>
                <el-form-item label="教育经历">
                    <el-input v-model="form.education" type="textarea" rows="3" placeholder="学校、专业、时间"></el-input>
                </el-form-item>

                <el-divider content-position="left">工作/实习经历</el-divider>
                <el-form-item label="实习/工作经历">
                    <el-input v-model="form.experience" type="textarea" rows="3" placeholder="单位、岗位、内容"></el-input>
                </el-form-item>

                <el-divider content-position="left">专业技能</el-divider>
                <el-form-item label="专业技能">
                    <el-input v-model="form.skill" type="textarea" rows="2" placeholder="语言、软件、能力"></el-input>
                </el-form-item>

                <el-divider content-position="left">项目经验</el-divider>
                <el-form-item label="项目经验">
                    <el-input v-model="form.project_exp" type="textarea" rows="3" placeholder="项目名、职责、技术"></el-input>
                </el-form-item>

                <el-divider content-position="left">荣誉/证书</el-divider>
                <el-form-item label="荣誉奖项">
                    <el-input v-model="form.award" type="textarea" rows="2" placeholder="获奖时间、名称"></el-input>
                </el-form-item>
                <el-form-item label="资质证书">
                    <el-input v-model="form.certificate" type="textarea" rows="2" placeholder="证书名、编号"></el-input>
                </el-form-item>

                <el-divider content-position="left">其他信息</el-divider>
                <el-form-item label="兴趣爱好">
                    <el-input v-model="form.hobby" placeholder="写作、运动、阅读等"></el-input>
                </el-form-item>

                <el-form-item label="自我评价">
                    <el-input v-model="form.desc" type="textarea" rows="3" placeholder="性格、优势、规划"></el-input>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" size="large" @click="saveResume" :loading="saving">
                        保存到数据库
                    </el-button>
                    <el-button type="success" size="large" @click="generatePreview">
                        在线预览
                    </el-button>
                    <el-button type="warning" size="large" @click="exportPDF">
                        导出 PDF
                    </el-button>
                </el-form-item>
            </el-form>
        </el-card>

        <el-card v-if="showPreview" class="preview-card" shadow="hover">
            <div class="resume-preview" id="resumePreview">
                <h3 class="title">个人简历</h3>
                <div class="section">
                    <h4>👤 基本信息</h4>
                    <p class="content">
                        姓名：{{ form.real_name || '未填写' }}<br>
                        性别：{{ form.gender || '未填写' }}<br>
                        电话：{{ form.phone || '未填写' }}<br>
                        邮箱：{{ form.email || '未填写' }}<br>
                        意向城市：{{ form.city_hope || '未填写' }} | 意向岗位：{{ form.job_hope || '未填写' }}<br>
                        期望薪资：{{ form.salary_hope || '未填写' }} | 工作性质：{{ form.work_type || '未填写' }}
                    </p>
                </div>

                <div class="section">
                    <h4>🎓 教育经历</h4>
                    <p class="content">{{ form.education || '未填写' }}</p>
                </div>
                <div class="section">
                    <h4>💼 工作经历</h4>
                    <p class="content">{{ form.experience || '未填写' }}</p>
                </div>
                <div class="section">
                    <h4>🛠️ 专业技能</h4>
                    <p class="content">{{ form.skill || '未填写' }}</p>
                </div>
                <div class="section">
                    <h4>📦 项目经验</h4>
                    <p class="content">{{ form.project_exp || '未填写' }}</p>
                </div>
                <div class="section">
                    <h4>🏆 荣誉奖项</h4>
                    <p class="content">{{ form.award || '未填写' }}</p>
                </div>
                <div class="section">
                    <h4>📜 证书资质</h4>
                    <p class="content">{{ form.certificate || '未填写' }}</p>
                </div>
                <div class="section">
                    <h4>🎨 兴趣爱好</h4>
                    <p class="content">{{ form.hobby || '未填写' }}</p>
                </div>
                <div class="section">
                    <h4>📌 自我评价</h4>
                    <p class="content">{{ form.desc || '未填写' }}</p>
                </div>
            </div>
        </el-card>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage } from 'element-plus'
import axios from 'axios'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

const form = reactive({
    real_name: '', gender: '', phone: '', email: '',
    city_hope: '', job_hope: '', salary_hope: '', work_type: '',
    education: '', experience: '', skill: '', award: '',
    project_exp: '', certificate: '', hobby: '', desc: ''
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
        const res = await axios.get('http://127.0.0.1:8000/ResumeController/get', { params: { user_id: uid } })
        if (res.data.code === 1) Object.assign(form, res.data.data)
    } catch (e) { }
}

const saveResume = async () => {
    const uid = getUserId()
    if (!uid) return ElMessage.warning('请先登录')
    saving.value = true
    try {
        const res = await axios.post('http://127.0.0.1:8000/ResumeController/save', { user_id: uid, ...form })
        res.data.code === 1 ? ElMessage.success('保存成功') : ElMessage.error(res.data.msg)
    } catch (e) {
        ElMessage.error('保存失败')
    }
    saving.value = false
}

const generatePreview = () => {
    showPreview.value = true
    ElMessage.success('已生成预览')
}

const exportPDF = () => {
    if (!showPreview.value) showPreview.value = true
    ElMessage.info('生成中...')

    setTimeout(() => {
        const dom = document.getElementById('resumePreview')
        html2canvas(dom, { scale: 2, useCORS: true }).then(canvas => {
            const img = canvas.toDataURL('image/png')
            const pdf = new jsPDF('p', 'mm', 'a4')
            const width = 210
            const height = canvas.height * width / canvas.width
            pdf.addImage(img, 'PNG', 0, 0, width, height)
            pdf.save('个人简历.pdf')
            ElMessage.success('PDF 导出成功')
        })
    }, 500)
}

const completePercent = computed(() => {
    let total = 17  // 总字段数不变
    let count = 0

    Object.values(form).forEach(val => {
        // 只有真正有内容，才算填写
        if (val !== null && val !== undefined && String(val).trim() !== '') {
            count++
        }
    })

    // 计算百分比，最小 0%
    return Math.min(Math.round((count / total) * 100), 100)
})

onMounted(() => loadResume())
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
    margin: 0 0 5px;
}

.page-head p {
    color: #999;
    margin: 0;
}

.resume-card {
    border-radius: 14px;
    padding: 20px;
    max-width: 880px;
    margin-bottom: 30px;
}

.preview-card {
    max-width: 880px;
    border-radius: 14px;
    background: #fcfdff;
}

.resume-preview {
    padding: 30px;
}

.resume-preview .title {
    text-align: center;
    font-size: 26px;
    border-bottom: 2px solid #409eff;
    padding-bottom: 10px;
    margin-bottom: 25px;
}

.section {
    margin-bottom: 20px;
}

.section h4 {
    font-size: 16px;
    color: #409eff;
    margin: 0 0 8px;
}

.content {
    line-height: 1.7;
    color: #333;
    white-space: pre-wrap;
}
</style>