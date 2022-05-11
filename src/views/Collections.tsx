import React from 'react'
import electron from 'electron'

import useStore from 'lib/zustand'

export default function ListCollections() {
  const [collections] = useStore(state => [state.collections])

  const ipcRenderer = electron.ipcRenderer

  console.log(ipcRenderer)

  return (
    <div>
      <ul>
        {Object.keys(collections).map(name => (
          <li
            key={name}
            onClick={() => alert('navigate to collection details')}
          >
            {name} ({collections[name].schema.num_documents})
          </li>
        ))}
      </ul>
      <button>Create Collection</button>
      <hr />
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
    </div>
  )
}
