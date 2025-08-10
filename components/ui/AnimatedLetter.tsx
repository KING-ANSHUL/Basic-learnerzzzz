import React, { useState, useEffect } from 'react';

interface AnimatedLetterProps {
  letter: string;
  delay: number;
  colorClass?: string;
}

export const AnimatedLetter: React.FC<AnimatedLetterProps> = ({ letter, delay, colorClass = 'text-yellow-700' }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <span
      className={`inline-block text-6xl md:text-8xl font-black transition-all duration-500 ease-out ${colorClass}
      ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
    >
      {letter}
    </span>
  );
};