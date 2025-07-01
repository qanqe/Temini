import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import apiService from '../services/api';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, UserPlus } from 'lucide-react';
import CheckinModal from '../components/CheckinModal';
import confetti from 'canvas-confetti';

export default function Homepage() {
  const { user, loading, refreshUser } = useAuth();
  const [spinResult, setSpinResult] = useState(null);
  const [spinning, setSpinning] = useState(false);
  const [showCheckIn, setShowCheckIn] = useState(true);
  const [slotNumbers, setSlotNumbers] = useState([7, 7, 7]);
  const navigate = useNavigate();

  const handleFreeSpin = async () => {
    if (!user || spinning) return;
    setSpinning(true);
    setSpinResult(null);

    // Animate slot spinning
    const animation = setInterval(() => {
      setSlotNumbers([
        Math.floor(Math.random() * 10),
        Math.floor(Math.random() * 10),
        Math.floor(Math.random() * 10),
      ]);
    }, 100);

    const res = await apiService.freeSlot(user.telegramId);

    setTimeout(() => {
      clearInterval(animation);
      setSlotNumbers([7, 7, 7]); // Visual match for "777" slot branding

      if (res.success) {
        setSpinResult(res.reward);
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
        refreshUser();
      }

      setSpinning(false);
    }, 1200);
  };

  useEffect(() => {
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.expand();
    }
  }, []);

  if (loading) return <div className="p-4 text-center">Loading...</div>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-yellow-100 to-yellow-300 relative overflow-hidden">
      {showCheckIn && <CheckinModal onClose={() => setShowCheckIn(false)} />}

      <motion.div
        className="text-2xl font-bold mb-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        Welcome, {user?.username || 'Player'}!
      </motion.div>

      <motion.div
        className="mb-4 text-lg font-medium"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        Coins: {user.coinBalance} | Gems: {user.gems}
      </motion.div>

      <div className="bg-white shadow-lg rounded-lg p-4 flex gap-4 mb-6">
        {slotNumbers.map((num, index) => (
          <motion.div
            key={index}
            className="w-16 h-16 bg-yellow-300 rounded flex items-center justify-center text-3xl font-bold border-2 border-yellow-500"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            {num}
          </motion.div>
        ))}
      </div>

      <motion.button
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.05 }}
        transition={{ type: 'spring', stiffness: 300 }}
        className="bg-orange-500 text-white px-6 py-3 rounded-full shadow-lg text-xl font-semibold"
        onClick={handleFreeSpin}
        disabled={spinning}
      >
        {spinning ? 'Spinning...' : 'Spin the 777 Slot!'}
      </motion.button>

      <AnimatePresence>
        {spinResult !== null && !spinning && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-6 text-lg font-semibold text-green-700"
          >
            🎉 +{spinResult} coins!
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="absolute bottom-4 left-4"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        <button
          onClick={() => navigate('/spin')}
          className="bg-purple-600 text-white px-4 py-2 rounded-full shadow-md flex items-center gap-2"
        >
          <Gift size={18} /> Spin for Gems
        </button>
      </motion.div>

      <motion.div
        className="absolute bottom-4 right-4"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        <button
          onClick={() => navigate('/invite')}
          className="bg-blue-500 text-white px-4 py-2 rounded-full shadow-md flex items-center gap-2"
        >
          <UserPlus size={18} /> Invite Friends
        </button>
      </motion.div>
    </div>
  );
}
