import { GetState, SetState } from 'zustand'

import { Store } from './common'

export interface PreferencesSlice {
  prefersJSONMode: boolean
  setPrefersJSONMode: (value: boolean) => void
}

const createPreferencesSlice = (
  set: SetState<Store>,
  get: GetState<Store>
): PreferencesSlice => ({
  prefersJSONMode: false,
  setPrefersJSONMode: value => {
    set(() => ({ prefersJSONMode: value }))
  },
})

export default createPreferencesSlice
