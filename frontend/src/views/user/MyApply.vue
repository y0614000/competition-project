<template>
    <div class="apply-page">
        <!-- 顶部标题 -->
        <div class="page-header-card">
            <div class="header-left">
                <el-icon class="header-icon">
                    <Briefcase />
                </el-icon>
                <div>
                    <h2>我的投递记录</h2>
                    <p>实时查看投递进度与企业反馈，管理全部求职记录</p>
                </div>
            </div>
        </div>

        <!-- 操作按钮 -->
        <div class="btn-box">
            <el-button type="primary" icon="Plus" @click="addNew">
                新增岗位投递
            </el-button>
        </div>

        <!-- 列表 -->
        <el-card class="table-card" shadow="hover">
            <el-table :data="applyData" border stripe style="width:100%" size="default" v-loading="loading">
                <el-table-column prop="jobName" label="应聘岗位" align="center" />
                <el-table-column prop="company" label="应聘企业" align="center" />
                <el-table-column prop="city" label="工作地点" align="center" />
                <el-table-column prop="applyTime" label="投递时间" align="center" />

                <el-table-column label="审核状态" align="center">
                    <template #default="{ row }">
                        <el-tag :type="row.tagType" size="small">
                            {{ row.status }}
                        </el-tag>
                    </template>
                </el-table-column>

                <el-table-column label="操作" align="center" width="240">
                    <template #default="{ row }">
                        <div class="table-btn-group">
                            <!-- 只有 未取消 的状态才能编辑 -->
                            <el-button size="small" type="primary" @click="edit(row)" :disabled="row.status === '已取消'">
                                编辑
                            </el-button>

                            <!-- 只有 已投递 才能取消 -->
                            <el-button size="small" type="warning" @click="cancel(row)"
                                :disabled="row.status !== '已投递'">
                                取消投递
                            </el-button>

                            <el-button size="small" type="danger" @click="del(row.id)">
                                删除
                            </el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>

        <!-- 弹窗 -->
        <el-dialog v-model="dialogVisible" title="岗位投递信息" width="520px" center>
            <el-form ref="formRef" :rules="rules" label-width="80px" :model="form" label-position="right">
                <el-form-item label="岗位名称" prop="jobName">
                    <el-input v-model="form.jobName" placeholder="请输入应聘岗位" />
                </el-form-item>
                <el-form-item label="企业名称" prop="company">
                    <el-input v-model="form.company" placeholder="请输入企业名称" />
                </el-form-item>
                <el-form-item label="工作地点" prop="city">
                    <el-input v-model="form.city" placeholder="请输入工作地点" />
                </el-form-item>
                <el-form-item label="投递时间" prop="applyTime">
                    <el-input v-model="form.applyTime" placeholder="例如：2026-05-20" />
                </el-form-item>
                <el-form-item label="当前状态" prop="status">
                    <el-select v-model="form.status" placeholder="请选择状态">
                        <el-option label="已投递" value="已投递" />
                        <el-option label="面试邀约" value="面试邀约" />
                        <el-option label="已驳回" value="已驳回" />
                        <el-option label="已取消" value="已取消" />
                    </el-select>
                </el-form-item>
            </el-form>

            <template #footer>
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="save" :loading="saveLoading">确认保存</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Briefcase } from '@element-plus/icons-vue'
import axios from 'axios'

const applyData = ref([])
const dialogVisible = ref(false)
const form = ref({})
const editId = ref(null)
const loading = ref(false)
const saveLoading = ref(false)
const formRef = ref(null)

// 校验规则
const rules = reactive({
    jobName: [{ required: true, message: '请填写岗位名称', trigger: 'blur' }],
    company: [{ required: true, message: '请填写企业名称', trigger: 'blur' }],
    city: [{ required: true, message: '请填写工作地点', trigger: 'blur' }],
    applyTime: [{ required: true, message: '请填写投递时间', trigger: 'blur' }],
    status: [{ required: true, message: '请选择状态', trigger: 'change' }],
})

// 用户ID
const getUserId = () => {
    const user = localStorage.getItem('userInfo')
    return user ? JSON.parse(user).id : 0
}

// 获取列表
const getApplyList = async () => {
    loading.value = true
    try {
        const res = await axios.get('http://127.0.0.1:8000/ApplyController/getList', {
            params: { user_id: getUserId() }
        })
        if (res.data.code === 1) {
            applyData.value = res.data.data
        }
    } catch (err) {
        ElMessage.error('数据加载失败')
    }
    loading.value = false
}

// 新增
const addNew = () => {
    editId.value = null
    form.value = {
        user_id: getUserId(),
        jobName: '',
        company: '',
        city: '',
        applyTime: new Date().toISOString().slice(0, 10),
        status: '已投递',
        tagType: ''
    }
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
    await formRef.value.validate(async (valid) => {
        if (!valid) return ElMessage.warning('请完善必填信息')

        saveLoading.value = true
        const statusMap = {
            '已投递': '',
            '面试邀约': 'success',
            '已驳回': 'danger',
            '已取消': 'info'
        }
        form.value.tagType = statusMap[form.value.status]

        try {
            if (!editId.value) {
                await axios.post('http://127.0.0.1:8000/ApplyController/add', form.value)
                ElMessage.success('新增投递成功')
            } else {
                await axios.post('http://127.0.0.1:8000/ApplyController/edit', { id: editId.value, ...form.value })
                ElMessage.success('修改成功')
            }
            dialogVisible.value = false
            getApplyList()
        } catch (err) {
            ElMessage.error('保存失败')
        }
        saveLoading.value = false
    })
}

// 取消投递
const cancel = async (row) => {
    try {
        await axios.post('http://127.0.0.1:8000/ApplyController/cancel', {
            id: row.id,
            status: '已取消',
            tagType: 'info'
        })
        ElMessage.success('已取消投递')
        getApplyList()
    } catch (err) {
        ElMessage.error('操作失败')
    }
}

// 删除
const del = async (id) => {
    try {
        await ElMessageBox.confirm('确定要删除这条投递记录吗？', '提示')
    } catch {
        return
    }
    try {
        await axios.post('http://127.0.0.1:8000/ApplyController/del', { id })
        ElMessage.success('删除成功')
        getApplyList()
    } catch (err) {
        ElMessage.error('删除失败')
    }
}

onMounted(() => {
    getApplyList()
})
</script>

<style scoped>
.apply-page {
    padding: 24px;
    background: #f7f9fc;
    min-height: 100vh;
}

/* 顶部标题 */
.page-header-card {
    background: linear-gradient(135deg, #409eff, #69b1ff);
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

.header-left h2 {
    margin: 0;
    font-size: 22px;
}

.header-left p {
    margin: 4px 0 0;
    opacity: 0.92;
    font-size: 14px;
}

/* 按钮 */
.btn-box {
    margin-bottom: 18px;
}

.btn-box :deep(.el-button) {
    border-radius: 8px;
}

/* 表格卡片 */
.table-card {
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.05);
}

/* 按钮组 */
.table-btn-group {
    display: inline-flex;
    gap: 6px;
    flex-wrap: wrap;
}

.table-btn-group :deep(.el-button) {
    border-radius: 6px;
}
</style>