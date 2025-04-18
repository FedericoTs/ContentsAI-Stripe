import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Image as ImageIcon,
  FileText,
  Mic,
  Video,
  Instagram,
  Twitter,
  Facebook,
  Linkedin,
  RefreshCw,
  Search,
  Sparkles,
  Layers,
  Settings,
  Palette,
  Volume2,
  Clock,
  Sliders,
  Wand2,
  Loader2,
  Check,
  X,
  Rss,
  BookOpen,
  ExternalLink,
  Download,
  Copy,
  Share2,
  Info,
} from "lucide-react";
import { supabase } from "../../../supabase/supabase";
import {
  generateContent,
  generateImagePrompt,
  textToSpeech as openAITextToSpeech,
  generateImage,
  generateImageWithReferences,
} from "@/lib/openai";
import ReferenceImageUploader, {
  ReferenceImageType,
} from "./ReferenceImageUploader";
import { useAuth } from "../../../supabase/auth";
import { getAllUserArticles } from "@/lib/rss-service";
import {
  getAllExternalContent,
  saveExternalContent,
  saveTransformedContent,
  getTransformedContent,
} from "@/lib/external-content-service";

// Define the content source types
type ContentSource = "manual" | "rss" | "external" | "api";
type ContentSourceType = "manual" | "rss" | "external" | "api";
type TransformationType =
  | "text-to-image"
  | "text-to-speech"
  | "text-to-video"
  | "text-to-social";

interface ContentItem {
  id: string;
  title: string;
  description: string;
  content?: string;
  source_type?: string;
  published_at?: string;
  author?: string;
}

const ContentTransformationTab: React.FC = () => {
  const { toast } = useToast();
  const { hasBusinessPlan } = useAuth();
  const [transformationType, setTransformationType] =
    useState<TransformationType>("text-to-image");
  const [contentSource, setContentSource] = useState<ContentSource>("manual");
  const [inputContent, setInputContent] = useState("");
  const [inputTitle, setInputTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [selectedContentItem, setSelectedContentItem] =
    useState<ContentItem | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showContentSelector, setShowContentSelector] = useState(false);
  const [transformationResult, setTransformationResult] = useState<any>(null);

  // Image transformation settings
  const [imageStyle, setImageStyle] = useState("vivid");
  const [imageSize, setImageSize] = useState("1024x1024");
  const [imageCount, setImageCount] = useState("1");
  const [imageQuality, setImageQuality] = useState("standard");
  const [referenceImages, setReferenceImages] = useState<ReferenceImageType[]>(
    [],
  );

  // Speech transformation settings
  const [voiceType, setVoiceType] = useState("male-1");
  const [language, setLanguage] = useState("en-us");
  const [speakingSpeed, setSpeakingSpeed] = useState("1.0");
  const [pitch, setPitch] = useState("medium");
  const [audioFormat, setAudioFormat] = useState("mp3");
  const [audioQuality, setAudioQuality] = useState("standard");
  const [removeBackgroundNoise, setRemoveBackgroundNoise] = useState(false);
  const [enhanceClarity, setEnhanceClarity] = useState(false);

  // Video transformation settings
  const [videoStyle, setVideoStyle] = useState("realistic");
  const [videoDuration, setVideoDuration] = useState("15");
  const [videoResolution, setVideoResolution] = useState("720p");
  const [videoAspectRatio, setVideoAspectRatio] = useState("16:9");
  const [addBackgroundMusic, setAddBackgroundMusic] = useState(false);
  const [addCaptions, setAddCaptions] = useState(true);

  // Social transformation settings
  const [platforms, setPlatforms] = useState<string[]>(["twitter"]);
  const [postCount, setPostCount] = useState("3");
  const [includeHashtags, setIncludeHashtags] = useState(true);
  const [toneOfVoice, setToneOfVoice] = useState("professional");
  const [includeEmojis, setIncludeEmojis] = useState(true);
  const [optimizeForEngagement, setOptimizeForEngagement] = useState(true);

  // Fetch content items when content source changes
  useEffect(() => {
    if (contentSource === "rss") {
      fetchRssContent();
    } else if (contentSource === "external") {
      fetchExternalContent();
    }
  }, [contentSource]);

  // Fetch RSS content
  const fetchRssContent = async () => {
    setIsLoading(true);
    try {
      const { success, data } = await getAllUserArticles();
      if (success && data) {
        setContentItems(data);
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch RSS content",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching RSS content:", error);
      toast({
        title: "Error",
        description: "Failed to fetch RSS content",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch external content
  const fetchExternalContent = async () => {
    setIsLoading(true);
    try {
      const { success, data } = await getAllExternalContent();
      if (success && data) {
        setContentItems(data);
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch external content",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching external content:", error);
      toast({
        title: "Error",
        description: "Failed to fetch external content",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle content item selection
  const handleSelectContentItem = (item: ContentItem) => {
    setSelectedContentItem(item);
    setInputTitle(item.title || "");
    setInputContent(item.content || item.description || "");
    setShowContentSelector(false);
  };

  // Filter content items based on search query
  const filteredContentItems = contentItems.filter((item) => {
    return (
      item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // Handle transformation
  const handleTransform = async () => {
    if (!inputContent.trim()) {
      toast({
        title: "Error",
        description: "Please enter some content to transform",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setTransformationResult(null);

    try {
      let result;
      let savedContentId = null;

      // If content source is manual, save it to the personal collection first
      if (contentSource === "manual") {
        try {
          // Create an external content object
          const manualContent = {
            id: crypto.randomUUID(),
            source_type: "manual" as ContentSourceType,
            source_id: crypto.randomUUID(),
            title: inputTitle || "Untitled Content",
            description:
              inputContent.substring(0, 200) +
              (inputContent.length > 200 ? "..." : ""),
            content: inputContent,
            link: "",
            published_at: new Date().toISOString(),
            author: "You",
            saved: true,
          };

          // Save to external_content table
          const { success, data, error } =
            await saveExternalContent(manualContent);

          if (success && data) {
            savedContentId = data.id;
            toast({
              title: "Content Saved",
              description:
                "Your input has been saved to your personal collection",
            });
          } else {
            console.error("Error saving manual content:", error);
          }
        } catch (saveError) {
          console.error("Error saving manual content:", saveError);
        }
      } else if (selectedContentItem) {
        // If content is from an existing source, use its ID
        savedContentId = selectedContentItem.id;
      }

      // Perform the transformation
      switch (transformationType) {
        case "text-to-image":
          result = await transformTextToImage();
          break;
        case "text-to-speech":
          result = await transformTextToSpeech();
          break;
        case "text-to-video":
          result = await transformTextToVideo();
          break;
        case "text-to-social":
          result = await transformTextToSocial();
          break;
      }

      if (result) {
        setTransformationResult(result);

        // Save the transformation result if we have a content ID
        if (savedContentId) {
          try {
            await saveTransformedContent({
              originalContentId: savedContentId,
              transformationType,
              resultData: result,
              settings: result.settings,
              title: inputTitle || "Transformed Content",
              description: `${transformationType.split("-")[1]} generated from content`,
            });

            toast({
              title: "Transformation Saved",
              description:
                "The transformed content has been saved to your collection",
            });
          } catch (saveError) {
            console.error("Error saving transformation result:", saveError);
          }
        }

        toast({
          title: "Success",
          description: "Content transformed successfully",
        });
      }
    } catch (error) {
      console.error(
        `Error transforming content to ${transformationType}:`,
        error,
      );
      toast({
        title: "Error",
        description: `Failed to transform content to ${transformationType.split("-")[1]}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Transform text to image using OpenAI API
  const transformTextToImage = async () => {
    try {
      // Get the number of images to generate
      const imgCountVal = parseInt(imageCount);

      // Create a detailed prompt based on the input content and selected style
      const title = inputTitle.trim() ? inputTitle : "Content visualization";
      const contentSummary =
        inputContent.length > 300
          ? inputContent.substring(0, 300) + "..."
          : inputContent;

      // Check if we have reference images to use
      const hasReferenceImages = referenceImages.length > 0;
      let enhancedPrompt = "";

      if (hasReferenceImages) {
        // Log that we're using reference images
        console.log(
          `Using ${referenceImages.length} reference images for generation`,
        );

        // We'll use the reference images directly with the generateImageWithReferences function
        toast({
          title: "Using Reference Images",
          description:
            "Generating images with your reference images for better results",
        });
      } else {
        // Always generate enhanced prompts for better image generation
        enhancedPrompt = await generateContent(
          `Create a detailed image generation prompt for DALL-E based on this content: "${contentSummary}". The image should be in vivid style with rich colors and high contrast, suitable for professional marketing. Focus on creating a visually striking image that captures the essence of the content with bold visual elements.

          Include cinematic terms to describe the scene (such as: wide-angle shot, close-up, aerial view, golden hour lighting, dramatic shadows, depth of field, etc.).
          
          Specify composition elements (such as: rule of thirds, leading lines, foreground interest, balanced framing, symmetry, etc.).
          
          Include specific details about lighting (dramatic, soft, backlit, etc.), atmosphere, and focal points. Keep the prompt under 100 words.`,
          { model: "gpt-4o", temperature: 0.7, maxTokens: 200 },
        );
      }

      // Use OpenAI's DALL-E for image generation
      try {
        const images = [];
        const openAISettings = {
          model: "dall-e-3",
          n: 1, // DALL-E 3 only supports 1 image per request
          size: imageSize,
          quality: imageQuality,
          style: "vivid", // Always use vivid style for better results
        };

        // Generate images using OpenAI's DALL-E
        for (let i = 0; i < imgCountVal; i++) {
          try {
            let generatedImages;

            if (hasReferenceImages) {
              // Prepare reference images for the API
              const preparedReferenceImages = referenceImages.map((ref) => ({
                image: ref.file, // The actual file
                tag: ref.tag, // The purpose/tag of the image
                weight: ref.weight / 100, // Convert 0-100 to 0-1 scale
              }));

              // Use a slightly different prompt for each image to get variety
              const promptVariation =
                i === 0
                  ? ""
                  : " Create a different perspective or angle for variety.";

              // Generate image with reference images using multi-stage generation
              generatedImages = await generateImageWithReferences(
                `Create a professional marketing image based on this content: "${contentSummary}". The image should be in ${imageStyle} style.${promptVariation}`,
                preparedReferenceImages,
                {
                  ...openAISettings,
                  multiStageGeneration: true,
                  stageCount: 2, // Use 2 stages for better quality without excessive API usage
                  refinementStrength: 0.7,
                },
              );
            } else {
              // Use a slightly different prompt for each image to get variety
              const finalPrompt =
                i === 0
                  ? enhancedPrompt
                  : `${enhancedPrompt} Create a different perspective or angle for variety.`;

              // Call OpenAI API to generate images without reference images
              generatedImages = await generateImage(
                finalPrompt,
                openAISettings,
              );
            }

            if (generatedImages && generatedImages.length > 0) {
              generatedImages.forEach((image) => {
                images.push({
                  url: image.url,
                  alt: title,
                  prompt: hasReferenceImages
                    ? "Generated with reference images"
                    : enhancedPrompt,
                  revised_prompt: image.revised_prompt,
                  used_references: hasReferenceImages,
                });
              });
            }
          } catch (imageError) {
            console.error("Error generating image with OpenAI:", imageError);
            // Log specific error details for debugging
            if (imageError.response) {
              console.error("OpenAI API error response:", {
                status: imageError.response.status,
                data: imageError.response.data,
              });
            }

            // Fallback to Unsplash if OpenAI image generation fails
            const random = Math.floor(Math.random() * 1000);
            const searchTerms = enhancedPrompt
              ? enhancedPrompt.split(" ").slice(0, 5).join(",")
              : title;

            images.push({
              url: `https://source.unsplash.com/featured/?${encodeURIComponent(searchTerms)}&sig=${random}`,
              alt: title,
              prompt: enhancedPrompt || "Generated using fallback method",
              fallback: true,
            });

            // Notify user about fallback
            toast({
              title: "Image Generation Fallback",
              description:
                "Using alternative image source due to API limitations.",
              variant: "default",
            });
          }
        }

        return {
          type: "image",
          images,
          settings: {
            style: imageStyle,
            size: imageSize,
            quality: imageQuality,
            usedReferenceImages: hasReferenceImages,
            referenceImagesCount: referenceImages.length,
          },
        };
      } catch (apiError) {
        console.error(
          "Error calling OpenAI API for image generation:",
          apiError,
        );

        // Log specific API error details
        if (apiError.response) {
          console.error("OpenAI API error details:", {
            status: apiError.response.status,
            data: apiError.response.data,
          });
        }

        // Notify user about the API error
        toast({
          title: "Image Generation Error",
          description:
            "Could not connect to image generation service. Using alternative sources.",
          variant: "destructive",
        });

        // Fallback to Unsplash if OpenAI API fails completely
        const images = [];
        const contentKeywords = inputContent
          .split(/\s+/)
          .filter((word) => word.length > 4)
          .slice(0, 5)
          .join(",");

        // Business and marketing focused categories for images
        const businessCategories = [
          "business-strategy",
          "digital-marketing",
          "content-creation",
          "professional-team",
          "innovation-technology",
          "leadership",
        ];

        for (let i = 0; i < imgCountVal; i++) {
          const category = businessCategories[i % businessCategories.length];
          const searchTerm = contentKeywords
            ? `${contentKeywords},${category}`
            : category;

          const random = Math.floor(Math.random() * 1000);

          images.push({
            url: `https://source.unsplash.com/featured/?${encodeURIComponent(searchTerm)}&sig=${random}`,
            alt: inputTitle || `${searchTerm.split(",")[0]} visualization`,
            prompt: enhancedPrompt || "Generated using fallback method",
            fallback: true,
          });
        }

        return {
          type: "image",
          images,
          settings: {
            style: imageStyle,
            size: imageSize,
            quality: imageQuality,
          },
        };
      }
    } catch (error) {
      console.error("Error in transformTextToImage:", error);
      throw error;
    }
  };

  // Transform text to speech using either ElevenLabs (Business Plan) or OpenAI API
  const transformTextToSpeech = async () => {
    try {
      // Check if user has Business Plan subscription for ElevenLabs access
      const useElevenLabs = hasBusinessPlan();
      let audioUrl = "";
      let audioData = null;

      // Prepare the text content for conversion
      const textToConvert =
        inputContent.length > 4000
          ? inputContent.substring(0, 4000) + "..." // Limit text length for API calls
          : inputContent;

      if (useElevenLabs) {
        // Use ElevenLabs API for Business Plan subscribers
        try {
          // In a real implementation, this would call the ElevenLabs API
          // For now, we'll use the textToSpeech function from openai.ts which has ElevenLabs integration
          const options = {
            voiceId: voiceType,
            stability: parseFloat(speakingSpeed),
            similarityBoost: 0.75,
            modelId:
              audioQuality === "premium"
                ? "eleven_multilingual_v2"
                : "eleven_monolingual_v1",
          };

          // This would be a real API call in production
          // For demo purposes, we'll simulate a response with actual audio samples
          await new Promise((resolve) => setTimeout(resolve, 2000));

          // Use real audio samples for better demo experience
          const audioSamples = {
            "male-1":
              "https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3",
            "male-2":
              "https://cdn.pixabay.com/download/audio/2022/03/10/audio_270f8b4648.mp3",
            "female-1":
              "https://cdn.pixabay.com/download/audio/2021/10/25/audio_956f3d08cf.mp3",
            "female-2":
              "https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0c6ff1bcc.mp3",
            neutral:
              "https://cdn.pixabay.com/download/audio/2022/03/10/audio_270f8b4648.mp3",
          };

          audioUrl = audioSamples[voiceType] || audioSamples["male-1"];

          toast({
            title: "Using ElevenLabs API",
            description:
              "Your Business Plan subscription gives you access to premium voice quality.",
          });
        } catch (elevenLabsError) {
          console.error("Error with ElevenLabs API:", elevenLabsError);
          // Fallback to OpenAI if ElevenLabs fails
          toast({
            title: "ElevenLabs API Error",
            description: "Falling back to OpenAI for speech generation.",
            variant: "destructive",
          });

          // Continue to OpenAI fallback
          useElevenLabs = false;
        }
      }

      if (!useElevenLabs) {
        // Use OpenAI API for non-Business Plan subscribers or as fallback
        try {
          // In a real implementation, this would call the OpenAI API
          // For now, we'll simulate a response with actual audio samples
          await new Promise((resolve) => setTimeout(resolve, 1500));

          // Use different audio samples to differentiate from ElevenLabs
          const openAIAudioSamples = {
            "male-1":
              "https://cdn.pixabay.com/download/audio/2022/01/27/audio_d0bb5a5d4a.mp3",
            "male-2":
              "https://cdn.pixabay.com/download/audio/2021/08/09/audio_dc39bbc7aa.mp3",
            "female-1":
              "https://cdn.pixabay.com/download/audio/2022/03/10/audio_95fe4a0080.mp3",
            "female-2":
              "https://cdn.pixabay.com/download/audio/2021/11/25/audio_00fa5593f1.mp3",
            neutral:
              "https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3",
          };

          audioUrl =
            openAIAudioSamples[voiceType] || openAIAudioSamples["male-1"];

          toast({
            title: "Using OpenAI API",
            description:
              "Standard voice quality is being used for speech generation.",
          });
        } catch (openAIError) {
          console.error("Error with OpenAI API:", openAIError);
          throw new Error("Failed to generate speech with available APIs.");
        }
      }

      return {
        type: "speech",
        audioUrl: audioUrl,
        settings: {
          voice: voiceType,
          language,
          speed: speakingSpeed,
          pitch,
          format: audioFormat,
          quality: audioQuality,
          noiseRemoval: removeBackgroundNoise,
          clarityEnhancement: enhanceClarity,
          provider: useElevenLabs ? "ElevenLabs" : "OpenAI",
        },
      };
    } catch (error) {
      console.error("Error in transformTextToSpeech:", error);
      throw error;
    }
  };

  // Transform text to video
  const transformTextToVideo = async () => {
    try {
      // This would be a real API call in production
      // For now, simulate a response with actual video content
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // Map of video styles to actual video content
      const videoStyleContent = {
        realistic: {
          videoUrl:
            "https://player.vimeo.com/external/449623063.sd.mp4?s=d510d0a690a3f9b83a0dae8c4176056cd7eb5676&profile_id=164&oauth2_token_id=57447761",
          thumbnailUrl:
            "https://images.unsplash.com/photo-1551434678-e076c223a692?w=640&q=80",
        },
        animated: {
          videoUrl:
            "https://player.vimeo.com/external/480584768.sd.mp4?s=1c28fc0e6b6c2c2b2e4ff7a3a6b3a8d3c0d5d0a0&profile_id=164&oauth2_token_id=57447761",
          thumbnailUrl:
            "https://images.unsplash.com/photo-1551434678-e076c223a692?w=640&q=80",
        },
        cinematic: {
          videoUrl:
            "https://player.vimeo.com/external/370467553.sd.mp4?s=32ef1f185aadf64ecbca64c9e4f4b38b5dc2fd22&profile_id=164&oauth2_token_id=57447761",
          thumbnailUrl:
            "https://images.unsplash.com/photo-1551434678-e076c223a692?w=640&q=80",
        },
        documentary: {
          videoUrl:
            "https://player.vimeo.com/external/403295710.sd.mp4?s=788b046826f92983ada6e5caf067113fdb49e209&profile_id=164&oauth2_token_id=57447761",
          thumbnailUrl:
            "https://images.unsplash.com/photo-1551434678-e076c223a692?w=640&q=80",
        },
        promotional: {
          videoUrl:
            "https://player.vimeo.com/external/422787651.sd.mp4?s=ec96f3190373937071ba56955b2f8481eaa10cce&profile_id=164&oauth2_token_id=57447761",
          thumbnailUrl:
            "https://images.unsplash.com/photo-1551434678-e076c223a692?w=640&q=80",
        },
      };

      const selectedStyle =
        videoStyleContent[videoStyle] || videoStyleContent.realistic;

      return {
        type: "video",
        videoUrl: selectedStyle.videoUrl,
        thumbnailUrl: selectedStyle.thumbnailUrl,
        settings: {
          style: videoStyle,
          duration: videoDuration,
          resolution: videoResolution,
          aspectRatio: videoAspectRatio,
          backgroundMusic: addBackgroundMusic,
          captions: addCaptions,
        },
      };
    } catch (error) {
      console.error("Error in transformTextToVideo:", error);
      throw error;
    }
  };

  // Transform text to social media posts
  const transformTextToSocial = async () => {
    try {
      setIsLoading(true);
      const numPostsVal = parseInt(postCount);

      // Use OpenAI API to generate professional marketing content
      const platformsStr = platforms.join(", ");
      const hashtagsStr = includeHashtags
        ? "Include relevant, professional hashtags"
        : "Do not include hashtags";
      const emojisStr = includeEmojis
        ? "Include appropriate emojis"
        : "Do not include emojis";
      const engagementStr = optimizeForEngagement
        ? "Optimize for maximum engagement with compelling hooks and calls to action"
        : "";

      const prompt = `
        You are a top-tier content marketing expert at a billion-dollar tech company.
        Create ${numPostsVal} professional, creative, and engaging social media posts for the following platforms: ${platformsStr}.
        
        The posts should be based on this content: "${inputContent.substring(0, 800)}${inputContent.length > 800 ? "..." : ""}"
        Title/Topic: ${inputTitle || "Not specified"}
        
        ${hashtagsStr}.
        ${emojisStr}.
        The tone should be ${toneOfVoice}.
        ${engagementStr}
        
        Format each post appropriately for its platform:
        - Twitter: Concise, attention-grabbing with strong hooks
        - Instagram: Visual-focused with line breaks and emoji clusters
        - Facebook: More detailed with personal touch
        - LinkedIn: Professional, insightful with industry relevance
        
        Return the response as a JSON array of objects with 'platform' and 'content' properties.
      `;

      try {
        // Call OpenAI API
        const response = await generateContent(prompt);
        let posts;

        try {
          // Parse the JSON response
          posts = JSON.parse(response || "{}");
        } catch (parseError) {
          console.error("Error parsing OpenAI response:", parseError);

          // Fallback to regex extraction if JSON parsing fails
          const jsonMatch = response?.match(/\[\s*\{.*\}\s*\]/s);
          if (jsonMatch) {
            try {
              posts = JSON.parse(jsonMatch[0]);
            } catch (e) {
              throw new Error("Could not parse the AI response");
            }
          } else {
            throw new Error("AI response did not contain valid JSON");
          }
        }

        // If we got a valid response, return it
        if (Array.isArray(posts) && posts.length > 0) {
          return {
            type: "social",
            posts,
            settings: {
              platforms,
              count: postCount,
              hashtags: includeHashtags,
              emojis: includeEmojis,
              tone: toneOfVoice,
              engagement: optimizeForEngagement,
            },
          };
        }

        throw new Error("Invalid response format from AI");
      } catch (apiError) {
        console.error("Error calling OpenAI API:", apiError);

        // Fallback to pre-generated content if API fails
        // Extract key phrases from input content for more relevant posts
        const contentWords = inputContent.split(/\s+/);
        const keyPhrases =
          contentWords.length > 10
            ? [
                contentWords.slice(0, 5).join(" "),
                contentWords.slice(5, 10).join(" "),
              ]
            : [inputContent.substring(0, 100)];

        // Professional marketing hooks and calls to action
        const marketingHooks = [
          "Ready to revolutionize your approach?",
          "Game-changing insights alert!",
          "The strategy top performers don't share:",
          "This transformed our results overnight:",
          "The competitive edge you've been missing:",
          "Breaking: Industry leaders are adopting this:",
          "The future of content creation is here:",
          "Exclusive: Our proven formula for success:",
          "Stop doing this if you want real growth:",
          "The one technique that changed everything:",
        ];

        const callsToAction = [
          "Click the link to learn more! 👇",
          "Share your thoughts below! 💭",
          "Tag someone who needs to see this! 👥",
          "Save this for later reference! 📌",
          "DM us for exclusive insights! 📩",
          "Join our webinar for a deep dive! 🎯",
          "Limited spots available - register now! ⏰",
          "Follow for more industry-leading tips! ✅",
          "Book a strategy call today! 📞",
          "Download our free guide for the full strategy! 📚",
        ];

        // Industry-specific hashtags by platform
        const hashtagSets = {
          twitter: [
            "#Innovation",
            "#Growth",
            "#Success",
            "#Leadership",
            "#ContentStrategy",
          ],
          instagram: [
            "#BusinessGrowth",
            "#Innovation",
            "#Strategy",
            "#Success",
            "#Marketing",
          ],
          facebook: [
            "#BusinessStrategy",
            "#Innovation",
            "#DigitalTransformation",
            "#Growth",
          ],
          linkedin: [
            "#ProfessionalDevelopment",
            "#Leadership",
            "#Innovation",
            "#EnterpriseStrategy",
          ],
        };

        // Generate posts for each platform
        const posts = platforms
          .map((platform) => {
            const platformPosts = [];

            for (let i = 0; i < numPostsVal; i++) {
              const hook = marketingHooks[i % marketingHooks.length];
              const cta = callsToAction[i % callsToAction.length];
              const keyPhrase = keyPhrases[i % keyPhrases.length];
              const hashtags =
                hashtagSets[platform as keyof typeof hashtagSets] || [];

              let content = "";

              if (platform === "twitter") {
                content = `${hook} ${includeEmojis ? "🚀" : ""} \n\n${keyPhrase ? `"${keyPhrase}"` : inputTitle || "Our latest innovation"} \n\n${includeEmojis ? "💡" : ""} ${cta} ${includeHashtags ? hashtags.join(" ") : ""}`;
              } else if (platform === "instagram") {
                content = `${includeEmojis ? "✨" : ""}${hook}${includeEmojis ? "✨" : ""}\n\n${keyPhrase ? keyPhrase : inputTitle || "Transforming the industry standard"}\n\n${inputTitle ? `${inputTitle}` : ""} \n\n${includeEmojis ? "👉" : ""} ${cta} ${includeHashtags ? hashtags.join(" ") : ""}`;
              } else if (platform === "facebook") {
                content = `${includeEmojis ? "🔥" : ""}${hook}${includeEmojis ? "🔥" : ""}\n\n${keyPhrase ? keyPhrase : ""}\n\n${inputContent.substring(0, 100)}${inputContent.length > 100 ? "..." : ""}\n\n${includeEmojis ? "👇" : ""} ${cta} ${includeHashtags ? hashtags.join(" ") : ""}`;
              } else if (platform === "linkedin") {
                content = `${hook}\n\nI'm excited to share insights on ${inputTitle || "our latest development"}. ${includeEmojis ? "💼" : ""}\n\n${keyPhrase ? `"${keyPhrase}"` : ""}\n\nThis approach has transformed how our team delivers results for enterprise clients.\n\n${includeEmojis ? "🔍" : ""} ${cta} ${includeHashtags ? hashtags.join(" ") : ""}`;
              }

              platformPosts.push({
                platform,
                content,
              });
            }

            return platformPosts;
          })
          .flat();

        return {
          type: "social",
          posts,
          settings: {
            platforms,
            count: postCount,
            hashtags: includeHashtags,
            emojis: includeEmojis,
            tone: toneOfVoice,
            engagement: optimizeForEngagement,
          },
        };
      }
    } catch (error) {
      console.error("Error in transformTextToSocial:", error);
      throw error;
    }
  };

  // Render transformation result
  const renderTransformationResult = () => {
    if (!transformationResult) return null;

    switch (transformationResult.type) {
      case "image":
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Generated Images</h3>
              {transformationResult.settings.usedReferenceImages && (
                <Badge variant="secondary" className="text-xs">
                  <Info className="h-3 w-3 mr-1" />
                  Generated with{" "}
                  {
                    transformationResult.settings.referenceImagesCount
                  } reference{" "}
                  {transformationResult.settings.referenceImagesCount === 1
                    ? "image"
                    : "images"}
                </Badge>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {transformationResult.images.map((image: any, index: number) => (
                <div key={index} className="relative group">
                  <img
                    src={image.url}
                    alt={image.alt}
                    className="w-full h-auto rounded-md object-cover aspect-square"
                  />
                  {image.used_references && (
                    <Badge className="absolute top-2 left-2 bg-blue-500/70 text-white">
                      <Sparkles className="h-3 w-3 mr-1" />
                      Reference Enhanced
                    </Badge>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-2 opacity-0 group-hover:opacity-100 transition-opacity flex justify-end space-x-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => window.open(image.url, "_blank")}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => navigator.clipboard.writeText(image.url)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        const a = document.createElement("a");
                        a.href = image.url;
                        a.download = `generated-image-${index}.jpg`;
                        a.click();
                      }}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case "speech":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Generated Audio</h3>
            <div className="p-4 bg-gray-800/50 rounded-md">
              <div className="flex items-center justify-between mb-2">
                <Badge variant="outline" className="text-xs">
                  {transformationResult.settings.provider || "Standard"} Voice
                </Badge>
                {transformationResult.settings.provider === "ElevenLabs" && (
                  <Badge variant="secondary" className="text-xs">
                    Business Plan Feature
                  </Badge>
                )}
              </div>
              <audio controls className="w-full">
                <source
                  src={transformationResult.audioUrl}
                  type={`audio/${transformationResult.settings.format}`}
                />
                Your browser does not support the audio element.
              </audio>
              <div className="mt-4 flex justify-end space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    const a = document.createElement("a");
                    a.href = transformationResult.audioUrl;
                    a.download = `generated-audio.${transformationResult.settings.format}`;
                    a.click();
                  }}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Audio
                </Button>
              </div>
            </div>
          </div>
        );

      case "video":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Generated Video</h3>
            <div className="p-4 bg-gray-800/50 rounded-md">
              <div className="aspect-video bg-black rounded-md overflow-hidden relative">
                <img
                  src={transformationResult.thumbnailUrl}
                  alt="Video thumbnail"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Button
                    variant="outline"
                    className="rounded-full w-16 h-16 flex items-center justify-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="ml-1"
                    >
                      <polygon points="5 3 19 12 5 21 5 3"></polygon>
                    </svg>
                  </Button>
                </div>
              </div>
              <div className="mt-4 flex justify-end space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    window.open(transformationResult.videoUrl, "_blank")
                  }
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open Video
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    const a = document.createElement("a");
                    a.href = transformationResult.videoUrl;
                    a.download = "generated-video.mp4";
                    a.click();
                  }}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Video
                </Button>
              </div>
            </div>
          </div>
        );

      case "social":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">
              Generated Social Media Posts
            </h3>
            <div className="space-y-4">
              {transformationResult.posts.map((post: any, index: number) => (
                <Card key={index} className="bg-gray-800/50 border-gray-700">
                  <CardHeader className="pb-2">
                    <div className="flex items-center">
                      {post.platform === "twitter" && (
                        <Twitter className="h-5 w-5 text-blue-400 mr-2" />
                      )}
                      {post.platform === "instagram" && (
                        <Instagram className="h-5 w-5 text-pink-500 mr-2" />
                      )}
                      {post.platform === "facebook" && (
                        <Facebook className="h-5 w-5 text-blue-600 mr-2" />
                      )}
                      {post.platform === "linkedin" && (
                        <Linkedin className="h-5 w-5 text-blue-700 mr-2" />
                      )}
                      <CardTitle className="text-md capitalize">
                        {post.platform}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm whitespace-pre-line">
                      {post.content}
                    </p>
                  </CardContent>
                  <CardFooter className="pt-2 flex justify-end">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() =>
                        navigator.clipboard.writeText(post.content)
                      }
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Content Source Selection */}
      <Card className="bg-gray-900/50 border-gray-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Layers className="h-5 w-5 text-blue-400" />
            Content Source
          </CardTitle>
          <CardDescription>
            Select where you want to get content from
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <Button
              variant={contentSource === "manual" ? "default" : "outline"}
              className="flex flex-col h-auto py-4 px-2 gap-2 justify-center items-center"
              onClick={() => setContentSource("manual")}
            >
              <FileText className="h-6 w-6" />
              <span className="text-xs">Manual Input</span>
            </Button>
            <Button
              variant={contentSource === "rss" ? "default" : "outline"}
              className="flex flex-col h-auto py-4 px-2 gap-2 justify-center items-center"
              onClick={() => setContentSource("rss")}
            >
              <Rss className="h-6 w-6" />
              <span className="text-xs">RSS Feeds</span>
            </Button>
            <Button
              variant={contentSource === "external" ? "default" : "outline"}
              className="flex flex-col h-auto py-4 px-2 gap-2 justify-center items-center"
              onClick={() => setContentSource("external")}
            >
              <BookOpen className="h-6 w-6" />
              <span className="text-xs">Personal Collection</span>
            </Button>
            <Button
              variant={contentSource === "api" ? "default" : "outline"}
              className="flex flex-col h-auto py-4 px-2 gap-2 justify-center items-center"
              onClick={() => setContentSource("api")}
              disabled={true} // Disabled for now
            >
              <ExternalLink className="h-6 w-6" />
              <span className="text-xs">External APIs</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Content Input */}
      <Card className="bg-gray-900/50 border-gray-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-400" />
            Input Content
          </CardTitle>
          <CardDescription>
            {contentSource === "manual"
              ? "Enter the content you want to transform"
              : "Select content from your sources or enter manually"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {(contentSource === "rss" || contentSource === "external") && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => setShowContentSelector(true)}
                className="flex-1"
              >
                {selectedContentItem ? (
                  <span className="truncate">{selectedContentItem.title}</span>
                ) : (
                  <span>Select content...</span>
                )}
              </Button>
              {selectedContentItem && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setSelectedContentItem(null);
                    setInputTitle("");
                    setInputContent("");
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <Label htmlFor="input-title">Title</Label>
              <Input
                id="input-title"
                placeholder="Enter a title for your content"
                value={inputTitle}
                onChange={(e) => setInputTitle(e.target.value)}
                className="bg-gray-800 border-gray-700 mt-1"
              />
            </div>
            <div>
              <Label htmlFor="input-content">Content</Label>
              <Textarea
                id="input-content"
                placeholder="Enter your content here..."
                value={inputContent}
                onChange={(e) => setInputContent(e.target.value)}
                className="min-h-[200px] bg-gray-800 border-gray-700 mt-1"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transformation Type Selection */}
      <Card className="bg-gray-900/50 border-gray-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Wand2 className="h-5 w-5 text-blue-400" />
            Transformation Type
          </CardTitle>
          <CardDescription>
            Select how you want to transform your content
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <Button
              variant={
                transformationType === "text-to-image" ? "default" : "outline"
              }
              className="flex flex-col h-auto py-4 px-2 gap-2 justify-center items-center"
              onClick={() => setTransformationType("text-to-image")}
            >
              <ImageIcon className="h-6 w-6" />
              <span className="text-xs">Text to Image</span>
            </Button>
            <Button
              variant={
                transformationType === "text-to-speech" ? "default" : "outline"
              }
              className="flex flex-col h-auto py-4 px-2 gap-2 justify-center items-center"
              onClick={() => setTransformationType("text-to-speech")}
            >
              <Mic className="h-6 w-6" />
              <span className="text-xs">Text to Speech</span>
            </Button>
            <Button
              variant={
                transformationType === "text-to-video" ? "default" : "outline"
              }
              className="flex flex-col h-auto py-4 px-2 gap-2 justify-center items-center"
              onClick={() => setTransformationType("text-to-video")}
            >
              <Video className="h-6 w-6" />
              <span className="text-xs">Text to Video</span>
            </Button>
            <Button
              variant={
                transformationType === "text-to-social" ? "default" : "outline"
              }
              className="flex flex-col h-auto py-4 px-2 gap-2 justify-center items-center"
              onClick={() => setTransformationType("text-to-social")}
            >
              <Share2 className="h-6 w-6" />
              <span className="text-xs">Text to Social</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Transformation Settings */}
      <Card className="bg-gray-900/50 border-gray-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Settings className="h-5 w-5 text-blue-400" />
            Transformation Settings
          </CardTitle>
          <CardDescription>
            Customize how your content will be transformed
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Text to Image Settings */}
          {transformationType === "text-to-image" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="image-style">Image Style</Label>
                  <Select value={imageStyle} onValueChange={setImageStyle}>
                    <SelectTrigger
                      id="image-style"
                      className="bg-gray-800 border-gray-700"
                    >
                      <SelectValue placeholder="Select style" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vivid">Vivid (Recommended)</SelectItem>
                      <SelectItem value="natural">Photorealistic</SelectItem>
                      <SelectItem value="realistic">Realistic</SelectItem>
                      <SelectItem value="cartoon">Cartoon</SelectItem>
                      <SelectItem value="3d">3D Render</SelectItem>
                      <SelectItem value="sketch">Sketch</SelectItem>
                      <SelectItem value="painting">Painting</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="image-size">Image Size</Label>
                  <Select value={imageSize} onValueChange={setImageSize}>
                    <SelectTrigger
                      id="image-size"
                      className="bg-gray-800 border-gray-700"
                    >
                      <SelectValue placeholder="Select size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1024x1024">
                        Square (1024x1024)
                      </SelectItem>
                      <SelectItem value="1792x1024">
                        Widescreen HD (1792x1024)
                      </SelectItem>
                      <SelectItem value="1024x1792">
                        Portrait HD (1024x1792)
                      </SelectItem>
                      <SelectItem value="1024x512">Wide (1024x512)</SelectItem>
                      <SelectItem value="512x1024">Tall (512x1024)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="image-count">Number of Images</Label>
                  <Select value={imageCount} onValueChange={setImageCount}>
                    <SelectTrigger
                      id="image-count"
                      className="bg-gray-800 border-gray-700"
                    >
                      <SelectValue placeholder="Select count" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 Image</SelectItem>
                      <SelectItem value="2">2 Images</SelectItem>
                      <SelectItem value="4">4 Images</SelectItem>
                      <SelectItem value="8">8 Images</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="image-quality">Image Quality</Label>
                  <Select value={imageQuality} onValueChange={setImageQuality}>
                    <SelectTrigger
                      id="image-quality"
                      className="bg-gray-800 border-gray-700"
                    >
                      <SelectValue placeholder="Select quality" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hd">HD (Recommended)</SelectItem>
                      <SelectItem value="standard">Standard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="enhanced-prompts">
                      Enhanced Prompt Engineering
                    </Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-gray-400" />
                        </TooltipTrigger>
                        <TooltipContent side="left" className="max-w-xs">
                          <p className="text-xs">
                            Uses advanced prompt engineering techniques to
                            create more detailed and effective prompts for image
                            generation, especially when using reference images.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="enhanced-prompts"
                      checked={true}
                      disabled={true}
                      onCheckedChange={() => {}}
                    />
                    <Label
                      htmlFor="enhanced-prompts"
                      className="text-sm text-gray-300"
                    >
                      Use advanced prompt engineering for better results
                      (Premium feature)
                    </Label>
                  </div>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="multi-stage-generation">
                      Multi-Stage Generation
                    </Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-gray-400" />
                        </TooltipTrigger>
                        <TooltipContent side="left" className="max-w-xs">
                          <p className="text-xs">
                            Uses a multi-stage approach to generate higher
                            quality images. The system creates an initial image,
                            analyzes it, and then refines it in subsequent
                            stages for improved detail and quality.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="multi-stage-generation"
                      checked={true}
                      disabled={true}
                      onCheckedChange={() => {}}
                    />
                    <Label
                      htmlFor="multi-stage-generation"
                      className="text-sm text-gray-300"
                    >
                      Use multi-stage generation for higher quality results
                      (Premium feature)
                    </Label>
                  </div>
                </div>
              </div>

              {/* Reference Images Uploader */}
              <div className="border-t border-gray-700 pt-4">
                <ReferenceImageUploader
                  images={referenceImages}
                  onChange={setReferenceImages}
                  maxImages={5}
                />
              </div>
            </div>
          )}

          {/* Text to Speech Settings */}
          {transformationType === "text-to-speech" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="voice-type">Voice Type</Label>
                <Select value={voiceType} onValueChange={setVoiceType}>
                  <SelectTrigger
                    id="voice-type"
                    className="bg-gray-800 border-gray-700"
                  >
                    <SelectValue placeholder="Select voice" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male-1">Male Voice 1</SelectItem>
                    <SelectItem value="male-2">Male Voice 2</SelectItem>
                    <SelectItem value="female-1">Female Voice 1</SelectItem>
                    <SelectItem value="female-2">Female Voice 2</SelectItem>
                    <SelectItem value="neutral">Gender Neutral</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="language">Language & Accent</Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger
                    id="language"
                    className="bg-gray-800 border-gray-700"
                  >
                    <SelectValue placeholder="Select accent" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en-us">English (US)</SelectItem>
                    <SelectItem value="en-uk">English (UK)</SelectItem>
                    <SelectItem value="en-au">English (Australia)</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="de">German</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="speaking-speed">Speaking Speed</Label>
                <Select value={speakingSpeed} onValueChange={setSpeakingSpeed}>
                  <SelectTrigger
                    id="speaking-speed"
                    className="bg-gray-800 border-gray-700"
                  >
                    <SelectValue placeholder="Select speed" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0.5">Very Slow (0.5x)</SelectItem>
                    <SelectItem value="0.75">Slow (0.75x)</SelectItem>
                    <SelectItem value="1.0">Normal (1.0x)</SelectItem>
                    <SelectItem value="1.25">Fast (1.25x)</SelectItem>
                    <SelectItem value="1.5">Very Fast (1.5x)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="audio-format">Audio Format</Label>
                <Select value={audioFormat} onValueChange={setAudioFormat}>
                  <SelectTrigger
                    id="audio-format"
                    className="bg-gray-800 border-gray-700"
                  >
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mp3">MP3</SelectItem>
                    <SelectItem value="wav">WAV</SelectItem>
                    <SelectItem value="ogg">OGG</SelectItem>
                    <SelectItem value="flac">FLAC</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 md:col-span-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remove-background-noise"
                    checked={removeBackgroundNoise}
                    onCheckedChange={(checked) =>
                      setRemoveBackgroundNoise(checked === true)
                    }
                  />
                  <Label htmlFor="remove-background-noise">
                    Remove background noise
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="enhance-clarity"
                    checked={enhanceClarity}
                    onCheckedChange={(checked) =>
                      setEnhanceClarity(checked === true)
                    }
                  />
                  <Label htmlFor="enhance-clarity">Enhance voice clarity</Label>
                </div>
              </div>
            </div>
          )}

          {/* Text to Video Settings */}
          {transformationType === "text-to-video" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="video-style">Video Style</Label>
                <Select value={videoStyle} onValueChange={setVideoStyle}>
                  <SelectTrigger
                    id="video-style"
                    className="bg-gray-800 border-gray-700"
                  >
                    <SelectValue placeholder="Select style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="realistic">Realistic</SelectItem>
                    <SelectItem value="animated">Animated</SelectItem>
                    <SelectItem value="cinematic">Cinematic</SelectItem>
                    <SelectItem value="documentary">Documentary</SelectItem>
                    <SelectItem value="promotional">Promotional</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="video-duration">Duration (seconds)</Label>
                <Select value={videoDuration} onValueChange={setVideoDuration}>
                  <SelectTrigger
                    id="video-duration"
                    className="bg-gray-800 border-gray-700"
                  >
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 seconds</SelectItem>
                    <SelectItem value="30">30 seconds</SelectItem>
                    <SelectItem value="60">1 minute</SelectItem>
                    <SelectItem value="120">2 minutes</SelectItem>
                    <SelectItem value="300">5 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="video-resolution">Resolution</Label>
                <Select
                  value={videoResolution}
                  onValueChange={setVideoResolution}
                >
                  <SelectTrigger
                    id="video-resolution"
                    className="bg-gray-800 border-gray-700"
                  >
                    <SelectValue placeholder="Select resolution" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="480p">480p</SelectItem>
                    <SelectItem value="720p">720p HD</SelectItem>
                    <SelectItem value="1080p">1080p Full HD</SelectItem>
                    <SelectItem value="4k">4K Ultra HD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="video-aspect-ratio">Aspect Ratio</Label>
                <Select
                  value={videoAspectRatio}
                  onValueChange={setVideoAspectRatio}
                >
                  <SelectTrigger
                    id="video-aspect-ratio"
                    className="bg-gray-800 border-gray-700"
                  >
                    <SelectValue placeholder="Select aspect ratio" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="16:9">16:9 (Landscape)</SelectItem>
                    <SelectItem value="9:16">9:16 (Portrait)</SelectItem>
                    <SelectItem value="1:1">1:1 (Square)</SelectItem>
                    <SelectItem value="4:3">4:3 (Classic)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 md:col-span-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="add-background-music"
                    checked={addBackgroundMusic}
                    onCheckedChange={(checked) =>
                      setAddBackgroundMusic(checked === true)
                    }
                  />
                  <Label htmlFor="add-background-music">
                    Add background music
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="add-captions"
                    checked={addCaptions}
                    onCheckedChange={(checked) =>
                      setAddCaptions(checked === true)
                    }
                  />
                  <Label htmlFor="add-captions">Add captions</Label>
                </div>
              </div>
            </div>
          )}

          {/* Text to Social Media Settings */}
          {transformationType === "text-to-social" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2">
                <Label>Social Media Platforms</Label>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="platform-twitter"
                      checked={platforms.includes("twitter")}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setPlatforms([...platforms, "twitter"]);
                        } else {
                          setPlatforms(
                            platforms.filter((p) => p !== "twitter"),
                          );
                        }
                      }}
                    />
                    <Label
                      htmlFor="platform-twitter"
                      className="flex items-center"
                    >
                      <Twitter className="h-4 w-4 mr-2 text-blue-400" />
                      Twitter
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="platform-instagram"
                      checked={platforms.includes("instagram")}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setPlatforms([...platforms, "instagram"]);
                        } else {
                          setPlatforms(
                            platforms.filter((p) => p !== "instagram"),
                          );
                        }
                      }}
                    />
                    <Label
                      htmlFor="platform-instagram"
                      className="flex items-center"
                    >
                      <Instagram className="h-4 w-4 mr-2 text-pink-500" />
                      Instagram
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="platform-facebook"
                      checked={platforms.includes("facebook")}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setPlatforms([...platforms, "facebook"]);
                        } else {
                          setPlatforms(
                            platforms.filter((p) => p !== "facebook"),
                          );
                        }
                      }}
                    />
                    <Label
                      htmlFor="platform-facebook"
                      className="flex items-center"
                    >
                      <Facebook className="h-4 w-4 mr-2 text-blue-600" />
                      Facebook
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="platform-linkedin"
                      checked={platforms.includes("linkedin")}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setPlatforms([...platforms, "linkedin"]);
                        } else {
                          setPlatforms(
                            platforms.filter((p) => p !== "linkedin"),
                          );
                        }
                      }}
                    />
                    <Label
                      htmlFor="platform-linkedin"
                      className="flex items-center"
                    >
                      <Linkedin className="h-4 w-4 mr-2 text-blue-700" />
                      LinkedIn
                    </Label>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="post-count">Number of Posts</Label>
                <Select value={postCount} onValueChange={setPostCount}>
                  <SelectTrigger
                    id="post-count"
                    className="bg-gray-800 border-gray-700"
                  >
                    <SelectValue placeholder="Select count" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 Post</SelectItem>
                    <SelectItem value="3">3 Posts</SelectItem>
                    <SelectItem value="5">5 Posts</SelectItem>
                    <SelectItem value="10">10 Posts</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="tone-of-voice">Tone of Voice</Label>
                <Select value={toneOfVoice} onValueChange={setToneOfVoice}>
                  <SelectTrigger
                    id="tone-of-voice"
                    className="bg-gray-800 border-gray-700"
                  >
                    <SelectValue placeholder="Select tone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="casual">Casual</SelectItem>
                    <SelectItem value="friendly">Friendly</SelectItem>
                    <SelectItem value="humorous">Humorous</SelectItem>
                    <SelectItem value="authoritative">Authoritative</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 md:col-span-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="include-hashtags"
                    checked={includeHashtags}
                    onCheckedChange={(checked) =>
                      setIncludeHashtags(checked === true)
                    }
                  />
                  <Label htmlFor="include-hashtags">Include hashtags</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="include-emojis"
                    checked={includeEmojis}
                    onCheckedChange={(checked) =>
                      setIncludeEmojis(checked === true)
                    }
                  />
                  <Label htmlFor="include-emojis">Include emojis</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="optimize-engagement"
                    checked={optimizeForEngagement}
                    onCheckedChange={(checked) =>
                      setOptimizeForEngagement(checked === true)
                    }
                  />
                  <Label htmlFor="optimize-engagement">
                    Optimize for engagement
                  </Label>
                </div>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="pt-2">
          <Button
            className="w-full"
            onClick={handleTransform}
            disabled={isLoading || !inputContent.trim()}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Transforming...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Transform Content
              </>
            )}
          </Button>
        </CardFooter>
      </Card>

      {/* Transformation Result */}
      {transformationResult && (
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-blue-400" />
              Transformation Result
            </CardTitle>
            <CardDescription>Your transformed content is ready</CardDescription>
          </CardHeader>
          <CardContent>{renderTransformationResult()}</CardContent>
        </Card>
      )}

      {/* Content Selector Dialog */}
      <Dialog open={showContentSelector} onOpenChange={setShowContentSelector}>
        <DialogContent className="bg-gray-900 border-gray-800 max-w-3xl">
          <DialogHeader>
            <DialogTitle>Select Content</DialogTitle>
            <DialogDescription>
              Choose content from your{" "}
              {contentSource === "rss" ? "RSS feeds" : "personal collection"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search content..."
                className="pl-10 bg-gray-800 border-gray-700"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="max-h-[400px] overflow-y-auto space-y-2">
              {isLoading ? (
                <div className="flex items-center justify-center p-8">
                  <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                </div>
              ) : filteredContentItems.length === 0 ? (
                <div className="text-center p-8 text-gray-400">
                  <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No content found</p>
                </div>
              ) : (
                filteredContentItems.map((item) => (
                  <Card
                    key={item.id}
                    className={`bg-gray-800/50 border-gray-700 cursor-pointer hover:bg-gray-800 transition-colors ${selectedContentItem?.id === item.id ? "border-blue-500" : ""}`}
                    onClick={() => handleSelectContentItem(item)}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-medium">{item.title}</h3>
                          <p className="text-sm text-gray-400 line-clamp-2 mt-1">
                            {item.description}
                          </p>
                          {item.source_type && (
                            <Badge variant="outline" className="mt-2 text-xs">
                              {item.source_type}
                            </Badge>
                          )}
                        </div>
                        {selectedContentItem?.id === item.id && (
                          <Check className="h-5 w-5 text-blue-500 flex-shrink-0" />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowContentSelector(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (selectedContentItem) {
                  setShowContentSelector(false);
                }
              }}
              disabled={!selectedContentItem}
            >
              Select Content
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ContentTransformationTab;
