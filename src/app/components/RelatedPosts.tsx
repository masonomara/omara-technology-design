"use client";

import Link from "next/link";
import { createDataAttribute } from "next-sanity";
import { SERVICE_QUERYResult } from "@/sanity/types";
import { client } from "@/sanity/lib/client";
import { useOptimistic } from "next-sanity/hooks";

const { projectId, dataset, stega } = client.config();
export const createDataAttributeConfig = {
  projectId,
  dataset,
  baseUrl: typeof stega.studioUrl === "string" ? stega.studioUrl : "",
};

export function RelatedServices({
  relatedServices,
  documentId,
  documentType,
}: {
  relatedServices: NonNullable<SERVICE_QUERYResult>["relatedServices"];
  documentId: string;
  documentType: string;
}) {
  const services = useOptimistic<
    NonNullable<SERVICE_QUERYResult>["relatedServices"] | undefined,
    NonNullable<SERVICE_QUERYResult>
  >(relatedServices, (state, action) => {
    if (action.id === documentId && action?.document?.relatedServices) {
      // Optimistic document only has _ref values, not resolved references
      return action.document.relatedServices.map(
        (service) => state?.find((p) => p._key === service._key) ?? service
      );
    }
    return state;
  });
  if (!services) {
    return null;
  }
  return (
    <aside>
      <h2>Related Services</h2>
      <div >
        <ul

          data-sanity={createDataAttribute({
            ...createDataAttributeConfig,
            id: documentId,
            type: documentType,
            path: "relatedServices",
          }).toString()}
        >
          {services.map((service) => (
            <li
              key={service._key}
              className="p-4 bg-blue-50 sm:w-1/3 flex-shrink-0"
              data-sanity={createDataAttribute({
                ...createDataAttributeConfig,
                id: documentId,
                type: documentType,
                path: `relatedServices[_key=="${service._key}"]`,
              }).toString()}
            >
              <Link href={`/services/${service?.slug?.current}`}>{service.title}</Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}