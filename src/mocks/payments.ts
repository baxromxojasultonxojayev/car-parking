import { Payment } from '../types'

export const paymentsMock: Payment[] = [
  {
    id: '1',
    request_id: '3',
    amount: 50000,
    status: 'PAID',
    provider: 'PAYME',
    paid_at: '2024-01-20T13:45:00Z',
  },
  {
    id: '2',
    request_id: '4',
    amount: 75000,
    status: 'PAID',
    provider: 'CLICK',
    paid_at: '2024-01-20T17:15:00Z',
  },
  {
    id: '3',
    request_id: '5',
    amount: 45000,
    status: 'PAID',
    provider: 'CASH',
    paid_at: '2024-01-19T16:30:00Z',
  },
  {
    id: '4',
    request_id: '6',
    amount: 60000,
    status: 'PAID',
    provider: 'CARD',
    paid_at: '2024-01-19T18:30:00Z',
  },
  {
    id: '5',
    request_id: '1',
    amount: 55000,
    status: 'PENDING',
    provider: 'PAYME',
  },
  {
    id: '6',
    request_id: '2',
    amount: 40000,
    status: 'PENDING',
    provider: 'CLICK',
  },
]

export const getPaymentById = (id: string): Payment | undefined => {
  return paymentsMock.find((payment) => payment.id === id)
}

export const getPaymentByRequestId = (requestId: string): Payment | undefined => {
  return paymentsMock.find((payment) => payment.request_id === requestId)
}

export const getPaidPayments = (): Payment[] => {
  return paymentsMock.filter((p) => p.status === 'PAID')
}

export const getPendingPayments = (): Payment[] => {
  return paymentsMock.filter((p) => p.status === 'PENDING')
}

export const getTotalPaidAmount = (): number => {
  return getPaidPayments().reduce((sum, p) => sum + p.amount, 0)
}
