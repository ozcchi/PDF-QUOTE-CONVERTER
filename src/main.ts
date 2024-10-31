import { app, BrowserWindow, ipcMain, session, globalShortcut } from 'electron';
import * as path from 'path';
import * as fs from 'fs/promises';
import * as pdfParse from 'pdf-parse';

interface MainWindow extends BrowserWindow {
  isDestroyed(): boolean;
}

let mainWindow: MainWindow | null = null;

interface PDFParseOptions {
  version: string;
  textRenderOptions: {
    normalizeWhitespace: boolean;
    disableCombineTextItems: boolean;
  };
}

interface TrainingData {
  text: string;
  annotations: {
    manufacturer: string;
    model: string;
    price: string;
    quantity: string;
  };
  metadata: {
    filename: string;
    fileSize: number;
    timestamp: string;
    textLength: number;
  };
}

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      sandbox: true,
      devTools: process.env.NODE_ENV === 'development'
    }
  }) as MainWindow;

  // Content Security Policy の設定
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': [
          "default-src 'self' https://unpkg.com; " +
          "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://unpkg.com; " +
          "style-src 'self' 'unsafe-inline'; " +
          "img-src 'self' data: https:; " +
          "connect-src 'self' https://unpkg.com; " +
          "font-src 'self' data:;"
        ]
      }
    });
  });

  const indexPath = path.join(__dirname, '..', 'dist', 'index.html');
  console.log('Loading index.html from:', indexPath);
  mainWindow.loadFile(indexPath).catch(console.error);

  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// アプリケーションのイベントハンドラ
app.whenReady().then(() => {
  createWindow();

  // 開発ツール用のショートカット
  if (process.env.NODE_ENV === 'development') {
    globalShortcut.register('CommandOrControl+Shift+I', () => {
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.toggleDevTools();
      }
    });
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (!mainWindow) {
    createWindow();
  }
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});

// IPC ハンドラ
ipcMain.handle('parse-pdf', async (_event, filePath: string): Promise<string> => {
  console.log('PDF解析開始:', filePath);
  try {
    if (!filePath) {
      throw new Error('ファイルパスが指定されていません');
    }

    await fs.access(filePath);
    
    const dataBuffer = await fs.readFile(filePath);
    console.log('PDFファイル読み込み完了 - サイズ:', dataBuffer.length, 'bytes');

    const options: PDFParseOptions = {
      version: 'default',
      textRenderOptions: {
        normalizeWhitespace: true,
        disableCombineTextItems: false
      }
    };

    const data = await pdfParse(dataBuffer, options);
    
    if (!data?.text) {
      throw new Error('PDFからテキストを抽出できませんでした');
    }

    const normalizedText = data.text
      .replace(/\r\n/g, '\n')
      .replace(/\s+/g, ' ')
      .trim();

    console.log('PDF解析完了 - 抽出されたテキスト長:', normalizedText.length);
    return normalizedText;
  } catch (error) {
    console.error('PDF解析エラー:', error instanceof Error ? error.message : String(error));
    throw error;
  }
});

ipcMain.handle('save-training-data', async (_event, data: TrainingData): Promise<string> => {
  console.log('トレーニングデータ保存開始');
  try {
    if (!data?.text || !data?.annotations) {
      throw new Error('保存するデータが不完全です');
    }

    const { annotations } = data;
    if (!annotations.manufacturer || !annotations.model || 
        !annotations.price || !annotations.quantity) {
      throw new Error('アノテーションデータが不完全です');
    }

    const userDataPath = app.getPath('userData');
    const trainingDataDir = path.join(userDataPath, 'training-data');
    await fs.mkdir(trainingDataDir, { recursive: true });
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `training-data-${timestamp}.json`;
    const filepath = path.join(trainingDataDir, filename);
    
    const formattedData = {
      version: '1.0',
      savedAt: new Date().toISOString(),
      text: data.text,
      annotations: data.annotations,
      metadata: {
        ...data.metadata,
        appVersion: app.getVersion(),
        platform: process.platform
      }
    };

    await fs.writeFile(filepath, JSON.stringify(formattedData, null, 2));
    
    const shortPath = filepath.replace(userDataPath, '...');
    console.log('トレーニングデータを保存しました:', shortPath);
    return shortPath;
  } catch (error) {
    console.error('トレーニングデータ保存エラー:', error instanceof Error ? error.message : String(error));
    throw error;
  }
});