<template>
  <view class="quick-add">
    <input
      class="input"
      type="text"
      :value="modelValue"
      placeholder="还有什么要做的？"
      placeholder-class="ph"
      confirm-type="done"
      :confirm-hold="true"
      :maxlength="200"
      @input="onInput"
      @confirm="onConfirm"
    />
  </view>
</template>

<script setup>
/**
 * 首页快速新建输入框（文案 C2）
 * 回车即创建，创建后由父页面清空并保持聚焦，方便连续录入。
 */
const props = defineProps({
  modelValue: { type: String, default: '' }
})
const emit = defineEmits(['update:modelValue', 'submit'])

function onInput(e) {
  emit('update:modelValue', e.detail.value)
}

function onConfirm(e) {
  emit('submit', e.detail.value)
}
</script>

<style scoped>
.quick-add {
  padding: 0 24rpx 20rpx;
  background-color: var(--c-bg);
}

/* 胶囊输入框：和搜索框同一套圆润语言 */
.input {
  height: 84rpx;
  padding: 0 32rpx;
  background-color: var(--c-surface);
  border-radius: 999rpx;
  box-shadow: 0 6rpx 20rpx var(--c-shadow);
  font-size: 30rpx;
  color: var(--c-text);
}

.ph {
  color: var(--c-text-2);
}
</style>
