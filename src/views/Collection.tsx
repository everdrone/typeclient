import React, { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'

import useStore from 'lib/store'

export default function Collection() {
  const { name } = useParams()
  const [collections, setCurrentCollection] = useStore(state => [state.collections, state.setCurrentCollection])

  const collection = name in collections ? collections[name] : null

  useEffect(() => {
    if (collection) {
      setCurrentCollection(name)
    }
  }, [])

  if (!collection) {
    return <div>FIXME: implement me!</div>
  }

  return (
    <div>
      <Link to="/documents/create">Add documents</Link>
      <code>
        <pre>{JSON.stringify(collection.schema, null, 2)}</pre>
      </code>
    </div>
  )
}
