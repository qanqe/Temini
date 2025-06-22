import React from 'react';
import rewardConfig from '../constants/rewardConfig';
import { FaOldRepublic } from 'react-icons/fa';

const RewardPill = ({ type }) => {
  const reward = rewardConfig[type];

  if (!reward) {
    return (
      <div className="bg-red-100 p-3 rounded-lg text-center text-red-600 font-semibold">
        Invalid Reward
      </div>
    );
  }

  const getLabel = () => {
    if (type.startsWith('coins')) return `${reward.value} Coins`;
    if (type.startsWith('gems')) return `${reward.value} Gems`;
    return 'Try Again';
  };

  return (
    <div className="bg-white p-3 rounded-lg text-center relative shadow-sm">
      <div className="text-2xl">{reward.emoji}</div>
      <p className="font-semibold">{getLabel()}</p>
      {'weight' in reward && (
        <div className="absolute bottom-1 right-2 text-xs text-gray-400">
          {reward.weight}x
        </div>
      )}
    </div>
  );
};

export default RewardPill;