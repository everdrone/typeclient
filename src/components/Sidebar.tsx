import React from 'react'
import { Link } from 'react-router-dom'

import useStore from 'lib/store'
import SelectCollection from './SelectCollection'
import Button, { LinkButton } from './Button'

import {
  VscBeaker,
  VscBracketDot,
  VscDashboard,
  VscFile,
  VscKey,
  VscListTree,
  VscMirror,
  VscSearch,
  VscSettingsGear,
  VscSignOut,
  VscVersions,
} from 'react-icons/vsc'

export default function Sidebar() {
  const [disconnect, currentCollectionName] = useStore(state => [state.disconnect, state.currentCollectionName])

  return (
    <div className="p-2 flex flex-col gap-2">
      <LinkButton to="/" icon={<VscDashboard />} text="Dashboard" />
      <LinkButton to="/collections" icon={<VscVersions />} text="Collections" />
      <LinkButton to="apikeys" icon={<VscKey />} text="API Keys" />
      <LinkButton to="/aliases" icon={<VscListTree />} text="Aliases" />
      <SelectCollection />
      {/* these routes only work if a collection is selected */}
      <LinkButton disabled={!currentCollectionName} to="/search" icon={<VscSearch />} text="Search" />
      <LinkButton disabled={!currentCollectionName} to="/documents/create" icon={<VscFile />} text="Documents" />
      <LinkButton disabled={!currentCollectionName} to="/schema" icon={<VscBracketDot />} text="Schema" />
      <LinkButton disabled={!currentCollectionName} to="/synonyms" icon={<VscMirror />} text="Synonyms" />
      <LinkButton disabled={!currentCollectionName} to="/curations" icon={<VscBeaker />} text="Curation" />
      <LinkButton disabled={!currentCollectionName} to="/settings" icon={<VscSettingsGear />} text="Settings" />
      <Button onClick={() => disconnect(false)} icon={<VscSignOut />} text="Disconnect" />
    </div>
  )
}
