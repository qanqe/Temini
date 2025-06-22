import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { FaCoins, FaGem, FaTicketAlt, FaFire, FaGamepad } from 'react-icons/fa';
import { useAuth } from './context/AuthContext';

const App = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.expand();
    }
  }, []);

  if (!user) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-600">Loading user data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-purple-100 p-4 pb-20">
      {/* Header */}
      <header className="flex justify-between items-center mb-6 p-3 bg-white rounded-2xl shadow-lg sticky top-4 z-10">
        <div className="flex items-center">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 w-10 h-10 rounded-xl flex items-center justify-center mr-3">
            <span className="text-white text-xl font-bold">FS</span>
          </div>
          <h1 className="text-xl font-bold text-gray-800">FreeSlots</h1>
        </div>

        <div className="flex items-center space-x-2">
          <div className="bg-amber-100 px-3 py-1 rounded-full flex items-center">
            <FaCoins className="text-amber-600 mr-1" />
            <span className="font-bold">{user.coinBalance || 0}</span>
          </div>
          <div className="bg-purple-100 px-3 py-1 rounded-full flex items-center">
            <FaGem className="text-purple-600 mr-1" />
            <span className="font-bold">{user.gems || 0}</span>
          </div>
          <div className="bg-green-100 px-3 py-1 rounded-full flex items-center">
            <FaTicketAlt className="text-green-600 mr-1" />
            <span className="font-bold">{user.bonusSlots || 0}</span>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <div className="grid grid-cols-1 gap-4 mb-8">
        <Link to="/spin" className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-4 rounded-2xl text-center font-medium shadow-lg hover:from-blue-600 hover:to-indigo-700 transition-all flex items-center justify-center">
          <span className="text-2xl mr-3">🎰</span>
          <span>Spin Game</span>
        </Link>

        <Link to="/checkin" className="bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 rounded-2xl text-center font-medium shadow-lg hover:from-green-600 hover:to-emerald-700 transition-all flex items-center justify-center">
          <span className="text-2xl mr-3">📅</span>
          <span>Daily Check-in</span>
        </Link>

        <Link to="/invite" className="bg-gradient-to-r from-amber-500 to-orange-500 text-white py-4 rounded-2xl text-center font-medium shadow-lg hover:from-amber-600 hover:to-orange-600 transition-all flex items-center justify-center">
          <span className="text-2xl mr-3">👥</span>
          <span>Invite & Earn</span>
        </Link>
      </div>

      {/* Daily Reward Card */}
      <div className="bg-white rounded-2xl shadow-lg p-5 mb-8 relative">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-800">Daily Reward</h2>
          <div className="flex items-center bg-amber-100 px-3 py-1 rounded-full">
            <FaFire className="text-amber-600 mr-1" />
            <span className="text-amber-700 font-medium">Day {user.streakCount || 0}</span>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200">
          <div className="flex items-center">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 flex items-center justify-center mr-4">
              <FaCoins className="text-white text-xl" />
            </div>
            <div>
              <h3 className="font-bold text-gray-800">Daily Bonus</h3>
              <p className="text-sm text-gray-600">Collect 1 spin + coins every day</p>
            </div>
          </div>

          <button
            onClick={() => navigate('/checkin')}
            className="px-4 py-2 rounded-lg font-medium bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 shadow-md"
          >
            Check-in
          </button>
        </div>
      </div>

      {/* Featured Game */}
      <div className="mb-8">
        <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
          <FaGamepad className="mr-2 text-indigo-600" />
          Featured Game
        </h2>

        <div className="bg-gradient-to-br from-indigo-100 to-purple-100 border border-indigo-200 rounded-2xl shadow overflow-hidden">
          <div className="p-5">
            <div className="flex items-center mb-4">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 w-12 h-12 rounded-xl flex items-center justify-center mr-3">
                <div className="text-white text-2xl">🎰</div>
              </div>
              <div>
                <h3 className="font-bold text-gray-800 text-lg">Spin Wheel</h3>
                <p className="text-sm text-gray-600">Win coins, gems & more</p>
              </div>
            </div>

            <div className="flex items-center justify-between bg-white bg-opacity-50 p-3 rounded-lg mb-4">
              <div className="flex items-center">
                <FaTicketAlt className="text-indigo-600 mr-2" />
                <span className="text-sm font-medium">{user.bonusSlots || 0} spins available</span>
              </div>
              <div className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full text-xs">
                Active
              </div>
            </div>

            <Link
              to="/spin"
              className="block w-full bg-gradient-to-r from-indigo-500 to-purple-600 p-3 text-center text-white font-medium rounded-lg hover:from-indigo-600 hover:to-purple-700 transition"
            >
              Play Now
            </Link>
          </div>
        </div>
      </div>

      {/* Static Ad Banner */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-5 text-white text-center shadow-lg relative overflow-hidden">
        <div className="absolute -left-10 -top-10 w-32 h-32 bg-white bg-opacity-20 rounded-full"></div>
        <div className="absolute -right-8 bottom-0 w-24 h-24 bg-white bg-opacity-15 rounded-full"></div>

        <div className="relative z-10">
          <h3 className="font-bold text-lg mb-1">Special Offer!</h3>
          <p className="text-amber-100 mb-3">Get 2x rewards this week</p>
          <button className="bg-white text-amber-600 px-4 py-2 rounded-lg font-medium hover:bg-amber-50 transition">
            Claim Offer
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
