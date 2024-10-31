import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function ModelEvaluator() {
  const [testFile, setTestFile] = useState<File | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setTestFile(event.target.files[0]);
    }
  };

  const handleEvaluate = async () => {
    if (!testFile) {
      setError('テストファイルを選択してください。');
      return;
    }

    try {
      // TypeScriptの型定義ファイルを更新して、window.electronの型を正確に定義する必要があります
      const result = await (window as any).electron.evaluateModel(testFile.path);
      setResult(result);
      setError(null);
    } catch (err) {
      console.error('Model evaluation failed:', err);
      setError('評価に失敗しました: ' + err.message);
      setResult(null);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="test-file">テストファイル</Label>
        <Input id="test-file" type="file" accept=".pdf" onChange={handleFileChange} />
      </div>
      <Button onClick={handleEvaluate}>モデルを評価</Button>
      {error && (
        <Alert variant="destructive">
          <AlertTitle>エラー</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {result && (
        <Alert>
          <AlertTitle>評価結果</AlertTitle>
          <AlertDescription>{result}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}