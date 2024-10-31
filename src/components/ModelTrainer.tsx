import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Progress } from '@/components/ui/Progress';
import { Alert, AlertCircle, AlertTitle, AlertDescription } from '@/components/ui/Alert';

export default function ModelTrainer() {
  const [isTraining, setIsTraining] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleStartTraining = async () => {
    setIsTraining(true);
    setProgress(0);
    setError(null);

    try {
      const trainingResult = await (window as any).electron.startModelTraining((currentProgress: number) => {
        setProgress(currentProgress);
      });

      if (trainingResult.success) {
        // トレーニング成功の処理
      } else {
        setError(trainingResult.error);
      }
    } catch (err: unknown) {
      setError('トレーニングに失敗しました: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setIsTraining(false);
    }
  };

  return (
    <div className="space-y-4">
      <Button onClick={handleStartTraining} disabled={isTraining}>
        {isTraining ? 'トレーニング中...' : 'トレーニングを開始'}
      </Button>
      {isTraining && <Progress value={progress} />}
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