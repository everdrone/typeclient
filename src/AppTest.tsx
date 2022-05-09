import React from 'react'

import './index.css'
import './general.css'
import './misc.css'

import Logo from './components/Logo'

import {
  VscSettingsGear,
  VscSettings,
  VscGithubInverted,
  VscSearch,
  VscRemote,
  VscPulse,
  VscJson,
  VscKey,
  VscLoading,
  VscLayers,
  VscListTree,
  VscTerminal,
  VscVersions,
  VscDashboard,
  VscDatabase,
  VscCombine,
  VscBeaker,
  VscGlobe,
  VscMirror,
  VscSymbolClass,
  VscTag,
  VscTrash,
  VscVerified,
  VscUngroupByRefType,
  VscSave,
  VscRootFolderOpened,
  VscPlug,
  VscPin,
  VscReferences,
} from 'react-icons/vsc'

import { BrowserRouter, Routes, Route } from 'react-router-dom'

export default function App() {
  return (
    <div className="window">
      <div className="safe-area-top app-drag">Typeclient</div>
      <div className="inner">
        <Logo />
        <p>settings</p>
        <div className="text-3xl">
          <VscSettingsGear />
          <VscSettings />
          <VscSearch />
          <VscRemote />
          <VscJson />
          <VscKey />
          <VscLayers />
          <VscVersions />
          <VscListTree />
          <VscTerminal />
          <VscDatabase />
          <VscCombine />
          <VscBeaker />
          <VscMirror />
          <VscSymbolClass />
          <VscTag />
          <VscTrash />
          <VscVerified />
          <VscUngroupByRefType />
          <VscSave />
          <VscRootFolderOpened />
          <VscLoading className="animate-spin" />
        </div>
        <p>health</p>
        <div className="text-3xl">
          <VscDashboard />
          <VscPulse />
        </div>
        <p>connection</p>
        <div className="text-3xl">
          <VscGlobe />
          <VscPlug />
        </div>
        <p>settings</p>
        <div className="text-3xl">
          <VscPin />
          <VscReferences />
        </div>
      </div>
    </div>
  )
}
