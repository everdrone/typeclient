import React, { useState } from 'react'

import { NodeConfiguration } from 'lib/store/types'
import useStore from 'lib/store'

import Button from 'components/Button'

import 'styles/connection.scss'
import { VscAdd, VscTrash } from 'react-icons/vsc'

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
  const [nodes, setNodes] = useState<string[]>(ensureInitialNodeArray(storedNodes))
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
    return nodes.map(node => `${node.protocol}://${node.host}:${node.port}${node.path === '/' ? '' : node.path}`)
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

    const nodeErrors = nodes.map(node => {
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
    <div className="flex justify-center items-start h-full">
      <div className="flex flex-col elevated-box">
        {errors.apiKey && <p className="text-danger-fg">{errors.apiKey}</p>}
        <label>API Key</label>
        <input type="text" value={apiKey} onChange={e => setApiKey(e.target.value)} />
        <ul>
          <li className="flex flex-col">
            {errors.nodes[0] && <p className="text-danger-fg">{errors.nodes[0]}</p>}
            <label>Node</label>
            <input type="text" value={nodes[0]} onChange={e => setNodeAt(0, e.target.value)} />
          </li>
          {nodes.map((node, index) => {
            if (index === 0) return null
            return (
              <li key={index} className="flex flex-col">
                {errors.nodes[index] && <p className="text-danger-fg">{errors.nodes[index]}</p>}
                <label>Node {index + 1}</label>
                <div className="flex gap-2 mb-4 nomargin">
                  <input className="grow" type="text" value={node} onChange={e => setNodeAt(index, e.target.value)} />
                  <Button
                    onClick={() => removeNode(index)}
                    icon={<VscTrash className="text-lg m-[2px] leading-none" />}
                  />
                </div>
              </li>
            )
          })}
          <li>
            <Button onClick={() => addNode()} text="Add node" icon={<VscAdd />} />
          </li>
        </ul>
        <Button
          onClick={() => {
            if (validateConnection()) {
              connect(apiKey, stringArrayToNodes(nodes))
            }
          }}
          text="Connect"
        />
      </div>
    </div>
  )
}
