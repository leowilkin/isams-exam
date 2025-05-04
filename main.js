import { app, BrowserWindow, Tray, Menu, nativeImage, ipcMain } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import Store from 'electron-store';

// Get __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize the store
const store = new Store();

// Keep a global reference to prevent garbage collection
let tray = null;
let mainWindow = null;

// Ensure single instance application
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  console.log('Another instance is already running. Quitting this instance.');
  app.quit();
} else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    // Someone tried to run a second instance, we should focus our window.
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.show();
      mainWindow.focus();
    }
  });

  // Set up IPC handlers for data persistence
  ipcMain.handle('save-exams', (event, examData) => {
    store.set('examData', examData);
    return true;
  });

  ipcMain.handle('load-exams', () => {
    return store.get('examData', []);
  });

  ipcMain.handle('delete-exams', () => {
    store.delete('examData');
    return true;
  });

  ipcMain.handle('save-theme', (event, theme) => {
    store.set('theme', theme);
    return true;
  });

  ipcMain.handle('load-theme', () => {
    return store.get('theme', null);
  });

  // Continue with your app initialization
  app.whenReady().then(() => {
    createWindow();
    createTray();
      
    app.on('activate', function () {
      if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
  });
}

function createWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 800,
    height: 700,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      // Settings for ESM compatibility
      sandbox: false
    },
    icon: path.join(__dirname, 'assets', 'favicon.png'),
    show: true,
    frame: true,
  });

    mainWindow.loadFile('index.html');
  
    createApplicationMenu();
  
    mainWindow.on('close', function (event) {
    if(!app.isQuitting) {
      event.preventDefault();
      mainWindow.hide();
      return false;
    }
    return true;
  });
}

function createApplicationMenu() {
  const template = [
    {
      label: 'File',
      submenu: [
        {
            label: 'Show Completed Exams',
            click: async () => {
                mainWindow.webContents.executeJavaScript('toggleCompleted()');
            }
        },
        { 
            label: 'Instructions',
            click: async () => {
                mainWindow.webContents.executeJavaScript('showInstructions()');
            }
        },
        { 
            label: 'Download Calendar',
            click: async () => {
                mainWindow.webContents.executeJavaScript('downloadICS()');
            }
        },
        {
          label: 'Clear Data',
          click: async () => {
            mainWindow.webContents.executeJavaScript('clearData()');
          }
        },
        { type: 'separator' },
        {
          label: 'Exit',
          click: () => {
            app.isQuitting = true;
            app.quit();
          }
        }
      ]
    },
    {
      label: 'View',
      submenu: [
        {
          label: 'Toggle Dark Mode',
          click: async () => {
            mainWindow.webContents.executeJavaScript('toggleTheme()');
          }
        },
        { type: 'separator' },
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
      ]
    },
    {
      label: 'Window',
      submenu: [
        { role: 'minimize' },
        { role: 'zoom' },
        { role: 'close' }
      ]
    }
  ]

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

function createTray() {
  const icon = nativeImage.createFromPath(path.join(__dirname, 'assets', 'favicon.png'));
  tray = new Tray(icon);
  tray.setToolTip('iSAMS Exam Schedule');
  
  const contextMenu = Menu.buildFromTemplate([
    { 
      label: 'Show Exam Schedule', 
      click: function() {
        mainWindow.show();
      } 
    },
    { type: 'separator' },
    { 
      label: 'Quit', 
      click: function() {
        app.isQuitting = true;
        app.quit();
      } 
    },
  ]);

  tray.setContextMenu(contextMenu);
  
  tray.on('click', function() {
    if (mainWindow.isVisible()) {
      mainWindow.hide();
    } else {
      mainWindow.show();
    }
  });
}

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});