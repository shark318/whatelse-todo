<template>
  <view class="group" @click="onToggle">
    <view class="arrow" :class="{ open: !collapsed }"></view>
    <text class="label">已完成（{{ count }}）</text>
  </view>
</template>

<script setup>
/** 已完成分组条：点击展开/收起 */
const props = defineProps({
  count: { type: Number, default: 0 },
  collapsed: { type: Boolean, default: true }
})
const emit = defineEmits(['toggle'])

function onToggle() {
  emit('toggle')
}
</script>

<style scoped>
.group {
  display: flex;
  align-items: center;
  padding: 26rpx 54rpx 12rpx;   /* 左内边距与卡片式任务行的文字对齐 */
  background-color: var(--c-bg);
}

/* 用 CSS 画三角箭头，展开时旋转 90 度 */
.arrow {
  width: 0;
  height: 0;
  margin-right: 12rpx;
  border-top: 10rpx solid transparent;
  border-bottom: 10rpx solid transparent;
  border-left: 14rpx solid var(--c-text-2);
  transition: transform 0.2s ease;
}

.arrow.open {
  transform: rotate(90deg);
}

.label {
  font-size: 26rpx;
  font-weight: 600;
  color: var(--c-text-2);
}
</style>
