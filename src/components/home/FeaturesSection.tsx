"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Zap,
  Target,
  Repeat,
  PenTool,
  Layers,
  Sparkles,
  LineChart,
  Globe,
} from "lucide-react";

// Feature interface
interface Feature {
  title: string;
  description: string;
  icon: JSX.Element;
  gradient: string;
}

export default function FeaturesSection() {
  // Features data
  const features: Feature[] = [
    {
      title: "10X Content Creation Speed",
      description:
        "Generate months of content in days with AI-powered workflows that dramatically accelerate your content production pipeline.",
      icon: <Zap className="h-6 w-6" />,
      gradient: "from-yellow-500 to-yellow-700",
    },
    {
      title: "Audience-Targeted Variations",
      description:
        "Instantly adapt your core content for different audience segments, personas, and buying stages with intelligent customization.",
      icon: <Target className="h-6 w-6" />,
      gradient: "from-green-500 to-green-700",
    },
    {
      title: "Multi-Format Transformation",
      description:
        "Turn blog posts into videos, podcasts, social snippets, email sequences, and more—all while maintaining your brand voice.",
      icon: <Repeat className="h-6 w-6" />,
      gradient: "from-blue-500 to-blue-700",
    },
    {
      title: "Brand Voice Preservation",
      description:
        "Our advanced AI understands and maintains your unique tone and messaging across all content variations and formats.",
      icon: <PenTool className="h-6 w-6" />,
      gradient: "from-purple-500 to-purple-700",
    },
    {
      title: "Content Distribution Hub",
      description:
        "Schedule and publish your repurposed content across channels from one unified dashboard, saving hours of manual work.",
      icon: <Layers className="h-6 w-6" />,
      gradient: "from-pink-500 to-pink-700",
    },
    {
      title: "Smart Content Suggestions",
      description:
        "Receive AI-powered recommendations for content angles, headlines, and formats that resonate with your target audience.",
      icon: <Sparkles className="h-6 w-6" />,
      gradient: "from-cyan-500 to-cyan-700",
    },
    {
      title: "Performance Analytics",
      description:
        "Track how your original and repurposed content performs across platforms to refine your strategy for maximum ROI.",
      icon: <LineChart className="h-6 w-6" />,
      gradient: "from-red-500 to-red-700",
    },
    {
      title: "Enterprise Scalability",
      description:
        "Support multi-team content operations with customizable workflows, approval chains, and content governance systems.",
      icon: <Globe className="h-6 w-6" />,
      gradient: "from-amber-500 to-amber-700",
    },
  ];

  const fadeInUpVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: (i = 0) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut",
      },
    }),
  };

  const staggerContainerVariant = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Gradient orb */}
      <div className="absolute top-1/2 left-1/4 -z-10 h-[400px] w-[400px] rounded-full bg-purple-600/10 blur-[100px] opacity-70" />
      <div className="absolute bottom-0 right-1/4 -z-10 h-[300px] w-[300px] rounded-full bg-blue-600/10 blur-[100px] opacity-70" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16 max-w-3xl mx-auto"
        >
          <Badge className="mb-4 bg-white/10 backdrop-blur-sm text-blue-400 hover:bg-white/20 border-0 px-3 py-1.5">
            <Sparkles className="h-3.5 w-3.5 mr-2" />
            Content Amplification
          </Badge>
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            One Content Piece,{" "}
            <span className="text-purple-400">Infinite Possibilities</span>
          </h2>
          <p className="text-lg text-white/70">
            Transform a single content asset into dozens of formats at 10X the
            speed and 1/10th the cost of traditional content creation methods.
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainerVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={fadeInUpVariant}
              custom={index}
              className="group"
            >
              <Card className="h-full bg-black/40 backdrop-blur-md border border-white/10 hover:bg-white/5 transition-all duration-300 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <CardHeader className="relative z-10">
                  <div
                    className={`bg-gradient-to-br ${feature.gradient} rounded-lg p-3 inline-block mb-4 shadow-lg`}
                  >
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl text-white/80 font-bold group-hover:text-purple-400 transition-colors duration-300">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative z-10">
                  <p className="text-white/70">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
