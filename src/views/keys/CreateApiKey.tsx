import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import CodeEditor from 'components/CodeEditor'
import Monaco from 'monaco-editor'

import theme from 'data/theme.json'
import jsonSchema from 'data/schema/createApiKey.json'

import useStore from 'lib/store'
import Button from 'components/Button'
import { VscAdd } from 'react-icons/vsc'

export default function CreateApiKey() {
  const [createKey] = useStore(state => [state.createKey])

  const defaultValue = {
    description: 'Search-only key',
    actions: ['documents:search'],
    collections: ['*'],
  }

  const [keySchema, setKeySchema] = useState<string>(JSON.stringify(defaultValue, null, 2))

  const navigate = useNavigate()

  function handleCreate() {
    try {
      const parsed = JSON.parse(keySchema)
      createKey(parsed)
        .then(() => {
          navigate('/apikeys')
        })
        .catch(err => {
          console.error(err)
          alert('FIXME: implement me!')
        })
    } catch (err) {
      console.error(err)
      alert('FIXME: could not parse json')
    }
  }

  return (
    <>
      <div id="middle" className="grow">
        <CodeEditor
          language="json"
          beforeMount={monaco => {
            monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
              validate: true,
              allowComments: true,
              schemas: [{ fileMatch: ['*'], uri: 'do.not.load', schema: jsonSchema }],
            })
            monaco.editor.defineTheme('theme', theme as Monaco.editor.IStandaloneThemeData)
          }}
          defaultValue={keySchema}
          value={keySchema}
          onChange={setKeySchema}
          onMount={(editor, monaco) => {
            monaco.editor.remeasureFonts()
          }}
        />
      </div>
      <div id="bottom" className="border-t border-black p-2">
        <Button onClick={handleCreate} icon={<VscAdd />} text="Create" />
      </div>
    </>
  )
}
