import React from 'react';

const BalanceHeader = ({ coins = 0, gems = 0 }) => {
  return (
    <header className="flex justify-center gap-4 items-center mb-6 p-3 bg-tg-theme-secondary-bg rounded-xl shadow-md">
      <div className="bg-yellow-100 px-3 py-1 rounded-full flex items-center" title="Coins">
        <span className="mr-1" role="img" aria-label="coin">🪙</span>
        <span className="font-bold">{coins}</span>
      </div>
      <div className="bg-purple-100 px-3 py-1 rounded-full flex items-center" title="Gems">
        <span className="mr-1" role="img" aria-label="gem">💎</span>
        <span className="font-bold">{gems}</span>
      </div>
    </header>
  );
};

export default BalanceHeader;
