export const speak = (text: string, onEnd?: () => void): void => {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.9;
    utterance.pitch = 1.2;
    
    if(onEnd) {
        utterance.onend = onEnd;
    }

    // Cancel any previous speech to prevent overlap
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  } else {
    console.warn('Speech Synthesis not supported in this browser.');
    // Fallback if speech is not supported but onEnd needs to be called
    if(onEnd) {
        onEnd();
    }
  }
};