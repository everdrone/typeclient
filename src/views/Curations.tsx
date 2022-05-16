import React, { useEffect, useState } from 'react'
import { DateTime } from 'luxon'
import { VscAdd, VscEdit, VscTrash } from 'react-icons/vsc'

import title from 'title'

import useStore from 'lib/store'
import { OverridesRetrieveSchema } from 'lib/store/types'

import Button, { LinkButton } from 'components/Button'
import { useNavigate } from 'react-router-dom'

export default function ApiKeys() {
  const [currentCollectionName, getAllCurations, deleteCuration, refreshCollections] = useStore(state => [
    state.currentCollectionName,
    state.getAllCurations,
    state.deleteCuration,
    state.refreshCollections,
  ])

  const [curations, setCurations] = useState<OverridesRetrieveSchema>()

  const navigate = useNavigate()

  useEffect(() => {
    refreshCollections()
    getAllCurations(currentCollectionName).then(result => result && setCurations(result))
  }, [])

  async function handleDelete(id: string) {
    // FIXME: ask for confirmation!
    await deleteCuration(currentCollectionName, id)
    const newKeys = await getAllCurations(currentCollectionName)
    if (newKeys !== false) {
      setCurations(newKeys)
    }
  }

  console.log(curations)

  return (
    <div>
      <table className="table-auto w-full text-left">
        <thead>
          <tr>
            <th>ID</th>
            <th>Match</th>
            <th>Query</th>
            <th>Includes</th>
            <th>Excludes</th>
            <th>Filters</th>
            <th>Remove Tokens</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {curations &&
            curations.overrides.map(override => (
              <tr key={override.id}>
                <td>{override.id}</td>
                <td>{title(override.rule.match)}</td>
                <td>{override.rule.query}</td>
                <td>{override.includes?.length || 0}</td>
                <td>{override.excludes?.length || 0}</td>
                <td>{override.filter_by?.split(/,\s?/).length || 0}</td>
                <td>{override.remove_matched_tokens ? 'Yes' : 'No'}</td>
                <td>
                  <Button onClick={() => navigate(`/curations/edit/${override.id}`)} icon={<VscEdit />} />
                </td>
                <td>
                  <Button onClick={() => handleDelete(override.id)} icon={<VscTrash />} className="destructive" />
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      <LinkButton to="/curations/create" icon={<VscAdd />} text="Create" />
    </div>
  )
}
