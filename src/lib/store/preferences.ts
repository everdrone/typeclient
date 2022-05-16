import { GetState, SetState } from 'zustand'

import { MapState } from './types'
import { Store } from './common'

export interface PreferencesSlice {
  prefersJSONMode: boolean
  setPrefersJSONMode: (value: boolean) => void
  googleAPIKey: string
  setGoogleAPIKey: (value: string) => void
  isLoading: boolean
  setIsLoading: (value: boolean) => void
  lastMapPosition: MapState | null
  setLastMapPosition: (value: MapState) => void
}

const createPreferencesSlice = (set: SetState<Store>, get: GetState<Store>): PreferencesSlice => ({
  prefersJSONMode: true,
  googleAPIKey: '',
  isLoading: false,
  lastMapPosition: null,
  setPrefersJSONMode: value => {
    set(() => ({ prefersJSONMode: value }))
  },
  setGoogleAPIKey: value => {
    set(() => ({ googleAPIKey: value }))
  },
  setIsLoading: value => {
    set(() => ({ isLoading: value }))
  },
  setLastMapPosition: value => {
    set(() => ({ lastMapPosition: value }))
  },
})

export default createPreferencesSlice
