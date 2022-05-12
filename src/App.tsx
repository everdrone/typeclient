import React, { FC, useEffect, useState } from 'react'
import {
  VscDashboard,
  VscGlobe,
  VscVersions,
  VscSearch,
  VscKey,
  VscMirror,
  VscFile,
  VscBeaker,
  VscTerminal,
  VscSignOut,
  VscSettingsGear,
} from 'react-icons/vsc'
import cn from 'clsx'

import 'styles/index.css'
import 'styles/general.css'
import 'styles/misc.css'

import useStore from 'lib/store'

import {
  Home,
  Loading,
  Connection,
  Search,
  Collections,
  CreateCollection,
} from './views'
import TestEditor from 'views/TestEditor'

import { HashRouter, Routes, Route, Link } from 'react-router-dom'
import Button from 'components/Button'
import TitleBar from 'components/TitleBar'

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

  useEffect(() => {
    // add class to html to indicate platform
    const html = document.querySelector('html')
    html.classList.add(process.platform)

    console.log('connecting...')
    connect(connection.apiKey, connection.nodes)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  console.log('render')

  if (isConnecting) {
    return (
      <WindowWrapper>
        <Loading />
      </WindowWrapper>
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
        <TitleBar>Typeclient</TitleBar>
        <div className="inner">
          <div className="flex gap-1">
            <Link to="/">
              <Button icon={<VscDashboard />} text="Dashboard" />
            </Link>
            <Link to="/search">
              <Button icon={<VscSearch />} text="Search" />
            </Link>
            <Link to="/collections">
              <Button icon={<VscVersions />} text="Collections" />
            </Link>
            <Link to="/documents">
              <Button icon={<VscFile />} text="Documents" />
            </Link>
            <Link to="/keys">
              <Button icon={<VscKey />} text="API Keys" />
            </Link>
            <Link to="/synonyms">
              <Button icon={<VscMirror />} text="Synonyms" />
            </Link>
            <Link to="/curation">
              <Button icon={<VscBeaker />} text="Curations" />
            </Link>
            <Link to="/test_editor">
              <Button icon={<VscTerminal />} text="Editor" />
            </Link>
            <Link to="/connection">
              <Button icon={<VscGlobe />} text="Connection" />
            </Link>
            <Link to="/settings">
              <Button icon={<VscSettingsGear />} text="Settings" />
            </Link>
            <Button
              icon={<VscSignOut />}
              className="destructive"
              text="Disconnect"
              onClick={() => disconnect(true)}
            />
          </div>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/connection" element={<Connection />} />
            <Route path="/search" element={<Search />} />
            <Route path="/collections" element={<Collections />} />
            <Route path="/collections/create" element={<CreateCollection />} />
            <Route path="/test_editor" element={<TestEditor />} />
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
      <TitleBar>Typeclient</TitleBar>
      <div className="inner">{children}</div>
    </div>
  )
}
