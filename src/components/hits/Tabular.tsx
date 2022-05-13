import React, { useEffect } from 'react'
import { ipcRenderer } from 'electron'

import { Highlight } from 'react-instantsearch-dom'
import { Link } from 'react-router-dom'

import useStore from 'lib/store'
import Button from 'components/Button'

const ignoreKeys = ['objectID', '__position', '_snippetResult', '_highlightResult', 'text_match']

export default function Tabular({ hit }: any) {
  const [currentCollectionName] = useStore(state => [state.currentCollectionName, state.deleteDocument])

  function handleDeleteDocument() {
    ipcRenderer.invoke('confirmDeleteDocument', { collectionName: currentCollectionName, documentId: hit.objectID })
  }

  return (
    <>
      <div className="grid grid-cols-12 gap-x-4">
        {Object.keys(hit)
          .filter(key => !ignoreKeys.includes(key))
          .map(key => (
            <React.Fragment key={key}>
              <div className="col-span-3 text-right">{key}</div>
              <div className="col-span-9">
                <Highlight attribute={key} hit={hit} />
              </div>
            </React.Fragment>
          ))}
      </div>
      <div className="flex">
        <Link to={`/documents/edit/${hit.id}`}>
          <Button text="Edit" />
        </Link>
        <Button className="destructive" onClick={handleDeleteDocument} text="Delete" />
      </div>
    </>
  )
}
