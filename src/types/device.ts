export interface DeviceLocation {
  lat: number
  lng: number
}

export interface Device {
  id: string
  name: string
  model: string
  battery: number
  isOnline: boolean
  isAvailable: boolean
  lastUpdate: string
  location: DeviceLocation
  addressText: string
  lostMode?: boolean
  wiped?: boolean
}
