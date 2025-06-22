import { createContext, useContext, useState, useEffect } from 'react';
import apiService from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [telegramUser, setTelegramUser] = useState(null);

  useEffect(() => {
    const initTelegram = async () => {
      try {
        const { default: WebApp } = await import('@twa-dev/sdk');
        WebApp.ready();
        WebApp.expand();

        const tgUser = WebApp.initDataUnsafe?.user;
        if (!tgUser) {
          console.error('Telegram user not found in initData');
          return setLoading(false);
        }

        setTelegramUser(tgUser);

        const initData = WebApp.initData;
        const payload = {
          telegramId: tgUser.id.toString(),
          username: tgUser.username || `${tgUser.first_name} ${tgUser.last_name || ''}`.trim(),
          initData
        };

        const res = await apiService.authUser(payload);
        if (res.success && res.user) {
          setUser(res.user);
        } else {
          console.error('Auth failed:', res);
        }
      } catch (err) {
        console.error('Telegram init or auth failed:', err);
      } finally {
        setLoading(false);
      }
    };

    initTelegram();
  }, []);

  const refreshUser = async () => {
    // To be used after check-in, spin, etc.
    try {
      const updated = await apiService.authUser({
        telegramId: telegramUser.id.toString(),
        username: telegramUser.username,
        initData: window.Telegram.WebApp.initData
      });
      if (updated.success) {
        setUser(updated.user);
      }
    } catch (error) {
      console.error('Refresh failed:', error);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      telegramUser,
      refreshUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
