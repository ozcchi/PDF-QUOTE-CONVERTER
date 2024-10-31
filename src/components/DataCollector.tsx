import React, { useState } from 'react';
import { Button } from '@ui/Button';
import { Input } from '@ui/Input';
import { Label } from '@ui/Label';
import { Textarea } from '@ui/Textarea';
import { Alert } from '@ui/Alert';
import { TrainingData } from '@/types/TrainingData';

export default function DataCollector() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [extractedText, setExtractedText] = useState('');
  const [annotations, setAnnotations] = useState({
    manufacturer: '',
    model: '',
    price: '',
    quantity: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsLoading(true);
      setError(null);
      try {
        setPdfFile(file);
        const text = await window.electron.parsePDF(file.path);
        setExtractedText(text);
      } catch (err) {
        setError('PDFの解析中にエラーが発生しました。');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleAnnotationChange = (field: keyof typeof annotations, value: string) => {
    setAnnotations(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveAnnotations = async () => {
    if (!pdfFile || !extractedText) {
      setError('PDFファイルを選択し、テキストを抽出してください。');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const trainingData: TrainingData = {
        text: extractedText,
        annotations,
        metadata: {
          filename: pdfFile.name,
          fileSize: pdfFile.size,
          timestamp: new Date().toISOString(),
          textLength: extractedText.length
        }
      };
      await window.electron.saveTrainingData(trainingData);
      setAnnotations({ manufacturer: '', model: '', price: '', quantity: '' });
      setPdfFile(null);
      setExtractedText('');
    } catch (err) {
      setError('データの保存中にエラーが発生しました。');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold mb-4">データ収集</h2>
      <div>
        <Label htmlFor="pdf-upload">PDFファイルをアップロード</Label>
        <Input id="pdf-upload" type="file" accept=".pdf" onChange={handleFileUpload} disabled={isLoading} />
      </div>
      {extractedText && (
        <>
          <div>
            <Label htmlFor="extracted-text">抽出されたテキスト</Label>
            <Textarea id="extracted-text" value={extractedText} readOnly className="h-40" />
          </div>
          {Object.entries(annotations).map(([key, value]) => (
            <div key={key}>
              <Label htmlFor={key}>{key}</Label>
              <Input
                id={key}
                value={value}
                onChange={(e) => handleAnnotationChange(key as keyof typeof annotations, e.target.value)}
                disabled={isLoading}
              />
            </div>
          ))}
          <Button onClick={handleSaveAnnotations} disabled={isLoading}>
            {isLoading ? '保存中...' : 'データを保存'}
          </Button>
        </>
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