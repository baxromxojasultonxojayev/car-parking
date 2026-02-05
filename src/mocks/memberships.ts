import { Membership } from '../types'
import { getLocationName } from './locations'

export const membershipsMock: Membership[] = [
  { id: '1', user_name: 'Akmal Karimov', location_id: '1', role: 'ADMIN' },
  { id: '2', user_name: 'Bobur Tursunov', location_id: '1', role: 'VALET' },
  { id: '3', user_name: 'Sardor Aliyev', location_id: '1', role: 'VALET' },
  { id: '4', user_name: 'Dilshod Rakhimov', location_id: '2', role: 'ADMIN' },
  { id: '5', user_name: 'Javlon Yusupov', location_id: '2', role: 'VALET' },
  { id: '6', user_name: 'Khamza Umarov', location_id: '3', role: 'ADMIN' },
  { id: '7', user_name: 'Laziz Nazarov', location_id: '3', role: 'VALET' },
  { id: '8', user_name: 'Mirzo Saidov', location_id: '4', role: 'ADMIN' },
  { id: '9', user_name: 'Nodir Ismoilov', location_id: '4', role: 'VALET' },
  { id: '10', user_name: 'Otabek Ergashev', location_id: '5', role: 'VALET' },
]

export const getMembershipsWithLocation = (): (Membership & {
  location_name: string
})[] => {
  return membershipsMock.map((membership) => ({
    ...membership,
    location_name: getLocationName(membership.location_id),
  }))
}

export const getMembershipsByLocation = (locationId: string): Membership[] => {
  return membershipsMock.filter((m) => m.location_id === locationId)
}

export const getMembershipsByRole = (role: 'ADMIN' | 'VALET'): Membership[] => {
  return membershipsMock.filter((m) => m.role === role)
}
