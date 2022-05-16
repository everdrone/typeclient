import React from 'react'

import 'styles/index.scss'
import 'styles/global.scss'
import 'styles/misc.scss'

import TitleBar from 'components/TitleBar'

export default function App() {
  return (
    <div className="window">
      <TitleBar>Typeclient</TitleBar>
      <div className="inner"></div>
    </div>
  )
}
