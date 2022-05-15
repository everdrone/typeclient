import React from 'react'
import { useLocation } from 'react-router-dom'

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
  VscLocation,
  VscMirror,
  VscSearch,
  VscSettingsGear,
  VscSignOut,
  VscVersions,
} from 'react-icons/vsc'

export default function Sidebar() {
  const [disconnect, currentCollectionName] = useStore(state => [state.disconnect, state.currentCollectionName])

  const { pathname } = useLocation()

  return (
    <div className="p-2 flex flex-col">
      <LinkButton to="/" icon={<VscDashboard />} text="Dashboard" active={pathname === '/'} />
      <LinkButton to="/collections" icon={<VscVersions />} text="Collections" active={pathname === '/collections'} />
      <LinkButton to="/apikeys" icon={<VscKey />} text="API Keys" active={pathname === '/apikeys'} />
      <LinkButton to="/aliases" icon={<VscListTree />} text="Aliases" active={pathname === '/aliases'} />
      <SelectCollection />
      {/* these routes only work if a collection is selected */}
      <LinkButton
        disabled={!currentCollectionName}
        to="/search"
        icon={<VscSearch />}
        text="Search"
        active={pathname === '/search'}
      />
      <LinkButton
        disabled={!currentCollectionName}
        to="/geosearch"
        icon={<VscLocation />}
        text="Geo Search"
        active={pathname === '/geosearch'}
      />
      <LinkButton
        disabled={!currentCollectionName}
        to="/jsonsearch"
        icon={<VscLocation />}
        text="JSON Search"
        active={pathname === '/jsonsearch'}
      />
      <LinkButton
        disabled={!currentCollectionName}
        to="/documents/create"
        icon={<VscFile />}
        text="Documents"
        active={pathname === '/documents/create'}
      />
      <LinkButton
        disabled={!currentCollectionName}
        to="/schema"
        icon={<VscBracketDot />}
        text="Schema"
        active={pathname === '/schema'}
      />
      <LinkButton
        disabled={!currentCollectionName}
        to="/synonyms"
        icon={<VscMirror />}
        text="Synonyms"
        active={pathname === '/synonyms'}
      />
      <LinkButton
        disabled={!currentCollectionName}
        to="/curations"
        icon={<VscBeaker />}
        text="Curation"
        active={pathname === '/curations'}
      />
      <LinkButton
        disabled={!currentCollectionName}
        to="/settings"
        icon={<VscSettingsGear />}
        text="Settings"
        active={pathname === '/settings'}
      />
      <Button onClick={() => disconnect(false)} icon={<VscSignOut />} text="Disconnect" />
    </div>
  )
}
