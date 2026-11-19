import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import MainLayout from './layouts/MainLayout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import PatientManagementPage from './pages/PatientManagementPage';
import AddPatientPage from './pages/AddPatientPage';
import DrugDatabasePage from './pages/DrugDatabasePage';
import InteractionCheckerPage from './pages/InteractionCheckerPage';
import KnowledgeGraphPage from './pages/KnowledgeGraphPage';
import ClinicalAlertsPage from './pages/ClinicalAlertsPage';
import PatientReportsPage from './pages/PatientReportsPage';
import SettingsPage from './pages/SettingsPage';

function AppContent() {
  const { user } = useAuth();
  const [activePage, setActivePage] = useState('dashboard');
  const [selectedPatientId, setSelectedPatientId] = useState('PAT-001');

  if (!user) {
    return <LoginPage onLoginSuccess={() => setActivePage('dashboard')} />;
  }

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return (
          <DashboardPage
            setActivePage={setActivePage}
            setSelectedPatientId={setSelectedPatientId}
          />
        );
      case 'checker':
        return (
          <InteractionCheckerPage
            selectedPatientId={selectedPatientId}
            setSelectedPatientId={setSelectedPatientId}
            setActivePage={setActivePage}
          />
        );
      case 'graph':
        return (
          <KnowledgeGraphPage
            selectedPatientId={selectedPatientId}
            setSelectedPatientId={setSelectedPatientId}
          />
        );
      case 'patients':
        return (
          <PatientManagementPage
            setActivePage={setActivePage}
            setSelectedPatientId={setSelectedPatientId}
          />
        );
      case 'add-patient':
        return (
          <AddPatientPage
            setActivePage={setActivePage}
            setSelectedPatientId={setSelectedPatientId}
          />
        );
      case 'drugs':
        return <DrugDatabasePage setActivePage={setActivePage} />;
      case 'alerts':
        return (
          <ClinicalAlertsPage
            setActivePage={setActivePage}
            setSelectedPatientId={setSelectedPatientId}
          />
        );
      case 'reports':
        return <PatientReportsPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return (
          <DashboardPage
            setActivePage={setActivePage}
            setSelectedPatientId={setSelectedPatientId}
          />
        );
    }
  };

  return (
    <MainLayout activePage={activePage} setActivePage={setActivePage}>
      {renderPage()}
    </MainLayout>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
