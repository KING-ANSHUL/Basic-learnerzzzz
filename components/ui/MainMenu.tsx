import React from 'react';
import { useLearningContext } from '../../store/LearningContext';
import { Module } from '../../types';
import { Card } from './Card';
import { SpeakerWaveIcon } from './icons/SpeakerWaveIcon';
import { PencilSquareIcon } from './icons/PencilSquareIcon';
import { UserCircleIcon } from './icons/UserCircleIcon';
import { BookOpenIcon } from './icons/BookOpenIcon';

const moduleData = {
  [Module.LetterSounds]: {
    title: "Letter Sounds",
    description: "Learn the sounds of A to Z",
    icon: <SpeakerWaveIcon className="w-8 h-8 text-blue-500" />,
    colorClasses: {
      bg: 'bg-blue-100',
      text: 'text-blue-600',
      accent: 'bg-blue-500',
      accentHover: 'hover:bg-blue-600',
      border: 'border-blue-500',
      progressBg: 'bg-blue-100',
    }
  },
  [Module.WordFormation]: {
    title: "Word Formation",
    description: "Build words letter by letter",
    icon: <PencilSquareIcon className="w-8 h-8 text-green-500" />,
     colorClasses: {
      bg: 'bg-green-100',
      text: 'text-green-600',
      accent: 'bg-green-500',
      accentHover: 'hover:bg-green-600',
      border: 'border-green-500',
      progressBg: 'bg-green-100',
    }
  },
   [Module.AboutMe]: {
    title: "About Me",
    description: "Learn to introduce yourself",
    icon: <UserCircleIcon className="w-8 h-8 text-purple-500" />,
     colorClasses: {
      bg: 'bg-purple-100',
      text: 'text-purple-600',
      accent: 'bg-purple-500',
      accentHover: 'hover:bg-purple-600',
      border: 'border-purple-500',
      progressBg: 'bg-purple-100',
    }
  },
  [Module.ReadingStories]: {
    title: "Reading Stories",
    description: "Read and understand stories",
    icon: <BookOpenIcon className="w-8 h-8 text-orange-500" />,
     colorClasses: {
      bg: 'bg-orange-100',
      text: 'text-orange-600',
      accent: 'bg-orange-500',
      accentHover: 'hover:bg-orange-600',
      border: 'border-orange-500',
      progressBg: 'bg-orange-100',
    }
  },
};

export const MainMenu: React.FC = () => {
  const { state, dispatch } = useLearningContext();

  const handleCardClick = (module: Module) => {
    if (state.progress[module] !== 'locked') {
      dispatch({ type: 'START_MODULE', payload: module });
    }
  };

  const modules: Module[] = [Module.LetterSounds, Module.WordFormation, Module.AboutMe, Module.ReadingStories];

  return (
    <div className="flex flex-col items-center justify-center w-full p-4">
      <h1 className="text-3xl font-bold text-slate-700 mb-8">
        Ready for your reading adventure today?
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
        {modules.map((module) => {
            const data = moduleData[module];
            const progress = state.moduleProgress[module] || { current: 0, total: 0 };
            return (
              <Card
                key={module}
                title={data.title}
                description={data.description}
                status={state.progress[module]}
                icon={data.icon}
                colorClasses={data.colorClasses}
                progress={progress.current}
                total={progress.total}
                onClick={() => handleCardClick(module)}
              />
            );
        })}
      </div>
    </div>
  );
};
