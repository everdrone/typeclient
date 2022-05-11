import { GetState, SetState } from 'zustand'

import { ImportResponse } from './types'

import { Store, DocumentAction, getClientOrThrow } from './common'

export interface DocumentSlice {
  createDocument: (
    collectionName: string,
    document: any | any[],
    action: DocumentAction
  ) => Promise<ImportResponse[]> | Promise<{}>
  retrieveDocument: (collectionName: string, id: string) => Promise<{}>
  deleteDocument: (collectionName: string, id: string) => Promise<{}>
}

const createDocumentSlice = (
  set: SetState<Store>,
  get: GetState<Store>
): DocumentSlice => ({
  createDocument: function (collectionName, document, action) {
    let client = getClientOrThrow(get().client)

    // check if we are uploading an array
    if (Array.isArray(document)) {
      return client
        .collections(collectionName)
        .documents()
        .import(document, { action })
    } else {
      return client
        .collections(collectionName)
        .documents()
        .create(document, { action })
    }
  },
  retrieveDocument: function (collectionName, id) {
    let client = getClientOrThrow(get().client)

    return client.collections(collectionName).documents(id).retrieve()
  },
  deleteDocument: function (collectionName, id) {
    let client = getClientOrThrow(get().client)

    return client.collections(collectionName).documents(id).delete()
  },
})

export default createDocumentSlice