import create from 'zustand'

import { Store } from './common'
import createClientSlice, { ClientSlice } from './client'
import createCollectionSlice, { CollectionSlice } from './collection'
import createDocumentSlice, { DocumentSlice } from './document'
import createApiKeySlice, { ApiKeySlice } from './apiKey'

const useStore = create<Store>((set, get) => ({
  ...createClientSlice(set, get),
  ...createCollectionSlice(set, get),
  ...createDocumentSlice(set, get),
  ...createApiKeySlice(set, get),
}))

export default useStore
