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
        if (!window.Telegram?.WebApp) {
          alert('[Auth] Not running in Telegram WebApp');
          setLoading(false);
          return;
        }

        const { default: WebApp } = await import('@twa-dev/sdk');
        WebApp.ready();
        WebApp.expand();

        const tgUser = WebApp.initDataUnsafe?.user;
        const initData = WebApp.initData;

        if (!tgUser || !initData) {
          alert('[Auth] Telegram user or initData is missing');
          setLoading(false);
          return;
        }

        setTelegramUser(tgUser);

        const payload = {
          telegramId: tgUser.id.toString(),
          username: tgUser.username || `${tgUser.first_name} ${tgUser.last_name || ''}`.trim(),
          initData
        };

        const res = await apiService.authUser(payload);

        if (res.success && res.user) {
          setUser(res.user);
        } else {
          alert(`[Auth] Auth failed:\n${JSON.stringify(res, null, 2)}`);
        }
      } catch (err) {
        alert(`[Auth] Telegram SDK or auth error:\n${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    initTelegram();
  }, []);

  const refreshUser = async () => {
    try {
      const res = await apiService.authUser({
        telegramId: telegramUser?.id?.toString(),
        username: telegramUser?.username,
        initData: window.Telegram?.WebApp?.initData
      });

      if (res.success && res.user) {
        setUser(res.user);
      }
    } catch (err) {
      alert(`[Auth] Refresh failed:\n${err.message}`);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        telegramUser,
        refreshUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
