<template>
  <div ref="listRef" class="message-list" @scroll="handleScroll">
    <div v-if="!messages.length" class="empty-state">
      <h4>你好，我是你的 AI 求职助手</h4>
      <p>可以帮你分析简历、推荐岗位、优化求职材料。</p>

      <div class="quick-actions">
        <button
          v-for="action in quickActions"
          :key="action.label"
          type="button"
          class="quick-action"
          @click="$emit('quick-action', action.prompt)"
        >
          {{ action.label }}
        </button>
      </div>
    </div>

    <div
      v-for="message in messages"
      :key="message.id"
      class="message-row"
      :class="`is-${message.role}`"
    >
      <div class="message-bubble" :class="`is-${message.role}`">
        <template v-if="message.role === 'assistant'">
          <div v-if="message.content.trim()" class="markdown-body" v-html="renderMarkdown(message.content)"></div>
          <div v-else class="status-text">AI 正在生成中...</div>
        </template>

        <template v-else>
          <div class="plain-text">{{ message.content }}</div>
        </template>

        <div class="message-meta">
          <span>{{ formatTime(message.createdAt) }}</span>
          <span v-if="message.status === 'stopped'">已停止</span>
          <span v-else-if="message.status === 'error'">请求失败</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { nextTick, ref, watch } from 'vue'
import DOMPurify from 'dompurify'
import hljs from 'highlight.js'
import 'highlight.js/styles/github.css'
import { marked } from 'marked'

defineEmits(['quick-action'])

const props = defineProps({
  messages: {
    type: Array,
    default: () => []
  }
})

const listRef = ref(null)
const shouldAutoScroll = ref(true)
const AUTO_SCROLL_THRESHOLD = 72

const quickActions = [
  {
    label: '分析简历',
    prompt: '请帮我分析这份简历的亮点、短板和优化建议。'
  },
  {
    label: '推荐岗位',
    prompt: '请根据我的背景推荐适合的岗位方向，并说明理由。'
  },
  {
    label: '优化简历',
    prompt: '请从招聘者视角帮我优化简历表达，提高通过率。'
  }
]

marked.setOptions({
  gfm: true,
  breaks: true
})

const renderMarkdown = (content) => {
  const rawHtml = marked.parse(String(content || ''))
  return DOMPurify.sanitize(rawHtml)
}

const formatTime = (timestamp) => {
  if (!timestamp) return ''
  return new Intl.DateTimeFormat('zh-CN', {
    hour: '2-digit',
    minute: '2-digit'
  }).format(timestamp)
}

const isNearBottom = () => {
  if (!listRef.value) return true

  const { scrollTop, clientHeight, scrollHeight } = listRef.value
  return scrollHeight - (scrollTop + clientHeight) <= AUTO_SCROLL_THRESHOLD
}

const handleScroll = () => {
  shouldAutoScroll.value = isNearBottom()
}

const refreshView = async (forceScroll = false) => {
  await nextTick()
  if (!listRef.value) return

  listRef.value.querySelectorAll('pre code').forEach((block) => {
    hljs.highlightElement(block)
  })

  if (forceScroll || shouldAutoScroll.value) {
    listRef.value.scrollTop = listRef.value.scrollHeight
  }
}

watch(
  () => props.messages,
  () => {
    const wasNearBottom = isNearBottom()
    refreshView(wasNearBottom)
  },
  {
    deep: true,
    immediate: true
  }
)
</script>

<style scoped>
.message-list {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 20px 18px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.empty-state {
  flex: 1;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: #374151;
  padding: 24px 16px;
}

.empty-state h4 {
  margin: 0 0 10px;
  font-size: 22px;
  font-weight: 700;
  color: #111827;
}

.empty-state p {
  margin: 0;
  max-width: 320px;
  line-height: 1.8;
  color: #6b7280;
}

.quick-actions {
  margin-top: 20px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
}

.quick-action {
  border: 1px solid #dbeafe;
  background: #ffffff;
  color: #2563eb;
  border-radius: 999px;
  padding: 9px 14px;
  font-size: 13px;
  cursor: pointer;
  transition: background 0.2s ease, border-color 0.2s ease;
}

.quick-action:hover {
  background: #eff6ff;
  border-color: #bfdbfe;
}

.message-row {
  display: flex;
}

.message-row.is-user {
  justify-content: flex-end;
}

.message-row.is-assistant {
  justify-content: flex-start;
}

.message-bubble {
  max-width: min(860px, 88%);
  border-radius: 20px;
  padding: 16px 18px 12px;
  word-break: break-word;
}

.message-bubble.is-user {
  background: #dbeafe;
  color: #1e3a8a;
  border-top-right-radius: 8px;
}

.message-bubble.is-assistant {
  background: #ffffff;
  color: #111827;
  border: 1px solid #e5e7eb;
  border-top-left-radius: 8px;
}

.plain-text {
  white-space: pre-wrap;
  line-height: 1.75;
  font-size: 14px;
}

.status-text {
  font-size: 14px;
  color: #6b7280;
}

:deep(.markdown-body) {
  font-size: 15px;
  line-height: 1.9;
  color: inherit;
}

:deep(.markdown-body h1),
:deep(.markdown-body h2) {
  margin: 0 0 14px;
  font-size: 22px;
  line-height: 1.4;
  font-weight: 700;
  color: #111827;
}

:deep(.markdown-body h3) {
  margin: 0 0 12px;
  font-size: 18px;
  line-height: 1.5;
  font-weight: 600;
  color: #111827;
}

:deep(.markdown-body p),
:deep(.markdown-body ul),
:deep(.markdown-body ol),
:deep(.markdown-body pre),
:deep(.markdown-body blockquote) {
  margin: 0 0 14px;
}

:deep(.markdown-body ul),
:deep(.markdown-body ol) {
  padding-left: 1.35em;
}

:deep(.markdown-body li) {
  margin-bottom: 10px;
}

:deep(.markdown-body pre) {
  overflow: auto;
  padding: 12px 14px;
  border-radius: 12px;
  background: #f8fafc;
}

:deep(.markdown-body :not(pre) > code) {
  background: #f3f4f6;
  border-radius: 6px;
  padding: 0.1em 0.35em;
}

:deep(.markdown-body blockquote) {
  padding-left: 12px;
  border-left: 3px solid #d1d5db;
  color: #6b7280;
}

.message-meta {
  margin-top: 10px;
  display: flex;
  gap: 8px;
  font-size: 11px;
  color: #9ca3af;
}

@media (max-width: 768px) {
  .message-list {
    padding: 16px 12px;
  }

  .message-bubble {
    max-width: 94%;
    padding: 14px 14px 10px;
  }

  :deep(.markdown-body) {
    font-size: 14px;
    line-height: 1.8;
  }

  :deep(.markdown-body h1),
  :deep(.markdown-body h2) {
    font-size: 20px;
  }
}
</style>
