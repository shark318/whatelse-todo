<template>
  <view class="fab" @click="onClick">
    <view class="plus-h"></view>
    <view class="plus-v"></view>
  </view>
</template>

<script setup>
/** 右下角悬浮新增按钮：用 CSS 画加号，不依赖图标字体或图片 */
const emit = defineEmits(['click'])

function onClick() {
  emit('click')
}
</script>

<style scoped>
.fab {
  position: fixed;
  right: 40rpx;
  bottom: 64rpx;
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  background-image: linear-gradient(135deg, var(--c-primary) 0%, var(--c-primary-2) 100%);
  box-shadow: 0 12rpx 32rpx var(--c-shadow);
  z-index: 20;
}

.plus-h {
  position: absolute;
  left: 37rpx;
  top: 57rpx;
  width: 46rpx;
  height: 6rpx;
  border-radius: 3rpx;
  background-color: #FFFFFF;
}

.plus-v {
  position: absolute;
  left: 57rpx;
  top: 37rpx;
  width: 6rpx;
  height: 46rpx;
  border-radius: 3rpx;
  background-color: #FFFFFF;
}
</style>
