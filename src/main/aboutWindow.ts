import { BrowserWindow } from 'electron'

const aboutWindowOptions: Electron.BrowserWindowConstructorOptions = {
  height: 250,
  width: 450,
  titleBarStyle: 'hidden',
  resizable: false,
  maximizable: false,
  minimizable: false,
  fullscreenable: false,
  webPreferences: {
    nodeIntegration: true,
    contextIsolation: false, // read into this!
  },
  backgroundColor: '#0D1117',
}

declare const ABOUT_WINDOW_WEBPACK_ENTRY: string

export const createAboutWindow = () => {
  let win = new BrowserWindow(aboutWindowOptions)

  win.loadURL(ABOUT_WINDOW_WEBPACK_ENTRY)

  win.on('closed', () => {
    win = null
  })

  return win
}
