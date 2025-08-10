import React from 'react';
import { useLearningContext } from '../../store/LearningContext';
import { Module } from '../../types';
import { CelebrationScreen } from '../ui/CelebrationScreen';

export const AboutMeModule: React.FC = () => {
    const { dispatch } = useLearningContext();
    const [isComplete, setIsComplete] = React.useState(false);

    const handleComplete = () => {
        // In a real implementation, this would be called after all steps are done.
        dispatch({ type: 'UPDATE_PROGRESS', payload: { module: Module.AboutMe, current: 4 } }); // Assuming 4 steps
        setIsComplete(true);
    };

    const handleFinish = () => {
        dispatch({ type: 'COMPLETE_MODULE', payload: Module.AboutMe });
    };

    if (isComplete) {
        return <CelebrationScreen message="You learned to introduce yourself!" onNext={handleFinish} />;
    }

    return (
        <div className="w-full max-w-2xl text-center bg-white p-8 rounded-3xl shadow-2xl border-4 border-purple-300 flex flex-col items-center justify-center min-h-[500px]">
            <h1 className="text-4xl font-bold text-purple-700 mb-4">About Me</h1>
            <p className="text-xl text-slate-600 mb-8">This module is under construction.</p>
            <p className="text-slate-500 mb-8">Click the button below to mark it as complete for now.</p>
            <button
                onClick={handleComplete}
                className="px-8 py-4 bg-green-500 text-white font-bold text-2xl rounded-full shadow-lg hover:bg-green-600"
            >
                Complete Module
            </button>
        </div>
    );
};
