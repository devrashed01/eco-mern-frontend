import NiceModal, { useModal } from '@ebay/nice-modal-react'
import Button from 'components/form/button'
import Input from 'components/form/input'
import { privateRequest } from 'config/axios.config'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useMutation } from 'react-query'
import { errorHandler } from 'utils/errorHandler'
import Modal from '../../components/modal'

interface Form {
  oldPassword: string
  newPassword: string
  confirmPassword: string
}

export default NiceModal.create(() => {
  // Use a hook to manage the modal state
  const modal = useModal()

  const [form, setForm] = useState<Form>({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const [error, setError] = useState<Form>({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const useChangePasswordMutation = useMutation<{ message: string }, Error, any>(
    async (payload) => {
      try {
        const res = await privateRequest.put('auth/changePassword', payload)
        return res.data
      } catch (error) {
        errorHandler(error)
      }
    },
    {
      onSuccess: (data) => {
        setForm({
          oldPassword: '',
          newPassword: '',
          confirmPassword: '',
        })
        toast.success(data?.message ?? 'Password changed successfully')
        modal.hide()
      },
      onError: (error) => {
        toast.error(error.message)
      },
    },
  )

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    if (!form.newPassword || !form.confirmPassword || !form.oldPassword) {
      setError({
        oldPassword: !form.oldPassword ? 'Please enter your old password' : '',
        newPassword: !form.newPassword ? 'Please enter your new password' : '',
        confirmPassword: !form.confirmPassword ? 'Please enter your confirm password' : '',
      })
      return
    }
    if (form.newPassword !== form.confirmPassword) {
      setError({
        ...error,
        confirmPassword: 'Confirm password does not match',
      })
      return
    }

    useChangePasswordMutation.mutate(form)
  }

  return (
    <Modal
      title='Change Password'
      visible={modal.visible}
      onCancel={() => modal.hide()}
      className='max-w-md'
    >
      <form onSubmit={submitHandler} className='flex flex-col gap-10'>
        <Input
          label='Current Password'
          name='oldPassword'
          value={form.oldPassword}
          error={!!error.oldPassword}
          helpText={error.oldPassword}
          onChange={changeHandler}
        />
        <Input
          label='New Password'
          name='newPassword'
          value={form.newPassword}
          error={!!error.newPassword}
          helpText={error.newPassword}
          onChange={changeHandler}
        />
        <Input
          label='Confirm New Password'
          name='confirmPassword'
          value={form.confirmPassword}
          error={!!error.confirmPassword}
          helpText={error.confirmPassword}
          onChange={changeHandler}
        />
        <Button isLoading={useChangePasswordMutation.isLoading}>Submit</Button>
      </form>
    </Modal>
  )
})
