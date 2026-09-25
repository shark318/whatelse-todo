/**
 * 「还有什么」——设置业务逻辑
 */

import { loadSettings, saveSettings } from './storage.js'
import { THEME_LIGHT, THEME_DARK } from './keys.js'

/** 读取设置（已补齐默认值） */
export function getSettings() {
  return loadSettings()
}

/** 合并更新设置；返回更新后的完整设置 */
export function updateSettings(patch) {
  return saveSettings(patch || {})
}

/**
 * 由「设置值 + 当前系统主题」解析出实际生效的主题
 * @param {string} setting 'system' | 'light' | 'dark'
 * @param {string} systemTheme 'light' | 'dark'
 * @returns {string} 'light' | 'dark'
 */
export function resolveTheme(setting, systemTheme) {
  if (setting === THEME_LIGHT || setting === THEME_DARK) return setting
  return systemTheme === 'dark' ? THEME_DARK : THEME_LIGHT
}

/**
 * 页面根节点要挂的 class
 * @returns {string} 'theme-dark' | 'theme-light'
 */
export function themeClass(setting, systemTheme) {
  return resolveTheme(setting, systemTheme) === THEME_DARK ? 'theme-dark' : 'theme-light'
}

/** 主题设置的中文名（设置页显示用） */
export function themeLabel(setting) {
  if (setting === THEME_LIGHT) return '浅色'
  if (setting === THEME_DARK) return '深色'
  return '跟随系统'
}

/** 排序设置的中文名 */
export function sortLabel(sortBy) {
  return sortBy === 'remind' ? '按提醒时间' : '按创建时间'
}
