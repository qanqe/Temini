import { createContext, useContext, useState, useEffect } from 'react';
import apiService from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [telegramUser, setTelegramUser] = useState(null);

  useEffect(() => {
    const initTelegram = async () => {
      if (!window.Telegram?.WebApp) {
        console.warn('[Auth] Not running in Telegram WebApp');
        setLoading(false);
        return;
      }

      try {
        const { default: WebApp } = await import('@twa-dev/sdk');
        WebApp.ready();
        WebApp.expand();

        const tgUser = WebApp.initDataUnsafe?.user;
        const initData = WebApp.initData;

        console.log('[DEBUG] Telegram user:', tgUser);
        console.log('[DEBUG] initData:', initData);

        if (!tgUser || !initData) {
          console.error('[Auth] Missing tgUser or initData');
          return setLoading(false);
        }

        setTelegramUser(tgUser);

        const payload = {
          telegramId: tgUser.id.toString(),
          username: tgUser.username || `${tgUser.first_name} ${tgUser.last_name || ''}`.trim(),
          initData
        };

        const res = await apiService.authUser(payload);
        if (res.success && res.user) {
          console.log('[Auth] Authenticated user:', res.user);
          setUser(res.user);
        } else {
          console.error('[Auth] Auth failed:', res);
        }

      } catch (err) {
        console.error('[Auth] Telegram init/auth error:', err);
      } finally {
        setLoading(false);
      }
    };

    initTelegram();
  }, []);

  const refreshUser = async () => {
    if (!telegramUser?.id) return;
    try {
      const res = await apiService.authUser({
        telegramId: telegramUser.id.toString(),
        username: telegramUser.username,
        initData: window.Telegram?.WebApp?.initData
      });

      if (res.success && res.user) {
        console.log('[Auth] User refreshed:', res.user);
        setUser(res.user);
      }
    } catch (err) {
      console.error('[Auth] Refresh failed:', err);
    }
  };

  const updateUser = (newUserData) => {
    setUser(prev => ({ ...prev, ...newUserData }));
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      telegramUser,
      refreshUser,
      updateUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
