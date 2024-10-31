import React, { useState } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

interface Predictions {
  manufacturer: string;
  model: string;
  quantity: string;
  price: string;
}

export default function ModelEvaluator() {
  const [testFile, setTestFile] = useState<File | null>(null);
  const [predictions, setPredictions] = useState<Predictions | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setTestFile(file);
      setError(null);
    }
  };

  const handleEvaluate = async () => {
    if (!testFile) {
      setError('評価用のPDFファイルを選択してください。');
      return;
    }
    
    setIsEvaluating(true);
    setError(null);
    setPredictions(null);

    try {
      // バックエンドでモデルの評価を実行
      const result = await window.electron.evaluateModel(testFile.path);
      setPredictions(result);
    } catch (err) {
      console.error('評価エラー:', err);
      setError('モデルの評価中にエラーが発生しました。');
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold mb-4">モデル評価</h2>
      <div>
        <Label htmlFor="test-pdf-upload">テスト用PDFファイルをアップロード</Label>
        <Input id="test-pdf-upload" type="file" accept=".pdf" onChange={handleFileChange} />
      </div>
      <Button onClick={handleEvaluate} disabled={isEvaluating || !testFile}>
        {isEvaluating ? '評価中...' : 'モデルを評価'}
      </Button>
      {predictions && (
        <div className="space-y-2">
          <div>
            <Label htmlFor="predicted-manufacturer">予測されたメーカー名</Label>
            <Input id="predicted-manufacturer" value={predictions.manufacturer} readOnly />
          </div>
          <div>
            <Label htmlFor="predicted-model">予測された製品の型式</Label>
            <Input id="predicted-model" value={predictions.model} readOnly />
          </div>
          <div>
            <Label htmlFor="predicted-quantity">予測された数量</Label>
            <Input id="predicted-quantity" value={predictions.quantity} readOnly />
          </div>
          <div>
            <Label htmlFor="predicted-price">予測された価格</Label>
            <Input id="predicted-price" value={predictions.price} readOnly />
          </div>
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