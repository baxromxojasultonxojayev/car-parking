import { Request } from '../types'

export const requestsMock: Request[] = [
  {
    id: '1',
    session_id: '1',
    session_plate: '01A123BC',
    requested_for: '2024-01-20T15:00:00Z',
    status: 'OPEN',
    payment_status: 'PENDING',
    created_at: '2024-01-20T14:30:00Z',
  },
  {
    id: '2',
    session_id: '2',
    session_plate: '01B456DE',
    requested_for: '2024-01-20T16:30:00Z',
    status: 'CLAIMED',
    payment_status: 'PENDING',
    claimed_by: '2',
    claimed_by_name: 'Bobur Tursunov',
    created_at: '2024-01-20T15:45:00Z',
  },
  {
    id: '3',
    session_id: '7',
    session_plate: '01G444NO',
    requested_for: '2024-01-20T14:00:00Z',
    status: 'IN_PROGRESS',
    payment_status: 'PAID',
    claimed_by: '3',
    claimed_by_name: 'Sardor Aliyev',
    created_at: '2024-01-20T13:30:00Z',
  },
  {
    id: '4',
    session_id: '8',
    session_plate: '01H555PQ',
    requested_for: '2024-01-20T18:00:00Z',
    status: 'READY',
    payment_status: 'PAID',
    claimed_by: '5',
    claimed_by_name: 'Javlon Yusupov',
    created_at: '2024-01-20T17:00:00Z',
  },
  {
    id: '5',
    session_id: '4',
    session_plate: '01D111HI',
    requested_for: '2024-01-19T17:00:00Z',
    status: 'DONE',
    payment_status: 'PAID',
    claimed_by: '7',
    claimed_by_name: 'Laziz Nazarov',
    created_at: '2024-01-19T16:00:00Z',
  },
  {
    id: '6',
    session_id: '5',
    session_plate: '01E222JK',
    requested_for: '2024-01-19T19:00:00Z',
    status: 'DONE',
    payment_status: 'PAID',
    claimed_by: '9',
    claimed_by_name: 'Nodir Ismoilov',
    created_at: '2024-01-19T18:00:00Z',
  },
  {
    id: '7',
    session_id: '6',
    session_plate: '01F333LM',
    requested_for: '2024-01-18T12:00:00Z',
    status: 'CANCELLED',
    payment_status: 'PENDING',
    created_at: '2024-01-18T11:00:00Z',
  },
]

export const getRequestById = (id: string): Request | undefined => {
  return requestsMock.find((request) => request.id === id)
}

export const getOpenRequests = (): Request[] => {
  return requestsMock.filter(
    (r) => r.status === 'OPEN' || r.status === 'CLAIMED' || r.status === 'IN_PROGRESS' || r.status === 'READY'
  )
}

export const getRequestsByStatus = (status: Request['status']): Request[] => {
  return requestsMock.filter((r) => r.status === status)
}

export const getPendingPaymentRequests = (): Request[] => {
  return requestsMock.filter((r) => r.payment_status === 'PENDING' && r.status !== 'CANCELLED')
}
