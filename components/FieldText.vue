<template>
  <view class="field">
    <text v-if="label" class="label">{{ label }}</text>
    <textarea
      class="textarea"
      :value="modelValue"
      :placeholder="placeholder"
      placeholder-class="ph"
      :maxlength="maxlength"
      auto-height
      :focus="autoFocus"
      :show-confirm-bar="false"
      @input="onInput"
    />
  </view>
</template>

<script setup>
/** 多行自动增高的文本输入（内容 / 备注共用） */
const props = defineProps({
  modelValue: { type: String, default: '' },
  label: { type: String, default: '' },
  placeholder: { type: String, default: '' },
  maxlength: { type: Number, default: 200 },
  autoFocus: { type: Boolean, default: false }
})
const emit = defineEmits(['update:modelValue'])

function onInput(e) {
  emit('update:modelValue', e.detail.value)
}
</script>

<style scoped>
.field {
  margin: 20rpx 24rpx 0;
  padding: 26rpx 30rpx;
  background-color: var(--c-surface);
  border-radius: 28rpx;
  box-shadow: 0 6rpx 20rpx var(--c-shadow);
}

.label {
  display: block;
  margin-bottom: 12rpx;
  font-size: 24rpx;
  color: var(--c-text-2);
}

.textarea {
  width: 100%;
  min-height: 56rpx;
  font-size: 32rpx;
  line-height: 1.5;
  color: var(--c-text);
}

.ph {
  color: var(--c-text-2);
}
</style>
