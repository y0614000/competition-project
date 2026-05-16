<template>
    <div class="page-box">
        <div class="page-head">
            <h2>我的岗位投递记录</h2>
            <p>实时查看投递进度与企业反馈</p>
        </div>
        <el-card shadow="hover">
            <el-table :data="applyData" border stripe style="width:100%" size="small">
                <el-table-column prop="jobName" label="应聘岗位" align="center" />
                <el-table-column prop="company" label="应聘企业" align="center" />
                <el-table-column prop="city" label="工作地点" align="center" />
                <el-table-column prop="applyTime" label="投递时间" align="center" />
                <el-table-column label="审核状态" align="center">
                    <template #default="{ row }">
                        <el-tag :type="row.tagType">{{ row.status }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center">
                    <template #default>
                        <el-button size="small" type="primary">查看详情</el-button>
                        <el-button size="small" type="danger">取消投递</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
    </div>
</template>

<script setup>
import { ref } from 'vue'
const applyData = ref([
    { jobName: '前端开发工程师', company: '海南科技信息有限公司', city: '海口', applyTime: '2026-05-10', status: '已投递', tagType: '' },
    { jobName: '新媒体运营', company: '自贸港文化传媒公司', city: '三亚', applyTime: '2026-05-12', status: '面试邀约', tagType: 'success' },
    { jobName: 'Java后端开发', company: '互联网产业园企业', city: '儋州', applyTime: '2026-05-14', status: '已驳回', tagType: 'danger' }
])
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