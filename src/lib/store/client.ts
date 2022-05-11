import { GetState, SetState } from 'zustand'
import {
  Client,
  TypesenseInstantsearchAdapter,
  NodeConfiguration,
} from './types'

import { Store } from './common'

export interface ClientSlice {
  client: Client | null
  adapter: TypesenseInstantsearchAdapter | null
  isConnected: boolean
  isConnecting: boolean
  connection: { nodes: NodeConfiguration[]; apiKey: string }
  connect: (apiKey: string, nodes: NodeConfiguration[]) => Promise<void>
  disconnect: () => void
  healthCheck: () => Promise<boolean>
}

const createClientSlice = (
  set: SetState<Store>,
  get: GetState<Store>
): ClientSlice => ({
  client: null,
  adapter: null,
  isConnected: false,
  isConnecting: true,
  connection: { nodes: [], apiKey: '' },
  connect: async (apiKey: string, nodes: NodeConfiguration[]) => {
    return
  },
  disconnect: () => {},
  healthCheck: async () => {
    return false
  },
})

export default createClientSlice
