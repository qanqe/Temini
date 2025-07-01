import React from 'react';
import RewardPill from './RewardPill';

const rewardTypes = [
  { type: 'coin', amount: 50 },
  { type: 'coin', amount: 100 },
  { type: 'coin', amount: 500 },
  { type: 'gem', amount: 1 },
  { type: 'none' }
];

const RewardList = () => {
  return (
    <div className="mt-8 bg-tg-theme-secondary-bg rounded-xl p-4 shadow-md">
      <h3 className="font-bold text-tg-theme-text mb-3 text-lg">Possible Rewards</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {rewardTypes.map((reward, index) => (
          <RewardPill key={index} type={reward.type} amount={reward.amount} />
        ))}
      </div>
    </div>
  );
};

export default RewardList;
