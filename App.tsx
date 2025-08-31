
import React, { useState, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './components/views/DashboardView';
import { AssetsView } from './components/views/AssetsView';
import { SimulationsView } from './components/views/SimulationsView';
import { AnalysisView } from './components/views/AnalysisView';
import { RisksView } from './components/views/RisksView';
import { ReportsView } from './components/views/ReportsView';
import { SupportView } from './components/views/SupportView';
import { LoginView } from './components/views/LoginView';
import { View } from './types';
import { useAuth } from './contexts/AuthContext';

const App: React.FC = () => {
  const { user } = useAuth();
  const [activeView, setActiveView] = useState<View>(View.Dashboard);

  const handleSetView = useCallback((view: View) => {
    setActiveView(view);
  }, []);

  const renderView = () => {
    switch (activeView) {
      case View.Dashboard:
        return <DashboardView setView={handleSetView} />;
      case View.Assets:
        return <AssetsView />;
      case View.Simulations:
        return <SimulationsView />;
      case View.Analysis:
        return <AnalysisView />;
      case View.Risks:
        return <RisksView />;
      case View.Reports:
        return <ReportsView />;
      case View.Support:
        return <SupportView />;
      default:
        return <DashboardView setView={handleSetView} />;
    }
  };

  if (!user) {
    return <LoginView />;
  }

  return (
    <div className="flex h-screen bg-primary text-text-primary font-sans">
      <Sidebar activeView={activeView} setView={handleSetView} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header activeView={activeView} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-primary p-6 lg:p-8">
          {renderView()}
        </main>
      </div>
    </div>
  );
};

export default App;