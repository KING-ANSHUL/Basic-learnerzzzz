import React from 'react';
import { LearningProvider, useLearningContext } from './store/LearningContext';
import { MainMenu } from './components/ui/MainMenu';
import { Module } from './types';
import { LetterSoundsModule } from './components/modules/LetterSoundsModule';
import { WordFormationModule } from './components/modules/WordFormationModule';
import { ReadingStoriesModule } from './components/modules/ReadingStoriesModule';
import { AboutMeModule } from './components/modules/AboutMeModule';
import { ArrowLeftIcon } from './components/ui/icons/ArrowLeftIcon';

const AppContent: React.FC = () => {
    const { state, dispatch } = useLearningContext();

    const renderModule = () => {
        switch (state.currentModule) {
            case Module.LetterSounds:
                return <LetterSoundsModule />;
            case Module.WordFormation:
                return <WordFormationModule />;
            case Module.AboutMe:
                return <AboutMeModule />;
            case Module.ReadingStories:
                return <ReadingStoriesModule />;
            default:
                return <MainMenu />;
        }
    };

    const handleBackToMenu = () => {
        dispatch({ type: 'RETURN_TO_MENU' });
    };

    const showHeader = state.currentModule !== null;

    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center p-4">
            {showHeader && (
                <header className="absolute top-0 left-0 w-full p-4 z-10">
                    <button 
                        onClick={handleBackToMenu}
                        className="w-12 h-12 flex items-center justify-center bg-white/70 backdrop-blur-sm rounded-full text-blue-700 shadow-md hover:bg-white transition-all"
                        aria-label="Back to main menu"
                    >
                        <ArrowLeftIcon className="w-6 h-6" />
                    </button>
                </header>
            )}
            <main className="flex-grow flex items-center justify-center w-full max-w-5xl mx-auto">
                {renderModule()}
            </main>
        </div>
    );
};

const App: React.FC = () => {
    return (
        <LearningProvider>
            <AppContent />
        </LearningProvider>
    );
};

export default App;