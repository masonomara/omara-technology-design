import Link from 'next/link'

// Define the type based on the SERVICES_QUERY structure
type ServiceCardProps = {
  _id: string
  title: string
  slug: { current: string }
  category: {
    _id: string
    slug: { current: string }
    title: string
  }
}

export function ServiceCard(props: ServiceCardProps) {
  const { title, category, slug } = props

  return (
    <Link href={`/services/${slug.current}`}>
      <article>
        <div>
          <div>Category: {category?.title}</div>
        </div>
        <div>
          <h2>
            <span>{title}</span>
            <span />
          </h2>
        </div>
      </article>
    </Link>
  )
}