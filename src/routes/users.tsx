import { useModal } from '@ebay/nice-modal-react'
import { BsSearch } from 'react-icons/bs'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useInfiniteQuery, useMutation, useQueryClient } from 'react-query'
import { Link } from 'react-router-dom'

import clsx from 'clsx'
import NoMoreData from 'components/NoMoreData'
import Badge from 'components/form/Badge'
import Button from 'components/form/button'
import Input from 'components/form/input'
import confirmationModal from 'components/modal/confirmation.modal'
import { privateRequest } from 'config/axios.config'
import copy from 'copy-to-clipboard'
import { useState } from 'react'
import { LoaderIcon, toast } from 'react-hot-toast'
import { MdCopyAll } from 'react-icons/md'
import { dateFormatter } from 'utils'
import { errorHandler } from 'utils/errorHandler'
import useDebounce from 'utils/useDebounce'

type Props = {
  user_type: UserStatus
}

export default function UsersPage({ user_type }: Props) {
  const confirmation = useModal(confirmationModal)
  const queryClient = useQueryClient()

  const [search, setSearch] = useState<string>('')
  const debouncedSearchTerm = useDebounce(search, 500)

  const { data, fetchNextPage, hasNextPage, isLoading } = useInfiniteQuery<UsersResponse, Error>(
    ['users', user_type, debouncedSearchTerm],
    async ({ pageParam = 1 }) => {
      try {
        const res = await privateRequest.get(
          `admin/user/list?page=${pageParam}&status=${user_type}&search=${debouncedSearchTerm}`,
        )
        return res.data
      } catch (error) {
        errorHandler(error)
      }
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextPage,
    },
  )

  const { mutateAsync: toggleUserStatus } = useMutation<{ message: string }, Error, string>(
    async (id) => {
      try {
        const rest = await privateRequest.patch(`admin/user/toggleStatus/${id}`)
        return rest.data
      } catch (error) {
        errorHandler(error)
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('users')
      },
    },
  )

  const users = data?.pages?.flatMap((page) => page.docs) ?? []

  return (
    <div className='card'>
      <div className='flex mb-10'>
        <Button to='/all-users/add' icon='add' variant='outlined' size='md'>
          Add Seller
        </Button>
        <Input
          variant='outlined'
          placeholder='Name'
          size='md'
          className='!w-[230px] ml-auto'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          afterFix={<BsSearch className='mr-3 text-gray' size={20} />}
        />
      </div>
      <div id='scrollableDiv' className='h-[calc(100vh-320px)] overflow-y-auto'>
        <InfiniteScroll
          dataLength={users.length}
          next={fetchNextPage}
          hasMore={!!hasNextPage}
          loader={
            <div className='flex gap-2 justify-center items-center'>
              <LoaderIcon />
              Loading...
            </div>
          }
          scrollableTarget='scrollableDiv'
          endMessage={<NoMoreData>No more users to load.</NoMoreData>}
        >
          {}
          <table
            className={clsx({
              'blur-sm animate-pulse': isLoading,
            })}
          >
            <thead>
              <tr>
                <td>Joined date</td>
                <td>ID</td>
                <td>Full Name</td>
                <td>Phone Number</td>
                <td className='w-40'>Action</td>
              </tr>
            </thead>

            <tbody>
              {isLoading && (
                <>
                  {Array(10)
                    .fill(0)
                    .map((_, i) => (
                      <tr key={i}>
                        <td>Day Month, Year</td>
                        <td>NOCODE</td>
                        <td>
                          <p className='text-primary'>John Doe</p>
                        </td>
                        <td>0123456789</td>
                        <td>
                          <div className='inline-flex gap-2'>
                            {user_type === 'inactive' && <Button size='sm'>Active</Button>}
                            {user_type === 'active' && (
                              <Button size='sm' color='danger'>
                                Deactivate
                              </Button>
                            )}
                            {user_type === 'pending' && (
                              <Button size='sm' color='primary'>
                                Approve
                              </Button>
                            )}
                            <Button color='default' size='sm'>
                              Edit
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </>
              )}
              {users.map((row) => (
                <tr key={row._id}>
                  <td>{dateFormatter(row.createdAt)}</td>
                  <td>{row.name}</td>
                  <td>
                    {row._id}{' '}
                    <Badge
                      onClick={() => {
                        copy(row._id)
                        toast.success('Copied')
                      }}
                    >
                      <MdCopyAll />
                    </Badge>
                  </td>
                  <td>{row.phone}</td>
                  <td>
                    <div className='inline-flex gap-2'>
                      {user_type === 'inactive' && (
                        <Button
                          onClick={() =>
                            confirmation
                              .show({
                                phase: 'primary',
                                header: 'Are you sure, you want to Activate this User ?',
                                buttonText: 'Activate',
                              })
                              .then(() =>
                                toast.promise(toggleUserStatus(row._id), {
                                  loading: 'Activating user...',
                                  success: (res) => res.message ?? 'User activated successfully',
                                  error: (err) => err.message ?? 'Something went wrong!',
                                }),
                              )
                          }
                          size='sm'
                        >
                          Active
                        </Button>
                      )}
                      {user_type === 'active' && (
                        <Button
                          onClick={() =>
                            confirmation
                              .show({
                                phase: 'danger',
                                header: 'Are you sure, you want to Deactivate this User ?',
                                buttonText: 'Deactivate',
                              })
                              .then(() =>
                                toast.promise(toggleUserStatus(row._id), {
                                  loading: 'Deactivating user...',
                                  success: (res) => res.message ?? 'User deactivated successfully',
                                  error: (err) => err.message ?? 'Something went wrong!',
                                }),
                              )
                          }
                          size='sm'
                          color='danger'
                        >
                          Deactivate
                        </Button>
                      )}
                      {user_type === 'pending' && (
                        <Button
                          onClick={() =>
                            confirmation
                              .show({
                                phase: 'primary',
                                header: 'Are you sure, you approved this user?',
                                buttonText: 'Yes, Approve',
                              })
                              .then(() =>
                                toast.promise(toggleUserStatus(row._id), {
                                  loading: 'Approving user...',
                                  success: (res) => res.message ?? 'User approved successfully',
                                  error: (err) => err.message ?? 'Something went wrong!',
                                }),
                              )
                          }
                          size='sm'
                          color='primary'
                        >
                          Approve
                        </Button>
                      )}
                      <Link
                        className='btn btn-sm btn-default btn-container'
                        to={`/all-users/edit/${row._id}`}
                        state={{ data: row }}
                      >
                        Edit
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </InfiniteScroll>
      </div>
    </div>
  )
}
