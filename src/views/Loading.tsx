import React from 'react'

import { VscLoading } from 'react-icons/vsc'

export default function Loading() {
  return (
    <div className="flex flex-col justify-center items-center h-full text-secondary-muted">
      <VscLoading className="animate-spin text-5xl" />
      {/* <p className="mt-5">Connecting</p> */}
    </div>
  )
}
