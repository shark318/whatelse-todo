<template>
  <view class="empty">
    <!-- 会轻轻上下浮动的 emoji，比静止图形更有生气 -->
    <text class="art">{{ art }}</text>
    <text class="main">{{ title }}</text>
    <text v-if="hint" class="hint">{{ hint }}</text>
  </view>
</template>

<script setup>
/**
 * 空状态。
 * 三种场景各配一个 emoji（开发文档 4.3.4）：
 *   · 真的没有任何任务 → 🌱「没有别的了」
 *   · 分类筛选下没有   → 🤔「这个分类下暂时没有」
 *   · 搜索没有命中     → 🔍「没找到相关的」
 * 主文案仍是既定的 C3，只有引导小字用了轻松一点的语气。
 */
defineProps({
  art: { type: String, default: '🌱' },
  title: { type: String, default: '没有别的了' },
  hint: { type: String, default: '' }
})
</script>

<style scoped>
.empty {
  padding: 130rpx 32rpx 60rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* emoji 图形：用 font-size 控制大小，带一个缓慢的浮动动画 */
.art {
  font-size: 104rpx;
  line-height: 1;
  margin-bottom: 32rpx;
  animation: float 2.6s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-12rpx); }
}

.main {
  font-size: 32rpx;
  font-weight: 600;
  color: var(--c-text-2);
}

.hint {
  margin-top: 16rpx;
  font-size: 24rpx;
  color: var(--c-text-2);
  opacity: 0.8;
}
</style>
