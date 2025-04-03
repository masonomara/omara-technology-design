import { type SchemaTypeDefinition } from 'sanity'

import {blockContentType} from './blockContentType'
import {categoryType} from './categoryType'
import {serviceType} from './serviceType'
import {authorType} from './authorType'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [blockContentType, categoryType, serviceType, authorType],
}
