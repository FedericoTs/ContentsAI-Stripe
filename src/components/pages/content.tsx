import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import RssFeedTab from "../content/RssFeedTab";

const Content = () => {
  const [transformationType, setTransformationType] = useState("text-to-image");
  const [activeTab, setActiveTab] = useState("transform"); // transform, rss, personal

  return (
    <>
      {/* Tabs for different content sections */}
      <div className="flex space-x-2 mb-6">
        <Button
          variant={activeTab === "transform" ? "default" : "outline"}
          onClick={() => setActiveTab("transform")}
        >
          Content Transformation
        </Button>
        <Button
          variant={activeTab === "rss" ? "default" : "outline"}
          onClick={() => setActiveTab("rss")}
        >
          RSS Feeds
        </Button>
        <Button
          variant={activeTab === "personal" ? "default" : "outline"}
          onClick={() => setActiveTab("personal")}
        >
          Personal Collection
        </Button>
      </div>

      {/* RSS Feed Tab Content */}
      {activeTab === "rss" && <RssFeedTab />}

      {/* Personal Collection Tab Content */}
      {activeTab === "personal" && (
        <div className="p-6 rounded-lg border border-gray-800 bg-gray-900/50">
          <h2 className="text-xl font-semibold mb-4">Personal Collection</h2>
          <p className="text-gray-400">
            Import and manage your personal content collection.
          </p>
          {/* Personal collection content will go here */}
        </div>
      )}

      {/* Content Transformation Tab Content */}
      {activeTab === "transform" && (
        <div className="space-y-6">
          <div className="p-6 rounded-lg border border-gray-800 bg-gray-900/50">
            <h2 className="text-xl font-semibold mb-4">
              Content Transformation
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Transformation Type
                </label>
                <Select
                  value={transformationType}
                  onValueChange={setTransformationType}
                >
                  <SelectTrigger className="bg-gray-800 border-gray-700">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text-to-image">Text to Image</SelectItem>
                    <SelectItem value="text-to-speech">
                      Text to Speech
                    </SelectItem>
                    <SelectItem value="text-to-video">Text to Video</SelectItem>
                    <SelectItem value="text-to-social">
                      Text to Social Posts
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Input Content
                </label>
                <textarea
                  className="w-full h-40 rounded-md bg-gray-800 border-gray-700 p-3 text-sm"
                  placeholder="Enter your content here..."
                ></textarea>
              </div>
            </div>
          </div>

          {/* Text to Image Settings - Only visible when text-to-image is selected */}
          {transformationType === "text-to-image" && (
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
                      <SelectItem value="3d">3D Render</SelectItem>
                      <SelectItem value="sketch">Sketch</SelectItem>
                      <SelectItem value="painting">Painting</SelectItem>
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
                      <SelectItem value="medium">Medium (1024x1024)</SelectItem>
                      <SelectItem value="large">Large (2048x2048)</SelectItem>
                      <SelectItem value="wide">Wide (1024x512)</SelectItem>
                      <SelectItem value="tall">Tall (512x1024)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
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
                <div className="md:col-span-2 space-y-2 mt-2">
                  <div className="flex items-center">
                    <Checkbox id="filler" className="border-gray-700" />
                    <label htmlFor="filler" className="ml-2 text-sm">
                      Filter filler words (um, uh)
                    </label>
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
        </div>
      )}
    </>
  );
};

export default Content;
