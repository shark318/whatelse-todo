/**
 * 「还有什么」——存储层
 *
 * 只负责键值读写、首次初始化与版本迁移，不含任何业务判断（开发文档 6.2）。
 * 上层（service）不得直接调用 uni.setStorageSync。
 */

import {
  KEY_TASKS,
  KEY_CATEGORIES,
  KEY_SETTINGS,
  KEY_SCHEMA_VERSION,
  KEY_BACKUP_PREFIX,
  SCHEMA_VERSION,
  DEFAULT_CATEGORIES,
  DEFAULT_SETTINGS
} from './keys.js'

/* ---------- 任务 ---------- */

/** 读取全部任务；返回 Task[] */
export function loadTasks() {
  const v = uni.getStorageSync(KEY_TASKS)
  return Array.isArray(v) ? v : []
}

/** 覆盖写入全部任务 */
export function saveTasks(tasks) {
  uni.setStorageSync(KEY_TASKS, Array.isArray(tasks) ? tasks : [])
}

/* ---------- 分类 ---------- */

/** 读取全部分类；返回 Category[] */
export function loadCategories() {
  const v = uni.getStorageSync(KEY_CATEGORIES)
  return Array.isArray(v) ? v : []
}

/** 覆盖写入全部分类 */
export function saveCategories(list) {
  uni.setStorageSync(KEY_CATEGORIES, Array.isArray(list) ? list : [])
}

/* ---------- 设置 ---------- */

/** 读取设置；缺失字段用默认值补齐 */
export function loadSettings() {
  const v = uni.getStorageSync(KEY_SETTINGS)
  const s = (v && typeof v === 'object' && !Array.isArray(v)) ? v : {}
  return Object.assign({}, DEFAULT_SETTINGS, s)
}

/** 合并写入设置（只覆盖传入的字段）；返回写入后的完整设置 */
export function saveSettings(patch) {
  const next = Object.assign({}, loadSettings(), patch || {})
  uni.setStorageSync(KEY_SETTINGS, next)
  return next
}

/* ---------- 初始化与迁移 ---------- */

/** 首次启动初始化：写入内置分类、默认设置与版本号 */
export function initStorage() {
  if (!loadCategories().length) {
    saveCategories(DEFAULT_CATEGORIES.map(function (c) {
      return Object.assign({}, c)
    }))
  }
  if (!uni.getStorageSync(KEY_SETTINGS)) {
    saveSettings({})
  }
  if (!uni.getStorageSync(KEY_SCHEMA_VERSION)) {
    uni.setStorageSync(KEY_SCHEMA_VERSION, SCHEMA_VERSION)
  }
}

/**
 * 迁移表：版本号 → (data) => data
 * 约定：只增字段、不改字段名、不删字段（开发文档 5.5）
 */
const MIGRATIONS = {
  // 2: function (data) { data.tasks.forEach(function (t) { t.priority = 0 }); return data }
}

/** 需要时自动备份并升级数据结构 */
export function migrateIfNeeded() {
  const current = parseInt(uni.getStorageSync(KEY_SCHEMA_VERSION), 10) || 0
  if (current >= SCHEMA_VERSION) return

  // 全新安装：直接落版本号，不需要备份和迁移
  if (current === 0) {
    uni.setStorageSync(KEY_SCHEMA_VERSION, SCHEMA_VERSION)
    return
  }

  // 先备份全部数据，再逐版本升级
  const backupKey = KEY_BACKUP_PREFIX + current
  if (!uni.getStorageSync(backupKey)) {
    uni.setStorageSync(backupKey, {
      tasks: loadTasks(),
      categories: loadCategories(),
      settings: loadSettings(),
      backedUpAt: Date.now()
    })
  }

  let data = {
    tasks: loadTasks(),
    categories: loadCategories(),
    settings: loadSettings()
  }

  for (let v = current + 1; v <= SCHEMA_VERSION; v++) {
    const fn = MIGRATIONS[v]
    if (typeof fn === 'function') {
      data = fn(data) || data
    }
  }

  saveTasks(data.tasks || [])
  saveCategories(data.categories || [])
  saveSettings(data.settings || {})
  uni.setStorageSync(KEY_SCHEMA_VERSION, SCHEMA_VERSION)
}

/* ---------- 导入数据时用 ---------- */

/** 用一整套数据覆盖当前数据 */
export function replaceAll(payload) {
  const p = payload || {}
  saveTasks(p.tasks || [])
  saveCategories(p.categories || [])
  saveSettings(p.settings || {})
}
