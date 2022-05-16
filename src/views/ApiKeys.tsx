import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import useStore from 'lib/store'
import { KeysRetrieveSchema } from 'lib/store/types'

export default function ApiKeys() {
  const [getAllKeys, deleteKey] = useStore(state => [state.getAllKeys, state.deleteKey])

  const [keys, setKeys] = useState<KeysRetrieveSchema>()

  useEffect(() => {
    getAllKeys().then(result => result && setKeys(result))
  }, [])

  async function handleDelete(id: number) {
    // FIXME: ask for confirmation!
    await deleteKey(id)
    const newKeys = await getAllKeys()
    if (newKeys !== false) {
      setKeys(newKeys)
    }
  }

  console.log(keys)

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Prefix</th>
            <th>Description</th>
            <th>Actions</th>
            <th>Collections</th>
            <th>Expires At</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {keys &&
            keys.keys.map(key => (
              <tr key={key.id}>
                <td>{key.id}</td>
                {/* @ts-ignore */}
                <td>{key.value_prefix}</td>
                <td>{key.description}</td>
                <td>{key.actions}</td>
                <td>{key.collections}</td>
                <td>{key.expires_at}</td>
                <td>
                  <button onClick={() => handleDelete(key.id)}>Delete</button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      <Link to="/apikeys/create">Create</Link>
    </div>
  )
}
