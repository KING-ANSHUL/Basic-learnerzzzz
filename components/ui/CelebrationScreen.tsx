import React, { ReactNode } from 'react';
import { SparkleIcon } from './icons/SparkleIcon';

interface CelebrationScreenProps {
  message: string;
  onNext: () => void;
  buttonText?: string;
  children?: ReactNode;
}

export const CelebrationScreen: React.FC<CelebrationScreenProps> = ({ message, onNext, buttonText = "Continue", children }) => {
  return (
    <div className="relative w-full max-w-lg text-center bg-white p-8 rounded-3xl shadow-2xl border-4 border-yellow-400 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
            {[...Array(10)].map((_, i) => (
                 <SparkleIcon key={i} className="absolute text-yellow-300 animate-pulse" style={{
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    width: `${Math.random() * 20 + 20}px`,
                    height: `${Math.random() * 20 + 20}px`,
                    animationDelay: `${Math.random() * 2}s`,
                    animationDuration: '2s'
                 }} />
            ))}
        </div>
        <div className="relative z-10 flex flex-col items-center">
            <h2 className="text-4xl font-black text-yellow-800 mb-4 animate-bounce">{message}</h2>
            <p className="text-xl text-slate-600 mb-8">You're doing an amazing job!</p>
            <button
                onClick={onNext}
                className="px-8 py-4 bg-green-500 text-white font-bold text-2xl rounded-full shadow-lg hover:bg-green-600 transform hover:scale-105 transition-transform duration-300"
            >
                {buttonText}
            </button>
            {children && <div className="mt-4">{children}</div>}
        </div>
    </div>
  );
};