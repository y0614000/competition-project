<template>
    <div class="profile-page">
        <!-- ✅ 整个标题区域被完整框起来，清爽规整 -->
        <div class="header-wrapper">
            <div class="page-header">
                <div class="header-left">
                    <h2>个人资料设置</h2>
                    <p>完善信息能大幅提升企业查看率和职位匹配度</p>
                </div>
                <el-button type="primary" icon="Check" @click="submitProfile">
                    保存全部资料
                </el-button>
            </div>

            <!-- 头像区域也被包裹在同一个外框里，和标题一体化 -->
            <div class="avatar-section">
                <div class="avatar-box">
                    <img :src="avatarUrl" alt="头像" class="avatar-img" />
                    <el-button type="primary" size="small" icon="Upload" @click="triggerUpload">
                        更换头像
                    </el-button>
                    <input ref="uploadInput" type="file" accept="image/*" style="display: none"
                        @change="handleAvatarChange" />
                </div>
            </div>
        </div>

        <!-- 表单内容 -->
        <div class="form-container">
            <div class="panel-card">
                <div class="panel-title">
                    <el-icon>
                        <User />
                    </el-icon>
                    基础信息
                </div>
                <el-form :model="form" label-width="110px" class="profile-form">
                    <el-form-item label="登录账号">
                        <el-input v-model="form.username" disabled placeholder="不可修改" />
                    </el-form-item>
                    <el-form-item label="真实姓名">
                        <el-input v-model="form.realName" placeholder="请输入真实姓名" />
                    </el-form-item>
                    <el-form-item label="手机号码">
                        <el-input v-model="form.phone" placeholder="请输入有效联系电话" />
                    </el-form-item>
                    <el-form-item label="居住城市">
                        <el-input v-model="form.city" placeholder="如：海口市" />
                    </el-form-item>
                    <el-form-item label="最高学历">
                        <el-select v-model="form.education" style="width:100%">
                            <el-option label="高中/中专" value="高中" />
                            <el-option label="专科" value="专科" />
                            <el-option label="本科" value="本科" />
                            <el-option label="硕士" value="硕士" />
                            <el-option label="博士" value="博士" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="毕业院校">
                        <el-input v-model="form.school" placeholder="请填写院校名称" />
                    </el-form-item>
                </el-form>
            </div>

            <div class="panel-card">
                <div class="panel-title">
                    <el-icon>
                        <Briefcase />
                    </el-icon>
                    求职意向
                </div>
                <el-form :model="form" label-width="110px">
                    <el-form-item label="意向岗位">
                        <el-input v-model="form.hopeJob" placeholder="如：前端开发 / 行政专员" />
                    </el-form-item>
                    <el-form-item label="期望薪资">
                        <el-input v-model="form.salary" placeholder="如：6000-8000" />
                    </el-form-item>
                    <el-form-item label="工作经验">
                        <el-select v-model="form.exp" style="width:100%">
                            <el-option label="应届生" value="应届生" />
                            <el-option label="1年以内" value="1年以内" />
                            <el-option label="1-3年" value="1-3年" />
                            <el-option label="3-5年" value="3-5年" />
                            <el-option label="5年以上" value="5年以上" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="技能标签">
                        <el-tag v-for="(t, i) in skills" :key="i" closable type="primary" size="small"
                            @close="delSkill(i)">{{ t }}</el-tag>
                        <el-input v-model="skillInput" size="small" style="width:180px; margin-top:8px"
                            placeholder="回车添加技能" @keyup.enter="addSkill" />
                    </el-form-item>
                    <el-form-item label="自我描述">
                        <el-input v-model="form.intro" type="textarea" rows="4" placeholder="介绍自己的优势、经验、特长..." />
                    </el-form-item>
                </el-form>
            </div>

            <div class="panel-card">
                <div class="panel-title">
                    <el-icon>
                        <Lock />
                    </el-icon>
                    安全设置
                </div>
                <el-form :model="pwdForm" label-width="110px">
                    <el-form-item label="原密码">
                        <el-input v-model="pwdForm.old" show-password placeholder="请输入当前密码" />
                    </el-form-item>
                    <el-form-item label="新密码">
                        <el-input v-model="pwdForm.new" show-password placeholder="6-16位" />
                    </el-form-item>
                    <el-form-item label="确认密码">
                        <el-input v-model="pwdForm.confirm" show-password placeholder="再次输入新密码" />
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" size="small" @click="updatePwd">修改密码</el-button>
                    </el-form-item>
                </el-form>
            </div>

            <div class="action-buttons">
                <el-button type="primary" size="default" icon="Check" @click="submitProfile">
                    保存所有修改
                </el-button>
                <el-button size="default" icon="Refresh" @click="resetForm">
                    重置信息
                </el-button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { User, Briefcase, Lock, Upload } from '@element-plus/icons-vue'

const uploadInput = ref(null)
const avatarUrl = ref('https://picsum.photos/seed/avatar/120/120')
const triggerUpload = () => uploadInput.value.click()
const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    if (file) {
        avatarUrl.value = URL.createObjectURL(file)
        ElMessage.success('头像上传成功（预览）')
    }
}

const skills = ref(['Vue', 'JavaScript', 'CSS'])
const skillInput = ref('')
const addSkill = () => {
    const v = skillInput.value.trim()
    if (!v) return ElMessage.warning('请输入技能')
    if (skills.value.includes(v)) return ElMessage.warning('已存在')
    skills.value.push(v)
    skillInput.value = ''
}
const delSkill = (i) => skills.value.splice(i, 1)

const form = reactive({
    username: 'student2025',
    realName: '',
    phone: '',
    city: '',
    education: '',
    school: '',
    hopeJob: '',
    salary: '',
    exp: '应届生',
    intro: ''
})

const pwdForm = reactive({ old: '', new: '', confirm: '' })

const submitProfile = () => {
    if (!form.realName) return ElMessage.warning('请填写真实姓名')
    ElMessage.success('个人资料保存成功！')
}

const resetForm = () => {
    form.realName = ''
    form.phone = ''
    form.city = ''
    form.education = ''
    form.school = ''
    form.hopeJob = ''
    form.salary = ''
    form.exp = '应届生'
    form.intro = ''
    ElMessage.info('已重置')
}

const updatePwd = () => {
    if (!pwdForm.old || !pwdForm.new) return ElMessage.warning('请填写完整')
    if (pwdForm.new !== pwdForm.confirm) return ElMessage.warning('两次密码不一致')
    ElMessage.success('密码修改成功')
}
</script>

<style scoped>
.profile-page {
    padding: 28px;
    background: #f7f8fa;
    min-height: 100vh;
}

/* ✅ 标题区域的整体外框，清爽规整 */
.header-wrapper {
    background: #ffffff;
    border: 1px solid #e5eaf3;
    border-radius: 14px;
    padding: 24px;
    margin-bottom: 24px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.header-left h2 {
    font-size: 24px;
    color: #222;
    margin: 0 0 6px;
}

.header-left p {
    color: #888;
    margin: 0;
    font-size: 14px;
}

/* 头像居中，和标题在同一个外框里 */
.avatar-section {
    display: flex;
    justify-content: center;
}

.avatar-box {
    text-align: center;
}

.avatar-img {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    object-fit: cover;
    border: 3px solid #fff;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    margin-bottom: 12px;
}

.form-container {
    max-width: 820px;
    margin: 0 auto;
}

.panel-card {
    background: #fff;
    border: 1px solid #e1e7f0;
    border-radius: 14px;
    padding: 24px;
    margin-bottom: 20px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);
}

.panel-title {
    font-size: 16px;
    font-weight: 600;
    color: #333;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 8px;
    padding-bottom: 10px;
    border-bottom: 1px dashed #e8edf5;
}

:deep(.el-form-item) {
    margin-bottom: 18px;
}

.action-buttons {
    display: flex;
    justify-content: center;
    gap: 15px;
    margin-top: 10px;
}
</style>