<template>
  <div class="apply-page">
    <!-- 顶部统一标题栏 -->
    <div class="page-header-card">
      <div class="header-left">
        <el-icon class="header-icon">
          <Document />
        </el-icon>
        <div>
          <h2>应聘管理</h2>
          <p>查看所有投递简历，进行筛选、面试安排与审核</p>
        </div>
      </div>
    </div>

    <el-card shadow="hover" class="search-card">
      <el-form :model="query" inline>
        <el-form-item label="岗位">
          <el-input v-model="query.jobName" placeholder="岗位名称" clearable></el-input>
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="query.userName" placeholder="求职者姓名" clearable></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="query.status" placeholder="全部状态" clearable>
            <el-option label="待处理" value="0" />
            <el-option label="面试中" value="1" />
            <el-option label="已录用" value="2" />
            <el-option label="已拒绝" value="3" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getList">搜索</el-button>
          <el-button @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card shadow="hover" style="margin-top:20px; border-radius:16px;">
      <el-table :data="tableData" border stripe style="width:100%" size="default" v-loading="loading">
        <el-table-column prop="id" label="ID" width="60" align="center" />
        <el-table-column prop="jobName" label="应聘岗位" align="center" />
        <el-table-column prop="userName" label="求职者" align="center" />
        <el-table-column prop="phone" label="联系电话" align="center" />
        <el-table-column prop="education" label="学历" align="center" />
        <el-table-column prop="applyTime" label="投递时间" align="center" />
        <el-table-column label="状态" align="center" width="110">
          <template #default="{ row }">
            <el-tag :type="row.status === 0 ? '' :
              row.status === 1 ? 'warning' :
                row.status === 2 ? 'success' : 'danger'
              ">
              {{ statusMap[row.status] }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="260">
          <template #default="{ row }">
            <el-button size="small" type="primary" @click="viewResume(row)">查看简历</el-button>
            <el-button size="small" type="success" :disabled="row.status === 2 || row.status === 3"
              @click="handlePass(row)">
              录用
            </el-button>
            <el-button size="small" type="danger" :disabled="row.status === 2 || row.status === 3"
              @click="handleReject(row)">
              拒绝
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="query.page"
        :page-sizes="[5, 10, 20]" :page-size="query.limit" layout="total, sizes, prev, pager, next, jumper"
        :total="total" style="margin-top:15px;text-align:right" />
    </el-card>

    <el-dialog title="简历详情" v-model="resumeVisible" width="600px">
      <div v-if="curResume" class="resume-detail">
        <p><strong>姓名：</strong>{{ curResume.userName }}</p>
        <p><strong>电话：</strong>{{ curResume.phone }}</p>
        <p><strong>学历：</strong>{{ curResume.education }}</p>
        <p><strong>意向岗位：</strong>{{ curResume.hopeJob }}</p>
        <p><strong>教育经历：</strong>{{ curResume.edu }}</p>
        <p><strong>工作经历：</strong>{{ curResume.exp }}</p>
        <p><strong>技能：</strong>{{ curResume.skill }}</p>
        <p><strong>自我评价：</strong>{{ curResume.eval }}</p>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Document } from '@element-plus/icons-vue'

const loading = ref(false)
const total = ref(0)
const tableData = ref([])
const resumeVisible = ref(false)
const curResume = ref(null)

const statusMap = {
  0: '待处理',
  1: '面试中',
  2: '已录用',
  3: '已拒绝'
}

const query = reactive({
  page: 1,
  limit: 10,
  jobName: '',
  userName: '',
  status: ''
})

const mockData = [
  { id: 1, jobName: '前端开发工程师', userName: '张三', phone: '13800138000', education: '本科', applyTime: '2026-05-10 09:30', status: 0, hopeJob: '前端/全栈', edu: '海南师范大学 计算机科学与技术 2022-2026', exp: 'XX科技 前端开发 2025-至今', skill: 'Vue3、Element Plus、JavaScript、CSS', eval: '学习能力强，沟通良好，热爱技术。' },
  { id: 2, jobName: '新媒体运营', userName: '李四', phone: '13900139000', education: '专科', applyTime: '2026-05-11 14:20', status: 1, hopeJob: '运营/策划', edu: '海南软件职业技术学院 电子商务 2021-2024', exp: 'XX传媒 运营实习生 2024-2025', skill: '公众号、短视频、文案撰写', eval: '细心负责，擅长内容策划与数据分析。' },
  { id: 3, jobName: 'Java后端开发', userName: '王五', phone: '13700137000', education: '本科', applyTime: '2026-05-12 10:15', status: 2, hopeJob: '后端开发', edu: '海南大学 软件工程 2022-2026', exp: 'XX互联网公司 Java开发 2025-至今', skill: 'SpringBoot、MySQL、Redis', eval: '扎实的编程基础，良好的团队协作能力。' },
  { id: 4, jobName: '前端开发工程师', userName: '赵六', phone: '13600136000', education: '本科', applyTime: '2026-05-13 11:12', status: 3, hopeJob: '前端开发', edu: '海口经济学院 软件工程', exp: '无', skill: 'Vue、HTML、CSS', eval: '应届毕业生，态度认真。' }
]

const getList = () => {
  loading.value = true
  setTimeout(() => {
    let data = [...mockData]
    if (query.jobName) data = data.filter(item => item.jobName.includes(query.jobName))
    if (query.userName) data = data.filter(item => item.userName.includes(query.userName))
    if (query.status !== '') data = data.filter(item => item.status == query.status)
    tableData.value = data
    total.value = data.length
    loading.value = false
  }, 400)
}

const resetQuery = () => {
  query.jobName = ''
  query.userName = ''
  query.status = ''
  query.page = 1
  getList()
}

const handleSizeChange = (val) => { query.limit = val; getList() }
const handleCurrentChange = (val) => { query.page = val; getList() }
const viewResume = (row) => { curResume.value = row; resumeVisible.value = true }

const handlePass = async (row) => {
  await ElMessageBox.confirm('确定录用该求职者？', '提示', { type: 'warning' })
  row.status = 2
  ElMessage.success('录用成功')
  getList()
}

const handleReject = async (row) => {
  await ElMessageBox.confirm('确定拒绝该求职者？', '提示', { type: 'warning' })
  row.status = 3
  ElMessage.success('已拒绝')
  getList()
}

onMounted(() => { getList() })
</script>

<style scoped>
.apply-page {
  padding: 24px;
  background: #f7f9fc;
  min-height: 100vh;
}

/* 统一企业端蓝色头部 */
.page-header-card {
  background: linear-gradient(135deg, #409eff, #58a9ff);
  padding: 24px 28px;
  border-radius: 16px;
  color: white;
  display: flex;
  align-items: center;
  margin-bottom: 24px;
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.15);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 14px;
}

.header-icon {
  font-size: 26px;
}

.search-card {
  border-radius: 16px;
}

.resume-detail {
  padding: 10px;
  line-height: 1.8;
}
</style>