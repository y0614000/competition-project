<template>
  <teleport to="body">
    <div class="floating-ai-root">
      <transition name="ai-panel">
        <div v-if="isOpen" class="floating-ai-panel">
          <AIChatWindow @close="isOpen = false" />
        </div>
      </transition>

      <button
        class="floating-ai-trigger"
        :class="{ 'is-open': isOpen }"
        type="button"
        aria-label="打开 AI 智能助手"
        @click="isOpen = !isOpen"
      >
        <img src="/images/icon/AGI_icon.png" alt="AI 智能体" />
      </button>
    </div>
  </teleport>
</template>

<script setup>
import { onBeforeUnmount, ref, watch } from 'vue'
import AIChatWindow from './AIChatWindow.vue'

const isOpen = ref(false)

const lockPageScroll = (locked) => {
  document.body.style.overflow = locked ? 'hidden' : ''
  document.documentElement.style.overflow = locked ? 'hidden' : ''
}

watch(isOpen, (value) => {
  lockPageScroll(value)
})

onBeforeUnmount(() => {
  lockPageScroll(false)
})
</script>

<style scoped>
.floating-ai-root {
  position: relative;
  z-index: 2100;
}

.floating-ai-trigger {
  position: fixed;
  right: 24px;
  bottom: 24px;
  width: 208px;
  height: 208px;
  border: none;
  border-radius: 0;
  background: transparent;
  box-shadow: none;
  display: grid;
  place-items: center;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  padding: 0;
}

.floating-ai-trigger img {
  width: 108px;
  height: 108px;
  object-fit: contain;
}

.floating-ai-trigger:hover {
  transform: scale(1.05);
}

.floating-ai-trigger.is-open {
  transform: scale(1.02);
}

.floating-ai-panel {
  position: fixed;
  top: 80px;
  left: 244px;
  right: 28px;
  bottom: 24px;
  z-index: 2099;
}

.ai-panel-enter-active,
.ai-panel-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}

.ai-panel-enter-from,
.ai-panel-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

@media (max-width: 768px) {
  .floating-ai-trigger {
    right: 16px;
    bottom: 16px;
    width: 88px;
    height: 88px;
  }

  .floating-ai-trigger img {
    width: 88px;
    height: 88px;
  }

  .floating-ai-panel {
    right: 0;
    bottom: 0;
    left: 0;
    top: 0;
    width: 100vw;
    height: 100vh;
  }
}
</style>
