import React from 'react'

import {
  VscGlobe,
  VscVersions,
  VscSearch,
  VscKey,
  VscMirror,
  VscBeaker,
  VscPreview,
  VscBracketDot,
  VscSignOut,
  VscSettingsGear,
  VscSettings,
  VscSymbolColor,
  VscTable,
} from 'react-icons/vsc'

import Logo from '../components/Logo'
import Button from 'components/Button'

export default function Home() {
  return (
    <div>
      <Logo />
      <div className="flex gap-1">
        <Button icon={<VscGlobe />} />
        <Button active icon={<VscSearch />} text="Search" />
        <Button icon={<VscVersions />} text="Collections" />
        <Button icon={<VscKey />} text="API Keys" />
        <Button icon={<VscMirror />} text="Synonyms" />
        <Button icon={<VscBeaker />} text="Curations" />
        <Button icon={<VscGlobe />} text="Connection" />
        <Button icon={<VscSettings />} text="Query Parameters" />
        <Button icon={<VscSymbolColor />} text="View Options" />
        <Button icon={<VscPreview />} text="Graphical View" />
        <Button icon={<VscBracketDot />} text="Raw View" />
        <Button icon={<VscTable />} text="Table View" />
        <Button icon={<VscSignOut />} text="Disconnect" />
        <Button icon={<VscSettingsGear />} text="Settings" />
      </div>
    </div>
  )
}
