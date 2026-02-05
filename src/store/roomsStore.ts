import { create } from 'zustand'

export interface Room {
  id: string
  number: string
  type: 'single' | 'double' | 'suite' | 'deluxe'
  capacity: number
  pricePerNight: number
  status: 'available' | 'occupied' | 'maintenance'
}

interface RoomsState {
  rooms: Room[]
  addRoom: (room: Omit<Room, 'id'>) => void
  updateRoom: (id: string, room: Omit<Room, 'id'>) => void
  deleteRoom: (id: string) => void
}

const initialRooms: Room[] = [
  {
    id: '1',
    number: '101',
    type: 'single',
    capacity: 1,
    pricePerNight: 50,
    status: 'available',
  },
  {
    id: '2',
    number: '102',
    type: 'double',
    capacity: 2,
    pricePerNight: 80,
    status: 'occupied',
  },
  {
    id: '3',
    number: '201',
    type: 'suite',
    capacity: 3,
    pricePerNight: 150,
    status: 'available',
  },
  {
    id: '4',
    number: '301',
    type: 'deluxe',
    capacity: 4,
    pricePerNight: 200,
    status: 'maintenance',
  },
]

export const useRoomsStore = create<RoomsState>((set) => ({
  rooms: initialRooms,

  addRoom: (room) => {
    set((state) => ({
      rooms: [
        ...state.rooms,
        {
          ...room,
          id: Date.now().toString(),
        },
      ],
    }))
  },

  updateRoom: (id, room) => {
    set((state) => ({
      rooms: state.rooms.map((r) => (r.id === id ? { ...room, id } : r)),
    }))
  },

  deleteRoom: (id) => {
    set((state) => ({
      rooms: state.rooms.filter((r) => r.id !== id),
    }))
  },
}))
