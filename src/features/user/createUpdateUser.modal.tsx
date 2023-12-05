import NiceModal, { useModal } from '@ebay/nice-modal-react'
import Button from 'components/form/button'
import Input from 'components/form/input'
import Select from 'components/form/select'
import { privateRequest } from 'config/axios.config'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useMutation, useQueryClient } from 'react-query'
import { isAmountValid } from 'utils'
import Modal from '../../components/modal'

interface Form {
  password?: string
  name: string
  email: string
  phone: string
  address: string
  status?: Option
  commission: string
  role?: Option
}

interface Payload {
  password?: string
  name: string
  email: string
  phone: string
  address: string
  status: string
  commission: string
  role: string
}

const roles = [
  { label: 'Admin', value: 'admin' },
  { label: 'Seller', value: 'seller' },
]

const statusOptions = [
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
  { label: 'Pending', value: 'pending' },
]

const initForm = {
  password: '',
  name: '',
  email: '',
  phone: '',
  address: '',
  commission: '',
}

export default NiceModal.create(({ data }: { data?: User }) => {
  const modal = useModal()
  const queryClient = useQueryClient()

  const [form, setForm] = useState<Form>(initForm)

  const [error, setError] = useState<{
    password?: string
    name?: string
    email?: string
    phone?: string
    address?: string
    commission?: string
    role?: string
    status?: string
  }>({
    password: '',
    name: '',
    email: '',
    phone: '',
    address: '',
    commission: '',
    role: '',
    status: '',
  })

  useEffect(() => {
    if (data) {
      setForm({
        name: data?.name,
        email: data?.email,
        phone: data?.phone,
        address: data?.address,
        commission: data?.commission?.toString(),
        role: roles?.find((el) => el.value === data?.role),
        status: statusOptions?.find((el) => el.value === data?.status),
      })
    }
  }, [data])

  const endpointUrl = data ? `admin/user/edit/${data?._id}` : `admin/user/create`
  const createUpdateUserMutation = useMutation<{ message: string }, Error, Payload>(
    async (payload) => await privateRequest.post(endpointUrl, payload),
    {
      onSuccess: (data) => {
        setForm(initForm)
        toast.success(data?.message ?? 'User created successfully')
        queryClient.invalidateQueries('users')
        modal.hide()
      },
      onError: (error: any) => {
        if (error.response.data.errors) {
          setError(error.response.data.errors)
        }
        toast.error(error.response.data.message ?? 'Something went wrong')
      },
    },
  )

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === 'commission' && !isAmountValid(e.target.value)) {
      return
    }
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    })
    setError({
      ...error,
      [e.target.name]: '',
    })
  }

  const selectHandler = (e: _SelectValue) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    })
    setError({
      ...error,
      [e.target.name]: '',
    })
  }

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (
      !form.address ||
      !form.commission ||
      !form.email ||
      !form.name ||
      (!data && !form.password) ||
      !form.phone ||
      !form.role ||
      !form.status
    ) {
      setError((prev) => ({
        ...prev,
        address: form.address ? '' : 'Address is required',
        commission: form.commission ? '' : 'Commission is required',
        email: form.email ? '' : 'Email is required',
        name: form.name ? '' : 'Name is required',
        password: form.password ? '' : 'Password is required',
        phone: form.phone ? '' : 'Phone is required',
        role: !form.role ? '' : 'Role is required',
        status: !form.status ? '' : 'Status is required',
      }))

      return
    }

    const payload: Payload = {
      ...form,
      commission: form.commission,
      role: form.role?.value ?? '',
      status: form.status?.value ?? '',
    }

    createUpdateUserMutation.mutate(payload)
  }

  return (
    <Modal
      title='Create Sale'
      visible={modal.visible}
      onCancel={() => modal.remove()}
      className='max-w-md'
    >
      <form onSubmit={submitHandler} className='flex flex-col gap-4'>
        <Input
          label='Name'
          name='name'
          value={form.name}
          error={!!error.name}
          helpText={error.name}
          onChange={changeHandler}
        />
        <Input
          label='Email'
          name='email'
          value={form.email}
          error={!!error.email}
          helpText={error.email}
          onChange={changeHandler}
        />
        {!data && (
          <Input
            label='Password'
            name='password'
            value={form.password}
            error={!!error.password}
            helpText={error.password}
            onChange={changeHandler}
          />
        )}
        <Input
          label='Phone'
          name='phone'
          value={form.phone}
          error={!!error.phone}
          helpText={error.phone}
          onChange={changeHandler}
        />
        <Input
          label='Address'
          name='address'
          value={form.address}
          error={!!error.address}
          helpText={error.address}
          onChange={changeHandler}
        />
        <Input
          label='Commission'
          name='commission'
          value={form.commission}
          error={!!error.commission}
          helpText={error.commission}
          onChange={changeHandler}
        />
        <Select
          label='Role'
          name='role'
          value={form.role}
          error={!!error.role}
          helpText={error.role}
          onChange={selectHandler}
          options={roles}
        />
        <Select
          label='Status'
          name='status'
          value={form.status}
          error={!!error.status}
          helpText={error.status}
          onChange={selectHandler}
          options={statusOptions}
        />

        <Button isLoading={createUpdateUserMutation.isLoading}>{data ? 'Update' : 'Create'}</Button>
      </form>
    </Modal>
  )
})
