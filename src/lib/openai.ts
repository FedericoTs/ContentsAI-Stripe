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
    enhancedPromptEngineering?: boolean;
  },
) {
  try {
    if (!openai.apiKey) {
      throw new Error("OpenAI API key is not configured");
    }

    // Default options with improved defaults for marketing images
    const model = options?.model || "dall-e-3";
    const n = options?.n || 1;
    const size = options?.size || "1792x1024"; // Higher resolution default (16:9 aspect ratio)
    const quality = options?.quality || "hd"; // HD quality default
    const style = options?.style || "natural"; // More photorealistic results by default
    const referenceImages = options?.referenceImages || [];
    const useEnhancedPrompts = options?.enhancedPromptEngineering !== false; // Enable by default

    // Validate prompt length - DALL-E has a maximum prompt length
    const maxPromptLength = 4000; // Maximum characters for DALL-E 3
    const truncatedPrompt =
      prompt.length > maxPromptLength
        ? prompt.substring(0, maxPromptLength - 3) + "..."
        : prompt;

    // Enhance the prompt with reference image descriptions and marketing-specific instructions
    let enhancedPrompt = truncatedPrompt;

    if (useEnhancedPrompts) {
      // Add marketing-specific enhancements to the prompt
      const marketingEnhancements = [
        "Create a professional marketing image with perfect composition and balance",
        "Ensure maximum clarity and sharpness, suitable for high-resolution display",
        "Use dramatic lighting to create depth and highlight key elements",
        "Maintain a clean, premium aesthetic with balanced composition",
        "Any text should be in a modern, legible font that complements the overall design",
      ];

      if (referenceImages.length > 0) {
        // Add reference image descriptions to the prompt with enhanced details
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
                return `Use this brand identity reference ${weightDescription}: Incorporate the exact brand colors, typography style, and visual language. Maintain brand consistency throughout the image.`;
              case "product":
                return `Include this product in the image ${weightDescription}: Position it prominently, ensure perfect proportions and details. The product should look photorealistic with professional lighting.`;
              case "background":
                return `Use this as a background reference ${weightDescription}: Recreate the spatial arrangement, lighting conditions, and atmosphere while ensuring it complements the foreground elements.`;
              case "style":
                return `Apply this artistic style ${weightDescription}: Adopt the visual language, techniques, and creative approach while maintaining professional marketing quality.`;
              case "color":
                return `Use this color palette ${weightDescription}: Incorporate these exact colors as the dominant scheme, ensuring they create the right emotional impact and brand alignment.`;
              case "layout":
                return `Follow this layout structure ${weightDescription}: Maintain the same spatial organization, visual hierarchy, and balance while optimizing for the target aspect ratio.`;
              case "mood":
                return `Capture this mood/atmosphere ${weightDescription}: Recreate the emotional tone through lighting, color treatment, and compositional elements.`;
              case "person":
                return `Include this person/character ${weightDescription}: Maintain their likeness, expression, and pose while integrating them naturally into the marketing context.`;
              default:
                return `Use this reference image ${weightDescription}: Incorporate its key visual elements while maintaining professional marketing standards.`;
            }
          })
          .join("\n");

        enhancedPrompt = `${truncatedPrompt}\n\nReference Images:\n${referenceDescriptions}\n\nMarketing Optimization:\n${marketingEnhancements.join("\n")}\n\nEnsure the final image has a balanced composition with clear focal points and professional quality suitable for marketing purposes.`;
      } else {
        // No reference images, but still enhance the prompt for marketing
        enhancedPrompt = `${truncatedPrompt}\n\nMarketing Optimization:\n${marketingEnhancements.join("\n")}\n\nEnsure the final image has a balanced composition with clear focal points and professional quality suitable for marketing purposes.`;
      }

      console.log(
        `Generating image with DALL-E ${model} using enhanced marketing prompt. ${referenceImages.length > 0 ? `Using ${referenceImages.length} reference images.` : ""} Enhanced prompt length: ${enhancedPrompt.length} chars`,
      );
    } else if (referenceImages.length > 0) {
      // Standard reference image handling without enhanced marketing prompts
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

    // Call OpenAI API to generate images with optimized parameters
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
 * Convert a File to base64 string
 */
async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === "string") {
        // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
        const base64 = reader.result.split(",")[1];
        resolve(base64);
      } else {
        reject(new Error("Failed to convert file to base64"));
      }
    };
    reader.onerror = (error) => reject(error);
  });
}

/**
 * Generate images using OpenAI's DALL-E model with reference images
 * This implementation uses GPT-4 Vision to analyze reference images and create an optimal prompt
 * It also supports multi-stage generation for higher quality results
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
    enhancedPromptEngineering?: boolean;
    multiStageGeneration?: boolean;
    stageCount?: number;
    refinementStrength?: number; // 0-1 value indicating how much to refine in each stage
  },
) {
  try {
    if (!openai.apiKey) {
      throw new Error("OpenAI API key is not configured");
    }

    // Default options with improved defaults
    const model = options?.model || "dall-e-3";
    const n = options?.n || 1;
    const size = options?.size || "1792x1024"; // Higher resolution default
    const quality = options?.quality || "hd"; // HD quality default
    const style = options?.style || "natural"; // More photorealistic results
    const useEnhancedPrompts = options?.enhancedPromptEngineering !== false; // Enable by default
    const useMultiStageGeneration = options?.multiStageGeneration !== false; // Enable by default
    const stageCount = options?.stageCount || 2; // Default to 2 stages
    const refinementStrength = options?.refinementStrength || 0.7; // Default refinement strength

    console.log(
      `Generating image with ${referenceImages.length} reference images using ${useEnhancedPrompts ? "enhanced" : "standard"} prompt engineering and ${useMultiStageGeneration ? `multi-stage (${stageCount} stages)` : "single-stage"} generation`,
    );

    // If we have reference images, use GPT-4V to analyze them and create a better prompt
    if (referenceImages.length > 0) {
      try {
        // Categorize reference images by tag for better analysis
        const categorizedImages = {
          brand: referenceImages.filter((img) => img.tag === "brand"),
          product: referenceImages.filter((img) => img.tag === "product"),
          background: referenceImages.filter((img) => img.tag === "background"),
          style: referenceImages.filter((img) => img.tag === "style"),
          color: referenceImages.filter((img) => img.tag === "color"),
          layout: referenceImages.filter((img) => img.tag === "layout"),
          mood: referenceImages.filter((img) => img.tag === "mood"),
          person: referenceImages.filter((img) => img.tag === "person"),
        };

        // Prepare the messages array for GPT-4V with enhanced prompt engineering
        const messages = [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: useEnhancedPrompts
                  ? `I want to create a professional marketing image based on this prompt: "${prompt}". I have ${referenceImages.length} reference images that should influence the generation. Please analyze these images in extreme detail and create a comprehensive prompt for DALL-E 3.

                  For each image, analyze:
                  - For backgrounds: lighting, color palette, mood, composition, and spatial arrangement
                  - For products: every visible feature, texture, color, proportions, and distinctive elements
                  - For style references: artistic techniques, visual language, composition principles
                  - For color palettes: exact color values, relationships between colors, emotional impact
                  - For layouts: spatial organization, hierarchy, balance, white space usage
                  
                  Create a detailed prompt that includes:
                  - Specific placement instructions for key elements
                  - Lighting direction and quality
                  - Exact color specifications from reference images
                  - Detailed composition guidelines
                  - Instructions for maintaining photorealistic quality
                  - Aspect ratio and resolution considerations
                  
                  Format the prompt as a comprehensive set of instructions that will produce a high-quality marketing image suitable for professional use.`
                  : `I want to create an image based on this prompt: "${prompt}". I have ${referenceImages.length} reference images that should influence the generation. Please analyze these images and create a detailed prompt for DALL-E 3 that will incorporate elements from these reference images effectively.`,
              },
            ],
          },
        ];

        // Add each reference image to the message content with enhanced descriptions
        for (const refImg of referenceImages) {
          let base64Image;

          if (refImg.image instanceof File) {
            // Convert File to base64
            base64Image = await fileToBase64(refImg.image);
          } else if (typeof refImg.image === "string") {
            // If it's already a base64 string or URL
            if (refImg.image.startsWith("data:")) {
              // It's already a data URL, extract the base64 part
              base64Image = refImg.image.split(",")[1];
            } else {
              // It's a URL, we'll use it directly
              messages[0].content.push({
                type: "image_url",
                image_url: {
                  url: refImg.image,
                },
              });
              continue; // Skip to next image
            }
          } else {
            console.warn("Unsupported image format, skipping", refImg);
            continue;
          }

          // Add the image to the message content
          messages[0].content.push({
            type: "image_url",
            image_url: {
              url: `data:image/jpeg;base64,${base64Image}`,
            },
          });

          // Add enhanced description of the image's purpose
          const weightDescription =
            refImg.weight >= 80
              ? "strongly"
              : refImg.weight >= 50
                ? "moderately"
                : "slightly";

          let purposeDescription = "";
          switch (refImg.tag) {
            case "brand":
              purposeDescription = `This is a BRAND IDENTITY reference that should influence the overall brand aesthetic ${weightDescription}. Please analyze all brand elements including logos, typography, color schemes, and visual language.`;
              break;
            case "product":
              purposeDescription = `This is a PRODUCT reference that should be incorporated ${weightDescription}. Please analyze all product details including shape, texture, color, proportions, and distinctive features.`;
              break;
            case "background":
              purposeDescription = `This is a BACKGROUND reference that should influence the environment/setting ${weightDescription}. Please analyze the spatial arrangement, lighting, atmosphere, and overall composition.`;
              break;
            case "style":
              purposeDescription = `This is a STYLE reference that should influence the artistic approach ${weightDescription}. Please analyze the visual style, artistic techniques, and creative direction.`;
              break;
            case "color":
              purposeDescription = `This is a COLOR PALETTE reference that should influence the color scheme ${weightDescription}. Please analyze the exact colors, their relationships, and emotional impact.`;
              break;
            case "layout":
              purposeDescription = `This is a LAYOUT reference that should influence the composition ${weightDescription}. Please analyze the spatial organization, hierarchy, balance, and white space usage.`;
              break;
            case "mood":
              purposeDescription = `This is a MOOD/ATMOSPHERE reference that should influence the emotional tone ${weightDescription}. Please analyze the emotional qualities, lighting, and overall feeling.`;
              break;
            case "person":
              purposeDescription = `This is a PERSON/CHARACTER reference that should be incorporated ${weightDescription}. Please analyze the appearance, pose, expression, and distinctive characteristics.`;
              break;
            default:
              purposeDescription = `This reference image should influence the generation ${weightDescription}. Please analyze all relevant visual elements.`;
          }

          messages[0].content.push({
            type: "text",
            text: purposeDescription,
          });
        }

        // Call GPT-4V to analyze the images and create an enhanced prompt with increased token limit
        const response = await openai.chat.completions.create({
          model: "gpt-4-vision-preview",
          messages: messages as any,
          max_tokens: useEnhancedPrompts ? 1000 : 500, // Increased token limit for enhanced prompts
          temperature: 0.7, // Slightly increased creativity
        });

        // Extract the enhanced prompt
        const enhancedPrompt = response.choices[0].message.content;
        console.log("Enhanced prompt with reference images:", enhancedPrompt);

        // Multi-stage generation approach
        if (useMultiStageGeneration && stageCount > 1) {
          return await performMultiStageGeneration(
            enhancedPrompt || prompt,
            stageCount,
            refinementStrength,
            {
              model,
              n,
              size: size as any,
              quality: quality as any,
              style: style as any,
            },
          );
        } else {
          // Single-stage generation (original approach)
          const imageResponse = await openai.images.generate({
            model,
            prompt: enhancedPrompt || prompt, // Fallback to original prompt if enhancement fails
            n,
            size: size as any,
            quality: quality as any,
            style: style as any,
            response_format: "url",
          });

          return imageResponse.data;
        }
      } catch (visionError) {
        console.error("Error using GPT-4V for reference images:", visionError);
        // Fallback to standard image generation if GPT-4V fails
        console.log(
          "Falling back to standard image generation without reference analysis",
        );
      }
    }

    // If we don't have reference images or GPT-4V failed, use the standard approach
    return generateImage(prompt, options);
  } catch (error: any) {
    console.error("Error generating images with references:", error);
    throw error;
  }
}

/**
 * Perform multi-stage image generation for higher quality results
 * This approach generates an initial image, then uses it as a reference for refinement in subsequent stages
 */
async function performMultiStageGeneration(
  initialPrompt: string,
  stageCount: number,
  refinementStrength: number,
  options: {
    model: string;
    n: number;
    size: string;
    quality: string;
    style: string;
  },
) {
  try {
    console.log(`Starting multi-stage generation with ${stageCount} stages`);

    // Stage 1: Generate initial image
    console.log("Stage 1: Generating initial image");
    const initialResponse = await openai.images.generate({
      model: options.model,
      prompt: initialPrompt,
      n: 1, // Always generate 1 image in the first stage
      size: options.size,
      quality: options.quality,
      style: options.style,
      response_format: "url",
    });

    if (!initialResponse.data || initialResponse.data.length === 0) {
      console.error("Failed to generate initial image");
      throw new Error("Failed to generate initial image");
    }

    // Get the initial image URL
    const initialImageUrl = initialResponse.data[0].url;
    let currentImageUrl = initialImageUrl;
    let currentRevisionPrompt =
      initialResponse.data[0].revised_prompt || initialPrompt;
    let finalImages = [...initialResponse.data];

    // Perform refinement stages
    for (let stage = 2; stage <= stageCount; stage++) {
      console.log(`Stage ${stage}: Refining image`);

      // Create a refinement prompt that builds on the previous stage
      const refinementPrompt = `Refine and enhance this image further. ${currentRevisionPrompt}\n\nImprove the following aspects:\n- Increase overall detail and clarity\n- Enhance lighting and shadows\n- Refine textures and surfaces\n- Improve color balance and vibrancy\n- Ensure professional marketing quality\n\nMaintain the exact same composition, subject matter, and style as the reference image.`;

      // Use the previous stage's image as a reference
      try {
        // Create messages for GPT-4V to analyze the current image
        const analysisMessages = [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `Analyze this image in detail and provide specific suggestions for improvements in the next iteration. Focus on aspects that could be enhanced while maintaining the same overall composition and concept.`,
              },
              {
                type: "image_url",
                image_url: {
                  url: currentImageUrl,
                },
              },
            ],
          },
        ];

        // Get image analysis and improvement suggestions
        const analysisResponse = await openai.chat.completions.create({
          model: "gpt-4-vision-preview",
          messages: analysisMessages as any,
          max_tokens: 500,
          temperature: 0.5,
        });

        const imageAnalysis = analysisResponse.choices[0].message.content;
        console.log(`Image analysis for stage ${stage}:`, imageAnalysis);

        // Create an enhanced refinement prompt using the analysis
        const enhancedRefinementPrompt = `Refine and enhance this image further. ${currentRevisionPrompt}\n\nBased on analysis, improve these specific aspects:\n${imageAnalysis}\n\nMaintain the exact same composition, subject matter, and style as the reference image.`;

        // Generate refined image
        const refinementResponse = await openai.images.generate({
          model: options.model,
          prompt: enhancedRefinementPrompt,
          n: 1,
          size: options.size,
          quality: options.quality,
          style: options.style,
          response_format: "url",
        });

        if (refinementResponse.data && refinementResponse.data.length > 0) {
          // Update current image for next iteration
          currentImageUrl = refinementResponse.data[0].url;
          currentRevisionPrompt =
            refinementResponse.data[0].revised_prompt ||
            enhancedRefinementPrompt;

          // Add to final images collection
          finalImages.push({
            url: currentImageUrl,
            revised_prompt: currentRevisionPrompt,
            stage: stage,
          });

          console.log(`Successfully generated stage ${stage} refinement`);
        } else {
          console.error(`Failed to generate refinement for stage ${stage}`);
          break; // Stop refinement if this stage fails
        }
      } catch (refinementError) {
        console.error(`Error in refinement stage ${stage}:`, refinementError);
        break; // Stop refinement if an error occurs
      }
    }

    // Return all generated images, with the most refined one first
    return finalImages.reverse();
  } catch (error) {
    console.error("Error in multi-stage generation:", error);
    throw error;
  }
}

export { genAI };
export default openai;
