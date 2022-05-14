import React from 'react'
import Monaco from 'monaco-editor'
import * as monaco from 'monaco-editor'

import Editor, { EditorProps } from '@monaco-editor/react'

export const editorOptions: Monaco.editor.IStandaloneEditorConstructionOptions = {
  fontFamily: process.platform !== 'darwin' ? 'Cascadia Code' : 'SFMono-Regular',
  letterSpacing: 0.1,
  // lineHeight: 21,
  // fontSize: 13,
  fontLigatures: false,
  formatOnPaste: true,
  minimap: {
    enabled: false,
  },
  automaticLayout: true,
  cursorBlinking: 'smooth',
  cursorSmoothCaretAnimation: true,
  copyWithSyntaxHighlighting: false,
  codeLens: false,
  wordWrap: 'on',
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
