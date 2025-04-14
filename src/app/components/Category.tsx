import { Slug } from '@/sanity/types'; // Update path if needed

type CategoryProps = {
  categories: Array<{
    _id: string;
    slug: Slug | null;
    title: string | null;
  }> | Array<never>;
}

export function Categories({ categories }: CategoryProps) {
  if (!categories || categories.length === 0) return null;

  return (
    <div>ƒ
      {categories.map(category => (
        <span key={category._id}>
          {category.title}
        </span>
      ))}
    </div>
  );
}