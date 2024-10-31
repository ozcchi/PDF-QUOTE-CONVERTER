import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import * as url from 'url';
import * as fs from 'fs';
import pdfParse from 'pdf-parse';

let mainWindow: Electron.BrowserWindow | null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:3000');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadURL(
      url.format({
        pathname: path.join(__dirname, '../index.html'),
        protocol: 'file:',
        slashes: true,
      })
    );
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  mainWindow.webContents.session.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': ["default-src 'self'; script-src 'self';"],
      },
    });
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.handle('save-training-data', async (event, pdfPath: string, jsonData: string) => {
  try {
    // PDFファイルとJSONデータを保存するロジックをここに実装
    // 例: ファイルをコピーし、JSONデータをファイルに書き込む
    return { success: true };
  } catch (error) {
    console.error('Failed to save training data:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('start-model-training', async (event, progressCallback) => {
  try {
    // モデルトレーニングのロジックをここに実装
    // 進捗状況を定期的に報告
    for (let i = 0; i <= 100; i += 10) {
      progressCallback(i);
      await new Promise(resolve => setTimeout(resolve, 1000)); // シミュレーション用の遅延
    }
    return { success: true };
  } catch (error) {
    console.error('Model training failed:', error);
    return { success: false, error: error.message };
  }
});



ipcMain.handle('evaluate-model', async (event, testFilePath: string) => {
  try {
    // モデル評価のロジックをここに実装
    // 例: テストファイルを読み込み、モデルで処理し、結果を返す
    return { success: true, result: 'モデル評価結果をここに記述' };
  } catch (error) {
    console.error('Model evaluation failed:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('convert-quote', async (event, pdfPath: string, progressCallback) => {
  try {
    const dataBuffer = fs.readFileSync(pdfPath);
    const options = {
      // PDFパース用のオプション
    };
    const data = await pdfParse(dataBuffer, options);
    
    // PDFデータの処理とJSONへの変換ロジックをここに実装
    // 進捗状況を定期的に報告
    for (let i = 0; i <= 100; i += 20) {
      progressCallback(i);
      await new Promise(resolve => setTimeout(resolve, 500)); // シミュレーション用の遅延
    }

    const processedData = JSON.stringify({ /* 変換後のデータ */ });
    return { success: true, data: processedData };
  } catch (error) {
    console.error('PDF conversion failed:', error);
    return { success: false, error: error.message };
  }
});