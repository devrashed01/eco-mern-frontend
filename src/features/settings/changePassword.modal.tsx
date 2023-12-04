import NiceModal, { useModal } from '@ebay/nice-modal-react'
import Button from 'components/form/button'
import Input from 'components/form/input'
import Modal from '../../components/modal'

export default NiceModal.create(() => {
  // Use a hook to manage the modal state
  const modal = useModal()

  return (
    <Modal
      title='Change Password'
      visible={modal.visible}
      onCancel={() => modal.hide()}
      className='max-w-md'
    >
      <form className='flex flex-col gap-10'>
        <Input label='Current Password' />
        <Input label='New Password' />
        <Input label='Confirm New Password' />
        <Button>Submit</Button>
      </form>
    </Modal>
  )
})
