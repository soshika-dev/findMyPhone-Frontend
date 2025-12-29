<script setup lang="ts">
import type { Device } from '@/types/device'
import { formatBattery, formatDateTime, formatRelativeTime } from '@/utils/format'
import DeviceActions from './DeviceActions.vue'

defineProps<{
  device: Device
  selected?: boolean
  showActions?: boolean
}>()

const emit = defineEmits<{
  (e: 'select', id: string): void
  (e: 'play-sound', device: Device): void
  (e: 'toggle-lost', device: Device): void
  (e: 'wipe', device: Device): void
}>()
</script>

<template>
  <article
    class="card bg-base-100 shadow-sm hover:shadow-md transition cursor-pointer border"
    :class="selected ? 'border-primary shadow-lg' : 'border-base-200'"
    @click="emit('select', device.id)"
  >
    <div class="card-body p-4 space-y-3">
      <div class="flex items-start gap-3">
        <div class="avatar placeholder">
          <div class="bg-primary/10 text-primary rounded-xl w-12 h-12 flex items-center justify-center">
            📱
          </div>
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2">
            <h3 class="font-bold text-lg truncate" :title="device.name">{{ device.name }}</h3>
            <span class="badge badge-ghost">{{ device.model }}</span>
          </div>
          <p class="text-sm text-base-content/70 truncate" :title="device.addressText">
            {{ device.addressText }}
          </p>
          <div class="flex flex-wrap gap-2 mt-2">
            <span
              class="badge"
              :class="device.isOnline ? 'badge-success' : 'badge-neutral'"
            >
              {{ device.isOnline ? 'آنلاین' : 'آفلاین' }}
            </span>
            <span
              class="badge"
              :class="device.isAvailable ? 'badge-info' : 'badge-neutral'"
            >
              {{ device.isAvailable ? 'در دسترس' : 'غیردردسترس' }}
            </span>
            <span class="badge badge-outline">باتری {{ formatBattery(device.battery) }}</span>
            <span v-if="device.lostMode" class="badge badge-warning">حالت گم‌شده</span>
            <span v-if="device.wiped" class="badge badge-error">پاک شده</span>
          </div>
        </div>
      </div>

      <div class="flex flex-wrap items-center gap-3 text-sm text-base-content/70">
        <div class="flex items-center gap-1">
          <span class="text-base-content">آخرین بروزرسانی:</span>
          <span>{{ formatRelativeTime(device.lastUpdate) }}</span>
        </div>
        <span class="badge badge-ghost">{{ formatDateTime(device.lastUpdate) }}</span>
      </div>

      <DeviceActions
        v-if="showActions"
        :device="device"
        @play-sound.stop="emit('play-sound', device)"
        @toggle-lost.stop="emit('toggle-lost', device)"
        @wipe.stop="emit('wipe', device)"
      />
    </div>
  </article>
</template>
