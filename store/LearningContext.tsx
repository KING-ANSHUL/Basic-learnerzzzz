import React, { createContext, useReducer, useContext, Dispatch, ReactNode, useEffect } from 'react';
import { Module, LearningProgress, ModuleStatus, ModuleProgress } from '../types';
import learningService from '../services/learningService';

interface AppState {
  progress: LearningProgress;
  moduleProgress: { [key in Module]?: ModuleProgress };
  currentModule: Module | null;
  completedWordFormationLetters: Set<string>;
}

const initialState: AppState = {
  progress: {
    [Module.LetterSounds]: 'active',
    [Module.WordFormation]: 'locked',
    [Module.AboutMe]: 'locked',
    [Module.ReadingStories]: 'locked',
  },
  moduleProgress: {
    [Module.LetterSounds]: { current: 0, total: learningService.getTotalLetters() },
    [Module.WordFormation]: { current: 0, total: learningService.getAlphabet().length },
    [Module.AboutMe]: { current: 0, total: learningService.getTotalAboutMeSteps() },
    [Module.ReadingStories]: { current: 0, total: learningService.getTotalStories() },
  },
  currentModule: null,
  completedWordFormationLetters: new Set(),
};

type Action =
  | { type: 'START_MODULE'; payload: Module }
  | { type: 'COMPLETE_MODULE'; payload: Module }
  | { type: 'RETURN_TO_MENU' }
  | { type: 'UPDATE_PROGRESS'; payload: { module: Module, current: number } }
  | { type: 'COMPLETE_WORD_FORMATION_LETTER', payload: string };

const learningReducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case 'START_MODULE':
      if (state.progress[action.payload] !== 'locked') {
        return { ...state, currentModule: action.payload };
      }
      return state;

    case 'UPDATE_PROGRESS':
        return {
            ...state,
            moduleProgress: {
                ...state.moduleProgress,
                [action.payload.module]: {
                    ...state.moduleProgress[action.payload.module]!,
                    current: action.payload.current
                }
            }
        };

    case 'COMPLETE_MODULE':
      const newProgress = { ...state.progress, [action.payload]: 'completed' as ModuleStatus };
      if (action.payload === Module.LetterSounds) {
        newProgress[Module.WordFormation] = 'active';
      } else if (action.payload === Module.WordFormation) {
        newProgress[Module.AboutMe] = 'active';
      } else if (action.payload === Module.AboutMe) {
        newProgress[Module.ReadingStories] = 'active';
      }
      
      return {
        ...state,
        progress: newProgress,
        currentModule: null,
      };

    case 'COMPLETE_WORD_FORMATION_LETTER':
        const newCompletedLetters = new Set(state.completedWordFormationLetters);
        newCompletedLetters.add(action.payload);
        const wordFormationProgress = {
            ...state.moduleProgress[Module.WordFormation]!,
            current: newCompletedLetters.size
        };

        return {
          ...state,
          completedWordFormationLetters: newCompletedLetters,
          moduleProgress: {
              ...state.moduleProgress,
              [Module.WordFormation]: wordFormationProgress
          }
      };

    case 'RETURN_TO_MENU':
      return { ...state, currentModule: null };
    default:
      return state;
  }
};

interface LearningContextProps {
  state: AppState;
  dispatch: Dispatch<Action>;
}

const LearningContext = createContext<LearningContextProps | undefined>(undefined);

export const LearningProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(learningReducer, initialState);

  return (
    <LearningContext.Provider value={{ state, dispatch }}>
      {children}
    </LearningContext.Provider>
  );
};

export const useLearningContext = (): LearningContextProps => {
  const context = useContext(LearningContext);
  if (!context) {
    throw new Error('useLearningContext must be used within a LearningProvider');
  }
  return context;
};
