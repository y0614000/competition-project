<template>
  <div class="resume-analyzer">
    <div class="analyzer-head">
      <div>
        <h4>简历快分析</h4>
        <p>{{ latestResume ? `当前简历：${latestResume.name}` : '上传简历后可一键生成分析结果' }}</p>
      </div>
    </div>

    <div class="action-grid">
      <button
        v-for="action in actions"
        :key="action.label"
        class="action-card"
        type="button"
        :disabled="disabled || !latestResume"
        @click="$emit('analyze', action.prompt)"
      >
        <strong>{{ action.label }}</strong>
        <span>{{ action.description }}</span>
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  latestResume: {
    type: Object,
    default: null
  },
  disabled: Boolean
})

defineEmits(['analyze'])

const actions = [
  {
    label: '简历总评',
    description: '快速给出简历亮点、短板和整体评级',
    prompt: '请基于刚上传的简历做整体评估，输出亮点、短板、人才评级和最优先的三条修改建议。'
  },
  {
    label: '岗位推荐',
    description: '结合履历推荐最适合的岗位方向',
    prompt: '请根据这份简历推荐最匹配的岗位方向，说明推荐理由、匹配技能和建议城市。'
  },
  {
    label: '技能匹配',
    description: '分析技能结构与市场竞争力',
    prompt: '请拆解这份简历的核心技能，分析技能匹配度、缺口项和补强优先级。'
  },
  {
    label: '薪资分析',
    description: '估算薪资区间并给出提升空间',
    prompt: '请基于这份简历给出合理薪资区间、影响薪资的关键因素和提升建议。'
  }
]
</script>

<style scoped>
.resume-analyzer {
  padding: 12px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(145, 209, 255, 0.14);
}

.analyzer-head h4 {
  margin: 0 0 4px;
  font-size: 13px;
  color: #eff8ff;
}

.analyzer-head p {
  margin: 0;
  font-size: 12px;
  color: rgba(213, 232, 255, 0.66);
}

.action-grid {
  margin-top: 10px;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
}

.action-card {
  padding: 10px;
  border: 1px solid rgba(145, 209, 255, 0.16);
  border-radius: 16px;
  background: linear-gradient(180deg, rgba(20, 72, 145, 0.22), rgba(8, 20, 45, 0.18));
  color: #eef8ff;
  text-align: left;
  cursor: pointer;
  transition: transform 0.25s ease, border-color 0.25s ease, background 0.25s ease;
}

.action-card strong {
  display: block;
  margin-bottom: 4px;
  font-size: 12px;
}

.action-card span {
  font-size: 11px;
  line-height: 1.5;
  color: rgba(214, 233, 255, 0.68);
}

.action-card:hover:not(:disabled) {
  transform: translateY(-1px);
  border-color: rgba(108, 212, 255, 0.4);
  background: linear-gradient(180deg, rgba(26, 101, 209, 0.28), rgba(8, 20, 45, 0.18));
}

.action-card:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .action-grid {
    grid-template-columns: 1fr;
  }
}
</style>
