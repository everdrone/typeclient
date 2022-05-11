import React, { useState } from 'react'
import useStore from 'lib/zustand'
import { NodeConfiguration } from 'typesense/lib/Typesense/Configuration'

interface ErrorMapping {
  apiKey: string | null
  nodes: (string | null)[]
}

export default function Connection() {
  console.log('Connection')
  const [connect, storedApiKey, storedNodes] = useStore(state => [
    state.connect,
    state.connection.apiKey,
    state.connection.nodes,
  ])

  const [apiKey, setApiKey] = useState<string>(storedApiKey ?? '')
  const [nodes, setNodes] = useState<string[]>(
    ensureInitialNodeArray(storedNodes)
  )
  const [errors, setErrors] = useState<ErrorMapping>({
    apiKey: null,
    nodes: [null],
  })

  function ensureInitialNodeArray(nodes: NodeConfiguration[]): string[] {
    if (nodes.length === 0) {
      return ['']
    }
    return nodesToStringArray(nodes)
  }

  function nodesToStringArray(nodes: NodeConfiguration[]): string[] {
    return nodes.map(
      node =>
        `${node.protocol}://${node.host}:${node.port}${
          node.path === '/' ? '' : node.path
        }`
    )
  }

  function stringArrayToNodes(nodes: string[]): NodeConfiguration[] {
    try {
      return nodes.map(node => {
        const { protocol, hostname, port, pathname } = new URL(node)

        return {
          protocol: protocol.slice(0, -1),
          host: hostname,
          port: Number(port),
          path: pathname,
        }
      })
    } catch (err) {
      console.error(err)
      return []
    }
  }

  function removeNode(index: number) {
    setNodes(nodes.filter((_, i) => i !== index))
  }

  function addNode() {
    setNodes([...nodes, ''])
  }

  function setNodeAt(index: number, value: string) {
    const newNodes = [...nodes]
    newNodes[index] = value
    setNodes(newNodes)
  }

  function validateConnection(): boolean {
    let result = true
    let newErrors = { ...errors }

    if (!apiKey) {
      result &&= false
      newErrors.apiKey = 'API key is required'
    }

    if (nodes.length === 0) {
      result &&= false
      newErrors.nodes = ['At least one node is required']
    }

    const nodeErrors = nodes.map((node, index) => {
      if (!node) {
        return 'Node is required'
      } else {
        try {
          new URL(node)
        } catch (err) {
          return 'Invalid URL'
        }
      }
      return null
    })

    newErrors = { ...newErrors, nodes: nodeErrors }

    setErrors(newErrors)

    return result
  }

  return (
    <div>
      {errors.apiKey && <p className="text-red-500">{errors.apiKey}</p>}
      <input
        type="text"
        placeholder="API Key"
        value={apiKey}
        onChange={e => setApiKey(e.target.value)}
      />
      <ul>
        <li>
          {errors.nodes[0] && <p className="text-red-500">{errors.nodes[0]}</p>}
          <input
            type="text"
            placeholder="http://localhost:8108"
            value={nodes[0]}
            onChange={e => setNodeAt(0, e.target.value)}
          />
        </li>
        {nodes.map((node, index) => {
          if (index === 0) return null
          return (
            <li key={index}>
              {errors.nodes[index] && (
                <p className="text-red-500">{errors.nodes[index]}</p>
              )}
              <input
                type="text"
                placeholder="http://localhost:8108"
                value={node}
                onChange={e => setNodeAt(index, e.target.value)}
              />
              <button onClick={() => removeNode(index)}>Remove</button>
            </li>
          )
        })}
        <li>
          <button onClick={() => addNode()}>Add Node</button>
        </li>
      </ul>
      <button
        onClick={() => {
          if (validateConnection()) {
            connect(apiKey, stringArrayToNodes(nodes))
          }
        }}
      >
        Connect
      </button>
    </div>
  )
}
