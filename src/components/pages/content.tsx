import React, { useState } from "react";
import TopNavigation from "../dashboard/layout/TopNavigation";
import Sidebar from "../dashboard/layout/Sidebar";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import PersonalCollectionImport from "../content/PersonalCollectionImport";

const Content = () => {
  const [transformationType, setTransformationType] = useState("text-to-text");
  const [showPersonalImport, setShowPersonalImport] = useState(false);
  const [inputContent, setInputContent] = useState("");

  return (
    <div className="min-h-screen bg-black text-white">
      <TopNavigation />

      <div className="flex pt-16">
        <Sidebar activeItem="Content" />

        <main className="flex-1 overflow-auto p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-white">
              Content Management
            </h1>
            <p className="text-white/70">
              Create, manage, and repurpose your content across multiple
              formats.
            </p>
          </div>

          <Tabs
            defaultValue="text-to-text"
            className="mb-6"
            onValueChange={setTransformationType}
          >
            <TabsList className="bg-gray-800 border border-gray-700">
              <TabsTrigger value="text-to-text">Text to Text</TabsTrigger>
              <TabsTrigger value="text-to-image">Text to Image</TabsTrigger>
              <TabsTrigger value="speech-to-text">Speech to Text</TabsTrigger>
              <TabsTrigger value="text-to-speech">Text to Speech</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Input Section */}
            <div className="lg:col-span-2 space-y-4">
              {showPersonalImport ? (
                <PersonalCollectionImport
                  onImport={(content) => {
                    setInputContent(content);
                    setShowPersonalImport(false);
                  }}
                  onClose={() => setShowPersonalImport(false)}
                />
              ) : (
                <div className="p-6 rounded-lg border border-gray-800 bg-gray-900/50">
                  <h2 className="text-xl font-semibold mb-4">Input Content</h2>
                  <Textarea
                    placeholder="Paste or type your content here..."
                    className="min-h-[200px] bg-gray-800 border-gray-700"
                    value={inputContent}
                    onChange={(e) => setInputContent(e.target.value)}
                  />
                  <div className="mt-4 flex justify-between items-center">
                    <div>
                      <Button variant="outline" className="mr-2">
                        Upload File
                      </Button>
                      <Button variant="outline" className="mr-2">
                        Import from URL
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setShowPersonalImport(true)}
                      >
                        Personal Collection
                      </Button>
                    </div>
                    <div>
                      <span className="text-sm text-gray-400">0 words</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Output Format Section */}
              <div className="p-6 rounded-lg border border-gray-800 bg-gray-900/50">
                <h2 className="text-xl font-semibold mb-4">Output Format</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Primary Format
                    </label>
                    <Select>
                      <SelectTrigger className="bg-gray-800 border-gray-700">
                        <SelectValue placeholder="Select format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="blog">Blog Post</SelectItem>
                        <SelectItem value="social">
                          Social Media Post
                        </SelectItem>
                        <SelectItem value="email">Email Newsletter</SelectItem>
                        <SelectItem value="video">Video Script</SelectItem>
                        <SelectItem value="podcast">Podcast Script</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Content Length
                    </label>
                    <Select>
                      <SelectTrigger className="bg-gray-800 border-gray-700">
                        <SelectValue placeholder="Select length" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="short">
                          Short (&#60; 300 words)
                        </SelectItem>
                        <SelectItem value="medium">
                          Medium (300-800 words)
                        </SelectItem>
                        <SelectItem value="long">
                          Long (800-1500 words)
                        </SelectItem>
                        <SelectItem value="comprehensive">
                          Comprehensive (1500+ words)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>

            {/* Personalization Settings */}
            <div className="space-y-4">
              <div className="p-6 rounded-lg border border-gray-800 bg-gray-900/50">
                <h2 className="text-xl font-semibold mb-4">Personalization</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Tone
                    </label>
                    <Select>
                      <SelectTrigger className="bg-gray-800 border-gray-700">
                        <SelectValue placeholder="Select tone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="professional">
                          Professional
                        </SelectItem>
                        <SelectItem value="casual">Casual</SelectItem>
                        <SelectItem value="friendly">Friendly</SelectItem>
                        <SelectItem value="authoritative">
                          Authoritative
                        </SelectItem>
                        <SelectItem value="humorous">Humorous</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Target Audience
                    </label>
                    <Select>
                      <SelectTrigger className="bg-gray-800 border-gray-700">
                        <SelectValue placeholder="Select audience" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General</SelectItem>
                        <SelectItem value="technical">Technical</SelectItem>
                        <SelectItem value="business">Business</SelectItem>
                        <SelectItem value="creative">Creative</SelectItem>
                        <SelectItem value="academic">Academic</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-lg border border-gray-800 bg-gray-900/50">
                <h2 className="text-xl font-semibold mb-4">
                  Custom Instructions
                </h2>
                <Textarea
                  placeholder="Add any specific instructions or prompts..."
                  className="min-h-[100px] bg-gray-800 border-gray-700"
                />
              </div>
            </div>
          </div>

          {/* Text to Image Settings - Only visible when text-to-image is selected */}
          {transformationType === "text-to-image" && (
            <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                <div className="p-6 rounded-lg border border-gray-800 bg-gray-900/50">
                  <h2 className="text-xl font-semibold mb-4">Image Settings</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Image Style
                      </label>
                      <Select>
                        <SelectTrigger className="bg-gray-800 border-gray-700">
                          <SelectValue placeholder="Select style" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="realistic">Realistic</SelectItem>
                          <SelectItem value="cartoon">Cartoon</SelectItem>
                          <SelectItem value="abstract">Abstract</SelectItem>
                          <SelectItem value="3d">3D Render</SelectItem>
                          <SelectItem value="sketch">Sketch</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Image Size
                      </label>
                      <Select>
                        <SelectTrigger className="bg-gray-800 border-gray-700">
                          <SelectValue placeholder="Select size" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="small">Small (512x512)</SelectItem>
                          <SelectItem value="medium">
                            Medium (1024x1024)
                          </SelectItem>
                          <SelectItem value="large">
                            Large (2048x2048)
                          </SelectItem>
                          <SelectItem value="wide">Wide (1024x512)</SelectItem>
                          <SelectItem value="tall">Tall (512x1024)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-6 rounded-lg border border-gray-800 bg-gray-900/50">
                  <h2 className="text-xl font-semibold mb-4">
                    Advanced Settings
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Number of Images
                      </label>
                      <Select>
                        <SelectTrigger className="bg-gray-800 border-gray-700">
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
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Image Quality
                      </label>
                      <Select>
                        <SelectTrigger className="bg-gray-800 border-gray-700">
                          <SelectValue placeholder="Select quality" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="standard">Standard</SelectItem>
                          <SelectItem value="hd">HD</SelectItem>
                          <SelectItem value="premium">Premium</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Speech to Text Settings - Only visible when speech-to-text is selected */}
          {transformationType === "speech-to-text" && (
            <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                <div className="p-6 rounded-lg border border-gray-800 bg-gray-900/50">
                  <h2 className="text-xl font-semibold mb-4">Audio Input</h2>
                  <div className="space-y-4">
                    <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-700 rounded-lg bg-gray-800/50">
                      <div className="mb-4 p-4 rounded-full bg-gray-700">
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
                          className="text-white"
                        >
                          <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
                          <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                          <line x1="12" x2="12" y1="19" y2="22"></line>
                        </svg>
                      </div>
                      <Button className="mb-2">Record Audio</Button>
                      <span className="text-sm text-gray-400">or</span>
                      <Button variant="outline" className="mt-2">
                        Upload Audio File
                      </Button>
                      <p className="mt-4 text-xs text-gray-500">
                        Supported formats: MP3, WAV, M4A (Max 30 minutes)
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-6 rounded-lg border border-gray-800 bg-gray-900/50">
                  <h2 className="text-xl font-semibold mb-4">
                    Transcription Settings
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Language
                      </label>
                      <Select>
                        <SelectTrigger className="bg-gray-800 border-gray-700">
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="es">Spanish</SelectItem>
                          <SelectItem value="fr">French</SelectItem>
                          <SelectItem value="de">German</SelectItem>
                          <SelectItem value="ja">Japanese</SelectItem>
                          <SelectItem value="zh">Chinese</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Speaker Detection
                      </label>
                      <Select>
                        <SelectTrigger className="bg-gray-800 border-gray-700">
                          <SelectValue placeholder="Select option" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          <SelectItem value="basic">
                            Basic (2-3 speakers)
                          </SelectItem>
                          <SelectItem value="advanced">
                            Advanced (4+ speakers)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-6 rounded-lg border border-gray-800 bg-gray-900/50">
                  <h2 className="text-xl font-semibold mb-4">
                    Advanced Settings
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Transcription Model
                      </label>
                      <Select>
                        <SelectTrigger className="bg-gray-800 border-gray-700">
                          <SelectValue placeholder="Select model" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="standard">Standard</SelectItem>
                          <SelectItem value="enhanced">Enhanced</SelectItem>
                          <SelectItem value="premium">Premium</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Additional Features
                      </label>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <Checkbox
                            id="punctuation"
                            className="border-gray-700"
                          />
                          <label htmlFor="punctuation" className="ml-2 text-sm">
                            Auto-punctuation
                          </label>
                        </div>
                        <div className="flex items-center">
                          <Checkbox
                            id="timestamps"
                            className="border-gray-700"
                          />
                          <label htmlFor="timestamps" className="ml-2 text-sm">
                            Word-level timestamps
                          </label>
                        </div>
                        <div className="flex items-center">
                          <Checkbox id="filler" className="border-gray-700" />
                          <label htmlFor="filler" className="ml-2 text-sm">
                            Filter filler words (um, uh)
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Text to Speech Settings - Only visible when text-to-speech is selected */}
          {transformationType === "text-to-speech" && (
            <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                <div className="p-6 rounded-lg border border-gray-800 bg-gray-900/50">
                  <h2 className="text-xl font-semibold mb-4">Voice Settings</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Voice Type
                      </label>
                      <Select>
                        <SelectTrigger className="bg-gray-800 border-gray-700">
                          <SelectValue placeholder="Select voice" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male-1">Male Voice 1</SelectItem>
                          <SelectItem value="male-2">Male Voice 2</SelectItem>
                          <SelectItem value="female-1">
                            Female Voice 1
                          </SelectItem>
                          <SelectItem value="female-2">
                            Female Voice 2
                          </SelectItem>
                          <SelectItem value="neutral">
                            Gender Neutral
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Language & Accent
                      </label>
                      <Select>
                        <SelectTrigger className="bg-gray-800 border-gray-700">
                          <SelectValue placeholder="Select accent" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en-us">English (US)</SelectItem>
                          <SelectItem value="en-uk">English (UK)</SelectItem>
                          <SelectItem value="en-au">
                            English (Australia)
                          </SelectItem>
                          <SelectItem value="es">Spanish</SelectItem>
                          <SelectItem value="fr">French</SelectItem>
                          <SelectItem value="de">German</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                <div className="p-6 rounded-lg border border-gray-800 bg-gray-900/50">
                  <h2 className="text-xl font-semibold mb-4">
                    Speech Characteristics
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Speaking Speed
                      </label>
                      <Select>
                        <SelectTrigger className="bg-gray-800 border-gray-700">
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
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Pitch
                      </label>
                      <Select>
                        <SelectTrigger className="bg-gray-800 border-gray-700">
                          <SelectValue placeholder="Select pitch" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="very-low">Very Low</SelectItem>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="very-high">Very High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-6 rounded-lg border border-gray-800 bg-gray-900/50">
                  <h2 className="text-xl font-semibold mb-4">
                    Output Settings
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Audio Format
                      </label>
                      <Select>
                        <SelectTrigger className="bg-gray-800 border-gray-700">
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
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Audio Quality
                      </label>
                      <Select>
                        <SelectTrigger className="bg-gray-800 border-gray-700">
                          <SelectValue placeholder="Select quality" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="standard">Standard</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="premium">Premium</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2 mt-4">
                      <div className="flex items-center">
                        <Checkbox
                          id="background-noise"
                          className="border-gray-700"
                        />
                        <label
                          htmlFor="background-noise"
                          className="ml-2 text-sm"
                        >
                          Remove background noise
                        </label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox
                          id="enhance-clarity"
                          className="border-gray-700"
                        />
                        <label
                          htmlFor="enhance-clarity"
                          className="ml-2 text-sm"
                        >
                          Enhance voice clarity
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-6 flex justify-end space-x-4">
            <Button variant="outline">Save as Draft</Button>
            <Button>
              {transformationType === "text-to-image"
                ? "Generate Images"
                : "Generate Content"}
            </Button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Content;
