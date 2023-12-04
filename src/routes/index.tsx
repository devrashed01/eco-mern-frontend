import RequireAuth from 'components/auth/RequireAuth'
import { AuthContext } from 'context/AuthContext'
import PageWrapper from 'layout/PageWrapper'
import { useContext, useEffect, useState } from 'react'
import { Navigate, RouteObject, useRoutes } from 'react-router-dom'
import PageNotFound from './404'
import Dashboard from './dashboard'
import LoginPage from './login'
import ProfilePage from './profile'

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
      // {
      //   path: 'all-bookings',
      //   children: [
      //     { index: true, element: <Navigate to='current' /> },
      //     {
      //       path: 'current',
      //       element: (
      //         <PageWrapper title='Current Bookings'>
      //           <BookingsPage booking_type='queued' />
      //         </PageWrapper>
      //       ),
      //     },
      //   ],
      // },
      { path: 'login', element: <Navigate to='/' /> },
      { path: 'signup', element: <Navigate to='/' /> },
      { path: '*', element: <PageNotFound /> },
    ],
  },
]

const publicRoute: RouteObject[] = [
  { path: 'login', element: <LoginPage /> },
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
