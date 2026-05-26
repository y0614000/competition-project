function readEnvApiKey() {
  try {
    return import.meta.env?.VITE_DOUBAO_API_KEY?.trim()
  } catch {
    return ''
  }
}

export const DOUBAO_API_KEY =
  readEnvApiKey() ||
  globalThis?.localStorage?.getItem('VITE_DOUBAO_API_KEY') ||
  '你的key'

export const API_URL = 'https://ark.cn-beijing.volces.com/api/v3/responses'
export const MODEL_NAME = 'doubao-seed-1-8-251228'
export const MESSAGE_CACHE_KEY = 'qiongyamemory_chat_messages'

const RESUME_SECTIONS = [
  { index: 1, title: '工作经历总结' },
  { index: 2, title: '技能匹配度分析' },
  { index: 3, title: '岗位推荐方向' },
  { index: 4, title: '简历优化建议' },
  { index: 5, title: '薪资分析' },
  { index: 6, title: '综合评级' }
]

export const AI_INSTRUCTIONS = [
  '你是海南自贸港人才服务平台的 AI 智能助手。',
  '你只输出最终答案，不输出思考过程、分析过程、推导过程、自我检查过程。',
  '输出风格参考 ChatGPT：职业化、简洁、清晰、结构化，使用自然的人类表达，正式但不要机械。',
  '不要复述用户上传材料的文件名，不要大段复述原文，不要堆砌关键词，不要重复段落。',
  '如果信息不足，可以做保守判断，但不要编造经历、数据、政策结论或薪资数字。',
  '简历分析时必须使用 Markdown，严格按六个部分输出，每个部分使用二级标题，并给出 2 到 3 条短 bullet。',
  '每条 bullet 控制在 1 到 2 句，不要把多个部分连成一整段。'
].join('\n')

function safeJsonParse(value, fallback) {
  try {
    return JSON.parse(value)
  } catch {
    return fallback
  }
}

function truncateText(value = '', maxLength = 8000) {
  const text = String(value || '').trim()
  if (!text) return ''
  return text.length > maxLength ? `${text.slice(0, maxLength)}\n\n[内容已截断]` : text
}

function dedupeBlocks(text) {
  const blocks = text
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean)

  const seen = new Set()
  const result = []

  for (const block of blocks) {
    const key = block.replace(/\s+/g, ' ').trim()
    if (!key || seen.has(key)) continue
    seen.add(key)
    result.push(block)
  }

  return result.join('\n\n').trim()
}

function stripInternalContent(text) {
  return text
    .replace(/\r/g, '')
    .replace(/^思考[:：].*$/gmu, '')
    .replace(/^正文[:：]\s*$/gmu, '')
    .replace(/^分析如下[:：]?\s*$/gmu, '')
    .replace(/^下面是分析[:：]?\s*$/gmu, '')
    .replace(/^用户现在.*$/gmu, '')
    .trim()
}

function sentenceToBullets(text) {
  const normalized = text.replace(/\n+/g, ' ').replace(/\s+/g, ' ').trim()
  if (!normalized) return ''

  const sentences = normalized
    .split(/(?<=[。！？；])/u)
    .map((item) => item.trim())
    .filter(Boolean)

  if (!sentences.length) {
    return `- ${normalized}`
  }

  const merged = []
  for (const sentence of sentences) {
    const previous = merged[merged.length - 1]
    if (previous && previous.length < 32 && sentence.length < 32) {
      merged[merged.length - 1] = `${previous} ${sentence}`.trim()
    } else {
      merged.push(sentence)
    }
  }

  return merged
    .slice(0, 3)
    .map((item) => `- ${item}`)
    .join('\n')
}

function createHeadingPattern(section) {
  return new RegExp(
    `(?:^|\\n|\\s*)(?:#{1,6}\\s*)?(?:${section.index}[.、．\\s]*|[一二三四五六][、.．\\s]*)?${section.title}(?:[:：])?`,
    'g'
  )
}

function normalizeResumeHeadings(text) {
  let output = text

  RESUME_SECTIONS.forEach((section) => {
    output = output.replace(
      createHeadingPattern(section),
      `\n\n## ${section.index}. ${section.title}\n`
    )
  })

  return output.replace(/\n{3,}/g, '\n\n').trim()
}

function formatResumeMarkdown(text) {
  const normalized = normalizeResumeHeadings(text)
  const matches = [...normalized.matchAll(/^##\s*(\d)\.\s*(.+)$/gm)]

  if (!matches.length) {
    return text
  }

  const sections = matches.map((match, index) => {
    const bodyStart = (match.index ?? 0) + match[0].length
    const bodyEnd = index + 1 < matches.length ? matches[index + 1].index ?? normalized.length : normalized.length
    const body = normalized.slice(bodyStart, bodyEnd).trim()
    const bulletBody = /^[-*]\s+/m.test(body) ? body : sentenceToBullets(body)
    return `## ${match[1]}. ${match[2].trim()}\n${bulletBody || '- 暂无足够信息。'}`
  })

  return sections.join('\n\n').trim()
}

function looksLikeResumeAnalysis(text) {
  return RESUME_SECTIONS.filter((section) => text.includes(section.title)).length >= 2
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
  if (!Array.isArray(parsed)) return []

  return parsed.filter((item) => item && ['user', 'assistant'].includes(item.role)).map((item) => ({
    id: item.id || makeMessageId(item.role || 'msg'),
    role: item.role,
    content: String(item.content || ''),
    status: item.status === 'error' ? 'error' : 'done',
    createdAt: item.createdAt || Date.now(),
    attachments: Array.isArray(item.attachments) ? item.attachments : []
  }))
}

export function saveCachedMessages(messages) {
  const payload = messages.map((message) => ({
    id: message.id,
    role: message.role,
    content: message.content,
    status: message.status === 'error' ? 'error' : 'done',
    createdAt: message.createdAt,
    attachments: (message.attachments || []).map((file) => ({
      id: file.id,
      kind: file.kind,
      name: file.name,
      size: file.size,
      isResume: !!file.isResume,
      extractedText: truncateText(file.extractedText, 3000),
      analysisText: truncateText(file.analysisText, 3000),
      ocrText: truncateText(file.ocrText, 3000)
    }))
  }))

  globalThis?.localStorage?.setItem(MESSAGE_CACHE_KEY, JSON.stringify(payload))
}

export function clearCachedMessages() {
  globalThis?.localStorage?.removeItem(MESSAGE_CACHE_KEY)
}

export function createDefaultPrompt(attachments = []) {
  const hasResume = attachments.some((file) => file.isResume)

  if (hasResume) {
    return [
      '请基于我上传的简历直接输出最终分析结果。',
      '不要复述原文，不要输出分析过程。',
      '使用 Markdown，严格按以下结构输出，并且每个部分使用 2 到 3 条短 bullet：',
      '## 1. 工作经历总结',
      '## 2. 技能匹配度分析',
      '## 3. 岗位推荐方向',
      '## 4. 简历优化建议',
      '## 5. 薪资分析',
      '## 6. 综合评级'
    ].join('\n')
  }

  return [
    '请基于我上传的材料直接输出最终分析结果。',
    '使用 Markdown。',
    '先概括关键信息，再给出与求职相关的建议。',
    '不要复述大段原文，不要输出分析过程。'
  ].join('\n')
}

export function createUserDisplayContent(text, attachments = []) {
  const trimmed = String(text || '').trim()
  if (trimmed) return trimmed
  if (attachments.length) return '已上传材料，正在分析...'
  return ''
}

function buildAttachmentContext(attachments = []) {
  return attachments
    .map((file, index) => {
      const lines = [`附件 ${index + 1}`]

      if (file.isResume) {
        lines.push('类型：简历材料')
      } else if (file.kind === 'image') {
        lines.push('类型：图片材料')
      } else if (file.kind === 'pdf' || file.kind === 'word') {
        lines.push('类型：文档材料')
      }

      const text = file.extractedText || file.ocrText || file.analysisText
      if (text) {
        lines.push(`内容：\n${truncateText(text, 6000)}`)
      }

      return lines.join('\n')
    })
    .join('\n\n')
}

function normalizeHistoryMessage(message) {
  const content = String(message?.content || '').trim()
  if (!content) return null

  return {
    role: message.role,
    content
  }
}

export function buildConversationInput({ history = [], userText = '', attachments = [] }) {
  const normalizedHistory = history
    .filter((message) => ['user', 'assistant'].includes(message.role))
    .slice(-10)
    .map(normalizeHistoryMessage)
    .filter(Boolean)

  const currentPrompt = String(userText || '').trim() || createDefaultPrompt(attachments)
  const currentContent = [
    {
      type: 'input_text',
      text: currentPrompt
    }
  ]

  attachments.forEach((file) => {
    if (file.kind === 'image' && file.dataUrl) {
      currentContent.push({
        type: 'input_image',
        image_url: file.dataUrl,
        detail: 'high'
      })
    }
  })

  const attachmentContext = buildAttachmentContext(attachments)
  if (attachmentContext) {
    currentContent.push({
      type: 'input_text',
      text: attachmentContext
    })
  }

  normalizedHistory.push({
    role: 'user',
    content: currentContent
  })

  return normalizedHistory
}

export function appendStreamChunk(existingText = '', incomingText = '') {
  const existing = String(existingText || '').replace(/\r/g, '')
  const incoming = String(incomingText || '').replace(/\r/g, '')

  if (!incoming) return existing
  if (!existing) return incoming
  if (incoming === existing) return existing
  if (incoming.startsWith(existing)) return incoming
  if (existing.endsWith(incoming)) return existing

  const maxOverlap = Math.min(existing.length, incoming.length)
  for (let size = maxOverlap; size > 0; size -= 1) {
    if (existing.slice(-size) === incoming.slice(0, size)) {
      return existing + incoming.slice(size)
    }
  }

  return existing + incoming
}

export function sanitizeAssistantOutput(content = '') {
  const stripped = stripInternalContent(String(content || ''))
  if (!stripped) return ''

  const deduped = dedupeBlocks(stripped)
  if (!deduped) return ''

  if (looksLikeResumeAnalysis(deduped)) {
    return formatResumeMarkdown(deduped)
  }

  return deduped
    .replace(/\n{3,}/g, '\n\n')
    .replace(/^-\s*/gm, '- ')
    .trim()
}

function extractContentDelta(eventName, payload) {
  if (eventName === 'response.output_text.delta' && typeof payload?.delta === 'string') {
    return payload.delta
  }

  const choiceContent = payload?.choices?.[0]?.delta?.content
  if (typeof choiceContent === 'string' && choiceContent) {
    return choiceContent
  }

  if (
    typeof payload?.delta === 'string' &&
    !eventName.includes('reasoning') &&
    !eventName.includes('completed') &&
    !eventName.includes('done')
  ) {
    return payload.delta
  }

  return ''
}

function parseErrorMessage(payload) {
  return (
    payload?.error?.message ||
    payload?.response?.error?.message ||
    payload?.message ||
    '豆包服务响应失败，请稍后重试。'
  )
}

function parseSseBlock(block) {
  const lines = block.trim().split('\n')
  let eventName = ''
  const dataLines = []

  for (const line of lines) {
    if (line.startsWith('event:')) {
      eventName = line.slice(6).trim()
    } else if (line.startsWith('data:')) {
      dataLines.push(line.slice(5).trim())
    }
  }

  return {
    eventName,
    data: dataLines.join('\n')
  }
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
    let completed = false

    const handleBlock = (block) => {
      const { eventName, data } = parseSseBlock(block)
      if (!data) return

      if (data === '[DONE]') {
        completed = true
        onDone?.()
        return
      }

      let payload
      try {
        payload = JSON.parse(data)
      } catch (error) {
        console.warn('stream parse error:', error, data)
        return
      }

      if (eventName === 'response.failed') {
        throw new Error(parseErrorMessage(payload))
      }

      const delta = extractContentDelta(eventName, payload)
      if (delta) {
        onDelta?.(delta)
      }

      if (eventName === 'response.completed') {
        completed = true
        onDone?.()
      }
    }

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const blocks = buffer.split(/\r?\n\r?\n/)
      buffer = blocks.pop() || ''

      for (const block of blocks) {
        handleBlock(block)
      }
    }

    if (buffer.trim()) {
      handleBlock(buffer)
    }

    if (!completed) {
      onDone?.()
    }
  } catch (error) {
    if (error?.name === 'AbortError') {
      throw error
    }

    onError?.(error)
    throw error
  }
}
