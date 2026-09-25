<template>
  <view class="picker">
    <view class="grid">
      <!-- 已选图片的缩略图 -->
      <view v-for="(p, i) in images" :key="p" class="cell">
        <image class="thumb" :src="p" mode="aspectFill" @click="onPreview(i)" />
        <view class="del" @click.stop="onRemove(i)">
          <text class="del-x">✕</text>
        </view>
      </view>

      <!-- 添加入口 -->
      <view v-if="images.length < max" class="cell add" @click="onAdd">
        <view class="plus-h"></view>
        <view class="plus-v"></view>
      </view>
    </view>

    <text class="tip">{{ tipText }}</text>
  </view>
</template>

<script setup>
import { computed } from 'vue'
import { previewImages } from '@/common/imageService.js'

/**
 * 图片选择网格（可选功能）。
 * 图片已经由父页面转存到私有目录，这里只负责展示与交互。
 */
const props = defineProps({
  images: { type: Array, default: function () { return [] } },
  max: { type: Number, default: 9 }
})
const emit = defineEmits(['add', 'remove'])

const tipText = computed(function () {
  if (!props.images.length) return '可以配张图，也可以不配'
  return props.images.length + ' / ' + props.max + ' 张'
})

function onPreview(index) {
  previewImages(props.images, props.images[index])
}

function onRemove(index) {
  emit('remove', index)
}

function onAdd() {
  if (props.images.length >= props.max) {
    uni.showToast({ title: '最多 ' + props.max + ' 张', icon: 'none' })
    return
  }
  emit('add')
}
</script>

<style scoped>
.grid {
  display: flex;
  flex-wrap: wrap;
  margin-top: 8rpx;
}

.cell {
  position: relative;
  width: 180rpx;
  height: 180rpx;
  margin: 0 14rpx 14rpx 0;
  border-radius: 20rpx;
  overflow: hidden;
}

.thumb {
  width: 100%;
  height: 100%;
  background-color: var(--c-line);
}

/* 右上角删除角标 */
.del {
  position: absolute;
  right: 0;
  top: 0;
  width: 44rpx;
  height: 44rpx;
  border-bottom-left-radius: 20rpx;
  background-color: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
}

.del-x {
  font-size: 22rpx;
  color: #FFFFFF;
}

/* 添加入口：虚线框 + 粉色加号 */
.add {
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3rpx dashed var(--c-line);
  background-color: var(--c-bg);
  box-sizing: border-box;
}

.plus-h {
  position: absolute;
  width: 40rpx;
  height: 5rpx;
  border-radius: 3rpx;
  background-color: var(--c-primary);
}

.plus-v {
  position: absolute;
  width: 5rpx;
  height: 40rpx;
  border-radius: 3rpx;
  background-color: var(--c-primary);
}

.tip {
  display: block;
  margin-top: 4rpx;
  font-size: 22rpx;
  color: var(--c-text-2);
}
</style>
