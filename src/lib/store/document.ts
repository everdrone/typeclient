import { GetState, SetState } from 'zustand'

import { ImportResponse, DocumentAction, SearchParams, SearchResponse } from './types'

import { Store, getClientOrThrow } from './common'

export interface DocumentSlice {
  createDocument: (
    collectionName: string,
    document: any | any[],
    action: DocumentAction
  ) => Promise<ImportResponse[]> | Promise<{}>
  retrieveDocument: (collectionName: string, id: string) => Promise<{}>
  deleteDocument: (collectionName: string, id: string) => Promise<{}>
  search: (collectionName: string, params: SearchParams) => Promise<SearchResponse<{}>>
}

const createDocumentSlice = (set: SetState<Store>, get: GetState<Store>): DocumentSlice => ({
  createDocument: function (collectionName, document, action) {
    const client = getClientOrThrow(get().client)

    // check if we are uploading an array
    if (Array.isArray(document)) {
      return client.collections(collectionName).documents().import(document, { action })
    } else {
      return client.collections(collectionName).documents().create(document, { action })
    }
  },
  retrieveDocument: function (collectionName, id) {
    const client = getClientOrThrow(get().client)

    return client.collections(collectionName).documents(id).retrieve()
  },
  deleteDocument: function (collectionName, id) {
    const client = getClientOrThrow(get().client)

    return client.collections(collectionName).documents(id).delete()
  },
  search: function (collectionName, params) {
    const client = getClientOrThrow(get().client)

    return client.collections(collectionName).documents().search(params)
  },
})

export default createDocumentSlice
