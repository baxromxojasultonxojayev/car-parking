import { create } from 'zustand'

export interface Booking {
  id: string
  guestName: string
  roomId: string
  roomNumber: string
  checkIn: string
  checkOut: string
  status: 'pending' | 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled'
  totalPrice: number
  guestEmail: string
  guestPhone: string
}

interface BookingsState {
  bookings: Booking[]
  addBooking: (booking: Omit<Booking, 'id'>) => void
  updateBooking: (id: string, booking: Omit<Booking, 'id'>) => void
  deleteBooking: (id: string) => void
}

const initialBookings: Booking[] = [
  {
    id: '1',
    guestName: 'John Doe',
    roomId: '1',
    roomNumber: '101',
    checkIn: '2024-01-30',
    checkOut: '2024-02-02',
    status: 'checked_in',
    totalPrice: 300,
    guestEmail: 'john@example.com',
    guestPhone: '+1234567890',
  },
  {
    id: '2',
    guestName: 'Jane Smith',
    roomId: '2',
    roomNumber: '205',
    checkIn: '2024-02-01',
    checkOut: '2024-02-05',
    status: 'pending',
    totalPrice: 400,
    guestEmail: 'jane@example.com',
    guestPhone: '+0987654321',
  },
]

export const useBookingsStore = create<BookingsState>((set) => ({
  bookings: initialBookings,

  addBooking: (booking) => {
    set((state) => ({
      bookings: [
        ...state.bookings,
        {
          ...booking,
          id: Date.now().toString(),
        },
      ],
    }))
  },

  updateBooking: (id, booking) => {
    set((state) => ({
      bookings: state.bookings.map((b) => (b.id === id ? { ...booking, id } : b)),
    }))
  },

  deleteBooking: (id) => {
    set((state) => ({
      bookings: state.bookings.filter((b) => b.id !== id),
    }))
  },
}))
