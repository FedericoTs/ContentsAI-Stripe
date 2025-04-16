import OpenAI from "openai";
import {
  Voice,
  VoiceSettings,
  generateStream,
  getVoices,
  play,
} from "elevenlabs";
import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai";

// Initialize the OpenAI client
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY || "",
  dangerouslyAllowBrowser: true, // Enable browser usage with caution
});

// ElevenLabs API key
const elevenLabsApiKey = import.meta.env.VITE_ELEVENLABS_API_KEY;

// Initialize the Google Generative AI client
const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(geminiApiKey);

/**
 * Generate content using OpenAI's GPT model
 */
export async function generateContent(
  prompt: string,
  options?: {
    model?: string;
    temperature?: number;
    maxTokens?: number;
  },
) {
  try {
    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: options?.model || "gpt-4o",
      temperature: options?.temperature || 0.7,
      max_tokens: options?.maxTokens || 1000,
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error("Error generating content with OpenAI:", error);
    throw error;
  }
}

/**
 * Transform content from one format to another
 */
export async function transformContent(content: string, targetFormat: string) {
  try {
    const prompt = `Transform the following content into ${targetFormat} format:\n\n${content}`;

    return await generateContent(prompt);
  } catch (error) {
    console.error("Error transforming content:", error);
    throw error;
  }
}

/**
 * Generate multiple content formats from a single input
 */
export async function generateMultipleFormats(
  content: string,
  formats: string[],
) {
  try {
    const results: Record<string, string> = {};

    for (const format of formats) {
      results[format] = await transformContent(content, format);
    }

    return results;
  } catch (error) {
    console.error("Error generating multiple formats:", error);
    throw error;
  }
}

/**
 * Get available ElevenLabs voices
 */
export async function getAvailableVoices() {
  try {
    const voices = await getVoices(elevenLabsApiKey);
    return voices;
  } catch (error) {
    console.error("Error fetching ElevenLabs voices:", error);
    throw error;
  }
}

/**
 * Convert text to speech using ElevenLabs API
 */
export async function textToSpeech(
  text: string,
  options?: {
    voiceId?: string;
    stability?: number;
    similarityBoost?: number;
    modelId?: string;
  },
) {
  try {
    // Default voice settings
    const voiceSettings: VoiceSettings = {
      stability: options?.stability || 0.5,
      similarityBoost: options?.similarityBoost || 0.75,
    };

    // Use default voice if not specified
    const voiceId = options?.voiceId || "21m00Tcm4TlvDq8ikWAM";
    const modelId = options?.modelId || "eleven_monolingual_v1";

    // Generate audio stream
    const audioStream = await generateStream(
      text,
      voiceId,
      voiceSettings,
      elevenLabsApiKey,
      modelId,
    );

    return audioStream;
  } catch (error) {
    console.error("Error generating speech with ElevenLabs:", error);
    throw error;
  }
}

/**
 * Play audio from ElevenLabs stream
 */
export async function playAudio(audioStream: ReadableStream) {
  try {
    await play(audioStream);
  } catch (error) {
    console.error("Error playing audio:", error);
    throw error;
  }
}

/**
 * Convert text to speech and play it immediately
 */
export async function speakText(
  text: string,
  options?: {
    voiceId?: string;
    stability?: number;
    similarityBoost?: number;
    modelId?: string;
  },
) {
  try {
    const audioStream = await textToSpeech(text, options);
    await playAudio(audioStream);
    return true;
  } catch (error) {
    console.error("Error speaking text:", error);
    throw error;
  }
}

/**
 * Generate content using Google's Gemini model
 */
export async function generateGeminiContent(
  prompt: string,
  options?: {
    model?: string;
    temperature?: number;
    maxTokens?: number;
  },
) {
  try {
    const model = options?.model || "gemini-pro";
    const generativeModel = genAI.getGenerativeModel({ model });

    const result = await generativeModel.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: options?.temperature || 0.7,
        maxOutputTokens: options?.maxTokens || 1000,
      },
    });

    const response = result.response;
    return response.text();
  } catch (error) {
    console.error("Error generating content with Gemini:", error);
    throw error;
  }
}

/**
 * Transform content using Gemini model
 */
export async function transformGeminiContent(
  content: string,
  targetFormat: string,
) {
  try {
    const prompt = `Transform the following content into ${targetFormat} format:\n\n${content}`;

    return await generateGeminiContent(prompt);
  } catch (error) {
    console.error("Error transforming content with Gemini:", error);
    throw error;
  }
}

/**
 * Generate multiple content formats using Gemini
 */
export async function generateMultipleGeminiFormats(
  content: string,
  formats: string[],
) {
  try {
    const results: Record<string, string> = {};

    for (const format of formats) {
      results[format] = await transformGeminiContent(content, format);
    }

    return results;
  } catch (error) {
    console.error("Error generating multiple formats with Gemini:", error);
    throw error;
  }
}

/**
 * Compare outputs between OpenAI and Gemini for the same prompt
 */
export async function compareAIOutputs(
  prompt: string,
  options?: {
    openaiModel?: string;
    geminiModel?: string;
    temperature?: number;
    maxTokens?: number;
  },
) {
  try {
    const [openaiResult, geminiResult] = await Promise.all([
      generateContent(prompt, {
        model: options?.openaiModel || "gpt-4o",
        temperature: options?.temperature || 0.7,
        maxTokens: options?.maxTokens || 1000,
      }),
      generateGeminiContent(prompt, {
        model: options?.geminiModel || "gemini-pro",
        temperature: options?.temperature || 0.7,
        maxTokens: options?.maxTokens || 1000,
      }),
    ]);

    return {
      openai: openaiResult,
      gemini: geminiResult,
    };
  } catch (error) {
    console.error("Error comparing AI outputs:", error);
    throw error;
  }
}

export { genAI };
export default openai;
