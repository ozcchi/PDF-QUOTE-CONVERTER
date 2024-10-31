export interface TrainingData {
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