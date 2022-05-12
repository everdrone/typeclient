import React from 'react'
import Editor, { loader } from '@monaco-editor/react'
import Monaco from 'monaco-editor'
import * as monaco from 'monaco-editor'

import useStore from 'lib/store'

import theme from 'data/theme.json'
import jsonSchema from 'data/schema/createCollection.json'

const editorOptions = {
  minimap: {
    enabled: false,
  },
  // readOnly: true,
}

function Loading() {
  return <div className="bg-black"></div>
}

const defaultObject = {
  name: '',
  fields: [
    { name: '', type: 'string', index: true, optional: false, facet: false },
  ],
}

export default function CodeEditor() {
  console.log('Editor')
  loader.config({ monaco })

  const { connection, currentCollectionName, collections } = useStore()

  return (
    <div className="h-[400px] w-[600px] rounded-xl overflow-hidden m-5 shadow-xl">
      <Editor
        theme="theme"
        beforeMount={monaco => {
          monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
            validate: true,
            allowComments: false,
            schemas: [
              { fileMatch: ['*'], uri: 'do.not.load', schema: jsonSchema },
            ],
          })
          monaco.editor.defineTheme(
            'theme',
            theme as Monaco.editor.IStandaloneThemeData
          )
        }}
        onMount={(editor, monaco) => {
          // disables the command palette shortcut
          // editor.addCommand(monaco.KeyCode.F1, () => {})
          editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () =>
            alert('implement me')
          )
        }}
        height="100%"
        defaultLanguage="json"
        defaultValue={JSON.stringify(defaultObject, null, 2)}
        options={editorOptions}
        // onChange={(newValue, event) => {
        //   console.log(newValue)
        // }}
        loading={<Loading />}
      />
    </div>
  )
}
