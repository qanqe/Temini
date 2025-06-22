// src/hooks/useUser.jsx
import { useAuth } from '../context/AuthContext';

export const useUser = () => {
  const { user, loading, refreshUser } = useAuth();
  const safeUser = user || {};

  return {
    coins: safeUser.coins || 0,
    gems: safeUser.gems || 0,
    slots: safeUser.slots || 0,
    streak: safeUser.streakCount || 0,
    isLoading: loading,
    refreshUser
  };
};
