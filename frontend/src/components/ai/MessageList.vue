<template>
  <div ref="listRef" class="message-list">
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
          <div v-if="message.reasoning?.trim()" class="reasoning-box">
            <button
              type="button"
              class="reasoning-toggle"
              @click="toggleReasoning(message)"
            >
              <span>{{ isReasoningCollapsed(message) ? '展开思考过程' : '收起思考过程' }}</span>
              <span class="reasoning-status">
                {{ message.status === 'thinking' || message.status === 'streaming' ? '思考中' : '已完成' }}
              </span>
            </button>

            <div v-show="!isReasoningCollapsed(message)" class="reasoning-body">
              <div class="reasoning-text">{{ message.reasoning }}</div>
            </div>
          </div>

          <div
            v-if="message.content.trim()"
            class="markdown-body"
            v-html="renderMarkdown(message.content)"
          ></div>

          <div v-else class="thinking-state">
            <span>AI 正在思考...</span>
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
          </div>

          <span
            v-if="message.status === 'streaming' || message.status === 'thinking'"
            class="typing-cursor"
          ></span>
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
const collapsedState = ref({})

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
  const rawHtml = marked.parse(content || '')
  return DOMPurify.sanitize(rawHtml)
}

const formatTime = (timestamp) => {
  if (!timestamp) return ''
  return new Intl.DateTimeFormat('zh-CN', {
    hour: '2-digit',
    minute: '2-digit'
  }).format(timestamp)
}

const refreshView = async () => {
  await nextTick()
  if (!listRef.value) return

  listRef.value.querySelectorAll('pre code').forEach((block) => {
    hljs.highlightElement(block)
  })

  listRef.value.scrollTop = listRef.value.scrollHeight
}

const isReasoningCollapsed = (message) => {
  if (!message.reasoning?.trim()) return true
  if (collapsedState.value[message.id] !== undefined) {
    return collapsedState.value[message.id]
  }
  return message.status !== 'thinking' && message.status !== 'streaming'
}

const toggleReasoning = (message) => {
  collapsedState.value[message.id] = !isReasoningCollapsed(message)
}

watch(
  () => props.messages,
  (messages) => {
    messages.forEach((message) => {
      if (
        message.role === 'assistant' &&
        message.reasoning?.trim() &&
        collapsedState.value[message.id] === undefined
      ) {
        collapsedState.value[message.id] =
          message.status !== 'thinking' && message.status !== 'streaming'
      }
    })
    refreshView()
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
  padding: 18px 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
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
  font-weight: 600;
  color: #111827;
}

.empty-state p {
  margin: 0;
  max-width: 280px;
  line-height: 1.7;
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
  max-width: 82%;
  border-radius: 18px;
  padding: 12px 14px 10px;
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
  line-height: 1.7;
  font-size: 14px;
}

:deep(.markdown-body) {
  font-size: 14px;
  line-height: 1.7;
  color: inherit;
}

:deep(.markdown-body p),
:deep(.markdown-body ul),
:deep(.markdown-body ol),
:deep(.markdown-body pre),
:deep(.markdown-body blockquote),
:deep(.markdown-body h1),
:deep(.markdown-body h2),
:deep(.markdown-body h3),
:deep(.markdown-body h4) {
  margin: 0 0 10px;
}

:deep(.markdown-body pre) {
  overflow: auto;
  padding: 10px 12px;
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
  margin-top: 8px;
  display: flex;
  gap: 8px;
  font-size: 11px;
  color: #9ca3af;
}

.reasoning-box {
  margin-bottom: 10px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  background: #f8fafc;
}

.reasoning-toggle {
  width: 100%;
  border: none;
  background: transparent;
  padding: 9px 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  cursor: pointer;
  font-size: 12px;
  color: #4b5563;
}

.reasoning-status {
  color: #9ca3af;
}

.reasoning-body {
  padding: 0 12px 12px;
}

.reasoning-text {
  white-space: pre-wrap;
  font-size: 12px;
  line-height: 1.75;
  color: #6b7280;
  font-style: italic;
}

.thinking-state {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 14px;
  color: #6b7280;
}

.dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: currentColor;
  animation: bounce 1s infinite ease-in-out;
}

.dot:nth-child(2) {
  animation-delay: 0.1s;
}

.dot:nth-child(3) {
  animation-delay: 0.2s;
}

.typing-cursor {
  display: inline-block;
  width: 7px;
  height: 1em;
  margin-left: 2px;
  vertical-align: middle;
  background: #2563eb;
  border-radius: 999px;
  animation: blink 0.9s steps(1, end) infinite;
}

@keyframes blink {
  0%,
  49% {
    opacity: 1;
  }
  50%,
  100% {
    opacity: 0;
  }
}

@keyframes bounce {
  0%,
  80%,
  100% {
    transform: scale(0.8);
    opacity: 0.45;
  }
  40% {
    transform: scale(1.1);
    opacity: 1;
  }
}

@media (max-width: 768px) {
  .message-list {
    padding: 16px 12px;
  }

  .message-bubble {
    max-width: 88%;
  }

  .empty-state h4 {
    font-size: 20px;
  }
}
</style>
