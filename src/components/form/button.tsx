import { LoaderIcon } from 'react-hot-toast'
import { BsPlus } from 'react-icons/bs'
import { Link } from 'react-router-dom'
import { cn } from 'utils'

type Props = {
  children: React.ReactNode
  className?: string
  to?: string
  color?: ButtonColorType
  disabled?: boolean
  fullWidth?: boolean
  size?: 'sm' | 'md' | 'lg'
  type?: 'button' | 'submit' | 'reset'
  variant?: 'outlined' | 'contained'
  onClick?: () => void
  icon?: 'add' | 'edit' | 'delete' | 'download' | 'upload' | 'print' | 'search'
  isLoading?: boolean
}

export default function Button({
  children,
  className = '',
  type = 'submit',
  color = 'primary',
  disabled = false,
  size = 'lg',
  onClick,
  to,
  variant = 'contained',
  fullWidth = false,
  icon,
  isLoading = false,
}: Props) {
  const classNames = cn(
    `relative btn btn-${color} btn-${size} btn-${variant}`,
    {
      'btn-disabled cursor-not-allowed': disabled || isLoading,
      'w-full': fullWidth,
    },
    className,
  )

  if (to) {
    return (
      <Link to={to} className={classNames}>
        {icon === 'add' && <BsPlus size={25} />}
        {children}
      </Link>
    )
  }

  return (
    <button
      onClick={disabled || isLoading ? (e) => e.preventDefault() : onClick}
      className={classNames}
      type={type}
    >
      {icon === 'add' && <BsPlus size={25} />}
      {children}
      {isLoading && (
        <div className='bg-slate-400 bg-opacity-40 absolute left-0 top-0 w-full h-full flex'>
          <LoaderIcon className='m-auto w-4 h-4' />
        </div>
      )}
    </button>
  )
}
