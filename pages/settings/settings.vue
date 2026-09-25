<template>
  <view class="page" :class="themeCls">
    <NavBar title="设置" :show-save="false" @back="onBack" />

    <!-- 通知权限提示条（F7.2） -->
    <PermissionBanner v-if="showPermBanner" @click="onOpenPermission" />

    <!-- 外观 -->
    <view class="section">
      <text class="sec-title">🎨 外观</text>
      <SettingRow label="主题" :value="themeText" @click="onPickTheme" />
    </view>

    <!-- 列表 -->
    <view class="section">
      <text class="sec-title">📋 列表</text>
      <SettingRow label="排序方式" :value="sortText" @click="onPickSort" />
    </view>

    <!-- 分类管理 -->
    <view class="section">
      <text class="sec-title">🏷️ 分类</text>
      <SettingRow label="分类管理" :value="categories.length + ' 个'" @click="openCatEditor" />
    </view>

    <!-- 数据备份 -->
    <view class="section">
      <text class="sec-title">💾 数据</text>
      <SettingRow label="导出数据" value="复制到剪贴板" @click="onExport" />
      <SettingRow label="导入数据" value="从剪贴板恢复" @click="onImport" />
    </view>

    <!-- 关于 -->
    <view class="about">
      <text class="about-name">还有什么</text>
      <text class="about-ver">v1.0.0</text>
      <text class="about-desc">一个只问你「还有什么要做」的本地待办清单</text>
      <text class="about-note">所有数据仅保存在本机，不会上传到任何地方</text>
    </view>

    <!-- 分类管理弹层 -->
    <view v-if="catEditorVisible" class="mask" @click="closeCatEditor">
      <view class="sheet" @click.stop>
        <view class="sheet-head">
          <text class="sheet-title">分类管理</text>
          <text class="sheet-done" @click="closeCatEditor">完成</text>
        </view>

        <scroll-view class="sheet-body" scroll-y>
          <view v-for="c in categories" :key="c.id" class="cat-row">
            <view class="cat-dot" :style="{ backgroundColor: c.color }" @click="onCycleColor(c)"></view>
            <text class="cat-name" @click="onRename(c)">{{ c.name }}</text>
            <text v-if="c.id !== 'default'" class="cat-del" @click="onDeleteCat(c)">删除</text>
            <text v-else class="cat-lock">不可删</text>
          </view>
          <view class="cat-add" @click="onAddCat">+ 新增分类</view>
          <view class="sheet-tip">点圆点换颜色，点名字改名。</view>
        </scroll-view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { onShow } from '@dcloudio/uni-app'

import NavBar from '@/components/NavBar.vue'
import SettingRow from '@/components/SettingRow.vue'
import PermissionBanner from '@/components/PermissionBanner.vue'

import { useTheme } from '@/common/theme.js'
import { getSettings, updateSettings, themeLabel, sortLabel } from '@/common/settingsService.js'
import {
  listCategories,
  createCategory,
  updateCategory,
  removeCategory,
  countTasksIn
} from '@/common/categoryService.js'
import { exportToText, parseImportText, applyImport, dataSummary } from '@/common/exportService.js'
import { CATEGORY_COLORS } from '@/common/keys.js'

const { themeCls, applyTheme } = useTheme()

const categories = ref([])
const theme = ref('system')
const sortBy = ref('created')
const dismissed = ref(false)
const catEditorVisible = ref(false)

const themeText = computed(function () { return themeLabel(theme.value) })
const sortText = computed(function () { return sortLabel(sortBy.value) })
const showPermBanner = computed(function () { return !dismissed.value })

function reload() {
  const s = getSettings()
  theme.value = s.theme
  sortBy.value = s.sortBy
  dismissed.value = s.notifyGuideDismissed === true
  categories.value = listCategories()
}

onShow(function () {
  applyTheme()
  reload()
})

function onBack() {
  uni.navigateBack()
}

/* ---------- 外观 / 排序 ---------- */

function onPickTheme() {
  uni.showActionSheet({
    itemList: ['跟随系统', '浅色', '深色'],
    success: function (res) {
      const map = ['system', 'light', 'dark']
      updateSettings({ theme: map[res.tapIndex] || 'system' })
      applyTheme()
      reload()
    }
  })
}

function onPickSort() {
  uni.showActionSheet({
    itemList: ['按创建时间', '按提醒时间'],
    success: function (res) {
      updateSettings({ sortBy: res.tapIndex === 1 ? 'remind' : 'created' })
      reload()
    }
  })
}

/* ---------- 通知权限 ---------- */

function onOpenPermission() {
  let jumped = false
  // #ifdef APP-PLUS
  try {
    const main = plus.android.runtimeMainActivity()
    const Intent = plus.android.importClass('android.content.Intent')
    const SettingsCls = plus.android.importClass('android.provider.Settings')
    const intent = new Intent(SettingsCls.ACTION_APP_NOTIFICATION_SETTINGS)
    intent.putExtra(SettingsCls.EXTRA_APP_PACKAGE, main.getPackageName())
    main.startActivity(intent)
    jumped = true
  } catch (e) {
    jumped = false
  }
  // #endif

  if (!jumped) {
    uni.showModal({
      title: '请手动开启通知权限',
      content: '设置 → 通知管理 → 找到「还有什么」→ 打开「允许通知」',
      showCancel: false
    })
  }
  updateSettings({ notifyGuideDismissed: true })
  reload()
}

/* ---------- 分类管理 ---------- */

function openCatEditor() {
  categories.value = listCategories()
  catEditorVisible.value = true
}

function closeCatEditor() {
  catEditorVisible.value = false
  reload()
}

function onAddCat() {
  uni.showModal({
    title: '新增分类',
    editable: true,
    placeholderText: '分类名（最多 8 个字）',
    success: function (res) {
      if (!res.confirm) return
      const created = createCategory({ name: res.content, color: CATEGORY_COLORS[0] })
      if (!created) {
        uni.showToast({ title: '名称不能为空或已存在', icon: 'none' })
        return
      }
      categories.value = listCategories()
    }
  })
}

function onRename(c) {
  uni.showModal({
    title: '重命名分类',
    editable: true,
    placeholderText: c.name,
    success: function (res) {
      if (!res.confirm) return
      const updated = updateCategory(c.id, { name: res.content })
      if (!updated) {
        uni.showToast({ title: '名称不能为空或已存在', icon: 'none' })
        return
      }
      categories.value = listCategories()
    }
  })
}

/** 点圆点循环切换预设颜色（颜色很难用文字选项表达，这样最简单） */
function onCycleColor(c) {
  const idx = CATEGORY_COLORS.indexOf(c.color)
  const next = CATEGORY_COLORS[(idx + 1) % CATEGORY_COLORS.length]
  updateCategory(c.id, { color: next })
  categories.value = listCategories()
}

function onDeleteCat(c) {
  const n = countTasksIn(c.id)
  uni.showModal({
    title: '删除分类「' + c.name + '」？',
    content: n > 0
      ? '该分类下的 ' + n + ' 条任务会移到「默认」分类，任务本身不会丢。'
      : '该分类下没有任务。',
    confirmText: '删除',
    confirmColor: '#FF3B30',
    success: function (res) {
      if (!res.confirm) return
      const moved = removeCategory(c.id)
      if (moved < 0) {
        uni.showToast({ title: '这个分类不能删', icon: 'none' })
        return
      }
      categories.value = listCategories()
      uni.showToast({
        title: moved > 0 ? '已删除，' + moved + ' 条任务移到默认' : '已删除',
        icon: 'none'
      })
    }
  })
}

/* ---------- 数据导出 / 导入 ---------- */

function onExport() {
  const text = exportToText()
  const sum = dataSummary()

  uni.setClipboardData({
    data: text,
    success: function () {
      uni.showModal({
        title: '已复制到剪贴板',
        content: '共 ' + sum.tasks + ' 条任务（已完成 ' + sum.completed + ' 条）、'
          + sum.categories + ' 个分类。\n\n请粘贴到微信收藏、备忘录或电脑上保存。',
        showCancel: false
      })
    },
    fail: function () {
      uni.showModal({
        title: '复制失败',
        content: '系统不允许访问剪贴板，请检查应用权限。',
        showCancel: false
      })
    }
  })
}

function onImport() {
  uni.getClipboardData({
    success: function (res) {
      const parsed = parseImportText(res.data)
      if (!parsed.ok) {
        uni.showModal({
          title: '导入失败',
          content: parsed.reason,
          showCancel: false
        })
        return
      }

      const incoming = parsed.data
      uni.showModal({
        title: '确认导入？',
        content: '备份里有 ' + incoming.tasks.length + ' 条任务、'
          + incoming.categories.length + ' 个分类。\n\n'
          + '导入会用它们覆盖当前全部数据，且无法撤销。建议先导出一次当前数据。',
        confirmText: '覆盖导入',
        confirmColor: '#FF3B30',
        success: function (r) {
          if (!r.confirm) return
          const applied = applyImport(incoming)
          uni.showToast({
            title: '已导入 ' + applied.tasks + ' 条任务',
            icon: 'none',
            duration: 2000
          })
          reload()
        }
      })
    },
    fail: function () {
      uni.showModal({
        title: '读取剪贴板失败',
        content: '请先把备份内容复制到剪贴板，再回到这里点「导入数据」。',
        showCancel: false
      })
    }
  })
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  padding-bottom: 60rpx;
  background-color: var(--c-bg);
}

.section {
  margin: 20rpx 24rpx 0;
  background-color: var(--c-surface);
  border-radius: 28rpx;
  box-shadow: 0 6rpx 20rpx var(--c-shadow);
  overflow: hidden;
}

.sec-title {
  display: block;
  padding: 22rpx 30rpx 10rpx;
  font-size: 24rpx;
  font-weight: 600;
  color: var(--c-text-2);
}

/* 关于 */
.about {
  margin-top: 60rpx;
  padding: 0 24rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.about-name {
  font-size: 32rpx;
  font-weight: 600;
  color: var(--c-text);
}

.about-ver {
  margin-top: 8rpx;
  font-size: 24rpx;
  color: var(--c-text-2);
}

.about-desc {
  margin-top: 24rpx;
  font-size: 26rpx;
  color: var(--c-text-2);
  text-align: center;
}

.about-note {
  margin-top: 12rpx;
  font-size: 24rpx;
  color: var(--c-text-2);
  opacity: 0.8;
  text-align: center;
}

/* 分类管理弹层 */
.mask {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.45);
  z-index: 100;
  display: flex;
  align-items: flex-end;
}

.sheet {
  width: 100%;
  max-height: 70vh;
  background-color: var(--c-surface);
  border-radius: 24rpx 24rpx 0 0;
  padding-bottom: 40rpx;
}

.sheet-head {
  height: 96rpx;
  padding: 0 32rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1rpx solid var(--c-line);
}

.sheet-title {
  font-size: 32rpx;
  font-weight: 600;
  color: var(--c-text);
}

.sheet-done {
  font-size: 28rpx;
  color: var(--c-primary);
}

.sheet-body {
  max-height: 60vh;
}

.cat-row {
  height: 96rpx;
  padding: 0 32rpx;
  display: flex;
  align-items: center;
  border-bottom: 1rpx solid var(--c-line);
}

.cat-dot {
  width: 32rpx;
  height: 32rpx;
  border-radius: 50%;
  margin-right: 20rpx;
}

.cat-name {
  flex: 1;
  font-size: 30rpx;
  color: var(--c-text);
}

.cat-del {
  font-size: 26rpx;
  color: var(--c-danger);
  padding: 12rpx;
}

.cat-lock {
  font-size: 24rpx;
  color: var(--c-text-2);
}

.cat-add {
  height: 96rpx;
  padding: 0 32rpx;
  display: flex;
  align-items: center;
  font-size: 30rpx;
  color: var(--c-primary);
}

.sheet-tip {
  padding: 16rpx 32rpx 0;
  font-size: 22rpx;
  color: var(--c-text-2);
}
</style>
