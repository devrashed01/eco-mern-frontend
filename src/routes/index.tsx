import RequireAuth from 'components/auth/RequireAuth'
import { AuthContext } from 'context/AuthContext'
import PageWrapper from 'layout/PageWrapper'
import { useContext, useEffect, useState } from 'react'
import { Navigate, RouteObject, useRoutes } from 'react-router-dom'
import PageNotFound from './404'
import Dashboard from './dashboard'
import LoginPage from './login'
import ProfilePage from './profile'
import RegisterPage from './register'
import SalesPage from './sales'
import UsersPage from './users'

const privateRoute: RouteObject[] = [
  {
    path: '/',
    element: <RequireAuth />,
    children: [
      { index: true, element: <Navigate to='dashboard' /> },
      {
        path: 'dashboard',
        element: (
          <PageWrapper title='Dashboard'>
            <Dashboard />
          </PageWrapper>
        ),
      },
      {
        path: 'profile',
        element: (
          <PageWrapper title='Profile'>
            <ProfilePage />
          </PageWrapper>
        ),
      },
      {
        path: 'users/active',
        element: (
          <PageWrapper role='admin' title='Active Users'>
            <UsersPage user_type='active' />
          </PageWrapper>
        ),
      },
      {
        path: 'users/inactive',
        element: (
          <PageWrapper role='admin' title='Inactive Users'>
            <UsersPage user_type='inactive' />
          </PageWrapper>
        ),
      },
      {
        path: 'users/pending',
        element: (
          <PageWrapper role='admin' title='Pending Users'>
            <UsersPage user_type='pending' />
          </PageWrapper>
        ),
      },
      {
        path: 'sales',
        element: (
          <PageWrapper title='Sales'>
            <SalesPage />
          </PageWrapper>
        ),
      },
      { path: 'login', element: <Navigate to='/' /> },
      { path: 'register', element: <Navigate to='/' /> },
      { path: '*', element: <PageNotFound /> },
    ],
  },
]

const publicRoute: RouteObject[] = [
  { path: 'login', element: <LoginPage /> },
  { path: 'register', element: <RegisterPage /> },
  { path: '*', element: <Navigate to='/login' /> },
]

const Routes = () => {
  const { token } = useContext(AuthContext)

  const [routes, setRoutes] = useState<RouteObject[]>(token ? privateRoute : publicRoute)

  // change routes on token state
  useEffect(() => {
    setRoutes(token ? privateRoute : publicRoute)
  }, [token])

  const appRoutes = useRoutes(routes)

  if (token) {
    return <div>{appRoutes}</div>
  }

  return <div>{appRoutes}</div>
}

export default Routes
