import { BrowserWindow, ipcMain, dialog } from 'electron'
import fs from 'fs'

export default function registerDocumentHandlers(mainWindow: BrowserWindow) {
  ipcMain.handle('confirmDeleteDocument', (_, options) => {
    dialog
      .showMessageBox(mainWindow, {
        type: 'warning',
        buttons: ['Delete', 'Cancel'],
        message: 'Are you sure you want to delete this document?',
        title: 'Delete document',
        cancelId: 1,
        defaultId: 1,
        noLink: true,
      })
      .then(response => {
        // FIXME: make this work!
        if (response.response === 0) {
          // send signal back to renderer
          mainWindow.webContents.send('deleteDocument', options)
        }
      })
  })

  ipcMain.handle('openImportDocumentsFromFile', (_, options) => {
    dialog
      .showOpenDialog(mainWindow, {
        title: 'Import documents',
        message: 'Import documents from file',
        buttonLabel: 'Import',
        properties: ['openFile', 'multiSelections'],
        filters: [{ name: 'json', extensions: ['json', 'jsonl'] }],
      })
      .then(response => {
        if (!response.canceled && response.filePaths.length) {
          const documents = fs.readFileSync(response.filePaths[0], { encoding: 'utf8', flag: 'r' })

          let parsedDocuments: any
          console.log(documents)

          try {
            parsedDocuments = JSON.parse(documents)
          } catch (err) {
            // jsonl or other format
            parsedDocuments = documents.split('\n').map(line => {
              if (line) {
                return JSON.parse(line)
              }
            })
          } finally {
            if (parsedDocuments) {
              mainWindow.webContents.send('importDocumentsFromFile', { documents: parsedDocuments })
            } else {
              // something went wrong?
              throw new Error('FIXME: implement me!')
            }
          }
        }
      })
  })
}
