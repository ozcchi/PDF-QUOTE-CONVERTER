export interface ElectronAPI {
    parsePDF: (filePath: string) => Promise<string>;
    saveTrainingData: (data: TrainingData) => Promise<string>;
    startModelTraining: () => Promise<any>;
    evaluateModel: (filePath: string) => Promise<any>;
    convertQuote: (filePath: string) => Promise<any>;
  }
  
  declare global {
    interface Window {
      electron: ElectronAPI;
    }
  }