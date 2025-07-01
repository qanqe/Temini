import React from 'react';
import { motion } from 'framer-motion';

const SpinButton = ({
  onClick,
  disabled = false,
  text = 'Spin Now!',
  glowColor = 'rgba(255, 193, 7, 0.4)',
  gradient = 'from-yellow-400 via-yellow-500 to-orange-500'
}) => {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      whileTap={!disabled ? { scale: 0.97 } : {}}
      whileHover={!disabled ? { scale: 1.03 } : {}}
      className={`
        relative w-full max-w-xs text-center py-4 px-8 rounded-full text-lg font-bold 
        transition-all duration-200 select-none shadow-xl
        ${disabled
          ? 'bg-gray-400 text-white cursor-not-allowed'
          : `bg-gradient-to-r ${gradient} text-white`}
      `}
    >
      {/* Animated Glow */}
      {!disabled && (
        <motion.div
          className="absolute inset-0 rounded-full z-0"
          style={{
            background: glowColor,
            filter: 'blur(30px)',
            opacity: 0.4
          }}
          animate={{
            scale: [1, 1.08, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
      )}

      {/* Text content */}
      <span className="relative z-10">{disabled ? 'Please wait...' : text}</span>
    </motion.button>
  );
};

export default SpinButton;
