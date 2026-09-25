/**
 * 「还有什么」——图片附件（可选功能）
 *
 * 存储策略：图片文件放进应用私有目录（uni.saveFile），任务对象里只存路径。
 * 绝不把图片转成 base64 塞进本地存储 —— 那样几百 KB 的图会让键值存储迅速膨胀。
 *
 * ⚠️ 代价（必须让使用者知道）：导出备份是 JSON 文本，**不含图片**。
 *    换手机或卸载重装后，任务能回来，图片会丢。设置页的数据分区里有对应说明。
 */

import { MAX_IMAGES } from './keys.js'

/** 选图，返回临时路径数组（用户取消时返回空数组） */
export function chooseImages(count) {
  return new Promise(function (resolve) {
    uni.chooseImage({
      count: count || MAX_IMAGES,
      sizeType: ['compressed'],          // 用压缩过的图，别把原图塞进来
      sourceType: ['album', 'camera'],
      success: function (res) {
        resolve(res.tempFilePaths || [])
      },
      fail: function () {
        resolve([])
      }
    })
  })
}

/** 把临时图片转存到应用私有目录，返回持久路径（失败的会被丢掉） */
export function persistImages(tempPaths) {
  const list = Array.isArray(tempPaths) ? tempPaths : []
  return Promise.all(list.map(function (p) {
    return new Promise(function (resolve) {
      uni.saveFile({
        tempFilePath: p,
        success: function (res) { resolve(res.savedFilePath) },
        fail: function () { resolve('') }
      })
    })
  })).then(function (paths) {
    return paths.filter(function (p) { return !!p })
  })
}

/** 选图 + 转存，一步到位 */
export function addImages(count) {
  return chooseImages(count).then(function (temps) {
    if (!temps.length) return []
    return persistImages(temps)
  })
}

/** 删除图片文件；返回删掉的张数。失败也不抛，避免影响主流程 */
export function removeImages(paths) {
  const list = (Array.isArray(paths) ? paths : [paths]).filter(Boolean)
  if (!list.length) return Promise.resolve(0)

  return Promise.all(list.map(function (p) {
    return new Promise(function (resolve) {
      uni.removeSavedFile({
        filePath: p,
        complete: function () { resolve(true) }
      })
    })
  })).then(function () { return list.length })
}

/** 预览：可左右滑动切换 */
export function previewImages(paths, current) {
  const list = (Array.isArray(paths) ? paths : [paths]).filter(Boolean)
  if (!list.length) return
  uni.previewImage({
    urls: list,
    current: current || list[0]
  })
}
