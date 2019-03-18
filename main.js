const { app, BrowserWindow, ipcMain, shell } = require('electron');
const fs = require('fs');
const api = require('./api');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  });

  mainWindow.loadFile('index.html');
  mainWindow.webContents.openDevTools();

  mainWindow.on('closed', function() {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', function() {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function() {
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.on('api-search-req', async (event, arg) => {
  const res = await api.search(arg);
  event.sender.send('api-search-res', res);
});

ipcMain.on('api-validPath-req', (event, arg) => {
  event.sender.send('api-validPath-res', fs.existsSync(arg));
});

ipcMain.on('api-openPath-req', (_, path) => {
  shell.openItem(path);
});
