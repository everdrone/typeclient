import React, { useEffect } from 'react'
import { ipcRenderer } from 'electron'
import { Link, useNavigate } from 'react-router-dom'
import { DateTime } from 'luxon'

import { VscAdd, VscTrash } from 'react-icons/vsc'

import Button, { LinkButton } from 'components/Button'
import useStore from 'lib/store'

export default function ListCollections() {
  const [collections, refreshCollections, deleteCollection, setCurrentCollection] = useStore(state => [
    state.collections,
    state.refreshCollections,
    state.deleteCollection,
    state.setCurrentCollection,
  ])

  const navigate = useNavigate()

  useEffect(() => {
    refreshCollections()

    ipcRenderer.on('deleteCollection', (event, data) => {
      deleteCollection(data.name)
    })

    return () => {
      ipcRenderer.removeAllListeners('deleteCollection')
    }
  }, [])

  function handleDeleteCollection(name: string) {
    ipcRenderer.invoke('confirmDeleteCollection', { name })
  }

  return (
    <div>
      <ul className="grid grid-cols-12 gap-4 p-4">
        {Object.keys(collections).map(name => (
          <li key={name} className="col-span-4 2xl:col-span-3 bg-canvas-subtle p-4 rounded-xl">
            <p>{name}</p>
            <button
              onClick={() => {
                setCurrentCollection(name)
                navigate('/documents/create')
              }}
            >
              <p>documents: {collections[name].schema.num_documents}</p>
            </button>
            <Link to={`/schema/${name}`}>
              <p>fields: {collections[name].schema.fields.length}</p>
              <p>shards: {collections[name].schema.num_memory_shards}</p>
              <p>created: {DateTime.fromSeconds(collections[name].schema.created_at).toHTTP()}</p>
            </Link>
            <Button
              onClick={() => handleDeleteCollection(name)}
              className="destructive"
              icon={<VscTrash />}
              text="Drop"
            />
          </li>
        ))}
      </ul>
      <LinkButton to="/collections/create" icon={<VscAdd />} text="Create" />
    </div>
  )
}
