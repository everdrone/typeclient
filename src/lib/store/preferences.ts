import { GetState, SetState } from 'zustand'

import { Store } from './common'

export interface PreferencesSlice {
  prefersJSONMode: boolean
  googleAPIKey: string
  isLoading: boolean
  setPrefersJSONMode: (value: boolean) => void
  setGoogleAPIKey: (value: string) => void
  setIsLoading: (value: boolean) => void
}

const createPreferencesSlice = (set: SetState<Store>, get: GetState<Store>): PreferencesSlice => ({
  prefersJSONMode: false,
  googleAPIKey: '',
  isLoading: false,
  setPrefersJSONMode: value => {
    set(() => ({ prefersJSONMode: value }))
  },
  setGoogleAPIKey: value => {
    set(() => ({ googleAPIKey: value }))
  },
  setIsLoading: value => {
    set(() => ({ isLoading: value }))
  },
})

export default createPreferencesSlice
