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
  VscJson,
  VscSignOut,
  VscVersions,
} from 'react-icons/vsc'

export default function Sidebar() {
  const [disconnect, currentCollectionName] = useStore(state => [
    state.disconnect,
    state.currentCollectionName,
    state.setCurrentCollection,
    state.collections,
  ])

  const { pathname } = useLocation()

  // useEffect(() => {
  //   if (Object.keys(collections).length === 0) {
  //     setCurrentCollection()
  //   }
  // }, [Object.keys(collections)])

  return (
    <div className="p-4 flex flex-col">
      <LinkButton className="large" to="/" icon={<VscDashboard />} text="Dashboard" active={pathname === '/'} />
      <LinkButton
        className="large"
        to="/collections"
        icon={<VscVersions />}
        text="Collections"
        active={pathname.startsWith('/collection')}
      />
      <LinkButton
        className="large"
        to="/apikeys"
        icon={<VscKey />}
        text="API Keys"
        active={pathname.startsWith('/apikeys')}
      />
      {/* <LinkButton
        className="large"
        to="/aliases"
        icon={<VscListTree />}
        text="Aliases"
        active={pathname.startsWith('/aliases')}
      /> */}
      <SelectCollection />
      {/* these routes only work if a collection is selected */}
      <LinkButton
        className="large"
        disabled={!currentCollectionName}
        to="/search"
        icon={<VscSearch />}
        text="Search"
        active={pathname.startsWith('/search')}
      />
      <LinkButton
        className="large"
        disabled={!currentCollectionName}
        to="/geosearch"
        icon={<VscLocation />}
        text="Geo Search"
        active={pathname.startsWith('/geosearch')}
      />
      <LinkButton
        className="large"
        disabled={!currentCollectionName}
        to="/jsonsearch"
        icon={<VscJson />}
        text="JSON Search"
        active={pathname.startsWith('/jsonsearch')}
      />
      <LinkButton
        className="large"
        disabled={!currentCollectionName}
        to="/documents/create"
        icon={<VscFile />}
        text="Documents"
        active={pathname.startsWith('/documents/create')}
      />
      <LinkButton
        className="large"
        disabled={!currentCollectionName}
        to={`/schema/${currentCollectionName}`}
        icon={<VscBracketDot />}
        text="Schema"
        active={pathname.startsWith('/schema')}
      />
      {/* <LinkButton
        className="large"
        disabled={!currentCollectionName}
        to="/synonyms"
        icon={<VscMirror />}
        text="Synonyms"
        active={pathname.startsWith('/synonyms')}
      /> */}
      <LinkButton
        className="large"
        disabled={!currentCollectionName}
        to="/curations"
        icon={<VscBeaker />}
        text="Curation"
        active={pathname.startsWith('/curations')}
      />
      <LinkButton
        className="large"
        disabled={!currentCollectionName}
        to="/settings"
        icon={<VscSettingsGear />}
        text="Settings"
        active={pathname.startsWith('/settings')}
      />
      <Button className="large" onClick={() => disconnect(false)} icon={<VscSignOut />} text="Disconnect" />
    </div>
  )
}
