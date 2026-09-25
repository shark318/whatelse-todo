/**
 * 「还有什么」——分类业务逻辑
 *
 * 服务层：只做业务规则与校验，不碰 UI（开发文档 6.2）。
 */

import { loadCategories, saveCategories, loadTasks, saveTasks } from './storage.js'
import { CATEGORY_DEFAULT, DEFAULT_CATEGORIES } from './keys.js'

/** 生成分类 id */
function genId() {
  return 'c' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5)
}

/** 分类名：去首尾空格、限长 8 */
function normalizeName(v) {
  return String(v == null ? '' : v).trim().slice(0, 8)
}

/** 全部分类，按 sort 升序 */
export function listCategories() {
  const list = loadCategories()
  if (!list.length) {
    // 兜底：万一分类被清空，重建内置分类，保证「默认」永远存在
    const seed = DEFAULT_CATEGORIES.map(function (c) { return Object.assign({}, c) })
    saveCategories(seed)
    return seed
  }
  return list.slice().sort(function (a, b) { return (a.sort || 0) - (b.sort || 0) })
}

/** 取单个分类；找不到时返回默认分类 */
export function getCategoryById(id) {
  const list = listCategories()
  return list.find(function (c) { return c.id === id }) ||
    list.find(function (c) { return c.id === CATEGORY_DEFAULT }) ||
    list[0] ||
    { id: CATEGORY_DEFAULT, name: '默认', color: '#8A8F99', builtin: true, sort: 0 }
}

/**
 * 新建分类
 * @returns {Category|null} 名称为空或重名时返回 null
 */
export function createCategory(input) {
  const d = input || {}
  const name = normalizeName(d.name)
  if (!name) return null

  const list = listCategories()
  const dup = list.some(function (c) { return c.name === name })
  if (dup) return null

  let maxSort = 0
  list.forEach(function (c) { maxSort = Math.max(maxSort, c.sort || 0) })

  const cat = {
    id: genId(),
    name: name,
    color: d.color || '#3A7AFE',
    builtin: false,
    sort: maxSort + 1
  }
  list.push(cat)
  saveCategories(list)
  return cat
}

/**
 * 改名或改色
 * @returns {Category|null} 找不到、名称为空、或与其它分类重名时返回 null
 */
export function updateCategory(id, patch) {
  const list = listCategories()
  const idx = list.findIndex(function (c) { return c.id === id })
  if (idx < 0) return null

  const p = patch || {}
  const next = Object.assign({}, list[idx])

  if (p.name !== undefined) {
    const name = normalizeName(p.name)
    if (!name) return null
    const dup = list.some(function (c) { return c.id !== id && c.name === name })
    if (dup) return null
    next.name = name
  }
  if (p.color !== undefined) next.color = p.color

  list[idx] = next
  saveCategories(list)
  return next
}

/**
 * 删除分类
 *
 * 数据一致性规则（开发文档 5.3）：先把该分类下的任务迁到「默认」，再移除分类。
 * 「默认」分类不可删除。
 *
 * @returns {number} 被迁移的任务条数；不可删除时返回 -1
 */
export function removeCategory(id) {
  if (id === CATEGORY_DEFAULT) return -1

  const list = listCategories()
  const idx = list.findIndex(function (c) { return c.id === id })
  if (idx < 0) return -1

  // 第一步：迁移任务（先做，即使后面出错也不会留下"孤儿任务"）
  const tasks = loadTasks()
  let moved = 0
  tasks.forEach(function (t) {
    if (t.categoryId === id) {
      t.categoryId = CATEGORY_DEFAULT
      moved++
    }
  })
  if (moved > 0) saveTasks(tasks)

  // 第二步：移除分类
  list.splice(idx, 1)
  saveCategories(list)

  return moved
}

/** 该分类下的任务数量（删除前提示用） */
export function countTasksIn(id) {
  return loadTasks().filter(function (t) { return t.categoryId === id }).length
}
