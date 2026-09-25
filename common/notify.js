/**
 * 「还有什么」——提醒调度
 *
 * ⚠️ 本模块是整个项目风险最集中的地方，实现细节对应开发文档第 7 章。
 *
 * 能力边界（要如实告诉使用者）：
 *   ✅ App 在前台或后台时，到点准时弹出通知
 *   ❌ App 被系统清理后，不会弹（原生延迟通知随进程一起消失）
 *   ✅ 重新打开 App 时，会补发最近 24 小时内错过的提醒
 */

import { queryTasks } from './taskService.js'
import { getSettings, updateSettings } from './settingsService.js'
import {
  CHANNEL_ID,
  NOTIFY_TITLE,
  REMIND_WINDOW_MS,
  MISSED_WINDOW_MS
} from './keys.js'

/** 当前环境是否具备本地通知能力（只有 App 端才有） */
function canNotify() {
  return typeof uni !== 'undefined' && typeof uni.createPushMessage === 'function'
}

/**
 * 已排期账本：{ taskId: remindAt }
 *
 * 为什么必须记这笔账：uni.createPushMessage 排下的是「从此刻起延迟 N 秒」的通知，
 * 而 scheduleAll() 会在每次启动、每次切回前台都执行一遍。
 * 若不记账，同一个任务会被反复排期，到点时会**同一件事弹出好几条通知**。
 * 账本随 settings 一起持久化，App 重启后同样不会重复排。
 */
function getScheduledMap() {
  const s = getSettings()
  const m = s.scheduledMap
  return (m && typeof m === 'object' && !Array.isArray(m)) ? m : {}
}

/** 记下某任务的某个提醒时间已经排过期 */
function markScheduled(taskId, remindAt) {
  const m = getScheduledMap()
  m[taskId] = remindAt
  updateSettings({ scheduledMap: m })
}

/**
 * 为单个任务安排提醒
 * @returns {boolean} 是否真的排上了
 */
export function scheduleTask(task) {
  if (!task || !task.remindAt || task.done) return false
  if (!canNotify()) return false

  const delta = task.remindAt - Date.now()
  if (delta < 0) return false                        // 已错过 —— 交给 rescheduleMissed
  if (delta > REMIND_WINDOW_MS) return false         // 超出 7 天窗口，等进入窗口后重排

  // 同一个提醒时间只排一次；改过时间的任务会因 remindAt 不同而重新排
  if (getScheduledMap()[task.id] === task.remindAt) return false

  try {
    uni.createPushMessage({
      title: NOTIFY_TITLE,
      content: task.title,
      payload: { taskId: task.id },
      sound: 'system',
      cover: false,
      delay: Math.round(delta / 1000),               // 注意：单位是秒
      when: new Date(task.remindAt),
      channelId: CHANNEL_ID
    })
    markScheduled(task.id, task.remindAt)
    return true
  } catch (e) {
    console.warn('[notify] 安排提醒失败', task.id, e)
    return false
  }
}

/**
 * 取消某个任务的提醒
 *
 * ⚠️ 已知限制：uni.createPushMessage 排下的延迟通知**无法撤回**（开发文档 7.3）。
 * 因此这个函数不产生任何原生调用，它只是语义占位：
 * "取消"的效果由两条规则等效实现 ——
 *   1. 已完成的任务在重排时会被跳过（scheduleTask 里 task.done 直接 return）
 *   2. 用户改了提醒时间后，新通知按时弹，旧通知可能仍会出现一次
 */
export function cancelTask(taskId) {
  return true
}

/**
 * 重排全部提醒：把所有"未完成且有待提醒时间"的任务重新调度一遍
 * @returns {number} 实际排上的条数
 */
export function scheduleAll() {
  if (!canNotify()) return 0

  const list = queryTasks({ status: 'active' })
  const activeIds = {}
  list.forEach(function (t) { activeIds[t.id] = true })

  // 顺手清掉已完成 / 已删除任务的排期记录，免得账本无限增长
  const m = getScheduledMap()
  let cleaned = false
  Object.keys(m).forEach(function (id) {
    if (!activeIds[id]) {
      delete m[id]
      cleaned = true
    }
  })
  if (cleaned) updateSettings({ scheduledMap: m })

  let count = 0
  list.forEach(function (t) {
    if (scheduleTask(t)) count++
  })
  return count
}

/**
 * 补发已错过的提醒
 *
 * 两条限制，避免打开 App 时被通知刷屏：
 *   · 只补最近 24 小时内错过的
 *   · 只补「上次补发之后」新错过的（靠 settings.lastReorderAt 记录水位）
 *
 * @returns {number} 补发条数
 */
export function rescheduleMissed() {
  if (!canNotify()) return 0

  const now = Date.now()
  const since = getSettings().lastReorderAt || 0
  const list = queryTasks({ status: 'active' })
  let count = 0

  list.forEach(function (t) {
    if (!t.remindAt) return
    if (t.remindAt > now) return                       // 还没到点
    if (now - t.remindAt > MISSED_WINDOW_MS) return    // 太久以前，不再翻旧账
    if (t.remindAt <= since) return                    // 上次已经补过，不重复弹

    try {
      uni.createPushMessage({
        title: NOTIFY_TITLE,
        content: t.title,
        payload: { taskId: t.id },
        sound: 'system',
        cover: false,
        channelId: CHANNEL_ID
      })
      count++
    } catch (e) {
      console.warn('[notify] 补发提醒失败', t.id, e)
    }
  })

  updateSettings({ lastReorderAt: now })
  return count
}

/**
 * 创建通知渠道（Android 8.0+）。
 *
 * ⚠️ 渠道配置一旦创建就永久固化：之后即使删除同 id 的渠道再重建也不生效，
 *    除非卸载 App 重装。要改铃声/震动只能换一个新的 channelId（开发文档 7.7）。
 *    所以这里的 importance 直接给 4（HIGH），保证会横幅弹出并响铃。
 */
export function ensureChannel() {
  try {
    if (typeof uni.getChannelManager !== 'function') return false
    const manager = uni.getChannelManager()
    if (!manager || typeof manager.setPushChannel !== 'function') return false

    // 已存在同名渠道就不重复创建（重复创建不会报错，但没必要）
    if (typeof manager.getAllChannels === 'function') {
      const existing = manager.getAllChannels()
      if (Array.isArray(existing) && existing.indexOf(CHANNEL_ID) >= 0) return true
    }

    manager.setPushChannel({
      channelId: CHANNEL_ID,
      channelDesc: '任务提醒',
      importance: 4,
      enableVibration: true,
      enableLights: false
    })
    return true
  } catch (e) {
    console.warn('[notify] 创建通知渠道失败', e)
    return false
  }
}

/**
 * 启动 / 切回前台时的统一入口：先补发错过的，再重排未来的
 * @returns {{missed: number, scheduled: number}}
 */
export function refreshAll() {
  const missed = rescheduleMissed()
  const scheduled = scheduleAll()
  return { missed: missed, scheduled: scheduled }
}
