import { GoogleGenAI } from "@google/genai";

// Ensure the API key is available from the environment variables
const apiKey = process.env.API_KEY;
if (!apiKey) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey });

const imageGenerationConfig = {
    numberOfImages: 1,
    outputMimeType: 'image/jpeg',
    aspectRatio: '4:3' as const,
};

const fallbackImageUrl = 'https://via.placeholder.com/400x300?text=Image+not+available';
let imageCache = new Map<string, string>();

/**
 * Generates an AI image from a prompt using the Gemini API.
 * It caches results to avoid re-generating the same image.
 * @param prompt - The descriptive text for the image.
 * @returns A promise that resolves to a base64 data URL or a fallback URL.
 */
export const generateAiImage = async (prompt: string): Promise<string> => {
    if (imageCache.has(prompt)) {
        return imageCache.get(prompt)!;
    }

    try {
        const response = await ai.models.generateImages({
            model: 'imagen-3.0-generate-002',
            prompt: `A simple, cute, friendly cartoon illustration for a child learning to read: ${prompt}`,
            config: imageGenerationConfig,
        });

        if (response.generatedImages && response.generatedImages.length > 0) {
            const base64ImageBytes = response.generatedImages[0].image.imageBytes;
            const imageUrl = `data:image/jpeg;base64,${base64ImageBytes}`;
            imageCache.set(prompt, imageUrl);
            return imageUrl;
        }
        
        console.warn('AI image generation returned no images for prompt:', prompt);
        return fallbackImageUrl;

    } catch (error) {
        console.error('Error generating AI image for prompt:', prompt, error);
        return fallbackImageUrl;
    }
};