import { Location } from '../types'

export const locationsMock: Location[] = [
  {
    id: '1',
    name: 'Grand Hotel Tashkent',
    created_at: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    name: 'Intercontinental Hotel',
    created_at: '2024-02-20T14:30:00Z',
  },
  {
    id: '3',
    name: 'Hilton Tashkent City',
    created_at: '2024-03-10T09:15:00Z',
  },
  {
    id: '4',
    name: 'Hyatt Regency Tashkent',
    created_at: '2024-04-05T11:00:00Z',
  },
  {
    id: '5',
    name: 'Lotte City Hotel',
    created_at: '2024-05-12T16:45:00Z',
  },
]

export const getLocationById = (id: string): Location | undefined => {
  return locationsMock.find((loc) => loc.id === id)
}

export const getLocationName = (id: string): string => {
  const location = getLocationById(id)
  return location?.name || 'Unknown'
}
