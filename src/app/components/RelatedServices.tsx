import Link from 'next/link';
import { Slug } from '@/sanity/types'; // Update path if needed

type RelatedServicesProps = {
  relatedServices: Array<{
    _key: string;
    _id: string;
    title: string | null;
    slug: Slug | null;
  }> | null;
  documentId: string;
  documentType: string;
};

export function RelatedServices({ relatedServices }: RelatedServicesProps) {
  if (!relatedServices || relatedServices.length === 0) return null;

  return (
    <div>
      <h2>Related Services</h2>
      <ul>
        {relatedServices.map((service) => (
          <li key={service._key}>
            <Link href={`/services/${service.slug?.current}`}>
              {service.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}