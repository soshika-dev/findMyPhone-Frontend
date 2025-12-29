<script setup lang="ts">
import type { Device } from '@/types/device'
import DeviceCard from './DeviceCard.vue'

defineProps<{
  open: boolean
  devices: Device[]
  selectedId?: string | null
  loading?: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'select', id: string): void
  (e: 'play-sound', device: Device): void
  (e: 'toggle-lost', device: Device): void
  (e: 'wipe', device: Device): void
}>()
</script>

<template>
  <transition name="fade">
    <div v-if="open" class="fixed inset-0 z-40 lg:hidden">
      <div class="absolute inset-0 bg-black/40" @click="emit('close')"></div>
      <div class="absolute inset-x-0 bottom-0 bg-base-100 rounded-t-2xl shadow-2xl max-h-[75vh] overflow-hidden">
        <div class="flex items-center justify-between px-4 py-3 border-b">
          <div>
            <p class="font-bold">دستگاه‌های من</p>
            <p class="text-sm text-base-content/70">برای تمرکز روی هر دستگاه لمس کنید</p>
          </div>
          <button class="btn btn-ghost" @click="emit('close')">بستن</button>
        </div>
        <div class="p-4 space-y-3 overflow-y-auto max-h-[65vh]">
          <div v-if="loading" class="flex justify-center py-6">
            <span class="loading loading-dots"></span>
          </div>
          <template v-else>
            <DeviceCard
              v-for="device in devices"
              :key="device.id"
              :device="device"
              :selected="device.id === selectedId"
              :show-actions="device.id === selectedId"
              @select="emit('select', device.id)"
              @play-sound="emit('play-sound', device)"
              @toggle-lost="emit('toggle-lost', device)"
              @wipe="emit('wipe', device)"
            />
            <div v-if="!devices.length" class="alert alert-info">دستگاهی موجود نیست.</div>
          </template>
        </div>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
