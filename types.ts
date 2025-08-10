export enum Module {
  LetterSounds = 'LetterSounds',
  WordFormation = 'WordFormation',
  AboutMe = 'AboutMe',
  ReadingStories = 'ReadingStories',
}

export type ModuleStatus = 'locked' | 'active' | 'completed';

export interface ModuleProgress {
  current: number;
  total: number;
}

export interface LearningProgress {
  [Module.LetterSounds]: ModuleStatus;
  [Module.WordFormation]: ModuleStatus;
  [Module.AboutMe]: ModuleStatus;
  [Module.ReadingStories]: ModuleStatus;
}

// AI Response Types

// Module 1: Letter Sounds
export interface LetterSoundResponse {
  module: 1;
  letter: string;
  analogy_script: string;
  image_prompt: string;
  praise_script: string;
}

// Module 2: Word Formation
export interface WordFormationResponse {
  module: 2;
  letter_focus: string;
  task: 'learn_word';
  word: string;
  letters: string[];
  intro_script: string;
  image_prompt: string;
}

// Module "About Me"
export interface AboutMeStep {
    part: string;
    task: 'learn_word' | 'assemble_sentence';
    word?: string;
    letters?: string[];
    intro_script?: string;
    word_tiles?: string[];
    contextual_lesson?: string;
}

// Module 3: Reading Stories
export interface StoryWord {
  task: 'learn_word';
  word: string;
  letters: string[];
}

export interface ComprehensionOption {
  text: string;
  image_prompt: string;
}

export interface ComprehensionCheck {
  question: string;
  options: ComprehensionOption[];
  correct_answer: string;
}

export interface StoryResponse {
  module: 3;
  story_title: string;
  full_text: string;
  learning_sequence: StoryWord[];
  sentence_assembly_tasks: string[][];
  comprehension_check: ComprehensionCheck;
}
