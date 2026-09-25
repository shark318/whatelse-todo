<template>
  <view class="topbar" :style="topStyle">
    <!-- 正常态：图标 + 标题（文案 C1）+ 搜索 + 设置 -->
    <view v-if="!searching" class="row">
      <view class="brand">
        <image class="logo" src="/static/logo.png" mode="aspectFit" />
        <text class="title">还有什么</text>
        <view v-if="pendingCount > 0" class="badge">{{ pendingCount }}</view>
      </view>
      <view class="actions">
        <view class="icon-btn" @click="openSearch">
          <view class="glass"></view>
        </view>
        <text class="settings-btn" @click="onSettings">设置</text>
      </view>
    </view>

    <!-- 搜索态：输入框 + 取消 -->
    <view v-else class="row">
      <input
        class="search-input"
        type="text"
        :value="modelValue"
        placeholder="搜索"
        placeholder-class="search-ph"
        confirm-type="search"
        :focus="true"
        :maxlength="50"
        @input="onInput"
      />
      <text class="cancel" @click="closeSearch">取消</text>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  modelValue: { type: String, default: '' },
  pendingCount: { type: Number, default: 0 }
})
const emit = defineEmits(['update:modelValue', 'settings'])

const searching = ref(false)

// 首页用了自定义导航栏，需要自己让开刘海
let statusBarHeight = 0
try {
  const info = uni.getSystemInfoSync()
  statusBarHeight = info.statusBarHeight || 0
} catch (e) {
  statusBarHeight = 0
}
const topStyle = 'padding-top:' + statusBarHeight + 'px'

function openSearch() {
  searching.value = true
}

function onSettings() {
  emit('settings')
}

function closeSearch() {
  searching.value = false
  emit('update:modelValue', '')
}

function onInput(e) {
  emit('update:modelValue', e.detail.value)
}
</script>

<style scoped>
.topbar {
  background-color: var(--c-bg);
}

.row {
  height: 96rpx;
  padding: 0 32rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.brand {
  display: flex;
  align-items: center;
  min-width: 0;
}

/* 左上角 App 图标 */
.logo {
  width: 64rpx;
  height: 64rpx;
  margin-right: 16rpx;
  border-radius: 20rpx;
  flex-shrink: 0;
}

/* C1：首页标题 */
.title {
  font-size: 42rpx;
  font-weight: 700;
  color: var(--c-text);
}

/* 未完成计数：糖果胶囊，常驻在标题旁 */
.badge {
  min-width: 40rpx;
  height: 40rpx;
  margin-left: 16rpx;
  padding: 0 14rpx;
  border-radius: 999rpx;
  background-image: linear-gradient(135deg, var(--c-primary) 0%, var(--c-primary-2) 100%);
  box-shadow: 0 4rpx 12rpx var(--c-shadow);
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  font-size: 22rpx;
  font-weight: 700;
  color: #FFFFFF;
}

.actions {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.icon-btn {
  width: 64rpx;
  height: 64rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 用 CSS 画的放大镜，避免依赖图标字体或图片 */
.glass {
  width: 28rpx;
  height: 28rpx;
  border: 4rpx solid var(--c-text-2);
  border-radius: 50%;
  position: relative;
}

.glass::after {
  content: '';
  position: absolute;
  right: -12rpx;
  bottom: -6rpx;
  width: 16rpx;
  height: 4rpx;
  border-radius: 2rpx;
  background-color: var(--c-text-2);
  transform: rotate(45deg);
}

.settings-btn {
  margin-left: 12rpx;
  padding: 12rpx 0;
  font-size: 28rpx;
  font-weight: 600;
  color: var(--c-primary);
}

.search-input {
  flex: 1;
  height: 72rpx;
  padding: 0 28rpx;
  background-color: var(--c-surface);
  border-radius: 999rpx;
  box-shadow: 0 4rpx 14rpx var(--c-shadow);
  font-size: 28rpx;
  color: var(--c-text);
}

.search-ph {
  color: var(--c-text-2);
}

.cancel {
  margin-left: 24rpx;
  font-size: 28rpx;
  font-weight: 500;
  color: var(--c-primary);
}
</style>
