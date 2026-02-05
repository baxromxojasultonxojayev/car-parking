import { Box } from '../types'
import { getFloorName, getFloorById } from './floors'
import { getLocationName } from './locations'

export const boxesMock: Box[] = [
  { id: '1', code: 'A-001', floor_id: '1', location_id: '1', status: 'FREE' },
  { id: '2', code: 'A-002', floor_id: '1', location_id: '1', status: 'BUSY' },
  { id: '3', code: 'A-003', floor_id: '1', location_id: '1', status: 'FREE' },
  { id: '4', code: 'B-001', floor_id: '2', location_id: '1', status: 'BUSY' },
  { id: '5', code: 'B-002', floor_id: '2', location_id: '1', status: 'FREE' },
  { id: '6', code: 'P1-001', floor_id: '4', location_id: '2', status: 'FREE' },
  { id: '7', code: 'P1-002', floor_id: '4', location_id: '2', status: 'BUSY' },
  { id: '8', code: 'P1-003', floor_id: '4', location_id: '2', status: 'FREE' },
  { id: '9', code: 'P2-001', floor_id: '5', location_id: '2', status: 'FREE' },
  { id: '10', code: 'P2-002', floor_id: '5', location_id: '2', status: 'BUSY' },
  { id: '11', code: 'UG-001', floor_id: '6', location_id: '3', status: 'FREE' },
  { id: '12', code: 'UG-002', floor_id: '6', location_id: '3', status: 'FREE' },
  { id: '13', code: 'RT-001', floor_id: '7', location_id: '3', status: 'BUSY' },
  { id: '14', code: 'BP-001', floor_id: '8', location_id: '4', status: 'FREE' },
  { id: '15', code: 'BP-002', floor_id: '8', location_id: '4', status: 'BUSY' },
]

export const getBoxesWithDetails = (): (Box & {
  floor_name: string
  location_name: string
})[] => {
  return boxesMock.map((box) => ({
    ...box,
    floor_name: getFloorName(box.floor_id),
    location_name: getLocationName(box.location_id),
  }))
}

export const getBoxById = (id: string): Box | undefined => {
  return boxesMock.find((box) => box.id === id)
}

export const getBoxCode = (id: string): string => {
  const box = getBoxById(id)
  return box?.code || 'Unknown'
}

export const getFreeBoxes = (): Box[] => {
  return boxesMock.filter((box) => box.status === 'FREE')
}

export const getBoxesByFloor = (floorId: string): Box[] => {
  return boxesMock.filter((box) => box.floor_id === floorId)
}
