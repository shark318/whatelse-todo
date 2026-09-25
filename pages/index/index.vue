<template>
  <view class="page" :class="themeCls">
    <!-- ① 标题栏（C1 + 搜索 + 设置） -->
    <TopBar v-model="keyword" :pending-count="remainingCount" @settings="onSettings" />

    <!-- ② 快速输入框（C2） -->
    <QuickAdd v-model="draft" @submit="onQuickAdd" />

    <!-- ③ 分类筛选栏 -->
    <CategoryFilter :items="filterItems" :current="filterId" @change="onFilterChange" />

    <!-- ④ 列表 / 空状态 -->
    <view class="content">
      <EmptyState
        v-if="isEmptyAll"
        art="🌱"
        title="没有别的了"
        hint="点右下角的 ＋ 记一件吧 ✨"
      />
      <EmptyState
        v-else-if="isEmptyFiltered"
        :art="keyword ? '🔍' : '🤔'"
        :title="emptyFilteredTitle"
        hint=""
      />
      <TaskList
        v-else
        :active="grouped.active"
        :completed="grouped.completed"
        :collapsed="collapsed"
        :categories="categories"
        @toggle="onToggle"
        @edit="onEdit"
        @remove="onRemove"
        @toggle-group="onToggleGroup"
      />
    </view>

    <!-- ⑤ 删除后的撤销条 -->
    <view v-if="undoVisible" class="undo-bar">
      <text class="undo-text">已删除</text>
      <text class="undo-btn" @click="onUndo">撤销</text>
    </view>

    <!-- ⑥ 悬浮新增按钮 -->
    <FabButton @click="onFab" />
  </view>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { onShow, onUnload } from '@dcloudio/uni-app'

import TopBar from '@/components/TopBar.vue'
import QuickAdd from '@/components/QuickAdd.vue'
import CategoryFilter from '@/components/CategoryFilter.vue'
import TaskList from '@/components/TaskList.vue'
import EmptyState from '@/components/EmptyState.vue'
import FabButton from '@/components/FabButton.vue'

import { useTheme } from '@/common/theme.js'
import { listCategories } from '@/common/categoryService.js'
import {
  createTask,
  queryTasks,
  toggleDone,
  removeTask,
  restoreTask,
  groupTasks
} from '@/common/taskService.js'
import { getSettings, updateSettings } from '@/common/settingsService.js'
import { scheduleTask, cancelTask } from '@/common/notify.js'
import { removeImages } from '@/common/imageService.js'

const { themeCls, applyTheme } = useTheme()

/* ---------- 状态 ---------- */
const keyword = ref('')
const draft = ref('')
const filterId = ref('all')
const categories = ref([])
const collapsed = ref(true)
const tasks = ref([])
const totalCount = ref(0)
const remainingCount = ref(0)

const undoVisible = ref(false)
let pendingUndo = null
let undoTimer = null

/* ---------- 派生 ---------- */
const filterItems = computed(function () {
  return [{ id: 'all', name: '全部' }].concat(categories.value)
})

const grouped = computed(function () {
  return groupTasks(tasks.value)
})

/** 真的一条任务都没有 */
const isEmptyAll = computed(function () {
  return totalCount.value === 0
})

/** 有任务，但当前筛选/搜索下没有 */
const isEmptyFiltered = computed(function () {
  return !isEmptyAll.value && tasks.value.length === 0
})

const emptyFilteredTitle = computed(function () {
  return keyword.value ? '没找到相关的' : '这个分类下暂时没有'
})

/* ---------- 数据刷新 ---------- */
function refresh() {
  const s = getSettings()
  categories.value = listCategories()

  // 当前筛选的分类可能已经不存在了（在设置页被删掉，或刚导入了一份别的备份），
  // 这时如果不回落，列表会一直空着且用户不知道原因。
  let fid = s.filterCategoryId || 'all'
  if (fid !== 'all' && !categories.value.some(function (c) { return c.id === fid })) {
    fid = 'all'
    updateSettings({ filterCategoryId: 'all' })
  }
  filterId.value = fid
  collapsed.value = s.completedCollapsed !== false

  tasks.value = queryTasks({
    keyword: keyword.value,
    categoryId: fid,
    status: 'all',
    sortBy: s.sortBy
  })

  // 全部任务数用来判断"是不是真的全空"，未完成数给标题栏的计数徽标用
  const all = queryTasks({ status: 'all' })
  totalCount.value = all.length
  let rem = 0
  all.forEach(function (t) { if (!t.done) rem++ })
  remainingCount.value = rem
}

onShow(function () {
  applyTheme()
  refresh()
})

// 离开页面时把撤销定时器清掉，避免它对着已销毁的页面执行
onUnload(function () {
  if (undoTimer) clearTimeout(undoTimer)
})

watch(keyword, function () {
  refresh()
})

/* ---------- 新建 ---------- */
function onQuickAdd(text) {
  const target = filterId.value === 'all' ? 'default' : filterId.value
  const task = createTask({ title: text, categoryId: target })
  if (!task) {
    uni.showToast({ title: '内容不能为空', icon: 'none' })
    return
  }
  draft.value = ''
  refresh()
}

/* ---------- 勾选完成 ---------- */
function onToggle(task) {
  const r = toggleDone(task.id)
  if (!r) return

  // 轻微震动：勾选是最高频的动作，给一点实感；失败也不影响流程
  if (typeof uni.vibrateShort === 'function') {
    try {
      uni.vibrateShort({ fail: function () {} })
    } catch (e) {
      // 忽略
    }
  }

  if (r.task.done) {
    cancelTask(task.id)
  } else {
    scheduleTask(r.task)
  }
  refresh()

  uni.showToast({
    title: r.remaining === 0 ? '没有别的了' : '还剩 ' + r.remaining + ' 件',
    icon: 'none',
    duration: 1500
  })
}

/* ---------- 删除与撤销 ---------- */
function onRemove(task) {
  const removed = removeTask(task.id)
  if (!removed) return

  cancelTask(task.id)
  refresh()

  pendingUndo = removed
  undoVisible.value = true
  if (undoTimer) clearTimeout(undoTimer)
  undoTimer = setTimeout(function () {
    // 撤销窗口过了才真删图片文件：这 5 秒里用户还能把任务救回来
    if (pendingUndo && pendingUndo.images && pendingUndo.images.length) {
      removeImages(pendingUndo.images)
    }
    undoVisible.value = false
    pendingUndo = null
  }, 5000)
}

function onUndo() {
  if (pendingUndo) {
    restoreTask(pendingUndo)
    scheduleTask(pendingUndo)
    pendingUndo = null
  }
  undoVisible.value = false
  if (undoTimer) clearTimeout(undoTimer)
  refresh()
}

/* ---------- 其他交互 ---------- */
function onEdit(task) {
  uni.navigateTo({ url: '/pages/task/edit?id=' + task.id })
}

function onFab() {
  uni.navigateTo({ url: '/pages/task/edit' })
}

function onSettings() {
  uni.navigateTo({ url: '/pages/settings/settings' })
}

function onToggleGroup() {
  collapsed.value = !collapsed.value
  updateSettings({ completedCollapsed: collapsed.value })
}

function onFilterChange(id) {
  filterId.value = id
  updateSettings({ filterCategoryId: id })
  refresh()
}
</script>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: var(--c-bg);
}

.content {
  flex: 1;
  padding-bottom: 220rpx;   /* 给悬浮按钮留出空间 */
}

/* 删除后的撤销条 */
.undo-bar {
  position: fixed;
  left: 32rpx;
  right: 32rpx;
  bottom: 200rpx;
  height: 88rpx;
  padding: 0 32rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #33383F;
  border-radius: 16rpx;
  z-index: 30;
}

.undo-text {
  font-size: 28rpx;
  color: #FFFFFF;
}

.undo-btn {
  font-size: 28rpx;
  font-weight: 600;
  color: #6E9BFF;
}
</style>
