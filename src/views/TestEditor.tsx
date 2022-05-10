import React from 'react'
import Editor, { loader } from '@monaco-editor/react'
import Monaco from 'monaco-editor'
// import * as monaco from 'monaco-editor'

import theme from 'data/theme.json'

const editorOptions = {
  minimap: {
    enabled: false,
  },
  // readOnly: true,
}

function Loading() {
  return <div className="bg-black"></div>
}

export default function CodeEditor() {
  console.log('Editor render')
  // loader.config({ monaco })

  return (
    <div className="h-[400px] w-[600px] rounded-xl overflow-hidden m-5 shadow-xl">
      <Editor
        theme="vs-dark"
        beforeMount={monaco => {
          monaco.editor.defineTheme(
            'theme',
            theme as Monaco.editor.IStandaloneThemeData
          )
        }}
        onMount={(editor, monaco) => {
          // disables the command palette
          // editor.addCommand(monaco.KeyCode.F1, () => {})
          editor.addCommand(
            monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter,
            () => {
              alert('run')
            }
          )
        }}
        height="100%"
        defaultLanguage="json"
        defaultValue={JSON.stringify(theme, null, 2)}
        options={editorOptions}
        onChange={(newValue, event) => {
          console.log(newValue)
        }}
        loading={<Loading />}
      />
    </div>
  )
}
