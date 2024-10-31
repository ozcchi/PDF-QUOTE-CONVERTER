import React from 'react';
import { HashRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { Button } from '@ui/Button';
import DataCollector from '@components/DataCollector';
import ModelTrainer from '@components/ModelTrainer';
import ModelEvaluator from '@components/ModelEvaluator';
import QuoteConverter from '@components/QuoteConverter';

const App: React.FC = () => {
  return (
    <Router>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">PDF見積書変換ツール</h1>
        <nav className="mb-4" aria-label="メインナビゲーション">
          <ul className="flex space-x-4">
            <li><NavLink to="/">ホーム</NavLink></li>
            <li><NavLink to="/quote-converter">見積書変換</NavLink></li>
            <li><NavLink to="/data-collector">データ収集</NavLink></li>
            <li><NavLink to="/model-trainer">モデルトレーニング</NavLink></li>
            <li><NavLink to="/model-evaluator">モデル評価</NavLink></li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/quote-converter" element={<QuoteConverter />} />
          <Route path="/data-collector" element={<DataCollector />} />
          <Route path="/model-trainer" element={<ModelTrainer />} />
          <Route path="/model-evaluator" element={<ModelEvaluator />} />
        </Routes>
      </div>
    </Router>
  );
};

const NavLink: React.FC<{ to: string; children: React.ReactNode }> = ({ to, children }) => (
  <Button asChild variant="link" className="text-primary hover:text-primary-foreground">
    <Link to={to}>{children}</Link>
  </Button>
);

const Home: React.FC = () => (
  <div>
    <h2 className="text-xl font-semibold mb-2">PDF見積書変換ツールへようこそ</h2>
    <p>このアプリケーションでは、PDFの見積書から情報を抽出し、構造化されたデータに変換します。</p>
  </div>
);

export default App;