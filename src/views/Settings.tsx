import React from 'react'

import useStore from 'lib/store'

export default function Settings() {
  const [mapBoxToken, setMapBoxToken] = useStore(state => [state.mapBoxToken, state.setMapBoxToken])

  return (
    <div className="max-w-[780px] w-full mx-auto flex flex-col p-4 py-8">
      <div className="bg-canvas-overlay border border-border-default shadow-2xl rounded-xl p-4 flex flex-col">
        <h1 className="text-xl mb-6">Settings</h1>
        <label>MapBox Access Token</label>
        <input type="text" placeholder="" value={mapBoxToken} onChange={e => setMapBoxToken(e.target.value)} />
      </div>
    </div>
  )
}
