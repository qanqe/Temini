import React from 'react';

const RewardPill = ({ type, amount }) => {
  const getEmoji = () => {
    if (type === 'coin') return '🪙';
    if (type === 'gem') return '💎';
    return '🔄';
  };

  const getLabel = () => {
    if (type === 'coin') return `${amount} Coins`;
    if (type === 'gem') return `${amount} Gems`;
    return 'Try Again';
  };

  return (
    <div
      className={`p-3 rounded-lg text-center shadow-sm ${
        type === 'none' ? 'bg-gray-100 text-gray-500' : 'bg-white'
      }`}
      aria-label={`Reward: ${getLabel()}`}
    >
      <div className="text-2xl">{getEmoji()}</div>
      <p className="font-semibold">{getLabel()}</p>
    </div>
  );
};

export default RewardPill;
