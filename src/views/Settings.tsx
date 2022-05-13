import React from 'react'

import useStore from 'lib/store'

export default function Settings() {
  const [googleAPIKey, setGoogleAPIKey] = useStore(state => [state.googleAPIKey, state.setGoogleAPIKey])

  return (
    <div>
      <h1>Settings</h1>
      <input
        type="text"
        placeholder="Google Maps API Key"
        value={googleAPIKey}
        onChange={e => setGoogleAPIKey(e.target.value)}
      />
    </div>
  )
}
