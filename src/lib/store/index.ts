import create from 'zustand'

import createClientSlice, { ClientSlice } from './client'
import createCollectionSlice, { CollectionSlice } from './collection'

export type Store = ClientSlice & CollectionSlice

const useStore = create<Store>((set, get) => ({
  ...createClientSlice(set, get),
  ...createCollectionSlice(set, get),
}))

export default useStore
