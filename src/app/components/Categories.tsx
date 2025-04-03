import { SERVICE_QUERYResult } from '@/sanity/types'

type CategoriesProps = {
  categories: NonNullable<SERVICE_QUERYResult>['categories']
}

export function Categories({ categories }: CategoriesProps) {
  return categories.map((category) => (
    <span
      key={category._id}
     
    >
      {category.title}
    </span>
  ))
}