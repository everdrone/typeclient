import React from 'react'
import Monaco from 'monaco-editor'
import * as monaco from 'monaco-editor'

import Editor, { EditorProps, loader } from '@monaco-editor/react'

export const editorOptions: Monaco.editor.IStandaloneEditorConstructionOptions = {
  fontFamily: process.platform !== 'darwin' ? 'Cascadia Code' : 'SFMono-Regular',
  letterSpacing: 0.1,
  // lineHeight: 21,
  // ...(process.platform === 'darwin' ? { fontSize: 13 } : {}),
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
  wrappingStrategy: 'advanced',
  renderLineHighlight: 'all',
  tabSize: 2,
}

export default function CodeEditor({ options, ...editorProps }: EditorProps) {
  loader.config({ monaco })

  return (
    <Editor
      theme="theme"
      height="100%"
      onMount={() => monaco.editor.remeasureFonts()}
      defaultLanguage="json"
      options={{ ...editorOptions, ...options }}
      {...editorProps}
      // beforeMount
      // defaultValue
      // value
      // onChange
    />
  )
}
