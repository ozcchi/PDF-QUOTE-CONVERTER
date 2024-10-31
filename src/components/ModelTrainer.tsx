import React, { useState } from 'react';
import { Button } from '@ui/Button';
import { Progress } from '@ui/Progress';
import { Alert, AlertCircle, AlertTitle, AlertDescription } from '@ui/Alert';

interface ModelMetrics {
  accuracy: number;
  loss: number;
}

export default function ModelTrainer() {
  const [trainingProgress, setTrainingProgress] = useState<number>(0);
  const [modelMetrics, setModelMetrics] = useState<ModelMetrics | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleStartTraining = async () => {
    setTrainingProgress(0);
    setModelMetrics(null);
    setError(null);

    try {
      // バックエンドでモデルのトレーニングを開始
      const trainingResult = await window.electron.startModelTraining();
      
      // トレーニングの進捗を更新
      for (let i = 0; i <= 100; i += 10) {
        setTrainingProgress(i);
        await new Promise(resolve => setTimeout(resolve, 1000)); // シミュレーションのための遅延
      }

      // トレーニング結果を表示
      setModelMetrics(trainingResult);
    } catch (err) {
      setError('トレーニング中にエラーが発生しました。');
      console.error(err);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold mb-4">モデルトレーニング</h2>
      <Button onClick={handleStartTraining} disabled={trainingProgress > 0 && trainingProgress < 100}>
        {trainingProgress > 0 && trainingProgress < 100 ? 'トレーニング中...' : 'モデルトレーニングを開始'}
      </Button>
      <Progress value={trainingProgress} className="w-full" />
      {modelMetrics && (
        <div>
          <h3 className="text-lg font-semibold">トレーニング結果</h3>
          <p>精度: {modelMetrics.accuracy.toFixed(2)}</p>
          <p>損失: {modelMetrics.loss.toFixed(4)}</p>
        </div>
      )}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>エラー</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}