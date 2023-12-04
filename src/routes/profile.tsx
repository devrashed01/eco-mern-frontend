import { useContext, useEffect, useState } from 'react'

import { useModal } from '@ebay/nice-modal-react'
import Button from 'components/form/button'
import Input from 'components/form/input'
import { privateRequest } from 'config/axios.config'
import { AuthContext } from 'context/AuthContext'
import changePasswordModal from 'features/settings/changePassword.modal'
import toast from 'react-hot-toast'
import { useMutation, useQueryClient } from 'react-query'
import { assetUrl } from 'utils/url'

interface Form {
  name?: string
  phone?: string
  address?: string
}

export default function ProfilePage() {
  const { user } = useContext(AuthContext)
  const changePasswordForm = useModal(changePasswordModal)
  const queryClient = useQueryClient()

  const [form, setForm] = useState<Form>({
    name: user?.name,
    phone: user?.phone,
    address: user?.address,
  })
  const [errors, setError] = useState<Form>()

  const [file, setFile] = useState<File | null>(null)

  useEffect(() => {
    setForm({
      name: user?.name,
      phone: user?.phone,
      address: user?.address,
    })
  }, [user])

  const updateProfileMutation = useMutation<{ data: { message: string } }, Error, FormData>(
    async (payload) => privateRequest.patch('user/profile', payload),
    {
      onSuccess: (res) => {
        toast.success(res.data?.message)
        queryClient.invalidateQueries('get-profile')
      },
      onError: (error: any) => {
        error.response.data?.errors && setError(error.response.data?.errors)
        toast.error(error.response.data.message)
        setForm({
          name: user?.name,
          phone: user?.phone,
          address: user?.address,
        })
      },
    },
  )

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    })
    setError({
      ...errors,
      [e.target.name]: '',
    })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      const formData = new FormData()
      formData.append('name', form.name || '')
      formData.append('phone', form.phone || '')
      formData.append('address', form.address || '')
      formData.append('avatar', e.target.files[0])
      updateProfileMutation.mutate(formData)
    }
  }

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!form.name || !form.phone || !form.address) {
      setError({
        name: !form.name ? 'Name is required' : '',
        phone: !form.phone ? 'Phone is required' : '',
        address: !form.address ? 'Address is required' : '',
      })
      return
    }

    const formData = new FormData()
    formData.append('name', form.name)
    formData.append('phone', form.phone)
    formData.append('address', form.address)
    if (file) {
      formData.append('avatar', file)
    }

    updateProfileMutation.mutate(formData)
  }

  return (
    <div>
      <div className='flex items-center gap-12'>
        <div className='h-[130px] w-[130px] rounded-full bg-slate-800 overflow-hidden'>
          {(file || user?.avatar) && (
            <img
              className='h-full w-full object-cover'
              src={file ? URL.createObjectURL(file) : `${assetUrl}${user?.avatar}`}
              alt=''
            />
          )}
        </div>
        <label>
          <input onChange={handleFileChange} type='file' hidden />
          <div className='cursor-pointer btn btn-lg btn-primary btn-outlined'>Change</div>
        </label>
      </div>
      <div className='my-10'>
        <h2>Profile</h2>
        <form onSubmit={submitHandler}>
          <div className='grid gap-5 my-5 grid-cols-1 sm:grid-cols-2'>
            <Input
              error={!!errors?.name}
              helpText={errors?.name}
              label='Name'
              name='name'
              value={form.name}
              onChange={changeHandler}
            />
            <Input
              error={!!errors?.phone}
              helpText={errors?.phone}
              label='Phone'
              name='phone'
              value={form.phone}
              onChange={changeHandler}
            />
            <Input
              error={!!errors?.address}
              helpText={errors?.address}
              label='Address'
              name='address'
              value={form.address}
              onChange={changeHandler}
            />
          </div>

          <Button isLoading={updateProfileMutation.isLoading} className='!px-10'>
            Update
          </Button>
        </form>
      </div>

      <div className='my-10 border-t border-slate-300 pt-10 flex items-center gap-10'>
        <h2>Settings</h2>
        <div className='flex flex-col gap-[44px]'>
          <Button onClick={() => changePasswordForm.show()} size='lg' variant='outlined'>
            Change Password
          </Button>
        </div>
      </div>
    </div>
  )
}
