import { LetterSoundResponse, WordFormationResponse, StoryResponse, AboutMeStep } from '../types';

// NOTE: This service simulates calls to a generative AI model like Google Gemini.
// In a real-world scenario, you would use the `@google/genai` SDK to make API calls.
// Here, we use static data to provide a complete, runnable frontend application.

const alphabetSounds: LetterSoundResponse[] = [
    { module: 1, letter: 'A', analogy_script: "This is the letter A. It makes the 'ah' sound.", image_prompt: "A simple, shiny red apple.", praise_script: "That's it! What a great 'ah' sound!" },
    { module: 1, letter: 'B', analogy_script: "This is the letter B. It makes the 'buh' sound.", image_prompt: "A simple, colorful bouncing ball.", praise_script: "Wonderful! That's a perfect 'buh' sound!" },
    { module: 1, letter: 'C', analogy_script: "This is the letter C. It makes the 'kuh' sound.", image_prompt: "A cute, cartoon cat curling up.", praise_script: "You got it! Such a clear 'kuh' sound!" },
    { module: 1, letter: 'D', analogy_script: "This is the letter D. It makes the 'duh' sound.", image_prompt: "A happy dog with a small shovel.", praise_script: "Fantastic 'duh' sound!" },
    { module: 1, letter: 'E', analogy_script: "This is the letter E. It makes the 'eh' sound.", image_prompt: "An elephant with big, flapping ears.", praise_script: "Excellent 'eh'!" },
    { module: 1, letter: 'F', analogy_script: "This is the letter F. It makes the 'fff' sound.", image_prompt: "A single, soft white feather floating down.", praise_script: "Fabulous 'fff' sound!" },
    { module: 1, letter: 'G', analogy_script: "This is the letter G. It makes the 'guh' sound.", image_prompt: "A single large green grape.", praise_script: "Great job!" },
    { module: 1, letter: 'H', analogy_script: "This is the letter H. It makes the 'huh' sound.", image_prompt: "A smiling cartoon hippo.", praise_script: "Hooray!" },
    { module: 1, letter: 'I', analogy_script: "This is the letter I. It makes the 'ih' sound.", image_prompt: "A friendly ladybug.", praise_script: "Incredible!" },
    { module: 1, letter: 'J', analogy_script: "This is the letter J. It makes the 'juh' sound.", image_prompt: "A wiggling block of jelly.", praise_script: "Just right!" },
    { module: 1, letter: 'K', analogy_script: "This is the letter K. It makes the 'kuh' sound.", image_prompt: "A colorful kite in the sky.", praise_script: "Super 'kuh' sound!" },
    { module: 1, letter: 'L', analogy_script: "This is the letter L. It makes the 'lll' sound.", image_prompt: "A swirly, rainbow lollipop.", praise_script: "Lovely!" },
    { module: 1, letter: 'M', analogy_script: "This is the letter M. It makes the 'mmm' sound.", image_prompt: "A few fluffy white marshmallows.", praise_script: "Marvelous 'mmm'!" },
    { module: 1, letter: 'N', analogy_script: "This is the letter N. It makes the 'nnn' sound.", image_prompt: "A small bird's nest with eggs.", praise_script: "Nice 'nnn'!" },
    { module: 1, letter: 'O', analogy_script: "This is the letter O. It makes the 'o' sound.", image_prompt: "A perfectly round orange.", praise_script: "Outstanding 'o'!" },
    { module: 1, letter: 'P', analogy_script: "This is the letter P. It makes the 'puh' sound.", image_prompt: "A playful penguin waddling.", praise_script: "Perfect 'puh'!" },
    { module: 1, letter: 'Q', analogy_script: "This is the letter Q. It makes the 'kwuh' sound.", image_prompt: "A cartoon queen with a gentle smile.", praise_script: "Quite right!" },
    { module: 1, letter: 'R', analogy_script: "This is the letter R. It makes the 'rrr' sound.", image_prompt: "A friendly toy robot.", praise_script: "Really good 'rrr'!" },
    { module: 1, letter: 'S', analogy_script: "This is the letter S. It makes the 'sss' sound.", image_prompt: "A smiling, green cartoon snake.", praise_script: "Super 'sss'!" },
    { module: 1, letter: 'T', analogy_script: "This is the letter T. It makes the 'tuh' sound.", image_prompt: "A tall green tree with a brown trunk.", praise_script: "Terrific 'tuh'!" },
    { module: 1, letter: 'U', analogy_script: "This is the letter U. It makes the 'uh' sound.", image_prompt: "A colorful umbrella.", praise_script: "Unbelievable!" },
    { module: 1, letter: 'V', analogy_script: "This is the letter V. It makes the 'vvv' sound.", image_prompt: "A small, friendly cartoon volcano.", praise_script: "Very good 'vvv'!" },
    { module: 1, letter: 'W', analogy_script: "This is the letter W. It makes the 'wuh' sound.", image_prompt: "A pink, happy cartoon worm.", praise_script: "Wonderful 'wuh'!" },
    { module: 1, letter: 'X', analogy_script: "This is the letter X. It makes the 'ks' sound.", image_prompt: "A brown cardboard box.", praise_script: "eXcellent!" },
    { module: 1, letter: 'Y', analogy_script: "This is the letter Y. It makes the 'yuh' sound.", image_prompt: "A yellow yo-yo.", praise_script: "Yes! That's it!" },
    { module: 1, letter: 'Z', analogy_script: "This is the letter Z. It makes the 'zzz' sound.", image_prompt: "A cute, fuzzy bumblebee flying.", praise_script: "Amazing! You learned all your letter sounds!" },
];

const wordData: Record<string, WordFormationResponse[]> = {
    'A': [
        { module: 2, letter_focus: 'A', task: 'learn_word', word: 'Apple', letters: ['A', 'p', 'p', 'l', 'e'], intro_script: "Our first 'A' word is Apple. It's a yummy fruit!", image_prompt: "A simple, shiny red apple" },
        { module: 2, letter_focus: 'A', task: 'learn_word', word: 'Ant', letters: ['A', 'n', 't'], intro_script: "This is an Ant. Ants are tiny and strong!", image_prompt: "A cute cartoon ant carrying a leaf" },
    ],
    'B': [
        { module: 2, letter_focus: 'B', task: 'learn_word', word: 'Ball', letters: ['B', 'a', 'l', 'l'], intro_script: "Let's learn the word Ball. You can bounce it!", image_prompt: "A colorful beach ball" },
        { module: 2, letter_focus: 'B', task: 'learn_word', word: 'Bed', letters: ['B', 'e', 'd'], intro_script: "This is a Bed. It's cozy for sleeping.", image_prompt: "A cozy bed with a pillow and blanket" },
    ],
    'C': [
        { module: 2, letter_focus: 'C', task: 'learn_word', word: 'Cat', letters: ['C', 'a', 't'], intro_script: "Our first 'C' word is Cat. Cats say meow!", image_prompt: "A cute cartoon cat" },
        { module: 2, letter_focus: 'C', task: 'learn_word', word: 'Car', letters: ['C', 'a', 'r'], intro_script: "This is a Car. It goes vroom vroom!", image_prompt: "A red toy car" },
    ],
    // Add more letters and words as needed to expand the app
};

const aboutMeData: AboutMeStep[] = [
    { part: "2A", task: "learn_word", word: "Hello", letters: ["H", "e", "l", "l", "o"], intro_script: "Let's learn our first word. The word is Hello." },
    { part: "2A", task: "learn_word", word: "my", letters: ["m", "y"], intro_script: "The next word is my." },
    { part: "2A", task: "learn_word", word: "name", letters: ["n", "a", "m", "e"], intro_script: "This word is name." },
    { part: "2A", task: "learn_word", word: "is", letters: ["i", "s"], intro_script: "And this word is is." },
    { part: "2A", task: "assemble_sentence", word_tiles: ["Hello", "my", "name", "is", "Reader"], contextual_lesson: "You did it! You have learned how to introduce yourself!" }
];


const stories: StoryResponse[] = [
    {
        module: 3,
        story_title: "My Pet Cat",
        full_text: "I see my cat. My cat is on the mat. My cat is happy.",
        learning_sequence: [
            { task: 'learn_word', word: 'cat', letters: ['c', 'a', 't'] },
            { task: 'learn_word', word: 'mat', letters: ['m', 'a', 't'] },
            { task: 'learn_word', word: 'happy', letters: ['h', 'a', 'p', 'p', 'y'] },
        ],
        sentence_assembly_tasks: [
            ["I", "see", "my", "cat", "."],
            ["My", "cat", "is", "on", "the", "mat", "."],
            ["My", "cat", "is", "happy", "."]
        ],
        comprehension_check: {
            question: "Where is the cat?",
            options: [
                { text: "On the mat", image_prompt: "A happy cat sitting on a colorful mat" },
                { text: "In a box", image_prompt: "A sad cat inside a cardboard box" },
            ],
            correct_answer: "On the mat"
        }
    },
    {
        module: 3,
        story_title: "The Big Red Ball",
        full_text: "I have a big red ball. I kick the ball. The ball is fun.",
        learning_sequence: [
            { task: 'learn_word', word: 'big', letters: ['b', 'i', 'g'] },
            { task: 'learn_word', word: 'red', letters: ['r', 'e', 'd'] },
            { task: 'learn_word', word: 'ball', letters: ['b', 'a', 'l', 'l'] },
            { task: 'learn_word', word: 'fun', letters: ['f', 'u', 'n'] },
        ],
        sentence_assembly_tasks: [
            ["I", "have", "a", "big", "red", "ball", "."],
            ["I", "kick", "the", "ball", "."],
            ["The", "ball", "is", "fun", "."]
        ],
        comprehension_check: {
            question: "What color is the ball?",
            options: [
                { text: "Blue", image_prompt: "A big blue ball" },
                { text: "Red", image_prompt: "A big red ball" },
            ],
            correct_answer: "Red"
        }
    },
];

const api = {
  getLetterSound: (index: number): Promise<LetterSoundResponse> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(alphabetSounds[index]);
      }, 500);
    });
  },
  getWordsForLetter: (letter: string): Promise<WordFormationResponse[]> => {
      return new Promise((resolve) => {
          setTimeout(() => {
              const upperCaseLetter = letter.toUpperCase();
              if (wordData[upperCaseLetter]) {
                resolve(wordData[upperCaseLetter]);
              } else {
                resolve([]);
              }
          }, 500);
      })
  },
  getAboutMeSteps: (): Promise<AboutMeStep[]> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(aboutMeData);
        }, 500);
    });
  },
  getStory: (index: number): Promise<StoryResponse> => {
      return new Promise((resolve) => {
          setTimeout(() => {
              resolve(stories[index % stories.length]);
          }, 500);
      });
  },
  getTotalLetters: (): number => alphabetSounds.length,
  getAlphabet: (): string[] => Object.keys(wordData),
  getTotalAboutMeSteps: (): number => aboutMeData.length,
  getTotalStories: (): number => stories.length
};

export default api;