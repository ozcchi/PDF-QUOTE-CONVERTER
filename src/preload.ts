import { contextBridge, ipcRenderer } from 'electron';

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

interface ElectronAPI {
  parsePDF: (filePath: string) => Promise<string>;
  saveTrainingData: (data: TrainingData) => Promise<string>;
}

const electronAPI: ElectronAPI = {
  parsePDF: async (filePath: string): Promise<string> => {
    try {
      console.log('PDFファイル解析リクエスト:', filePath);
      const result = await ipcRenderer.invoke('parse-pdf', filePath);
      
      if (typeof result === 'string' && result.length > 0) {
        console.log('PDF解析成功 - テキスト長:', result.length);
        return result;
      }
      
      throw new Error('PDF解析結果が無効です');
    } catch (error) {
      console.error('PDF解析エラー (preload):', error);
      throw new Error(`PDF解析エラー: ${error instanceof Error ? error.message : String(error)}`);
    }
  },
  
  saveTrainingData: async (data: TrainingData): Promise<string> => {
    try {
      if (!data || typeof data !== 'object') {
        throw new Error('保存するデータが無効です');
      }

      if (typeof data.text !== 'string' || data.text.length === 0) {
        throw new Error('テキストデータが無効です');
      }

      if (!data.annotations || typeof data.annotations !== 'object') {
        throw new Error('アノテーションデータが無効です');
      }

      if (!data.metadata || typeof data.metadata !== 'object') {
        throw new Error('メタデータが無効です');
      }

      console.log('保存するデータの内容確認:', {
        textLength: data.text.length,
        annotations: data.annotations,
        metadata: data.metadata
      });

      const filepath = await ipcRenderer.invoke('save-training-data', data);
      console.log('トレーニングデータ保存成功:', filepath);
      return filepath;
    } catch (error) {
      console.error('トレーニングデータ保存エラー (preload):', error);
      throw new Error(`保存エラー: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
};

contextBridge.exposeInMainWorld('electron', electronAPI);

// TypeScript の型定義をグローバルに追加
declare global {
  interface Window {
    electron: ElectronAPI;
  }
}