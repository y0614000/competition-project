<template>
    <div class="page-box">
        <div class="page-head">
            <h2>个人简历编辑</h2>
            <p>填写完整简历，更快被企业看中</p>
        </div>
        <el-card shadow="hover" class="resume-card">
            <el-form label-width="100px">
                <el-form-item label="教育经历">
                    <el-input type="textarea" rows="3" placeholder="填写学校、专业、入学毕业时间"></el-input>
                </el-form-item>
                <el-form-item label="实习/工作经历">
                    <el-input type="textarea" rows="3" placeholder="填写工作单位、岗位、工作内容"></el-input>
                </el-form-item>
                <el-form-item label="专业技能">
                    <el-input type="textarea" rows="2" placeholder="编程语言、办公软件、专业能力"></el-input>
                </el-form-item>
                <el-form-item label="荣誉奖项">
                    <el-input type="textarea" rows="2" placeholder="在校奖项、职业证书等"></el-input>
                </el-form-item>
                <el-form-item label="自我评价">
                    <el-input type="textarea" rows="3" placeholder="性格优势、职业规划、求职态度"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" size="large">保存简历</el-button>
                    <el-button type="success" size="large">在线预览</el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<script setup></script>

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

.resume-card {
    border-radius: 14px;
    padding: 20px;
    max-width: 780px;
}
</style>