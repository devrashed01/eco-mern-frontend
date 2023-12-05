import NiceModal, { useModal } from '@ebay/nice-modal-react'
import Button from 'components/form/button'
import Input from 'components/form/input'
import { useState } from 'react'
import { BsPlus } from 'react-icons/bs'
import { MdDelete } from 'react-icons/md'
import { isAmountValid } from 'utils'
import Modal from '../../components/modal'
import addExtraToProductModal from './addExtraToProduct.modal'

type Extra = {
  name: string
  price: string
  quantity: string
}

type Product = {
  product: string
  variant: string
  quantity: string
  price: string
  extras: Extra[]
}

const productInit = {
  product: '',
  variant: '',
  quantity: '',
  price: '',
  extras: [],
}

export default NiceModal.create(() => {
  // Use a hook to manage the modal state
  const modal = useModal()
  const addExtraToProductModalForm = useModal(addExtraToProductModal)

  const [product, setProduct] = useState<Product>(productInit)

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (
      (e.target.name === 'price' || e.target.name === 'discount') &&
      !isAmountValid(e.target.value)
    ) {
      return
    }
    setProduct((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const updateExtraHandler = (extra: Extra) => {
    setProduct((prev) => ({ ...prev, extras: [...prev.extras, extra] }))
  }

  const deleteExtraHandler = (index: number) => {
    setProduct((prev) => ({ ...prev, extras: prev.extras?.filter((_, i) => i !== index) }))
  }

  const submitHandler = async () => {
    modal.resolve(product)
    modal.hide()
    setProduct(productInit)
  }

  return (
    <Modal
      title='Add Product'
      visible={modal.visible}
      onCancel={() => modal.hide()}
      className='max-w-md'
    >
      <div className='flex flex-col gap-4'>
        <Input
          name='product'
          placeholder='Product'
          label='Product'
          value={product.product}
          onChange={changeHandler}
        />
        <Input
          name='variant'
          placeholder='Variant'
          label='Variant'
          value={product.variant}
          onChange={changeHandler}
        />
        <Input
          type='number'
          name='quantity'
          placeholder='Quantity'
          label='Quantity'
          value={product.quantity}
          onChange={changeHandler}
        />
        <Input
          name='price'
          label='Price'
          placeholder='Price'
          value={product.price}
          onChange={changeHandler}
        />

        <div>
          <h3 className='text-base flex justify-between items-center font-medium text-slate-800 pb-2 border-b border-slate-200'>
            Extra
            <Button
              onClick={() =>
                addExtraToProductModalForm.show().then((res: any) => updateExtraHandler(res))
              }
              size='md'
            >
              <BsPlus />
            </Button>
          </h3>
          <ul>
            {product.extras?.map((el, index) => (
              <li key={index} className='flex justify-between items-center py-2'>
                <div>
                  <p className='text-base font-medium text-slate-800'>{el.name}</p>
                  <p className='text-sm text-slate-600'>
                    ${el.price} (Qty:{el.quantity})
                  </p>
                </div>
                <Button onClick={() => deleteExtraHandler(index)} size='md' color='danger'>
                  <MdDelete />
                </Button>
              </li>
            ))}
          </ul>
        </div>
        <Button onClick={submitHandler}>Add</Button>
      </div>
    </Modal>
  )
})
