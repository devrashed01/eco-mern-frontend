import AnalyticCard from 'components/AnalyticCard'
import Title from 'components/Title'
import { privateRequest } from 'config/axios.config'
import { AuthContext } from 'context/AuthContext'
import { useContext } from 'react'
import { useQuery } from 'react-query'
import { errorHandler } from 'utils/errorHandler'

type Statistics = {
  totalSalesCount: number
  totalPrice: number
  adminCommission: number
}

export default function WalletPage() {
  const { isAdmin } = useContext(AuthContext)
  const url = isAdmin ? '/admin/statistics' : 'seller/statistics'
  const { data } = useQuery<Statistics>('statistics', async () => {
    try {
      const res = await privateRequest.get(url)
      return res.data
    } catch (error) {
      errorHandler(error)
    }
  })

  return (
    <div>
      <div className='card'>
        <Title variant='card_title' className='mb-3'>
          Statistic
        </Title>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          <AnalyticCard
            title='Total Commission'
            value={`${data?.adminCommission?.toFixed(2) ?? 0} Tk.`}
          />
          <AnalyticCard
            title='Total Sales'
            value={`${data?.totalSalesCount?.toFixed(2) ?? 0} Tk.`}
          />
          <AnalyticCard title='Total Sold' value={`${data?.totalPrice?.toFixed(2) ?? 0} Tk.`} />
        </div>
      </div>
    </div>
  )
}
