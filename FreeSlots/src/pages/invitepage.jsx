import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import apiService from '../services/api';
import { FaCopy, FaWhatsapp, FaTelegram, FaTwitter, FaCheck } from "react-icons/fa";
import confetti from 'canvas-confetti';

const InvitePage = () => {
  const { user, telegramUser, refreshUser } = useAuth();
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [referralData, setReferralData] = useState({
    link: '',
    invitedCount: 0,
    activeCount: 0,
    rewards: []
  });

  const botUsername = import.meta.env.VITE_BOT_USERNAME || 'FreeSlotsMini_Bot';

  useEffect(() => {
    if (!window.Telegram?.WebApp) return;
    const tg = window.Telegram.WebApp;
    tg.expand();
    const onBack = () => window.history.back();
    tg.BackButton.onClick(onBack);
    tg.BackButton.show();
    return () => {
      tg.BackButton.offClick(onBack);
      tg.BackButton.hide();
    };
  }, []);

  useEffect(() => {
    const loadReferral = async () => {
      try {
        const res = await apiService.getReferralInfo(telegramUser.id);
        const link = `https://t.me/${botUsername}?start=${telegramUser.id}`;
        setReferralData({
          link,
          invitedCount: res.data.invitedCount,
          activeCount: res.data.activeCount,
          rewards: res.data.rewards
        });
      } catch (e) {
        console.error('Failed to load referral data', e);
      } finally {
        setIsLoading(false);
      }
    };

    if (telegramUser) loadReferral();
  }, [telegramUser]);

  const copyLink = () => {
    navigator.clipboard.writeText(referralData.link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const claimReward = async (rewardId) => {
    try {
      await apiService.claimReferralReward(telegramUser.id, rewardId);
      setReferralData(prev => ({
        ...prev,
        rewards: prev.rewards.map(r =>
          r.id === rewardId ? { ...r, claimed: true } : r
        )
      }));
      refreshUser();
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    } catch (e) {
      console.error('Reward claim failed', e);
    }
  };

  const shareVia = (platform) => {
    const text = encodeURIComponent(`Join and earn rewards! ${referralData.link}`);
    if (platform === 'telegram') {
      window.open(`https://t.me/share/url?url=${referralData.link}&text=Join and earn rewards!`);
    } else if (platform === 'whatsapp') {
      window.open(`https://wa.me/?text=${text}`);
    } else if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${text}`);
    }
  };

  if (!telegramUser) {
    return (
      <div className="p-4 text-center">
        <h2 className="text-xl font-bold text-tg-theme-text mb-2">Please open in Telegram</h2>
        <p className="text-tg-theme-hint-color">This feature requires Telegram authentication.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-10 w-10 rounded-full border-4 border-purple-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-tg-theme-bg p-4">
      <header className="flex justify-between items-center mb-6 p-3 bg-tg-theme-secondary-bg rounded-xl shadow-md">
        <div className="flex items-center space-x-2">
          <div className="bg-yellow-100 px-3 py-1 rounded-full">🪙 {user.coinBalance}</div>
          <div className="bg-purple-100 px-3 py-1 rounded-full">💎 {user.gems}</div>
        </div>
      </header>

      <main className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-center text-tg-theme-text mb-6">Invite Friends</h1>

        <div className="bg-tg-theme-secondary-bg rounded-2xl shadow-xl p-5 mb-6">
          <div className="flex justify-between text-center mb-4">
            <div>
              <div className="text-2xl font-bold text-tg-theme-link-color">{referralData.invitedCount}</div>
              <div className="text-sm text-tg-theme-hint-color">Invited</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-500">{referralData.activeCount}</div>
              <div className="text-sm text-tg-theme-hint-color">Active</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-amber-500">
                {referralData.activeCount >= 5 ? '2x' : '1x'}
              </div>
              <div className="text-sm text-tg-theme-hint-color">Bonus</div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl p-5 mb-6 text-white">
          <h2 className="font-bold text-lg mb-2">Your Referral Link</h2>
          <div className="flex items-center bg-white bg-opacity-20 rounded-lg p-2 mb-3">
            <div className="truncate text-sm mr-2">{referralData.link}</div>
            <button onClick={copyLink} className="bg-white bg-opacity-30 p-2 rounded-lg">
              {copied ? <FaCheck className="text-green-400" /> : <FaCopy />}
            </button>
          </div>
          <div className="flex justify-between space-x-2">
            <button onClick={() => shareVia('telegram')} className="flex-1 bg-white bg-opacity-20 p-2 rounded-lg flex items-center justify-center">
              <FaTelegram className="mr-2" /> Telegram
            </button>
            <button onClick={() => shareVia('whatsapp')} className="flex-1 bg-white bg-opacity-20 p-2 rounded-lg flex items-center justify-center">
              <FaWhatsapp className="mr-2" /> WhatsApp
            </button>
            <button onClick={() => shareVia('twitter')} className="flex-1 bg-white bg-opacity-20 p-2 rounded-lg flex items-center justify-center">
              <FaTwitter className="mr-2" /> Twitter
            </button>
          </div>
        </div>

        <div className="bg-tg-theme-secondary-bg rounded-2xl shadow-xl p-5 mb-6">
          <h2 className="font-bold text-lg text-tg-theme-text mb-4">Earn Rewards</h2>
          <div className="space-y-3">
            {referralData.rewards.map((reward) => (
              <div
                key={reward.id}
                className={`p-4 rounded-xl border flex items-center justify-between ${
                  reward.claimed
                    ? 'bg-green-50 border-green-200'
                    : referralData.activeCount >= reward.requiredActive
                    ? 'bg-purple-50 border-purple-200'
                    : 'border-gray-200'
                }`}
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center mr-3">
                    {reward.type === 'coin' ? '🪙' : reward.type === 'gem' ? '💎' : '🎟️'}
                  </div>
                  <div>
                    <h3 className="font-bold">{reward.requiredActive} Active Friend{reward.requiredActive > 1 ? 's' : ''}</h3>
                    <p className="text-sm text-gray-600">Get {reward.value} {reward.type}</p>
                  </div>
                </div>
                {reward.claimed ? (
                  <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center">
                    <FaCheck className="mr-1" /> Claimed
                  </div>
                ) : referralData.activeCount >= reward.requiredActive ? (
                  <button
                    onClick={() => claimReward(reward.id)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-medium"
                  >
                    Claim
                  </button>
                ) : (
                  <div className="text-gray-500 text-sm">{reward.requiredActive - referralData.activeCount} more</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default InvitePage;
