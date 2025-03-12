import { app, BrowserWindow, Menu } from 'electron';
import path from 'path';
import config from './const.js';

const __dirname = path.dirname(new URL(import.meta.url).pathname);
let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1000, //434 1000
        height: 677,
        // resizable: false,
        titleBarStyle: 'hidden',
        autoHideMenuBar: true,
        transparent: true,
        alwaysOnTop: true,
        webPreferences: {
          nodeIntegration: true,
          contextIsolation: false,
        },
      });

      mainWindow.webContents.openDevTools()
    
      if (process.env.NODE_ENV === 'development') {
        mainWindow.loadURL(config.FRONTEND_URL);
      } else {
        mainWindow.loadFile(path.join(__dirname, 'dist', 'index.html'));
      }
    
      mainWindow.on('closed', () => {
        mainWindow = null;
      });
}

app.whenReady().then(async () => {
    createWindow();
  
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
          createWindow();
        }
    });
});
  
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});