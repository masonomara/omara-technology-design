import { SERVICE_QUERYResult } from '@/sanity/types'
import dayjs from 'dayjs'

type PublishedAtProps = {
  publishedAt: NonNullable<SERVICE_QUERYResult>['publishedAt']
}

export function PublishedAt({ publishedAt }: PublishedAtProps) {
  return publishedAt ? (
    <p>
      {dayjs(publishedAt).format('D MMMM YYYY')}
    </p>
  ) : null
}