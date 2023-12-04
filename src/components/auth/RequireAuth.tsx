import { AuthContext } from 'context/AuthContext'
import { useGetProfile } from 'hooks/profile'
import Layout from 'layout/Layout'
import { useContext } from 'react'
import { LoaderIcon } from 'react-hot-toast'
import { Outlet } from 'react-router-dom'
import UnAuthorized from './UnAuthorized'

const RequireAuth = () => {
  const { setUser } = useContext(AuthContext)

  const { isLoading, isError } = useGetProfile({ onSuccess: (data) => setUser(data) })

  if (isLoading) {
    return (
      <div className='h-screen flex'>
        <LoaderIcon className='m-auto w-16 h-16' />
      </div>
    )
  }

  if (isError) {
    return <UnAuthorized />
  }

  return (
    <Layout>
      <Outlet />
    </Layout>
  )
}

export default RequireAuth
