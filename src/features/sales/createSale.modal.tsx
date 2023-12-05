import NiceModal, { useModal } from '@ebay/nice-modal-react'
import Button from 'components/form/button'
import Input from 'components/form/input'
import { privateRequest } from 'config/axios.config'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { BsPlus } from 'react-icons/bs'
import { MdDelete } from 'react-icons/md'
import { useMutation, useQueryClient } from 'react-query'
import { isAmountValid } from 'utils'
import Modal from '../../components/modal'
import addProductToSaleModal from './addProductToSale.modal'

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
  extras?: Extra[]
}

interface Form {
  customerName: string
  discount: string
  user: string
  products: Product[]
}

const initForm = {
  customerName: '',
  discount: '',
  user: '',
  products: [],
}

export default NiceModal.create(() => {
  // Use a hook to manage the modal state
  const modal = useModal()
  const queryClient = useQueryClient()

  const [form, setForm] = useState<Form>(initForm)

  const [error, setError] = useState<Form>(initForm)

  const addProductToSaleModalForm = useModal(addProductToSaleModal)

  const createSaleMutation = useMutation<{ message: string }, Error, any>(
    async (payload) => await privateRequest.post('admin/sales/create', payload),
    {
      onSuccess: (data) => {
        setForm(initForm)
        toast.success(data?.message ?? 'Sale created successfully')
        queryClient.invalidateQueries('sales')
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
    if (
      (e.target.name === 'price' || e.target.name === 'discount') &&
      !isAmountValid(e.target.value)
    ) {
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

  const updateProductsHandler = (product: Product) => {
    setForm({
      ...form,
      products: [...form.products, product],
    })
  }

  const deleteProductHandler = (index: number) => {
    setForm({
      ...form,
      products: form.products.filter((_, i) => i !== index),
    })
  }

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!form.customerName || !form.discount || !form.user) {
      setError({
        ...error,
        customerName: !form.customerName ? 'Customer name is required' : '',
        discount: !form.discount ? 'Discount is required' : '',
        user: !form.user ? 'User is required' : '',
      })
      return
    }
    if (form.products?.length === 0) {
      toast.error('Products are required')
      return
    }

    createSaleMutation.mutate(form)
  }

  return (
    <Modal
      title='Create Sale'
      visible={modal.visible}
      onCancel={() => modal.hide()}
      className='max-w-md'
    >
      <form onSubmit={submitHandler} className='flex flex-col gap-4'>
        <Input
          label='Customer Name'
          name='customerName'
          value={form.customerName}
          error={!!error.customerName}
          helpText={error.customerName}
          onChange={changeHandler}
        />
        <Input
          label='Discount'
          name='discount'
          value={form.discount}
          error={!!error.discount}
          helpText={error.discount}
          onChange={changeHandler}
        />
        <Input
          label='User Id'
          name='user'
          value={form.user}
          error={!!error.user}
          helpText={error.user}
          onChange={changeHandler}
        />
        <div>
          <h3 className='text-base flex justify-between items-center font-medium text-slate-800 pb-2 border-b border-slate-200'>
            Products
            <Button
              type='button'
              onClick={() =>
                addProductToSaleModalForm.show().then((res: any) => updateProductsHandler(res))
              }
              size='md'
            >
              <BsPlus />
            </Button>
          </h3>
          <ul>
            {form.products?.map((product, index) => (
              <li key={index} className='flex justify-between items-center py-2'>
                <div>
                  <p className='text-base font-medium text-slate-800'>
                    {product.product} {product.variant}
                  </p>
                  <p className='text-sm text-slate-600'>
                    ${product.price} (Qty:{product.quantity})
                  </p>
                </div>
                <Button onClick={() => deleteProductHandler(index)} size='md' color='danger'>
                  <MdDelete />
                </Button>
              </li>
            ))}
          </ul>
        </div>
        <Button isLoading={createSaleMutation.isLoading}>Create</Button>
      </form>
    </Modal>
  )
})
