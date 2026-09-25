/**
 * 「还有什么」——主题状态
 *
 * 模块级单例：所有页面共享同一个主题 ref，并且只向 uni 注册一次 onThemeChange。
 *
 * 为什么必须做成单例：uni.onThemeChange 没有对应的取消注册 API，
 * 如果每次调用 useTheme() 都注册一遍，用户反复进出页面会不断累积监听器，
 * 每个监听器都闭包持有着已经销毁的页面实例。
 */

import { ref } from 'vue'
import { getSettings, themeClass } from './settingsService.js'

/** 读取当前系统深浅色；不支持的平台回落到 light */
function systemTheme() {
  try {
    const info = uni.getSystemInfoSync()
    return (info && info.theme) ? info.theme : 'light'
  } catch (e) {
    return 'light'
  }
}

const themeCls = ref('theme-light')
let inited = false

/** 重新计算当前应有的主题 class，并同步系统状态栏的文字颜色 */
function applyTheme() {
  themeCls.value = themeClass(getSettings().theme, systemTheme())

  // 首页用了自定义导航栏，状态栏压在页面背景上，
  // 文字颜色必须跟着主题走，否则深色模式下会「深底 + 深字」看不见。
  // #ifdef APP-PLUS
  try {
    plus.navigator.setStatusBarStyle(themeCls.value === 'theme-dark' ? 'light' : 'dark')
  } catch (e) {
    // 某些机型不支持，忽略
  }
  // #endif
}

/**
 * @returns {{themeCls: object, applyTheme: Function}}
 *   themeCls —— 绑定到页面根节点的 class（'theme-light' | 'theme-dark'）
 *   applyTheme —— 重新计算主题（页面 onShow 时调用，让设置页的改动立刻生效）
 */
export function useTheme() {
  if (!inited) {
    inited = true
    applyTheme()

    if (typeof uni.onThemeChange === 'function') {
      uni.onThemeChange(function (res) {
        if (getSettings().theme === 'system') {
          themeCls.value = themeClass('system', res && res.theme)
        }
      })
    }
  } else {
    applyTheme()      // 复用已有单例，但重读一次设置（可能刚在设置页改过）
  }

  return { themeCls: themeCls, applyTheme: applyTheme }
}
