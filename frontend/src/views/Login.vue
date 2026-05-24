<template>
    <div class="login-page">
        <div class="login-container">
            <div class="login-left">
                <div class="left-content">
                    <div class="logo-badge">自贸港</div>
                    <h1>海南自贸港人才服务系统</h1>
                    <p>聚天下英才 · 建自贸新高地</p>
                    <div class="image-box">
                        <img src="/images/login/login.png" alt="banner" />
                    </div>
                    <div class="tags">
                        <span>人才对接</span>
                        <span>政策服务</span>
                        <span>自贸发展</span>
                    </div>
                </div>
                <div class="wave-decor"></div>
            </div>

            <div class="login-right">
                <div class="form-wrapper">
                    <h2>欢迎登录</h2>
                    <p class="desc">Welcome to Hainan FTP Talent System</p>

                    <el-form :model="form" label-width="80px" class="login-form">
                        <el-form-item label="账号">
                            <el-input v-model="form.username" placeholder="请输入账号" size="large" prefix-icon="User" />
                        </el-form-item>

                        <el-form-item label="密码">
                            <el-input v-model="form.password" type="password" placeholder="请输入密码" size="large"
                                prefix-icon="Lock" />
                        </el-form-item>

                        <!-- 🔥 角色选择：求职者 / 企业 -->
                        <el-form-item label="登录身份">
                            <el-radio-group v-model="form.role">
                                <el-radio value="user">求职者</el-radio>
                                <el-radio value="company">企业</el-radio>
                            </el-radio-group>
                        </el-form-item>

                        <el-form-item class="btn-wrap">
                            <el-button type="primary" :loading="loading" @click="login" size="large" class="login-btn">
                                立即登录
                            </el-button>
                            <span class="split-line">—————— 或者 ——————</span>
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
import axios from '../utils/request'

const router = useRouter()
const loading = ref(false)
const form = ref({
    username: '',
    password: '',
    role: 'user' // 默认求职者
})

const login = async () => {
    if (!form.value.username || !form.value.password) {
        return ElMessage.warning('请输入账号密码')
    }
    loading.value = true
    try {
        const res = await axios.post('/user/login', form.value)
        if (res.data.code === 1) {
            ElMessage.success('登录成功')
            localStorage.setItem('userInfo', JSON.stringify(res.data.data))
            router.push('/home')
        } else {
            ElMessage.error(res.data.msg)
        }
    } catch (err) {
        ElMessage.error('网络异常或服务未启动')
    } finally {
        loading.value = false
    }
}

const toRegister = () => {
    router.push('/register')
}
</script>

<style scoped>
.login-page {
    font-family: '华文中宋';
    width: 100vw;
    height: 100vh;
    background: linear-gradient(135deg, #1e88e5 0%, #42a5f5 50%, #64b5f6 100%);
    display: flex;
    align-items: center;
    justify-content: center;
}

.login-container {
    width: 900px;
    height: 560px;
    background: #fff;
    border-radius: 24px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
    display: flex;
    overflow: hidden;
    transition: all 0.3s ease;
}

.login-container:hover {
    transform: translateY(-6px);
    box-shadow: 0 30px 80px rgba(0, 0, 0, 0.15);
}

.login-left {
    width: 450px;
    background: linear-gradient(135deg, #0277bd 0%, #4fc3f7 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    text-align: center;
    position: relative;
}

.left-content h1 {
    font-size: 28px;
    margin-bottom: 10px;
    font-weight: 600;
}

.left-content p {
    opacity: 0.95;
    margin-bottom: 30px;
    font-size: 15px;
}

.logo-badge {
    display: inline-block;
    padding: 6px 14px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 50px;
    font-size: 14px;
    margin-bottom: 16px;
    backdrop-filter: blur(10px);
}

.tags {
    margin-top: 24px;
    display: flex;
    justify-content: center;
    gap: 10px;
}

.tags span {
    padding: 6px 12px;
    background: rgba(255, 255, 255, 0.15);
    border-radius: 30px;
    font-size: 12px;
}

.image-box {
    width: 340px;
    height: 220px;
    margin: 0 auto;
    border-radius: 16px;
    overflow: hidden;
    background: rgba(255, 255, 255, 0.1);
}

.image-box img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.wave-decor {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 80px;
    background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="rgba(255,255,255,0.15)" d="M0,192L48,208C96,224,192,256,288,245.3C384,235,480,181,576,160C672,139,768,149,864,154.7C960,160,1056,160,1152,133.3C1248,107,1344,53,1392,26.7L1440,0L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path></svg>');
    background-size: cover;
    opacity: 0.8;
}

.login-right {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px;
}

.form-wrapper {
    width: 330px;
}

.form-wrapper h2 {
    font-size: 28px;
    color: #222;
    margin-bottom: 6px;
    text-align: center;
}

.form-wrapper .desc {
    color: #888;
    margin-bottom: 26px;
    font-size: 14px;
    text-align: center;
}

.login-form {
    width: 100%;
}

.btn-wrap {
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.login-btn {
    width: 100%;
    border-radius: 10px;
    font-weight: 600;
    letter-spacing: 1px;
    background: #0277bd;
    border: none;
}

.login-btn:hover {
    background: #01579b;
}

.split-line {
    margin: 12px 0;
    color: #bbb;
    font-size: 12px;
}

.reg-text-btn {
    font-size: 14px;
    color: #0277bd;
}
</style>