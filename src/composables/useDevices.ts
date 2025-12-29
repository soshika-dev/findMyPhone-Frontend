import { computed, onMounted, onUnmounted, ref } from 'vue'
import type { Device } from '@/types/device'
import {
  fetchDevices,
  performDeviceAction,
  subscribeToDeviceUpdates,
  toggleLostMode as serviceToggleLostMode,
  wipeDevice as serviceWipeDevice,
} from '@/services/devices.service'

type Toast = {
  id: number
  message: string
  type?: 'info' | 'success' | 'warning'
}

const toastId = () => Date.now() + Math.random()

export function useDevices() {
  const devices = ref<Device[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const selectedId = ref<string | null>(null)
  const searchTerm = ref('')
  const filterOnline = ref(false)
  const filterAvailable = ref(false)
  const toasts = ref<Toast[]>([])
  const unsubscribers: Array<() => void> = []

  const filteredDevices = computed(() => {
    const term = searchTerm.value.trim().toLowerCase()
    return devices.value.filter((device) => {
      const matchesSearch = device.name.toLowerCase().includes(term)
      const matchesOnline = filterOnline.value ? device.isOnline : true
      const matchesAvailable = filterAvailable.value ? device.isAvailable : true
      return matchesSearch && matchesOnline && matchesAvailable
    })
  })

  const selectedDevice = computed(() =>
    devices.value.find((device) => device.id === selectedId.value) || null,
  )

  const loadDevices = async () => {
    loading.value = true
    error.value = null
    try {
      const result = await fetchDevices()
      devices.value = result
      if (result.length) {
        const firstAvailable = result.find((d) => d.isOnline && d.isAvailable)
        selectedId.value = firstAvailable?.id || result[0].id
      }
      const unsub = subscribeToDeviceUpdates((updated) => {
        devices.value = updated
      })
      unsubscribers.push(unsub)
    } catch (err) {
      error.value = 'بارگذاری دستگاه‌ها با مشکل مواجه شد'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  const selectDevice = (id: string) => {
    selectedId.value = id
  }

  const setSearchTerm = (value: string) => {
    searchTerm.value = value
  }

  const setFilterOnline = (value: boolean) => {
    filterOnline.value = value
  }

  const setFilterAvailable = (value: boolean) => {
    filterAvailable.value = value
  }

  const pushToast = (message: string, type: Toast['type'] = 'info') => {
    const id = toastId()
    toasts.value.push({ id, message, type })
    setTimeout(() => dismissToast(id), 4000)
  }

  const dismissToast = (id: number) => {
    toasts.value = toasts.value.filter((toast) => toast.id !== id)
  }

  const playSound = async (device: Device) => {
    await performDeviceAction(device.id, 'playSound')
    pushToast(`درخواست پخش صدا برای ${device.name} ارسال شد`, 'success')
  }

  const toggleLostMode = async (device: Device) => {
    const updated = await serviceToggleLostMode(device.id, !device.lostMode)
    if (updated) {
      devices.value = devices.value.map((d) => (d.id === updated.id ? updated : d))
      pushToast(
        `${updated.lostMode ? 'حالت گم‌شده فعال شد برای' : 'حالت گم‌شده خاموش شد برای'} ${updated.name}`,
        'warning',
      )
    }
  }

  const wipeDevice = async (device: Device) => {
    const updated = await serviceWipeDevice(device.id)
    if (updated) {
      devices.value = devices.value.map((d) => (d.id === updated.id ? updated : d))
      pushToast(`پاک کردن ${updated.name} ثبت شد`, 'warning')
    }
  }

  onMounted(() => {
    loadDevices()
  })

  onUnmounted(() => {
    unsubscribers.forEach((fn) => fn())
  })

  return {
    devices,
    filteredDevices,
    selectedDevice,
    selectedId,
    loading,
    error,
    searchTerm,
    filterOnline,
    filterAvailable,
    setSearchTerm,
    setFilterOnline,
    setFilterAvailable,
    selectDevice,
    playSound,
    toggleLostMode,
    wipeDevice,
    loadDevices,
    toasts,
    dismissToast,
  }
}
