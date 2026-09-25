<template>
  <scroll-view class="filter" scroll-x :show-scrollbar="false">
    <view class="row">
      <view
        v-for="item in items"
        :key="item.id"
        class="tab"
        :class="{ on: item.id === current }"
        @click="onPick(item.id)"
      >
        <text class="name">{{ item.name }}</text>
      </view>
    </view>
  </scroll-view>
</template>

<script setup>
/**
 * 分类筛选栏：横向滚动，选中项加粗 + 主色下划线。
 * items 由父页面组装成 [{ id: 'all', name: '全部' }, ...分类]。
 */
const props = defineProps({
  items: { type: Array, default: function () { return [] } },
  current: { type: String, default: 'all' }
})
const emit = defineEmits(['change'])

function onPick(id) {
  if (id === props.current) return
  emit('change', id)
}
</script>

<style scoped>
.filter {
  width: 100%;
  white-space: nowrap;
  background-color: var(--c-bg);
}

.row {
  display: inline-flex;
  align-items: center;
  padding: 0 24rpx 12rpx;
}

/* 糖果胶囊：选中项是渐变底 + 白字，比下划线更有分量也更可爱 */
.tab {
  margin-right: 16rpx;
  padding: 12rpx 30rpx;
  border-radius: 999rpx;
  background-color: var(--c-surface);
  transition: background-image 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
}

.tab.on {
  background-image: linear-gradient(135deg, var(--c-primary) 0%, var(--c-primary-2) 100%);
  box-shadow: 0 4rpx 14rpx var(--c-shadow);
  transform: translateY(-2rpx);
}

.name {
  font-size: 28rpx;
  color: var(--c-text-2);
}

.tab.on .name {
  color: #FFFFFF;
  font-weight: 600;
}
</style>
