import { Floor } from '../types'
import { getLocationName } from './locations'

export const floorsMock: Floor[] = [
  { id: '1', location_id: '1', name: 'B1 - Basement' },
  { id: '2', location_id: '1', name: 'B2 - Lower Basement' },
  { id: '3', location_id: '1', name: 'G - Ground Floor' },
  { id: '4', location_id: '2', name: 'P1 - Parking Level 1' },
  { id: '5', location_id: '2', name: 'P2 - Parking Level 2' },
  { id: '6', location_id: '3', name: 'Underground Parking' },
  { id: '7', location_id: '3', name: 'Rooftop Parking' },
  { id: '8', location_id: '4', name: 'Basement Parking' },
  { id: '9', location_id: '5', name: 'Level -1' },
  { id: '10', location_id: '5', name: 'Level -2' },
]

export const getFloorsWithLocation = (): (Floor & { location_name: string })[] => {
  return floorsMock.map((floor) => ({
    ...floor,
    location_name: getLocationName(floor.location_id),
  }))
}

export const getFloorById = (id: string): Floor | undefined => {
  return floorsMock.find((floor) => floor.id === id)
}

export const getFloorName = (id: string): string => {
  const floor = getFloorById(id)
  return floor?.name || 'Unknown'
}

export const getFloorsByLocation = (locationId: string): Floor[] => {
  return floorsMock.filter((floor) => floor.location_id === locationId)
}
