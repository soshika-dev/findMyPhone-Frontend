import type { Device } from '@/types/device'
import { delay } from './api'

const baseDevices: Device[] = [
  {
    id: '1',
    name: 'Mobodo K200 - سعید',
    model: 'Mobodo K200',
    battery: 87,
    isOnline: true,
    isAvailable: true,
    lastUpdate: new Date().toISOString(),
    location: { lat: 35.6892, lng: 51.389 },
    addressText: 'خیابان آزادی، تهران',
  },
  {
    id: '2',
    name: 'Ario X2 - نرگس',
    model: 'Ario X2',
    battery: 62,
    isOnline: true,
    isAvailable: true,
    lastUpdate: new Date().toISOString(),
    location: { lat: 32.6539, lng: 51.666 },
    addressText: 'میدان نقش‌جهان، اصفهان',
  },
  {
    id: '3',
    name: 'Hami Lite - پویا',
    model: 'Hami Lite',
    battery: 34,
    isOnline: true,
    isAvailable: false,
    lastUpdate: new Date(Date.now() - 1000 * 60 * 7).toISOString(),
    location: { lat: 29.5918, lng: 52.5836 },
    addressText: 'بلوار معالی‌آباد، شیراز',
  },
  {
    id: '4',
    name: 'Aftab Mini - الهام',
    model: 'Aftab Mini',
    battery: 90,
    isOnline: false,
    isAvailable: false,
    lastUpdate: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    location: { lat: 36.2605, lng: 59.6168 },
    addressText: 'خیابان احمدآباد، مشهد',
  },
  {
    id: '5',
    name: 'Shenasa Air - سارا',
    model: 'Shenasa Air',
    battery: 18,
    isOnline: true,
    isAvailable: true,
    lastUpdate: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
    location: { lat: 35.7153, lng: 51.4229 },
    addressText: 'ولیعصر، تهران',
  },
  {
    id: '6',
    name: 'Lian Ultra - رضا',
    model: 'Lian Ultra',
    battery: 75,
    isOnline: true,
    isAvailable: true,
    lastUpdate: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    location: { lat: 37.2768, lng: 49.592 },
    addressText: 'بلوار انصاری، رشت',
  },
  {
    id: '7',
    name: 'Kavir Edge - ملیسا',
    model: 'Kavir Edge',
    battery: 48,
    isOnline: false,
    isAvailable: true,
    lastUpdate: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    location: { lat: 38.0962, lng: 46.2738 },
    addressText: 'چهارراه ولیعصر، تبریز',
  },
]

let devices: Device[] = JSON.parse(JSON.stringify(baseDevices))

type UpdateListener = (devices: Device[]) => void
let subscribers: UpdateListener[] = []
let intervalId: number | null = null

function broadcast() {
  const snapshot = devices.map((d) => ({ ...d }))
  subscribers.forEach((cb) => cb(snapshot))
}

function driftCoordinate(value: number) {
  const delta = (Math.random() - 0.5) * 0.001
  return value + delta
}

function tick() {
  const now = Date.now()
  devices = devices.map((device) => {
    if (!device.isOnline || device.wiped) return device
    const nextBattery = Math.max(0, device.battery - Math.random() * 1.2)
    const becameOffline = nextBattery <= 0
    return {
      ...device,
      battery: Number(nextBattery.toFixed(1)),
      isOnline: !becameOffline,
      lastUpdate: new Date(now).toISOString(),
      location: {
        lat: driftCoordinate(device.location.lat),
        lng: driftCoordinate(device.location.lng),
      },
    }
  })
  broadcast()
}

export async function fetchDevices(): Promise<Device[]> {
  await delay(350)
  return devices.map((d) => ({ ...d }))
}

export function subscribeToDeviceUpdates(callback: UpdateListener) {
  subscribers.push(callback)
  if (!intervalId) {
    intervalId = window.setInterval(tick, 3000)
  }
  callback(devices.map((d) => ({ ...d })))
  return () => {
    subscribers = subscribers.filter((fn) => fn !== callback)
    if (!subscribers.length && intervalId) {
      clearInterval(intervalId)
      intervalId = null
    }
  }
}

export async function performDeviceAction(id: string, action: 'playSound'): Promise<Device | null> {
  await delay(200)
  return devices.find((d) => d.id === id) || null
}

export async function toggleLostMode(id: string, nextState: boolean): Promise<Device | null> {
  const device = devices.find((d) => d.id === id)
  if (!device) return null
  await delay(200)
  const updated: Device = { ...device, lostMode: nextState }
  devices = devices.map((d) => (d.id === id ? updated : d))
  broadcast()
  return updated
}

export async function wipeDevice(id: string): Promise<Device | null> {
  const device = devices.find((d) => d.id === id)
  if (!device) return null
  await delay(400)
  const updated: Device = {
    ...device,
    wiped: true,
    isOnline: false,
    isAvailable: false,
    battery: 0,
  }
  devices = devices.map((d) => (d.id === id ? updated : d))
  broadcast()
  return updated
}
