<template>
    <div class="login-box">
        <el-card shadow="hover" class="login-card">
            <h2 class="title">自贸港人才服务系统</h2>
            <el-form :model="form" label-width="80px">
                <el-form-item label="账号">
                    <el-input v-model="form.username" placeholder="请输入账号"></el-input>
                </el-form-item>
                <el-form-item label="密码">
                    <el-input v-model="form.password" type="password" placeholder="请输入密码"></el-input>
                </el-form-item>
                <el-form-item label="身份">
                    <el-select v-model="form.role" placeholder="请选择身份">
                        <el-option label="求职者" :value="1"></el-option>
                        <el-option label="企业" :value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="login" style="width:100%">登录</el-button>
                    <el-button @click="register" style="width:100%;margin-top:10px">注册账号</el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<script setup>
import { ref, getCurrentInstance } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const { proxy } = getCurrentInstance()
const router = useRouter()
const form = ref({
    username: '',
    password: '',
    role: 1
})

// // 登录
// const login = async () => {
//     let res = await proxy.$http.post('/user/login', form.value)
//     if (res.data.code === 1) {
//         localStorage.setItem('userInfo', JSON.stringify(res.data.data))
//         ElMessage.success('登录成功')
//         if (form.value.role === 1) {
//             router.push('/user')
//         } else {
//             router.push('/company')
//         }
//     } else {
//         ElMessage.error(res.data.msg)
//     }
// }

// // 注册
// const register = async () => {
//     if (!form.value.username || !form.value.password) {
//         return ElMessage.warning('请填写完整信息')
//     }
//     let res = await proxy.$http.post('/user/register', form.value)
//     if (res.data.code === 1) {
//         ElMessage.success('注册成功，请登录')
//     }
// }
</script>

<style scoped>
.login-box {
    width: 100%;
    height: 100vh;
    background: #f5f7fa;
    display: flex;
    justify-content: center;
    align-items: center;
}

.login-card {
    width: 400px;
    padding: 30px;
}

.title {
    text-align: center;
    margin-bottom: 25px;
    color: #333;
}
</style>