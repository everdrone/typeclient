import React from 'react'
import { connectInfiniteHits } from 'react-instantsearch-dom'
import { InfiniteHitsProvided } from 'react-instantsearch-core'

import Button from 'components/Button'

interface HitDisplayComponentProps {
  hit: any
  map?: any
}

interface LoadMoreHitsProps {
  component: React.ComponentType<HitDisplayComponentProps>
}

function LoadMoreHits({
  hits,
  // hasPrevious,
  // refinePrevious,
  hasMore,
  refineNext,
  // componentDisplayMap,
  component,
}: InfiniteHitsProvided & LoadMoreHitsProps) {
  const HitComponent = component

  return (
    <>
      <ul>
        {hits.map((hit: Record<string, any>) => (
          <li key={hit.objectID}>
            <HitComponent hit={hit} />
          </li>
        ))}
      </ul>
      <Button disabled={!hasMore} onClick={refineNext} text="Load More" />
    </>
  )
}

// FIXME: wtf??
export default connectInfiniteHits<any, any>(LoadMoreHits)
