<script setup>
import { onLaunch, onShow } from '@dcloudio/uni-app'
import { initStorage, migrateIfNeeded } from '@/common/storage.js'
import { ensureChannel, refreshAll } from '@/common/notify.js'

/** 从通知的 payload 里取出任务 id（可能是对象，也可能是 JSON 字符串） */
function pickTaskId(data) {
  if (!data) return ''
  let payload = data.payload
  if (typeof payload === 'string') {
    try {
      payload = JSON.parse(payload)
    } catch (e) {
      payload = null
    }
  }
  return (payload && payload.taskId) ? payload.taskId : ''
}

onLaunch(function () {
  // 1. 首次启动初始化 + 数据结构迁移
  initStorage()
  migrateIfNeeded()

  // 2. 创建通知渠道（Android 8.0+，只会在第一次真正创建）
  ensureChannel()

  // 3. 补发错过的提醒 + 重排未来的提醒
  refreshAll()

  // 4. 点通知进来时，跳到对应任务的编辑页
  if (typeof uni.onPushMessage === 'function') {
    uni.onPushMessage(function (res) {
      if (!res || res.type !== 'click') return
      const taskId = pickTaskId(res.data)
      if (!taskId) return
      setTimeout(function () {
        uni.navigateTo({ url: '/pages/task/edit?id=' + taskId })
      }, 300)
    })
  }
})

onShow(function () {
  // 切回前台时补发 + 重排，保证提醒尽量准（开发文档 7.3）
  refreshAll()
})
</script>

<style>
/* ===================== 全局主题变量 ===================== */

page {
  background-color: #FFF9FB;
}

/*
 * 配色说明（可爱风）
 *   · 主色是「草莓粉 → 香芋紫」的糖果渐变，用在悬浮按钮、选中态、强调文字上
 *   · 完成色改用薄荷青，勾上之后清清爽爽
 *   · 背景是一点点暖的樱花白，卡片纯白，靠大圆角和柔和的彩色投影分层
 *   · 文字不用纯黑，用带一点紫的深灰，比黑白对比柔和
 *   · 深色模式不是简单反色：背景是暗紫调而非纯黑，主色提亮保持糖果感
 */
.theme-light {
  --c-primary: #FF7BA9;
  --c-primary-2: #C77DFF;
  --c-success: #4ECDC4;
  --c-warn: #FFB443;
  --c-danger: #FF6B81;
  --c-bg: #FFF9FB;
  --c-surface: #FFFFFF;
  --c-text: #3D3A4E;
  --c-text-2: #A8A2B8;
  --c-line: #F7EAF1;
  --c-shadow: rgba(255, 123, 169, 0.28);
}

.theme-dark {
  --c-primary: #FF9BC0;
  --c-primary-2: #D99BFF;
  --c-success: #5FDCD3;
  --c-warn: #FFC670;
  --c-danger: #FF8095;
  --c-bg: #1F1B29;
  --c-surface: #2B2537;
  --c-text: #F6F1FA;
  --c-text-2: #A8A2B8;
  --c-line: #3A3348;
  --c-shadow: rgba(0, 0, 0, 0.55);
}

/* ===================== 通用类 ===================== */

.page {
  min-height: 100vh;
  box-sizing: border-box;
  background-color: var(--c-bg);
  color: var(--c-text);
}

.ellipsis {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

/* 通用卡片：大圆角 + 柔和彩色投影，可爱风的基础形状 */
.card {
  background-color: var(--c-surface);
  border-radius: 28rpx;
  box-shadow: 0 6rpx 20rpx var(--c-shadow);
}

/* 糖果渐变：悬浮按钮等强调元素共用 */
.grad-primary {
  background-image: linear-gradient(135deg, var(--c-primary) 0%, var(--c-primary-2) 100%);
}
</style>
