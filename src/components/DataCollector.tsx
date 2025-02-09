import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Textarea } from '@/components/ui/Textarea';
import { Alert, AlertCircle, AlertTitle, AlertDescription } from '@/components/ui/Alert';

export default function DataCollector() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [jsonData, setJsonData] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setPdfFile(event.target.files[0]);
    }
  };

  const handleJsonChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setJsonData(event.target.value);
  };

  const handleSubmit = async () => {
    if (!pdfFile || !jsonData) {
      setError('PDFファイルとJSONデータの両方を入力してください。');
      return;
    }

    try {
      await (window as any).electron.saveTrainingData(pdfFile.path, jsonData);
      setError(null);
      // 成功メッセージを表示するなどの処理を追加
    } catch (err: unknown) {
      setError('データの保存に失敗しました: ' + (err instanceof Error ? err.message : String(err)));
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="pdf-file">PDFファイル</Label>
        <Input id="pdf-file" type="file" accept=".pdf" onChange={handleFileChange} />
      </div>
      <div>
        <Label htmlFor="json-data">JSONデータ</Label>
        <Textarea id="json-data" value={jsonData} onChange={handleJsonChange} rows={10} />
      </div>
      <Button onClick={handleSubmit}>データを保存</Button>
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