<template>
  <view class="dt-row">
    <text class="label">{{ label }}</text>
    <view class="right">
      <picker
        mode="multiSelector"
        :range="range"
        :value="pickerIndex"
        @change="onChange"
        @columnchange="onColumnChange"
      >
        <view class="value-wrap">
          <text class="value" :class="{ ph: !hasValue }">{{ displayText }}</text>
          <view class="chev"></view>
        </view>
      </picker>
      <text v-if="hasValue" class="clear" @click.stop="onClear">✕</text>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { formatRemind } from '@/common/date.js'

/**
 * 日期时间选择行：一次滚完 年-月-日 时:分，五列并排。
 *
 * 为什么不用「日期 picker + 时间 picker」两个独立控件：
 * 那样必须分两次点开，选完日期还要再点一次才能选时间。
 * multiSelector 把五列放在同一个选择器里，从上到下滚一遍就选完了。
 */
const props = defineProps({
  label: { type: String, default: '' },
  modelValue: { type: Number, default: null },
  placeholder: { type: String, default: '未设置' }
})
const emit = defineEmits(['update:modelValue'])

const BASE_YEAR = new Date().getFullYear()
const YEAR_SPAN = 5

function pad2(n) {
  return n < 10 ? '0' + n : '' + n
}

const YEARS = []
for (let i = 0; i < YEAR_SPAN; i++) YEARS.push(String(BASE_YEAR + i))

const MONTHS = []
for (let i = 1; i <= 12; i++) MONTHS.push(pad2(i))

const HOURS = []
for (let i = 0; i < 24; i++) HOURS.push(pad2(i))

const MINUTES = []
for (let i = 0; i < 60; i++) MINUTES.push(pad2(i))

/** 某年某月有多少天（month 传 1~12） */
function daysOf(year, month) {
  return new Date(year, month, 0).getDate()
}

function buildDays(year, month) {
  const n = daysOf(year, month)
  const arr = []
  for (let i = 1; i <= n; i++) arr.push(pad2(i))
  return arr
}

const days = ref(buildDays(BASE_YEAR, 1))
const pickerIndex = ref([0, 0, 0, 9, 0])

const range = computed(function () {
  return [YEARS, MONTHS, days.value, HOURS, MINUTES]
})

const hasValue = computed(function () {
  return !!props.modelValue
})

const displayText = computed(function () {
  return props.modelValue ? formatRemind(props.modelValue) : props.placeholder
})

/** 未设置时的默认落点：下一个整点（避免默认值本身就是个过去的时间） */
function nextHour() {
  const d = new Date()
  d.setMinutes(0, 0, 0)
  d.setHours(d.getHours() + 1)
  return d
}

/** 把外部时间戳同步到选择器索引 */
function syncFromValue() {
  const ts = props.modelValue
  const d = ts ? new Date(ts) : nextHour()

  let yi = YEARS.indexOf(String(d.getFullYear()))
  if (yi < 0) yi = 0                       // 时间超出可选范围时回落到第一年

  days.value = buildDays(BASE_YEAR + yi, d.getMonth() + 1)

  const di = Math.min(d.getDate() - 1, days.value.length - 1)
  pickerIndex.value = [yi, d.getMonth(), di, d.getHours(), d.getMinutes()]
}

watch(function () { return props.modelValue }, syncFromValue, { immediate: true })

/** 滚动某一列：年或月变了要重算当月天数 */
function onColumnChange(e) {
  const col = e.detail.column
  const val = e.detail.value
  const idx = pickerIndex.value.slice()
  idx[col] = val

  if (col === 0 || col === 1) {
    const year = BASE_YEAR + idx[0]
    const month = idx[1] + 1
    days.value = buildDays(year, month)
    if (idx[2] > days.value.length - 1) idx[2] = days.value.length - 1
  }
  pickerIndex.value = idx
}

function onChange(e) {
  const v = e.detail.value
  const year = BASE_YEAR + v[0]
  const month = v[1] + 1
  const day = v[2] + 1
  const ts = new Date(year, month - 1, day, v[3], v[4], 0, 0).getTime()
  emit('update:modelValue', ts)
}

function onClear() {
  emit('update:modelValue', null)
}
</script>

<style scoped>
.dt-row {
  min-height: 96rpx;
  padding: 20rpx 32rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: var(--c-surface);
  border-bottom: 1rpx solid var(--c-line);
}

.label {
  font-size: 30rpx;
  color: var(--c-text);
  flex-shrink: 0;
}

.right {
  display: flex;
  align-items: center;
}

.value-wrap {
  display: flex;
  align-items: center;
  padding: 12rpx 0 12rpx 24rpx;
}

.value {
  font-size: 28rpx;
  font-weight: 500;
  color: var(--c-primary);
}

.value.ph {
  font-weight: 400;
  color: var(--c-text-2);
}

/* 提示这一行可点 */
.chev {
  width: 14rpx;
  height: 14rpx;
  margin-left: 12rpx;
  border-top: 3rpx solid var(--c-text-2);
  border-right: 3rpx solid var(--c-text-2);
  transform: rotate(45deg);
}

.clear {
  margin-left: 20rpx;
  padding: 8rpx 4rpx;
  font-size: 26rpx;
  color: var(--c-text-2);
}
</style>
