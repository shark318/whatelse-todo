<template>
  <view class="task-row">
    <!-- 右滑露出的「完成」层 -->
    <view class="done-layer">
      <view class="done-btn" @click="onComplete">
        <text class="done-text">{{ task.done ? '取消' : '完成' }}</text>
      </view>
    </view>

    <!-- 左滑露出的「删除」层 -->
    <view class="delete-layer">
      <view class="delete-btn" @click="onDelete">
        <text class="delete-text">删除</text>
      </view>
    </view>

    <!-- 可左右滑动的内容层 -->
    <view
      class="content"
      :style="contentStyle"
      @touchstart.stop="onTouchStart"
      @touchmove.stop="onTouchMove"
      @touchend.stop="onTouchEnd"
      @click="onTap"
    >
      <!-- 勾选圆圈（热区 88rpx） -->
      <view class="check-wrap" @click.stop="onToggle">
        <view class="check" :class="{ done: task.done, overdue: overdue }">
          <view v-if="task.done" class="tick"></view>
        </view>
      </view>

      <!-- 正文 -->
      <view class="body">
        <text class="title ellipsis" :class="{ done: task.done }">{{ task.title }}</text>
        <view v-if="hasMeta" class="meta">
          <view
            v-if="category && category.color"
            class="dot"
            :style="{ backgroundColor: category.color }"
          ></view>
          <text
            v-if="remindText"
            class="meta-text"
            :class="{ 'meta-warn': overdue && !task.done }"
          >{{ remindText }}</text>
          <text v-if="dueText" class="meta-text">{{ dueText }}</text>
          <text v-if="imageText" class="meta-text">{{ imageText }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { formatRemind, isOverdue } from '@/common/date.js'

/**
 * 单行任务。
 *
 * 手势：右滑过半 = 完成（或取消完成），左滑 = 露出删除按钮。
 * 之所以两个方向都做，是因为「完成」是待办里最高频的动作，
 * 让它在最顺手的方向上一步到位，比"点进详情再勾"快得多。
 *
 * 实现要点：
 *   · 先判方向——纵向手势直接放行给页面滚动，避免滑列表时误触发
 *   · 模块级 openRow 记录当前划开的是哪一行，保证同时只有一行展开
 *   · 划开状态下点内容先收回，不误触编辑/勾选
 */

const props = defineProps({
  task: { type: Object, required: true },
  category: { type: Object, default: null }
})
const emit = defineEmits(['toggle', 'edit', 'remove'])

/** 模块级共享：所有 TaskItem 实例共用，记住当前打开的行 */
const openRow = { id: '' }

const OPEN_WIDTH = uni.upx2px(140)      // 单侧滑出的宽度
const DIR_THRESHOLD = 6                 // 判定方向的最小位移（px）

const dragging = ref(false)
const offset = ref(0)
let startX = 0
let startY = 0
let startOffset = 0
let axis = null                         // null 未定 | 'h' 横向 | 'v' 纵向

const contentStyle = computed(function () {
  const base = 'transform: translateX(' + offset.value + 'px);'
  return dragging.value ? base : base + ' transition: transform 0.2s ease;'
})

/* ---------- 手势 ---------- */

function onTouchStart(e) {
  if (!e.touches || !e.touches.length) return

  // 有别的行开着，先把它收回去
  if (openRow.id && openRow.id !== props.task.id) {
    offset.value = 0
    openRow.id = ''
  }

  startX = e.touches[0].clientX
  startY = e.touches[0].clientY
  startOffset = offset.value
  axis = null
}

function onTouchMove(e) {
  if (!e.touches || !e.touches.length) return

  const dx = e.touches[0].clientX - startX
  const dy = e.touches[0].clientY - startY

  if (axis === null) {
    if (Math.abs(dx) < DIR_THRESHOLD && Math.abs(dy) < DIR_THRESHOLD) return
    axis = Math.abs(dx) > Math.abs(dy) ? 'h' : 'v'
  }
  if (axis === 'v') return                // 纵向手势交给页面滚动

  dragging.value = true
  let next = startOffset + dx
  if (next > OPEN_WIDTH) next = OPEN_WIDTH
  if (next < -OPEN_WIDTH) next = -OPEN_WIDTH
  offset.value = next
}

function onTouchEnd() {
  if (axis === 'h') {
    if (offset.value > OPEN_WIDTH / 2) {
      // 右滑过半：直接算完成，不用再点一下
      offset.value = 0
      openRow.id = ''
      emit('toggle', props.task)
    } else if (offset.value < -OPEN_WIDTH / 2) {
      offset.value = -OPEN_WIDTH
      openRow.id = props.task.id
    } else {
      offset.value = 0
      openRow.id = ''
    }
  }
  dragging.value = false
  axis = null
}

/* ---------- 点击 ---------- */

function collapse() {
  offset.value = 0
  openRow.id = ''
}

function onTap() {
  if (offset.value !== 0) {
    collapse()
    return
  }
  emit('edit', props.task)
}

function onToggle() {
  if (offset.value !== 0) {
    collapse()
    return
  }
  emit('toggle', props.task)
}

function onComplete() {
  collapse()
  emit('toggle', props.task)
}

function onDelete() {
  collapse()
  emit('remove', props.task)
}

/* ---------- 展示 ---------- */

const overdue = computed(function () {
  return !props.task.done && !!props.task.remindAt && isOverdue(props.task.remindAt)
})

const remindText = computed(function () {
  return props.task.remindAt ? formatRemind(props.task.remindAt) : ''
})

const dueText = computed(function () {
  return props.task.dueAt ? '截止 ' + formatRemind(props.task.dueAt) : ''
})

/** 列表里只提示有几张图，不铺开缩略图——任务行要保持轻快 */
const imageText = computed(function () {
  const n = (props.task.images || []).length
  return n ? '🖼️ ' + n : ''
})

const hasMeta = computed(function () {
  return !!(props.category || remindText.value || dueText.value || imageText.value)
})
</script>

<style scoped>
/* 卡片式任务行：大圆角 + 行间空隙，左右滑出的层平时被内容层盖住 */
.task-row {
  position: relative;
  overflow: hidden;
  margin: 0 24rpx 14rpx;
  border-radius: 28rpx;
  background-color: var(--c-bg);
}

/* 左侧：右滑露出，绿色（完成） */
.done-layer {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 140rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--c-success);
}

/* 右侧：左滑露出，红色（删除） */
.delete-layer {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 140rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--c-danger);
}

.done-btn,
.delete-btn {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.done-text,
.delete-text {
  font-size: 28rpx;
  font-weight: 500;
  color: #FFFFFF;
}

/* 内容层 */
.content {
  position: relative;
  display: flex;
  align-items: center;
  min-height: 108rpx;
  padding: 18rpx 28rpx;
  background-color: var(--c-surface);
  border-radius: 28rpx;
  box-sizing: border-box;
}

.check-wrap {
  width: 88rpx;
  height: 88rpx;
  margin-left: -28rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.check {
  width: 44rpx;
  height: 44rpx;
  border: 4rpx solid var(--c-primary);
  border-radius: 50%;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  /* 回弹曲线（overshoot）：勾上时轻轻「啵」一下 */
  transition: background-color 0.25s ease, border-color 0.25s ease,
              transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* 已过期未完成：圆圈转警示色 */
.check.overdue {
  border-color: var(--c-warn);
}

.check.done {
  background-color: var(--c-success);
  border-color: var(--c-success);
  transform: scale(1.12);
}

.tick {
  width: 20rpx;
  height: 11rpx;
  margin-top: -5rpx;
  border-left: 4rpx solid #FFFFFF;
  border-bottom: 4rpx solid #FFFFFF;
  transform: rotate(-45deg);
}

.body {
  flex: 1;
  min-width: 0;
  padding-left: 8rpx;
}

.title {
  display: block;
  font-size: 32rpx;
  color: var(--c-text);
  line-height: 1.4;
  transition: color 0.2s ease;
}

.title.done {
  color: var(--c-text-2);
  text-decoration: line-through;
}

.meta {
  margin-top: 6rpx;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}

.dot {
  width: 12rpx;
  height: 12rpx;
  border-radius: 50%;
  margin-right: 10rpx;
}

.meta-text {
  font-size: 24rpx;
  color: var(--c-text-2);
  margin-right: 16rpx;
}

.meta-warn {
  color: var(--c-warn);
}
</style>
