import useStore from 'lib/store'
import React, { useEffect, useRef } from 'react'

import CodeEditor from 'components/CodeEditor'
import Monaco from 'monaco-editor'
import prettier from 'prettier/standalone'
import prettierParserBabel from 'prettier/parser-babel'

import theme from 'data/theme.json'
import jsonSchema from 'data/schema/searchParams.json'
import Button from 'components/Button'

import { ExtendedCollectionDefinition, SearchParams, SearchResponse } from 'lib/store/types'
import { getAllFieldsOfType } from 'lib/store/common'
import generateDefaultSearchParams from 'lib/generateDefaultSearchParams'

import { Allotment } from 'allotment'
import 'styles/allotment.scss'

export default function JSONSearch() {
  const [collections, currentCollectionName, search] = useStore(state => [
    state.collections,
    state.currentCollectionName,
    state.search,
  ])

  const currentCollection = collections[currentCollectionName]
  const currentCollectionRef = useRef<ExtendedCollectionDefinition>(currentCollection)

  const defaultSearchParams = generateDefaultSearchParams(currentCollection.schema)

  const [searchParams, setSearchParams] = React.useState<string>(
    prettier.format(JSON.stringify(defaultSearchParams), { parser: 'json', plugins: [prettierParserBabel] })
  )
  const searchParamsRef = useRef<string>(searchParams)
  const [error, setError] = React.useState<string | null>(null)
  const [response, setResponse] = React.useState<string | null>(null)

  useEffect(() => {
    currentCollectionRef.current = collections[currentCollectionName]
  }, [currentCollectionName])

  useEffect(() => {
    searchParamsRef.current = searchParams
  }, [searchParams])

  function handleSearch() {
    console.log(currentCollectionName, searchParams)

    if (searchParams) {
      try {
        const withoutComments = searchParamsRef.current.replace(
          /\\"|"(?:\\"|[^"])*"|(\/\/.*|\/\*[\s\S]*?\*\/)/g,
          (m, g) => (g ? '' : m)
        )
        const params: SearchParams = JSON.parse(withoutComments)
        search(currentCollectionRef.current.schema.name, params)
          .then(response => {
            const formattedResponse = JSON.stringify(response, null, 2)
            if (formattedResponse.split('\n').length > 1000) {
              setResponse(formattedResponse)
            } else {
              setResponse(prettier.format(formattedResponse, { parser: 'json', plugins: [prettierParserBabel] }))
            }
          })
          .catch(err => setError(err.message))
      } catch (err) {
        alert('could not parse')
      }
    }
  }

  return (
    <div className="flex flex-col h-full">
      <Allotment>
        <Allotment.Pane minSize={300}>
          {/* <div>{error && <div className="bg-red-500 text-white text-sm p-2 select-text">{error}</div>}</div> */}
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
            defaultValue={JSON.stringify(searchParams, null, 2)}
            value={searchParams}
            onChange={setSearchParams}
            onMount={(editor, monaco) => {
              monaco.editor.remeasureFonts()
              editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => handleSearch())
            }}
          />
        </Allotment.Pane>
        <Allotment.Pane minSize={300}>
          <CodeEditor
            language="json"
            beforeMount={monaco => {
              // monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
              //   validate: true,
              //   allowComments: false,
              //   schemas: [{ fileMatch: ['*'], uri: 'do.not.load', schema: jsonSchema }],
              // })
              monaco.editor.defineTheme('theme', theme as Monaco.editor.IStandaloneThemeData)
            }}
            options={{ readOnly: true }}
            defaultValue={''}
            value={response || ''}
          />
        </Allotment.Pane>
      </Allotment>
    </div>
  )
}
