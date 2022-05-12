import React, { ChangeEvent, useEffect, useState } from 'react'
import { VscBracketDot, VscPreview } from 'react-icons/vsc'

import Editor, { loader } from '@monaco-editor/react'
import Monaco from 'monaco-editor'
import * as monaco from 'monaco-editor'

import { getAllFieldsOfType } from 'lib/store/common'
import useStore from 'lib/store'
import theme from 'data/theme.json'
import jsonSchema from 'data/schema/createCollection.json'

import Button from 'components/Button'
import {
  CollectionSchema,
  CollectionCreateSchema,
  FieldType,
} from 'lib/store/types'

interface FormErrors {
  name: string | null
  allFields: string | null
  fields: (string | null)[]
}

interface FormProps {
  schema: CollectionCreateSchema
  setSchema: (schema: CollectionCreateSchema) => void
}

function CreateCollectionForm({ schema, setSchema }: FormProps) {
  const [createCollection] = useStore(state => [state.createCollection])

  const [errors, setErrors] = useState<FormErrors>({
    name: null,
    allFields: null,
    fields: [null],
  })
  // const [schema, setSchema] = useState<CollectionCreateSchema>({
  //   name: '',
  //   fields: [
  //     { name: '', type: 'string', index: true, optional: false, facet: false },
  //   ],
  // })

  function handleChangeName(e: ChangeEvent<HTMLInputElement>) {
    setSchema({ ...schema, name: e.target.value })
  }

  function handleChangeFieldName(
    e: ChangeEvent<HTMLInputElement>,
    index: number
  ) {
    const fields = [...schema.fields]
    fields[index].name = e.target.value
    setSchema({ ...schema, fields })
  }

  function handleChangeFieldType(
    e: ChangeEvent<HTMLSelectElement>,
    index: number
  ) {
    const fields = [...schema.fields]
    fields[index].type = e.target.value as FieldType
    setSchema({ ...schema, fields })
  }

  function handleChangeFieldBoolean(
    e: ChangeEvent<HTMLInputElement>,
    index: number,
    property: 'optional' | 'index' | 'facet'
  ) {
    const fields = [...schema.fields]
    fields[index][property] = e.target.checked
    setSchema({ ...schema, fields })
  }

  function handleAddField() {
    setSchema({
      ...schema,
      fields: [
        ...schema.fields,
        {
          name: '',
          type: 'string',
          index: true,
          optional: false,
          facet: false,
        },
      ],
    })
  }

  function handleRemoveField(index: number) {
    const fields = [...schema.fields]
    fields.splice(index, 1)
    setSchema({ ...schema, fields })
  }

  function validateForm(): boolean {
    let result = true
    let errors: FormErrors = { name: null, allFields: null, fields: [] }

    if (!schema.name) {
      result &&= false
      errors = { ...errors, name: 'Collection name is required' }
    } else {
      errors = { ...errors, name: null }
    }

    if (schema.fields.length === 0) {
      result &&= false
      errors = { ...errors, allFields: 'At least one field is required' }
    } else {
      errors = { ...errors, allFields: null }
    }

    const fieldErrors = schema.fields.map((field, index) => {
      if (!field.name) {
        result &&= false
        return 'Field name is required'
      } else {
        return null
      }
    })

    errors = { ...errors, fields: fieldErrors }

    console.log(!!schema.name)

    setErrors(errors)

    return result
  }

  function handleCreate() {
    if (validateForm()) {
      createCollection(schema)
        .then(res => alert('implement me'))
        .catch(err => alert('implement me'))
    }
  }

  console.log(
    getAllFieldsOfType(schema as CollectionSchema, ['int32', 'float'])
  )

  return (
    <div>
      {errors.name && <p className="text-danger-fg">{errors.name}</p>}
      <input
        type="text"
        placeholder="Collection name"
        value={schema.name}
        onChange={handleChangeName}
      />
      <select>
        <option value=""></option>
        {getAllFieldsOfType(schema as CollectionSchema, ['int32', 'float']).map(
          (field, index) => (
            <option key={index} value={field.name}>
              {field.name}
            </option>
          )
        )}
      </select>
      {errors.allFields && <p className="text-danger-fg">{errors.allFields}</p>}
      <ul>
        {schema.fields.map((field, index) => (
          <li key={index}>
            {errors.fields[index] && (
              <p className="text-danger-fg">{errors.fields[index]}</p>
            )}
            <input
              type="text"
              placeholder="Field"
              value={field.name}
              onChange={e => handleChangeFieldName(e, index)}
            />
            <select
              value={field.type}
              onChange={e => handleChangeFieldType(e, index)}
            >
              <option value="string">string</option>
              <option value="string[]">string[]</option>
              <option value="int32">int32</option>
              <option value="int32[]">int32[]</option>
              <option value="int64">int64</option>
              <option value="int64[]">int64[]</option>
              <option value="float">float</option>
              <option value="float[]">float[]</option>
              <option value="bool">bool</option>
              <option value="bool">bool[]</option>
              <option value="geopoint">geopoint</option>
              <option value="geopoint[]">geopoint[]</option>
              <option value="string*">string*</option>
              <option value="auto">auto</option>
            </select>
            <label>
              <input
                type="checkbox"
                checked={field.index}
                onChange={e => handleChangeFieldBoolean(e, index, 'index')}
              />
              Index
            </label>
            <label>
              <input
                type="checkbox"
                checked={field.optional}
                onChange={e => handleChangeFieldBoolean(e, index, 'optional')}
              />
              Optional
            </label>
            <label>
              <input
                type="checkbox"
                checked={field.facet}
                onChange={e => handleChangeFieldBoolean(e, index, 'facet')}
              />
              Facet
            </label>
            <button onClick={() => handleRemoveField(index)}>Remove</button>
          </li>
        ))}
      </ul>
      <button onClick={handleAddField}>Add field</button>
      <button onClick={handleCreate}>Create</button>
    </div>
  )
}

export default function CreateSchema() {
  const [prefersJSONMode, setPrefersJSONMode] = useStore(state => [
    state.prefersJSONMode,
    state.setPrefersJSONMode,
  ])

  const [rawValue, setRawValue] = useState<string>('')
  const [schema, setSchema] = useState<CollectionCreateSchema>({
    name: '',
    fields: [
      { name: '', type: 'string', index: true, optional: false, facet: false },
    ],
  })

  useEffect(() => {
    if (prefersJSONMode) {
      try {
        setSchema(JSON.parse(rawValue))
        console.log(schema)
      } catch (err) {
        console.warn('Invalid JSON')
      }
    }
  }, [rawValue])

  useEffect(() => {
    if (!prefersJSONMode) {
      setRawValue(JSON.stringify(schema, null, 2))
    }
  }, [schema])

  const editor = (
    <div className="h-full">
      <Editor
        theme="theme"
        height="50%"
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
        defaultLanguage="json"
        defaultValue={JSON.stringify(schema, null, 2)}
        options={{ minimap: { enabled: false } }}
        onChange={value => setRawValue(value)}
        value={rawValue}
      />
      <button
        onClick={() => {
          // FIXME: validate schema and set errors at the bottom
        }}
      >
        Create
      </button>
    </div>
  )
  const form = <CreateCollectionForm schema={schema} setSchema={setSchema} />

  return (
    <div>
      <Button
        icon={prefersJSONMode ? <VscPreview /> : <VscBracketDot />}
        text={prefersJSONMode ? 'Form' : 'JSON'}
        onClick={() => setPrefersJSONMode(!prefersJSONMode)}
      />
      {prefersJSONMode ? editor : form}
    </div>
  )
}
