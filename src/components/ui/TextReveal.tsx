import React, { useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';

const CHARSET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+';

export const TextReveal: React.FC<{ text: string; className?: string }> = ({ text, className }) => {
  const [displayText, setDisplayText] = useState(text);
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  useEffect(() => {
    if (!isInView) return;

    let iteration = 0;
    const interval = setInterval(() => {
      setDisplayText(() =>
        text
          .split('')
          .map((char, index) => {
            if (index < iteration || char === ' ') {
              return text[index];
            }
            return CHARSET[Math.floor(Math.random() * CHARSET.length)];
          })
          .join('')
      );

      if (iteration >= text.length) {
        clearInterval(interval);
      }

      iteration += 1 / 3;
    }, 30);

    return () => clearInterval(interval);
  }, [isInView, text]);

  return (
    <motion.div ref={ref} className={className}>
      {displayText}
    </motion.div>
  );
};

export default TextReveal;
