import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { FaCopy, FaCheck, FaTelegram, FaWhatsapp, FaTwitter } from 'react-icons/fa';
import confetti from 'canvas-confetti';

const InvitePage = () => {
  const { user, telegramUser } = useAuth();
  const [referralLink, setReferralLink] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!telegramUser?.id) return;

    const botUsername =
      window.Telegram?.WebApp?.initDataUnsafe?.bot_username || 'yourBot';

    const link = `https://t.me/${botUsername}?start=${telegramUser.id}`;
    setReferralLink(link);

    const tg = window.Telegram?.WebApp;
    if (tg) {
      tg.expand();
      tg.BackButton.show();
      tg.BackButton.onClick(() => window.history.back());
    }

    return () => {
      window.Telegram?.WebApp?.BackButton.hide();
    };
  }, [telegramUser]);

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    setTimeout(() => setCopied(false), 2000);
  };

  const share = (platform) => {
    const text = `Join the game and earn coins! ${referralLink}`;
    const encoded = encodeURIComponent(text);

    if (platform === 'telegram') {
      window.open(`https://t.me/share/url?url=${encoded}`, '_blank');
    } else if (platform === 'whatsapp') {
      window.open(`https://wa.me/?text=${encoded}`, '_blank');
    } else if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${encoded}`, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-tg-theme-bg text-tg-theme-text p-4">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-center mb-6">Invite & Earn</h1>

        <div className="bg-tg-theme-secondary-bg rounded-xl p-4 mb-6 shadow-md">
          <p className="text-lg text-center mb-2">Your Referral Link</p>
          <div className="flex items-center bg-tg-theme-bg p-2 rounded-lg overflow-auto">
            <span className="text-sm flex-1">{referralLink}</span>
            <button
              onClick={copyLink}
              className="ml-2 p-2 rounded-md bg-gray-100 hover:bg-gray-200"
            >
              {copied ? <FaCheck className="text-green-500" /> : <FaCopy />}
            </button>
          </div>

          <div className="flex justify-between mt-4 space-x-2">
            <button
              onClick={() => share('telegram')}
              className="flex-1 bg-blue-500 text-white py-2 rounded-lg flex items-center justify-center space-x-2"
            >
              <FaTelegram />
              <span>Telegram</span>
            </button>
            <button
              onClick={() => share('whatsapp')}
              className="flex-1 bg-green-500 text-white py-2 rounded-lg flex items-center justify-center space-x-2"
            >
              <FaWhatsapp />
              <span>WhatsApp</span>
            </button>
            <button
              onClick={() => share('twitter')}
              className="flex-1 bg-blue-400 text-white py-2 rounded-lg flex items-center justify-center space-x-2"
            >
              <FaTwitter />
              <span>Twitter</span>
            </button>
          </div>
        </div>

        <div className="bg-tg-theme-secondary-bg rounded-xl p-4 shadow-md text-center">
          <h2 className="text-xl font-semibold mb-2">Referral Stats</h2>
          <p className="text-sm mb-1">
            <span className="font-bold text-green-600">{user?.referralCount || 0}</span>{' '}
            friend(s) joined using your link.
          </p>
          <p className="text-sm text-tg-theme-hint-color">
            You earned{' '}
            <span className="font-semibold text-amber-500">
              {5 * (user?.referralCount || 0)} coins
            </span>{' '}
            total.
          </p>
        </div>
      </div>
    </div>
  );
};

export default InvitePage;
