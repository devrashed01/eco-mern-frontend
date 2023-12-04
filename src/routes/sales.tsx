import { BsSearch } from 'react-icons/bs'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useInfiniteQuery } from 'react-query'

import clsx from 'clsx'
import NoMoreData from 'components/NoMoreData'
import Skeleton from 'components/Skeleton'
import Button from 'components/form/button'
import Input from 'components/form/input'
import { privateRequest } from 'config/axios.config'
import { useState } from 'react'
import { LoaderIcon } from 'react-hot-toast'
import { dateFormatter } from 'utils'
import { errorHandler } from 'utils/errorHandler'
import useDebounce from 'utils/useDebounce'

export default function SalesPage() {
  const [search, setSearch] = useState<string>('')
  const debouncedSearchTerm = useDebounce(search, 500)

  const { data, fetchNextPage, hasNextPage, isLoading } = useInfiniteQuery<SalesResponse, Error>(
    ['sales', debouncedSearchTerm],
    async ({ pageParam = 1 }) => {
      try {
        const res = await privateRequest.get(
          `admin/sales/list?page=${pageParam}&search=${debouncedSearchTerm}`,
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

  const sales = data?.pages?.flatMap((page) => page.docs) ?? []

  return (
    <div className='card'>
      <div className='flex mb-10'>
        <Button to='/all-sales/add' icon='add' variant='outlined' size='md'>
          Create Sale
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
          dataLength={sales.length}
          next={fetchNextPage}
          hasMore={!!hasNextPage}
          loader={
            <div className='flex gap-2 justify-center items-center'>
              <LoaderIcon />
              Loading...
            </div>
          }
          scrollableTarget='scrollableDiv'
          endMessage={<NoMoreData>No more sales to load.</NoMoreData>}
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
                <td>Customer Name</td>
                <td>Total</td>
                <td>Seller name</td>
                <td>Extras</td>
              </tr>
            </thead>

            <tbody>
              {isLoading && (
                <>
                  {Array(10)
                    .fill(0)
                    .map((_, i) => (
                      <tr key={i}>
                        <td>
                          <Skeleton className='w-20 h-3' />
                        </td>
                        <td>
                          <Skeleton className='w-20 h-3' />
                        </td>
                        <td>
                          <Skeleton className='w-20 h-3' />
                        </td>
                        <td>
                          <Skeleton className='w-20 h-3' />
                        </td>
                        <td>
                          <Skeleton className='w-20 h-3' />
                        </td>
                      </tr>
                    ))}
                  ``
                </>
              )}
              {sales.map((row) => (
                <tr key={row._id}>
                  <td>{dateFormatter(row.createdAt)}</td>
                  <td>{row.customerName}</td>
                  <td>${row.total}</td>
                  <td>{row.user?.[0]?.name}</td>
                  <td>
                    {row.extras?.map((extra, key) => `${extra?.name} ${key !== 0 ? ' , ' : ''}`)}
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
