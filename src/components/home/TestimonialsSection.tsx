"use client";

import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Quote, MessageCircle } from "lucide-react";

// Testimonial interface
interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  content: string;
  avatar: string;
  companyColor: string;
}

export default function TestimonialsSection() {
  // Testimonials data
  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "CTO",
      company: "TechFlow",
      content:
        "ContentSphere has dramatically reduced our development time. The content transformation is seamless and the output quality is exceptional. We've increased our content production by 300% while maintaining our brand voice.",
      avatar: "sarah",
      companyColor: "bg-gradient-to-r from-purple-500 to-purple-700",
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Lead Developer",
      company: "InnovateCorp",
      content:
        "I've tried many content platforms, but ContentSphere stands out with its AI capabilities and user experience. Our team now produces content for 5 different channels in the time it used to take for just one.",
      avatar: "michael",
      companyColor: "bg-gradient-to-r from-blue-500 to-blue-700",
    },
    {
      id: 3,
      name: "Aisha Patel",
      role: "Product Manager",
      company: "DigitalWave",
      content:
        "Our marketing team was able to scale our content strategy in record time thanks to ContentSphere. The multi-format transformation features saved us weeks of work and helped us reach entirely new audiences.",
      avatar: "aisha",
      companyColor: "bg-gradient-to-r from-pink-500 to-pink-700",
    },
    {
      id: 4,
      name: "David Rodriguez",
      role: "Marketing Director",
      company: "GrowthLabs",
      content:
        "ContentSphere has been a game-changer for our content strategy. We're now able to maintain a consistent presence across all platforms with a fraction of the resources. The ROI has been incredible.",
      avatar: "david",
      companyColor: "bg-gradient-to-r from-green-500 to-green-700",
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
      {/* Gradient orbs */}
      <div className="absolute top-1/3 right-1/4 -z-10 h-[400px] w-[400px] rounded-full bg-purple-600/10 blur-[100px] opacity-70" />
      <div className="absolute bottom-0 left-1/3 -z-10 h-[300px] w-[300px] rounded-full bg-blue-600/10 blur-[100px] opacity-70" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16 max-w-3xl mx-auto"
        >
          <Badge className="mb-4 bg-white/10 backdrop-blur-sm text-pink-400 hover:bg-white/20 border-0 px-3 py-1.5">
            <MessageCircle className="h-3.5 w-3.5 mr-2" />
            Testimonials
          </Badge>
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Loved by <span className="text-purple-400">Forward-Thinking</span>{" "}
            Teams
          </h2>
          <p className="text-lg text-white/70">
            See how innovative companies are transforming their content strategy
            with ContentSphere.
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainerVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              variants={fadeInUpVariant}
              custom={index}
              className="group"
            >
              <Card className="h-full bg-black/40 backdrop-blur-md border border-white/10 hover:bg-white/5 transition-all duration-300 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Quote icon */}
                <div className="absolute top-4 right-4 opacity-10 text-white">
                  <Quote className="h-12 w-12" />
                </div>

                <CardHeader className="relative z-10 pb-2">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12 border-2 border-white/10 shadow-lg">
                      <AvatarImage
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${testimonial.avatar}`}
                        alt={testimonial.name}
                      />
                      <AvatarFallback
                        className={`${testimonial.companyColor} text-white`}
                      >
                        {testimonial.name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-white group-hover:text-purple-400 transition-colors duration-300">
                        {testimonial.name}
                      </CardTitle>
                      <CardDescription className="text-white/50">
                        {testimonial.role} at{" "}
                        <span className="font-medium text-white/70">
                          {testimonial.company}
                        </span>
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="relative z-10">
                  <div className="flex mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-purple-500 text-purple-500 drop-shadow-sm"
                      />
                    ))}
                  </div>
                  <p className="text-white/70 leading-relaxed">
                    {testimonial.content}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Featured testimonial */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-12 text-center"
        >
          <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 backdrop-blur-md border border-white/10 rounded-xl p-8 md:p-12 max-w-4xl mx-auto relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-soft-light pointer-events-none" />

            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full blur-sm opacity-70" />
                <Avatar className="h-20 w-20 border-4 border-black/50 shadow-xl relative">
                  <AvatarImage
                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=ceo"
                    alt="Alex Thompson"
                  />
                  <AvatarFallback className="bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xl">
                    AT
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>

            <blockquote className="text-xl md:text-2xl font-medium text-white mb-6 relative">
              <Quote className="absolute -top-6 -left-6 h-12 w-12 text-purple-500/20" />
              ContentSphere has completely transformed how our team creates
              content. What used to take us weeks now takes hours, and the
              quality is consistently excellent across all formats.
            </blockquote>

            <div className="text-white/70">
              <p className="font-bold text-white">Alex Thompson</p>
              <p>CEO at ContentScale</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
