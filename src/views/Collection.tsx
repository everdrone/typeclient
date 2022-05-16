import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'

import Editor, { loader } from '@monaco-editor/react'
import Monaco from 'monaco-editor'
import * as monaco from 'monaco-editor'

import { VscTrash, VscAdd } from 'react-icons/vsc'

import useStore from 'lib/store'
import Button, { LinkButton } from 'components/Button'

import theme from 'data/theme.json'
import { editorOptions } from 'components/CodeEditor'

export default function Collection() {
  const { name } = useParams()
  const [collections, setCurrentCollection] = useStore(state => [state.collections, state.setCurrentCollection])

  const collection = name in collections ? collections[name] : null

  loader.config({ monaco })

  useEffect(() => {
    if (collection) {
      setCurrentCollection(name)
    }
  }, [])

  if (!collection) {
    return <div>FIXME: implement me!</div>
  }

  return (
    <>
      <div id="middle" className="grow w-full flex flex-col">
        <Editor
          theme="theme"
          height="100%"
          beforeMount={monaco => {
            monaco.editor.defineTheme('theme', theme as Monaco.editor.IStandaloneThemeData)
          }}
          onMount={() => monaco.editor.remeasureFonts()}
          defaultLanguage="json"
          defaultValue={JSON.stringify(collection.schema, null, 2)}
          options={{ ...editorOptions, readOnly: true }}
        />
      </div>
      <div id="bottom" className="flex justify-between border-t border-black p-2">
        <LinkButton to="/documents/create" icon={<VscAdd />} text="Add documents" />
        <Button
          className="destructive"
          icon={<VscTrash />}
          text="Drop collection"
          onClick={() => alert('FIXME: implement me!')}
        />
      </div>
    </>
  )
}
