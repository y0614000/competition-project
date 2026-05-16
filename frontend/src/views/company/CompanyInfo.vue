<template>
  <div class="page-box">
    <div class="page-head">
      <h2>企业基础信息</h2>
      <p>完善企业资料，吸引更多优秀人才</p>
    </div>
    <el-card shadow="hover" class="com-form">
      <el-form label-width="110px">
        <el-form-item label="企业全称">
          <el-input placeholder="请填写完整企业名称"></el-input>
        </el-form-item>
        <el-form-item label="所属行业">
          <el-select placeholder="选择所属行业" style="width:100%">
            <el-option label="互联网/信息技术" value="1" />
            <el-option label="教育/培训" value="2" />
            <el-option label="商贸服务" value="3" />
            <el-option label="文旅传媒" value="4" />
          </el-select>
        </el-form-item>
        <el-form-item label="企业规模">
          <el-input placeholder="例如：50-200人、200人以上"></el-input>
        </el-form-item>
        <el-form-item label="办公地址">
          <el-input placeholder="填写详细办公所在地址"></el-input>
        </el-form-item>
        <el-form-item label="企业简介">
          <el-input type="textarea" rows="4" placeholder="简单介绍企业发展、业务范围、企业文化"></el-input>
        </el-form-item>
        <el-form-item label="联系人电话">
          <el-input placeholder="人事招聘联系电话"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="large">保存企业信息</el-button>
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

.com-form {
  border-radius: 14px;
  padding: 20px;
  max-width: 800px;
}
</style>