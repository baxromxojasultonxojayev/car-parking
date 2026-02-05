import { create } from 'zustand'
import {
  Location,
  Floor,
  Box,
  Ticket,
  Membership,
  Session,
  Request,
  Payment,
  SessionStatus,
  RequestStatus,
  TicketState,
  BoxStatus,
} from '../types'
import {
  locationsMock,
  floorsMock,
  boxesMock,
  ticketsMock,
  membershipsMock,
  sessionsMock,
  requestsMock,
  paymentsMock,
} from '../mocks'

interface DataState {
  // Data
  locations: Location[]
  floors: Floor[]
  boxes: Box[]
  tickets: Ticket[]
  memberships: Membership[]
  sessions: Session[]
  requests: Request[]
  payments: Payment[]

  // Location actions
  addLocation: (location: Omit<Location, 'id'>) => void
  updateLocation: (id: string, data: Partial<Location>) => void
  deleteLocation: (id: string) => void

  // Floor actions
  addFloor: (floor: Omit<Floor, 'id'>) => void
  updateFloor: (id: string, data: Partial<Floor>) => void
  deleteFloor: (id: string) => void

  // Box actions
  updateBoxStatus: (id: string, status: BoxStatus) => void

  // Ticket actions
  generateTickets: (count: number) => void
  retireTicket: (id: string) => void
  assignTicket: (ticketId: string, sessionId: string, plate: string) => void
  returnTicket: (id: string) => void

  // Membership actions
  addMembership: (membership: Omit<Membership, 'id'>) => void
  deleteMembership: (id: string) => void

  // Session actions
  createSession: (session: Omit<Session, 'id' | 'created_at'>) => void
  updateSessionStatus: (id: string, status: SessionStatus, boxId?: string, boxCode?: string) => void

  // Request actions
  createRequest: (request: Omit<Request, 'id' | 'created_at'>) => void
  updateRequestStatus: (id: string, status: RequestStatus, claimedBy?: string, claimedByName?: string) => void
  claimRequest: (id: string, userId: string, userName: string) => void

  // Payment actions
  updatePaymentStatus: (id: string, status: 'PAID' | 'FAILED') => void
}

const generateId = () => Date.now().toString() + Math.random().toString(36).substr(2, 9)

export const useDataStore = create<DataState>((set, get) => ({
  // Initialize with mock data
  locations: [...locationsMock],
  floors: [...floorsMock],
  boxes: [...boxesMock],
  tickets: [...ticketsMock],
  memberships: [...membershipsMock],
  sessions: [...sessionsMock],
  requests: [...requestsMock],
  payments: [...paymentsMock],

  // Location actions
  addLocation: (location) => {
    const newLocation: Location = {
      ...location,
      id: generateId(),
    }
    set((state) => ({ locations: [...state.locations, newLocation] }))
  },

  updateLocation: (id, data) => {
    set((state) => ({
      locations: state.locations.map((loc) => (loc.id === id ? { ...loc, ...data } : loc)),
    }))
  },

  deleteLocation: (id) => {
    set((state) => ({
      locations: state.locations.filter((loc) => loc.id !== id),
    }))
  },

  // Floor actions
  addFloor: (floor) => {
    const newFloor: Floor = {
      ...floor,
      id: generateId(),
    }
    set((state) => ({ floors: [...state.floors, newFloor] }))
  },

  updateFloor: (id, data) => {
    set((state) => ({
      floors: state.floors.map((floor) => (floor.id === id ? { ...floor, ...data } : floor)),
    }))
  },

  deleteFloor: (id) => {
    set((state) => ({
      floors: state.floors.filter((floor) => floor.id !== id),
    }))
  },

  // Box actions
  updateBoxStatus: (id, status) => {
    set((state) => ({
      boxes: state.boxes.map((box) => (box.id === id ? { ...box, status } : box)),
    }))
  },

  // Ticket actions
  generateTickets: (count) => {
    const { tickets } = get()
    const maxSerial = Math.max(0, ...tickets.map((t) => parseInt(t.serial.split('-')[1]) || 0))
    const newTickets: Ticket[] = []

    for (let i = 1; i <= count; i++) {
      newTickets.push({
        id: generateId(),
        serial: `TKT-${String(maxSerial + i).padStart(4, '0')}`,
        state: 'AVAILABLE',
      })
    }

    set((state) => ({ tickets: [...state.tickets, ...newTickets] }))
  },

  retireTicket: (id) => {
    set((state) => ({
      tickets: state.tickets.map((ticket) =>
        ticket.id === id ? { ...ticket, state: 'RETIRED' as TicketState } : ticket
      ),
    }))
  },

  assignTicket: (ticketId, sessionId, plate) => {
    set((state) => ({
      tickets: state.tickets.map((ticket) =>
        ticket.id === ticketId
          ? {
              ...ticket,
              state: 'ASSIGNED' as TicketState,
              assigned_session_id: sessionId,
              assigned_session_plate: plate,
            }
          : ticket
      ),
    }))
  },

  returnTicket: (id) => {
    set((state) => ({
      tickets: state.tickets.map((ticket) =>
        ticket.id === id
          ? {
              ...ticket,
              state: 'RETURNED' as TicketState,
              assigned_session_id: undefined,
              assigned_session_plate: undefined,
            }
          : ticket
      ),
    }))
  },

  // Membership actions
  addMembership: (membership) => {
    const newMembership: Membership = {
      ...membership,
      id: generateId(),
    }
    set((state) => ({ memberships: [...state.memberships, newMembership] }))
  },

  deleteMembership: (id) => {
    set((state) => ({
      memberships: state.memberships.filter((m) => m.id !== id),
    }))
  },

  // Session actions
  createSession: (session) => {
    const newSession: Session = {
      ...session,
      id: generateId(),
      created_at: new Date().toISOString(),
    }
    set((state) => ({ sessions: [...state.sessions, newSession] }))
    return newSession
  },

  updateSessionStatus: (id, status, boxId, boxCode) => {
    set((state) => ({
      sessions: state.sessions.map((session) =>
        session.id === id
          ? {
              ...session,
              status,
              parking_box_id: boxId || session.parking_box_id,
              parking_box_code: boxCode || session.parking_box_code,
              parked_at: status === 'PARKED' ? new Date().toISOString() : session.parked_at,
            }
          : session
      ),
    }))
  },

  // Request actions
  createRequest: (request) => {
    const newRequest: Request = {
      ...request,
      id: generateId(),
      created_at: new Date().toISOString(),
    }
    set((state) => ({ requests: [...state.requests, newRequest] }))
  },

  updateRequestStatus: (id, status, claimedBy, claimedByName) => {
    set((state) => ({
      requests: state.requests.map((request) =>
        request.id === id
          ? {
              ...request,
              status,
              claimed_by: claimedBy || request.claimed_by,
              claimed_by_name: claimedByName || request.claimed_by_name,
            }
          : request
      ),
    }))
  },

  claimRequest: (id, userId, userName) => {
    set((state) => ({
      requests: state.requests.map((request) =>
        request.id === id
          ? {
              ...request,
              status: 'CLAIMED' as RequestStatus,
              claimed_by: userId,
              claimed_by_name: userName,
            }
          : request
      ),
    }))
  },

  // Payment actions
  updatePaymentStatus: (id, status) => {
    set((state) => ({
      payments: state.payments.map((payment) =>
        payment.id === id
          ? {
              ...payment,
              status,
              paid_at: status === 'PAID' ? new Date().toISOString() : payment.paid_at,
            }
          : payment
      ),
    }))

    // Also update the request payment status
    const payment = get().payments.find((p) => p.id === id)
    if (payment) {
      set((state) => ({
        requests: state.requests.map((request) =>
          request.id === payment.request_id ? { ...request, payment_status: status } : request
        ),
      }))
    }
  },
}))
