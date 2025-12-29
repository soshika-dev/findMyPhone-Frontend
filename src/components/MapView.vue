<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue'
import L from 'leaflet'
import type { Device } from '@/types/device'
import 'leaflet/dist/leaflet.css'
import { formatBattery } from '@/utils/format'

const props = defineProps<{
  devices: Device[]
  selectedDevice: Device | null
}>()

const emit = defineEmits<{ (e: 'select-device', id: string): void }>()

const map = ref<L.Map | null>(null)
const mapContainer = ref<HTMLDivElement | null>(null)
const markers = new Map<string, L.Marker>()

const createIcon = (device: Device) => {
  const statusColor = device.isOnline ? '#22c55e' : '#9ca3af'
  const ringColor = device.lostMode ? '#facc15' : '#6366f1'
  const html = `<div style="width:18px;height:18px;border-radius:50%;background:${statusColor};border:3px solid ${ringColor};box-shadow:0 0 0 4px rgba(99,102,241,0.15);"></div>`
  return L.divIcon({ html, className: 'device-marker', iconSize: [18, 18] })
}

const renderMarkers = () => {
  if (!map.value) return
  const existingIds = new Set(markers.keys())
  props.devices.forEach((device) => {
    const position: [number, number] = [device.location.lat, device.location.lng]
    if (markers.has(device.id)) {
      const marker = markers.get(device.id)!
      marker.setLatLng(position)
      marker.setIcon(createIcon(device))
      marker.bindTooltip(`${device.name} – ${batteryLabel(device)} – ${device.isOnline ? 'آنلاین' : 'آفلاین'}`)
    } else {
      const marker = L.marker(position, { icon: createIcon(device) })
      marker.bindTooltip(`${device.name} – ${batteryLabel(device)} – ${device.isOnline ? 'آنلاین' : 'آفلاین'}`)
      marker.on('click', () => emit('select-device', device.id))
      marker.addTo(map.value!)
      markers.set(device.id, marker)
    }
    existingIds.delete(device.id)
  })
  existingIds.forEach((id) => {
    const marker = markers.get(id)
    if (marker && map.value) {
      marker.remove()
      markers.delete(id)
    }
  })
}

const batteryLabel = (device: Device) => `${formatBattery(device.battery)}`

const focusOnSelected = () => {
  if (!map.value || !props.selectedDevice) return
  const { lat, lng } = props.selectedDevice.location
  map.value.flyTo([lat, lng], 12, { duration: 0.6 })
  const marker = markers.get(props.selectedDevice.id)
  if (marker) marker.openTooltip()
}

onMounted(() => {
  if (!mapContainer.value) return
  map.value = L.map(mapContainer.value, {
    center: [32.4279, 53.688],
    zoom: 6,
    zoomControl: false,
  })
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap',
  }).addTo(map.value)

  renderMarkers()
  focusOnSelected()
})

watch(
  () => props.devices,
  () => {
    renderMarkers()
  },
  { deep: true },
)

watch(
  () => props.selectedDevice?.id,
  () => {
    focusOnSelected()
  },
)

onUnmounted(() => {
  markers.forEach((marker) => marker.remove())
  markers.clear()
  map.value?.remove()
})
</script>

<template>
  <div class="w-full h-full relative">
    <div ref="mapContainer" class="absolute inset-0 rounded-2xl overflow-hidden shadow bg-base-200"></div>
  </div>
</template>
