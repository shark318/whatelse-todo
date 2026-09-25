<template>
  <view class="banner" @click="onClick">
    <view class="warn-dot"></view>
    <text class="text">通知权限未开启，点此去开启</text>
  </view>
</template>

<script setup>
/**
 * 通知权限提示条（F7.2）。
 * 未授权时常驻在设置页顶部；点击后由父页面引导到系统设置。
 */
const emit = defineEmits(['click'])

function onClick() {
  emit('click')
}
</script>

<style scoped>
.banner {
  margin: 20rpx 24rpx 0;
  padding: 26rpx 28rpx;
  display: flex;
  align-items: center;
  background-color: var(--c-surface);
  border-radius: 28rpx;
  border-left: 10rpx solid var(--c-warn);
  box-shadow: 0 6rpx 20rpx var(--c-shadow);
}

.warn-dot {
  width: 16rpx;
  height: 16rpx;
  border-radius: 50%;
  background-color: var(--c-warn);
  margin-right: 16rpx;
  flex-shrink: 0;
}

.text {
  font-size: 28rpx;
  color: var(--c-text);
}
</style>
