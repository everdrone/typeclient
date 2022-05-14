import { BrowserWindow, ipcMain, dialog } from 'electron'

export default function registerCollectionHandlers(mainWindow: BrowserWindow) {
  ipcMain.handle('confirmDeleteCollection', (event, options) => {
    dialog
      .showMessageBox(mainWindow, {
        type: 'warning',
        buttons: ['Delete', 'Cancel'],
        message: 'Are you sure you want to delete this collection?',
        title: 'Delete collection',
        cancelId: 1,
        defaultId: 1,
        noLink: true,
      })
      .then(response => {
        if (response.response === 0) {
          mainWindow.webContents.send('deleteCollection', options)
        }
      })
  })
}
