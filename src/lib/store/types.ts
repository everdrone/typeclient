import { CollectionSchema } from 'typesense/lib/Typesense/Collection'
import { SearchParametersWithQueryBy } from 'typesense-instantsearch-adapter'

export { Client } from 'typesense'
export { NodeConfiguration } from 'typesense/lib/Typesense/Configuration'
export { CollectionSchema, FieldType } from 'typesense/lib/Typesense/Collection'
export { CollectionCreateSchema } from 'typesense/lib/Typesense/Collections'
export { KeyCreateSchema, KeyDeleteSchema, KeySchema } from 'typesense/lib/Typesense/Key'
export { KeysRetrieveSchema } from 'typesense/lib/Typesense/Keys'

export { default as TypesenseInstantsearchAdapter } from 'typesense-instantsearch-adapter'
export { SearchParametersWithQueryBy, SearchParametersOptionalQueryBy } from 'typesense-instantsearch-adapter'

export { ImportResponse, SearchParams, SearchResponse } from 'typesense/lib/Typesense/Documents'

export { MetricsResponse } from 'typesense/lib/Typesense/Metrics'

export interface DisplayOptions {
  component: ComponentName
  map: {
    [key: string]: string
  }
}

export interface ExtendedCollectionDefinition {
  schema: CollectionSchema
  geoLocationField: string | null
  searchParameters: SearchParametersWithQueryBy
  displayOptions: DisplayOptions
}

export interface ExtendedCollectionsMap {
  [key: string]: ExtendedCollectionDefinition
}

export enum ComponentName {
  DEFAULT = 'Default',
}

export enum DocumentAction {
  CREATE = 'create',
  UPSERT = 'upsert',
  UPDATE = 'update',
}

export interface MapState {
  lat: number
  lng: number
  zoom: number
}

export type GenericObject = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
}

export const noop = (): void => undefined
