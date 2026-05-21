<template>
    <div class="forum-container">
        <!-- 顶部渐变头部 -->
        <div class="forum-top-banner">
            <div class="banner-text">
                <h1>人才求职交流论坛</h1>
                <p>汇聚求职经验、技术分享、组队学习、职场心得，交流互助共同成长</p>
            </div>
            <el-button type="primary" icon="Plus" size="large" @click="openAddDialog">
                立即发布话题
            </el-button>
        </div>

        <!-- 统计快捷卡片 -->
        <div class="stat-row">
            <div class="stat-card">
                <div class="stat-num">{{ totalTopic }}</div>
                <div class="stat-txt">全部话题</div>
            </div>
            <div class="stat-card">
                <div class="stat-num">{{ hotTopic }}</div>
                <div class="stat-txt">热门话题</div>
            </div>
            <div class="stat-card">
                <div class="stat-num">{{ myTopicNum }}</div>
                <div class="stat-txt">我的发布</div>
            </div>
        </div>

        <!-- 搜索筛选栏 -->
        <div class="search-wrap">
            <el-row :gutter="20">
                <el-col :span="16">
                    <el-input v-model="searchKey" placeholder="搜索话题标题/内容关键词" clearable style="width:100%"
                        @keyup.enter="getTopicList">
                        <template #prefix><el-icon>
                                <Search />
                            </el-icon></template>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-select v-model="typeFilter" placeholder="全部分类" style="width:100%" @change="getTopicList">
                        <el-option label="全部" value="" />
                        <el-option label="技术交流" value="tech" />
                        <el-option label="比赛讨论" value="competition" />
                        <el-option label="经验分享" value="share" />
                        <el-option label="问题求助" value="help" />
                    </el-select>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" icon="Search" @click="getTopicList">搜索查询</el-button>
                    <el-button icon="Refresh" @click="resetFilter">重置</el-button>
                </el-col>
            </el-row>
        </div>

        <!-- 话题榜单列表 -->
        <div class="topic-main">
            <div class="list-title">
                <span class="line"></span>
                <span>热门话题榜单</span>
                <span class="line"></span>
            </div>
            <div class="topic-card-list">
                <div class="topic-card" v-for="(item, idx) in topicList" :key="item.id">
                    <!-- 排名徽章 -->
                    <div class="rank-badge" :class="rankClass(idx + 1)">
                        {{ idx + 1 }}
                    </div>
                    <!-- 主体内容 -->
                    <div class="card-main" @click="openDetailDialog(item)">
                        <div class="card-head">
                            <h3 class="topic-title">{{ item.title }}</h3>
                            <el-tag size="small" type="info">{{ getTypeName(item.type) }}</el-tag>
                        </div>
                        <div class="topic-desc">{{ item.content.slice(0, 60) }}……</div>
                        <!-- 标签组 -->
                        <div class="tag-group">
                            <el-tag size="mini" effect="plain"
                                :color="getMoodColor(item.mood)">{{ getMoodName(item.mood) }}</el-tag>
                            <el-tag size="mini" effect="plain" color="#67c23a">{{ item.tags || '日常交流' }}</el-tag>
                            <el-tag size="mini" effect="plain" color="#409eff">{{ getAuthName(item.look_auth) }}</el-tag>
                        </div>
                        <!-- 底部信息 -->
                        <div class="card-footer-info">
                            <div class="user-info">
                                <el-avatar size="28">{{ item.author.slice(0, 1) }}</el-avatar>
                                <span class="author-name">{{ item.author }}</span>
                            </div>
                            <div class="data-info">
                                <span><el-icon>
                                        <View />
                                    </el-icon> {{ item.look_num }}</span>
                                <span><el-icon>
                                        <ChatDotRound />
                                    </el-icon> {{ item.reply_num }}</span>
                                <span class="time">{{ item.create_time }}</span>
                            </div>
                        </div>
                    </div>
                    <!-- 仅本人可见操作按钮 -->
                    <div class="card-opt" v-if="isSelfTopic(item.user_id)">
                        <el-button text type="primary" size="small" @click.stop="openEditDialog(item)">编辑</el-button>
                        <el-button text type="danger" size="small" @click.stop="deleteTopic(item.id)">删除</el-button>
                    </div>
                </div>
            </div>

            <!-- 空数据展示 -->
            <el-empty v-if="topicList.length === 0" description="暂无相关话题，快来发布第一条吧"></el-empty>

            <!-- 分页 -->
            <div class="page-wrap">
                <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :total="totalTopic"
                    layout="total, sizes, prev, pager, next, jumper" background @current-change="getTopicList"
                    @size-change="getTopicList" />
            </div>
        </div>

        <!-- 新增/编辑话题弹窗 -->
        <el-dialog v-model="topicDialogVisible" title="发布交流话题" width="750px" destroy-on-close>
            <el-form :model="topicForm" label-width="100px" label-position="top">
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="话题标题">
                            <el-input v-model="topicForm.title" placeholder="请填写清晰话题标题" maxlength="100"
                                show-word-limit />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="所属分类">
                            <el-select v-model="topicForm.type" placeholder="选择话题分类">
                                <el-option label="技术交流" value="tech" />
                                <el-option label="比赛讨论" value="competition" />
                                <el-option label="经验分享" value="share" />
                                <el-option label="问题求助" value="help" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="当前心情状态">
                            <el-radio-group v-model="topicForm.mood">
                                <el-radio label="开心" value="happy" />
                                <el-radio label="平淡" value="normal" />
                                <el-radio label="疑惑" value="puzzle" />
                                <el-radio label="感慨" value="feeling" />
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="浏览权限">
                            <el-select v-model="topicForm.look_auth">
                                <el-option label="全员可见" value="all" />
                                <el-option label="仅好友可见" value="friend" />
                                <el-option label="仅自己可见" value="self" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="自定义话题标签">
                            <el-input v-model="topicForm.tags" placeholder="多个标签逗号分隔，如求职,学习,前端" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="话题正文内容">
                            <el-input v-model="topicForm.content" type="textarea" rows="6"
                                placeholder="详细写下你的经验、问题、心得..." maxlength="1000" show-word-limit />
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <template #footer>
                <el-button @click="topicDialogVisible = false">取消关闭</el-button>
                <el-button type="primary" :loading="submitLoading" @click="saveTopic">确认提交发布</el-button>
            </template>
        </el-dialog>

        <!-- 话题详情+评论弹窗 -->
        <el-dialog v-model="detailDialogVisible" title="话题完整详情" width="850px" top="5vh" destroy-on-close>
            <div class="detail-inner" v-if="currentTopic">
                <div class="detail-top">
                    <h2 class="detail-title">{{ currentTopic.title }}</h2>
                    <div class="detail-tag">
                        <el-tag size="small">{{ getTypeName(currentTopic.type) }}</el-tag>
                        <el-tag size="small"
                            :color="getMoodColor(currentTopic.mood)">{{ getMoodName(currentTopic.mood) }}</el-tag>
                    </div>
                    <div class="detail-user-info">
                        <el-avatar size="36">{{ currentTopic.author.slice(0, 1) }}</el-avatar>
                        <div class="user-text">
                            <div class="name">{{ currentTopic.author }}</div>
                            <div class="time">{{ currentTopic.create_time }}</div>
                        </div>
                        <div class="data-num">
                            <span>浏览量：{{ currentTopic.look_num }}</span>
                            <span>评论数：{{ currentTopic.reply_num }}</span>
                        </div>
                    </div>
                </div>
                <div class="detail-content">{{ currentTopic.content }}</div>

                <!-- 评论区域 -->
                <div class="reply-wrap">
                    <div class="reply-title">全部评论 ({{ replyList.length }})</div>
                    <!-- 发表评论 -->
                    <el-input v-model="replyText" type="textarea" rows="3" placeholder="友善发言，理性交流你的看法"></el-input>
                    <el-button type="primary" size="small" style="margin:10px 0" @click="sendReply">发布评论</el-button>
                    <!-- 评论列表 -->
                    <div class="reply-item" v-for="r in replyList" :key="r.id">
                        <div class="r-avatar">
                            <el-avatar size="32">{{ r.author ? r.author.slice(0, 1) : '用' }}</el-avatar>
                        </div>
                        <div class="r-main">
                            <div class="r-name">{{ r.author || '匿名用户' }}</div>
                            <div class="r-text">{{ r.reply_content }}</div>
                            <div class="r-bottom">
                                <span class="r-time">{{ r.create_time }}</span>
                                <el-button v-if="isSelfTopic(r.user_id)" text type="danger" size="mini"
                                    @click="delReply(r.id)">删除</el-button>
                            </div>
                        </div>
                    </div>
                    <el-empty v-if="replyList.length === 0" description="暂无评论，快来抢沙发吧" :image-size="80"></el-empty>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Search, Refresh, View, ChatDotRound } from '@element-plus/icons-vue'
import axios from '../../utils/request'

// 获取当前登录用户信息
const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')
const myUserId = userInfo.id || 0

// 全局数据
const topicList = ref([])
const currentPage = ref(1)
const pageSize = ref(10)
const totalTopic = ref(0)
const searchKey = ref('')
const typeFilter = ref('')

// 统计数据
const hotTopic = computed(() => topicList.value.filter(item => item.reply_num > 2).length)
const myTopicNum = computed(() => topicList.value.filter(item => item.user_id === myUserId).length)

// 弹窗控制
const topicDialogVisible = ref(false)
const submitLoading = ref(false)
const detailDialogVisible = ref(false)
const currentTopic = ref(null)
const replyList = ref([])
const replyText = ref('')

// 表单数据
const topicForm = reactive({
    id: '',
    title: '',
    type: 'tech',
    content: '',
    mood: 'normal',
    tags: '',
    look_auth: 'all',
    user_id: myUserId,
    author: userInfo.nickname || '普通用户'
})

// 身份判断
const isSelfTopic = (uid) => uid === myUserId

// 文字转换
const getTypeName = (val) => {
    const map = { tech: '技术交流', competition: '比赛讨论', share: '经验分享', help: '问题求助' }
    return map[val] || '未知分类'
}
const getMoodName = (val) => {
    const map = { happy: '心情愉悦', normal: '平淡日常', puzzle: '心存疑惑', feeling: '心生感慨' }
    return map[val] || '未知心情'
}
const getMoodColor = (val) => {
    const map = { happy: '#67c23a', normal: '#909399', puzzle: '#e6a23c', feeling: '#9c88ff' }
    return map[val] || ''
}
const getAuthName = (val) => {
    const map = { all: '全员可见', friend: '仅好友可见', self: '仅自己可见' }
    return map[val] || '公开'
}
// 排名样式
const rankClass = (num) => {
    if (num === 1) return 'rank-first'
    if (num === 2) return 'rank-second'
    if (num === 3) return 'rank-third'
    return 'rank-normal'
}

// 获取话题列表
const getTopicList = async () => {
    const res = await axios.get('/api/forum/topic/list', {
        params: {
            page: currentPage.value,
            limit: pageSize.value,
            title: searchKey.value,
            type: typeFilter.value
        }
    })
    if (res.data.code === 200) {
        topicList.value = res.data.data.list
        totalTopic.value = res.data.data.total
    }
}

// 重置筛选
const resetFilter = () => {
    searchKey.value = ''
    typeFilter.value = ''
    currentPage.value = 1
    getTopicList()
}

// 打开新增
const openAddDialog = () => {
    topicDialogVisible.value = true
    Object.assign(topicForm, {
        id: '', title: '', type: 'tech', content: '', mood: 'normal', tags: '', look_auth: 'all'
    })
}

// 打开编辑
const openEditDialog = (item) => {
    topicDialogVisible.value = true
    Object.assign(topicForm, item)
}

// 保存话题
const saveTopic = async () => {
    if (!topicForm.title) return ElMessage.warning('请填写话题标题')
    if (!topicForm.content) return ElMessage.warning('请填写话题内容')
    submitLoading.value = true
    const res = await axios.post('/api/forum/topic/save', topicForm)
    if (res.data.code === 200) {
        ElMessage.success('发布成功')
        topicDialogVisible.value = false
        getTopicList()
    } else {
        ElMessage.error(res.data.msg || '发布失败')
    }
    submitLoading.value = false
}

// 删除话题
const deleteTopic = async (id) => {
    await ElMessageBox.confirm('确定永久删除该话题？删除后不可恢复', '温馨提示', { type: 'warning' })
    const res = await axios.post('/api/forum/topic/delete', { id })
    if (res.data.code === 200) {
        ElMessage.success('删除成功')
        getTopicList()
    }
}

// 打开详情
const openDetailDialog = async (item) => {
    currentTopic.value = item
    detailDialogVisible.value = true
    // 加载评论
    const res = await axios.get('/api/forum/reply/list', { params: { topic_id: item.id } })
    if (res.data.code === 200) replyList.value = res.data.data
}

// 发表评论
const sendReply = async () => {
    if (!replyText.value.trim()) return ElMessage.warning('请输入评论内容')
    const res = await axios.post('/api/forum/reply/save', {
        topic_id: currentTopic.value.id,
        user_id: myUserId,
        reply_content: replyText.value,
        author: userInfo.nickname || '匿名用户'
    })
    if (res.data.code === 200) {
        ElMessage.success('评论成功')
        replyText.value = ''
        openDetailDialog(currentTopic.value)
    }
}

// 删除评论
const delReply = async (id) => {
    await ElMessageBox.confirm('确定删除这条评论？')
    const res = await axios.post('/api/forum/reply/delete', { id })
    if (res.data.code === 200) {
        ElMessage.success('评论已删除')
        openDetailDialog(currentTopic.value)
    }
}

onMounted(() => getTopicList())
</script>

<style scoped>
.forum-container {
    padding: 24px;
    background-color: #f6f8fa;
    min-height: 100vh;
}

/* 顶部横幅 */
.forum-top-banner {
    background: linear-gradient(135deg, #2b7de9, #5097f5);
    border-radius: 16px;
    padding: 30px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #fff;
    margin-bottom: 20px;
    box-shadow: 0 6px 18px rgba(43, 125, 233, 0.2);
}

.banner-text h1 {
    font-size: 28px;
    margin: 0 0 8px;
    font-weight: 600;
}

.banner-text p {
    margin: 0;
    opacity: 0.9;
    font-size: 15px;
}

/* 统计卡片 */
.stat-row {
    display: flex;
    gap: 20px;
    margin-bottom: 20px;
}

.stat-card {
    flex: 1;
    background: #fff;
    border-radius: 12px;
    padding: 18px;
    text-align: center;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
}

.stat-num {
    font-size: 26px;
    font-weight: bold;
    color: #2b7de9;
    margin-bottom: 4px;
}

.stat-txt {
    color: #666;
    font-size: 14px;
}

/* 搜索区域 */
.search-wrap {
    background: #fff;
    padding: 20px;
    border-radius: 12px;
    margin-bottom: 25px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}

/* 列表标题 */
.list-title {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 30px 0 20px;
}

.line {
    width: 80px;
    height: 1px;
    background: #dcdfe6;
}

.list-title span:nth-child(2) {
    font-size: 18px;
    font-weight: 600;
    color: #333;
    margin: 0 15px;
}

/* 话题卡片列表 */
.topic-card-list {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
}

.topic-card {
    background: #fff;
    border-radius: 14px;
    padding: 20px;
    position: relative;
    box-shadow: 0 3px 15px rgba(0, 0, 0, 0.07);
    transition: all 0.3s ease;
}

.topic-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
}

/* 排名徽章 */
.rank-badge {
    position: absolute;
    top: -10px;
    left: -10px;
    width: 32px;
    height: 32px;
    line-height: 32px;
    text-align: center;
    border-radius: 50%;
    color: #fff;
    font-weight: bold;
    font-size: 14px;
}

.rank-first {
    background: #f53f3f;
}

.rank-second {
    background: #ff7d00;
}

.rank-third {
    background: #ffc107;
}

.rank-normal {
    background: #909399;
}

/* 卡片内容 */
.card-main {
    cursor: pointer;
}

.card-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
}

.topic-title {
    font-size: 16px;
    margin: 0;
    color: #222;
}

.topic-desc {
    color: #666;
    font-size: 14px;
    line-height: 1.6;
    margin: 12px 0;
}

.tag-group {
    display: flex;
    gap: 8px;
    margin-bottom: 15px;
    flex-wrap: wrap;
}

.card-footer-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid #f2f2f2;
    padding-top: 12px;
}

.user-info {
    display: flex;
    align-items: center;
    gap: 8px;
}

.author-name {
    font-size: 14px;
    color: #333;
}

.data-info {
    display: flex;
    gap: 15px;
    font-size: 13px;
    color: #999;
}

/* 操作按钮 */
.card-opt {
    position: absolute;
    right: 15px;
    top: 15px;
    display: flex;
    gap: 5px;
}

/* 分页 */
.page-wrap {
    margin-top: 30px;
    text-align: center;
}

/* 详情弹窗样式 */
.detail-inner {
    padding: 10px 0;
}

.detail-top {
    border-bottom: 1px solid #eee;
    padding-bottom: 20px;
    margin-bottom: 20px;
}

.detail-title {
    font-size: 22px;
    color: #222;
    margin: 0 0 10px;
}

.detail-tag {
    margin-bottom: 15px;
}

.detail-user-info {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-top: 15px;
}

.user-text {
    flex: 1;
}

.name {
    font-weight: 500;
}

.time {
    font-size: 13px;
    color: #999;
}

.data-num {
    margin-left: auto;
    font-size: 14px;
    color: #666;
    display: flex;
    gap: 20px;
}

.detail-content {
    line-height: 1.8;
    font-size: 15px;
    color: #333;
    padding: 15px 0;
}

.reply-wrap {
    margin-top: 30px;
    border-top: 1px solid #eee;
    padding-top: 20px;
}

.reply-title {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 15px;
}

.reply-item {
    display: flex;
    gap: 12px;
    padding: 15px 0;
    border-bottom: 1px solid #f5f5f5;
}

.r-main {
    flex: 1;
}

.r-name {
    font-weight: 500;
    margin-bottom: 5px;
}

.r-text {
    color: #444;
    line-height: 1.6;
    margin-bottom: 8px;
}

.r-bottom {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    color: #999;
}
</style>