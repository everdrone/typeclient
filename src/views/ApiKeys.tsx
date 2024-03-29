import React, { useEffect, useState } from 'react'
import { DateTime } from 'luxon'
import { VscAdd } from 'react-icons/vsc'

import useStore from 'lib/store'
import { KeysRetrieveSchema } from 'lib/store/types'

import { LinkButton } from 'components/Button'

export default function ApiKeys() {
  const [getAllKeys, deleteKey, refreshCollections] = useStore(state => [
    state.getAllKeys,
    state.deleteKey,
    state.refreshCollections,
  ])

  const [keys, setKeys] = useState<KeysRetrieveSchema>()

  useEffect(() => {
    refreshCollections()
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
      <table className="table-auto w-full text-left">
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
                <td>{DateTime.fromSeconds(key.expires_at).toHTTP()}</td>
                <td>
                  <button onClick={() => handleDelete(key.id)}>Delete</button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      <LinkButton to="/apikeys/create" icon={<VscAdd />} text="Create" />
    </div>
  )
}
