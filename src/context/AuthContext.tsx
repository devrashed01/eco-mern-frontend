import queryString from 'query-string'
import { createContext, PropsWithChildren, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { loginRedirectUrl } from 'utils/url'

const initState: State = {
  user: {},
} as AuthState

export const AuthContext = createContext<AuthState>(initState as AuthState)

type State = {
  user?: User
  token?: string
  isAdmin?: boolean
}

const AuthContextProvider = ({ children }: PropsWithChildren<unknown>) => {
  const { token } = queryString.parse(location.search)
  const [auth, setAuth] = useState<State>({
    user: undefined,
    token: localStorage.getItem('token') ?? (token as string),
    isAdmin: false,
  })

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token as string)
    }
  }, [token])

  const [isDrawerShow, setDrawerShow] = useState<boolean>(false)

  const setUser = (user: User) => {
    setAuth((prev) => ({
      ...prev,
      user: user,
      isAdmin: user.role === 'admin' || user.role === 'superadmin',
    }))
  }

  const setToken = (token: string) => {
    setAuth((prev) => ({ ...prev, token }))
  }

  const logOut = async () => {
    localStorage.removeItem('token')
    window.location.replace(loginRedirectUrl)
    toast.success('Logged out successfully')
    // toast.promise(privateRequest.post('user/logout'), {
    //   loading: 'Logging out...',
    //   success: () => {
    //     localStorage.removeItem('token')
    //     window.location.replace(loginRedirectUrl)
    //     return 'Logged out successfully'
    //   },
    //   error: 'Failed to log out',
    // })
  }

  return (
    <AuthContext.Provider
      value={{ ...auth, setUser, setToken, logOut, isDrawerShow, setDrawerShow }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContextProvider
