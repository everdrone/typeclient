import { GetState, SetState } from 'zustand'
import {
  Client,
  TypesenseInstantsearchAdapter,
  NodeConfiguration,
  ExtendedCollectionsMap,
  SearchParametersWithQueryBy,
} from './types'

import {
  Store,
  checkConnection,
  getAllFieldsOfType,
  connectionTimeoutSeconds,
  cacheSearchResultsForSeconds,
} from './common'

export interface ClientSlice {
  client: Client | null
  adapter: TypesenseInstantsearchAdapter | null
  isConnected: boolean
  isConnecting: boolean
  connection: { nodes: NodeConfiguration[]; apiKey: string }
  connect: (apiKey: string, nodes: NodeConfiguration[]) => void
  disconnect: (preserveEndpoint: boolean) => void
  healthCheck: () => Promise<boolean>
}

const createClientSlice = (set: SetState<Store>, get: GetState<Store>): ClientSlice => ({
  client: null,
  adapter: null,
  isConnected: false,
  isConnecting: true,
  connection: { nodes: [], apiKey: '' },
  connect: async function (apiKey, nodes) {
    if (!apiKey || !nodes || !nodes.length) {
      console.error('API key and nodes are required')
      return set(() => ({ isConnecting: false }))
    }

    let client: Client | null = null
    let adapter: TypesenseInstantsearchAdapter | null = null
    let isConnected = false
    let collections: ExtendedCollectionsMap = {}
    let currentCollectionName = get().currentCollectionName

    // create the client
    try {
      client = new Client({ apiKey, nodes, cacheSearchResultsForSeconds, connectionTimeoutSeconds })
    } catch (err) {
      console.error(err)
    }

    // get health stats
    isConnected = await checkConnection(client)

    if (isConnected) {
      // enforce type
      client = client!

      // update collections
      let serverCollections = await client!.collections().retrieve()
      collections = serverCollections.reduce(
        (acc, val) => ({
          ...acc,
          [val.name]: {
            schema: val,
          },
        }),
        {}
      )

      if (serverCollections.length > 0) {
        // if there is no current collection
        // or the current collection does not exist on the server
        if (!currentCollectionName || !(currentCollectionName in collections)) {
          currentCollectionName = serverCollections[0].name
        }

        // get the current collection object
        const currentCollection = collections[currentCollectionName]

        // create the adapter options
        // TODO: check if there are collections saved with valid options first!
        const additionalSearchParameters: SearchParametersWithQueryBy = {
          query_by: getAllFieldsOfType(currentCollection.schema, ['string', 'string[]'])
            .map(field => field.name)
            .join(','),
        }

        collections[currentCollectionName].searchParameters = additionalSearchParameters

        // create the adapter
        try {
          adapter = new TypesenseInstantsearchAdapter({
            server: {
              apiKey,
              nodes,
              cacheSearchResultsForSeconds,
              connectionTimeoutSeconds,
            },
            // we do not want the parameters to be mutable, copy the object!
            additionalSearchParameters: { ...additionalSearchParameters },
          })
        } catch (err) {
          console.error(err)
        }
      }
    }

    set(() => ({
      client,
      adapter,
      isConnected,
      isConnecting: false,
      collections,
      currentCollectionName,
      connection: {
        apiKey,
        nodes,
      },
    }))
  },
  disconnect: function (preserveEndpoint) {
    set(prev => ({
      client: null,
      adapter: null,
      isConnected: false,
      isConnecting: false,
      currentCollectionName: null,
      collections: {},
      connection: preserveEndpoint ? prev.connection : { nodes: [], apiKey: '' },
    }))
  },
  healthCheck: async function () {
    return await checkConnection(get().client)
  },
})

export default createClientSlice
