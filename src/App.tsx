import React, { FC, useEffect, useState } from 'react'

import './index.css'
import './general.css'
import './misc.css'

import useStore from 'lib/zustand'

import { Home, Loading, Connection, Search, Collections } from './views'

import { HashRouter, Routes, Route, Link } from 'react-router-dom'

// import TestEditor from 'views/TestEditor'

export default function App() {
  const [isConnecting, isConnected, connection, connect, disconnect] = useStore(
    state => [
      state.isConnecting,
      state.isConnected,
      state.connection,
      state.connect,
      state.disconnect,
    ]
  )

  console.log(isConnecting)

  useEffect(() => {
    console.log('connecting...')
    connect(connection.apiKey, connection.nodes)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  console.log('render')

  if (isConnecting) {
    return (
      <div className="window">
        <div className="safe-area-top app-drag">Typeclient</div>
        <div className="inner">
          <Loading />
        </div>
      </div>
    )
  }

  if (!isConnected) {
    return (
      <WindowWrapper>
        <Connection />
      </WindowWrapper>
    )
  }

  return (
    <div className="window">
      <HashRouter>
        <div className="safe-area-top app-drag">Typeclient</div>
        <div className="inner">
          {/* <Home /> */}
          <Link to="/">Home</Link>
          <Link to="/connection">Connection</Link>
          <Link to="/search">Search</Link>
          <Link to="/collections">Collections</Link>
          <button onClick={() => disconnect()}>Disconnect</button>
          {/* <Link to="/test_editor">Editor</Link> */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/connection" element={<Connection />} />
            <Route path="/search" element={<Search />} />
            <Route path="/collections" element={<Collections />} />
            {/* <Route path="/test_editor" element={<TestEditor />} /> */}
          </Routes>
        </div>
      </HashRouter>
    </div>
  )
}

interface WindowProps {
  title?: string
  children: React.ReactNode
}

const WindowWrapper: FC<WindowProps> = ({ title = 'Typeclient', children }) => {
  return (
    <div className="window">
      <div className="safe-area-top app-drag">Typeclient</div>
      <div className="inner">{children}</div>
    </div>
  )
}
