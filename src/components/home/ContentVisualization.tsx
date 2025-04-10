"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Video,
  ImageIcon,
  Headphones,
  Mail,
  Expand,
  Sparkles,
  Play,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ContentFormat {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  position: { x: number; y: number };
  gradient: string;
}

export function ContentVisualization() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isAnimating, setIsAnimating] = useState(true);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [showTransformation, setShowTransformation] = useState(false);
  const [activeFormat, setActiveFormat] = useState<string | null>(null);
  const [completedTransforms, setCompletedTransforms] = useState<string[]>([]);

  // Content formats that orbit around the central orb
  const contentFormats: ContentFormat[] = [
    {
      id: "blog",
      name: "Blog Posts",
      icon: <FileText className="h-6 w-6" />,
      color: "bg-emerald-500",
      gradient: "from-emerald-400 to-teal-600",
      position: { x: 0, y: -1 },
    },
    {
      id: "video",
      name: "Video Scripts",
      icon: <Video className="h-6 w-6" />,
      color: "bg-red-500",
      gradient: "from-red-400 to-rose-600",
      position: { x: 0.95, y: -0.31 },
    },
    {
      id: "social",
      name: "Social Media",
      icon: <ImageIcon className="h-6 w-6" />,
      color: "bg-blue-500",
      gradient: "from-blue-400 to-indigo-600",
      position: { x: 0.59, y: 0.81 },
    },
    {
      id: "podcast",
      name: "Podcast Transcripts",
      icon: <Headphones className="h-6 w-6" />,
      color: "bg-purple-500",
      gradient: "from-purple-400 to-violet-600",
      position: { x: -0.59, y: 0.81 },
    },
    {
      id: "email",
      name: "Email Newsletters",
      icon: <Mail className="h-6 w-6" />,
      color: "bg-amber-500",
      gradient: "from-amber-400 to-orange-600",
      position: { x: -0.95, y: -0.31 },
    },
  ];

  // Update container size on resize
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setContainerSize({ width, height });
      }
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  // Reset completed transforms when transformation is complete
  useEffect(() => {
    if (!showTransformation) {
      setCompletedTransforms([]);
    }
  }, [showTransformation]);

  // Calculate position based on container size and relative position
  const getPosition = (relativePos: { x: number; y: number }) => {
    const radius = Math.min(containerSize.width, containerSize.height) * 0.35;
    const centerX = containerSize.width / 2;
    const centerY = containerSize.height / 2;

    return {
      x: centerX + relativePos.x * radius,
      y: centerY + relativePos.y * radius,
    };
  };

  // Handle transformation completion for a specific format
  const handleTransformComplete = (formatId: string) => {
    if (!completedTransforms.includes(formatId)) {
      setCompletedTransforms((prev) => [...prev, formatId]);
    }
  };

  return (
    <div className="relative">
      {/* Premium header */}
      <div className="absolute top-4 left-4 z-10 flex items-center space-x-2">
        <div className="h-8 w-8 rounded-md bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg">
          <Sparkles className="h-5 w-5 text-white" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-white">ContentSphere</h3>
          <p className="text-xs text-blue-200">Content Transformation Engine</p>
        </div>
      </div>

      {/* Version badge */}
      <div className="absolute top-4 right-4 z-10">
        <Badge
          variant="outline"
          className="bg-slate-900/50 text-xs text-blue-200 backdrop-blur-sm border-blue-500/20"
        >
          v2.0 Enterprise
        </Badge>
      </div>

      <div
        ref={containerRef}
        className="relative w-full h-[600px] bg-gradient-to-b from-slate-950 to-slate-900 rounded-xl overflow-hidden shadow-2xl border border-slate-800"
      >
        {/* Premium background effects */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/10 via-slate-900/0 to-slate-950/0" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-[0.02]" />

        {/* Animated background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-blue-600/5 blur-3xl animate-pulse-slow" />
        <div
          className="absolute top-1/3 right-1/4 w-[300px] h-[300px] rounded-full bg-purple-600/5 blur-3xl animate-pulse-slow"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute bottom-1/3 left-1/4 w-[250px] h-[250px] rounded-full bg-emerald-600/5 blur-3xl animate-pulse-slow"
          style={{ animationDelay: "2s" }}
        />

        {/* Central orb */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-gradient-to-r from-cyan-300 to-blue-600 flex items-center justify-center shadow-[0_0_40px_rgba(56,189,248,0.5)] z-10"
          animate={{
            scale: [1, 1.05, 1],
            boxShadow: [
              "0 0 40px rgba(56,189,248,0.5)",
              "0 0 60px rgba(56,189,248,0.7)",
              "0 0 40px rgba(56,189,248,0.5)",
            ],
          }}
          transition={{
            duration: 4,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        >
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-300/10 to-blue-600/10 blur-xl" />
          <div className="relative bg-gradient-to-r from-cyan-500 to-blue-700 rounded-full w-16 h-16 flex items-center justify-center">
            <Expand className="text-white h-8 w-8 drop-shadow-md" />
          </div>
        </motion.div>

        {/* Orbiting content formats */}
        {containerSize.width > 0 &&
          contentFormats.map((format) => {
            const pos = getPosition(format.position);
            const isSource = format.id === "blog";
            const isTransformed = completedTransforms.includes(format.id);
            const isActive = activeFormat === format.id;

            return (
              <div
                key={format.id}
                className="absolute"
                style={{ top: 0, left: 0 }}
              >
                {/* Connection line */}
                <svg
                  className="absolute top-0 left-0"
                  width={containerSize.width}
                  height={containerSize.height}
                  style={{ overflow: "visible" }}
                >
                  <motion.path
                    d={`M ${containerSize.width / 2} ${containerSize.height / 2} L ${pos.x} ${pos.y}`}
                    stroke={`url(#gradient-${format.id})`}
                    strokeWidth="2"
                    fill="none"
                    strokeDasharray="5,5"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{
                      pathLength: isAnimating ? 1 : 0,
                      opacity: isAnimating ? 1 : 0,
                    }}
                    transition={{
                      duration: 1.5,
                      delay: 0.2,
                      ease: "easeInOut",
                    }}
                  />
                  <defs>
                    <linearGradient
                      id={`gradient-${format.id}`}
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="0%"
                    >
                      <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
                      <stop
                        offset="100%"
                        stopColor={format.color
                          .replace("bg-", "")
                          .replace("-500", "")}
                        stopOpacity="0.8"
                      />
                    </linearGradient>
                  </defs>
                </svg>

                {/* Content format card */}
                <motion.div
                  className="absolute"
                  style={{ top: pos.y - 40, left: pos.x - 60 }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{
                    opacity: 1,
                    scale: isActive ? 1.1 : 1,
                    x: [0, 5, 0, -5, 0],
                    y: [0, -5, 0, 5, 0],
                    zIndex: isActive ? 20 : 10,
                  }}
                  transition={{
                    opacity: { duration: 0.5, delay: 0.5 },
                    scale: { duration: 0.3 },
                    x: {
                      duration: 10,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                    },
                    y: {
                      duration: 15,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                    },
                  }}
                  onHoverStart={() => setActiveFormat(format.id)}
                  onHoverEnd={() => setActiveFormat(null)}
                >
                  <Card
                    className={cn(
                      "w-[120px] h-[80px] flex flex-col items-center justify-center p-2 border-0 backdrop-blur-md transition-all duration-300",
                      isTransformed
                        ? "bg-gradient-to-br border border-white/10 shadow-lg"
                        : "bg-slate-900/80 border border-slate-800/50",
                      isTransformed && `${format.gradient}`,
                      isActive && "shadow-xl border-blue-500/30",
                    )}
                  >
                    <div
                      className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center mb-1 transition-all duration-300",
                        isTransformed ? "bg-white" : format.color,
                      )}
                    >
                      {format.icon}
                    </div>
                    <p
                      className={cn(
                        "text-xs font-medium text-center",
                        isTransformed ? "text-white" : "text-slate-200",
                      )}
                    >
                      {format.name}
                    </p>
                  </Card>

                  {/* Source indicator */}
                  {isSource && (
                    <motion.div
                      className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white text-xs font-bold shadow-lg z-20"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 1 }}
                    >
                      <span>1</span>
                    </motion.div>
                  )}

                  {/* Transformation complete indicator */}
                  <AnimatePresence>
                    {isTransformed && !isSource && (
                      <motion.div
                        className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-white flex items-center justify-center text-emerald-600 text-xs font-bold shadow-lg z-20"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                      >
                        <span>✓</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </div>
            );
          })}

        {/* Content transformation animation */}
        {containerSize.width > 0 && showTransformation && (
          <>
            {contentFormats
              .filter((format) => format.id !== "blog")
              .map((format, index) => {
                const blogPos = getPosition(
                  contentFormats.find((f) => f.id === "blog")!.position,
                );
                const targetPos = getPosition(format.position);

                // Create a curved path between blog and target
                const midX = (blogPos.x + targetPos.x) / 2;
                const midY = (blogPos.y + targetPos.y) / 2 - 50; // Curve upward
                const path = `M ${blogPos.x} ${blogPos.y} Q ${midX} ${midY} ${targetPos.x} ${targetPos.y}`;

                return (
                  <svg
                    key={`transform-${format.id}`}
                    className="absolute top-0 left-0 pointer-events-none z-30"
                    width={containerSize.width}
                    height={containerSize.height}
                    style={{ overflow: "visible" }}
                  >
                    {/* Invisible path for animation */}
                    <path
                      d={path}
                      stroke="transparent"
                      fill="none"
                      id={`path-${format.id}`}
                    />

                    {/* Animated particles along the path */}
                    {[...Array(8)].map((_, i) => (
                      <motion.circle
                        key={`particle-${format.id}-${i}`}
                        r={i % 3 === 0 ? 4 : i % 3 === 1 ? 3 : 2}
                        fill={format.color
                          .replace("bg-", "")
                          .replace("-500", "")}
                        filter={`drop-shadow(0 0 5px ${format.color.replace("bg-", "").replace("-500", "")})`}
                        initial={{ opacity: 0 }}
                        animate={{
                          opacity: [0, 1, 0],
                        }}
                        transition={{
                          duration: 1.5,
                          delay: 0.15 * i + index * 0.3,
                          repeat: 1,
                          repeatDelay: 0.5,
                        }}
                        onAnimationComplete={() => {
                          if (i === 7) {
                            handleTransformComplete(format.id);
                          }
                        }}
                      >
                        <motion.animateMotion
                          path={path}
                          rotate={0}
                          begin="0s"
                          dur="1.5s"
                          fill="freeze"
                          repeatCount={2}
                          calcMode="spline"
                          keySplines="0.42 0 0.58 1"
                        />
                      </motion.circle>
                    ))}

                    {/* Glowing trail effect */}
                    <motion.path
                      d={path}
                      stroke={format.color
                        .replace("bg-", "")
                        .replace("-500", "")}
                      strokeWidth="3"
                      fill="none"
                      filter={`drop-shadow(0 0 3px ${format.color.replace("bg-", "").replace("-500", "")})`}
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{
                        pathLength: [0, 1],
                        opacity: [0, 0.6, 0],
                      }}
                      transition={{
                        pathLength: {
                          duration: 1.5,
                          delay: index * 0.3,
                          ease: "easeInOut",
                        },
                        opacity: {
                          duration: 3,
                          delay: index * 0.3,
                          times: [0, 0.5, 1],
                          ease: "easeInOut",
                        },
                      }}
                    />
                  </svg>
                );
              })}

            {/* Reset transformation after animation completes */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0 }}
              onAnimationComplete={() => {
                // Only reset after all formats have been transformed
                if (completedTransforms.length === contentFormats.length - 1) {
                  setTimeout(() => setShowTransformation(false), 3000);
                }
              }}
            />
          </>
        )}

        {/* Particle effects */}
        {Array.from({ length: 30 }).map((_, i) => (
          <motion.div
            key={i}
            className={cn(
              "absolute w-1 h-1 rounded-full",
              i % 5 === 0
                ? "bg-blue-300/40"
                : i % 5 === 1
                  ? "bg-purple-300/40"
                  : i % 5 === 2
                    ? "bg-emerald-300/40"
                    : i % 5 === 3
                      ? "bg-amber-300/40"
                      : "bg-rose-300/40",
            )}
            initial={{
              x: containerSize.width / 2,
              y: containerSize.height / 2,
              opacity: 0,
              scale: Math.random() * 0.5 + 0.5,
            }}
            animate={{
              x: containerSize.width * Math.random(),
              y: containerSize.height * Math.random(),
              opacity: [0, 0.7, 0],
              scale: Math.random() * 0.5 + 0.5,
            }}
            transition={{
              duration: 5 + Math.random() * 15,
              repeat: Number.POSITIVE_INFINITY,
              delay: Math.random() * 5,
            }}
          />
        ))}

        {/* Transform button */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center">
          <AnimatePresence mode="wait">
            {!showTransformation ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Button
                  onClick={() => setShowTransformation(true)}
                  disabled={showTransformation}
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-full px-6 py-6 font-medium shadow-lg hover:shadow-cyan-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed border-0 h-auto"
                >
                  <Play className="mr-2 h-5 w-5" />
                  Transform Content
                </Button>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex flex-col items-center"
              >
                <div className="text-sm font-medium text-blue-300 mb-2">
                  Transforming content...
                </div>
                <div className="flex space-x-1">
                  {contentFormats
                    .filter((format) => format.id !== "blog")
                    .map((format) => (
                      <motion.div
                        key={`progress-${format.id}`}
                        className={cn(
                          "h-1 w-6 rounded-full",
                          completedTransforms.includes(format.id)
                            ? format.color
                            : "bg-slate-700",
                        )}
                        initial={{ opacity: 0.5 }}
                        animate={{
                          opacity: completedTransforms.includes(format.id)
                            ? 1
                            : 0.5,
                          scale: completedTransforms.includes(format.id)
                            ? [1, 1.2, 1]
                            : 1,
                        }}
                        transition={{
                          scale: { duration: 0.3 },
                        }}
                      />
                    ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Premium footer */}
        <div className="absolute bottom-3 right-3 text-xs text-slate-400">
          Powered by ContentSphere™ AI Engine
        </div>
      </div>
    </div>
  );
}
