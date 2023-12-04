import clsx from 'clsx'
import React from 'react'
import { BsCheck2Circle } from 'react-icons/bs'
import { RiErrorWarningLine } from 'react-icons/ri'
import { VscError } from 'react-icons/vsc'

type AlertProps = {
  message: string
  type?: 'success' | 'error' | 'warning'
}

const Alert: React.FC<AlertProps> = ({ message, type = 'error' }) => {
  const baseClasses = 'flex items-center gap-2 rounded p-4 text-white font-semibold'
  const typeClasses = clsx({
    'bg-green-500': type === 'success',
    'bg-red-500': type === 'error',
    'bg-yellow-500': type === 'warning',
  })
  const classes = `${baseClasses} ${typeClasses}`

  return (
    <div className={classes}>
      {type === 'success' && <BsCheck2Circle size={30} />}
      {type === 'warning' && <RiErrorWarningLine size={30} />}
      {type === 'error' && <VscError size={30} />}
      {message}
    </div>
  )
}

export default Alert
