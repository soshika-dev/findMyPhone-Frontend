<script setup lang="ts">
import type { Theme } from '@/composables/useTheme'

defineProps<{ theme: Theme }>()
const emit = defineEmits<{ (e: 'toggle-theme'): void }>()
</script>

<template>
  <div class="navbar bg-base-100 shadow-sm px-4 lg:px-8 sticky top-0 z-30">
    <div class="flex-1">
      <h1 class="text-xl lg:text-2xl font-bold text-primary">پیدا کردن دستگاه</h1>
    </div>
    <div class="flex items-center gap-3">
      <div class="tooltip" data-tip="تغییر تم">
        <label class="swap swap-rotate">
          <input type="checkbox" :checked="theme === 'dark'" @change="emit('toggle-theme')" />
          <svg
            class="swap-on fill-current w-6 h-6"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path
              d="M21.64 13a1 1 0 0 0-1.05-.14 8.05 8.05 0 0 1-3.37.73A8.15 8.15 0 0 1 9.08 5.49a1 1 0 0 0-.76-1.22 1 1 0 0 0-1 .27A10.14 10.14 0 1 0 21.64 13Z"
            />
          </svg>
          <svg
            class="swap-off fill-current w-6 h-6"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path
              d="M5.64 17l-.71.71a1 1 0 1 0 1.41 1.41l.71-.71A7.92 7.92 0 0 0 12 21a8 8 0 0 0 8-8 7.92 7.92 0 0 0-1.59-4.66l.71-.71a1 1 0 0 0-1.41-1.41l-.71.71A7.92 7.92 0 0 0 12 3a8 8 0 0 0-8 8 7.92 7.92 0 0 0 1.64 4.64Z"
            />
          </svg>
        </label>
      </div>
      <div class="avatar placeholder">
        <div class="bg-primary text-primary-content rounded-full w-10">
          <span class="text-lg">ش</span>
        </div>
      </div>
    </div>
  </div>
</template>
