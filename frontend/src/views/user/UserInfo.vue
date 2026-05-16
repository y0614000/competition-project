<template>
    <div class="page-box">
        <div class="page-head">
            <h2>个人资料设置</h2>
            <p>完善个人信息，提升求职通过率</p>
        </div>
        <el-card shadow="hover" class="form-card">
            <el-form :model="userForm" label-width="100px" label-position="left">
                <el-form-item label="登录账号">
                    <el-input v-model="userForm.username" disabled></el-input>
                </el-form-item>
                <el-form-item label="真实姓名">
                    <el-input v-model="userForm.realName" placeholder="请填写真实姓名"></el-input>
                </el-form-item>
                <el-form-item label="联系电话">
                    <el-input v-model="userForm.phone" placeholder="请填写手机号码"></el-input>
                </el-form-item>
                <el-form-item label="居住城市">
                    <el-input v-model="userForm.city" placeholder="例：海口市"></el-input>
                </el-form-item>
                <el-form-item label="学历层次">
                    <el-select v-model="userForm.education" placeholder="请选择学历" style="width:100%">
                        <el-option label="专科" value="专科" />
                        <el-option label="本科" value="本科" />
                        <el-option label="硕士及以上" value="硕士" />
                    </el-select>
                </el-form-item>
                <el-form-item label="求职意向">
                    <el-input v-model="userForm.hopeJob" placeholder="意向岗位/行业"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" size="large">保存修改</el-button>
                    <el-button size="large">重置信息</el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<script setup>
import { ref } from 'vue'
const userForm = ref({
    username: '游客用户',
    realName: '',
    phone: '',
    city: '',
    education: '',
    hopeJob: ''
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

.form-card {
    border-radius: 14px;
    padding: 20px;
    max-width: 750px;
}
</style>