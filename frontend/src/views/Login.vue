<template>
    <div class="login-page">
        <div class="login-container">
            <div class="login-left">
                <div class="left-content">
                    <h1>自贸港人才服务系统</h1>
                    <p>专注人才对接 · 服务海南自贸港</p>
                    <div class="image-box">
                        <img src="https://picsum.photos/id/180/600/400" alt="banner">
                    </div>
                </div>
            </div>

            <div class="login-right">
                <div class="form-wrapper">
                    <h2>欢迎登录</h2>
                    <p class="desc">Welcome to login</p>

                    <el-form :model="form" label-width="80px" class="login-form">
                        <el-form-item label="账号">
                            <el-input v-model="form.username" placeholder="请输入账号" size="large" prefix-icon="User" />
                        </el-form-item>

                        <el-form-item label="密码">
                            <el-input v-model="form.password" type="password" placeholder="请输入密码" size="large"
                                prefix-icon="Lock" />
                        </el-form-item>

                        <el-form-item class="btn-wrap">
                            <el-button type="primary" :loading="loading" @click="login" size="large" class="login-btn">
                                立即登录
                            </el-button>
                            <span class="split-line"></span>
                            <el-button text @click="toRegister" class="reg-text-btn">
                                没有账号？去注册
                            </el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { User, Lock } from '@element-plus/icons-vue'
import axios from 'axios'

const router = useRouter()
const loading = ref(false)
const form = ref({
    username: '',
    password: ''
})

// 登录
const login = async () => {
    if (!form.value.username || !form.value.password) {
        return ElMessage.warning('请输入账号密码')
    }

    loading.value = true
    try {
        const res = await axios.post('http://127.0.0.1:8000/user/login', form.value)
        if (res.data.code === 1) {
            ElMessage.success('登录成功')
            // 登录成功存 localStorage（路由守卫需要）
            localStorage.setItem('userInfo', JSON.stringify(res.data))
            router.push('/home')
        } else {
            ElMessage.error(res.data.msg)
        }
    } catch (err) {
        ElMessage.error('网络异常')
    } finally {
        loading.value = false
    }
}

// 去注册 —— 修复完成！
const toRegister = () => {
    router.push('/register')
}
</script>

<style scoped>
.login-page {
    width: 100vw;
    height: 100vh;
    background: linear-gradient(135deg, #409eff 10%, #66b6ff 100%);
    display: flex;
    align-items: center;
    justify-content: center;
}

.login-container {
    width: 900px;
    height: 520px;
    background: #fff;
    border-radius: 20px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
    display: flex;
    overflow: hidden;
}

.login-left {
    width: 450px;
    background: linear-gradient(135deg, #409eff 10%, #66b6ff 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    text-align: center;
}

.left-content h1 {
    font-size: 26px;
    margin-bottom: 10px;
}

.left-content p {
    opacity: 0.9;
    margin-bottom: 30px;
}

.image-box {
    width: 320px;
    height: 220px;
    margin: 0 auto;
    border-radius: 12px;
    overflow: hidden;
}

.image-box img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.login-right {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px;
}

.form-wrapper h2 {
    font-size: 28px;
    color: #333;
    margin-bottom: 6px;
}

.form-wrapper .desc {
    color: #999;
    margin-bottom: 30px;
}

.login-form {
    width: 320px;
}

.btn-wrap {
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.login-btn {
    width: 100%;
    border-radius: 8px;
    font-weight: 500;
    letter-spacing: 2px;
}

.split-line {
    margin: 12px 0;
    color: #ccc;
}

.reg-text-btn {
    font-size: 14px;
    color: #409eff;
    cursor: pointer;
}
</style>