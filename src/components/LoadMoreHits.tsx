import React from 'react'
import { connectInfiniteHits } from 'react-instantsearch-dom'

import Button from 'components/Button'

function LoadMoreHits({
  hits,
  // hasPrevious,
  // refinePrevious,
  hasMore,
  refineNext,
  // componentDisplayMap,
  component,
}: any) {
  const HitComponent = component

  return (
    <div>
      <ul>
        {hits.map((hit: any) => (
          <li key={hit.objectID}>
            <HitComponent hit={hit} />
          </li>
        ))}
      </ul>
      <Button disabled={!hasMore} onClick={refineNext} text="Load More" />
    </div>
  )
}

// FIXME: wtf??
export default connectInfiniteHits<any, any>(LoadMoreHits)
