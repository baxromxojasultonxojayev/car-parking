import { Ticket } from '../types'

export const ticketsMock: Ticket[] = [
  { id: '1', serial: 'TKT-0001', state: 'AVAILABLE' },
  { id: '2', serial: 'TKT-0002', state: 'ASSIGNED', assigned_session_id: '1', assigned_session_plate: '01A123BC' },
  { id: '3', serial: 'TKT-0003', state: 'AVAILABLE' },
  { id: '4', serial: 'TKT-0004', state: 'RETURNED' },
  { id: '5', serial: 'TKT-0005', state: 'ASSIGNED', assigned_session_id: '2', assigned_session_plate: '01B456DE' },
  { id: '6', serial: 'TKT-0006', state: 'RETIRED' },
  { id: '7', serial: 'TKT-0007', state: 'AVAILABLE' },
  { id: '8', serial: 'TKT-0008', state: 'AVAILABLE' },
  { id: '9', serial: 'TKT-0009', state: 'ASSIGNED', assigned_session_id: '3', assigned_session_plate: '01C789FG' },
  { id: '10', serial: 'TKT-0010', state: 'AVAILABLE' },
  { id: '11', serial: 'TKT-0011', state: 'RETIRED' },
  { id: '12', serial: 'TKT-0012', state: 'AVAILABLE' },
  { id: '13', serial: 'TKT-0013', state: 'RETURNED' },
  { id: '14', serial: 'TKT-0014', state: 'AVAILABLE' },
  { id: '15', serial: 'TKT-0015', state: 'AVAILABLE' },
]

export const getTicketById = (id: string): Ticket | undefined => {
  return ticketsMock.find((ticket) => ticket.id === id)
}

export const getTicketBySerial = (serial: string): Ticket | undefined => {
  return ticketsMock.find((ticket) => ticket.serial === serial)
}

export const getAvailableTickets = (): Ticket[] => {
  return ticketsMock.filter((ticket) => ticket.state === 'AVAILABLE')
}

export const getAssignedTickets = (): Ticket[] => {
  return ticketsMock.filter((ticket) => ticket.state === 'ASSIGNED')
}

export const generateTicketSerial = (): string => {
  const maxSerial = Math.max(...ticketsMock.map((t) => parseInt(t.serial.split('-')[1])))
  return `TKT-${String(maxSerial + 1).padStart(4, '0')}`
}
