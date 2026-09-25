<template>
  <view class="setting-row" @click="onClick">
    <text class="label">{{ label }}</text>
    <view class="right">
      <text v-if="value" class="value">{{ value }}</text>
      <view v-if="showArrow" class="arrow"></view>
    </view>
  </view>
</template>

<script setup>
/** 通用设置行：左标签、右值、可选右箭头 */
const props = defineProps({
  label: { type: String, default: '' },
  value: { type: String, default: '' },
  showArrow: { type: Boolean, default: true }
})
const emit = defineEmits(['click'])

function onClick() {
  emit('click')
}
</script>

<style scoped>
.setting-row {
  min-height: 96rpx;
  padding: 20rpx 32rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: var(--c-surface);
  border-bottom: 1rpx solid var(--c-line);
}

.label {
  font-size: 30rpx;
  color: var(--c-text);
}

.right {
  display: flex;
  align-items: center;
}

.value {
  font-size: 28rpx;
  color: var(--c-text-2);
}

/* CSS 画的右箭头 */
.arrow {
  width: 16rpx;
  height: 16rpx;
  margin-left: 12rpx;
  border-top: 3rpx solid var(--c-text-2);
  border-right: 3rpx solid var(--c-text-2);
  transform: rotate(45deg);
}
</style>
