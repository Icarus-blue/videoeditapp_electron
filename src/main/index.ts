import { app, BrowserWindow } from 'electron';

import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import IPCs from './IPCs';

global.IS_DEV = process.env.NODE_ENV === 'development';

let mainWindow;
const currentDirName = dirname(fileURLToPath(import.meta.url));

const exitApp = (): void => {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.hide();
  }
  mainWindow.destroy();
  app.exit();
};

const createWindow = async () => {
  mainWindow = new BrowserWindow({
    width: 1300,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      devTools: false,
      preload: join(currentDirName, '../preload/index.js'),
    },
  });

  mainWindow.setMenu(null);

  mainWindow.on('close', (event: Event): void => {
    event.preventDefault();
    exitApp();
  });

  mainWindow.webContents.on('did-frame-finish-load', (): void => {
    if (global.IS_DEV) {
      mainWindow.webContents.openDevTools();
    }
  });

  mainWindow.once('ready-to-show', (): void => {
    mainWindow.setAlwaysOnTop(true);
    mainWindow.show();
    mainWindow.focus();
    mainWindow.setAlwaysOnTop(false);
  });

  if (global.IS_DEV) {
    await mainWindow.loadURL('http://localhost:5173');
  } else {
    await mainWindow.loadFile(join(currentDirName, '../index.html'));
  }

  // Initialize IPC Communication
  IPCs.initialize();
};

app.whenReady().then(async () => {
  // Disable special menus on macOS by uncommenting the following, if necessary
  /*
  if (process.platform === 'darwin') {
    systemPreferences.setUserDefault('NSDisabledDictationMenuItem', 'boolean', true);
    systemPreferences.setUserDefault('NSDisabledCharacterPaletteMenuItem', 'boolean', true);
  }
  */

  if (global.IS_DEV) {
    import('./index.dev');
  }

  await createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
