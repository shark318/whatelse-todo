/**
 * 「还有什么」——存储键名与全局常量
 *
 * 规矩：所有本地存储的键名都必须从这里取用，
 *      禁止在业务代码里手写字符串键名（开发文档 6.10 节）。
 */

/* ---------- 存储键 ---------- */

export const KEY_TASKS = 'whatelse_tasks'
export const KEY_CATEGORIES = 'whatelse_categories'
export const KEY_SETTINGS = 'whatelse_settings'
export const KEY_SCHEMA_VERSION = 'whatelse_schema_version'
export const KEY_BACKUP_PREFIX = 'whatelse_backup_v'

/* ---------- 版本 ---------- */

/** 当前数据结构版本，结构变更时 +1 */
export const SCHEMA_VERSION = 1

/* ---------- 通知 ---------- */

/** 通知渠道 id，App.vue 创建渠道与 notify.js 发通知必须用同一个 */
export const CHANNEL_ID = 'whatelse_default'

/** 通知标题（固定用 App 名） */
export const NOTIFY_TITLE = '还有什么'

/* ---------- 业务常量 ---------- */

/** 兜底分类 id，任何时候都必须存在 */
export const CATEGORY_DEFAULT = 'default'

/** 列表筛选：全部分类 */
export const FILTER_ALL = 'all'

/** 任务状态 */
export const STATUS_ALL = 'all'
export const STATUS_ACTIVE = 'active'
export const STATUS_COMPLETED = 'completed'

/** 排序方式 */
export const SORT_BY_CREATED = 'created'
export const SORT_BY_REMIND = 'remind'

/** 主题 */
export const THEME_SYSTEM = 'system'
export const THEME_LIGHT = 'light'
export const THEME_DARK = 'dark'

/** 提醒只排未来 7 天内的（见开发文档 7.3） */
export const REMIND_WINDOW_MS = 7 * 24 * 60 * 60 * 1000

/** 补发时只补最近 24 小时内错过的提醒 */
export const MISSED_WINDOW_MS = 24 * 60 * 60 * 1000

/* ---------- 首次启动写入的初始数据 ---------- */

/** 内置分类（开发文档 5.3） */
export const DEFAULT_CATEGORIES = [
  { id: 'default', name: '默认', color: '#8A8F99', builtin: true, sort: 0 },
  { id: 'work', name: '工作', color: '#3A7AFE', builtin: true, sort: 1 },
  { id: 'life', name: '生活', color: '#34C759', builtin: true, sort: 2 },
  { id: 'study', name: '学习', color: '#FF9500', builtin: true, sort: 3 }
]

/** 默认设置（开发文档 5.4） */
export const DEFAULT_SETTINGS = {
  theme: 'system',
  sortBy: 'created',
  completedCollapsed: true,
  filterCategoryId: 'all',
  notifyGuideDismissed: false,
  lastReorderAt: 0
}

/** 导出文件的标识字段，导入时用来认领自己的备份 */
export const EXPORT_APP_ID = 'whatelse'

/** 单条任务最多能附几张图（可选功能，不用也完全不影响） */
export const MAX_IMAGES = 9

/** 备选分类颜色（新建分类时循环使用） */
export const CATEGORY_COLORS = [
  '#3A7AFE', '#34C759', '#FF9500', '#FF3B30',
  '#AF52DE', '#5AC8FA', '#FF2D55', '#8A8F99'
]
