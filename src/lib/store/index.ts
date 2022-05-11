import create from 'zustand'

import { Store } from './common'
import createClientSlice, { ClientSlice } from './client'
import createCollectionSlice, { CollectionSlice } from './collection'
import createDocumentSlice, { DocumentSlice } from './document'
import createKeySlice, { KeySlice } from './key'

const useStore = create<Store>((set, get) => ({
  ...createClientSlice(set, get),
  ...createCollectionSlice(set, get),
  ...createDocumentSlice(set, get),
  ...createKeySlice(set, get),
}))

export default useStore
