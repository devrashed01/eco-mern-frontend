type AuthState = {
  user?: User
  token?: string
  isDrawerShow: boolean
  setDrawerShow: React.Dispatch<React.SetStateAction<boolean>>
  setUser: (user: User) => void
  setToken: (token: string) => void
  logOut: () => void
}

type User = {
  _id: string
  name: string
  email: string
  phone: string
  status: UserStatus
  commission: number
  address: string
  role: UserRole
  createdAt: Date
  updatedAt: Date
  avatar?: string
  __v: number
}

type UserStatus = 'active' | 'inactive' | 'pending'
type UserRole = 'admin' | 'seller'
