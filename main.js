const { app, BrowserWindow } = require('electron');
const path = require('path');

let mainWindow;
const isDev = !app.isPackaged;

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  if (isDev) {
    mainWindow.loadURL('http://localhost:3000'); // En desarrollo
  } else {
    const indexPath = path.join(__dirname, 'out', 'index.html');
    mainWindow.loadFile(indexPath).catch((err) => {
      console.error('Error loading index.html:', err);
    });
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
