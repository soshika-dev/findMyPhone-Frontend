<script setup lang="ts">
import type { Device } from '@/types/device'
import DeviceCard from './DeviceCard.vue'

defineProps<{
  devices: Device[]
  selectedId?: string | null
  loading?: boolean
  filterOnline: boolean
  filterAvailable: boolean
  searchTerm: string
}>()

const emit = defineEmits<{
  (e: 'select', id: string): void
  (e: 'update:filterOnline', value: boolean): void
  (e: 'update:filterAvailable', value: boolean): void
  (e: 'update:search', value: string): void
  (e: 'play-sound', device: Device): void
  (e: 'toggle-lost', device: Device): void
  (e: 'wipe', device: Device): void
}>()
</script>

<template>
  <div class="space-y-3">
    <div class="card bg-base-100 shadow-sm">
      <div class="card-body gap-3">
        <div class="flex items-center justify-between gap-2">
          <h2 class="card-title">دستگاه‌ها</h2>
          <div class="badge badge-outline">{{ devices.length }} مورد</div>
        </div>
        <label class="input input-bordered flex items-center gap-2">
          <input
            type="text"
            class="grow"
            placeholder="جستجو بر اساس نام دستگاه"
            :value="searchTerm"
            @input="emit('update:search', ($event.target as HTMLInputElement).value)"
          />
          <kbd class="kbd kbd-xs">Ctrl</kbd>
          <kbd class="kbd kbd-xs">F</kbd>
        </label>
        <div class="flex flex-wrap gap-3 text-sm">
          <label class="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              class="toggle toggle-success"
              :checked="filterOnline"
              @change="emit('update:filterOnline', ($event.target as HTMLInputElement).checked)"
            />
            <span>فقط آنلاین‌ها</span>
          </label>
          <label class="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              class="toggle toggle-info"
              :checked="filterAvailable"
              @change="emit('update:filterAvailable', ($event.target as HTMLInputElement).checked)"
            />
            <span>فقط در دسترس‌ها</span>
          </label>
        </div>
      </div>
    </div>

    <div v-if="loading" class="flex items-center justify-center py-10">
      <span class="loading loading-dots loading-lg"></span>
    </div>
    <div v-else class="space-y-3 max-h-[70vh] overflow-auto pr-1">
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
      <div v-if="!devices.length" class="alert alert-info">
        دستگاهی با این شرایط پیدا نشد.
      </div>
    </div>
  </div>
</template>
