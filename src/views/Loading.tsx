import React from 'react'

import cn from 'clsx'
import { VscLoading } from 'react-icons/vsc'

interface LoadingProps {
  className?: string
  text?: string
}

export default function Loading({ className, text }: LoadingProps) {
  return (
    <div className={cn('flex flex-col justify-center items-center h-full text-secondary-muted', className)}>
      <VscLoading className="animate-spin text-5xl" />
      {text && <p className="mt-2">{text}</p>}
    </div>
  )
}
