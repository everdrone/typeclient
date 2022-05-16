import React, { useEffect } from 'react'
import { Transition } from '@headlessui/react'

import 'styles/index.scss'
import 'styles/global.scss'
import 'styles/misc.scss'
import 'styles/fonts.scss'
import 'styles/ais.scss'

import useStore from 'lib/store'

import {
  Connection,
  Loading,
  Dashboard,
  Collections,
  ApiKeys,
  Aliases,
  Search,
  GeoSearch,
  JSONSearch,
  CreateCollection,
  Collection,
  CreateDocument,
  Curations,
  CreateCuration,
  Settings,
  CreateApiKey,
} from './views'

import { HashRouter, Routes, Route } from 'react-router-dom'
import TitleBar from 'components/TitleBar'
import Sidebar from 'components/Sidebar'

export default function App() {
  const [isConnecting, isConnected, connection, connect, isLoading] = useStore(state => [
    state.isConnecting,
    state.isConnected,
    state.connection,
    state.connect,
    state.isLoading,
  ])

  useEffect(() => {
    // add class to html to indicate platform
    const html = document.querySelector('html')
    html.classList.add(process.platform)

    console.info('connecting...')
    connect(connection.apiKey, connection.nodes)
  }, [])

  console.log('render')

  if (isConnecting) {
    return (
      <div className="window">
        <TitleBar>Typeclient</TitleBar>
        <div className="inner">
          <div className="centered">
            <Loading />
          </div>
        </div>
      </div>
    )
  }

  if (!isConnected) {
    return (
      <div className="window">
        <TitleBar>Typeclient</TitleBar>
        <div className="inner">
          <div className="centered">
            <Connection />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="window">
      <HashRouter>
        <TitleBar>Typeclient</TitleBar>
        <div className="inner">
          {/* sidebar */}
          <div className="sidebar relative">
            {/* <div className="toolbar app-drag border-b border-black">
              <div className="traffic-light-padding">I'm a toolbar</div>
            </div> */}
            <div className="scroll-container-y">
              <div className="flex flex-col">
                <Sidebar />
              </div>
            </div>
          </div>
          {/* main content */}
          <div className="main-content border-l border-black relative">
            {/* <div className="toolbar app-drag border-b border-black">toolbar space</div> */}
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/apikeys" element={<ApiKeys />} />
              <Route path="/apikeys/create" element={<CreateApiKey />} />
              <Route path="/aliases" element={<Aliases />} />
              <Route path="/search" element={<Search />} />
              <Route path="/geosearch" element={<GeoSearch />} />
              <Route path="/jsonsearch" element={<JSONSearch />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/collections" element={<Collections />} />
              <Route path="/collections/create" element={<CreateCollection />} />
              <Route path="/documents/create" element={<CreateDocument />} />
              <Route path="/documents/edit/:id" element={<CreateDocument />} />
              <Route path="/schema/:name" element={<Collection />} />
              <Route path="/curations" element={<Curations />} />
              <Route path="/curations/create" element={<CreateCuration />} />
              <Route path="/curations/edit/:id" element={<CreateCuration />} />
            </Routes>
          </div>
        </div>
      </HashRouter>
      <Transition
        appear
        show={isLoading}
        enter="transition-opacity duration-75"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-150"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="loading-mask">
          <Loading text="Importing documents" className="text-secondary-emphasis" />
        </div>
      </Transition>
      <div className="window-overlay"></div>
    </div>
  )
}
