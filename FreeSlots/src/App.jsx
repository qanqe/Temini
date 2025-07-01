import { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

import Homepage from './pages/homepage';
import SpinPage from './pages/spinpage';
import InvitePage from './pages/invitepage';
import CheckinModal from './components/CheckinModal';

const App = () => {
  const { user, loading } = useAuth();
  const [showCheckin, setShowCheckin] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      const lastShown = localStorage.getItem('lastCheckinPopup');
      const today = new Date().toDateString();

      if (lastShown !== today) {
        setShowCheckin(true);
        localStorage.setItem('lastCheckinPopup', today);
      }
    }
  }, [loading, user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white text-gray-600 text-sm">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black text-gray-800 dark:text-white relative overflow-hidden">
      {showCheckin && <CheckinModal onClose={() => setShowCheckin(false)} />}

      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/spin" element={<SpinPage />} />
        <Route path="/invite" element={<InvitePage />} />
      </Routes>
    </div>
  );
};

export default App;
