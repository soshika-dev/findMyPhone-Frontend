<script setup lang="ts">
import { ref } from 'vue'
import TopBar from '@/components/TopBar.vue'
import DeviceList from '@/components/DeviceList.vue'
import MapView from '@/components/MapView.vue'
import MobileDeviceSheet from '@/components/MobileDeviceSheet.vue'
import { useDevices } from '@/composables/useDevices'
import { useTheme } from '@/composables/useTheme'

const {
  filteredDevices,
  selectedDevice,
  selectedId,
  filterOnline,
  filterAvailable,
  searchTerm,
  setSearchTerm,
  setFilterOnline,
  setFilterAvailable,
  selectDevice,
  playSound,
  toggleLostMode,
  wipeDevice,
  loading,
  error,
  toasts,
  dismissToast,
} = useDevices()

const { theme, toggleTheme } = useTheme()
const isSheetOpen = ref(false)

const handleSelect = (id: string) => {
  selectDevice(id)
  isSheetOpen.value = false
}
</script>

<template>
  <div class="min-h-screen bg-base-200 text-base-content flex flex-col">
    <TopBar :theme="theme" @toggle-theme="toggleTheme" />

    <section class="lg:hidden px-4 py-3 space-y-2">
      <label class="input input-bordered flex items-center gap-2">
        <input
          type="text"
          class="grow"
          placeholder="جستجوی نام دستگاه"
          :value="searchTerm"
          @input="setSearchTerm(($event.target as HTMLInputElement).value)"
        />
        🔍
      </label>
      <div class="flex flex-wrap gap-3 text-sm">
        <label class="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            class="toggle toggle-success"
            :checked="filterOnline"
            @change="setFilterOnline(($event.target as HTMLInputElement).checked)"
          />
          <span>فقط آنلاین‌ها</span>
        </label>
        <label class="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            class="toggle toggle-info"
            :checked="filterAvailable"
            @change="setFilterAvailable(($event.target as HTMLInputElement).checked)"
          />
          <span>فقط در دسترس‌ها</span>
        </label>
      </div>
    </section>

    <main class="flex-1 grid lg:grid-cols-[400px_1fr] gap-4 px-4 lg:px-6 pb-6">
      <aside class="hidden lg:block overflow-hidden">
        <DeviceList
          :devices="filteredDevices"
          :selected-id="selectedId || undefined"
          :loading="loading"
          :filter-online="filterOnline"
          :filter-available="filterAvailable"
          :search-term="searchTerm"
          @select="handleSelect"
          @update:filterOnline="setFilterOnline"
          @update:filterAvailable="setFilterAvailable"
          @update:search="setSearchTerm"
          @play-sound="playSound"
          @toggle-lost="toggleLostMode"
          @wipe="wipeDevice"
        />
      </aside>

      <section class="relative min-h-[70vh]">
        <MapView
          :devices="filteredDevices"
          :selected-device="selectedDevice"
          @select-device="handleSelect"
        />
        <div class="absolute top-3 left-3 right-3 lg:left-auto lg:right-4 flex justify-end pointer-events-none">
          <div class="bg-base-100/90 backdrop-blur rounded-xl shadow px-3 py-2 text-sm flex items-center gap-2 pointer-events-auto">
            <span class="badge badge-success">آنلاین: {{ filteredDevices.filter((d) => d.isOnline).length }}</span>
            <span class="badge badge-info">در دسترس: {{ filteredDevices.filter((d) => d.isAvailable).length }}</span>
          </div>
        </div>
        <button
          class="btn btn-primary lg:hidden fixed bottom-4 left-4 right-4 shadow-lg"
          @click="isSheetOpen = true"
        >
          مشاهده لیست دستگاه‌ها
        </button>
      </section>
    </main>

    <MobileDeviceSheet
      :open="isSheetOpen"
      :devices="filteredDevices"
      :selected-id="selectedId || undefined"
      :loading="loading"
      @close="isSheetOpen = false"
      @select="handleSelect"
      @play-sound="playSound"
      @toggle-lost="toggleLostMode"
      @wipe="wipeDevice"
    />

    <div class="toast-container">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="alert toast-item"
        :class="{
          'alert-success': toast.type === 'success',
          'alert-warning': toast.type === 'warning',
          'alert-info': !toast.type,
        }"
      >
        <div class="flex-1">{{ toast.message }}</div>
        <button class="btn btn-ghost btn-xs" @click="dismissToast(toast.id)">x</button>
      </div>
    </div>

    <div v-if="error" class="alert alert-error m-4">{{ error }}</div>
  </div>
</template>
