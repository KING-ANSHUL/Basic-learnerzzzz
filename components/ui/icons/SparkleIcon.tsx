import React from 'react';

export const SparkleIcon: React.FC<{ className?: string; style?: React.CSSProperties }> = ({ className, style }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} style={style} viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 2a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 2zM5.106 5.106a.75.75 0 011.06 0l2.475 2.475a.75.75 0 01-1.06 1.06L5.106 6.166a.75.75 0 010-1.06zM2 10a.75.75 0 01.75-.75h3.5a.75.75 0 010 1.5h-3.5A.75.75 0 012 10zm3.106 4.894a.75.75 0 010 1.06l-2.475 2.475a.75.75 0 01-1.06-1.06l2.475-2.475a.75.75 0 011.06 0zM10 18a.75.75 0 01-.75-.75v-3.5a.75.75 0 011.5 0v3.5A.75.75 0 0110 18zm4.894-3.106a.75.75 0 01-1.06 0l-2.475-2.475a.75.75 0 011.06-1.06l2.475 2.475a.75.75 0 010 1.06zM18 10a.75.75 0 01-.75.75h-3.5a.75.75 0 010 1.5h-3.5A.75.75 0 0118 10zm-3.106-4.894a.75.75 0 010-1.06l2.475-2.475a.75.75 0 011.06 1.06L14.894 6.166a.75.75 0 01-1.06 0z" clipRule="evenodd" />
    </svg>
  );
};