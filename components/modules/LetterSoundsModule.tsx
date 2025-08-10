import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useLearningContext } from '../../store/LearningContext';
import learningService from '../../services/learningService';
import { LetterSoundResponse, Module } from '../../types';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { CelebrationScreen } from '../ui/CelebrationScreen';
import { speak } from '../../utils/audio';
import { useMicrophone } from '../../hooks/useMicrophone';
import { ChevronRightIcon } from '../ui/icons/ChevronRightIcon';
import { MicrophoneIcon } from '../ui/icons/MicrophoneIcon';
import { generateAiImage } from '../../utils/image';

const extractSound = (script: string): string => {
    const match = script.match(/'([^']*)'/);
    return match ? match[1] : '';
};

export const LetterSoundsModule: React.FC = () => {
    const { dispatch } = useLearningContext();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [lesson, setLesson] = useState<LetterSoundResponse | null>(null);
    const [imageUrl, setImageUrl] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);
    const [isComplete, setIsComplete] = useState(false);
    const [showPraise, setShowPraise] = useState(false);
    const [isReadyToListen, setIsReadyToListen] = useState(false);
    
    const handleSoundDetected = useCallback(() => {
        if (lesson && !showPraise) {
            stopListening();
            setShowPraise(true);
            speak(lesson.praise_script);
        }
    }, [lesson, showPraise]);

    const { startListening, stopListening, isListening, error: micError } = useMicrophone(handleSoundDetected);
    
    const sound = useMemo(() => lesson ? extractSound(lesson.analogy_script) : '', [lesson]);

    useEffect(() => {
        setIsLoading(true);
        setShowPraise(false);
        setIsReadyToListen(false);
        stopListening();

        dispatch({ type: 'UPDATE_PROGRESS', payload: { module: Module.LetterSounds, current: currentIndex } });

        let isActive = true;

        learningService.getLetterSound(currentIndex).then(async (data) => {
            if (!isActive) return;
            setLesson(data);
            speak(data.analogy_script, () => {
                if (isActive) setIsReadyToListen(true);
            });
            const img = await generateAiImage(data.image_prompt);
            if (isActive) {
                setImageUrl(img);
                setIsLoading(false);
            }
        });
        
        return () => {
            isActive = false;
            stopListening();
        }
    }, [currentIndex, dispatch]);

    const handleNext = () => {
        const totalLetters = learningService.getTotalLetters();
        if (currentIndex < totalLetters - 1) {
            setCurrentIndex(prev => prev + 1);
        } else {
            dispatch({ type: 'UPDATE_PROGRESS', payload: { module: Module.LetterSounds, current: totalLetters } });
            setIsComplete(true);
        }
    };

    const handleFinish = () => {
        dispatch({ type: 'COMPLETE_MODULE', payload: Module.LetterSounds });
    };

    if (isComplete) {
        return <CelebrationScreen message="Wow! You've learned all your letter sounds!" onNext={handleFinish} />;
    }

    if (isLoading || !lesson) {
        return (
            <div className="w-full max-w-2xl text-center bg-white p-8 rounded-3xl shadow-2xl border-4 border-blue-300 flex flex-col items-center justify-center min-h-[600px]">
                <LoadingSpinner />
            </div>
        );
    }

    return (
        <div className="relative w-full max-w-2xl text-center bg-white p-8 rounded-3xl shadow-2xl border-4 border-blue-300 flex flex-col items-center justify-between min-h-[600px]">
            <div className="flex-grow flex flex-col items-center justify-center">
                <div className="text-9xl md:text-[200px] font-black text-blue-600 drop-shadow-lg animate-fade-in">{lesson.letter}</div>
                
                <div className="my-6 rounded-2xl shadow-lg border border-slate-200 bg-slate-50 w-full max-w-[400px] overflow-hidden">
                    {imageUrl ? 
                        <img src={imageUrl} alt={lesson.image_prompt} className="w-full h-[225px] object-cover" /> : 
                        <div className="w-full h-[225px] flex items-center justify-center"><LoadingSpinner/></div>
                    }
                </div>

                {micError && <p className="mt-4 text-sm text-red-500">{micError}</p>}
                
                <div className="mt-6 flex flex-col items-center gap-2 min-h-[120px]">
                    { !showPraise && (
                        <>
                           <p className={`text-lg font-bold transition-opacity duration-500 ${isReadyToListen ? 'opacity-100 text-blue-600' : 'opacity-0'}`}>
                             {isListening ? 'Listening...' : `Make the '${sound}' sound!`}
                           </p>
                            <button 
                                onClick={startListening} 
                                disabled={!isReadyToListen || isListening}
                                className={`w-20 h-20 rounded-full flex items-center justify-center text-white transition-all duration-300 ease-in-out transform hover:scale-110 disabled:scale-100 disabled:bg-slate-300 disabled:cursor-not-allowed
                                ${isListening ? 'bg-red-500 animate-pulse' : 'bg-blue-500'}`}
                                aria-label="Start listening"
                            >
                                <MicrophoneIcon className="w-10 h-10" />
                            </button>
                        </>
                    )}

                    {showPraise && (
                         <div className="mt-4 p-4 bg-green-100 text-green-700 font-bold rounded-lg text-xl">
                            {lesson.praise_script}
                        </div>
                    )}
                </div>
            </div>
            
            {showPraise && (
                <button 
                    onClick={handleNext} 
                    className="absolute top-1/2 -right-4 md:-right-16 transform -translate-y-1/2 w-16 h-16 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 flex items-center justify-center z-10 animate-fade-in"
                    aria-label="Next letter"
                >
                    <ChevronRightIcon className="w-10 h-10" />
                </button>
            )}
        </div>
    );
};