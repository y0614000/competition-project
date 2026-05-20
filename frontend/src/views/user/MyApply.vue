<template>
    <div class="page-box">
        <div class="page-head">
            <h2>我的岗位投递记录</h2>
            <p>实时查看投递进度与企业反馈</p>
        </div>

        <div style="margin-bottom:15px">
            <el-button type="primary" @click="addNew">+ 新增岗位投递</el-button>
        </div>

        <el-card shadow="hover">
            <el-table :data="applyData" border stripe style="width:100%" size="small" v-loading="loading">
                <el-table-column prop="jobName" label="应聘岗位" align="center" />
                <el-table-column prop="company" label="应聘企业" align="center" />
                <el-table-column prop="city" label="工作地点" align="center" />
                <el-table-column prop="applyTime" label="投递时间" align="center" />

                <el-table-column label="审核状态" align="center">
                    <template #default="{ row }">
                        <el-tag :type="row.tagType">{{ row.status }}</el-tag>
                    </template>
                </el-table-column>

                <el-table-column label="操作" align="center" width="260">
                    <template #default="{ row, $index }">
                        <div style="display:inline-flex;gap:4px;white-space:nowrap;">
                            <el-button size="small" type="primary" @click="edit(row, $index)">编辑</el-button>
                            <el-button size="small" type="warning" @click="cancel(row, $index)">取消投递</el-button>
                            <el-button size="small" type="danger" @click="del(row.id, $index)">删除</el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>

        <el-dialog v-model="dialogVisible" title="岗位投递信息" width="500px">
            <el-form label-width="80px" :model="form">
                <el-form-item label="岗位名称">
                    <el-input v-model="form.jobName" placeholder="请输入" />
                </el-form-item>
                <el-form-item label="企业名称">
                    <el-input v-model="form.company" placeholder="请输入" />
                </el-form-item>
                <el-form-item label="工作地点">
                    <el-input v-model="form.city" placeholder="请输入" />
                </el-form-item>
                <el-form-item label="投递时间">
                    <el-input v-model="form.applyTime" placeholder="例如：2026-05-20" />
                </el-form-item>
                <el-form-item label="当前状态">
                    <el-select v-model="form.status" placeholder="请选择">
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
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import axios from 'axios'

const applyData = ref([])
const dialogVisible = ref(false)
const form = ref({})
const editId = ref(null)
const loading = ref(false)
const saveLoading = ref(false)

// 获取登录用户ID   这个页面是获取用户ID的否则获取不到数据
const getUserId = () => {
    const user = localStorage.getItem('userInfo')
    return user ? JSON.parse(user).id : 0
}

// 1. 页面加载读取数据库投递记录
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

// 保存新增/编辑 存入数据库
const save = async () => {
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
            // 新增
            await axios.post('http://127.0.0.1:8000/ApplyController/add', form.value)
            ElMessage.success('新增投递成功')
        } else {
            // 编辑修改
            await axios.post('http://127.0.0.1:8000/ApplyController/edit', { id: editId.value, ...form.value })
            ElMessage.success('修改成功')
        }
        dialogVisible.value = false
        getApplyList() // 刷新列表
    } catch (err) {
        ElMessage.error('保存失败')
    }
    saveLoading.value = false
}

// 取消投递（修改状态存库）
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

// 删除数据库数据
const del = async (id) => {
    await ElMessageBox.confirm('确定要删除这条投递记录吗？', '提示')
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
</style>