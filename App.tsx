
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import ReportForm from './components/ReportForm';
import ReportList from './components/ReportList';
import Login from './components/Login';
import { Report, ReportStatus } from './types';
import { INITIAL_REPORTS } from './constants';

type TabType = 'dashboard' | 'reports' | 'submit' | 'login';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [reports, setReports] = useState<Report[]>(INITIAL_REPORTS);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  // Persistence (Simulated)
  useEffect(() => {
    const savedReports = localStorage.getItem('ppkpt_reports');
    if (savedReports) {
      setReports(JSON.parse(savedReports));
    }
    const auth = localStorage.getItem('ppkpt_auth');
    if (auth === 'true') {
      setIsLoggedIn(true);
    }
  }, []);

  const saveReports = (newReports: Report[]) => {
    setReports(newReports);
    localStorage.setItem('ppkpt_reports', JSON.stringify(newReports));
  };

  const handleLogin = (success: boolean) => {
    if (success) {
      setIsLoggedIn(true);
      localStorage.setItem('ppkpt_auth', 'true');
      setActiveTab('reports');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('ppkpt_auth');
    setActiveTab('dashboard');
  };

  const handleAddReport = (reportData: Omit<Report, 'id' | 'reportedAt' | 'status'>) => {
    const newReport: Report = {
      ...reportData,
      id: `REP-${Math.floor(Math.random() * 900) + 100}`,
      reportedAt: new Date().toISOString().split('T')[0],
      status: ReportStatus.UNRESOLVED
    };
    saveReports([newReport, ...reports]);
    setActiveTab('dashboard'); // Redirect to dashboard after submission
  };

  const handleUpdateStatus = (id: string, newStatus: ReportStatus, adminData?: Partial<Report>) => {
    const updated = reports.map(r => r.id === id ? { ...r, status: newStatus, ...adminData } : r);
    saveReports(updated);
  };

  const handleTabChange = (tab: TabType) => {
    if (tab === 'reports' && !isLoggedIn) {
      setActiveTab('login');
    } else {
      setActiveTab(tab);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard reports={reports} />;
      case 'reports':
        return isLoggedIn ? (
          <ReportList reports={reports} onUpdateStatus={handleUpdateStatus} />
        ) : (
          <Login onLogin={handleLogin} onCancel={() => setActiveTab('dashboard')} />
        );
      case 'submit':
        return <ReportForm onSubmit={handleAddReport} />;
      case 'login':
        return <Login onLogin={handleLogin} onCancel={() => setActiveTab('dashboard')} />;
      default:
        return <Dashboard reports={reports} />;
    }
  };

  return (
    <Layout 
      activeTab={activeTab} 
      setActiveTab={handleTabChange}
      isLoggedIn={isLoggedIn}
      onLogout={handleLogout}
    >
      {renderContent()}
    </Layout>
  );
};

export default App;
