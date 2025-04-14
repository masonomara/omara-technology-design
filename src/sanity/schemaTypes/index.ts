import { type SchemaTypeDefinition } from "sanity";

import { blockContentType } from "./blockContentType";
import { categoryType } from "./categoryType";
import { serviceType } from "./serviceType";
import { projectType } from "./projectType";
import { seoType } from "./seoType";
import { redirectType } from "./redirectTypes";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [blockContentType, categoryType, serviceType, projectType, seoType, redirectType],
};
