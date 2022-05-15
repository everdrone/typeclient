import React, { useEffect } from 'react'
import { ipcRenderer } from 'electron'
import { Link, useNavigate } from 'react-router-dom'

import { VscTrash } from 'react-icons/vsc'

import Button from 'components/Button'
import useStore from 'lib/store'

export default function ListCollections() {
  const [collections, deleteCollection, refreshCollections, setCurrentCollection] = useStore(state => [
    state.collections,
    state.deleteCollection,
    state.refreshCollections,
    state.setCurrentCollection,
  ])

  const navigate = useNavigate()

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
      <ul className="grid grid-cols-12 gap-4 p-4">
        {Object.keys(collections).map(name => (
          <li key={name} className="col-span-4 2xl:col-span-3 bg-canvas-overlay p-4 rounded-xl">
            <p>{name}</p>
            <button
              onClick={() => {
                setCurrentCollection(name)
                navigate('/documents/create')
              }}
            >
              <p>documents: {collections[name].schema.num_documents}</p>
            </button>
            <Link to={`/collection/${name}`}>
              <p>fields: {collections[name].schema.fields.length}</p>
              <p>shards: {collections[name].schema.num_memory_shards}</p>
              <p>created: {collections[name].schema.created_at}</p>
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
