const { app, BrowserWindow, Tray, Menu, nativeImage, ipcMain } = require('electron');
const path = require('path');

// Keep a global reference to prevent garbage collection
let tray = null;
let mainWindow = null;

function createWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 800,
    height: 700,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, 'favicon.png'),
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
  const icon = nativeImage.createFromPath(path.join(__dirname, 'favicon.png'));
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

app.whenReady().then(() => {
  createWindow();
  createTray();
    
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});