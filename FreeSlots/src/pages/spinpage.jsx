import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import apiService from '../services/api';
import Lottie from 'lottie-react';
import spinAnimation from './assets/spin-animation.json';
import confetti from 'canvas-confetti';
import RewardList from '../components/RewardList';
import BalanceHeader from '../components/BalanceHeader';

const SpinPage = () => {
  const { user, refreshUser } = useAuth();
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinResult, setSpinResult] = useState(null);
  const [lastSpinTime, setLastSpinTime] = useState(0);
  const [showReward, setShowReward] = useState(false);

  const slotsAvailable = user?.bonusSlots || 0;

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const handleSpin = async () => {
    if (slotsAvailable <= 0 || isSpinning || Date.now() - lastSpinTime < 2000) return;

    setIsSpinning(true);
    setLastSpinTime(Date.now());
    setSpinResult(null);
    setShowReward(false);

    try {
      const result = await apiService.spinWheel(user.telegramId);
      const { reward } = result;

      setSpinResult(reward);
      setShowReward(true);

      if (reward?.type === 'coin' || reward?.type === 'gem') {
        triggerConfetti();
      }

      await refreshUser(); // sync real backend balance
    } catch (error) {
      console.error('Spin failed:', error);
    } finally {
      setIsSpinning(false);
    }
  };

  useEffect(() => {
    if (!window.Telegram?.WebApp) return;

    window.Telegram.WebApp.expand();

    const onBackButton = () => window.history.back();
    window.Telegram.WebApp.BackButton.onClick(onBackButton);
    window.Telegram.WebApp.BackButton.show();

    return () => {
      window.Telegram.WebApp.BackButton.offClick(onBackButton);
      window.Telegram.WebApp.BackButton.hide();
    };
  }, []);

  return (
    <div
      className="min-h-screen bg-tg-theme-bg p-4"
      style={{
        '--tg-theme-bg': window.Telegram?.WebApp?.themeParams?.bg_color || '#f8f9fa'
      }}
    >
      <BalanceHeader
        coins={user?.coinBalance || 0}
        gems={user?.gems || 0}
        slots={slotsAvailable}
      />

      <main className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-center text-tg-theme-text mb-6">
          Spin to Win
        </h1>

        {slotsAvailable > 0 ? (
          <div className="bg-tg-theme-secondary-bg rounded-2xl shadow-xl p-6">
            {/* Wheel Display */}
            <div className="relative mb-8">
              <div
                className={`bg-tg-theme-bg border-2 border-dashed border-tg-theme-hint-color rounded-xl w-full h-48 flex items-center justify-center transition-all duration-300 ${
                  isSpinning ? 'opacity-90' : ''
                }`}
              >
                {isSpinning ? (
                  <Lottie animationData={spinAnimation} loop={true} style={{ height: 180 }} />
                ) : (
                  <div className="text-center">
                    {showReward && spinResult ? (
                      <div
                        className={`animate-bounce ${
                          spinResult.type === 'none'
                            ? 'text-gray-500'
                            : 'text-tg-theme-accent-text'
                        }`}
                      >
                        <div className="text-5xl mb-2">
                          {spinResult.type === 'coin'
                            ? '🪙'
                            : spinResult.type === 'gem'
                            ? '💎'
                            : '🔄'}
                        </div>
                        <p className="text-xl font-bold">
                          {spinResult.type !== 'none'
                            ? `Won ${spinResult.amount} ${spinResult.type}`
                            : 'Try Again!'}
                        </p>
                      </div>
                    ) : (
                      <div className="text-tg-theme-hint-color">
                        <div className="text-5xl">?</div>
                        <p className="mt-2">Spin to see your reward</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="absolute top-1/2 right-0 transform -translate-y-1/2 w-3 h-16 bg-tg-theme-button-color rounded-l-lg"></div>
            </div>

            {/* Spin Button */}
            <button
              onClick={handleSpin}
              disabled={isSpinning || slotsAvailable <= 0}
              className={`w-full py-4 rounded-xl text-xl font-bold text-white shadow-lg transition-all duration-200 ${
                isSpinning || slotsAvailable <= 0
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-tg-theme-button-color hover:opacity-90 active:scale-95'
              }`}
              style={{
                backgroundColor:
                  window.Telegram?.WebApp?.themeParams?.button_color || '#2481cc'
              }}
            >
              {isSpinning ? 'Spinning...' : 'SPIN NOW'}
            </button>
          </div>
        ) : (
          <div className="bg-tg-theme-secondary-bg rounded-2xl shadow-xl p-8 text-center">
            <div className="text-5xl mb-4">😢</div>
            <h2 className="text-2xl font-bold text-tg-theme-text mb-2">No Spins Left!</h2>
            <p className="text-tg-theme-hint-color mb-6">
              Come back tomorrow or invite friends to get more spins
            </p>
            <button
              onClick={() =>
                window.Telegram?.WebApp?.openTelegramLink(
                  'https://t.me/share/url?url=Join%20this%20game!'
                )
              }
              className="px-6 py-3 bg-tg-theme-button-color text-white rounded-full font-medium hover:opacity-90 active:scale-95 transition-transform"
              style={{
                backgroundColor:
                  window.Telegram?.WebApp?.themeParams?.button_color || '#2481cc'
              }}
            >
              Invite Friends
            </button>
          </div>
        )}

        <RewardList />
      </main>
    </div>
  );
};

export default SpinPage;
