import NiceModal, { useModal } from '@ebay/nice-modal-react'
import Button from 'components/form/button'
import Input from 'components/form/input'
import { useState } from 'react'
import { isAmountValid } from 'utils'
import Modal from '../../components/modal'

type Extra = {
  name: string
  price: string
  quantity: string
}

const productInit = {
  name: '',
  quantity: '',
  price: '',
}

export default NiceModal.create(() => {
  // Use a hook to manage the modal state
  const modal = useModal()

  const [extra, setExtra] = useState<Extra>(productInit)

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === 'price' && !isAmountValid(e.target.value)) {
      return
    }
    setExtra((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const submitHandler = async () => {
    modal.resolve(extra)
    modal.hide()
    setExtra(productInit)
  }

  return (
    <Modal
      title='Add Extra'
      visible={modal.visible}
      onCancel={() => modal.hide()}
      className='max-w-md'
    >
      <div className='flex flex-col gap-4'>
        <Input
          name='name'
          placeholder='Name'
          label='Name'
          value={extra.name}
          onChange={changeHandler}
        />
        <Input
          type='number'
          name='quantity'
          placeholder='Quantity'
          label='Quantity'
          value={extra.quantity}
          onChange={changeHandler}
        />
        <Input
          name='price'
          placeholder='Price'
          label='Price'
          value={extra.price}
          onChange={changeHandler}
        />
        <Button onClick={submitHandler}>Add</Button>
      </div>
    </Modal>
  )
})
