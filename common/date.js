/**
 * 「还有什么」——日期时间工具
 * 只做格式化与换算，不含任何业务判断。
 */

const DAY_MS = 24 * 60 * 60 * 1000

/** 数字补零到两位 */
function pad2(n) {
  return n < 10 ? '0' + n : '' + n
}

/** 取某个时间戳所在当天的 00:00:00 时间戳 */
export function startOfDay(ts) {
  const d = new Date(ts)
  d.setHours(0, 0, 0, 0)
  return d.getTime()
}

/** 是否已经过期（早于当前时刻） */
export function isOverdue(ts) {
  if (!ts) return false
  return ts < Date.now()
}

/** 两个时间戳是否落在同一天 */
export function isSameDay(a, b) {
  return startOfDay(a) === startOfDay(b)
}

/** 时间戳 → "YYYY-MM-DD"（picker mode=date 用） */
export function formatDate(ts) {
  if (!ts) return ''
  const d = new Date(ts)
  return d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate())
}

/** 时间戳 → "HH:mm"（picker mode=time 用） */
export function formatTime(ts) {
  if (!ts) return ''
  const d = new Date(ts)
  return pad2(d.getHours()) + ':' + pad2(d.getMinutes())
}

/** 时间戳 → "YYYY-MM-DD HH:mm:ss"（导出备份时用） */
export function formatDateTime(ts) {
  if (!ts) return ''
  return formatDate(ts) + ' ' + formatTime(ts) + ':' + pad2(new Date(ts).getSeconds())
}

/**
 * 列表上显示的提醒时间
 * 今天 15:00 / 明天 09:00 / 昨天 08:30 / 3月5日 15:00 / 2027年1月1日 09:00
 */
export function formatRemind(ts) {
  if (!ts) return ''
  const now = Date.now()
  const diffDays = Math.round((startOfDay(ts) - startOfDay(now)) / DAY_MS)
  const d = new Date(ts)
  const hm = pad2(d.getHours()) + ':' + pad2(d.getMinutes())

  if (diffDays === 0) return '今天 ' + hm
  if (diffDays === 1) return '明天 ' + hm
  if (diffDays === -1) return '昨天 ' + hm
  if (d.getFullYear() === new Date(now).getFullYear()) {
    return (d.getMonth() + 1) + '月' + d.getDate() + '日 ' + hm
  }
  return d.getFullYear() + '年' + (d.getMonth() + 1) + '月' + d.getDate() + '日 ' + hm
}

/** 列表上显示的截止日期：今天 / 明天 / 3月5日 / 2027年1月1日 */
export function formatDue(ts) {
  if (!ts) return ''
  const now = Date.now()
  const diffDays = Math.round((startOfDay(ts) - startOfDay(now)) / DAY_MS)
  const d = new Date(ts)

  if (diffDays === 0) return '今天'
  if (diffDays === 1) return '明天'
  if (diffDays === -1) return '昨天'
  if (d.getFullYear() === new Date(now).getFullYear()) {
    return (d.getMonth() + 1) + '月' + d.getDate() + '日'
  }
  return d.getFullYear() + '年' + (d.getMonth() + 1) + '月' + d.getDate() + '日'
}

/**
 * 把 picker 选出的日期、时间拼成时间戳
 * @param {string} dateStr 'YYYY-MM-DD'
 * @param {string} timeStr 'HH:mm'，不传时用 fallbackHour:fallbackMinute
 * @param {number} fallbackHour 默认 9
 * @param {number} fallbackMinute 默认 0
 * @returns {number|null} 时间戳，解析失败返回 null
 */
export function toTimestamp(dateStr, timeStr, fallbackHour = 9, fallbackMinute = 0) {
  if (!dateStr) return null
  const dp = String(dateStr).split('-')
  if (dp.length !== 3) return null

  let hh = fallbackHour
  let mm = fallbackMinute
  if (timeStr) {
    const tp = String(timeStr).split(':')
    if (tp.length >= 2) {
      hh = parseInt(tp[0], 10) || 0
      mm = parseInt(tp[1], 10) || 0
    }
  }

  const d = new Date(
    parseInt(dp[0], 10),
    parseInt(dp[1], 10) - 1,
    parseInt(dp[2], 10),
    hh,
    mm,
    0,
    0
  )
  const t = d.getTime()
  return isNaN(t) ? null : t
}

/** 生成"今天 + n 天"的 YYYY-MM-DD，用来做 picker 的默认值 */
export function dateStrAfterDays(days) {
  return formatDate(Date.now() + days * DAY_MS)
}
