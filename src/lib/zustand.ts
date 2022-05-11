import create from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import deepEqual from 'fast-deep-equal'
import deepmerge from 'deepmerge'

import { Client } from 'typesense'
import TypesenseInstantsearchAdapter, {
  SearchParametersWithQueryBy,
} from 'typesense-instantsearch-adapter'
import { NodeConfiguration } from 'typesense/lib/Typesense/Configuration'
import { CollectionSchema } from 'typesense/lib/Typesense/Collection'
import { CollectionCreateSchema } from 'typesense/lib/Typesense/Collections'

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

export enum DocumentAction {
  CREATE = 'create',
  UPSERT = 'upsert',
  UPDATE = 'update',
}

export interface Store {
  /* state */
  client: Client | null
  adapter: TypesenseInstantsearchAdapter | null
  isConnected: boolean
  isConnecting: boolean
  connection: {
    nodes: NodeConfiguration[]
    apiKey: string
  }
  currentCollection: string | null // should we just use ExtendedCollectionDefinition?
  collections: ExtendedCollectionsMap
  /* actions */
  connect: (apiKey: string, nodes: NodeConfiguration[]) => Promise<void>
  disconnect: () => void
  healthCheck: () => Promise<boolean>
  updateCollections: () => void
  setCollectionSettings: (
    name: string,
    settings: {
      searchParameters: SearchParametersWithQueryBy
      displayOptions: DisplayOptions
    }
  ) => void
  setCurrentCollection: (name?: string) => void
  getCurrentCollection: () => ExtendedCollectionDefinition | null
  /* collection actions */
  dropCollection: (name: string) => Promise<boolean>
  createCollection: (schema: CollectionCreateSchema) => Promise<boolean>
  /* document actions */
  upsertDocument: (
    collection: string,
    document: any | any[],
    action: DocumentAction
  ) => Promise<boolean>
}

const STORAGE_NAME = 'typesense-dashboard-connection'

const useStore = create<Store>()(
  devtools(
    persist(
      (set, get) => ({
        /* state */
        client: null,
        adapter: null,
        isConnected: false,
        isConnecting: true,
        connection: {
          nodes: [],
          apiKey: '',
        },
        currentCollection: null,
        collections: {},
        /* actions */
        /**
         * Connect to the Typesense server.
         * Creates a Client instanec and an Adapter instance.
         */
        connect: async function (apiKey, nodes) {
          if (!apiKey || !nodes || nodes.length === 0) {
            console.error('No API key or nodes provided')
            return set(() => ({ isConnecting: false }))
          }

          let client: Client | null = null
          let adapter: TypesenseInstantsearchAdapter | null = null
          let isConnected = false
          let collections: ExtendedCollectionsMap = {}
          let currentCollection = get().currentCollection

          try {
            client = new Client({
              apiKey,
              nodes,
            })
          } catch (err) {
            console.error(err)
          }

          isConnected = await checkConnection(client)

          if (isConnected) {
            client = client!

            // get all the collections from the server
            let serverCollections = await client!.collections().retrieve()
            collections = serverCollections.reduce(
              (result, collection) => ({
                ...result,
                [collection.name]: {
                  schema: collection,
                },
              }),
              {}
            )

            if (serverCollections.length > 0) {
              if (!currentCollection) {
                // no current collection, set the first one
                currentCollection = serverCollections[0].name
              } else if (!(currentCollection in collections)) {
                // current collection does not exist on server
                currentCollection = serverCollections[0].name
              }

              const selectedCollection = collections[currentCollection]

              const additionalSearchParameters: SearchParametersWithQueryBy = {
                query_by: getAllFieldsOfType(selectedCollection.schema, [
                  'string',
                  'string[]',
                ])
                  .map(field => field.name)
                  .join(','),
              }

              collections[currentCollection].searchParameters =
                additionalSearchParameters

              try {
                adapter = new TypesenseInstantsearchAdapter({
                  server: {
                    apiKey,
                    nodes,
                  },
                  additionalSearchParameters: { ...additionalSearchParameters },
                })
              } catch (err) {
                console.error(err)
              }
            }
          }

          set(() => {
            return {
              client,
              adapter,
              isConnected,
              isConnecting: false,
              collections,
              currentCollection,
              connection: {
                apiKey,
                nodes,
              },
            }
          })
        },
        /**
         * Disconnect from the current client and adapter.
         */
        disconnect: function () {
          return set(state => ({
            isConnected: false,
            client: null,
            adapter: null,
            currentCollection: null,
            collections: {},
            connection: {
              apiKey: '',
              nodes: [],
            },
          }))
        },
        healthCheck: async function () {
          return await checkConnection(get().client)
        },
        /**
         * Updates the collections object in the store
         * This includes the schema, searchParameters and displayOptions
         */
        updateCollections: async function () {},
        setCollectionSettings: function (name, settings) {},
        setCurrentCollection: function (name) {
          let client = get().client
          let adapter: TypesenseInstantsearchAdapter | null = null
          let newCollection: ExtendedCollectionDefinition | null = null
          let collections = get().collections

          set(state => ({
            adapter: null,
            client: null,
          }))

          if (name) {
            newCollection = get().collections[name]
          } else {
            newCollection = get().collections[0]
          }

          collections[newCollection.schema.name].searchParameters = {
            query_by: getAllFieldsOfType(newCollection.schema, [
              'string',
              'string[]',
            ])
              .map(field => field.name)
              .join(','),
          }

          adapter = new TypesenseInstantsearchAdapter({
            server: {
              apiKey: get().connection.apiKey,
              nodes: get().connection.nodes,
            },
            additionalSearchParameters: {
              ...collections[newCollection.schema.name].searchParameters,
            },
          })

          return set(state => ({
            adapter,
            client,
            collections,
            currentCollection: name,
          }))
        },
        getCurrentCollection: function () {
          if (!get().currentCollection) return null
          return get().collections[get().currentCollection!]
        },
        /* collection actions */
        dropCollection: async function (name) {
          let client = get().client
          let collections = get().collections
          let currentCollection = get().currentCollection

          if (!client) {
            console.error('No client available')
            return false
          }

          if (!(name in collections)) {
            console.error('Collection does not exist')
            return false
          }

          try {
            const response = await client!.collections(name).delete()

            if (!('name' in response)) {
              return false
            }

            // remove collection from the store
            collections = Object.keys(collections).reduce(
              (result: ExtendedCollectionsMap, key) => {
                if (key !== name) {
                  result[key] = collections[key]
                }
                return result
              },
              {}
            )

            set(() => ({
              collections,
              currentCollection:
                currentCollection === name ? null : currentCollection,
            }))

            return true
          } catch (err) {
            throw err
          }
        },
        createCollection: async function (schema) {
          let client = get().client
          let collections = get().collections
          let currentCollection = get().currentCollection

          if (!client) {
            console.error('No client available')
            return false
          }

          try {
            const response = await client!.collections().create(schema)

            if (!('name' in response)) {
              return false
            }

            const additionalSearchParameters: SearchParametersWithQueryBy = {
              query_by: getAllFieldsOfType(response, ['string', 'string[]'])
                .map(field => field.name)
                .join(','),
            }

            // add collection to the store
            collections[schema.name] = {
              schema: response,
              searchParameters: { ...additionalSearchParameters },
              displayOptions: {
                component: 'Default',
                map: {},
              },
            }

            set(() => ({
              collections,
              currentCollection: schema.name,
            }))

            return true
          } catch (err) {
            throw err
          }
        },
        /* document actions */
        upsertDocument: async (collection, document, action) => {
          /**
           * FIXME: this function should return the value of the typesense response
           * so that it can be handled directly in the component
           *
           * remove the Promise<boolean> as return type and do the same for all other client requests
           */
          let client = get().client

          if (!client) {
            console.error('No client available')
            return false
          }

          console.log(collection, document, action)

          try {
            if (Array.isArray(document)) {
              const response = await client!
                .collections(collection)
                .documents()
                .import(document, { action })
              if (response.length) {
                return true
              }
              return false
            } else {
              const response = await client!
                .collections(collection)
                .documents()
                .create(document, { action })
              if ('id' in response) {
                return true
              }
              return false
            }
          } catch (err) {
            throw err
          }
        },
      }),
      {
        name: STORAGE_NAME,
        // exclude non-serializable fields
        partialize: state => {
          const { connection, collections, currentCollection } = state

          return {
            connection,
            collections,
            currentCollection,
          }
        },
        merge: (persisted, current) => {
          const stored = persisted as Store
          return deepmerge(current, stored)
        },
      }
    )
  )
)

function getAllFieldsOfType(collection: CollectionSchema, types: string[]) {
  return collection.fields.filter(
    (field: any) => field.index && types.includes(field.type) && field.name
  )
}

function generateCollectionSpecificSearchParameters(
  collection: CollectionSchema
) {
  return {
    query_by: getAllFieldsOfType(collection, ['string', 'string[]'])
      .map((field: any) => field.name)
      .join(','),
  }
}

async function checkConnection(client: Client | null) {
  if (!client) return false
  try {
    const result = await client.health.retrieve()
    if ('ok' in result) {
      return result.ok
    }
  } catch (err) {
    console.log(err)
  }

  return false
}

export default useStore
