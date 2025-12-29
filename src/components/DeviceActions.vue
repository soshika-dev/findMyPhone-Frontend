<script setup lang="ts">
import { ref } from 'vue'
import type { Device } from '@/types/device'

const props = defineProps<{ device: Device }>()
const emit = defineEmits<{
  (e: 'play-sound', device: Device): void
  (e: 'toggle-lost', device: Device): void
  (e: 'wipe', device: Device): void
}>()

const showConfirm = ref(false)
const confirmWipe = () => {
  emit('wipe', props.device)
  showConfirm.value = false
}
</script>

<template>
  <div class="flex flex-col gap-2 mt-3">
    <div class="flex flex-wrap gap-2">
      <button
        class="btn btn-primary btn-sm"
        :disabled="device.wiped"
        @click="emit('play-sound', device)"
      >
        پخش صدا
      </button>
      <button
        class="btn btn-warning btn-sm"
        :disabled="device.wiped"
        @click="emit('toggle-lost', device)"
      >
        {{ device.lostMode ? 'خروج از حالت گم‌شده' : 'حالت گم‌شده' }}
      </button>
      <button class="btn btn-error btn-sm" :disabled="device.wiped" @click="showConfirm = true">
        پاک کردن دستگاه
      </button>
    </div>
    <div v-if="device.wiped" class="alert alert-info text-sm">
      این دستگاه پاک شده و دیگر در دسترس نیست.
    </div>
    <dialog :open="showConfirm" class="modal">
      <div class="modal-box">
        <h3 class="font-bold text-lg">تأیید پاک کردن</h3>
        <p class="py-2">آیا از پاک کردن {{ device.name }} مطمئن هستید؟ این عملیات قابل بازگشت نیست.</p>
        <div class="modal-action">
          <button class="btn btn-ghost" @click="showConfirm = false">انصراف</button>
          <button class="btn btn-error" @click="confirmWipe">بله، پاک کن</button>
        </div>
      </div>
      <form method="dialog" class="modal-backdrop" @click="showConfirm = false">
        <button>close</button>
      </form>
    </dialog>
  </div>
</template>
