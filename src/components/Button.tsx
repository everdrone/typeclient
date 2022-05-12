import React from 'react'
import cn from 'clsx'

import 'styles/button.scss'

interface ButtonProps {
  disabled?: boolean
  active?: boolean
  onClick?: () => void
  className?: string
  icon?: React.ReactNode
  text?: string
}

export default function Button({ disabled = false, onClick = () => {}, active, className, icon, text }: ButtonProps) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={cn('button', text && 'wider', active && 'focused', disabled && 'disabled', className && className)}
    >
      {icon}
      {text && <span>{text}</span>}
      {/* {active && <div className="underline" />} */}
    </button>
  )
}
