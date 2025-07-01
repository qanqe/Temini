import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';

const getRandomDigit = () => Math.floor(Math.random() * 10);

const Reel = ({ value, spinning, isSeven }) => {
  return (
    <motion.div
      animate={{
        y: spinning ? ['0%', '100%', '0%'] : '0%',
        transition: spinning
          ? { repeat: Infinity, duration: 0.3, ease: 'linear' }
          : { duration: 0.4, ease: 'easeOut' }
      }}
      className={`w-16 h-16 rounded-lg flex items-center justify-center text-3xl font-bold border-2 border-yellow-500 shadow-md ${
        isSeven ? 'bg-yellow-400 animate-pulse ring-2 ring-amber-500' : 'bg-yellow-300'
      }`}
    >
      {value}
    </motion.div>
  );
};

const SlotReel = ({ spinning, finalResult }) => {
  const [reelValues, setReelValues] = useState([7, 7, 7]);
  const [sparkle, setSparkle] = useState(false);

  useEffect(() => {
    if (spinning) {
      const interval = setInterval(() => {
        setReelValues([
          getRandomDigit(),
          getRandomDigit(),
          getRandomDigit()
        ]);
      }, 100);

      return () => clearInterval(interval);
    } else {
      if (finalResult) {
        setReelValues(finalResult);

        if (finalResult.every((num) => num === 7)) {
          setSparkle(true);
          confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
          setTimeout(() => setSparkle(false), 2000);
        } else {
          setSparkle(false);
        }
      }
    }
  }, [spinning, finalResult]);

  return (
    <div className="flex gap-4 my-4">
      {reelValues.map((val, idx) => (
        <Reel
          key={idx}
          value={val}
          spinning={spinning}
          isSeven={sparkle && val === 7}
        />
      ))}
    </div>
  );
};

export default SlotReel;
