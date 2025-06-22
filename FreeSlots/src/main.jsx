import React, { Suspense, lazy } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import App from './App';
import './index.css';

// Lazy-loaded pages
const SpinPage = lazy(() => import('./Pages/spinpage'));
const CheckInPage = lazy(() => import('./Pages/CheckinPage'));
const InvitePage = lazy(() => import('./Pages/InvitePage'));

// Telegram WebApp safe initialization
if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
  try {
    const tg = window.Telegram.WebApp;
    tg.ready();
    tg.expand();
    document.documentElement.style.setProperty(
      '--tg-theme-bg',
      tg.themeParams?.bg_color || '#ffffff'
    );
  } catch (err) {
    console.error('Telegram WebApp init failed:', err);
  }
}

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
