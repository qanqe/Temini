import React from 'react';

const BalanceHeader = ({ coins, gems, slots }) => {
  return (
    <header className="flex justify-between items-center mb-6 p-3 bg-tg-theme-secondary-bg rounded-xl shadow-md">
      <div className="flex items-center space-x-2">
        <div className="bg-yellow-100 px-3 py-1 rounded-full flex items-center">
          <span className="mr-1">🪙</span>
          <span className="font-bold">{coins}</span>
        </div>
        <div className="bg-purple-100 px-3 py-1 rounded-full flex items-center">
          <span className="mr-1">💎</span>
          <span className="font-bold">{gems}</span>
        </div>
      </div>
      <div className="bg-indigo-100 px-3 py-1 rounded-full flex items-center">
        <span className="mr-1">🎟️</span>
        <span className="font-bold">{slots}</span>
      </div>
    </header>
  );
};

export default BalanceHeader;
