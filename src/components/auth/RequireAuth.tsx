import { useAuth0 } from '@auth0/auth0-react'
import Layout from 'layout/Layout'
import { Outlet } from 'react-router-dom'

const RequireAuth = () => {
  // const { setUser } = useContext(AuthContext)

  const { user, isAuthenticated, isLoading, getAccessTokenSilently, error } = useAuth0()

  if (isLoading) {
    return <div>Loading ...</div>
  }

  getAccessTokenSilently().then((token) => console.log(token, 'token==='))
  console.log(user, isAuthenticated, isLoading, error)

  // const { isLoading, isError } = useGetProfile({ onSuccess: (data) => setUser(data) })

  // if (isLoading) {
  //   return (
  //     <div className='h-screen flex'>
  //       <LoaderIcon className='m-auto w-16 h-16' />
  //     </div>
  //   )
  // }

  // if (isError) {
  //   return <UnAuthorized />
  // }

  return (
    <div>
      <LoginButton />
    </div>
  )

  return (
    <Layout>
      <Outlet />
    </Layout>
  )
}

export default RequireAuth

const LoginButton = () => {
  const { loginWithRedirect } = useAuth0()

  return <button onClick={() => loginWithRedirect()}>Log In</button>
}
