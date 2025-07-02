const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://freeslots-backend.onrender.com';

const buildHeaders = () => ({
  'Content-Type': 'application/json',
  ...(window.Telegram?.WebApp?.initData && {
    'X-Telegram-Auth': window.Telegram.WebApp.initData
  })
});

const handleRequest = async (requestFn) => {
  try {
    const response = await requestFn();
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.error || `HTTP ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('[API] Error:', error);
    return {
      success: false,
      error: error.message || 'Unknown error'
    };
  }
};

const apiService = {
  // Auth/Register/Login
  authUser: (body) =>
    handleRequest(() =>
      fetch(`${API_BASE_URL}/user/auth`, {
        method: 'POST',
        headers: buildHeaders(),
        body: JSON.stringify(body)
      })
    ),

  // FREE Slot Spin (Home Page)
  freeSlot: (telegramId) =>
    handleRequest(() =>
      fetch(`${API_BASE_URL}/user/free-slot`, {
        method: 'POST',
        headers: buildHeaders(),
        body: JSON.stringify({ telegramId, initData: window.Telegram.WebApp.initData })
      })
    ),

  // PAID Spin (Spin Page)
  paidSpin: (telegramId) =>
    handleRequest(() =>
      fetch(`${API_BASE_URL}/user/spin`, {
        method: 'POST',
        headers: buildHeaders(),
        body: JSON.stringify({ telegramId, initData: window.Telegram.WebApp.initData })
      })
    ),

  // Daily Check-in
  dailyCheckin: (telegramId) =>
    handleRequest(() =>
      fetch(`${API_BASE_URL}/user/checkin`, {
        method: 'POST',
        headers: buildHeaders(),
        body: JSON.stringify({ telegramId, initData: window.Telegram.WebApp.initData })
      })
    ),

  // Referral (Apply Referrer Code)
  applyReferral: (telegramId, referrerId) =>
    handleRequest(() =>
      fetch(`${API_BASE_URL}/user/referral`, {
        method: 'POST',
        headers: buildHeaders(),
        body: JSON.stringify({
          telegramId,
          referrerId,
          initData: window.Telegram.WebApp.initData
        })
      })
    ),

  // Reward Logs
  getRewardLogs: () =>
    handleRequest(() =>
      fetch(`${API_BASE_URL}/user/rewards`, {
        method: 'GET',
        headers: buildHeaders()
      })
    ),

  // Get Referral Info
  getReferralInfo: (telegramId) =>
    handleRequest(() =>
      fetch(`${API_BASE_URL}/user/referral-info?telegramId=${telegramId}`, {
        method: 'GET',
        headers: buildHeaders()
      })
    ),

  // Claim Referral Reward
  claimReferralReward: (telegramId, rewardId) =>
    handleRequest(() =>
      fetch(`${API_BASE_URL}/user/referral-claim`, {
        method: 'POST',
        headers: buildHeaders(),
        body: JSON.stringify({
          telegramId,
          rewardId,
          initData: window.Telegram.WebApp.initData
        })
      })
    )
};

export default apiService;
