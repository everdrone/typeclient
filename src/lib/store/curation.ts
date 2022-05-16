import { GetState, SetState } from 'zustand'

import { OverridesRetrieveSchema, OverrideCreateSchema, OverrideSchema, OverrideDeleteSchema } from './types'

import { getClientOrThrow, Store } from './common'

export interface CurationSlice {
  createCuration: (collectionName: string, id: string, params: OverrideCreateSchema) => Promise<OverrideSchema | false>
  retrieveCuration: (collectionName: string, id: string) => Promise<OverrideSchema | false>
  getAllCurations: (collectionName: string) => Promise<OverridesRetrieveSchema | false>
  deleteCuration: (collectionName: string, id: string) => Promise<OverrideDeleteSchema | false>
}

const createCurationSlice = (set: SetState<Store>, get: GetState<Store>): CurationSlice => ({
  createCuration: async function (collectionName, id, params) {
    const client = getClientOrThrow(get().client)

    try {
      const result = client.collections(collectionName).overrides().upsert(id, params)

      return result
    } catch (err) {
      console.error(err)
      return false
    }
  },
  retrieveCuration: async function (collectionName, id) {
    const client = getClientOrThrow(get().client)

    try {
      const result = await client.collections(collectionName).overrides(id).retrieve()

      return result
    } catch (err) {
      console.error(err)
      return false
    }
  },
  getAllCurations: async function (collectionName) {
    const client = getClientOrThrow(get().client)

    try {
      const result = await client.collections(collectionName).overrides().retrieve()

      return result
    } catch (err) {
      console.error(err)
      return false
    }
  },
  deleteCuration: async function (collectionName, id) {
    const client = getClientOrThrow(get().client)

    try {
      const result = await client.collections(collectionName).overrides(id).delete()

      return result
    } catch (err) {
      console.error(err)
      return false
    }
  },
})

export default createCurationSlice
