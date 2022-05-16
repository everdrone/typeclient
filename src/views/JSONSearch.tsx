import useStore from 'lib/store'
import React, { useEffect, useRef, useState } from 'react'

import CodeEditor from 'components/CodeEditor'
import Monaco from 'monaco-editor'
import { format } from 'prettier/standalone'
import prettierParserBabel from 'prettier/parser-babel'

import { VscPlay } from 'react-icons/vsc'
import { Allotment } from 'allotment'
import 'styles/allotment.scss'

import theme from 'data/theme.json'
import jsonSchema from 'data/schema/searchParams.json'

import { ExtendedCollectionDefinition, SearchParams } from 'lib/store/types'
import generateDefaultSearchParams from 'lib/generateDefaultSearchParams'

import Button from 'components/Button'

export default function JSONSearch() {
  const [client, collections, currentCollectionName, search] = useStore(state => [
    state.client,
    state.collections,
    state.currentCollectionName,
    state.search,
  ])

  const currentCollectionRef = useRef<ExtendedCollectionDefinition>(collections[currentCollectionName])

  const [searchParams, setSearchParams] = useState<string>('')
  const searchParamsRef = useRef<string>(searchParams)
  const [error, setError] = useState<string | null>(null)
  const [response, setResponse] = useState<string | null>(null)

  useEffect(() => {
    currentCollectionRef.current = collections[currentCollectionName]

    const defaultSearchParams = generateDefaultSearchParams(collections[currentCollectionName].schema)
    setSearchParams(format(JSON.stringify(defaultSearchParams), { parser: 'json', plugins: [prettierParserBabel] }))
    console.log(defaultSearchParams)
  }, [currentCollectionName])

  useEffect(() => {
    searchParamsRef.current = searchParams
  }, [searchParams])

  function handleSearch() {
    if (searchParamsRef.current) {
      try {
        const withoutComments = searchParamsRef.current.replace(
          /\\"|"(?:\\"|[^"])*"|(\/\/.*|\/\*[\s\S]*?\*\/)/g,
          (m, g) => (g ? '' : m)
        )
        const params: SearchParams = JSON.parse(withoutComments)
        search(currentCollectionRef.current.schema.name, params)
          .then(response => {
            const formattedResponse = JSON.stringify(response, null, 2)
            // if above 2000 lines, skip prettier (slow)
            if (formattedResponse.split('\n').length > 2000) {
              setResponse(formattedResponse)
            } else {
              setResponse(format(formattedResponse, { parser: 'json', plugins: [prettierParserBabel] }))
            }
          })
          .catch(err => setError(err.message))
      } catch (err) {
        alert('could not parse')
      }
    }
  }

  if (!client || !currentCollectionName) {
    return null
  }

  return (
    <div className="flex flex-col h-full">
      <div className="grow">
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
                // editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, handleSearch)
                editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, handleSearch)
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
      <div className="border-t border-black p-2">
        <Button onClick={handleSearch} icon={<VscPlay />} text="Search" />
      </div>
    </div>
  )
}
