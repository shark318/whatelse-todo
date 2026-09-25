<template>
  <view class="nav" :style="topStyle">
    <view class="row">
      <view class="side" @click="onBack">
        <view class="back-arrow"></view>
      </view>
      <text class="title">{{ title }}</text>
      <view class="side right" @click="onSave">
        <text v-if="showSave" class="save">{{ saveText }}</text>
      </view>
    </view>
  </view>
</template>

<script setup>
/**
 * 自定义导航栏：左返回、中标题、右保存。
 * 设置页这类只需要返回和标题的页面，把 showSave 传 false 即可。
 */
const props = defineProps({
  title: { type: String, default: '' },
  saveText: { type: String, default: '保存' },
  showSave: { type: Boolean, default: true }
})
const emit = defineEmits(['back', 'save'])

let statusBarHeight = 0
try {
  const info = uni.getSystemInfoSync()
  statusBarHeight = info.statusBarHeight || 0
} catch (e) {
  statusBarHeight = 0
}
const topStyle = 'padding-top:' + statusBarHeight + 'px'

function onBack() {
  emit('back')
}

function onSave() {
  if (props.showSave) emit('save')
}
</script>

<style scoped>
.nav {
  background-color: var(--c-bg);
}

.row {
  height: 96rpx;
  padding: 0 32rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.side {
  width: 120rpx;
  height: 96rpx;
  display: flex;
  align-items: center;
}

.side.right {
  justify-content: flex-end;
}

/* CSS 画的返回箭头 */
.back-arrow {
  width: 22rpx;
  height: 22rpx;
  margin-left: 6rpx;
  border-left: 4rpx solid var(--c-text);
  border-bottom: 4rpx solid var(--c-text);
  transform: rotate(45deg);
}

.title {
  flex: 1;
  text-align: center;
  font-size: 34rpx;
  font-weight: 600;
  color: var(--c-text);
}

.save {
  font-size: 30rpx;
  font-weight: 600;
  color: var(--c-primary);
  padding: 12rpx 0;
}
</style>
