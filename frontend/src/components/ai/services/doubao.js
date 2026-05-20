export const DOUBAO_API_KEY =
  import.meta.env.VITE_DOUBAO_API_KEY?.trim() ||
  globalThis?.localStorage?.getItem('VITE_DOUBAO_API_KEY') ||
  '你的key'

export const API_URL = 'https://ark.cn-beijing.volces.com/api/v3/responses'
export const MODEL_NAME = 'doubao-seed-1-8-251228'
export const MESSAGE_CACHE_KEY = 'qiongyamemory_chat_messages'
export const POSITION_CACHE_KEY = 'qiongyamemory_chat_position'

export const AI_INSTRUCTIONS = [
  '你是海南自贸港人才服务平台的 AI 智能助手。',
  '你的任务是围绕求职招聘、简历诊断、岗位推荐、职业发展、人才政策解读提供专业建议。',
  '如果用户上传了简历、PDF、Word 或图片，请优先结合材料内容分析。',
  '输出尽量结构化，使用简洁中文，必要时给出表格、列表和行动建议。',
  '进行简历分析时，请覆盖：工作经历、技能匹配度、岗位推荐、优化建议、薪资分析、人才评级。',
  '不要编造用户材料里不存在的硬性经历；不确定时明确说明是推断。'
].join('\n')

function safeJsonParse(value, fallback) {
  try {
    return JSON.parse(value)
  } catch {
    return fallback
  }
}

function pruneText(value = '', maxLength = 6000) {
  const text = String(value || '').trim()
  if (!text) return ''
  return text.length > maxLength ? `${text.slice(0, maxLength)}\n\n[内容已截断]` : text
}

export function ensureDoubaoApiKey() {
  if (!DOUBAO_API_KEY || DOUBAO_API_KEY === '你的key') {
    throw new Error('请先在 .env 中配置 VITE_DOUBAO_API_KEY，或在 doubao.js 中填入真实的豆包 API Key。')
  }
}

export function makeMessageId(prefix = 'msg') {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`
}

export function loadCachedMessages() {
  const cached = globalThis?.localStorage?.getItem(MESSAGE_CACHE_KEY)
  const parsed = safeJsonParse(cached, [])
  return Array.isArray(parsed) ? parsed : []
}

export function saveCachedMessages(messages) {
  const payload = messages.map((message) => ({
    id: message.id,
    role: message.role,
    content: message.content,
    reasoning: message.reasoning || '',
    status: message.status === 'error' ? 'error' : 'done',
    createdAt: message.createdAt,
    attachments: (message.attachments || []).map((attachment) => ({
      id: attachment.id,
      name: attachment.name,
      kind: attachment.kind,
      size: attachment.size,
      isResume: !!attachment.isResume,
      analysisText: pruneText(attachment.analysisText, 4000),
      extractedText: pruneText(attachment.extractedText, 4000),
      ocrText: pruneText(attachment.ocrText, 4000)
    }))
  }))

  globalThis?.localStorage?.setItem(MESSAGE_CACHE_KEY, JSON.stringify(payload))
}

export function clearCachedMessages() {
  globalThis?.localStorage?.removeItem(MESSAGE_CACHE_KEY)
}

export function loadCachedPosition() {
  return safeJsonParse(globalThis?.localStorage?.getItem(POSITION_CACHE_KEY), null)
}

export function saveCachedPosition(position) {
  globalThis?.localStorage?.setItem(POSITION_CACHE_KEY, JSON.stringify(position))
}

export function buildAttachmentSummary(attachments = []) {
  if (!attachments.length) return ''

  return attachments
    .map((file, index) => {
      const sections = [`[附件 ${index + 1}] ${file.name}`]

      if (file.isResume) {
        sections.push('用途：候选人简历/履历材料')
      }

      if (file.kind === 'image' && file.ocrText) {
        sections.push(`OCR 提取：\n${pruneText(file.ocrText, 3000)}`)
      }

      if (file.extractedText) {
        sections.push(`文件内容：\n${pruneText(file.extractedText, 5000)}`)
      } else if (file.analysisText) {
        sections.push(pruneText(file.analysisText, 5000))
      }

      return sections.join('\n')
    })
    .join('\n\n')
}

export function createDefaultPrompt(attachments = []) {
  const hasResume = attachments.some((file) => file.isResume)
  if (hasResume) {
    return '请分析我上传的简历，输出工作经历总结、技能匹配度、岗位推荐、简历优化建议、薪资分析和人才评级。'
  }
  return '请分析我上传的文件，提炼关键信息，并结合求职场景给出专业建议。'
}

export function createUserDisplayContent(text, attachments = []) {
  const baseText = String(text || '').trim() || createDefaultPrompt(attachments)
  if (!attachments.length) return baseText

  const fileLabel = attachments.map((file) => file.name).join('、')
  return `${baseText}\n\n已上传 ${attachments.length} 个文件：${fileLabel}`
}

function normalizeHistoryMessage(message) {
  if (!message?.content?.trim()) return null

  const attachmentSummary =
    message.role === 'user' ? buildAttachmentSummary(message.attachments || []) : ''

  return {
    role: message.role,
    content: attachmentSummary ? `${message.content}\n\n${attachmentSummary}` : message.content
  }
}

export function buildConversationInput({ history = [], userText = '', attachments = [] }) {
  const normalizedHistory = history
    .filter((message) => ['user', 'assistant'].includes(message.role))
    .slice(-12)
    .map(normalizeHistoryMessage)
    .filter(Boolean)

  const currentText = String(userText || '').trim() || createDefaultPrompt(attachments)
  const currentContent = []

  currentContent.push({
    type: 'input_text',
    text: currentText
  })

  attachments.forEach((file) => {
    if (file.kind === 'image' && file.dataUrl) {
      currentContent.push({
        type: 'input_image',
        image_url: file.dataUrl,
        detail: 'high'
      })
    }

    const attachmentText = file.analysisText || file.extractedText || file.ocrText
    if (attachmentText) {
      currentContent.push({
        type: 'input_text',
        text: `[文件 ${file.name}]\n${pruneText(attachmentText, 8000)}`
      })
    }
  })

  normalizedHistory.push({
    role: 'user',
    content: currentContent
  })

  return normalizedHistory
}

function extractDeltaParts(eventName, payload) {
  const parts = []
  const choiceDelta = payload?.choices?.[0]?.delta || {}

  // Only consume true incremental fields.
  // Ignore aggregated fields from completed/snapshot events, otherwise the same
  // answer can be appended twice when the server also sends a final full text.
  const reasoningText =
    (eventName.includes('reasoning') && (payload.delta || payload.text || '')) ||
    choiceDelta.reasoning_content ||
    payload.delta?.reasoning_content ||
    ''

  const contentText =
    (eventName === 'response.output_text.delta' ? payload.delta || payload.text || '' : '') ||
    choiceDelta.content ||
    (eventName.includes('content_part') ? payload.item?.content?.[0]?.text || '' : '') ||
    (!eventName.includes('reasoning') &&
    !eventName.includes('completed') &&
    !eventName.includes('done') &&
    typeof payload.delta === 'string'
      ? payload.delta
      : '')

  if (reasoningText) {
    parts.push({ kind: 'reasoning', text: reasoningText })
  }

  if (contentText) {
    parts.push({ kind: 'content', text: contentText })
  }

  return parts
}

function extractResponseId(eventName, payload) {
  if (eventName.startsWith('response.')) {
    return payload.response?.id || payload.id || ''
  }
  return payload.response_id || ''
}

function parseErrorMessage(payload) {
  return (
    payload?.error?.message ||
    payload?.response?.error?.message ||
    payload?.message ||
    '豆包服务响应失败，请稍后重试。'
  )
}

export async function streamDoubaoChat({
  messages,
  onDelta,
  onDone,
  onError,
  signal,
  instructions = AI_INSTRUCTIONS
}) {
  try {
    ensureDoubaoApiKey()

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'text/event-stream',
        Authorization: `Bearer ${DOUBAO_API_KEY}`
      },
      body: JSON.stringify({
        model: MODEL_NAME,
        input: messages,
        instructions,
        stream: true
      }),
      signal
    })

    if (!response.ok) {
      let detail = ''

      try {
        const json = await response.json()
        detail = parseErrorMessage(json)
      } catch {
        detail = await response.text()
      }

      throw new Error(detail || `请求失败：${response.status}`)
    }

    if (!response.body) {
      throw new Error('浏览器未返回可读流，无法进行流式输出。')
    }

    const reader = response.body.getReader()
    const decoder = new TextDecoder('utf-8')
    let buffer = ''
    let lastResponseId = ''
    let completed = false

    const handleEventBlock = (block) => {
      const trimmed = block.trim()
      if (!trimmed) return

      const lines = trimmed.split('\n')
      let eventName = ''
      const dataLines = []

      for (const line of lines) {
        if (line.startsWith('event:')) {
          eventName = line.slice(6).trim()
        } else if (line.startsWith('data:')) {
          dataLines.push(line.slice(5).trim())
        }
      }

      const data = dataLines.join('\n')
      if (!data) return

      if (data === '[DONE]') {
        completed = true
        onDone?.({ responseId: lastResponseId })
        return
      }

      let json
      try {
        json = JSON.parse(data)
      } catch (error) {
        console.warn('stream parse error:', error, data)
        return
      }

      lastResponseId = extractResponseId(eventName, json) || lastResponseId

      if (eventName === 'response.failed') {
        throw new Error(parseErrorMessage(json))
      }

      const parts = extractDeltaParts(eventName, json)
      for (const part of parts) {
        onDelta?.(part, { eventName, payload: json, responseId: lastResponseId })
      }

      if (eventName === 'response.completed') {
        completed = true
      }
    }

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const chunks = buffer.split(/\r?\n\r?\n/)
      buffer = chunks.pop() || ''

      for (const chunk of chunks) {
        handleEventBlock(chunk)
      }
    }

    if (buffer.trim()) {
      handleEventBlock(buffer)
    }

    if (!completed) {
      onDone?.({ responseId: lastResponseId })
    }
  } catch (error) {
    if (error?.name === 'AbortError') {
      throw error
    }
    onError?.(error)
    throw error
  }
}
