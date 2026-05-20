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
        @send="sendMessage"
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
  buildConversationInput,
  createDefaultPrompt,
  createUserDisplayContent,
  loadCachedMessages,
  makeMessageId,
  saveCachedMessages,
  streamDoubaoChat
} from './services/doubao'

defineEmits(['close'])

const draft = ref('')
const messages = ref([])
const isParsingFiles = ref(false)
const isGenerating = ref(false)
const activeController = ref(null)
const typingQueue = ref([])
const activeAssistantId = ref('')

let typingTimer = null
let streamFinished = false
let streamAborted = false

const persistFinalMessages = () => {
  const finalMessages = messages.value.filter((message) => {
    if (message.role !== 'assistant') return true
    return message.status !== 'thinking' && message.content.trim()
  })
  saveCachedMessages(finalMessages)
}

const loadMessages = () => {
  messages.value = loadCachedMessages()
}

const getActiveAssistant = () =>
  messages.value.find((message) => message.id === activeAssistantId.value)

const getQueuedText = (kind) =>
  typingQueue.value
    .filter((token) => token.kind === kind)
    .map((token) => token.char)
    .join('')

const getBufferedText = (kind) => {
  const assistantMessage = getActiveAssistant()
  if (!assistantMessage) return ''

  const rendered = kind === 'reasoning' ? assistantMessage.reasoning || '' : assistantMessage.content || ''
  return rendered + getQueuedText(kind)
}

const getNonDuplicatedSuffix = (existingText, incomingText) => {
  const incoming = String(incomingText || '')
  if (!incoming) return ''
  if (!existingText) return incoming

  if (incoming.startsWith(existingText)) {
    return incoming.slice(existingText.length)
  }

  if (existingText.endsWith(incoming)) {
    return ''
  }

  const maxOverlap = Math.min(existingText.length, incoming.length)
  for (let size = maxOverlap; size > 0; size -= 1) {
    if (existingText.slice(-size) === incoming.slice(0, size)) {
      return incoming.slice(size)
    }
  }

  return incoming
}

const stopTypingLoop = () => {
  if (typingTimer) {
    clearTimeout(typingTimer)
    typingTimer = null
  }
}

const finalizeAssistantMessage = () => {
  stopTypingLoop()
  const assistantMessage = getActiveAssistant()
  if (!assistantMessage) return

  if (assistantMessage.status === 'error') {
    activeAssistantId.value = ''
    persistFinalMessages()
    return
  }

  assistantMessage.status = streamAborted ? 'stopped' : 'done'
  if (streamAborted && !assistantMessage.content.trim()) {
    assistantMessage.content = '已停止生成。'
  }

  activeAssistantId.value = ''
  isGenerating.value = false
  activeController.value = null
  persistFinalMessages()
}

const runTypingLoop = () => {
  if (typingTimer) return

  typingTimer = window.setTimeout(function step() {
    const assistantMessage = getActiveAssistant()
    if (!assistantMessage) {
      stopTypingLoop()
      return
    }

    const nextToken = typingQueue.value.shift()
    if (nextToken) {
      assistantMessage.status = 'streaming'
      if (nextToken.kind === 'reasoning') {
        assistantMessage.reasoning += nextToken.char
      } else {
        assistantMessage.content += nextToken.char
      }
    }

    if (typingQueue.value.length) {
      typingTimer = window.setTimeout(step, 14)
      return
    }

    stopTypingLoop()
    if (streamFinished) {
      finalizeAssistantMessage()
    }
  }, 14)
}

const enqueueDelta = ({ kind, text }) => {
  const nextText = getNonDuplicatedSuffix(getBufferedText(kind), text)
  if (!nextText) return

  typingQueue.value.push(
    ...Array.from(nextText).map((char) => ({
      kind,
      char
    }))
  )
  runTypingLoop()
}

const createAssistantPlaceholder = () => ({
  id: makeMessageId('assistant'),
  role: 'assistant',
  reasoning: '',
  content: '',
  status: 'thinking',
  createdAt: Date.now(),
  attachments: []
})

const createUserMessage = (text, attachments = [], displayText = '') => ({
  id: makeMessageId('user'),
  role: 'user',
  content: displayText || createUserDisplayContent(text, attachments),
  status: 'done',
  createdAt: Date.now(),
  attachments: attachments.map((file) => ({
    id: file.id,
    name: file.name,
    kind: file.kind,
    size: file.size,
    isResume: file.isResume,
    analysisText: file.analysisText,
    extractedText: file.extractedText,
    ocrText: file.ocrText
  }))
})

const markAssistantError = (message) => {
  const assistantMessage = getActiveAssistant()
  if (!assistantMessage) return

  assistantMessage.status = 'error'
  assistantMessage.content = message || '生成失败，请稍后重试。'
  activeAssistantId.value = ''
  isGenerating.value = false
  activeController.value = null
  stopTypingLoop()
  persistFinalMessages()
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
  const messageText = String(options.text || '').trim() || createDefaultPrompt(attachments)
  if (!messageText && !attachments.length) return

  const userMessage = createUserMessage(messageText, attachments, options.displayText)
  const assistantMessage = createAssistantPlaceholder()
  const history = [...messages.value, userMessage]

  messages.value.push(userMessage, assistantMessage)
  draft.value = ''
  activeAssistantId.value = assistantMessage.id
  isGenerating.value = true
  streamFinished = false
  streamAborted = false
  typingQueue.value = []
  saveCachedMessages(history)

  const controller = new AbortController()
  activeController.value = controller

  try {
    await streamDoubaoChat({
      messages: buildConversationInput({
        history: history.filter((message) => message.id !== userMessage.id),
        userText: messageText,
        attachments
      }),
      signal: controller.signal,
      onDelta: (delta) => {
        enqueueDelta(delta)
      },
      onDone: () => {
        streamFinished = true
        if (!typingQueue.value.length) {
          finalizeAssistantMessage()
        }
      },
      onError: (error) => {
        markAssistantError(error.message)
      }
    })
  } catch (error) {
    if (error?.name === 'AbortError') {
      streamFinished = true
      streamAborted = true
      if (!typingQueue.value.length) {
        finalizeAssistantMessage()
      }
      return
    }

    markAssistantError(error?.message || '豆包服务请求失败。')
  }
}

const stopGeneration = () => {
  if (!activeController.value) return
  streamAborted = true
  activeController.value.abort()
  ElMessage.info('已停止生成')
}

const handleQuickAction = (prompt) => {
  sendMessage({ text: prompt })
}

const handleFilesParsed = (files) => {
  if (!files.length) return

  const fileNames = files.map((file) => file.name).join('、')
  const prompt = draft.value.trim() || createDefaultPrompt(files)
  const displayText = `已上传 ${fileNames}，正在分析...`

  sendMessage({
    text: prompt,
    attachments: files,
    displayText
  })
}

onMounted(() => {
  loadMessages()
})

onBeforeUnmount(() => {
  stopTypingLoop()
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
