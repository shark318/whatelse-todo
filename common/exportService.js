/**
 * 「还有什么」——数据导出与导入
 *
 * 设计取舍：不写文件、不联网，只借助系统剪贴板。
 *   · 导出：把全部数据序列化成 JSON 文本 → 复制到剪贴板，用户自己粘到微信收藏/备忘录保存
 *   · 导入：从剪贴板读回 JSON → 校验 → 覆盖本地数据
 *
 * 好处：零权限、零依赖、所有机型都能用；代价：需要用户自己保管那段文本。
 */

import { loadTasks, loadCategories, loadSettings, replaceAll } from './storage.js'
import { EXPORT_APP_ID, SCHEMA_VERSION } from './keys.js'

/** 组装可导出的数据包 */
export function buildExportPayload() {
  return {
    app: EXPORT_APP_ID,
    schemaVersion: SCHEMA_VERSION,
    exportedAt: Date.now(),
    tasks: loadTasks(),
    categories: loadCategories(),
    settings: loadSettings()
  }
}

/** 导出为可读的 JSON 文本（带缩进，方便用户肉眼确认） */
export function exportToText() {
  return JSON.stringify(buildExportPayload(), null, 2)
}

/**
 * 校验一段导入文本
 * @param {string} text
 * @returns {{ok: boolean, reason?: string, data?: object}}
 */
export function parseImportText(text) {
  const raw = String(text == null ? '' : text).trim()
  if (!raw) return { ok: false, reason: '剪贴板里没有内容' }

  let obj
  try {
    obj = JSON.parse(raw)
  } catch (e) {
    return { ok: false, reason: '剪贴板里的内容不是合法的 JSON 文本' }
  }

  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) {
    return { ok: false, reason: '数据格式不正确' }
  }
  if (obj.app !== EXPORT_APP_ID) {
    return { ok: false, reason: '这不是「还有什么」导出的备份' }
  }

  const ver = parseInt(obj.schemaVersion, 10) || 0
  if (ver > SCHEMA_VERSION) {
    return { ok: false, reason: '备份来自更新版本的 App，当前版本读不了' }
  }
  if (!Array.isArray(obj.tasks)) {
    return { ok: false, reason: '备份里没有任务数据' }
  }
  if (!Array.isArray(obj.categories) || !obj.categories.length) {
    return { ok: false, reason: '备份里没有分类数据' }
  }

  return { ok: true, data: obj }
}

/**
 * 用备份覆盖本地数据
 * @returns {{tasks: number, categories: number}}
 */
export function applyImport(data) {
  const d = data || {}
  replaceAll({
    tasks: d.tasks || [],
    categories: d.categories || [],
    settings: d.settings || {}
  })
  return {
    tasks: (d.tasks || []).length,
    categories: (d.categories || []).length
  }
}

/** 当前数据概况，导出前给用户看 */
export function dataSummary() {
  const tasks = loadTasks()
  let completed = 0
  tasks.forEach(function (t) { if (t.done) completed++ })
  return {
    tasks: tasks.length,
    completed: completed,
    categories: loadCategories().length
  }
}
