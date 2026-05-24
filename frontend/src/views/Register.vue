<template>
    <div class="register-page">
        <div class="register-container">
            <div class="register-left">
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

            <div class="register-right">
                <div class="form-wrapper">
                    <h2>用户注册</h2>
                    <p class="desc">Register an account</p>

                    <el-form :model="form" label-width="80px" class="register-form">
                        <el-form-item label="账号">
                            <el-input v-model="form.username" placeholder="请输入账号" size="large" prefix-icon="User" />
                        </el-form-item>

                        <el-form-item label="密码">
                            <el-input v-model="form.password" type="password" placeholder="请输入密码" size="large"
                                prefix-icon="Lock" />
                        </el-form-item>

                        <el-form-item label="确认密码">
                            <el-input v-model="form.repass" type="password" placeholder="请确认密码" size="large"
                                prefix-icon="Lock" />
                        </el-form-item>

                        <!-- 🔥 注册时选择身份 -->
                        <el-form-item label="注册身份">
                            <el-radio-group v-model="form.role">
                                <el-radio value="user">求职者</el-radio>
                                <el-radio value="company">企业</el-radio>
                            </el-radio-group>
                        </el-form-item>

                        <el-form-item class="btn-wrap">
                            <el-button type="primary" :loading="loading" @click="register" size="large" class="reg-btn">
                                立即注册
                            </el-button>
                            <span class="split-line">—————— 或者 ——————</span>
                            <el-button text @click="toLogin" class="login-text-btn">
                                已有账号？去登录
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
    repass: '',
    role: 'user' // 默认求职者
})

const register = async () => {
    if (!form.value.username || !form.value.password || !form.value.repass) {
        return ElMessage.warning('请填写完整信息')
    }
    if (form.value.password !== form.value.repass) {
        return ElMessage.error('两次密码不一致')
    }

    loading.value = true
    try {
        const res = await axios.post('/user/register', form.value)
        if (res.data.code === 1) {
            ElMessage.success('注册成功！请登录')
            router.push('/login')
        } else {
            ElMessage.error(res.data.msg)
        }
    } catch (err) {
        ElMessage.error('网络异常或服务未启动')
    } finally {
        loading.value = false
    }
}

const toLogin = () => {
    router.push('/login')
}
</script>

<style scoped>
.register-page {
    font-family: '华文中宋';
    width: 100vw;
    height: 100vh;
    background: linear-gradient(135deg, #1e88e5 0%, #42a5f5 50%, #64b5f6 100%);
    display: flex;
    align-items: center;
    justify-content: center;
}

.register-container {
    width: 900px;
    height: 620px;
    background: #fff;
    border-radius: 24px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
    display: flex;
    overflow: hidden;
    transition: all 0.3s ease;
}

.register-container:hover {
    transform: translateY(-6px);
    box-shadow: 0 30px 80px rgba(0, 0, 0, 0.15);
}

.register-left {
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

.register-right {
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

.register-form {
    width: 100%;
}

.btn-wrap {
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.reg-btn {
    width: 100%;
    border-radius: 10px;
    font-weight: 600;
    letter-spacing: 1px;
    background: #0277bd;
    border: none;
}

.reg-btn:hover {
    background: #01579b;
}

.split-line {
    margin: 12px 0;
    color: #bbb;
    font-size: 12px;
}

.login-text-btn {
    font-size: 14px;
    color: #0277bd;
}
</style>