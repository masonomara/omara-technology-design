import { POST_QUERYResult } from '@/sanity/types'

type CategoriesProps = {
  categories: NonNullable<POST_QUERYResult>['categories']
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