<template>
    <div class="register-page">
        <div class="register-container">
            <!-- 左侧图片 -->
            <div class="register-left">
                <div class="left-content">
                    <h1>自贸港人才服务系统</h1>
                    <p>专注人才对接 · 服务海南自贸港</p>
                    <div class="image-box">
                        <img src="https://picsum.photos/id/180/600/400" alt="banner" />
                    </div>
                </div>
            </div>

            <!-- 右侧注册表单 -->
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

                        <el-form-item label="身份">
                            <el-select v-model="form.role" placeholder="请选择身份" size="large">
                                <el-option label="求职者" :value="1"></el-option>
                                <el-option label="企业" :value="2"></el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item class="btn-wrap">
                            <el-button type="primary" @click="register" size="large" class="reg-btn">
                                立即注册
                            </el-button>
                            <span class="split-line"></span>
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

const router = useRouter()
const form = ref({
    username: '',
    password: '',
    repass: '',
    role: 1,
})

// 注册
const register = async () => {
    if (!form.value.username || !form.value.password) {
        return ElMessage.warning('请填写完整信息')
    }
    if (form.value.password !== form.value.repass) {
        return ElMessage.error('两次密码不一致')
    }

    ElMessage.success('注册成功！请登录')
    router.push('/login')
}

// 去登录
const toLogin = () => {
    router.push('/login')
}
</script>

<style scoped>
/* 页面整体 */
.register-page {
    width: 100vw;
    height: 100vh;
    background: linear-gradient(135deg, #409eff 10%, #66b6ff 100%);
    display: flex;
    align-items: center;
    justify-content: center;
}

/* 注册卡片容器 */
.register-container {
    width: 900px;
    height: 580px;
    background: #fff;
    border-radius: 20px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
    display: flex;
    overflow: hidden;
    transition: all 0.3s ease;
}

.register-container:hover {
    transform: translateY(-5px);
    box-shadow: 0 25px 70px rgba(0, 0, 0, 0.2);
}

/* 左侧区域 */
.register-left {
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
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.image-box img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

/* 右侧注册区域 */
.register-right {
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

/* 表单 */
.register-form {
    width: 320px;
}

/* 按钮 */
.btn-wrap {
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.reg-btn {
    width: 100%;
    border-radius: 8px;
    font-weight: 500;
    letter-spacing: 2px;
}

.split-line {
    margin: 12px 0;
    color: #ccc;
    font-size: 14px;
}

.login-text-btn {
    font-size: 14px;
    color: #409eff;
    padding: 0;
}

.login-text-btn:hover {
    color: #2979ff;
}
</style>