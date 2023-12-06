import { useAuth0 } from '@auth0/auth0-react'
import clsx from 'clsx'
import Button from 'components/form/button'
import Input from 'components/form/input'
import { privateRequest } from 'config/axios.config'
import { AuthContext } from 'context/AuthContext'
import AuthLayout from 'layout/AuthLayout'
import { SyntheticEvent, useContext, useState } from 'react'
import { toast } from 'react-hot-toast'
import { BsEye } from 'react-icons/bs'
import { useMutation } from 'react-query'
import { Link } from 'react-router-dom'
import { errorHandler } from 'utils/errorHandler'

type Form = {
  email: string
  password: string
}

export default function LoginPage() {
  const { setToken } = useContext(AuthContext)
  const [form, setForm] = useState<Form>({
    email: '',
    password: '',
  })
  const [showPassword, setShowPassword] = useState<boolean>(false)

  const loginMutation = useMutation<{ token: string; message: string }, Error, Form>(
    async (payload) => {
      try {
        const res = await privateRequest.post('auth/login', payload)
        return res.data
      } catch (err: any) {
        errorHandler(err)
      }
    },
    {
      onSuccess: (data) => {
        if (!data.token) return
        localStorage.setItem('token', data.token)
        setToken(data.token)
      },
    },
  )

  const changeHandler = (e: any) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    })
  }

  const onSubmit = (e: SyntheticEvent) => {
    e.preventDefault()
    if (!form.email || !form.password) return toast.error('Please fill all the fields')

    toast.promise(loginMutation.mutateAsync(form), {
      loading: 'Logging in...',
      success: (res) => res.message || 'Logged in successfully',
      error: (err) => err?.message || 'Failed to login',
    })
  }

  const { user, isAuthenticated, isLoading, getAccessTokenSilently, error } = useAuth0()

  if (isLoading) {
    return <div>Loading ...</div>
  }

  getAccessTokenSilently().then((token) => console.log(token, 'token==='))
  console.log(user, isAuthenticated, isLoading, error)

  if (isAuthenticated) {
    return (
      <div>
        <h2>testing with AuthO</h2>
        <img src={user?.picture} alt={user?.name} />
        <h2>{user?.name}</h2>
        <p>{user?.email}</p>
      </div>
    )
  }

  return (
    <AuthLayout title='Log In Your Account' description='Please provide correct credentials'>
      <form className='flex flex-col gap-6' onSubmit={onSubmit}>
        <Input onChange={changeHandler} value={form.email} label='Email' name='email' />
        <Input
          onChange={changeHandler}
          value={form.password}
          label='Password'
          name='password'
          type={showPassword ? 'text' : 'password'}
          afterFix={
            <BsEye
              className={clsx('mr-3 select-none cursor-pointer', {
                'text-slate-400': !showPassword,
                'text-slate-600': showPassword,
              })}
              size={20}
              onClick={() => setShowPassword(!showPassword)}
            />
          }
        />
        <div className='flex justify-end'>
          <Button isLoading={loginMutation.isLoading} className='!px-10'>
            Log In
          </Button>
        </div>
      </form>
      <p className='mt-6 text-center'>
        {`Don't`} have an account?{' '}
        <Link to='/register' className='text-success hover:underline'>
          Register
        </Link>
      </p>
      <LoginButton />
    </AuthLayout>
  )
}

const LoginButton = () => {
  const { loginWithRedirect } = useAuth0()

  return <button onClick={() => loginWithRedirect()}>Log In</button>
}
