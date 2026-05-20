<template>
  <router-view />
  <FloatingAI v-if="showFloatingAI" />
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import FloatingAI from './components/ai/FloatingAI.vue'

const route = useRoute()

const hiddenRoutes = new Set(['/login', '/register'])
const showFloatingAI = computed(() => !hiddenRoutes.has(route.path))
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html,
body,
#app {
  min-height: 100%;
}

body {
  font-family: "PingFang SC", "Microsoft YaHei", sans-serif;
}
</style>
