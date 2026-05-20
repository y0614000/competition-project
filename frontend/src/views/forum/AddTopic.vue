<template>
    <div class="add-topic-container">
        <div class="page-header">
            <h2>发布话题</h2>
            <p class="sub-title">分享日常找工作交流心得，记录美好瞬间</p>
        </div>

        <div class="form-box">
            <el-form ref="formRef" :model="form" label-width="110px" class="topic-form">
                <!-- 基础信息 -->
                <el-form-item label="话题标题">
                    <el-input v-model="form.title" placeholder="请输入话题标题" maxlength="100" show-word-limit />
                </el-form-item>

                <el-form-item label="所属分类">
                    <el-select v-model="form.type" placeholder="请选择话题所属分类">
                        <el-option label="技术交流" value="tech" />
                        <el-option label="比赛讨论" value="competition" />
                        <el-option label="经验分享" value="share" />
                        <el-option label="问题求助" value="help" />
                    </el-select>
                </el-form-item>

                <!-- 新增模块1：心情状态 -->
                <el-form-item label="当前心情">
                    <el-radio-group v-model="form.mood">
                        <el-radio label="开心" value="happy"></el-radio>
                        <el-radio label="平淡" value="normal"></el-radio>
                        <el-radio label="疑惑" value="puzzle"></el-radio>
                        <el-radio label="感慨" value="feeling"></el-radio>
                    </el-radio-group>
                </el-form-item>

                <!-- 新增模块2：自定义标签 -->
                <el-form-item label="话题标签">
                    <el-input v-model="form.tags" placeholder="多个标签用逗号分隔，例如：学习,生活,组队" />
                </el-form-item>

                <!-- 新增模块3：浏览权限 -->
                <el-form-item label="浏览权限">
                    <el-select v-model="form.lookAuth">
                        <el-option label="全员可见" value="all" />
                        <el-option label="仅好友可见" value="friend" />
                        <el-option label="仅自己可见" value="self" />
                    </el-select>
                </el-form-item>

                <!-- 内容编辑 -->
                <el-form-item label="话题正文">
                    <el-input v-model="form.content" type="textarea" rows="8" placeholder="在这里编辑你的话题内容，畅所欲言..."
                        maxlength="1000" show-word-limit />
                </el-form-item>

                <!-- 操作按钮 -->
                <el-form-item>
                    <el-button type="primary" @click="submitTopic" :loading="loading">
                        <el-icon>
                            <Check />
                        </el-icon>
                        确认发布
                    </el-button>
                    <el-button @click="goBack">
                        <el-icon>
                            <Back />
                        </el-icon>
                        返回列表
                    </el-button>
                    <el-button type="success" plain @click="saveDraft">
                        <el-icon>
                            <Document />
                        </el-icon>
                        保存草稿
                    </el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script setup>
// ✅ 已修复：这里加上了 onMounted
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Check, Back, Document } from '@element-plus/icons-vue'
import axios from 'axios'

const router = useRouter()
const loading = ref(false)

// 扩展表单字段，新增所有模块数据
const form = reactive({
    title: '',
    type: 'tech',
    content: '',
    mood: 'normal',       // 心情状态
    tags: '',             // 话题标签
    lookAuth: 'all'       // 浏览权限
})

// 获取用户ID
const getUserId = () => {
    const user = localStorage.getItem('userInfo')
    if (!user) return null
    return JSON.parse(user).id
}

// 提交发布
const submitTopic = async () => {
    if (!form.title.trim()) {
        ElMessage.warning('请填写话题标题')
        return
    }
    if (!form.content.trim()) {
        ElMessage.warning('请填写话题正文内容')
        return
    }

    const uid = getUserId()
    if (!uid) {
        ElMessage.warning('请先登录账号')
        return
    }

    loading.value = true
    try {
        const res = await axios.post('http://127.0.0.1:8000/api/forum/topic/save', {
            title: form.title,
            content: form.content,
            user_id: uid,
            author: '用户',
            type: form.type,
            mood: form.mood,
            tags: form.tags,
            look_auth: form.lookAuth
        })

        if (res.data.code === 200) {
            ElMessage.success('话题发布成功')
            router.push('/topicList')
        } else {
            ElMessage.error(res.data.msg)
        }
    } catch (e) {
        console.error(e)
        ElMessage.error('发布失败，请检查网络')
    } finally {
        loading.value = false
    }
}

// 保存草稿（前端临时存储）
const saveDraft = () => {
    localStorage.setItem('topicDraft', JSON.stringify(form))
    ElMessage.success('草稿保存成功，下次可继续编辑')
}

// 返回列表
const goBack = () => {
    router.push('/topicList')
}

// 页面加载读取草稿
onMounted(() => {
    const draft = localStorage.getItem('topicDraft')
    if (draft) {
        Object.assign(form, JSON.parse(draft))
    }
})
</script>

<style scoped>
.add-topic-container {
    padding: 25px;
    background-color: #f0f4f8;
    min-height: calc(100vh - 60px);
}

.page-header {
    margin-bottom: 25px;
}

.page-header h2 {
    margin: 0;
    font-size: 24px;
    font-weight: 600;
    color: #2c3e50;
}

.sub-title {
    margin: 6px 0 0;
    color: #7f8c8d;
    font-size: 14px;
}

.form-box {
    background: #ffffff;
    padding: 35px;
    border-radius: 14px;
    box-shadow: 0 2px 15px rgba(0, 0, 0, 0.08);
    max-width: 950px;
}

.topic-form {
    width: 100%;
}

/* 统一美化输入框样式，简约大方 */
:deep(.el-input__inner) {
    border-radius: 8px;
    border-color: #dce1e8;
}

:deep(.el-input__inner:focus) {
    border-color: #409eff;
}

:deep(.el-form-item__label) {
    color: #34495e;
    font-weight: 500;
}
</style>