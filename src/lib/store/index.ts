import create from 'zustand'
import { persist } from 'zustand/middleware'

import deepMerge from 'deepmerge'

import { Store } from './common'
import createClientSlice, { ClientSlice } from './client'
import createCollectionSlice, { CollectionSlice } from './collection'
import createDocumentSlice, { DocumentSlice } from './document'
import createKeySlice, { KeySlice } from './key'
import createPreferencesSlice, { PreferencesSlice } from './preferences'

const STORAGE_NAME = 'typesense-dashboard-connection'

const useStore = create<Store>()(
  persist(
    (set, get) => ({
      ...createClientSlice(set, get),
      ...createCollectionSlice(set, get),
      ...createDocumentSlice(set, get),
      ...createKeySlice(set, get),
      ...createPreferencesSlice(set, get),
    }),
    {
      name: STORAGE_NAME,
      // exclude non-serializable fields
      partialize: state => {
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
