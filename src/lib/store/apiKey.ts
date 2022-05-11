import { GetState, SetState } from 'zustand'

import {
  KeyCreateSchema,
  KeySchema,
  KeysRetrieveSchema,
  KeyDeleteSchema,
} from './types'

import { getClientOrThrow, Store } from './common'

export interface ApiKeySlice {
  createApiKey: (options: KeyCreateSchema) => Promise<KeySchema | false>
  retrieveApiKey: (id: number) => Promise<KeySchema | false>
  getAllApiKeys: () => Promise<KeysRetrieveSchema | false>
  deleteApiKey: (id: number) => Promise<KeyDeleteSchema | false>
}

const createApiKeySlice = (
  set: SetState<Store>,
  get: GetState<Store>
): ApiKeySlice => ({
  createApiKey: async function (options) {
    let client = getClientOrThrow(get().client)

    try {
      let result = await client.keys().create(options)

      return result
    } catch (err) {
      console.error(err)
      return false
    }
  },
  retrieveApiKey: async function (id) {
    let client = getClientOrThrow(get().client)

    try {
      let result = await client.keys(id).retrieve()

      return result
    } catch (err) {
      console.error(err)
      return false
    }
  },
  getAllApiKeys: async function () {
    let client = getClientOrThrow(get().client)

    try {
      let result = await client.keys().retrieve()

      return result
    } catch (err) {
      console.error(err)
      return false
    }
  },
  deleteApiKey: async function (id) {
    let client = getClientOrThrow(get().client)

    try {
      let result = await client.keys(id).delete()

      return result
    } catch (err) {
      console.error(err)
      return false
    }
  },
})

export default createApiKeySlice
