import React, { useState, useEffect } from 'react'
import electron from 'electron'
import cn from 'clsx'
import { VscChromeClose, VscChromeMaximize, VscChromeMinimize, VscChromeRestore } from 'react-icons/vsc'

interface TitleBarProps {
  children?: React.ReactNode
  className?: string
}

export default function TitleBar({ children, className }: TitleBarProps) {
  const platform = process.platform
  const ipcRenderer = electron.ipcRenderer

  const [maximized, setMaximized] = useState(false)

  useEffect(() => {
    ipcRenderer.on('window-maximized', () => {
      setMaximized(true)
    })
    ipcRenderer.on('window-unmaximized', () => {
      setMaximized(false)
    })

    return () => {
      ipcRenderer.removeAllListeners('window-maximized')
      ipcRenderer.removeAllListeners('window-unmaximized')
    }
  }, [])

  function handleMinimize() {
    ipcRenderer.invoke('app-minimize')
  }

  function handleMaximize() {
    ipcRenderer.invoke('app-maximize')
  }

  function handleClose() {
    ipcRenderer.invoke('app-close')
  }

  let controls = null
  let menu = null
  if (platform === 'win32' || platform === 'linux') {
    controls = (
      <div className="controls app-no-drag">
        <div className="minimize" onClick={handleMinimize}>
          <VscChromeMinimize />
        </div>
        <div className="maximize" onClick={handleMaximize}>
          {maximized ? <VscChromeRestore /> : <VscChromeMaximize />}
        </div>
        <div className="close" onClick={handleClose}>
          <VscChromeClose />
        </div>
      </div>
    )

    menu = (
      <div>
        <div className="icon" />
      </div>
    )
  }

  return (
    <div className={cn('safe-area-top app-drag', className)}>
      {menu}
      <div className="window-title">{children}</div>
      {controls}
    </div>
  )
}
