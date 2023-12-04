import { privateRequest } from 'config/axios.config'
import { useQuery } from 'react-query'
import { errorHandler } from 'utils/errorHandler'

export const useGetProfile = ({ onSuccess }: { onSuccess?: (data: User) => void }) =>
  useQuery(
    'get-profile',
    async () => {
      try {
        const res = await privateRequest.get('user/profile')
        return res.data
      } catch (error) {
        errorHandler(error)
      }
    },
    {
      onSuccess: (data) => {
        onSuccess?.(data)
      },
    },
  )
