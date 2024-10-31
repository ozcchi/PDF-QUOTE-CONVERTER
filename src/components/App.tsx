import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import DataCollector from '@/components/DataCollector';
import ModelTrainer from '@/components/ModelTrainer';
import ModelEvaluator from '@/components/ModelEvaluator';
import QuoteConverter from '@/components/QuoteConverter';

export default function App() {
  const [activeComponent, setActiveComponent] = useState<string>('dataCollector');

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">PDF Quote Converter</h1>
      <div className="flex space-x-2 mb-4">
        <Button onClick={() => setActiveComponent('dataCollector')}>データ収集</Button>
        <Button onClick={() => setActiveComponent('modelTrainer')}>モデルトレーニング</Button>
        <Button onClick={() => setActiveComponent('modelEvaluator')}>モデル評価</Button>
        <Button onClick={() => setActiveComponent('quoteConverter')}>見積書変換</Button>
      </div>
      {activeComponent === 'dataCollector' && <DataCollector />}
      {activeComponent === 'modelTrainer' && <ModelTrainer />}
      {activeComponent === 'modelEvaluator' && <ModelEvaluator />}
      {activeComponent === 'quoteConverter' && <QuoteConverter />}
    </div>
  );
}