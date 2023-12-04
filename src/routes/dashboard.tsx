import AnalyticCard from 'components/AnalyticCard'
import Devider from 'components/Devider'
import Button from 'components/form/button'
import TransactionIcon from 'components/icons/TransactionIcon'
import Title from 'components/Title'
import { BsArrowBarUp } from 'react-icons/bs'

export default function WalletPage() {
  return (
    <div>
      <div className='card'>
        <Title variant='card_title' className='mb-3'>
          Current Balance
        </Title>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          <AnalyticCard title='Hospital' value='10000000000.00Tk.'>
            <div className='flex justify-end mt-4'>
              <Button variant='outlined' size='sm'>
                <TransactionIcon /> Transactions History
              </Button>
            </div>
          </AnalyticCard>
          <AnalyticCard title='Doctors' value='10000000000.00Tk.'>
            <div className='flex gap-3 justify-end mt-4'>
              <Button size='sm'>
                <BsArrowBarUp size={18} /> Pay
              </Button>
              <Button variant='outlined' size='sm'>
                <TransactionIcon /> Transactions History
              </Button>
            </div>
          </AnalyticCard>
          <AnalyticCard title='EyeBuddy' value='10000000000.00Tk.'>
            <div className='flex gap-3 justify-end mt-4'>
              <Button size='sm'>
                <BsArrowBarUp size={18} /> Pay
              </Button>
              <Button variant='outlined' size='sm'>
                <TransactionIcon /> Transactions History
              </Button>
            </div>
          </AnalyticCard>
        </div>
      </div>
      <Devider />
      <div className='card'>
        <Title variant='card_title' className='mb-3'>
          Total Earnings
        </Title>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          <AnalyticCard title='Hospital' value='10000000000.00Tk.'>
            <div className='flex gap-3 justify-end mt-4'>
              <Button variant='outlined' size='sm'>
                <TransactionIcon /> Transactions History
              </Button>
            </div>
          </AnalyticCard>
          <AnalyticCard title='Doctors' value='10000000000.00Tk.'>
            <div className='flex gap-3 justify-end mt-4'>
              <Button variant='outlined' size='sm'>
                <TransactionIcon /> Transactions History
              </Button>
            </div>
          </AnalyticCard>
          <AnalyticCard title='EyeBuddy' value='10000000000.00Tk.'>
            <div className='flex gap-3 justify-end mt-4'>
              <Button variant='outlined' size='sm'>
                <TransactionIcon /> Transactions History
              </Button>
            </div>
          </AnalyticCard>
        </div>
      </div>
    </div>
  )
}
