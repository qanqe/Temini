// src/constants/rewardConfig.js

/**
 * Reward configuration for spin outcomes.
 * - weight: determines likelihood (higher = more common)
 * - value: numerical reward if applicable
 * - emoji: used for visual feedback
 */
const rewardConfig = {
  coins_50:   { emoji: '🪙', weight: 5, value: 50 },
  coins_100:  { emoji: '🪙', weight: 3, value: 100 },
  gems_5:     { emoji: '💎', weight: 1, value: 5 },
  try_again:  { emoji: '🔄', weight: 2 }
};

export default rewardConfig;
