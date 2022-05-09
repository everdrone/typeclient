import React from 'react'

import './index.css'
import './general.css'
import './misc.css'

import Home from './views/Home'

import { HashRouter, Routes, Route } from 'react-router-dom'

export default function App() {
  return (
    <div className="window">
      <div className="safe-area-top app-drag">Typeclient</div>
      <div className="inner">
        {/* <Home /> */}
        <HashRouter>
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </HashRouter>
      </div>
    </div>
  )
}
