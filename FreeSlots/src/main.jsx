import React, { Suspense, lazy } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import App from './App';
import './index.css';
import WebApp from '@twa-dev/sdk';

// Initialize Telegram WebApp SDK
if (typeof window !== 'undefined' && WebApp?.initData) {
  try {
    WebApp.ready();
    WebApp.expand();

    // Set Telegram theme background if available
    document.documentElement.style.setProperty(
      '--tg-theme-bg',
      WebApp.themeParams?.bg_color || '#ffffff'
    );
  } catch (err) {
    console.error('[Telegram SDK] Init failed:', err);
  }
}

// Lazy load routes
const SpinPage = lazy(() => import('./pages/spinpage'));
const CheckInPage = lazy(() => import('./pages/checkinpage'));
const InvitePage = lazy(() => import('./pages/invitepage'));

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <AuthProvider>
        <Suspense fallback={<div className="text-center p-6 text-gray-500">Loading...</div>}>
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
