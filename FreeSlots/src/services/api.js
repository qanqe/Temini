const API_BASE_URL = 'https://freeslots-backend.onrender.com/api/user';

const getInitData = () => window?.Telegram?.WebApp?.initData || '';

const buildHeaders = () => ({
  'Content-Type': 'application/json',
  'x-telegram-auth': getInitData()
});

const handleRequest = async (fn) => {
  const res = await fn();
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error?.error || 'Unknown error');
  }
  return res.json();
};

const apiService = {
  authUser: (telegramId, username, referrerId) =>
    handleRequest(() =>
      fetch(`${API_BASE_URL}/auth`, {
        method: 'POST',
        headers: buildHeaders(),
        body: JSON.stringify({ telegramId, username, referrerId })
      })
    ),

  freeSlot: () =>
    handleRequest(() =>
      fetch(`${API_BASE_URL}/free-slot`, {
        method: 'POST',
        headers: buildHeaders()
      })
    ),

  paidSpin: () =>
    handleRequest(() =>
      fetch(`${API_BASE_URL}/spin`, {
        method: 'POST',
        headers: buildHeaders()
      })
    ),

  dailyCheckin: () =>
    handleRequest(() =>
      fetch(`${API_BASE_URL}/checkin`, {
        method: 'POST',
        headers: buildHeaders()
      })
    ),

  getRewardLogs: () =>
    handleRequest(() =>
      fetch(`${API_BASE_URL}/rewards`, {
        method: 'GET',
        headers: buildHeaders()
      })
    ),

  getReferralInfo: () =>
    handleRequest(() =>
      fetch(`${API_BASE_URL}/referral-info`, {
        method: 'GET',
        headers: buildHeaders()
      })
    )
};

export default apiService;
