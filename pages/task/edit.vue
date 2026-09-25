<template>
  <view class="page" :class="themeCls">
    <NavBar :title="pageTitle" @back="onBack" @save="onSave" />

    <scroll-view class="body" scroll-y>
      <FieldText
        v-model="form.title"
        label="内容"
        placeholder="还有什么要做的？"
        :maxlength="200"
        :auto-focus="!isEdit"
      />

      <FieldText
        v-model="form.note"
        label="备注"
        placeholder="补充说明（可留空）"
        :maxlength="500"
      />

      <view class="card">
        <text class="sec-label">分类</text>
        <CategoryPicker
          :categories="categories"
          :current="form.categoryId"
          @change="onCategoryChange"
        />
      </view>

      <view class="card">
        <text class="sec-label">图片（可选）</text>
        <ImagePicker
          :images="form.images"
          :max="maxImages"
          @add="onAddImages"
          @remove="onRemoveImage"
        />
      </view>

      <view class="card">
        <text class="sec-label">时间</text>
        <DateTimeRow v-model="form.remindAt" label="提醒时间" />
        <DateTimeRow v-model="form.dueAt" label="截止时间" />
        <text class="hint">提醒时间不能晚于截止时间，也不能早于现在；两个都可以不设。</text>
      </view>

      <!-- 删除放在页底，避免和「保存」挤在导航栏里误触 -->
      <view v-if="isEdit" class="danger-zone">
        <view class="danger-btn" @click="onDelete">删除这条任务</view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { onLoad, onShow, onBackPress } from '@dcloudio/uni-app'

import NavBar from '@/components/NavBar.vue'
import FieldText from '@/components/FieldText.vue'
import CategoryPicker from '@/components/CategoryPicker.vue'
import DateTimeRow from '@/components/DateTimeRow.vue'
import ImagePicker from '@/components/ImagePicker.vue'

import { useTheme } from '@/common/theme.js'
import { formatRemind } from '@/common/date.js'
import { listCategories } from '@/common/categoryService.js'
import { createTask, updateTask, removeTask, getTaskById } from '@/common/taskService.js'
import { scheduleTask, cancelTask } from '@/common/notify.js'
import { addImages, removeImages } from '@/common/imageService.js'
import { MAX_IMAGES } from '@/common/keys.js'

const { themeCls, applyTheme } = useTheme()

const taskId = ref('')
const categories = ref([])
const isEdit = computed(function () { return !!taskId.value })
const pageTitle = computed(function () { return isEdit.value ? '编辑任务' : '新增任务' })

const maxImages = MAX_IMAGES

/** 进页面时任务已有的图片：保存时用它对比出「被移除的那几张」，只删真正冗余的文件 */
let originalImages = []

const form = reactive({
  title: '',
  note: '',
  images: [],
  categoryId: 'default',
  remindAt: null,
  dueAt: null
})

/** 进页面时的表单快照，用来判断「用户到底改没改」 */
let snapshot = ''

function currentSnapshot() {
  return JSON.stringify({
    t: form.title,
    n: form.note,
    i: form.images,
    c: form.categoryId,
    r: form.remindAt,
    d: form.dueAt
  })
}

function isDirty() {
  return currentSnapshot() !== snapshot
}

// 选到过去的时间时立刻提醒一句（保存时还会再硬拦一次）
watch(function () { return form.remindAt }, function (v) {
  if (v && v <= Date.now()) {
    uni.showToast({ title: '这个时间已经过去了', icon: 'none' })
  }
})

onShow(function () {
  applyTheme()
})

onLoad(function (options) {
  categories.value = listCategories()
  taskId.value = (options && options.id) ? options.id : ''

  if (taskId.value) {
    const t = getTaskById(taskId.value)
    if (!t) {
      // 先把快照对齐，否则自动返回的这 800 毫秒里点返回会误弹「放弃修改？」
      snapshot = currentSnapshot()
      uni.showToast({ title: '这条任务已经不在了', icon: 'none' })
      setTimeout(function () { uni.navigateBack() }, 800)
      return
    }
    form.title = t.title
    form.note = t.note || ''
    form.images = (t.images || []).slice()
    form.categoryId = t.categoryId || 'default'
    form.remindAt = t.remindAt || null
    form.dueAt = t.dueAt || null
  }

  originalImages = form.images.slice()
  snapshot = currentSnapshot()
})

/** 真正落盘。成功返回 true */
function save() {
  const title = String(form.title || '').trim()
  if (!title) {
    uni.showToast({ title: '内容不能为空', icon: 'none' })
    return false
  }

  // 提醒时间不能是过去——过期了就不会响，设了也没意义
  if (form.remindAt && form.remindAt <= Date.now()) {
    uni.showModal({
      title: '提醒时间已经过去了',
      content: '提醒时间（' + formatRemind(form.remindAt) + '）早于现在。\n\n'
        + '过期的提醒不会响。请把它改到将来，或者点右侧的 ✕ 清空。',
      showCancel: false
    })
    return false
  }

  // 提醒时间不能晚于截止时间，否则等于「到期之后才提醒」
  if (form.remindAt && form.dueAt && form.remindAt > form.dueAt) {
    uni.showModal({
      title: '时间设置有问题',
      content: '提醒时间（' + formatRemind(form.remindAt) + '）'
        + '晚于截止时间（' + formatRemind(form.dueAt) + '）。\n\n'
        + '到期之后才提醒没有意义，请把提醒时间提前，或把截止时间推后。',
      showCancel: false
    })
    return false
  }

  const payload = {
    title: title,
    note: form.note,
    images: form.images,
    categoryId: form.categoryId,
    remindAt: form.remindAt,
    dueAt: form.dueAt
  }

  const saved = isEdit.value
    ? updateTask(taskId.value, payload)
    : createTask(payload)

  if (!saved) {
    uni.showToast({ title: '保存失败', icon: 'none' })
    return false
  }

  // 保存成功后才真删被移除的图片文件。
  // 若提前删，用户「移除图片 → 不保存就返回」时原图就白丢了。
  const removed = originalImages.filter(function (p) {
    return form.images.indexOf(p) < 0
  })
  if (removed.length) removeImages(removed)
  originalImages = form.images.slice()

  scheduleTask(saved)              // 时间可能改过，重排提醒
  snapshot = currentSnapshot()     // 保存后不再算「改过」
  return true
}

/** 点「保存」 */
function onSave() {
  if (!save()) return
  uni.showToast({ title: '已保存', icon: 'none', duration: 900 })
  setTimeout(function () { uni.navigateBack() }, 350)
}

/** 点返回：没改过直接走，改过就问一句 */
function onBack() {
  if (!isDirty()) {
    uni.navigateBack()
    return
  }
  askDiscard()
}

function askDiscard() {
  uni.showModal({
    title: '放弃修改？',
    content: '这次改动还没有保存，返回就丢掉了。',
    cancelText: '继续编辑',
    confirmText: '放弃',
    confirmColor: '#FF5A5F',
    success: function (res) {
      if (res.confirm) uni.navigateBack()
    }
  })
}

/** 物理返回键 / 手势返回走同一套逻辑 */
onBackPress(function () {
  if (!isDirty()) return false     // 放行默认返回
  askDiscard()
  return true                      // 拦下，等用户选
})

function onDelete() {
  uni.showModal({
    title: '删除这条任务？',
    content: '删除后无法恢复。',
    confirmText: '删除',
    confirmColor: '#FF5A5F',
    success: function (res) {
      if (!res.confirm) return
      // 编辑页删除没有撤销条，图片直接清掉
      if (form.images.length) removeImages(form.images)
      removeTask(taskId.value)
      cancelTask(taskId.value)
      uni.navigateBack()
    }
  })
}

function onCategoryChange(id) {
  form.categoryId = id
}

/* ---------- 图片（可选） ---------- */

function onAddImages() {
  const remain = maxImages - form.images.length
  if (remain <= 0) {
    uni.showToast({ title: '最多 ' + maxImages + ' 张', icon: 'none' })
    return
  }
  addImages(remain).then(function (paths) {
    if (!paths.length) return
    form.images = form.images.concat(paths)
  })
}

/** 只从表单里拿掉；文件等保存成功后才真删（避免放弃保存时丢图） */
function onRemoveImage(index) {
  const next = form.images.slice()
  next.splice(index, 1)
  form.images = next
}
</script>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: var(--c-bg);
}

.body {
  flex: 1;
}

.card {
  margin: 20rpx 24rpx 0;
  padding: 26rpx 30rpx;
  background-color: var(--c-surface);
  border-radius: 28rpx;
  box-shadow: 0 6rpx 20rpx var(--c-shadow);
}

.sec-label {
  display: block;
  margin-bottom: 12rpx;
  font-size: 24rpx;
  color: var(--c-text-2);
}

.hint {
  display: block;
  margin-top: 16rpx;
  font-size: 22rpx;
  color: var(--c-text-2);
}

/* 删除区：只在编辑模式下出现，与正文拉开距离避免误触 */
.danger-zone {
  margin: 40rpx 32rpx 60rpx;
}

.danger-btn {
  height: 96rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30rpx;
  font-weight: 600;
  color: var(--c-danger);
  background-color: var(--c-surface);
  border-radius: 28rpx;
  box-shadow: 0 6rpx 20rpx var(--c-shadow);
}
</style>
