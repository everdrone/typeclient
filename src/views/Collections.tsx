import React from 'react'

import useStore from 'lib/store'

export default function ListCollections() {
  const [collections] = useStore(state => [state.collections])

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
    </div>
  )
}
