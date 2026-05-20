<template>
  <div
    class="message-input-shell"
    :class="{ 'is-dragover': isDragover }"
    @dragenter.prevent="onDragEnter"
    @dragover.prevent="onDragOver"
    @dragleave.prevent="onDragLeave"
    @drop.prevent="onDrop"
  >
    <FileUpload
      ref="uploadRef"
      :disabled="disabled"
      :parsing="parsing"
      @files-parsed="$emit('files-parsed', $event)"
      @error="handleUploadError"
      @parsing-change="$emit('parsing-change', $event)"
    />

    <div class="composer">
      <button
        class="icon-btn"
        type="button"
        :disabled="disabled || parsing"
        aria-label="上传文件"
        @click="openUpload"
      >
        +
      </button>

      <el-input
        v-model="innerValue"
        class="chat-textarea"
        type="textarea"
        resize="none"
        :rows="1"
        :autosize="{ minRows: 1, maxRows: 6 }"
        :disabled="disabled"
        :placeholder="parsing ? '文件解析中，请稍候...' : '输入你的问题，Enter 发送，Shift + Enter 换行'"
        @keydown="handleKeydown"
      />

      <button
        v-if="loading"
        class="send-btn stop-btn"
        type="button"
        @click="$emit('stop')"
      >
        停
      </button>

      <button
        v-else
        class="send-btn"
        type="button"
        :disabled="disabled || !innerValue.trim()"
        @click="$emit('send')"
      >
        ↑
      </button>
    </div>

    <div v-if="parsing" class="helper-text">正在解析文件，请稍候...</div>
    <div v-else-if="loading" class="helper-text">AI 正在流式输出中，可点击右侧停止。</div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { ElMessage } from 'element-plus'
import FileUpload from './FileUpload.vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  disabled: Boolean,
  loading: Boolean,
  parsing: Boolean
})

const emit = defineEmits([
  'update:modelValue',
  'send',
  'stop',
  'files-parsed',
  'parsing-change'
])

const uploadRef = ref(null)
const isDragover = ref(false)

const innerValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const handleKeydown = (event) => {
  if (event.key !== 'Enter') return
  if (event.shiftKey) return
  event.preventDefault()
  if (props.disabled || props.loading || !innerValue.value.trim()) return
  emit('send')
}

const handleUploadError = (error) => {
  ElMessage.error(error?.message || '文件解析失败')
}

const openUpload = () => {
  uploadRef.value?.openPicker()
}

const onDragEnter = () => {
  if (props.disabled || props.parsing) return
  isDragover.value = true
}

const onDragOver = () => {
  if (props.disabled || props.parsing) return
  isDragover.value = true
}

const onDragLeave = (event) => {
  if (event.currentTarget.contains(event.relatedTarget)) return
  isDragover.value = false
}

const onDrop = (event) => {
  isDragover.value = false
  if (props.disabled || props.parsing) return
  const files = Array.from(event.dataTransfer?.files || [])
  uploadRef.value?.handleFiles(files)
}
</script>

<style scoped>
.message-input-shell {
  border: 1px solid #e5e7eb;
  border-radius: 18px;
  background: #ffffff;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.message-input-shell.is-dragover {
  border-color: #93c5fd;
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.08);
}

.composer {
  display: flex;
  align-items: flex-end;
  gap: 10px;
  padding: 10px 12px;
}

.icon-btn,
.send-btn {
  flex: 0 0 auto;
  width: 38px;
  height: 38px;
  border: none;
  border-radius: 999px;
  cursor: pointer;
  font-size: 20px;
  transition: background 0.2s ease, opacity 0.2s ease, transform 0.2s ease;
}

.icon-btn {
  background: #f3f4f6;
  color: #374151;
}

.icon-btn:hover:not(:disabled),
.send-btn:hover:not(:disabled) {
  transform: translateY(-1px);
}

.send-btn {
  background: #2563eb;
  color: #ffffff;
}

.send-btn:disabled {
  cursor: not-allowed;
  opacity: 0.45;
}

.stop-btn {
  background: #ef4444;
  font-size: 14px;
  font-weight: 600;
}

:deep(.chat-textarea) {
  flex: 1;
}

:deep(.chat-textarea .el-textarea__inner) {
  padding: 8px 0;
  border: none;
  box-shadow: none;
  resize: none;
  color: #111827;
  font-size: 14px;
  line-height: 1.6;
}

:deep(.chat-textarea .el-textarea__inner::placeholder) {
  color: #9ca3af;
}

.helper-text {
  padding: 0 14px 12px;
  font-size: 12px;
  color: #6b7280;
}

@media (max-width: 768px) {
  .composer {
    padding: 10px;
  }
}
</style>
