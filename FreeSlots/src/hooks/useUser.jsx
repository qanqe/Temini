// src/hooks/useUser.jsx
import { useAuth } from '../context/AuthContext';

export const useUser = () => {
  const { user, loading, updateUser, refreshUser } = useAuth();
  const safeUser = user || {};

  return {
    coins: safeUser.coins || 0,
    gems: safeUser.gems || 0,
    slots: safeUser.slots || 0,
    streak: safeUser.streakCount || 0, // backend field is streakCount
    isLoading: loading,
    updateUser,
    refreshUser
  };
};
