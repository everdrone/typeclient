import React from 'react'
import Monaco from 'monaco-editor'
import * as monaco from 'monaco-editor'

import Editor, { EditorProps } from '@monaco-editor/react'

export const editorOptions: Monaco.editor.IStandaloneEditorConstructionOptions = {
  fontFamily: 'Cascadia Code',
  formatOnPaste: true,
  minimap: {
    enabled: false,
  },
  automaticLayout: true,
}

export default function CodeEditor(editorProps: EditorProps) {
  return (
    <Editor
      theme="theme"
      height="100%"
      onMount={() => monaco.editor.remeasureFonts()}
      defaultLanguage="json"
      options={editorOptions}
      {...editorProps}
      // beforeMount
      // defaultValue
      // value
      // onChange
    />
  )
}
