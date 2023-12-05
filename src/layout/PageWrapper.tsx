import Dropdown from 'components/Dropdown'
import { AuthContext } from 'context/AuthContext'
import { PropsWithChildren, useContext } from 'react'
import { CiImageOn } from 'react-icons/ci'
import { Link } from 'react-router-dom'

type Props = {
  title: string
  role?: UserRole
}

export default function PageWrapper({ title, children, role }: PropsWithChildren<Props>) {
  const { setDrawerShow, isAdmin, user } = useContext(AuthContext)

  if (role === 'admin' && !isAdmin) {
    return (
      <div className='h-screen flex'>
        <p className='m-auto text-2xl'>You are not allowed to access this page.</p>
      </div>
    )
  }

  return (
    <div>
      <header className='bg-white flex items-center px-9 py-9'>
        <svg
          className='lg:hidden cursor-pointer mr-3'
          onClick={() => setDrawerShow(true)}
          stroke='currentColor'
          fill='currentColor'
          strokeWidth='0'
          viewBox='0 0 1024 1024'
          height='25'
          width='25'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path d='M904 160H120c-4.4 0-8 3.6-8 8v64c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-64c0-4.4-3.6-8-8-8zm0 624H120c-4.4 0-8 3.6-8 8v64c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-64c0-4.4-3.6-8-8-8zm0-312H120c-4.4 0-8 3.6-8 8v64c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-64c0-4.4-3.6-8-8-8z'></path>
        </svg>
        <h2 className='text-2xl font-medium'>{title}</h2>
        <div className='ml-auto flex items-center gap-4'>
          <Dropdown
            selector={
              <div className='flex items-center gap-2'>
                <p className='text-md max-w-[150px] whitespace-nowrap text-ellipsis overflow-hidden font-medium'>
                  {user?.name}
                </p>
                <div className='h-10 w-10 text-dark border-2 border-primary/60 rounded-full grid place-items-center'>
                  <CiImageOn />
                </div>
              </div>
            }
            className='w-40 p-0'
            position='right'
          >
            <ul>
              <li className='p-2 hover:bg-slate-100'>
                <Link className='block' to='/profile'>
                  Profile
                </Link>
              </li>
            </ul>
          </Dropdown>
        </div>
      </header>
      <main className='p-4 md:p-9'>{children}</main>
    </div>
  )
}
