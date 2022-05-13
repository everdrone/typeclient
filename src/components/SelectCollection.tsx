import React, { ChangeEvent, useEffect } from 'react'

import useStore from 'lib/store'

export default function SelectCollection() {
  const [collections, currentCollectionName, setCurrentCollection] = useStore(state => [
    state.collections,
    state.currentCollectionName,
    state.setCurrentCollection,
  ])

  function handleChange(e: ChangeEvent<HTMLSelectElement>) {
    setCurrentCollection(e.target.value)
  }

  if (!currentCollectionName) return null

  return (
    <select
      value={currentCollectionName ? collections[currentCollectionName].schema.name : collections[0].schema.name}
      onChange={handleChange}
    >
      {Object.keys(collections).map(name => (
        <option key={name} value={name}>
          {name} ({collections[name].schema.num_documents})
        </option>
      ))}
    </select>
  )
}
