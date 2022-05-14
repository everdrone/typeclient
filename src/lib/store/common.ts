import deepEqual from 'fast-deep-equal'
import deepDiff from 'deep-diff'

import { CollectionSchema, SearchParametersWithQueryBy, Client, ComponentName, FieldType } from './types'

import { ClientSlice } from './client'
import { CollectionSlice } from './collection'
import { DocumentSlice } from './document'
import { KeySlice } from './key'
import { PreferencesSlice } from './preferences'

export const connectionTimeoutSeconds = 5
export const cacheSearchResultsForSeconds = 2

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

// this function fetches the collections from the server, then
// compares them with the ones in the store, and returns the
// merges them so that the client is always up to date
export async function refreshCollections(
  fromClient: Client | null,
  oldCollections: ExtendedCollectionsMap
): Promise<ExtendedCollectionsMap> {
  let client = getClientOrThrow(fromClient)

  const freshCollections: ExtendedCollectionsMap = {}

  try {
    const newCollections = await client.collections().retrieve()

    newCollections.map(newCollection => {
      if (!(newCollection.name in oldCollections)) {
        // new collection not preset in the store, create it
        freshCollections[newCollection.name] = {
          schema: newCollection,
          searchParameters: {
            query_by: getAllFieldsOfType(newCollection, ['string', 'string[]'])
              .map(field => field.name)
              .join(','),
          },
          displayOptions: {
            component: ComponentName.DEFAULT,
            map: {},
          },
        }
      }

      const existingCollection = oldCollections[newCollection.name]

      if (deepEqual(newCollection, existingCollection.schema)) {
        // is the same, add it as is
        freshCollections[newCollection.name] = { ...existingCollection }
      } else {
        // not the same, reset the configuration
        // TODO: later we might want to make a nicer merge instead of just resetting
        freshCollections[newCollection.name] = {
          schema: newCollection,
          searchParameters: {
            query_by: getAllFieldsOfType(newCollection, ['string', 'string[]'])
              .map(field => field.name)
              .join(','),
          },
          displayOptions: {
            component: ComponentName.DEFAULT,
            map: {},
          },
        }
      }
    })

    return freshCollections
  } catch (err) {
    throw err
  }
}

export function getAllFieldsOfType(collection: CollectionSchema, types: FieldType[]) {
  return collection.fields.filter((field: any) => field.index && types.includes(field.type) && field.name)
}

export async function checkConnection(client: Client | null) {
  if (!client) return false
  try {
    const result = await client.health.retrieve()
    if ('ok' in result) {
      return result.ok
    }
  } catch (err) {
    console.error(err)
  }

  return false
}

export function getClientOrThrow(client: Client | null) {
  if (!client) {
    throw new Error('Client is not connected')
  }

  return client!
}

export type Store = ClientSlice & CollectionSlice & DocumentSlice & KeySlice & PreferencesSlice
