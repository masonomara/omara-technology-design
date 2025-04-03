import { type SchemaTypeDefinition } from "sanity";

import { blockContentType } from "./blockContentType";
import { categoryType } from "./categoryType";
import { serviceType } from "./serviceType";
import { authorType } from "./authorType";
import { pageType } from "./pageType";
import { pageBuilderType } from "./pageBuilderType";
import { faqType } from "./faqType";
import { faqsType } from "./blocks/faqsType";
import { featuresType } from "./blocks/featuresType";
import { heroType } from "./blocks/heroType";
import { splitImageType } from "./blocks/splitImageType";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    blockContentType,
    categoryType,
    serviceType,
    authorType,
    pageType,
    pageBuilderType,
    faqType,
    faqsType,
    featuresType,
    heroType,
    splitImageType,
  ],
};
