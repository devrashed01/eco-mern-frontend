import clsx from 'clsx'
import { PropsWithChildren } from 'react'

type Props = {
  title: string | JSX.Element
  value?: string
  className?: string
}

export default function AnalyticCard({
  title,
  value,
  children,
  className = '',
}: PropsWithChildren<Props>) {
  return (
    <div className={clsx('bg-white p-6 rounded-xl', className)}>
      <h5 className='text-base text-gray flex items-center flex-wrap mb-3'>{title}</h5>
      <h2 className='text-2xl text-dark font-semibold'>{value}</h2>
      {children}
    </div>
  )
}
