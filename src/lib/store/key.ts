import { GetState, SetState } from 'zustand'

import {
  KeyCreateSchema,
  KeySchema,
  KeysRetrieveSchema,
  KeyDeleteSchema,
} from './types'

import { getClientOrThrow, Store } from './common'

export interface KeySlice {
  createKey: (options: KeyCreateSchema) => Promise<KeySchema | false>
  retrieveKey: (id: number) => Promise<KeySchema | false>
  getAllKeys: () => Promise<KeysRetrieveSchema | false>
  deleteKey: (id: number) => Promise<KeyDeleteSchema | false>
}

const createKeySlice = (
  set: SetState<Store>,
  get: GetState<Store>
): KeySlice => ({
  createKey: async function (options) {
    let client = getClientOrThrow(get().client)

    try {
      let result = await client.keys().create(options)

      return result
    } catch (err) {
      console.error(err)
      return false
    }
  },
  retrieveKey: async function (id) {
    let client = getClientOrThrow(get().client)

    try {
      let result = await client.keys(id).retrieve()

      return result
    } catch (err) {
      console.error(err)
      return false
    }
  },
  getAllKeys: async function () {
    let client = getClientOrThrow(get().client)

    try {
      let result = await client.keys().retrieve()

      return result
    } catch (err) {
      console.error(err)
      return false
    }
  },
  deleteKey: async function (id) {
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

export default createKeySlice
