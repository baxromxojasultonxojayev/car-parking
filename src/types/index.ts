// Role Types
export type Role = 'SUPER_ADMIN' | 'ADMIN' | 'VALET'

// User Type
export interface User {
  id: string
  name: string
  role: Role
}

// Location
export interface Location {
  id: string
  name: string
  created_at: string
}

// Floor
export interface Floor {
  id: string
  location_id: string
  location_name?: string
  name: string
}

// Box Status
export type BoxStatus = 'FREE' | 'BUSY'

// Box
export interface Box {
  id: string
  code: string
  floor_id: string
  floor_name?: string
  location_id: string
  location_name?: string
  status: BoxStatus
}

// Ticket State
export type TicketState = 'AVAILABLE' | 'ASSIGNED' | 'RETURNED' | 'RETIRED'

// Ticket
export interface Ticket {
  id: string
  serial: string
  state: TicketState
  assigned_session_id?: string
  assigned_session_plate?: string
}

// Membership Role
export type MembershipRole = 'ADMIN' | 'VALET'

// Membership
export interface Membership {
  id: string
  user_name: string
  location_id: string
  location_name?: string
  role: MembershipRole
}

// Session Status
export type SessionStatus = 'CREATED' | 'PARKED' | 'CANCELLED' | 'COMPLETED'

// Session
export interface Session {
  id: string
  ticket_serial: string
  ticket_id: string
  vehicle_plate: string
  customer_name: string
  customer_phone?: string
  status: SessionStatus
  parking_box_id?: string
  parking_box_code?: string
  created_at: string
  parked_at?: string
}

// Request Status
export type RequestStatus = 'OPEN' | 'CLAIMED' | 'IN_PROGRESS' | 'READY' | 'DONE' | 'CANCELLED'

// Payment Status
export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED'

// Request
export interface Request {
  id: string
  session_id: string
  session_plate: string
  requested_for: string
  status: RequestStatus
  payment_status: PaymentStatus
  claimed_by?: string
  claimed_by_name?: string
  created_at: string
}

// Payment Provider
export type PaymentProvider = 'CASH' | 'CARD' | 'PAYME' | 'CLICK'

// Payment
export interface Payment {
  id: string
  request_id: string
  amount: number
  status: PaymentStatus
  provider: PaymentProvider
  paid_at?: string
}

// Status Colors Map
export const STATUS_COLORS: Record<string, string> = {
  // Session statuses
  CREATED: 'default',
  PARKED: 'blue',
  CANCELLED: 'red',
  COMPLETED: 'green',
  // Request statuses
  OPEN: 'orange',
  CLAIMED: 'purple',
  IN_PROGRESS: 'purple',
  READY: 'cyan',
  DONE: 'green',
  // Ticket states
  AVAILABLE: 'green',
  ASSIGNED: 'blue',
  RETURNED: 'orange',
  RETIRED: 'default',
  // Box statuses
  FREE: 'green',
  BUSY: 'red',
  // Payment statuses
  PENDING: 'orange',
  PAID: 'green',
  FAILED: 'red',
}

// Role permissions
export const ROLE_PERMISSIONS: Record<Role, string[]> = {
  SUPER_ADMIN: [
    '/dashboard',
    '/locations',
    '/floors',
    '/boxes',
    '/tickets',
    '/memberships',
    '/sessions',
    '/requests',
    '/payments',
  ],
  ADMIN: ['/dashboard', '/sessions', '/requests', '/payments'],
  VALET: ['/dashboard', '/sessions', '/requests'],
}
