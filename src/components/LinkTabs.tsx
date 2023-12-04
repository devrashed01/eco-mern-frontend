import clsx from 'clsx'
import { Link } from 'react-router-dom'

type Props = {
  options: Option[]
  selected: Option
  selectHandler?: (selected: Option) => void
}

export default function LinkTabs({ options, selected }: Props) {
  return (
    <ul className='flex sm:inline-flex flex-wrap rounded-lg overflow-hidden'>
      {options?.map((option) => (
        <li key={option.label} className='flex-1 sm:flex-auto'>
          <Link
            to={option.value}
            className={clsx(
              'h-14 grid place-items-center px-8 font-semibold text-sm',
              selected.label === option.label
                ? 'bg-[#1C366A] text-white'
                : 'bg-[#D2D7E1] text-dark',
            )}
          >
            {option.label}
          </Link>
        </li>
      ))}
    </ul>
  )
}
