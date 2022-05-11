import { CollectionSchema, SearchParametersWithQueryBy } from './types'

import { ClientSlice } from './client'
import { CollectionSlice } from './collection'

export interface DisplayOptions {
  component: string
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

export interface collectionSpecificSearchParameters {
  [key: string]: SearchParametersWithQueryBy
}

export enum DocumentAction {
  CREATE = 'create',
  UPSERT = 'upsert',
  UPDATE = 'update',
}

// export interface Store {
//   /* state */
//   client: Client | null
//   adapter: TypesenseInstantsearchAdapter | null
//   isConnected: boolean
//   isConnecting: boolean
//   connection: {
//     nodes: NodeConfiguration[]
//     apiKey: string
//   }
//   currentCollection: string | null // should we just use ExtendedCollectionDefinition?
//   collections: ExtendedCollectionsMap

//   /* actions */
//   connect: (apiKey: string, nodes: NodeConfiguration[]) => Promise<void>
//   disconnect: () => void
//   healthCheck: () => Promise<boolean>
//   updateCollections: () => void
//   setCollectionSettings: (
//     name: string,
//     settings: {
//       searchParameters: SearchParametersWithQueryBy
//       displayOptions: DisplayOptions
//     }
//   ) => void
//   setCurrentCollection: (name?: string) => void
//   getCurrentCollection: () => ExtendedCollectionDefinition | null

//   /* collection actions */
//   dropCollection: (name: string) => Promise<boolean>
//   createCollection: (schema: CollectionCreateSchema) => Promise<boolean>

//   /* document actions */
//   upsertDocument: (
//     collection: string,
//     document: any | any[],
//     action: DocumentAction
//   ) => Promise<boolean>
// }

export type Store = ClientSlice & CollectionSlice
