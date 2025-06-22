import React from 'react';
import RewardPill from './RewardPill';

const RewardList = () => {
  const displayKeys = ['coins_50', 'coins_100', 'gems_5'];

  return (
    <div className="mt-8 bg-tg-theme-secondary-bg rounded-xl p-4">
      <h3 className="font-bold text-tg-theme-text mb-2">Possible Rewards:</h3>
      <div className="grid grid-cols-3 gap-2">
        {displayKeys.map((key) => (
          <RewardPill key={key} type={key} />
        ))}
      </div>
    </div>
  );
};

export default RewardList;
