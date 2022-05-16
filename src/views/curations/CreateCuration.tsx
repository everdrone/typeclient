import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import CodeEditor from 'components/CodeEditor'
import Monaco from 'monaco-editor'

import theme from 'data/theme.json'
import createJsonSchema from 'data/schema/createCuration.json'
import editJsonSchema from 'data/schema/editCuration.json'

import { OverrideCreateSchema } from 'typesense/lib/Typesense/Overrides'
import useStore from 'lib/store'
import Button from 'components/Button'
import { VscAdd, VscArrowUp } from 'react-icons/vsc'

import short from 'short-uuid'

export default function CreateApiKey() {
  const [currentCollectionName, createCuration, retrieveCuration] = useStore(state => [
    state.currentCollectionName,
    state.createCuration,
    state.retrieveCuration,
  ])

  const defaultValue: OverrideCreateSchema = {
    rule: { query: '', match: 'contains' },
    includes: [],
    excludes: [],
  }

  const [curationId, setCurationId] = useState<string>(short.generate())
  const [curationSchema, setCurationSchema] = useState<string>('')

  const navigate = useNavigate()
  const { id } = useParams()

  useEffect(() => {
    if (id !== null && id !== undefined) {
      retrieveCuration(currentCollectionName, id).then(res => setCurationSchema(JSON.stringify(res, null, 2)))
    } else {
      setCurationSchema(JSON.stringify(defaultValue, null, 2))
    }
  }, [])

  function handleCreate() {
    try {
      const parsed = JSON.parse(curationSchema)
      createCuration(currentCollectionName, curationId, parsed)
        .then(() => {
          navigate('/curations')
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
              schemas: [{ fileMatch: ['*'], uri: 'do.not.load', schema: id ? editJsonSchema : createJsonSchema }],
            })
            monaco.editor.defineTheme('theme', theme as Monaco.editor.IStandaloneThemeData)
          }}
          defaultValue={curationSchema}
          value={curationSchema}
          onChange={setCurationSchema}
          onMount={(editor, monaco) => {
            monaco.editor.remeasureFonts()
          }}
        />
      </div>
      <div id="bottom" className="flex border-t border-black p-2 nomargin gap-4">
        {id ? (
          <Button onClick={handleCreate} icon={<VscArrowUp />} text="Update" />
        ) : (
          <>
            <input
              type="text"
              value={curationId}
              onChange={e => setCurationId(e.target.value)}
              placeholder="Curation ID"
              className="w-[250px]"
            />
            <Button onClick={handleCreate} icon={<VscAdd />} text="Create" />
          </>
        )}
      </div>
    </>
  )
}
