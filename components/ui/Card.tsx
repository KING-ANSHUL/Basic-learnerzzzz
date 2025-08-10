import React, { ReactNode } from 'react';
import { ModuleStatus } from '../../types';
import { LockIcon } from './icons/LockIcon';

interface CardProps {
    title: string;
    description: string;
    status: ModuleStatus;
    icon: ReactNode;
    colorClasses: {
        bg: string;
        text: string;
        accent: string;
        accentHover: string;
        border: string;
        progressBg: string;
    };
    progress: number;
    total: number;
    onClick: () => void;
}

export const Card: React.FC<CardProps> = ({ title, description, status, icon, colorClasses, progress, total, onClick }) => {
    const isLocked = status === 'locked';
    const isCompleted = status === 'completed';
    const progressPercentage = total > 0 ? (progress / total) * 100 : 0;

    const cardStateClasses = isLocked 
        ? 'bg-slate-100 border-slate-200 cursor-not-allowed' 
        : `bg-white border-slate-200 ${!isCompleted ? 'hover:shadow-xl hover:-translate-y-1' : ''}`;

    return (
        <div 
            className={`w-full max-w-md p-5 rounded-2xl shadow-lg border transition-all duration-300 flex flex-col ${cardStateClasses}`}
            onClick={!isLocked ? onClick : undefined}
            role="button"
            aria-disabled={isLocked}
        >
            <div className="flex items-start gap-4">
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 ${isLocked ? 'bg-slate-300' : colorClasses.bg}`}>
                    {isLocked ? <LockIcon className="w-8 h-8 text-slate-500" /> : icon}
                </div>
                <div className="flex-grow">
                    <h2 className={`font-bold text-xl ${isLocked ? 'text-slate-500' : 'text-slate-800'}`}>{title}</h2>
                    <p className={`text-sm ${isLocked ? 'text-slate-400' : 'text-slate-500'}`}>{description}</p>
                </div>
            </div>

            <div className="mt-4">
                <div className="flex justify-between items-center mb-1">
                    <span className={`text-xs font-semibold ${isLocked ? 'text-slate-400' : 'text-slate-600'}`}>Progress</span>
                    <span className={`text-xs font-bold ${isLocked ? 'text-slate-500' : colorClasses.text}`}>{progress}/{total}</span>
                </div>
                <div className={`h-2 rounded-full ${isLocked ? 'bg-slate-300' : colorClasses.progressBg}`}>
                    <div className={`h-2 rounded-full ${isLocked ? '' : colorClasses.accent}`} style={{ width: `${progressPercentage}%` }}></div>
                </div>
            </div>

            <div className="mt-5">
                {isLocked ? (
                    <button disabled className="w-full text-center py-2.5 rounded-lg text-sm font-bold text-slate-500 border-2 border-dashed border-slate-300">
                        Complete previous modules to unlock
                    </button>
                ) : (
                    <button 
                        onClick={onClick}
                        className={`w-full text-center py-2.5 rounded-lg text-sm font-bold text-white transition-colors duration-200 ${colorClasses.accent} ${colorClasses.accentHover}`}
                    >
                        {isCompleted ? 'Review Module' : 'Start Module'}
                    </button>
                )}
            </div>
        </div>
    );
};
