import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Image as ImageIcon,
  X,
  Upload,
  Tag,
  Info,
  Trash2,
  Edit,
} from "lucide-react";

export type ReferenceImageType = {
  id: string;
  file: File | null;
  url: string;
  tag: string;
  weight: number; // 0-100 to determine influence
};

interface ReferenceImageUploaderProps {
  images: ReferenceImageType[];
  onChange: (images: ReferenceImageType[]) => void;
  maxImages?: number;
}

const ReferenceImageUploader: React.FC<ReferenceImageUploaderProps> = ({
  images,
  onChange,
  maxImages = 5,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [editingImageId, setEditingImageId] = useState<string | null>(null);

  // Available tags for reference images
  const availableTags = [
    { value: "brand", label: "Brand Identity" },
    { value: "product", label: "Product Image" },
    { value: "background", label: "Background" },
    { value: "style", label: "Style Reference" },
    { value: "color", label: "Color Palette" },
    { value: "layout", label: "Layout Reference" },
    { value: "mood", label: "Mood/Atmosphere" },
    { value: "person", label: "Person/Character" },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      const remainingSlots = maxImages - images.length;
      const filesToAdd = newFiles.slice(0, remainingSlots);

      const newImages = filesToAdd.map((file) => {
        // Create object URL for preview
        const url = URL.createObjectURL(file);
        return {
          id: crypto.randomUUID(),
          file,
          url,
          tag: "style", // Default tag
          weight: 50, // Default weight (medium influence)
        };
      });

      onChange([...images, ...newImages]);

      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemoveImage = (id: string) => {
    const updatedImages = images.filter((img) => img.id !== id);
    onChange(updatedImages);

    // If we're removing the image being edited, clear the editing state
    if (editingImageId === id) {
      setEditingImageId(null);
    }
  };

  const handleUpdateTag = (id: string, tag: string) => {
    const updatedImages = images.map((img) =>
      img.id === id ? { ...img, tag } : img,
    );
    onChange(updatedImages);
  };

  const handleUpdateWeight = (id: string, weight: number) => {
    const updatedImages = images.map((img) =>
      img.id === id ? { ...img, weight } : img,
    );
    onChange(updatedImages);
  };

  const getTagColor = (tag: string) => {
    switch (tag) {
      case "brand":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "product":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "background":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      case "style":
        return "bg-amber-500/20 text-amber-400 border-amber-500/30";
      case "color":
        return "bg-pink-500/20 text-pink-400 border-pink-500/30";
      case "layout":
        return "bg-indigo-500/20 text-indigo-400 border-indigo-500/30";
      case "mood":
        return "bg-teal-500/20 text-teal-400 border-teal-500/30";
      case "person":
        return "bg-orange-500/20 text-orange-400 border-orange-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <Label className="text-sm font-medium">Reference Images</Label>
          <p className="text-xs text-gray-400 mt-1">
            Upload images to use as references for image generation
          </p>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={images.length >= maxImages}
                className="flex items-center gap-1"
              >
                <Upload className="h-4 w-4" />
                Add Image
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>
                {images.length >= maxImages
                  ? `Maximum ${maxImages} images allowed`
                  : `Add up to ${maxImages - images.length} more reference images`}
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          multiple={maxImages - images.length > 1}
          className="hidden"
        />
      </div>

      {images.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((image) => (
            <Card
              key={image.id}
              className={`bg-gray-800/50 border-gray-700 overflow-hidden ${editingImageId === image.id ? "ring-2 ring-blue-500" : ""}`}
            >
              <div className="aspect-square relative">
                <img
                  src={image.url}
                  alt={`Reference ${image.tag}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 flex gap-1">
                  <Button
                    variant="secondary"
                    size="icon"
                    className="h-7 w-7 rounded-full bg-black/60 hover:bg-black/80 border-0"
                    onClick={() =>
                      setEditingImageId(
                        editingImageId === image.id ? null : image.id,
                      )
                    }
                  >
                    <Edit className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    className="h-7 w-7 rounded-full bg-black/60 hover:bg-red-600/80 border-0"
                    onClick={() => handleRemoveImage(image.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
                <Badge
                  className={`absolute bottom-2 left-2 ${getTagColor(image.tag)}`}
                >
                  <Tag className="h-3 w-3 mr-1" />
                  {availableTags.find((t) => t.value === image.tag)?.label ||
                    image.tag}
                </Badge>
              </div>

              {editingImageId === image.id && (
                <CardContent className="p-3 space-y-3">
                  <div className="space-y-1">
                    <Label htmlFor={`tag-${image.id}`} className="text-xs">
                      Image Purpose
                    </Label>
                    <Select
                      value={image.tag}
                      onValueChange={(value) =>
                        handleUpdateTag(image.id, value)
                      }
                    >
                      <SelectTrigger
                        id={`tag-${image.id}`}
                        className="h-8 text-xs bg-gray-900/50"
                      >
                        <SelectValue placeholder="Select tag" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableTags.map((tag) => (
                          <SelectItem key={tag.value} value={tag.value}>
                            {tag.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <Label htmlFor={`weight-${image.id}`} className="text-xs">
                        Influence Strength: {image.weight}%
                      </Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-3 w-3 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent side="left" className="max-w-xs">
                            <p className="text-xs">
                              Higher values give this reference image more
                              influence on the generated result
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <input
                      id={`weight-${image.id}`}
                      type="range"
                      min="10"
                      max="100"
                      value={image.weight}
                      onChange={(e) =>
                        handleUpdateWeight(image.id, parseInt(e.target.value))
                      }
                      className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      ) : (
        <div className="border border-dashed border-gray-700 rounded-md p-6 text-center">
          <ImageIcon className="h-10 w-10 mx-auto text-gray-500 mb-2" />
          <p className="text-sm text-gray-400">No reference images added yet</p>
          <p className="text-xs text-gray-500 mt-1">
            Upload images to influence the AI-generated results
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            className="mt-4"
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload Images
          </Button>
        </div>
      )}

      {images.length > 0 && (
        <div className="bg-blue-900/20 rounded-md border border-blue-500/20 p-3">
          <div className="flex items-start">
            <Info className="h-4 w-4 text-blue-400 mt-0.5 mr-2 flex-shrink-0" />
            <div className="text-xs text-gray-300">
              <p>
                <strong>How reference images work:</strong>
              </p>
              <ul className="list-disc pl-4 mt-1 space-y-1">
                <li>
                  Each image influences the AI generation based on its tag and
                  influence strength
                </li>
                <li>
                  <span className="text-blue-400">Brand Identity</span> images
                  help maintain consistent brand elements
                </li>
                <li>
                  <span className="text-green-400">Product Images</span> help
                  showcase your products accurately
                </li>
                <li>
                  <span className="text-amber-400">Style References</span>{" "}
                  influence the artistic style of the generated image
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReferenceImageUploader;
