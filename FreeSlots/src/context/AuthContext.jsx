import { createContext, useContext, useState, useEffect } from 'react';
import apiService from '../services/api';
import WebApp from '@twa-dev/sdk';

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

        WebApp.ready();
        WebApp.expand();

        const tgUser = WebApp.initDataUnsafe?.user;
        const initData = WebApp.initData;

        if (!tgUser || !initData) {
          alert('[Auth] Telegram user or initData is missing');
          alert('[DEBUG] initData: ' + initData);
          setLoading(false);
          return;
        }

        setTelegramUser(tgUser);

        const payload = {
          telegramId: tgUser.id.toString(),
          username:
            tgUser.username ||
            `${tgUser.first_name} ${tgUser.last_name || ''}`.trim(),
          initData,
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
      const initData = window.Telegram?.WebApp?.initData;
      const tg = telegramUser;

      if (!tg?.id || !initData) {
        console.warn('[Auth] Missing Telegram user or initData for refresh.');
        return;
      }

      const payload = {
        telegramId: tg.id.toString(),
        username:
          tg.username ||
          `${tg.first_name} ${tg.last_name || ''}`.trim(),
        initData,
      };

      const res = await apiService.authUser(payload);

      if (res.success && res.user) {
        setUser(res.user);
      } else {
        console.warn('[Auth] Refresh response invalid:', res);
      }
    } catch (err) {
      alert(`[Auth] Refresh failed:\n${err.message}`);
    }
  };

  const updateUser = (updates) => {
    setUser((prev) => ({
      ...prev,
      ...updates,
    }));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        telegramUser,
        refreshUser,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;