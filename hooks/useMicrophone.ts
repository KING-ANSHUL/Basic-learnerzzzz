import { useState, useEffect, useCallback, useRef } from 'react';

export const useMicrophone = (onSoundDetected: () => void) => {
    const [isListening, setIsListening] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const animationFrameRef = useRef<number | null>(null);

    const stopListening = useCallback(() => {
        if (animationFrameRef.current !== null) {
            cancelAnimationFrame(animationFrameRef.current);
            animationFrameRef.current = null;
        }
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
            // Do not close the context, just stop listening to allow reuse
        }
        setIsListening(false);
    }, []);

    const checkForSound = useCallback(() => {
        if (!analyserRef.current || !isListening) return;
        
        const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
        analyserRef.current.getByteFrequencyData(dataArray);
        
        let sum = 0;
        for(let i = 0; i < dataArray.length; i++) {
            sum += dataArray[i];
        }
        const average = sum / dataArray.length;
        
        // Threshold can be adjusted. A simple "is there any sound" check.
        if (average > 2) { 
            onSoundDetected();
        } else {
            animationFrameRef.current = requestAnimationFrame(checkForSound);
        }
    }, [onSoundDetected, isListening]);

    const startListening = useCallback(async () => {
        if (isListening) return;
        
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            streamRef.current = stream;
            
            if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
                audioContextRef.current = new AudioContext();
            }
            const context = audioContextRef.current;
            
            const source = context.createMediaStreamSource(stream);
            const analyser = context.createAnalyser();
            analyser.fftSize = 256;
            source.connect(analyser);
            analyserRef.current = analyser;
            
            setIsListening(true);
            setError(null);
            
            animationFrameRef.current = requestAnimationFrame(checkForSound);
            
        } catch (err) {
            setError('Microphone access was denied. Please allow microphone access to continue.');
            console.error('Error accessing microphone:', err);
        }
    }, [isListening, checkForSound]);

    useEffect(() => {
        // Cleanup on unmount
        return () => {
             if (animationFrameRef.current !== null) {
                cancelAnimationFrame(animationFrameRef.current);
            }
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }
            if (audioContextRef.current && audioContextRef.current.state === 'running') {
                audioContextRef.current.close();
            }
        };
    }, []);

    return { startListening, stopListening, isListening, error };
};