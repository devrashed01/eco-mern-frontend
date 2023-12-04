import NiceModal, { useModal } from '@ebay/nice-modal-react'
import Button from 'components/form/button'
import Modal from '.'

type Props = {
  title?: string
  phase?: ButtonColorType
  description?: string
  header?: string
  buttonText?: string
  icon?: string
}

export default NiceModal.create(
  ({ title, phase = 'primary', buttonText = 'Confirm', description, header, icon }: Props) => {
    // Use a hook to manage the modal state
    const modal = useModal()

    return (
      <Modal
        title={title}
        visible={modal.visible}
        onCancel={() => modal.hide()}
        className='max-w-2xl'
      >
        {icon && <img className='mb-4' src={icon} alt='' />}
        <h2 className='text-[22px] font-medium leading-9'>{header}</h2>
        <p>{description}</p>
        <div className='flex gap-5 justify-between mt-10'>
          <Button
            fullWidth
            onClick={() => {
              modal.reject()
              modal.hide()
            }}
            color='default'
          >
            Cancel
          </Button>
          <Button
            fullWidth
            onClick={() => {
              modal.resolve()
              modal.hide()
            }}
            color={phase}
          >
            {buttonText}
          </Button>
        </div>
      </Modal>
    )
  },
)
