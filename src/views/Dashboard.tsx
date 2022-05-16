import React, { useEffect, useState } from 'react'

import useStore from 'lib/store'
import { MetricsResponse } from 'lib/store/types'

import prettyBytes from 'pretty-bytes'

export default function Dashboard() {
  const [getMetrics, refreshCollections] = useStore(state => [state.getMetrics, state.refreshCollections])

  const [metrics, setMetrics] = useState<MetricsResponse>()

  const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' })

  function handleGetMetrics() {
    getMetrics()
      .then(metrics => {
        setMetrics(metrics)
      })
      .catch(() => alert('FIXME: implement me!'))
  }

  useEffect(() => {
    refreshCollections()
    handleGetMetrics()

    const instervalId = setInterval(handleGetMetrics, 2000)

    return () => {
      clearInterval(instervalId)
    }
  }, [])

  function formatCPUName(name: string) {
    const stripped = name.replace(/^system_cpu/, '').replace(/_active_percentage$/, '')

    if (stripped === '') {
      return 'Total'
    } else {
      return `CPU ${stripped}`
    }
  }

  return (
    <div className="absolute inset-0 overflow-auto">
      <ul className="flex flex-col">
        {metrics &&
          Object.keys(metrics)
            .filter(key => key.startsWith('system_cpu') && key.endsWith('_active_percentage'))
            .sort(collator.compare)
            .map(key => {
              if (key in metrics) {
                return (
                  <li key={key}>
                    {formatCPUName(key)}: {parseInt(metrics[key as keyof MetricsResponse])}%
                  </li>
                )
              }
            })}
      </ul>
      <ul>
        <li>System disk total: {metrics && prettyBytes(parseInt(metrics.system_disk_total_bytes))}</li>
        <li>System disk used: {metrics && prettyBytes(parseInt(metrics.system_disk_used_bytes))}</li>
      </ul>
      <ul>
        <li>System memory total: {metrics && prettyBytes(parseInt(metrics.system_memory_total_bytes))}</li>
        <li>System memory used: {metrics && prettyBytes(parseInt(metrics.system_memory_used_bytes))}</li>
      </ul>
      <ul>
        <li>Network received: {metrics && prettyBytes(parseInt(metrics.system_network_received_bytes))}</li>
        <li>Network sent: {metrics && prettyBytes(parseInt(metrics.system_network_sent_bytes))}</li>
      </ul>
      <ul>
        <li>Typesense active memory: {metrics && prettyBytes(parseInt(metrics.typesense_memory_active_bytes))}</li>
        <li>
          Typesense allocated memory: {metrics && prettyBytes(parseInt(metrics.typesense_memory_allocated_bytes))}
        </li>
        <li>
          Typesense fragmentation ratio: {metrics && prettyBytes(parseInt(metrics.typesense_memory_mapped_bytes))}
        </li>
        <li>Typesense mapped memory: {metrics && prettyBytes(parseInt(metrics.typesense_memory_metadata_bytes))}</li>
        <li>Typesense metadata: {metrics && prettyBytes(parseInt(metrics.typesense_memory_resident_bytes))}</li>
        <li>Typesense resident memory: {metrics && prettyBytes(parseInt(metrics.typesense_memory_retained_bytes))}</li>
        <li>
          Typesense retained memory: {metrics && prettyBytes(parseInt(metrics.typesense_memory_fragmentation_ratio))}
        </li>
      </ul>
    </div>
  )
}
