import React from 'react'
import electron from 'electron'
import { Link } from 'react-router-dom'

import useStore from 'lib/store'

export default function ListCollections() {
  const [collections] = useStore(state => [state.collections])

  const ipcRenderer = electron.ipcRenderer

  return (
    <div>
      <ul>
        {Object.keys(collections).map(name => (
          <li key={name}>
            <Link to={`/collection/${name}`}>
              {name} ({collections[name].schema.num_documents})
            </Link>
          </li>
        ))}
      </ul>
      <Link to="/collections/create">
        create
        {/* <Button icon={<VscAdd />} text="New Collection" /> */}
      </Link>
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
