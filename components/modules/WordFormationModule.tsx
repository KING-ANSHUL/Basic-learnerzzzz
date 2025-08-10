import React, { useState, useEffect } from 'react';
import learningService from '../../services/learningService';
import { useLearningContext } from '../../store/LearningContext';
import { WordFormationResponse, Module } from '../../types';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { speak } from '../../utils/audio';
import { AnimatedLetter } from '../ui/AnimatedLetter';
import { CelebrationScreen } from '../ui/CelebrationScreen';
import { ChevronRightIcon } from '../ui/icons/ChevronRightIcon';
import { generateAiImage } from '../../utils/image';

const WordLearningView: React.FC<{
    words: WordFormationResponse[];
    onComplete: (letter: string) => void;
}> = ({ words, onComplete }) => {
    const [wordIndex, setWordIndex] = useState(0);
    const [showLetters, setShowLetters] = useState(false);
    const [imageUrl, setImageUrl] = useState('');

    const currentWord = words[wordIndex];

    useEffect(() => {
        setShowLetters(false);
        setImageUrl('');
        let isActive = true;

        if (currentWord) {
            speak(currentWord.intro_script, () => {
                if (isActive) setTimeout(() => setShowLetters(true), 500);
            });
            generateAiImage(currentWord.image_prompt).then(img => {
                if(isActive) setImageUrl(img);
            });
        }
        return () => { isActive = false; }
    }, [wordIndex, currentWord]);

    const handleNextWord = () => {
        if (wordIndex < words.length - 1) {
            setWordIndex(prev => prev + 1);
        } else {
            onComplete(words[0].letter_focus);
        }
    };

    if (!currentWord) return <LoadingSpinner />;

    return (
        <div className="relative w-full max-w-2xl text-center bg-white p-8 rounded-3xl shadow-2xl border-4 border-yellow-300 flex flex-col items-center justify-between min-h-[500px]">
             <div className="flex-grow flex flex-col items-center justify-center">
                <div className="mb-6 rounded-2xl shadow-md w-full max-w-[400px] h-[225px] bg-slate-100 flex items-center justify-center">
                    {imageUrl ? 
                        <img src={imageUrl} alt={currentWord.image_prompt} className="w-full h-full object-cover rounded-2xl"/> : 
                        <LoadingSpinner/>
                    }
                </div>
                
                <div className="flex items-center justify-center space-x-2 h-24">
                   {showLetters ? (
                       currentWord.letters.map((letter, index) => (
                           <AnimatedLetter key={index} letter={letter} delay={index * 100} colorClass="text-yellow-700" />
                       ))
                   ) : (
                       <h2 className="text-7xl font-black text-yellow-800">{currentWord.word}</h2>
                   )}
                </div>
                 <p className="mt-4 text-xl md:text-2xl text-slate-600 font-semibold">{currentWord.intro_script}</p>
            </div>
            
            {showLetters && (
                <button 
                    onClick={handleNextWord} 
                    className="absolute top-1/2 -right-4 md:-right-16 transform -translate-y-1/2 w-16 h-16 bg-yellow-500 text-white rounded-full shadow-lg hover:bg-yellow-600 flex items-center justify-center z-10"
                    aria-label={wordIndex < words.length - 1 ? 'Next Word' : 'Finish Letter'}
                >
                    <ChevronRightIcon className="w-10 h-10" />
                </button>
            )}
        </div>
    )
};


const AlphabetGrid: React.FC<{ onSelectLetter: (letter: string) => void }> = ({ onSelectLetter }) => {
    const { state } = useLearningContext();
    const alphabet = learningService.getAlphabet();
    return (
         <div className="w-full max-w-3xl text-center bg-white p-8 rounded-3xl shadow-2xl border-4 border-yellow-300">
             <h2 className="text-3xl font-black text-yellow-800 mb-2">Let's learn some words!</h2>
             <p className="text-xl text-slate-600 mb-6">Pick any letter to start.</p>
            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-4">
                {alphabet.map(letter => {
                    const isCompleted = state.completedWordFormationLetters.has(letter);
                    return (
                        <button
                            key={letter}
                            onClick={() => onSelectLetter(letter)}
                            className={`flex items-center justify-center text-3xl font-bold p-4 rounded-xl aspect-square transition-transform duration-200 transform hover:scale-110
                                ${isCompleted 
                                    ? 'bg-green-200 text-green-700 border-2 border-green-400' 
                                    : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                                }`}
                        >
                            {letter}
                        </button>
                    )
                })}
            </div>
        </div>
    );
};

export const WordFormationModule: React.FC = () => {
    const { state, dispatch } = useLearningContext();
    const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
    const [words, setWords] = useState<WordFormationResponse[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isCelebrating, setIsCelebrating] = useState(false);
    const [completedLetter, setCompletedLetter] = useState<string|null>(null);

    const handleSelectLetter = (letter: string) => {
        setIsLoading(true);
        setSelectedLetter(letter);
        learningService.getWordsForLetter(letter).then(data => {
            setWords(data);
            setIsLoading(false);
        });
    };

    const handleCompleteLetter = (letter: string) => {
        if (!state.completedWordFormationLetters.has(letter)) {
            dispatch({ type: 'COMPLETE_WORD_FORMATION_LETTER', payload: letter });
        }
        setCompletedLetter(letter);
        setIsCelebrating(true);
    };

    const backToGrid = () => {
        setIsCelebrating(false);
        setSelectedLetter(null);
        setWords([]);
        setCompletedLetter(null);
    };

    const handleFinishModule = () => {
        dispatch({ type: 'COMPLETE_MODULE', payload: Module.WordFormation });
    };
    
    const handleReturnToMenu = () => {
        dispatch({ type: 'RETURN_TO_MENU' });
    };

    if (isLoading) return <LoadingSpinner />;
    if (isCelebrating) return <CelebrationScreen message={`You learned so many '${completedLetter}' words!`} onNext={backToGrid} />;

    const canCompleteModule = state.completedWordFormationLetters.size >= 3;

    return (
        <>
            {selectedLetter && words.length > 0 ? (
                <WordLearningView words={words} onComplete={handleCompleteLetter} />
            ) : (
                <div className="flex flex-col items-center">
                    <AlphabetGrid onSelectLetter={handleSelectLetter} />
                    <div className="mt-8 flex items-center gap-4">
                        <button onClick={handleReturnToMenu} className="px-6 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300">
                            Back to Main Menu
                        </button>
                        {canCompleteModule && (
                             <button onClick={handleFinishModule} className="px-6 py-2 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600">
                                Finish Module
                            </button>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};