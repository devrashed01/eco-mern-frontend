type SalesResponse = {
  docs: Sale[]
  totalDocs: number
  limit: number
  page: number
  totalPages: number
  pagingCounter: number
  hasPrevPage: boolean
  hasNextPage: boolean
  prevPage: null
  nextPage: number
}

type Sale = {
  _id: string
  customerName: string
  products: Product[]
  subtotal: number
  vat: number
  discount: number
  total: number
  user: SaleUser[]
  createdAt: Date
  updatedAt: Date
  __v: number
}

type Extra = {
  name: string
  price: number
  quantity: number
  _id: string
}

type Product = {
  product: string
  variant: string
  quantity: number
  price: number
  _id: string
  extras: Extra[]
}

type SaleUser = {
  _id: string
  name: string
  email: string
  phone: string
  role: string
  address?: string
}
