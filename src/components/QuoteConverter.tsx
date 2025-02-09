import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Alert, AlertCircle, AlertTitle, AlertDescription } from '@/components/ui/Alert';
import { Progress } from '@/components/ui/Progress';

export default function QuoteConverter() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [conversionResult, setConversionResult] = useState<{ success: boolean; data?: string; error?: string } | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setPdfFile(event.target.files[0]);
    }
  };

  const handleConvert = async () => {
    if (!pdfFile) {
      setError('PDFファイルを選択してください。');
      return;
    }

    setIsConverting(true);
    setProgress(0);
    setError(null);
    setConversionResult(null);

    try {
      const result = await (window as any).electron.convertQuote(pdfFile.path, (currentProgress: number) => {
        setProgress(currentProgress);
      });

      setConversionResult(result);
    } catch (err: unknown) {
      setError('変換に失敗しました: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="pdf-file">PDFファイル</Label>
        <Input id="pdf-file" type="file" accept=".pdf" onChange={handleFileChange} />
      </div>
      <Button onClick={handleConvert} disabled={isConverting}>
        {isConverting ? '変換中...' : 

 '変換を開始'}
      </Button>
      {isConverting && <Progress value={progress} />}
      {conversionResult && (
        <Alert variant={conversionResult.success ? 'default' : 'destructive'}>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{conversionResult.success ? '変換成功' : '変換失敗'}</AlertTitle>
          <AlertDescription>
            {conversionResult.success
              ? '変換が完了しました。結果: ' + conversionResult.data
              : '変換に失敗しました: ' + conversionResult.error}
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