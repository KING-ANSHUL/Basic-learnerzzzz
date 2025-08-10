import React from 'react';

export const MicrophoneIcon: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2a3 3 0 00-3 3v6a3 3 0 106 0V5a3 3 0 00-3-3z" />
      <path d="M19 10v1a7 7 0 11-14 0v-1h2v1a5 5 0 1010 0v-1h2z" />
    </svg>
  );
};
