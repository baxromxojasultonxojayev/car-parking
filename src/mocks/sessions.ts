import { Session } from '../types'
import { getBoxCode } from './boxes'

export const sessionsMock: Session[] = [
  {
    id: '1',
    ticket_id: '2',
    ticket_serial: 'TKT-0002',
    vehicle_plate: '01A123BC',
    customer_name: 'Anvar Rahimov',
    customer_phone: '+998901234567',
    status: 'PARKED',
    parking_box_id: '2',
    parking_box_code: 'A-002',
    created_at: '2024-01-20T09:30:00Z',
    parked_at: '2024-01-20T09:35:00Z',
  },
  {
    id: '2',
    ticket_id: '5',
    ticket_serial: 'TKT-0005',
    vehicle_plate: '01B456DE',
    customer_name: 'Bekzod Toshev',
    customer_phone: '+998907654321',
    status: 'PARKED',
    parking_box_id: '4',
    parking_box_code: 'B-001',
    created_at: '2024-01-20T10:15:00Z',
    parked_at: '2024-01-20T10:20:00Z',
  },
  {
    id: '3',
    ticket_id: '9',
    ticket_serial: 'TKT-0009',
    vehicle_plate: '01C789FG',
    customer_name: 'Davron Karimov',
    customer_phone: '+998909876543',
    status: 'CREATED',
    created_at: '2024-01-20T11:00:00Z',
  },
  {
    id: '4',
    ticket_id: '4',
    ticket_serial: 'TKT-0004',
    vehicle_plate: '01D111HI',
    customer_name: 'Eldor Sharipov',
    status: 'COMPLETED',
    parking_box_id: '7',
    parking_box_code: 'P1-002',
    created_at: '2024-01-19T14:00:00Z',
    parked_at: '2024-01-19T14:05:00Z',
  },
  {
    id: '5',
    ticket_id: '13',
    ticket_serial: 'TKT-0013',
    vehicle_plate: '01E222JK',
    customer_name: 'Farhod Nazarov',
    status: 'COMPLETED',
    parking_box_id: '10',
    parking_box_code: 'P2-002',
    created_at: '2024-01-19T16:30:00Z',
    parked_at: '2024-01-19T16:35:00Z',
  },
  {
    id: '6',
    ticket_id: '6',
    ticket_serial: 'TKT-0006',
    vehicle_plate: '01F333LM',
    customer_name: 'Gulom Aliyev',
    status: 'CANCELLED',
    created_at: '2024-01-18T10:00:00Z',
  },
  {
    id: '7',
    ticket_id: '11',
    ticket_serial: 'TKT-0011',
    vehicle_plate: '01G444NO',
    customer_name: 'Hasanboy Umarov',
    status: 'PARKED',
    parking_box_id: '13',
    parking_box_code: 'RT-001',
    created_at: '2024-01-20T08:45:00Z',
    parked_at: '2024-01-20T08:50:00Z',
  },
  {
    id: '8',
    ticket_id: '1',
    ticket_serial: 'TKT-0001',
    vehicle_plate: '01H555PQ',
    customer_name: 'Ilhom Saidov',
    status: 'PARKED',
    parking_box_id: '15',
    parking_box_code: 'BP-002',
    created_at: '2024-01-20T12:00:00Z',
    parked_at: '2024-01-20T12:05:00Z',
  },
]

export const getSessionById = (id: string): Session | undefined => {
  return sessionsMock.find((session) => session.id === id)
}

export const getActiveSessions = (): Session[] => {
  return sessionsMock.filter((s) => s.status === 'CREATED' || s.status === 'PARKED')
}

export const getRecentSessions = (limit: number = 5): Session[] => {
  return [...sessionsMock]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, limit)
}

export const getSessionsByStatus = (status: Session['status']): Session[] => {
  return sessionsMock.filter((s) => s.status === status)
}
