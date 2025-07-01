import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import apiService from '../services/api';
import Lottie from 'lottie-react';
import confetti from 'canvas-confetti';
import RewardList from '../components/RewardList';
import BalanceHeader from '../components/BalanceHeader';
import spinAnimation from '../assets/spin-animation.json';

const SpinPage = () => {
  const { user, refreshUser } = useAuth();
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinResult, setSpinResult] = useState(null);
  const [showReward, setShowReward] = useState(false);

  const COIN_COST = 10;

  const handleSpin = async () => {
    if (isSpinning || !user || user.coinBalance < COIN_COST) return;

    setIsSpinning(true);
    setSpinResult(null);
    setShowReward(false);

    try {
      const result = await apiService.spinWheel(user.telegramId);
      const { reward } = result;

      setSpinResult(reward);
      setShowReward(true);

      if (reward?.type === 'coin' || reward?.type === 'gem') {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }

      await refreshUser();
    } catch (error) {
      alert('Spin failed. Please try again later.');
      console.error(error);
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
    <div className="min-h-screen bg-tg-theme-bg p-4">
      <BalanceHeader
        coins={user?.coinBalance || 0}
        gems={user?.gems || 0}
      />

      <main className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-center text-tg-theme-text mb-6">
          Spin for Gems
        </h1>

        {user?.coinBalance >= COIN_COST ? (
          <div className="bg-tg-theme-secondary-bg rounded-2xl shadow-xl p-6">
            <div className="relative mb-8">
              <div className="bg-tg-theme-bg border-2 border-dashed border-tg-theme-hint-color rounded-xl w-full h-48 flex items-center justify-center transition-all duration-300">
                {isSpinning ? (
                  <Lottie animationData={spinAnimation} loop style={{ height: 180 }} />
                ) : showReward && spinResult ? (
                  <div
                    className={`text-center animate-bounce ${
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
                  <div className="text-center text-tg-theme-hint-color">
                    <div className="text-5xl">🎰</div>
                    <p className="mt-2">Spin to win rewards</p>
                  </div>
                )}
              </div>

              <div className="absolute top-1/2 right-0 transform -translate-y-1/2 w-3 h-16 bg-tg-theme-button-color rounded-l-lg" />
            </div>

            <button
              onClick={handleSpin}
              disabled={isSpinning || user.coinBalance < COIN_COST}
              className={`w-full py-4 rounded-xl text-xl font-bold text-white shadow-lg transition-all duration-200 ${
                isSpinning || user.coinBalance < COIN_COST
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-tg-theme-button-color hover:opacity-90 active:scale-95'
              }`}
              style={{
                backgroundColor:
                  window.Telegram?.WebApp?.themeParams?.button_color || '#2481cc'
              }}
            >
              {isSpinning ? 'Spinning...' : `SPIN (💰 ${COIN_COST})`}
            </button>
          </div>
        ) : (
          <div className="bg-tg-theme-secondary-bg rounded-2xl shadow-xl p-8 text-center">
            <div className="text-5xl mb-4">😢</div>
            <h2 className="text-2xl font-bold text-tg-theme-text mb-2">
              Not Enough Coins
            </h2>
            <p className="text-tg-theme-hint-color mb-6">
              You need at least {COIN_COST} coins to spin.
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
