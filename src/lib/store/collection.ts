import { GetState, SetState } from 'zustand'
import { CollectionSchema, SearchParametersWithQueryBy } from './types'

import { Store } from './common'

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

export interface CollectionSlice {
  currentCollectionName: string | null
  collections: ExtendedCollectionsMap
}

const createCollectionSlice = (
  set: SetState<Store>,
  get: GetState<Store>
): CollectionSlice => ({
  currentCollectionName: null,
  collections: {},
})

export default createCollectionSlice
