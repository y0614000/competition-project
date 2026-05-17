<template>
    <div class="add-topic-container">
        <div class="page-header">
            <h2>发布话题</h2>
        </div>

        <div class="form-box">
            <el-form ref="formRef" :model="form" label-width="100px" class="topic-form">
                <el-form-item label="话题标题">
                    <el-input v-model="form.title" placeholder="请输入话题标题" maxlength="100" show-word-limit />
                </el-form-item>

                <el-form-item label="话题分类">
                    <el-select v-model="form.type" placeholder="请选择分类">
                        <el-option label="技术交流" value="tech" />
                        <el-option label="比赛讨论" value="competition" />
                        <el-option label="经验分享" value="share" />
                        <el-option label="问题求助" value="help" />
                    </el-select>
                </el-form-item>

                <el-form-item label="话题内容">
                    <el-input v-model="form.content" type="textarea" rows="8" placeholder="请详细描述你的话题内容..."
                        maxlength="1000" show-word-limit />
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="submitTopic" :loading="loading">
                        <el-icon>
                            <Check />
                        </el-icon>
                        发布话题
                    </el-button>
                    <el-button @click="goBack">
                        <el-icon>
                            <Back />
                        </el-icon>
                        返回列表
                    </el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Check, Back } from '@element-plus/icons-vue'
import axios from 'axios'

const router = useRouter()
const loading = ref(false)

// ✅ 必须先定义 form，再用在模板里
const form = reactive({
    title: '',
    type: 'tech',
    content: ''
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
        ElMessage.warning('请输入话题标题')
        return
    }
    if (!form.content.trim()) {
        ElMessage.warning('请输入话题内容')
        return
    }

    const uid = getUserId()
    if (!uid) {
        ElMessage.warning('请先登录')
        return
    }

    loading.value = true
    try {
        const res = await axios.post('http://127.0.0.1:8000/api/forum/topic/save', {
            title: form.title,
            content: form.content,
            user_id: uid,
            author: '用户'
        })

        if (res.data.code === 200) {
            ElMessage.success('发布成功！')
            router.push('/topicList')
        } else {
            ElMessage.error(res.data.msg)
        }
    } catch (e) {
        console.error(e)
        ElMessage.error('发布失败')
    } finally {
        loading.value = false
    }
}

// 返回
const goBack = () => {
    router.push('/topicList')
}
</script>

<style scoped>
.add-topic-container {
    padding: 20px;
    background: #f5f7fa;
    min-height: calc(100vh - 60px);
}

.page-header {
    margin-bottom: 20px;
}

.page-header h2 {
    margin: 0;
    font-size: 22px;
    font-weight: 600;
    color: #333;
}

.form-box {
    background: #fff;
    padding: 30px;
    border-radius: 8px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
    max-width: 900px;
}

.topic-form {
    width: 100%;
}
</style>