import React, { Children } from 'react'
import cn from 'clsx'

interface TitleBarProps {
  children?: React.ReactNode
  className?: string
}

export default function TitleBar({ children, className }: TitleBarProps) {
  const platform = process.platform

  return (
    <div className={cn('safe-area-top app-drag', className)}>{children}</div>
  )
}
