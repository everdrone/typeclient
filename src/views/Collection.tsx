import React, { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'

import Editor, { loader } from '@monaco-editor/react'
import Monaco from 'monaco-editor'
import * as monaco from 'monaco-editor'

import useStore from 'lib/store'
import Button from 'components/Button'

import theme from 'data/theme.json'

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
      <div id="top">
        <Link to="/documents/create">
          <Button text="Add documents" />
          <Button className="destructive" text="Drop collection" />
        </Link>
      </div>
      <div id="middle" className="grow w-full flex flex-col">
        <Editor
          theme="theme"
          height="100%"
          beforeMount={monaco => {
            monaco.editor.defineTheme('theme', theme as Monaco.editor.IStandaloneThemeData)
          }}
          defaultLanguage="json"
          defaultValue={JSON.stringify(collection.schema, null, 2)}
          options={{ readOnly: true, minimap: { enabled: false } }}
        />
      </div>
    </>
  )
}
