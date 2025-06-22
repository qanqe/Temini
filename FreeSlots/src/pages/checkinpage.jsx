import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import apiService from '../services/api';
import confetti from 'canvas-confetti';

const CheckinPage = () => {
  const { user, refreshUser } = useAuth();
  const [isClaiming, setIsClaiming] = useState(false);
  const [justClaimed, setJustClaimed] = useState(false);

  useEffect(() => {
    window.Telegram?.WebApp?.expand();
    const onBackButton = () => window.history.back();
    window.Telegram?.WebApp?.BackButton?.onClick(onBackButton);
    window.Telegram?.WebApp?.BackButton?.show();
    return () => {
      window.Telegram?.WebApp?.BackButton?.offClick(onBackButton);
      window.Telegram?.WebApp?.BackButton?.hide();
    };
  }, []);

  const handleCheckin = async () => {
    if (isClaiming) return;
    setIsClaiming(true);

    try {
      const res = await apiService.dailyCheckin(user.telegramId);

      const { streak } = res;
      confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });

      if (streak > 0 && streak % 7 === 0) {
        setTimeout(() => {
          confetti({ particleCount: 300, spread: 100, origin: { y: 0.5 } });
        }, 500);
      }

      await refreshUser();
      setJustClaimed(true);
    } catch (error) {
      console.error('Check-in failed:', error);
    } finally {
      setIsClaiming(false);
    }
  };

  return (
    <div
      className="p-4 min-h-screen bg-tg-theme-bg"
      style={{
        '--tg-theme-bg': window.Telegram?.WebApp?.themeParams?.bg_color || '#f8f9fa'
      }}
    >
      {/* Header */}
      <div className="flex justify-between mb-4">
        <div className="space-x-2 flex items-center">
          <span className="px-3 py-1 bg-yellow-100 rounded-full">🪙 {user?.coinBalance || 0}</span>
          <span className="px-3 py-1 bg-purple-100 rounded-full">💎 {user?.gems || 0}</span>
        </div>
        <span className="px-3 py-1 bg-blue-100 rounded-full">🎟️ {user?.bonusSlots || 0}</span>
      </div>

      {/* Streak Info */}
      <div className="rounded-xl p-4 mb-4 text-center bg-white shadow">
        <div className="text-sm text-gray-600">Current Streak</div>
        <div className="text-3xl font-bold text-orange-500">{user?.streak || 0} 🔥</div>
        {user?.lastCheckIn && (
          <div className="text-xs text-gray-400 mt-1">
            Last check-in: {new Date(user.lastCheckIn).toLocaleDateString()}
          </div>
        )}
      </div>

      {/* Check-in button */}
      <button
        disabled={isClaiming || justClaimed}
        onClick={handleCheckin}
        className={`w-full py-3 rounded-xl text-white font-bold text-lg transition-all duration-150 shadow-md
          ${isClaiming || justClaimed ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:scale-[1.02] active:scale-[0.98]'}
        `}
      >
        {isClaiming ? '⏳ Checking In...' : justClaimed ? '✅ Checked In!' : 'Check In Now'}
      </button>

      {justClaimed && (
        <div className="text-green-600 text-sm text-center mt-2">Check-in successful!</div>
      )}

      {/* Reward Summary */}
      <div className="mt-6 text-sm text-gray-600">
        <h3 className="font-bold mb-2">Rewards This Week:</h3>
        <ul className="space-y-1">
          <li>🪙 Day 1–2: +1 Coin</li>
          <li>🎟️ Day 3: +1 Spin</li>
          <li>🎟️ Day 5: +2 Spins</li>
          <li>🎟️ Day 7: +3 Spins</li>
          <li>🎟️ Day 8+: +1 Spin per day</li>
        </ul>
      </div>
    </div>
  );
};

export default CheckinPage;
