import React, { useState, useEffect, useMemo } from 'react';
import learningService from '../../services/learningService';
import { useLearningContext } from '../../store/LearningContext';
import { StoryResponse, StoryWord, Module, ComprehensionOption } from '../../types';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { speak } from '../../utils/audio';
import { AnimatedLetter } from '../ui/AnimatedLetter';
import { CelebrationScreen } from '../ui/CelebrationScreen';
import { generateAiImage } from '../../utils/image';

type StoryStep = 
  | { type: 'learn_word', data: StoryWord }
  | { type: 'assemble_sentence', data: string[] }
  | { type: 'read_full_story' }
  | { type: 'comprehension' };


const WordLearningStep: React.FC<{word: StoryWord, onNext: () => void}> = ({ word, onNext }) => {
    const [showLetters, setShowLetters] = useState(false);
    useEffect(() => {
        speak(`Let's learn a new word: ${word.word}.`, () => {
            setTimeout(() => setShowLetters(true), 500);
        });
    }, [word]);

    return (
         <div className="text-center p-4">
            <h3 className="text-2xl font-bold mb-4">New Word:</h3>
            <div className="flex items-center justify-center space-x-1 h-20 mb-6">
                {showLetters ? (
                    word.letters.map((l, i) => <AnimatedLetter key={i} letter={l} delay={i * 100} colorClass="text-purple-700" />)
                ) : (
                    <h2 className="text-6xl font-black text-purple-700">{word.word}</h2>
                )}
            </div>
            {showLetters && (
                <button onClick={onNext} className="mt-4 px-6 py-3 bg-green-500 text-white font-bold rounded-full">Continue</button>
            )}
        </div>
    )
}

const SentenceAssemblyStep: React.FC<{sentence: string[], onNext: () => void}> = ({ sentence, onNext }) => {
    const [builtSentence, setBuiltSentence] = useState<string[]>([]);
    
    const wordOptions = useMemo(() => 
        sentence
            .map((word, index) => ({ word, id: index }))
            .sort(() => Math.random() - 0.5), 
        [sentence]
    );
    const [availableWords, setAvailableWords] = useState(wordOptions);

    useEffect(() => {
        speak(`Let's build a sentence!`);
    }, []);

    const handleWordClick = (clickedWord: { word: string, id: number }) => {
        const correctNextWord = sentence[builtSentence.length];
        if (clickedWord.word === correctNextWord) {
            const newSentence = [...builtSentence, clickedWord.word];
            setBuiltSentence(newSentence);
            
            setAvailableWords(currentWords => currentWords.filter(w => w.id !== clickedWord.id));

            if (newSentence.length === sentence.length) {
                speak("Great job!", () => setTimeout(onNext, 1000));
            } else {
                speak("That's right!");
            }
        } else {
            speak("Not quite, try another word.");
        }
    }

    return (
        <div className="text-center p-4 w-full flex flex-col">
            <h3 className="text-2xl font-bold mb-4">Build the Sentence:</h3>
            <div className="min-h-[6rem] w-full bg-purple-100 rounded-lg p-4 flex flex-wrap items-center justify-center gap-2 text-3xl font-bold text-purple-800">
                {builtSentence.join(' ') || <span className="text-slate-400 text-xl font-normal">Pick the first word</span>}
            </div>
            <div className="mt-6 flex-grow flex flex-wrap items-center justify-center gap-3">
                {availableWords.map((wordObj) => (
                    <button key={wordObj.id} onClick={() => handleWordClick(wordObj)} className="px-4 py-2 bg-white rounded-lg shadow-md text-2xl font-semibold hover:bg-purple-50 transition-all transform hover:scale-110">
                        {wordObj.word}
                    </button>
                ))}
            </div>
        </div>
    )
}

const ComprehensionStep: React.FC<{
    check: StoryResponse['comprehension_check'],
    onAnswer: (answer: string) => void,
    selectedAnswer: string | null,
    isCorrect: boolean | null,
}> = ({ check, onAnswer, selectedAnswer, isCorrect }) => {
    const [imageUrls, setImageUrls] = useState<Record<string, string>>({});

    useEffect(() => {
        let isActive = true;
        const fetchImages = async () => {
            const urls: Record<string, string> = {};
            for (const opt of check.options) {
                urls[opt.text] = await generateAiImage(opt.image_prompt);
            }
            if (isActive) {
                setImageUrls(urls);
            }
        };
        fetchImages();
        return () => { isActive = false };
    }, [check.options]);

    return (
        <div className="text-center p-4">
            <h3 className="text-2xl font-bold mb-4">{check.question}</h3>
            <div className="flex flex-col md:flex-row gap-4 justify-center">
                {check.options.map(opt => {
                    const isSelected = selectedAnswer === opt.text;
                    let borderColor = 'border-purple-300';
                    if (isSelected) {
                        borderColor = isCorrect ? 'border-green-500' : 'border-red-500';
                    }
                    return (
                        <div key={opt.text} onClick={() => onAnswer(opt.text)}
                            className={`p-4 rounded-2xl bg-white shadow-md border-4 cursor-pointer transition-all ${borderColor}`}>
                            <div className="rounded-lg mb-2 w-[200px] h-[150px] object-cover bg-slate-100 flex items-center justify-center">
                                {imageUrls[opt.text] ? 
                                    <img src={imageUrls[opt.text]} alt={opt.image_prompt} className="w-full h-full object-cover rounded-lg"/> :
                                    <LoadingSpinner />
                                }
                            </div>
                            <p className="text-xl font-semibold">{opt.text}</p>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export const ReadingStoriesModule: React.FC = () => {
    const { dispatch } = useLearningContext();
    const [story, setStory] = useState<StoryResponse | null>(null);
    const [storyIndex, setStoryIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [step, setStep] = useState(0);
    const [isComplete, setIsComplete] = useState(false);
    const [currentStepDetails, setCurrentStepDetails] = useState<StoryStep | null>(null);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

    const storySteps: StoryStep[] = useMemo(() => story ? [
        ...story.learning_sequence.map(w => ({ type: 'learn_word' as const, data: w })),
        ...story.sentence_assembly_tasks.map(s => ({ type: 'assemble_sentence' as const, data: s})),
        { type: 'read_full_story' },
        { type: 'comprehension' }
    ] : [], [story]);

    useEffect(() => {
        setIsLoading(true);
        dispatch({ type: 'UPDATE_PROGRESS', payload: { module: Module.ReadingStories, current: storyIndex }});
        learningService.getStory(storyIndex).then(data => {
            setStory(data);
            setIsLoading(false);
        });
    }, [storyIndex, dispatch]);

    useEffect(() => {
        if (story && storySteps.length > 0 && step < storySteps.length) {
            setCurrentStepDetails(storySteps[step]);
        }
    }, [story, step, storySteps]);

    const handleNext = () => {
        if (step < storySteps.length - 1) {
            setStep(s => s + 1);
        } else {
            setIsComplete(true);
        }
    };
    
    const handleComprehensionAnswer = (answer: string) => {
        if (!story || selectedAnswer !== null) return;
        setSelectedAnswer(answer);
        const correct = answer === story.comprehension_check.correct_answer;
        setIsCorrect(correct);
        speak(correct ? "That's right! Great job!" : "Good try! The correct answer is " + story.comprehension_check.correct_answer, () => {
            if (correct) {
                setTimeout(() => {
                    dispatch({ type: 'UPDATE_PROGRESS', payload: { module: Module.ReadingStories, current: storyIndex + 1 }});
                    setIsComplete(true)
                }, 1200);
            }
        });
    };

    const handleNextStory = () => {
        if (storyIndex < learningService.getTotalStories() - 1) {
            setStoryIndex(i => i + 1);
            setStep(0);
            setIsComplete(false);
            setSelectedAnswer(null);
            setIsCorrect(null);
        } else {
            dispatch({ type: 'COMPLETE_MODULE', payload: Module.ReadingStories });
        }
    };
    
    const handleReturnToMenu = () => {
        dispatch({ type: 'RETURN_TO_MENU' });
    };

    if (isLoading || !story || !currentStepDetails) return <LoadingSpinner />;

    if (isComplete) {
        const allStoriesDone = storyIndex >= learningService.getTotalStories() - 1;
        return (
            <CelebrationScreen message="You finished the story!" onNext={allStoriesDone ? handleReturnToMenu : handleNextStory} buttonText={allStoriesDone ? "Back to Menu" : "Read Another Story?"}>
                <button onClick={handleReturnToMenu} className="mt-4 px-6 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300">
                    Back to Main Menu
                </button>
            </CelebrationScreen>
        );
    }
    
    let content;
    switch (currentStepDetails.type) {
        case 'learn_word':
            content = <WordLearningStep word={currentStepDetails.data} onNext={handleNext} />;
            break;
        case 'assemble_sentence':
            content = <SentenceAssemblyStep sentence={currentStepDetails.data} onNext={handleNext} />;
            break;
        case 'read_full_story':
            speak(story.full_text, handleNext);
            content = (
                <div className="text-center p-4">
                    <h2 className="text-3xl font-bold mb-4">{story.story_title}</h2>
                    <p className="text-2xl leading-relaxed text-slate-700">{story.full_text}</p>
                    <p className="mt-6 text-purple-600 font-semibold animate-pulse">Listen to the story...</p>
                </div>
            )
            break;
        case 'comprehension':
            content = <ComprehensionStep check={story.comprehension_check} onAnswer={handleComprehensionAnswer} selectedAnswer={selectedAnswer} isCorrect={isCorrect} />;
            break;
        default:
            content = <LoadingSpinner />;
    }

    return (
        <div className="w-full max-w-3xl text-center bg-white p-8 rounded-3xl shadow-2xl border-4 border-purple-300 flex flex-col items-center justify-between min-h-[500px]">
           {content}
        </div>
    );
};