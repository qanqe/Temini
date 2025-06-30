import React, { Suspense, lazy } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import App from './App';
import './index.css';
import WebApp from '@twa-dev/sdk'; // ✅ Import Telegram WebApp SDK

// Telegram WebApp safe initialization
if (typeof window !== 'undefined' && WebApp?.initData) {
  try {
    WebApp.ready();
    WebApp.expand();
    document.documentElement.style.setProperty(
      '--tg-theme-bg',
      WebApp.themeParams?.bg_color || '#ffffff'
    );
  } catch (err) {
    console.error('Telegram WebApp init failed:', err);
  }
}

const SpinPage = lazy(() => import('./pages/spinpage'));
const CheckInPage = lazy(() => import('./pages/checkinpage'));
const InvitePage = lazy(() => import('./pages/invitepage'));

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <AuthProvider>
        <Suspense fallback={<div className="text-center p-6">Loading...</div>}>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/spin" element={<SpinPage />} />
            <Route path="/checkin" element={<CheckInPage />} />
            <Route path="/invite" element={<InvitePage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </Router>
  </React.StrictMode>
);
