import React, { useEffect, useState } from 'react'
import Editor, { loader } from '@monaco-editor/react'
import Monaco from 'monaco-editor'
import * as monaco from 'monaco-editor'

import { ipcRenderer } from 'electron'
import { useParams, useNavigate } from 'react-router-dom'

import useStore from 'lib/store'
import { DocumentAction } from 'lib/store/common'

import theme from 'data/theme.json'
import generateJSONSchema from 'lib/generateJSONSchema'
import generateDefaultDocument from 'lib/generateDefaultDocument'
import { editorOptions } from 'components/CodeEditor'

export default function CreateDocument() {
  const [
    collections,
    currentCollectionName,
    createDocument,
    retrieveDocument,
    refreshCollections,
    setIsLoading,
    setCurrentCollection,
  ] = useStore(state => [
    state.collections,
    state.currentCollectionName,
    state.createDocument,
    state.retrieveDocument,
    state.refreshCollections,
    state.setIsLoading,
    state.setCurrentCollection,
  ])

  const [error, setError] = useState<string>()
  const [document, setDocument] = useState<string>('')
  const [action, setAction] = useState<DocumentAction>(DocumentAction.UPSERT)

  const navigate = useNavigate()
  const { id } = useParams()

  useEffect(() => {
    if (id !== null && id !== undefined) {
      retrieveDocument(currentCollectionName, id).then(res => setDocument(JSON.stringify(res, null, 2)))
    } else {
      const defaultDocument = generateDefaultDocument(collections[currentCollectionName].schema)
      setDocument(JSON.stringify(defaultDocument, null, 2))
    }

    ipcRenderer.on('importDocumentsFromFile', (event, data) => {
      setIsLoading(true)
      createDocument(currentCollectionName, data.documents, action)
        .then(res => {
          // all is good
          console.log(`imported ${data.documents.length} documents`)
          refreshCollections()
          setCurrentCollection(currentCollectionName)
          setIsLoading(false)
          navigate('/search')
        })
        .catch(err => {
          setError(err)
          alert('FIXME: implement me!')
        })
    })

    return () => {
      ipcRenderer.removeAllListeners('importDocumentsFromFile')
    }
  }, [])

  loader.config({ monaco })
  const jsonSchema = generateJSONSchema(collections[currentCollectionName].schema)

  function handleCreateDocument() {
    const parsedDocument = JSON.parse(document)
    createDocument(currentCollectionName, parsedDocument, action).then(res => {
      // all is good
      refreshCollections()
      navigate('/search')
    })
  }

  function handleImportFromFile() {
    setIsLoading(true)
    ipcRenderer.invoke('openImportDocumentsFromFile', { collectionName: currentCollectionName })
  }

  return (
    <>
      <div id="middle" className="grow">
        <Editor
          theme="theme"
          height="100%"
          beforeMount={monaco => {
            monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
              validate: true,
              allowComments: false,
              schemas: [{ fileMatch: ['*'], uri: 'do.not.load', schema: jsonSchema }],
            })
            monaco.editor.defineTheme('theme', theme as Monaco.editor.IStandaloneThemeData)
          }}
          onMount={() => monaco.editor.remeasureFonts()}
          defaultLanguage="json"
          defaultValue={document}
          value={document}
          options={editorOptions}
          onChange={newValue => {
            setDocument(newValue)
          }}
        />
      </div>
      <div id="bottom" className="border-t border-black">
        <select value={action} onChange={e => setAction(e.target.value as DocumentAction)}>
          <option value={DocumentAction.UPSERT}>Upsert</option>
          <option value={DocumentAction.CREATE}>Create</option>
          <option value={DocumentAction.UPDATE}>Update</option>
        </select>
        <button onClick={handleCreateDocument}>Create</button>
        <button onClick={handleImportFromFile}>Import from file</button>
      </div>
    </>
  )
}
