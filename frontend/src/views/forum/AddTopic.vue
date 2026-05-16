<template>
    <div class="add-topic-container">
        <div class="page-header">
            <h2>发布话题</h2>
        </div>

        <div class="form-box">
            <el-form ref="formRef" :model="form" label-width="100px" class="topic-form">
                <el-form-item label="话题标题" prop="title">
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

                <el-form-item label="是否公开">
                    <el-radio-group v-model="form.isPublic">
                        <el-radio :label="true">公开</el-radio>
                        <el-radio :label="false">仅自己可见</el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="submitTopic">
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

const router = useRouter()

// 表单数据
const formRef = ref()
const form = reactive({
    title: '',
    type: 'tech',
    content: '',
    isPublic: true
})

// 提交发布
const submitTopic = () => {
    if (!form.title.trim()) {
        ElMessage.warning('请输入话题标题')
        return
    }
    if (!form.content.trim()) {
        ElMessage.warning('请输入话题内容')
        return
    }

    // 模拟发布成功
    ElMessage.success('话题发布成功！')

    // 发布后返回列表
    setTimeout(() => {
        router.push('/forum/topicList')
    }, 800)
}

// 返回列表
const goBack = () => {
    router.push('/forum/topicList')
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