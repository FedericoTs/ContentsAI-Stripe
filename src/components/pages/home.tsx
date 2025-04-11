"use client";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

// UI Components
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Icons
import {
  Settings,
  User,
  LogOut,
  CheckCircle2,
  ArrowRight,
  Github,
  Twitter,
  Instagram,
  Sparkles,
  BarChart3,
  Zap,
  Globe,
  ChevronRight,
  Menu,
  X,
  Play,
  FileText,
  Video,
  ImageIcon,
  Headphones,
  Mail,
  Layers,
  Repeat,
  Clock,
  Lightbulb,
  Infinity,
  Shield,
  Star,
} from "lucide-react";

// Custom Components
import PricingSection from "../home/PricingSection";
import TestimonialsSection from "../home/TestimonialsSection";
import FeaturesSection from "../home/FeaturesSection";
import { ContentVisualization } from "../home/ContentVisualization";

// Auth
import { useAuth } from "../../../supabase/auth";

export default function LandingPage() {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const position = window.scrollY;
      const maxScroll = 200;
      const progress = Math.min(position / maxScroll, 1);
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Animated background gradient */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-purple-950 via-black to-black opacity-80" />
      {/* Gradient orbs */}
      <div className="fixed top-0 left-0 -z-10 h-[600px] w-[600px] rounded-full bg-purple-600/20 blur-[120px] opacity-70" />
      <div className="fixed bottom-0 right-0 -z-10 h-[600px] w-[600px] rounded-full bg-blue-600/20 blur-[120px] opacity-70" />
      {/* Noise texture overlay */}
      <div className="fixed inset-0 -z-10 bg-[url('/noise.png')] opacity-[0.03] mix-blend-soft-light pointer-events-none" />
      {/* Header */}
      <header
        className="fixed top-0 z-50 w-full transition-all duration-300"
        style={{
          backgroundColor: `rgba(0, 0, 0, ${0.3 + scrollProgress * 0.7})`,
          backdropFilter: `blur(${8 + scrollProgress * 8}px)`,
          borderBottom:
            scrollProgress > 0.1
              ? "1px solid rgba(255, 255, 255, 0.1)"
              : "none",
        }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center space-x-2">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg blur-sm opacity-70 animate-pulse" />
                  <div className="relative bg-black/50 backdrop-blur-md rounded-lg p-1.5 border border-white/10">
                    <Zap className="h-6 w-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400" />
                  </div>
                </div>
                <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
                  ContentSphere
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              <Link to="#features">
                <Button
                  variant="ghost"
                  className="text-white/70 hover:text-white hover:bg-white/10"
                >
                  Features
                </Button>
              </Link>
              <Link to="#pricing">
                <Button
                  variant="ghost"
                  className="text-white/70 hover:text-white hover:bg-white/10"
                >
                  Pricing
                </Button>
              </Link>
              <Link to="#testimonials">
                <Button
                  variant="ghost"
                  className="text-white/70 hover:text-white hover:bg-white/10"
                >
                  Testimonials
                </Button>
              </Link>
              <Link to="/docs">
                <Button
                  variant="ghost"
                  className="text-white/70 hover:text-white hover:bg-white/10"
                >
                  Documentation
                </Button>
              </Link>

              {user ? (
                <div className="flex items-center gap-2 ml-4">
                  <Link to="/dashboard">
                    <Button className="bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600 shadow-md hover:shadow-purple-500/20 border-0">
                      Dashboard
                    </Button>
                  </Link>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="gap-2 text-white/70 hover:text-white rounded-full p-0 w-10 h-10 hover:bg-white/10"
                      >
                        <Avatar className="h-10 w-10 border-2 border-purple-500/30">
                          <AvatarImage
                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`}
                            alt={user.email || ""}
                          />
                          <AvatarFallback className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
                            {user.email?.[0].toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="w-56 bg-black/90 backdrop-blur-xl border border-white/10 shadow-xl rounded-xl p-1"
                    >
                      <DropdownMenuLabel className="text-white font-normal">
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium">{user.email}</p>
                          <p className="text-xs text-white/70">Free Plan</p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator className="bg-white/10" />
                      <DropdownMenuItem className="text-white/80 hover:text-white focus:text-white cursor-pointer hover:bg-white/10 focus:bg-white/10">
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-white/80 hover:text-white focus:text-white cursor-pointer hover:bg-white/10 focus:bg-white/10">
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-white/10" />
                      <DropdownMenuItem
                        onSelect={() => signOut()}
                        className="text-white/80 hover:text-white focus:text-white cursor-pointer hover:bg-white/10 focus:bg-white/10"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Log out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ) : (
                <div className="flex items-center gap-2 ml-4">
                  <Link to="/login">
                    <Button
                      variant="ghost"
                      className="text-white/70 hover:text-white hover:bg-white/10"
                    >
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/signup">
                    <Button className="bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600 shadow-md hover:shadow-purple-500/20 border-0">
                      Get Started
                    </Button>
                  </Link>
                </div>
              )}
            </nav>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-white/70 hover:text-white hover:bg-white/10"
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-black/90 backdrop-blur-xl border-t border-white/10"
            >
              <div className="container mx-auto px-4 py-4 space-y-4">
                <Link to="#features" onClick={() => setMobileMenuOpen(false)}>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-white/70 hover:text-white hover:bg-white/10"
                  >
                    Features
                  </Button>
                </Link>
                <Link to="#pricing" onClick={() => setMobileMenuOpen(false)}>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-white/70 hover:text-white hover:bg-white/10"
                  >
                    Pricing
                  </Button>
                </Link>
                <Link
                  to="#testimonials"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-white/70 hover:text-white hover:bg-white/10"
                  >
                    Testimonials
                  </Button>
                </Link>
                <Link to="/docs" onClick={() => setMobileMenuOpen(false)}>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-white/70 hover:text-white hover:bg-white/10"
                  >
                    Documentation
                  </Button>
                </Link>
                <Separator className="bg-white/10" />
                {user ? (
                  <>
                    <Link
                      to="/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Button className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white border-0">
                        Dashboard
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      className="w-full border-white/20 text-white/70 hover:text-white"
                      onClick={() => {
                        signOut();
                        setMobileMenuOpen(false);
                      }}
                    >
                      Log out
                    </Button>
                  </>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                      <Button
                        variant="outline"
                        className="w-full border-white/20 text-white/70 hover:text-white"
                      >
                        Sign In
                      </Button>
                    </Link>
                    <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                      <Button className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white border-0">
                        Get Started
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
      <main>
        {/* Hero Section */}
        <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              variants={staggerContainerVariant}
              initial="hidden"
              animate="visible"
              className="flex flex-col lg:flex-row items-center gap-12"
            >
              <div className="lg:w-1/2 space-y-8">
                <motion.div variants={fadeInUpVariant} custom={0}>
                  <Badge className="mb-4 bg-white/10 backdrop-blur-sm text-purple-400 hover:bg-white/20 border-0 px-3 py-1.5">
                    <Sparkles className="h-3.5 w-3.5 mr-2" />
                    AI-Powered Content Platform
                  </Badge>
                </motion.div>

                <motion.h1
                  variants={fadeInUpVariant}
                  custom={1}
                  className="text-5xl md:text-7xl font-bold tracking-tight leading-tight"
                >
                  <span className="text-white">Transform</span>{" "}
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
                    One Idea
                  </span>{" "}
                  <span className="text-white">Into</span>{" "}
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                    Endless Content
                  </span>
                </motion.h1>

                <motion.p
                  variants={fadeInUpVariant}
                  custom={2}
                  className="text-lg md:text-xl text-white/70"
                >
                  Create, transform, and distribute content across all platforms
                  in seconds. Our AI engine turns a single input into multiple
                  formats, maximizing your reach and engagement with 10x less
                  effort.
                </motion.p>

                <motion.div
                  variants={fadeInUpVariant}
                  custom={3}
                  className="flex flex-col sm:flex-row gap-4"
                >
                  <Link to="/signup">
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600 shadow-lg hover:shadow-purple-500/20 border-0 h-12 px-8 relative overflow-hidden group"
                    >
                      <span className="relative z-10 flex items-center">
                        Start Creating Now
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </span>
                      <span className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    </Button>
                  </Link>
                </motion.div>

                <motion.div
                  variants={fadeInUpVariant}
                  custom={4}
                  className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-white/70"
                >
                  <div className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 text-purple-400 mr-1.5" />
                    <span className="text-white/80">
                      No credit card required
                    </span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 text-purple-400 mr-1.5" />
                    <span className="text-white/80">14-day free trial</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 text-purple-400 mr-1.5" />
                    <span className="text-white/80">Cancel anytime</span>
                  </div>
                </motion.div>
              </div>

              <motion.div
                className="lg:w-1/2 relative"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.3 }}
              >
                <div className="absolute -z-10 inset-0 bg-gradient-to-tr from-purple-500/20 via-blue-500/10 to-transparent rounded-3xl blur-2xl transform scale-110" />

                {/* Content Transformation Visualization */}
                <div className="bg-black/40 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-[0_0_50px_rgba(139,92,246,0.15)]">
                  <ContentVisualization />
                </div>

                {/* Stats overlay */}
                <motion.div
                  className="absolute -bottom-6 -left-6 bg-black/60 backdrop-blur-md shadow-xl rounded-xl p-4 border border-white/10"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.1, duration: 0.5 }}
                >
                  <div className="flex items-center space-x-4">
                    <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg p-2 text-white">
                      <BarChart3 className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs text-white/70">
                        Average Time Saved
                      </p>
                      <p className="text-lg font-bold text-white">
                        8.5 hours/week
                      </p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Logos Section */}
        <section className="py-12 border-t border-white/10 bg-black/30 backdrop-blur-md">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-8"
            >
              <p className="text-sm font-medium text-white/70">
                TRUSTED BY INNOVATIVE COMPANIES
              </p>
            </motion.div>

            <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8">
              {[
                "Google",
                "Microsoft",
                "Airbnb",
                "Spotify",
                "Slack",
                "Netflix",
              ].map((company, index) => (
                <motion.div
                  key={company}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * index, duration: 0.5 }}
                  className="grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
                >
                  <div className="h-8 flex items-center">
                    <span className="text-xl font-bold text-white">
                      {company}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Content Formats Section */}
        <section className="py-20 relative overflow-hidden">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-16 max-w-3xl mx-auto"
            >
              <Badge className="mb-4 bg-white/10 backdrop-blur-sm text-blue-400 hover:bg-white/20 border-0 px-3 py-1.5">
                <Layers className="h-3.5 w-3.5 mr-2" />
                Content Formats
              </Badge>
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                One Input,{" "}
                <span className="text-purple-400">Multiple Formats</span>
              </h2>
              <p className="text-lg text-white/70">
                Transform your content into various formats with a single click.
                Reach more audiences across different platforms and maximize
                your content's impact.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: <FileText className="h-6 w-6" />,
                  title: "Blog Posts",
                  description:
                    "Transform your ideas into SEO-optimized blog posts that rank higher and drive more traffic.",
                  color: "from-purple-500 to-purple-700",
                },
                {
                  icon: <Video className="h-6 w-6" />,
                  title: "Video Scripts",
                  description:
                    "Convert your content into engaging video scripts ready for production and social sharing.",
                  color: "from-blue-500 to-blue-700",
                },
                {
                  icon: <ImageIcon className="h-6 w-6" />,
                  title: "Social Media",
                  description:
                    "Generate platform-specific social posts optimized for engagement and reach.",
                  color: "from-pink-500 to-pink-700",
                },
                {
                  icon: <Headphones className="h-6 w-6" />,
                  title: "Podcast Scripts",
                  description:
                    "Turn your written content into conversational podcast scripts that connect with listeners.",
                  color: "from-green-500 to-green-700",
                },
                {
                  icon: <Mail className="h-6 w-6" />,
                  title: "Email Newsletters",
                  description:
                    "Create compelling email content that drives opens, clicks, and conversions.",
                  color: "from-yellow-500 to-yellow-700",
                },
                {
                  icon: <Repeat className="h-6 w-6" />,
                  title: "Content Repurposing",
                  description:
                    "Automatically repurpose existing content into new formats to extend its lifecycle.",
                  color: "from-red-500 to-red-700",
                },
              ].map((format, index) => (
                <motion.div
                  key={format.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * index, duration: 0.5 }}
                  className="bg-black/40 backdrop-blur-md border border-white/10 rounded-xl p-6 hover:bg-white/5 transition-all duration-300 group"
                >
                  <div
                    className={`bg-gradient-to-br ${format.color} rounded-lg p-3 inline-block mb-4 shadow-lg`}
                  >
                    {format.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-purple-400 transition-colors duration-300">
                    {format.title}
                  </h3>
                  <p className="text-white/70">{format.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Key Benefits Section */}
        <section className="py-20 relative overflow-hidden border-t border-white/10 bg-black/30 backdrop-blur-md">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-16 max-w-3xl mx-auto"
            >
              <Badge className="mb-4 bg-white/10 backdrop-blur-sm text-green-400 hover:bg-white/20 border-0 px-3 py-1.5">
                <Zap className="h-3.5 w-3.5 mr-2" />
                Key Benefits
              </Badge>
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                Why Teams <span className="text-blue-400">Choose Tempo</span>
              </h2>
              <p className="text-lg text-white/70">
                Our platform helps content teams, marketers, and creators save
                time, increase output, and maximize the impact of their content
                strategy.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: <Clock className="h-6 w-6" />,
                  title: "10x Faster Creation",
                  description:
                    "Create weeks worth of content in minutes, not days. Our AI handles the heavy lifting.",
                  stat: "90%",
                  statLabel: "time saved",
                },
                {
                  icon: <Layers className="h-6 w-6" />,
                  title: "Multi-Format Output",
                  description:
                    "Generate content for all platforms simultaneously from a single input.",
                  stat: "5+",
                  statLabel: "formats per input",
                },
                {
                  icon: <Globe className="h-6 w-6" />,
                  title: "Wider Reach",
                  description:
                    "Reach more audiences across different platforms with format-specific content.",
                  stat: "3x",
                  statLabel: "audience growth",
                },
                {
                  icon: <Lightbulb className="h-6 w-6" />,
                  title: "AI-Powered Ideas",
                  description:
                    "Never run out of content ideas with our AI-powered suggestion engine.",
                  stat: "∞",
                  statLabel: "content ideas",
                },
                {
                  icon: <Infinity className="h-6 w-6" />,
                  title: "Endless Variations",
                  description:
                    "Create multiple versions of your content to test and optimize performance.",
                  stat: "20+",
                  statLabel: "variations per piece",
                },
                {
                  icon: <Shield className="h-6 w-6" />,
                  title: "Brand Consistency",
                  description:
                    "Maintain consistent brand voice and messaging across all content formats.",
                  stat: "100%",
                  statLabel: "brand alignment",
                },
              ].map((benefit, index) => (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * index, duration: 0.5 }}
                  className="bg-gradient-to-br from-black/60 to-black/40 backdrop-blur-md border border-white/10 rounded-xl p-6 relative group"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="relative z-10">
                    <div className="bg-white/10 rounded-lg p-3 inline-block mb-4">
                      {benefit.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-2 group-hover:text-purple-400 transition-colors duration-300">
                      {benefit.title}
                    </h3>
                    <p className="text-white/70 mb-4">{benefit.description}</p>

                    <div className="flex items-center mt-auto">
                      <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
                        {benefit.stat}
                      </span>
                      <span className="ml-2 text-white/70">
                        {benefit.statLabel}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Performance Metrics Section */}
        <section className="py-20 relative overflow-hidden">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-5xl font-bold">
                <span className="text-white">Performance</span>{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
                  Insights
                </span>
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: "Content Creation Speed",
                  stat: "98%",
                  description:
                    "Faster content creation compared to traditional methods",
                  color: "from-purple-500 to-purple-700",
                },
                {
                  title: "Audience Growth",
                  stat: "250%",
                  description:
                    "Average audience growth for customers using multi-format content",
                  color: "from-blue-500 to-blue-700",
                },
                {
                  title: "Team Efficiency",
                  stat: "300%",
                  description:
                    "Increase in content team productivity and output",
                  color: "from-pink-500 to-pink-700",
                },
              ].map((metric, index) => (
                <motion.div
                  key={metric.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 * index, duration: 0.5 }}
                  className="bg-black/40 backdrop-blur-md border border-white/10 rounded-xl p-8 text-center"
                >
                  <h3 className="text-lg font-medium text-white/70 mb-2">
                    {metric.title}
                  </h3>
                  <div className="text-5xl font-bold mb-4 text-transparent bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text">
                    {metric.stat}
                  </div>
                  <p className="text-white/70">{metric.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section
          id="features"
          className="scroll-mt-20 border-t border-white/10 bg-black/30 backdrop-blur-md"
        >
          <FeaturesSection />
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="scroll-mt-20">
          <TestimonialsSection />
        </section>

        {/* Pricing Section */}
        <section
          id="pricing"
          className="scroll-mt-20 border-t border-white/10 bg-black/30 backdrop-blur-md"
        >
          <PricingSection />
        </section>

        {/* FAQ Section */}
        <section className="py-20 relative overflow-hidden">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-16"
            >
              <Badge className="mb-4 bg-white/10 backdrop-blur-sm text-yellow-400 hover:bg-white/20 border-0 px-3 py-1.5">
                <Lightbulb className="h-3.5 w-3.5 mr-2" />
                FAQ
              </Badge>
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                Frequently Asked{" "}
                <span className="text-purple-400">Questions</span>
              </h2>
              <p className="text-lg text-white/70">
                Everything you need to know about ContentSphere and how it can
                transform your content strategy.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Accordion type="single" collapsible className="space-y-4">
                {[
                  {
                    question:
                      "How does ContentSphere's AI content transformation work?",
                    answer:
                      "ContentSphere uses advanced AI models to analyze your input content and transform it into multiple formats while preserving your message and brand voice. Our technology understands context, audience, and platform-specific requirements to create optimized content for each channel.",
                  },
                  {
                    question: "Can I customize the output for my brand voice?",
                    answer:
                      "ContentSphere allows you to create and save brand voice profiles that include your tone, style preferences, key messaging, and even specific phrases to include or avoid. All generated content will align with your defined brand guidelines.",
                  },
                  {
                    question: "How much time can I save using ContentSphere?",
                    answer:
                      "Our customers report saving an average of 8.5 hours per week on content creation and distribution. This translates to approximately 54 hours per month or over 600 hours per year that can be redirected to strategy and other high-value activities.",
                  },
                  {
                    question:
                      "Is the content created by ContentSphere original and SEO-friendly?",
                    answer:
                      "Yes, all content created by ContentSphere is original and optimized for search engines. Our AI generates unique content based on your input, and our SEO enhancement features ensure your content includes relevant keywords, proper structure, and metadata recommendations.",
                  },
                  {
                    question:
                      "Can I integrate ContentSphere with my existing tools?",
                    answer:
                      "ContentSphere offers seamless integration with popular marketing tools, CMS platforms, social media schedulers, and analytics solutions. We support direct publishing to WordPress, Shopify, HubSpot, Buffer, Hootsuite, and many more platforms through our API and native integrations.",
                  },
                ].map((faq, index) => (
                  <AccordionItem
                    key={index}
                    value={`item-${index}`}
                    className="border border-white/10 rounded-lg bg-black/40 backdrop-blur-md overflow-hidden"
                  >
                    <AccordionTrigger className="px-6 py-4 hover:bg-white/5 text-left text-white hover:text-purple-400 transition-colors duration-300">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-4 pt-2 text-white/70">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 md:py-32 relative overflow-hidden border-t border-white/10">
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-purple-900/30 to-blue-900/30" />

          {/* Animated gradient orbs */}
          <motion.div
            className="absolute top-1/4 right-1/4 -z-10 h-[400px] w-[400px] rounded-full bg-purple-600/20 blur-[80px]"
            animate={{
              x: [0, 50, 0],
              y: [0, 30, 0],
            }}
            transition={{
              duration: 15,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
          />
          <motion.div
            className="absolute bottom-1/4 left-1/4 -z-10 h-[300px] w-[300px] rounded-full bg-blue-600/20 blur-[80px]"
            animate={{
              x: [0, -30, 0],
              y: [0, 50, 0],
            }}
            transition={{
              duration: 18,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
          />

          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="max-w-4xl mx-auto"
            >
              <div className="bg-black/60 backdrop-blur-xl rounded-3xl p-8 md:p-12 shadow-2xl border border-white/10 relative overflow-hidden">
                {/* Background pattern */}
                <div className="absolute inset-0 -z-10 opacity-[0.03]">
                  <svg
                    className="w-full h-full"
                    viewBox="0 0 100 100"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <pattern
                      id="grid"
                      width="10"
                      height="10"
                      patternUnits="userSpaceOnUse"
                    >
                      <path
                        d="M 10 0 L 0 0 0 10"
                        fill="none"
                        stroke="white"
                        strokeWidth="0.5"
                      />
                    </pattern>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                  </svg>
                </div>

                <div className="text-center">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                  >
                    <Badge className="mb-4 bg-white/10 backdrop-blur-sm text-purple-400 hover:bg-white/20 border-0 px-3 py-1.5">
                      <Star className="h-3.5 w-3.5 mr-2" />
                      Limited Time Offer
                    </Badge>
                  </motion.div>

                  <motion.h2
                    className="text-3xl md:text-5xl font-bold mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                  >
                    Ready to <span className="text-purple-400">Transform</span>{" "}
                    Your Content Strategy?
                  </motion.h2>

                  <motion.p
                    className="text-lg md:text-xl mb-8 text-white/70 max-w-2xl mx-auto"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                  >
                    Join thousands of forward-thinking companies already saving
                    time and maximizing their content reach with ContentSphere.
                  </motion.p>

                  <motion.div
                    className="flex flex-col sm:flex-row justify-center gap-4"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                  >
                    <Link to="/signup">
                      <Button
                        size="lg"
                        className="bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600 shadow-lg hover:shadow-purple-500/20 border-0 h-12 px-8 relative overflow-hidden group"
                      >
                        <span className="relative z-10 flex items-center">
                          Start Free Trial
                          <ChevronRight className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                        </span>
                        <span className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="lg"
                      className="border-white/20 text-white hover:bg-white/10 h-12 px-6"
                    >
                      Schedule a Demo
                    </Button>
                  </motion.div>

                  <motion.div
                    className="mt-8 flex justify-center items-center space-x-4"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                  >
                    <div className="flex -space-x-2">
                      {[...Array(4)].map((_, i) => (
                        <Avatar
                          key={i}
                          className="h-8 w-8 border-2 border-black"
                        >
                          <AvatarImage
                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`}
                          />
                          <AvatarFallback className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
                            {String.fromCharCode(65 + i)}
                          </AvatarFallback>
                        </Avatar>
                      ))}
                    </div>
                    <div className="text-sm text-white/70">
                      <span className="font-medium text-white">250+</span>{" "}
                      companies joined this month
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      {/* Footer */}
      <footer className="bg-black/60 backdrop-blur-md border-t border-white/10 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
            <div>
              <Link
                to="/"
                className="font-bold text-xl flex items-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400"
              >
                <div className="relative mr-2">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg blur-sm opacity-70" />
                  <div className="relative bg-black/50 backdrop-blur-md rounded-lg p-1.5 border border-white/10">
                    <Zap className="h-5 w-5 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400" />
                  </div>
                </div>
                ContentSphere
              </Link>
              <p className="text-white/70 mb-6">
                An AI-powered platform for transforming content into multiple
                formats, maximizing reach and engagement across all channels.
              </p>
              <div className="flex space-x-4">
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full text-white/70 hover:text-purple-400 hover:bg-white/5 transition-colors duration-300"
                >
                  <Github className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full text-white/70 hover:text-blue-400 hover:bg-white/5 transition-colors duration-300"
                >
                  <Twitter className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full text-white/70 hover:text-pink-400 hover:bg-white/5 transition-colors duration-300"
                >
                  <Instagram className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <div>
              <h3 className="font-medium text-lg mb-6 text-white">Product</h3>
              <ul className="space-y-4">
                <li>
                  <Link
                    to="#"
                    className="text-white/70 hover:text-purple-400 transition-colors duration-200"
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <Link
                    to="#"
                    className="text-white/70 hover:text-purple-400 transition-colors duration-200"
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link
                    to="#"
                    className="text-white/70 hover:text-purple-400 transition-colors duration-200"
                  >
                    Changelog
                  </Link>
                </li>
                <li>
                  <Link
                    to="#"
                    className="text-white/70 hover:text-purple-400 transition-colors duration-200"
                  >
                    Roadmap
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium text-lg mb-6 text-white">Resources</h3>
              <ul className="space-y-4">
                <li>
                  <Link
                    to="#"
                    className="text-white/70 hover:text-purple-400 transition-colors duration-200"
                  >
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link
                    to="#"
                    className="text-white/70 hover:text-purple-400 transition-colors duration-200"
                  >
                    Tutorials
                  </Link>
                </li>
                <li>
                  <Link
                    to="#"
                    className="text-white/70 hover:text-purple-400 transition-colors duration-200"
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    to="#"
                    className="text-white/70 hover:text-purple-400 transition-colors duration-200"
                  >
                    Support
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium text-lg mb-6 text-white">Company</h3>
              <ul className="space-y-4">
                <li>
                  <Link
                    to="#"
                    className="text-white/70 hover:text-purple-400 transition-colors duration-200"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    to="#"
                    className="text-white/70 hover:text-purple-400 transition-colors duration-200"
                  >
                    Careers
                  </Link>
                </li>
                <li>
                  <Link
                    to="#"
                    className="text-white/70 hover:text-purple-400 transition-colors duration-200"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    to="#"
                    className="text-white/70 hover:text-purple-400 transition-colors duration-200"
                  >
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <Separator className="my-10 bg-white/10" />

          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-white/70">
              © {new Date().getFullYear()} Tempo. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link
                to="#"
                className="text-sm text-white/70 hover:text-purple-400 transition-colors duration-200"
              >
                Privacy
              </Link>
              <Link
                to="#"
                className="text-sm text-white/70 hover:text-purple-400 transition-colors duration-200"
              >
                Terms
              </Link>
              <Link
                to="#"
                className="text-sm text-white/70 hover:text-purple-400 transition-colors duration-200"
              >
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </footer>
      <Toaster />
    </div>
  );
}
