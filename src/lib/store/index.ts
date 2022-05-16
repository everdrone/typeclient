import create from 'zustand'
import { persist } from 'zustand/middleware'

import deepMerge from 'deepmerge'

import { Store } from './common'
import createClientSlice from './client'
import createCollectionSlice from './collection'
import createDocumentSlice from './document'
import createKeySlice from './key'
import createCurationSlice from './curation'
import createPreferencesSlice from './preferences'

const STORAGE_NAME = 'typesense-dashboard-connection'

const useStore = create<Store>()(
  persist(
    (set, get) => ({
      ...createClientSlice(set, get),
      ...createCollectionSlice(set, get),
      ...createDocumentSlice(set, get),
      ...createKeySlice(set, get),
      ...createCurationSlice(set, get),
      ...createPreferencesSlice(set, get),
    }),
    {
      name: STORAGE_NAME,
      // exclude non-serializable fields
      partialize: state => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { client, adapter, isConnected, isConnecting, ...rest } = state

        return { ...rest }
      },
      merge: (persisted, current) => {
        const stored = persisted as Store
        return deepMerge(current, stored)
      },
    }
  )
)

export default useStore
