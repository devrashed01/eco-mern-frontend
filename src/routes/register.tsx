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
  name: string
  phone: string
}

export default function RegisterPage() {
  const { setToken } = useContext(AuthContext)
  const [form, setForm] = useState<Form>({
    email: '',
    password: '',
    name: '',
    phone: '',
  })
  const [errors, setErrors] = useState<Form>({
    email: '',
    password: '',
    name: '',
    phone: '',
  })

  const [showPassword, setShowPassword] = useState<boolean>(false)

  const registerMutation = useMutation<
    { token?: string; errors?: any; message?: string },
    Error,
    Form
  >(
    async (payload) => {
      try {
        const res = await privateRequest.post('auth/register', payload)
        return res.data
      } catch (err: any) {
        errorHandler(err)
      }
    },
    {
      onSuccess: (data) => {
        if (data.errors) {
          setErrors(data.errors)
          return
        }
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
    setErrors({
      ...errors,
      [e.target.name]: '',
    })
  }

  const onSubmit = (e: SyntheticEvent) => {
    e.preventDefault()
    if (!form.email || !form.password || !form.name || !form.phone) {
      setErrors({
        email: form.email ? '' : 'Email is required',
        password: form.password ? '' : 'Password is required',
        name: form.name ? '' : 'Name is required',
        phone: form.phone ? '' : 'Phone is required',
      })
      return
    }

    toast.promise(registerMutation.mutateAsync(form), {
      loading: 'Registering in...',
      success: (res) => res.message || 'Registered in successfully',
      error: (err) => err?.message || 'Failed to register',
    })
  }

  return (
    <AuthLayout title='Register Your Account' description='Please provide correct info'>
      <form className='flex flex-col gap-6' onSubmit={onSubmit}>
        <Input
          onChange={changeHandler}
          value={form.name}
          label='Name'
          name='name'
          error={!!errors.name}
          helpText={errors.name}
        />
        <Input
          onChange={changeHandler}
          value={form.email}
          label='Email'
          name='email'
          error={!!errors.email}
          helpText={errors.email}
        />
        <Input
          onChange={changeHandler}
          value={form.phone}
          label='Phone'
          name='phone'
          error={!!errors.phone}
          helpText={errors.phone}
        />
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
          error={!!errors.password}
          helpText={errors.password}
        />
        <div className='flex justify-end'>
          <Button isLoading={registerMutation.isLoading} className='!px-10'>
            Register
          </Button>
        </div>
      </form>
      <p className='mt-6 text-center'>
        Already have an account?{' '}
        <Link to='/login' className='text-success hover:underline'>
          Login
        </Link>
      </p>
    </AuthLayout>
  )
}
