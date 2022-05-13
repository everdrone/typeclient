import React from 'react'

import 'styles/index.scss'
import 'styles/global.scss'
import 'styles/misc.scss'

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
import TitleBar from 'components/TitleBar'

export default function App() {
  return (
    <div className="window">
      <TitleBar>Typeclient</TitleBar>
      <div className="inner"></div>
    </div>
  )
}
