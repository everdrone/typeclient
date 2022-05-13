import { GetState, SetState } from 'zustand'
import {
  CollectionSchema,
  TypesenseInstantsearchAdapter,
  ExtendedCollectionsMap,
  ExtendedCollectionDefinition,
  CollectionCreateSchema,
  ComponentName,
} from './types'

import { getAllFieldsOfType, getClientOrThrow, Store, refreshCollections } from './common'

export interface CollectionSlice {
  currentCollectionName: string | null
  collections: ExtendedCollectionsMap
  setCurrentCollection: (name?: string) => void
  createCollection: (schema: CollectionCreateSchema) => Promise<CollectionSchema | false>
  deleteCollection: (name: string) => Promise<CollectionSchema | false>
  refreshCollections: () => void
}

const createCollectionSlice = (set: SetState<Store>, get: GetState<Store>): CollectionSlice => ({
  currentCollectionName: null,
  collections: {},
  setCurrentCollection: function (name) {
    const client = getClientOrThrow(get().client)
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
    const client = getClientOrThrow(get().client)
    let adapter = get().adapter
    let collections = get().collections

    try {
      const result = await client.collections().create(schema)

      const extendedCollection = {
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
      }

      if (!adapter || Object.keys(collections).length === 0) {
        adapter = new TypesenseInstantsearchAdapter({
          server: {
            apiKey: get().connection.apiKey,
            nodes: get().connection.nodes,
          },
          additionalSearchParameters: {
            // make immutable!
            ...extendedCollection.searchParameters,
          },
        })
      }

      set(prev => ({
        adapter,
        currentCollectionName: result.name,
        collections: {
          ...prev.collections,
          [result.name]: { ...extendedCollection },
        },
      }))

      return result
    } catch (err) {
      console.error(err)
      return false
    }
  },
  deleteCollection: async function (name: string) {
    const client = getClientOrThrow(get().client)
    let currentCollectionName = get().currentCollectionName

    try {
      const result = await client.collections(name).delete()

      if (currentCollectionName === name) {
        const availableCollections = Object.keys(get().collections).filter(collectionName => collectionName !== name)
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
  refreshCollections: function () {
    const client = getClientOrThrow(get().client)

    refreshCollections(client, get().collections).then(newCollections => {
      let currentCollectionName = get().currentCollectionName

      if (!(currentCollectionName in newCollections)) {
        const availableCollections = Object.keys(newCollections)
        if (availableCollections.length > 0) {
          currentCollectionName = availableCollections[0]
        } else {
          currentCollectionName = null
        }
      }

      console.info('refreshing collections')

      set(() => ({
        collections: { ...(newCollections as ExtendedCollectionsMap) },
        currentCollectionName,
      }))
    })
  },
})

export default createCollectionSlice
