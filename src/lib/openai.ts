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
    if (!elevenLabsApiKey) {
      throw new Error("ElevenLabs API key is not configured");
    }

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
 * Convert text to speech using OpenAI API
 */
export async function openAITextToSpeech(
  text: string,
  options?: {
    voice?: string;
    model?: string;
    responseFormat?: string;
    speed?: number;
  },
) {
  try {
    if (!openai.apiKey) {
      throw new Error("OpenAI API key is not configured");
    }

    // Map voice types to OpenAI voice options
    const voiceMap: Record<string, string> = {
      "male-1": "onyx",
      "male-2": "echo",
      "female-1": "nova",
      "female-2": "shimmer",
      neutral: "alloy",
    };

    // Default options
    const voice = voiceMap[options?.voice || ""] || "alloy";
    const model = options?.model || "tts-1";
    const responseFormat = options?.responseFormat || "mp3";
    const speed = options?.speed || 1.0;

    // Call OpenAI API to generate speech
    const response = await openai.audio.speech.create({
      model: model,
      voice: voice,
      input: text,
      response_format: responseFormat,
      speed: speed,
    });

    // Convert the response to a blob URL that can be used in an audio element
    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);

    return {
      audioUrl,
      format: responseFormat,
    };
  } catch (error) {
    console.error("Error generating speech with OpenAI:", error);
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

/**
 * Generate a detailed image prompt based on content
 */
export async function generateImagePrompt(
  content: string,
  style: string,
  options?: {
    model?: string;
    temperature?: number;
    maxTokens?: number;
  },
) {
  try {
    const prompt = `Create a detailed image generation prompt for DALL-E based on this content: "${content}". 
    The image should be in ${style} style and suitable for professional marketing. 
    Focus on creating a visually striking image that captures the essence of the content. 
    Keep the prompt under 100 words.`;

    return await generateContent(prompt, options);
  } catch (error) {
    console.error("Error generating image prompt:", error);
    throw error;
  }
}

/**
 * Generate images using OpenAI's DALL-E model
 */
export async function generateImage(
  prompt: string,
  options?: {
    model?: string;
    n?: number;
    size?: string;
    quality?: string;
    style?: string;
    referenceImages?: Array<{
      image: File | string;
      tag: string;
      weight: number;
    }>;
  },
) {
  try {
    if (!openai.apiKey) {
      throw new Error("OpenAI API key is not configured");
    }

    // Default options
    const model = options?.model || "dall-e-3";
    const n = options?.n || 1;
    const size = options?.size || "1024x1024";
    const quality = options?.quality || "standard";
    const style = options?.style || "vivid";
    const referenceImages = options?.referenceImages || [];

    // Validate prompt length - DALL-E has a maximum prompt length
    const maxPromptLength = 4000; // Maximum characters for DALL-E 3
    const truncatedPrompt =
      prompt.length > maxPromptLength
        ? prompt.substring(0, maxPromptLength - 3) + "..."
        : prompt;

    // Enhance the prompt with reference image descriptions
    let enhancedPrompt = truncatedPrompt;

    if (referenceImages.length > 0) {
      // Add reference image descriptions to the prompt
      const referenceDescriptions = referenceImages
        .map((ref) => {
          const weightDescription =
            ref.weight >= 80
              ? "strongly"
              : ref.weight >= 50
                ? "moderately"
                : "slightly";

          switch (ref.tag) {
            case "brand":
              return `Use this brand identity reference ${weightDescription}: [Brand Reference]`;
            case "product":
              return `Include this product in the image ${weightDescription}: [Product Reference]`;
            case "background":
              return `Use this as a background reference ${weightDescription}: [Background Reference]`;
            case "style":
              return `Apply this artistic style ${weightDescription}: [Style Reference]`;
            case "color":
              return `Use this color palette ${weightDescription}: [Color Reference]`;
            case "layout":
              return `Follow this layout structure ${weightDescription}: [Layout Reference]`;
            case "mood":
              return `Capture this mood/atmosphere ${weightDescription}: [Mood Reference]`;
            case "person":
              return `Include this person/character ${weightDescription}: [Person Reference]`;
            default:
              return `Use this reference image ${weightDescription}: [Reference]`;
          }
        })
        .join("\n");

      enhancedPrompt = `${truncatedPrompt}\n\nReference Images:\n${referenceDescriptions}`;

      console.log(
        `Generating image with DALL-E ${model} using ${referenceImages.length} reference images. Enhanced prompt length: ${enhancedPrompt.length} chars`,
      );
    } else {
      console.log(
        `Generating image with DALL-E ${model}. Prompt length: ${truncatedPrompt.length} chars`,
      );
    }

    // For DALL-E 3, we can't directly use reference images in the API yet
    // Instead, we've enhanced the prompt with descriptions
    // In a production environment, you might want to use a different approach
    // such as embedding the images or using a different model that supports reference images

    // Call OpenAI API to generate images
    const response = await openai.images.generate({
      model,
      prompt: enhancedPrompt,
      n,
      size: size as any,
      quality: quality as any,
      style: style as any,
      response_format: "url", // Ensure we get URLs back
    });

    console.log(`Successfully generated ${response.data.length} images`);
    return response.data;
  } catch (error: any) {
    // Enhanced error logging
    console.error("Error generating images with OpenAI:", error);

    // Check for specific OpenAI API errors
    if (error.response) {
      console.error("OpenAI API Error Details:", {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
      });

      // Handle rate limiting
      if (error.response.status === 429) {
        console.error(
          "Rate limit exceeded. Consider implementing retry logic.",
        );
      }

      // Handle content policy violations
      if (
        error.response.status === 400 &&
        error.response.data?.error?.code === "content_policy_violation"
      ) {
        console.error(
          "Content policy violation. The prompt may contain prohibited content.",
        );
      }
    }

    throw error;
  }
}

/**
 * Generate images using OpenAI's DALL-E model with reference images
 * This is a more advanced version that will be implemented when OpenAI
 * officially supports reference images in their API
 */
export async function generateImageWithReferences(
  prompt: string,
  referenceImages: Array<{
    image: File | string;
    tag: string;
    weight: number;
  }>,
  options?: {
    model?: string;
    n?: number;
    size?: string;
    quality?: string;
    style?: string;
  },
) {
  try {
    if (!openai.apiKey) {
      throw new Error("OpenAI API key is not configured");
    }

    // Default options
    const model = options?.model || "dall-e-3";
    const n = options?.n || 1;
    const size = options?.size || "1024x1024";
    const quality = options?.quality || "standard";
    const style = options?.style || "vivid";

    // For now, we'll use the enhanced prompt approach
    // In the future, when OpenAI supports reference images directly,
    // this function will be updated to use the new API

    return generateImage(prompt, {
      ...options,
      referenceImages,
    });
  } catch (error: any) {
    console.error("Error generating images with references:", error);
    throw error;
  }
}

export { genAI };
export default openai;
