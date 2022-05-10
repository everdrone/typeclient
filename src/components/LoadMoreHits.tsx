import React from 'react'
import { connectInfiniteHits } from 'react-instantsearch-dom'

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
      <button disabled={!hasMore} onClick={refineNext}>
        Load more
      </button>
    </div>
  )
}

// FIXME: wtf??
export default connectInfiniteHits<any, any>(LoadMoreHits)
