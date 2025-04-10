import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap, Shield, Database, Code } from "lucide-react";

// Feature interface
interface Feature {
  title: string;
  description: string;
  icon: JSX.Element;
}

export default function FeaturesSection() {
  // Sample features data
  const features: Feature[] = [
    {
      title: "Lightning Fast Performance",
      description:
        "Built with React and SWC for optimal speed and efficiency in development and production.",
      icon: <Zap className="h-10 w-10 text-black" />,
    },
    {
      title: "Secure Authentication",
      description:
        "Powered by Supabase for robust, scalable authentication and user management.",
      icon: <Shield className="h-10 w-10 text-black" />,
    },
    {
      title: "Powerful Database",
      description:
        "Leverage Supabase's PostgreSQL database for reliable data storage and retrieval.",
      icon: <Database className="h-10 w-10 text-black" />,
    },
    {
      title: "Modern Tooling",
      description:
        "Includes TypeScript, Tailwind CSS, and other modern tools for productive development.",
      icon: <Code className="h-10 w-10 text-black" />,
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-gray-200 text-gray-800 hover:bg-gray-300 border-none">
            Features
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-black">
            Everything You Need to Build Modern Apps
          </h2>
          <p className="text-gray-600 max-w-[700px] mx-auto">
            Tempo Starter Kit combines the best tools and practices to help you
            build production-ready applications with minimal setup.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="border-gray-200 bg-gradient-to-b from-white to-gray-50 shadow-md hover:shadow-lg transition-shadow"
            >
              <CardHeader>
                <div className="mb-4">{feature.icon}</div>
                <CardTitle className="text-black">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
