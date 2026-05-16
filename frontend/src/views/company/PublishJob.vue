<template>
  <div class="page-box">
    <div class="page-head">
      <h2>发布招聘职位</h2>
      <p>快速发布岗位，招揽优秀求职人才</p>
    </div>
    <el-card shadow="hover" class="pub-form">
      <el-form label-width="110px">
        <el-form-item label="岗位名称">
          <el-input placeholder="如：Web前端开发、行政专员"></el-input>
        </el-form-item>
        <el-form-item label="薪资范围">
          <el-input placeholder="如：6K-9K、面议"></el-input>
        </el-form-item>
        <el-form-item label="工作地点">
          <el-input placeholder="填写城市及区域"></el-input>
        </el-form-item>
        <el-form-item label="经验要求">
          <el-select style="width:100%" placeholder="选择工作经验">
            <el-option label="应届生无经验" value="1" />
            <el-option label="1-3年经验" value="2" />
            <el-option label="3-5年经验" value="3" />
            <el-option label="5年以上" value="4" />
          </el-select>
        </el-form-item>
        <el-form-item label="岗位职责">
          <el-input type="textarea" rows="4" placeholder="详细填写日常工作内容"></el-input>
        </el-form-item>
        <el-form-item label="任职要求">
          <el-input type="textarea" rows="4" placeholder="学历、技能、品行、能力要求"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="large">立即发布职位</el-button>
          <el-button size="large">保存草稿</el-button>
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

.pub-form {
  border-radius: 14px;
  padding: 20px;
  max-width: 820px;
}
</style>