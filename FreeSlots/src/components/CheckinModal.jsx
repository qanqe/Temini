import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import apiService from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';

const CheckinModal = ({ onClose }) => {
  const { user, refreshUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [checkedIn, setCheckedIn] = useState(false);
  const [reward, setReward] = useState(null);
  const [streak, setStreak] = useState(null);
  const [error, setError] = useState(null);

  const handleCheckin = async () => {
    if (!user || checkedIn) return;
    setLoading(true);
    setError(null);

    const res = await apiService.dailyCheckin(user.telegramId);
    if (res.success) {
      setCheckedIn(true);
      setReward(res.reward);
      setStreak(res.streak);
      refreshUser();
    } else {
      setError(res.error);
    }

    setLoading(false);
  };

  useEffect(() => {
    handleCheckin();
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <AnimatePresence>
        <motion.div
          key="modal"
          initial={{ opacity: 0, scale: 0.8, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 40 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6 text-center relative"
        >
          <h2 className="text-xl font-semibold mb-2">🎁 Daily Check-in</h2>

          {loading ? (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-gray-500 text-sm"
            >
              Checking in...
            </motion.p>
          ) : error ? (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-500 text-sm"
            >
              {error}
            </motion.p>
          ) : checkedIn ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-2"
            >
              <p className="text-green-600 text-lg font-semibold">
                +{reward} coins
              </p>
              <p className="text-gray-600 text-sm">Streak: {streak} day{streak > 1 ? 's' : ''}</p>
            </motion.div>
          ) : null}

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="mt-5 px-5 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
          >
            Close
          </motion.button>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default CheckinModal;
