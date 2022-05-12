import { screen, BrowserWindow, BrowserWindowConstructorOptions } from 'electron'
import Store from 'electron-store'

export interface WindowState {
  x: number
  y: number
  width: number
  height: number
  maximized: boolean
}

export default (windowName: string, options: BrowserWindowConstructorOptions): BrowserWindow => {
  const key = 'window-state'
  const name = `window-state-${windowName}`
  const store = new Store({ name })
  const defaultSize = {
    width: options.width,
    height: options.height,
  }
  let state = {}
  let win: BrowserWindow

  const restore = () => store.get(key, defaultSize) as WindowState

  const getCurrentPosition = () => {
    const position = win.getPosition()
    const size = win.getSize()
    const maximized = win.isFullScreen() || win.isMaximized()
    return {
      x: position[0],
      y: position[1],
      width: size[0],
      height: size[1],
      maximized,
    }
  }

  const windowWithinBounds = (windowState: Electron.Rectangle, bounds: Electron.Rectangle) => {
    return (
      windowState.x >= bounds.x &&
      windowState.y >= bounds.y &&
      windowState.x + windowState.width <= bounds.x + bounds.width &&
      windowState.y + windowState.height <= bounds.y + bounds.height
    )
  }

  const resetToDefaults = () => {
    const bounds = screen.getPrimaryDisplay().bounds
    return Object.assign({}, defaultSize, {
      x: (bounds.width - defaultSize.width) / 2,
      y: (bounds.height - defaultSize.height) / 2,
    })
  }

  const ensureVisibleOnSomeDisplay = (windowState: WindowState) => {
    const visible = screen.getAllDisplays().some(display => {
      return windowWithinBounds(windowState, display.bounds)
    })
    if (!visible) {
      // Window is partially or fully not visible now.
      // Reset it to safe defaults.
      return resetToDefaults()
    }
    return windowState
  }

  const saveState = () => {
    // FIXME: state does not persist well when maximized!
    if (!win.isMinimized() && !win.isMaximized()) {
      Object.assign(state, getCurrentPosition())
    }
    store.set(key, state)
  }

  state = ensureVisibleOnSomeDisplay(restore())

  const browserOptions: BrowserWindowConstructorOptions = {
    ...options,
    ...state,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      ...options.webPreferences,
    },
  }
  win = new BrowserWindow(browserOptions)

  win.on('close', saveState)

  return win
}
