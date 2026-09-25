<template>
  <view class="list">
    <!-- 未完成 -->
    <TaskItem
      v-for="t in active"
      :key="t.id"
      :task="t"
      :category="categoryOf(t.categoryId)"
      @toggle="onToggle"
      @edit="onEdit"
      @remove="onRemove"
    />

    <!-- 已完成分组 -->
    <view v-if="completed.length">
      <GroupHeader :count="completed.length" :collapsed="collapsed" @toggle="onToggleGroup" />
      <template v-if="!collapsed">
        <TaskItem
          v-for="t in completed"
          :key="t.id"
          :task="t"
          :category="categoryOf(t.categoryId)"
          @toggle="onToggle"
          @edit="onEdit"
          @remove="onRemove"
        />
      </template>
    </view>
  </view>
</template>

<script setup>
import TaskItem from './TaskItem.vue'
import GroupHeader from './GroupHeader.vue'

/**
 * 列表容器：负责按「未完成在上、已完成在下」渲染，并转发三种交互事件。
 * 分组与折叠状态由父页面传入，组件本身不读存储。
 */
const props = defineProps({
  active: { type: Array, default: function () { return [] } },
  completed: { type: Array, default: function () { return [] } },
  collapsed: { type: Boolean, default: true },
  categories: { type: Array, default: function () { return [] } }
})
const emit = defineEmits(['toggle', 'edit', 'remove', 'toggle-group'])

function categoryOf(id) {
  return props.categories.find(function (c) { return c.id === id }) || null
}

function onToggle(task) { emit('toggle', task) }
function onEdit(task) { emit('edit', task) }
function onRemove(task) { emit('remove', task) }
function onToggleGroup() { emit('toggle-group') }
</script>

<style scoped>
.list {
  background-color: var(--c-bg);
}
</style>
