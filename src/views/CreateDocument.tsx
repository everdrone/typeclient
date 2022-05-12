import React, { useState } from 'react'
import Editor, { loader } from '@monaco-editor/react'
import Monaco from 'monaco-editor'
import * as monaco from 'monaco-editor'

import useStore from 'lib/store'
import { DocumentAction } from 'lib/zustand'

import theme from 'data/theme.json'
import generateJSONSchema from 'lib/generateJSONSchema'

export default function CreateDocument() {
  const [collections, currentCollectionName, createDocument] = useStore(state => [
    state.collections,
    state.currentCollectionName,
    state.createDocument,
  ])
  const [document, setDocument] = useState<string>()
  const [action, setAction] = useState<DocumentAction>(DocumentAction.CREATE)

  loader.config({ monaco })
  const jsonSchema = generateJSONSchema(collections[currentCollectionName].schema)

  function handleCreateDocument() {
    const parsedDocument = JSON.parse(document)
    createDocument(currentCollectionName, parsedDocument, action)
  }

  return (
    <div>
      <div className="h-[400px] w-[600px] rounded-xl overflow-hidden m-5 shadow-xl">
        <Editor
          theme="theme"
          beforeMount={monaco => {
            monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
              validate: true,
              allowComments: false,
              schemas: [{ fileMatch: ['*'], uri: 'do.not.load', schema: jsonSchema }],
            })
            monaco.editor.defineTheme('theme', theme as Monaco.editor.IStandaloneThemeData)
          }}
          onMount={(editor, monaco) => {
            // disables the command palette shortcut
            // editor.addCommand(monaco.KeyCode.F1, () => {})
            editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => alert('implement me'))
          }}
          height="100%"
          defaultLanguage="json"
          defaultValue={JSON.stringify({}, null, 2)}
          value={document}
          options={{
            minimap: {
              enabled: false,
            },
          }}
          onChange={newValue => {
            setDocument(newValue)
          }}
        />
      </div>
      <select value={action} onChange={e => setAction(e.target.value as DocumentAction)}>
        <option value={DocumentAction.CREATE}>Create</option>
        <option value={DocumentAction.UPSERT}>Upsert</option>
        <option value={DocumentAction.UPDATE}>Update</option>
      </select>
      <button onClick={handleCreateDocument}>Create</button>
    </div>
  )
}
