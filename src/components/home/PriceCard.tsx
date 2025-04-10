import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, ChevronRight, Loader2, Sparkles } from "lucide-react";

// Define the Plan type
export interface Plan {
  id: string;
  object: string;
  active: boolean;
  amount: number;
  currency: string;
  interval: string;
  interval_count: number;
  product: string;
  product_name?: string;
  product_description?: string;
  created: number;
  livemode: boolean;
  [key: string]: any;
}

interface PriceCardProps {
  plan: Plan;
  isLoading: boolean;
  processingPlanId: string | null;
  onCheckout: (priceId: string) => void;
  formatCurrency: (amount: number, currency: string) => string;
  features: string[];
  isPopular?: boolean;
}

export default function PriceCard({
  plan,
  isLoading,
  processingPlanId,
  onCheckout,
  formatCurrency,
  features,
  isPopular = false,
}: PriceCardProps) {
  return (
    <Card
      key={plan.id}
      className={`relative flex flex-col h-full border-0 ${
        isPopular
          ? "bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 shadow-xl ring-2 ring-purple-500/20 scale-105 z-10"
          : "bg-gradient-to-b from-white to-gray-50 shadow-lg hover:shadow-xl"
      } 
        rounded-xl transition-all duration-300 transform hover:-translate-y-1`}
    >
      {isPopular && (
        <div className="absolute -top-4 left-0 right-0 flex justify-center">
          <Badge className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-1 rounded-full font-medium text-xs flex items-center gap-1">
            <Sparkles className="h-3.5 w-3.5" />
            MOST POPULAR
          </Badge>
        </div>
      )}
      <CardHeader className={`pb-4 ${isPopular ? "pt-8" : "pt-6"}"}`}>
        {plan.product_name && (
          <CardTitle className="text-xl font-bold text-gray-900">
            {plan.product_name}
          </CardTitle>
        )}
        <CardDescription className="text-sm text-gray-600 font-medium">
          {plan.interval_count === 1
            ? `${plan.interval.charAt(0).toUpperCase() + plan.interval.slice(1)}ly`
            : `Every ${plan.interval_count} ${plan.interval}s`}
        </CardDescription>
        <div className="mt-4 flex items-baseline">
          <span className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-indigo-700">
            {formatCurrency(plan.amount, plan.currency)}
          </span>
          <span className="text-gray-600 ml-1 font-medium">
            /{plan.interval}
          </span>
        </div>
        {plan.product_description && (
          <p className="mt-3 text-sm text-gray-600 leading-relaxed">
            {plan.product_description}
          </p>
        )}
      </CardHeader>
      <CardContent className="flex-grow px-6">
        <Separator className="my-4 bg-gray-200" />
        <ul className="space-y-4">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start text-gray-700">
              <CheckCircle2
                className={`h-5 w-5 ${isPopular ? "text-purple-600" : "text-indigo-600"} mr-3 flex-shrink-0 mt-0.5`}
              />
              <span className="text-sm font-medium">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter className="px-6 pb-6">
        <Button
          className={`w-full ${
            isPopular
              ? "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
              : "bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700"
          } 
            text-white font-medium py-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200`}
          onClick={() => onCheckout(plan.id)}
          disabled={isLoading}
        >
          {isLoading && processingPlanId === plan.id ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              Start Free Trial
              <ChevronRight className="ml-1 h-5 w-5" />
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
