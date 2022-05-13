import React, { useEffect } from 'react'

import useStore from 'lib/store'
import { KeysRetrieveSchema } from 'lib/store/types'

export default function ApiKeys() {
  const [getAllKeys, deleteKey] = useStore(state => [state.getAllKeys, state.deleteKey])

  const [keys, setKeys] = React.useState<KeysRetrieveSchema>()

  useEffect(() => {
    getAllKeys().then(result => result && setKeys(result))
  }, [])

  return (
    <div>
      <ul>{keys && keys.keys.map(key => <li key={key.id}>{key.id}</li>)}</ul>
    </div>
  )
}
