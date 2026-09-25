<template>
  <view class="picker">
    <view
      v-for="c in categories"
      :key="c.id"
      class="pill"
      :class="{ on: c.id === current }"
      @click="onPick(c.id)"
    >
      <view class="dot" :style="{ backgroundColor: c.color }"></view>
      <text class="name">{{ c.name }}</text>
    </view>
  </view>
</template>

<script setup>
/** 分类单选胶囊 */
const props = defineProps({
  categories: { type: Array, default: function () { return [] } },
  current: { type: String, default: 'default' }
})
const emit = defineEmits(['change'])

function onPick(id) {
  if (id === props.current) return
  emit('change', id)
}
</script>

<style scoped>
.picker {
  display: flex;
  flex-wrap: wrap;
  padding: 4rpx 0;
}

.pill {
  display: flex;
  align-items: center;
  height: 60rpx;
  padding: 0 24rpx;
  margin: 8rpx 16rpx 8rpx 0;
  border-radius: 999rpx;
  background-color: var(--c-bg);
  border: 2rpx solid transparent;
}

.pill.on {
  border-color: var(--c-primary);
}

.dot {
  width: 14rpx;
  height: 14rpx;
  border-radius: 50%;
  margin-right: 10rpx;
}

.name {
  font-size: 26rpx;
  color: var(--c-text-2);
}

.pill.on .name {
  color: var(--c-text);
  font-weight: 600;
}
</style>
