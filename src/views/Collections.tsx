import React, { useEffect } from 'react'
import { ipcRenderer } from 'electron'
import { Link } from 'react-router-dom'

import Button from 'components/Button'
import useStore from 'lib/store'

export default function ListCollections() {
  const [collections, deleteCollection, refreshCollections] = useStore(state => [
    state.collections,
    state.deleteCollection,
    state.refreshCollections,
  ])

  useEffect(() => {
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
      <ul>
        {Object.keys(collections).map(name => (
          <li key={name}>
            <p>{name}</p>
            <Link to={`/collection/${name}`}>
              <p>documents: {collections[name].schema.num_documents}</p>
            </Link>
            <p>fields: {collections[name].schema.fields.length}</p>
            <p>shards: {collections[name].schema.num_memory_shards}</p>
            <p>created: {collections[name].schema.created_at}</p>
            <Button onClick={() => handleDeleteCollection(name)} text="Dump" />
            <hr />
          </li>
        ))}
      </ul>
      <Link to="/collections/create">create</Link>
    </div>
  )
}

/*
import electron from 'electron'
const ipcRenderer = electron.ipcRenderer

<button
        onClick={() =>
          ipcRenderer.invoke('showMessageBox', {
            type: 'warning',
            buttons: ['Delete', 'Cancel'],
            message: 'Are you sure you want to delete this collection?',
            title: 'Delete Collection',
            cancelId: 1,
            defaultId: 1,
            noLink: true,
          })
        }
      >
        message
      </button>
       */
