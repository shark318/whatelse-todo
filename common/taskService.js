/**
 * 「还有什么」——任务业务逻辑
 *
 * 服务层：只做业务规则与校验，不碰 UI，也不直接调 uni.setStorageSync（开发文档 6.2）。
 * 非法输入一律返回 null 或空数组，不抛异常。
 */

import { loadTasks, saveTasks } from './storage.js'
import {
  CATEGORY_DEFAULT,
  STATUS_ALL,
  STATUS_ACTIVE,
  STATUS_COMPLETED,
  SORT_BY_CREATED,
  SORT_BY_REMIND,
  MAX_IMAGES
} from './keys.js'

/** 生成唯一 id：时间戳(36 进制) + '-' + 4 位随机，例如 lz3k9a-x8f2 */
function genId() {
  return Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 6)
}

/** 标题：去首尾空格、限长 200 */
function normalizeTitle(v) {
  return String(v == null ? '' : v).trim().slice(0, 200)
}

/** 备注：去首尾空格、限长 500 */
function normalizeNote(v) {
  return String(v == null ? '' : v).trim().slice(0, 500)
}

/** 时间戳字段：只接受数字，其它一律 null */
function normalizeTs(v) {
  return typeof v === 'number' && !isNaN(v) ? v : null
}

/** 图片路径数组：只收非空字符串、去重、最多 MAX_IMAGES 张 */
function normalizeImages(v) {
  if (!Array.isArray(v)) return []
  const out = []
  v.forEach(function (p) {
    if (typeof p === 'string' && p && out.indexOf(p) < 0 && out.length < MAX_IMAGES) {
      out.push(p)
    }
  })
  return out
}

/**
 * 新建任务
 * @returns {Task|null} 标题为空或纯空格时返回 null（不创建）
 */
export function createTask(input) {
  const d = input || {}
  const title = normalizeTitle(d.title)
  if (!title) return null

  const list = loadTasks()

  // createdAt 保证严格递增：同一毫秒内连续创建多条时，列表排序才是确定的
  let now = Date.now()
  let maxCreated = 0
  list.forEach(function (t) {
    if (t.createdAt > maxCreated) maxCreated = t.createdAt
  })
  if (now <= maxCreated) now = maxCreated + 1

  const task = {
    id: genId(),
    title: title,
    note: normalizeNote(d.note),
    images: normalizeImages(d.images),
    done: false,
    categoryId: d.categoryId || CATEGORY_DEFAULT,
    remindAt: normalizeTs(d.remindAt),
    dueAt: normalizeTs(d.dueAt),
    createdAt: now,
    updatedAt: now,
    completedAt: null,
    sort: now
  }

  list.push(task)
  saveTasks(list)
  return task
}

/**
 * 局部更新任务
 * @returns {Task|null} 找不到任务、或把标题改成空时返回 null
 */
export function updateTask(id, patch) {
  const list = loadTasks()
  const idx = list.findIndex(function (t) { return t.id === id })
  if (idx < 0) return null

  const p = patch || {}
  const next = Object.assign({}, list[idx])

  if (p.title !== undefined) {
    const t = normalizeTitle(p.title)
    if (!t) return null                 // 标题不允许清空
    next.title = t
  }
  if (p.note !== undefined) next.note = normalizeNote(p.note)
  if (p.images !== undefined) next.images = normalizeImages(p.images)
  if (p.categoryId !== undefined) next.categoryId = p.categoryId || CATEGORY_DEFAULT
  if (p.remindAt !== undefined) next.remindAt = normalizeTs(p.remindAt)
  if (p.dueAt !== undefined) next.dueAt = normalizeTs(p.dueAt)
  next.updatedAt = Date.now()

  list[idx] = next
  saveTasks(list)
  return next
}

/**
 * 删除任务
 * @returns {Task|null} 被删除的任务（供撤销用）
 */
export function removeTask(id) {
  const list = loadTasks()
  const idx = list.findIndex(function (t) { return t.id === id })
  if (idx < 0) return null
  const removed = list.splice(idx, 1)[0]
  saveTasks(list)
  return removed
}

/** 撤销删除：把任务放回列表；已存在同 id 时不重复插入 */
export function restoreTask(task) {
  if (!task || !task.id) return null
  const list = loadTasks()
  const exists = list.some(function (t) { return t.id === task.id })
  if (exists) return null
  list.push(task)
  saveTasks(list)
  return task
}

/**
 * 切换完成状态
 * @returns {{task: Task, remaining: number}|null} remaining 供文案 C4「还剩 N 件」使用
 */
export function toggleDone(id) {
  const list = loadTasks()
  const idx = list.findIndex(function (t) { return t.id === id })
  if (idx < 0) return null

  const t = Object.assign({}, list[idx])
  t.done = !t.done
  t.completedAt = t.done ? Date.now() : null
  t.updatedAt = Date.now()

  list[idx] = t
  saveTasks(list)

  const remaining = list.filter(function (x) { return !x.done }).length
  return { task: t, remaining: remaining }
}

/** 取单个任务；不存在返回 null */
export function getTaskById(id) {
  const list = loadTasks()
  return list.find(function (t) { return t.id === id }) || null
}

/** 未完成任务数量 */
export function countRemaining() {
  return loadTasks().filter(function (t) { return !t.done }).length
}

/**
 * 按条件查询任务
 * @param {object} options
 *   keyword    {string} 匹配 title + note，忽略大小写
 *   categoryId {string} 'all' 表示不按分类筛选
 *   status     {string} 'all' | 'active' | 'completed'
 *   sortBy     {string} 'created'（默认，创建时间倒序）| 'remind'（提醒时间升序）
 */
export function queryTasks(options) {
  const o = options || {}
  const keyword = String(o.keyword || '').trim().toLowerCase()
  const categoryId = o.categoryId || 'all'
  const status = o.status || STATUS_ALL
  const sortBy = o.sortBy || SORT_BY_CREATED

  let list = loadTasks()

  if (categoryId && categoryId !== 'all') {
    list = list.filter(function (t) { return t.categoryId === categoryId })
  }
  if (status === STATUS_ACTIVE) {
    list = list.filter(function (t) { return !t.done })
  } else if (status === STATUS_COMPLETED) {
    list = list.filter(function (t) { return t.done })
  }
  if (keyword) {
    list = list.filter(function (t) {
      return String(t.title || '').toLowerCase().indexOf(keyword) >= 0 ||
        String(t.note || '').toLowerCase().indexOf(keyword) >= 0
    })
  }

  if (sortBy === SORT_BY_REMIND) {
    list.sort(function (a, b) {
      const av = a.remindAt || Number.MAX_SAFE_INTEGER
      const bv = b.remindAt || Number.MAX_SAFE_INTEGER
      if (av !== bv) return av - bv
      return b.createdAt - a.createdAt
    })
  } else {
    list.sort(function (a, b) { return b.createdAt - a.createdAt })
  }

  return list
}

/** 把列表拆成 { active, completed } */
export function groupTasks(list) {
  const src = Array.isArray(list) ? list : []
  return {
    active: src.filter(function (t) { return !t.done }),
    completed: src.filter(function (t) { return t.done })
  }
}

/** 清空所有已完成任务；返回清掉的条数 */
export function clearCompleted() {
  const list = loadTasks()
  const kept = list.filter(function (t) { return !t.done })
  const removed = list.length - kept.length
  if (removed > 0) saveTasks(kept)
  return removed
}
