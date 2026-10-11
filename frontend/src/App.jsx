import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import PredictionStudio from './pages/PredictionStudio';
import ModelLab from './pages/ModelLab';
import AnomalyMonitor from './pages/AnomalyMonitor';
import BillSimulator from './pages/BillSimulator';
import DatasetExplorer from './pages/DatasetExplorer';
import EnvironmentalImpact from './pages/EnvironmentalImpact';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderPage = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'prediction':
        return <PredictionStudio />;
      case 'models':
        return <ModelLab />;
      case 'anomalies':
        return <AnomalyMonitor />;
      case 'simulator':
        return <BillSimulator />;
      case 'datasets':
        return <DatasetExplorer />;
      case 'environmental':
        return <EnvironmentalImpact />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="app-container" style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <main style={{ padding: '24px', flex: 1, overflowY: 'auto' }}>
          {renderPage()}
        </main>
      </div>
    </div>
  );
}
