import React, { ChangeEvent, useEffect } from 'react'
import { Listbox, Menu } from '@headlessui/react'

import useStore from 'lib/store'
import { VscChevronDown } from 'react-icons/vsc'

export default function SelectCollection() {
  const [collections, currentCollectionName, setCurrentCollection] = useStore(state => [
    state.collections,
    state.currentCollectionName,
    state.setCurrentCollection,
  ])

  function handleChange(e: ChangeEvent<HTMLSelectElement>) {
    setCurrentCollection(e.target.value)
  }

  const currentCollection = collections[currentCollectionName]

  if (Object.keys(collections).length === 0) {
    return <div className="ml-4 flex items-center justify-between text-secondary-muted">No collections</div>
  }

  return (
    <div className="relative">
      <Listbox
        value={currentCollectionName ? currentCollection.schema.name : collections[0].schema.name}
        onChange={setCurrentCollection}
      >
        <Listbox.Button className="w-full flex items-center justify-between button large">
          <span className="ml-6 whitespace-nowrap overflow-hidden">
            <span className="font-mono">{currentCollectionName}</span> ({currentCollection.schema.num_documents})
          </span>
          <VscChevronDown className="shrink-0" />
        </Listbox.Button>
        <Listbox.Options className="absolute left-4 bg-canvas-overlay rounded-xl z-20 p-2 border border-border-default shadow-2xl">
          {Object.keys(collections).map(name => (
            <Listbox.Option
              key={name}
              value={name}
              className="cursor-pointer rounded-md transition-colors px-2 min-w-[150px] py-[6px] leading-[20px] hover:bg-primary-hover"
            >
              {name} ({collections[name].schema.num_documents})
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </Listbox>
    </div>
  )

  return (
    <select
      value={currentCollectionName ? currentCollection.schema.name : collections[0].schema.name}
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
