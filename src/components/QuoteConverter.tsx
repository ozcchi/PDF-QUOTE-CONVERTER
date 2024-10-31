import React, { useState } from 'react';
import { Button } from '@ui/Button';
import { Input } from '@ui/Input';
import { Label } from '@ui/Label';
import { Alert } from '@ui/Alert';
import { Progress } from '@ui/Progress';

interface ConversionResult {
  success: boolean;
  message: string;
  convertedFilePath?: string;
}

export default function QuoteConverter() {
  const [isConverting, setIsConverting] = useState(false);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [conversionProgress, setConversionProgress] = useState(0);
  const [conversionResult, setConversionResult] = useState<ConversionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPdfFile(file);
      setError(null);
      setConversionResult(null);
    }
  };

  const handleConvert = async () => {
    if (!pdfFile) {
      setError('変換するPDFファイルを選択してください。');
      return;
    }

    setIsConverting(true);
    setConversionProgress(0);
    setError(null);
    setConversionResult(null);

    try {
      // 変換プロセスのシミュレーション
      for (let i = 0; i <= 100; i += 10) {
        setConversionProgress(i);
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      // 実際の変換ロジックをここに実装
      const result = await window.electron.convertQuote(pdfFile.path);
      setConversionResult(result);
    } catch (err) {
      console.error('変換エラー:', err);
      setError('見積書の変換中にエラーが発生しました。');
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold mb-4">見積書変換</h2>
      <div>
        <Label htmlFor="quote-pdf-upload">見積書PDFファイルをアップロード</Label>
        <Input id="quote-pdf-upload" type="file" accept=".pdf" onChange={handleFileChange} disabled={isConverting} />
      </div>
      <Button onClick={handleConvert} disabled={!pdfFile || isConverting}>
        {isConverting ? '変換中...' : '見積書を変換'}
      </Button>
      {isConverting && (
        <Progress value={conversionProgress} className="w-full" />
      )}
      {conversionResult && (
        <Alert variant={conversionResult.success ? "default" : "destructive"}>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{conversionResult.success ? '変換成功' : '変換失敗'}</AlertTitle>
          <AlertDescription>
            {conversionResult.message}
            {conversionResult.convertedFilePath && (
              <p>変換されたファイル: {conversionResult.convertedFilePath}</p>
            )}
          </AlertDescription>
        </Alert>
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
