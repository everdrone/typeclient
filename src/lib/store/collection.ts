import { GetState, SetState } from 'zustand'
import {
  CollectionSchema,
  TypesenseInstantsearchAdapter,
  ExtendedCollectionsMap,
  ExtendedCollectionDefinition,
  CollectionCreateSchema,
  ComponentName,
} from './types'

import { getAllFieldsOfType, getClientOrThrow, Store } from './common'

export interface CollectionSlice {
  currentCollectionName: string | null
  collections: ExtendedCollectionsMap
  setCurrentCollection: (name?: string) => void
  createCollection: (
    schema: CollectionCreateSchema
  ) => Promise<CollectionSchema | false>
  deleteCollection: (name: string) => Promise<CollectionSchema | false>
}

const createCollectionSlice = (
  set: SetState<Store>,
  get: GetState<Store>
): CollectionSlice => ({
  currentCollectionName: null,
  collections: {},
  setCurrentCollection: name => {
    let client = get().client
    let adapter = get().adapter
    let newCollection: ExtendedCollectionDefinition | null = null
    let collections = get().collections

    // set null to reset instantsearch UI
    set(() => ({
      client: null,
      adapter: null,
    }))

    // if there are no collections, return
    if (Object.keys(collections).length === 0) {
      return set(() => ({
        currentCollectionName: null,
      }))
    }

    if (name) {
      newCollection = collections[name]
    } else {
      newCollection = get().collections[0]
    }

    collections[newCollection.schema.name].searchParameters = {
      query_by: getAllFieldsOfType(newCollection.schema, ['string', 'string[]'])
        .map(field => field.name)
        .join(','),
    }

    adapter = new TypesenseInstantsearchAdapter({
      server: {
        apiKey: get().connection.apiKey,
        nodes: get().connection.nodes,
      },
      additionalSearchParameters: {
        // make immutable!
        ...collections[newCollection.schema.name].searchParameters,
      },
    })

    return set(() => ({
      client,
      adapter,
      collections,
      currentCollectionName: name,
    }))
  },
  createCollection: async function (schema: CollectionCreateSchema) {
    let client = getClientOrThrow(get().client)

    try {
      const result = await client.collections().create(schema)

      set(prev => ({
        currentCollectionName: result.name,
        collections: {
          ...prev.collections,
          [result.name]: {
            schema: result,
            searchParameters: {
              query_by: getAllFieldsOfType(result, ['string', 'string[]'])
                .map(field => field.name)
                .join(','),
            },
            displayOptions: {
              component: ComponentName.DEFAULT,
              map: {},
            },
          },
        },
      }))

      return result
    } catch (err) {
      console.error(err)
      return false
    }
  },
  deleteCollection: async function (name: string) {
    let client = getClientOrThrow(get().client)
    let currentCollectionName = get().currentCollectionName

    try {
      const result = await client.collections(name).delete()

      if (currentCollectionName === name) {
        const availableCollections = Object.keys(get().collections).filter(
          collectionName => collectionName !== name
        )
        if (availableCollections.length > 0) {
          currentCollectionName = availableCollections[0]
        } else {
          currentCollectionName = null
        }
      }

      set(prev => ({
        currentCollectionName,
        collections: Object.keys(prev.collections)
          .filter(key => key !== name)
          .reduce((acc: ExtendedCollectionsMap, key) => {
            acc[key] = prev.collections[key]
            return acc
          }, {}),
      }))
    } catch (err) {
      console.error(err)
      return false
    }
  },
})

export default createCollectionSlice
