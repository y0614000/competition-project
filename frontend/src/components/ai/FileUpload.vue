<template>
  <input
    ref="inputRef"
    class="native-input"
    type="file"
    multiple
    :disabled="disabled || parsing"
    accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.webp"
    @change="handleInputChange"
  />
</template>

<script setup>
import { ref } from 'vue'
import mammoth from 'mammoth/mammoth.browser'
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs'

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/legacy/build/pdf.worker.min.mjs',
  import.meta.url
).toString()

const props = defineProps({
  disabled: Boolean,
  parsing: Boolean
})

const emit = defineEmits(['files-parsed', 'error', 'parsing-change'])

const inputRef = ref(null)
const MAX_TEXT_LENGTH = 12000
const MAX_PDF_PAGES = 10

const truncate = (value, maxLength = MAX_TEXT_LENGTH) => {
  const text = String(value || '').trim()
  if (!text) return ''
  return text.length > maxLength ? `${text.slice(0, maxLength)}\n\n[内容已截断]` : text
}

const readAsArrayBuffer = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = () => reject(reader.error || new Error('文件读取失败'))
    reader.readAsArrayBuffer(file)
  })

const readAsDataURL = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = () => reject(reader.error || new Error('文件读取失败'))
    reader.readAsDataURL(file)
  })

const guessIsResume = (name = '', text = '') => {
  const sample = `${name}\n${text}`.toLowerCase()
  return /(简历|resume|cv|工作经历|教育经历|项目经验|技能)/i.test(sample)
}

const extractPdfText = async (pdf) => {
  const pages = []

  for (let index = 1; index <= Math.min(pdf.numPages, MAX_PDF_PAGES); index += 1) {
    const page = await pdf.getPage(index)
    const content = await page.getTextContent()
    pages.push(content.items.map((item) => item.str).join(' '))
  }

  return truncate(pages.join('\n\n'))
}

const extractDocxText = async (file) => {
  const arrayBuffer = await readAsArrayBuffer(file)
  const result = await mammoth.extractRawText({ arrayBuffer })
  return truncate(result.value)
}

const extractDocText = async (file) => {
  try {
    return await extractDocxText(file)
  } catch {
    const arrayBuffer = await readAsArrayBuffer(file)
    const raw = new TextDecoder('utf-8', { fatal: false }).decode(arrayBuffer)
    const cleaned = raw
      .replace(/[^\x20-\x7E\u4e00-\u9fa5\r\n\t]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()

    if (!cleaned) {
      throw new Error('当前浏览器无法稳定解析 .doc 文件，建议先转成 .docx 再上传。')
    }

    return truncate(cleaned)
  }
}

const extractImageData = async (file) => {
  const dataUrl = await readAsDataURL(file)

  return {
    dataUrl
  }
}

const parseFile = async (file) => {
  const extension = file.name.split('.').pop()?.toLowerCase() || ''
  const basePayload = {
    id: `file_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    name: file.name,
    size: file.size,
    mimeType: file.type,
    extension,
    kind: 'text',
    isResume: false,
    extractedText: '',
    analysisText: ''
  }

  if (extension === 'pdf') {
    let extractedText = ''
    let analysisText = ''

    try {
      const buffer = await readAsArrayBuffer(file)
      const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(buffer) }).promise
      extractedText = await extractPdfText(pdf)
    } catch (error) {
      console.warn('PDF parse failed:', error)
    }

    if (extractedText) {
      analysisText = `PDF 内容提取：\n${extractedText}`
    } else {
      analysisText =
        'PDF 已上传，但当前文件未能稳定提取文本内容，可能是扫描版、图片版或加密文档。请结合用户问题做保守分析，并提醒用户如需更准确结果可补充文字说明或转成 Word 文档。'
    }

    return {
      ...basePayload,
      kind: 'pdf',
      extractedText,
      analysisText,
      isResume: guessIsResume(file.name, extractedText)
    }
  }

  if (extension === 'docx') {
    const extractedText = await extractDocxText(file)
    return {
      ...basePayload,
      kind: 'word',
      extractedText,
      analysisText: `Word 文档内容：\n${extractedText}`,
      isResume: guessIsResume(file.name, extractedText)
    }
  }

  if (extension === 'doc') {
    const extractedText = await extractDocText(file)
    return {
      ...basePayload,
      kind: 'word',
      extractedText,
      analysisText: `Word 文档内容：\n${extractedText}`,
      isResume: guessIsResume(file.name, extractedText)
    }
  }

  if (['png', 'jpg', 'jpeg', 'webp'].includes(extension)) {
    const { dataUrl } = await extractImageData(file)
    const analysisText = '图片已上传，请直接结合图像内容进行分析。'

    return {
      ...basePayload,
      kind: 'image',
      dataUrl,
      analysisText,
      isResume: guessIsResume(file.name, '')
    }
  }

  throw new Error(`暂不支持 ${extension || '该类型'} 文件`)
}

const handleFiles = async (fileList) => {
  if (!fileList.length) return
  emit('parsing-change', true)

  const parsedFiles = []
  try {
    for (const file of fileList) {
      parsedFiles.push(await parseFile(file))
    }
    emit('parsing-change', false)
    emit('files-parsed', parsedFiles)
  } catch (error) {
    emit('error', error)
    emit('parsing-change', false)
  } finally {
    if (inputRef.value) {
      inputRef.value.value = ''
    }
  }
}

const openPicker = () => {
  if (props.disabled || props.parsing) return
  inputRef.value?.click()
}

const handleInputChange = async (event) => {
  const files = Array.from(event.target.files || [])
  await handleFiles(files)
}

defineExpose({
  openPicker,
  handleFiles
})
</script>

<style scoped>
.native-input {
  display: none;
}
</style>
