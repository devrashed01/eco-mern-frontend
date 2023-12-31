import clsx from 'clsx'
import { LoaderIcon } from 'react-hot-toast'

type Props = {
  className?: string
  collSpan?: number
  isTableLoader?: boolean
}

export const Loader = ({ className }: { className?: string }) => (
  <div className={clsx('flex justify-center', className)}>
    <LoaderIcon style={{ height: 40, width: 40 }} />
  </div>
)

export default function LoaderWraper({
  className = '',
  collSpan: colSpan,
  isTableLoader = false,
}: Props) {
  if (isTableLoader) {
    return (
      <tr>
        <td colSpan={colSpan}>
          <Loader className={className} />;
        </td>
      </tr>
    )
  }
  return <Loader className={className} />
}
