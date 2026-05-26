<template>
  <div class="ai-chat-window">
    <header class="chat-header">
      <h3>AI 智能助手</h3>
      <button class="close-btn" type="button" @click="$emit('close')">×</button>
    </header>

    <div class="chat-body">
      <MessageList
        :messages="messages"
        @quick-action="handleQuickAction"
      />
    </div>

    <div class="chat-footer">
      <MessageInput
        v-model="draft"
        :disabled="isGenerating || isParsingFiles"
        :loading="isGenerating"
        :parsing="isParsingFiles"
        @send="sendMessage()"
        @stop="stopGeneration"
        @files-parsed="handleFilesParsed"
        @parsing-change="isParsingFiles = $event"
      />
    </div>
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import MessageInput from './MessageInput.vue'
import MessageList from './MessageList.vue'
import {
  appendStreamChunk,
  buildConversationInput,
  createDefaultPrompt,
  createUserDisplayContent,
  loadCachedMessages,
  makeMessageId,
  saveCachedMessages,
  sanitizeAssistantOutput,
  streamDoubaoChat
} from './services/doubao'

defineEmits(['close'])

const draft = ref('')
const messages = ref([])
const isGenerating = ref(false)
const isParsingFiles = ref(false)
const activeController = ref(null)
const activeAssistantId = ref('')
const streamBuffer = ref('')

const loadMessages = () => {
  messages.value = loadCachedMessages()
}

const persistMessages = () => {
  const finalMessages = messages.value.filter((message) => {
    if (message.role !== 'assistant') return true
    return message.status !== 'thinking'
  })
  saveCachedMessages(finalMessages)
}

const getAssistantMessage = () =>
  messages.value.find((message) => message.id === activeAssistantId.value)

const createUserMessage = ({ text = '', attachments = [], displayText = '' }) => ({
  id: makeMessageId('user'),
  role: 'user',
  content: displayText || createUserDisplayContent(text, attachments),
  status: 'done',
  createdAt: Date.now(),
  attachments: attachments.map((file) => ({
    id: file.id,
    name: file.name,
    size: file.size,
    kind: file.kind,
    isResume: !!file.isResume,
    extractedText: file.extractedText || '',
    analysisText: file.analysisText || '',
    ocrText: file.ocrText || '',
    dataUrl: file.dataUrl || ''
  }))
})

const createAssistantMessage = () => ({
  id: makeMessageId('assistant'),
  role: 'assistant',
  content: '',
  status: 'thinking',
  createdAt: Date.now(),
  attachments: []
})

const finalizeAssistantMessage = ({ aborted = false } = {}) => {
  const assistantMessage = getAssistantMessage()
  if (!assistantMessage) return

  assistantMessage.content = sanitizeAssistantOutput(assistantMessage.content)
  assistantMessage.status = aborted ? 'stopped' : 'done'

  if (aborted && !assistantMessage.content.trim()) {
    assistantMessage.content = '已停止生成。'
  }

  activeAssistantId.value = ''
  activeController.value = null
  streamBuffer.value = ''
  isGenerating.value = false
  persistMessages()
}

const handleStreamDelta = (chunk) => {
  const assistantMessage = getAssistantMessage()
  if (!assistantMessage) return

  streamBuffer.value = appendStreamChunk(streamBuffer.value, chunk)
  assistantMessage.content = streamBuffer.value
  assistantMessage.status = 'streaming'
}

const handleStreamError = (message) => {
  const assistantMessage = getAssistantMessage()
  if (!assistantMessage) return

  assistantMessage.status = 'error'
  assistantMessage.content = message || '生成失败，请稍后重试。'
  activeAssistantId.value = ''
  activeController.value = null
  streamBuffer.value = ''
  isGenerating.value = false
  persistMessages()
}

const sendMessage = async (payload = {}) => {
  if (isGenerating.value || isParsingFiles.value) return

  const options =
    typeof payload === 'string'
      ? { text: payload }
      : {
          text: payload.text ?? draft.value,
          attachments: payload.attachments || [],
          displayText: payload.displayText || ''
        }

  const attachments = [...(options.attachments || [])]
  const prompt = String(options.text || '').trim() || createDefaultPrompt(attachments)
  if (!prompt && !attachments.length) return

  const userMessage = createUserMessage({
    text: prompt,
    attachments,
    displayText: options.displayText
  })
  const assistantMessage = createAssistantMessage()
  const history = [...messages.value]

  messages.value.push(userMessage, assistantMessage)
  draft.value = ''
  activeAssistantId.value = assistantMessage.id
  activeController.value = new AbortController()
  isGenerating.value = true
  streamBuffer.value = ''
  persistMessages()

  try {
    await streamDoubaoChat({
      messages: buildConversationInput({
        history,
        userText: prompt,
        attachments
      }),
      signal: activeController.value.signal,
      onDelta: (chunk) => {
        handleStreamDelta(chunk)
      },
      onDone: () => {
        finalizeAssistantMessage()
      },
      onError: (error) => {
        handleStreamError(error?.message)
      }
    })
  } catch (error) {
    if (error?.name === 'AbortError') {
      finalizeAssistantMessage({ aborted: true })
      return
    }

    handleStreamError(error?.message || '豆包服务请求失败。')
  }
}

const stopGeneration = () => {
  if (!activeController.value) return
  activeController.value.abort()
  ElMessage.info('已停止生成')
}

const handleQuickAction = (prompt) => {
  sendMessage({ text: prompt })
}

const handleFilesParsed = (files) => {
  if (!files.length) return

  const customPrompt = String(draft.value || '').trim()
  sendMessage({
    text: customPrompt || createDefaultPrompt(files),
    attachments: files,
    displayText: customPrompt || '已上传材料，正在分析...'
  })
}

onMounted(() => {
  loadMessages()
})

onBeforeUnmount(() => {
  if (activeController.value) {
    activeController.value.abort()
  }
})
</script>

<style scoped>
.ai-chat-window {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 18px 48px rgba(15, 23, 42, 0.16);
}

.chat-header {
  flex: 0 0 auto;
  padding: 16px 20px;
  border-bottom: 1px solid #eef2f7;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.chat-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #111827;
}

.close-btn {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 999px;
  background: #f3f4f6;
  color: #4b5563;
  font-size: 22px;
  line-height: 1;
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease;
}

.close-btn:hover {
  background: #e5e7eb;
  color: #111827;
}

.chat-body {
  flex: 1;
  min-height: 0;
  display: flex;
  background: #f8fafc;
}

.chat-footer {
  flex: 0 0 auto;
  padding: 12px 16px 16px;
  border-top: 1px solid #eef2f7;
  background: #ffffff;
}

@media (max-width: 768px) {
  .ai-chat-window {
    border-radius: 0;
    border: none;
    box-shadow: none;
  }

  .chat-header {
    padding: 16px;
  }

  .chat-footer {
    padding: 12px 12px calc(12px + env(safe-area-inset-bottom));
  }
}
</style>
