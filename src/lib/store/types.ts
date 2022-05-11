import { CollectionSchema } from 'typesense/lib/Typesense/Collection'
import { SearchParametersWithQueryBy } from 'typesense-instantsearch-adapter'

export { Client } from 'typesense'
export { NodeConfiguration } from 'typesense/lib/Typesense/Configuration'
export { CollectionSchema } from 'typesense/lib/Typesense/Collection'
export { CollectionCreateSchema } from 'typesense/lib/Typesense/Collections'
export {
  KeyCreateSchema,
  KeyDeleteSchema,
  KeySchema,
} from 'typesense/lib/Typesense/Key'
export { KeysRetrieveSchema } from 'typesense/lib/Typesense/Keys'

export { default as TypesenseInstantsearchAdapter } from 'typesense-instantsearch-adapter'
export { SearchParametersWithQueryBy } from 'typesense-instantsearch-adapter'

export { ImportResponse } from 'typesense/lib/Typesense/Documents'

export interface DisplayOptions {
  component: ComponentName
  map: {
    [key: string]: string
  }
}

export interface ExtendedCollectionDefinition {
  schema: CollectionSchema
  searchParameters: SearchParametersWithQueryBy
  displayOptions: DisplayOptions
}

export interface ExtendedCollectionsMap {
  [key: string]: ExtendedCollectionDefinition
}

export enum ComponentName {
  DEFAULT = 'Default',
}
