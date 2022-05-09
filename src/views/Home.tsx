import React from 'react'
// import electron from 'electron'

import Logo from '../components/Logo'

export default function Home() {
  return (
    <div
      onClick={() => {
        console.log('send')
        // ipcRenderer.invoke('dialog', { lel: true })
      }}
    >
      <Logo />
    </div>
  )
}
