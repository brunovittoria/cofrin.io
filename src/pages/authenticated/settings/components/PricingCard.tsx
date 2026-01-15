import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface PricingCardProps {
  title: string;
  price: string;
  period?: string;
  features: string[];
  isCurrent?: boolean;
  isPopular?: boolean;
  isEnterprise?: boolean;
  buttonText: string;
  onButtonClick: () => void;
}

export const PricingCard = ({
  title,
  price,
  period,
  features,
  isCurrent,
  isPopular,
  isEnterprise,
  buttonText,
  onButtonClick,
}: PricingCardProps) => {
  const isPro = isPopular;

  return (
    <Card
      className={cn(
        "relative flex h-full flex-col transition-all duration-200",
        isPro
          ? "z-10 scale-105 border-primary bg-primary text-primary-foreground shadow-xl"
          : "bg-card hover:shadow-lg"
      )}
    >
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <CardTitle
            className={cn(
              "text-lg font-bold",
              isPro ? "text-primary-foreground" : "text-foreground"
            )}
          >
            {title}
          </CardTitle>
          {isCurrent && (
            <Badge variant="secondary" className="bg-green-100 text-green-700">
              PLANO ATUAL
            </Badge>
          )}
          {isPopular && (
            <Badge className="border-0 bg-orange-500 text-white">
              MAIS POPULAR
            </Badge>
          )}
          {isEnterprise && (
            <Badge variant="secondary" className="bg-purple-100 text-purple-700">
              ENTERPRISE
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col p-6 pt-0">
        <div className="mb-6">
          <span
            className={cn(
              "text-4xl font-bold",
              isPro ? "text-primary-foreground" : "text-foreground"
            )}
          >
            {price}
          </span>
          {period && (
            <span
              className={cn(
                "ml-1 text-sm",
                isPro ? "text-primary-foreground/70" : "text-muted-foreground"
              )}
            >
              {period}
            </span>
          )}
        </div>

        <Button
          variant={isPro ? "secondary" : isCurrent ? "secondary" : "outline"}
          className={cn(
            "mb-8 w-full",
            isPro && "border-0 bg-background font-semibold text-foreground hover:bg-background/90"
          )}
          disabled={isCurrent}
          onClick={onButtonClick}
        >
          {buttonText}
        </Button>

        <ul className="flex-1 space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <div
                className={cn(
                  "mr-3 mt-0.5 flex-shrink-0 rounded-full p-0.5",
                  isPro ? "bg-primary-foreground/20" : "bg-primary/10"
                )}
              >
                <Check
                  className={cn(
                    "h-3 w-3",
                    isPro ? "text-primary-foreground" : "text-primary"
                  )}
                />
              </div>
              <span
                className={cn(
                  "text-sm",
                  isPro ? "text-primary-foreground/80" : "text-muted-foreground"
                )}
              >
                {feature}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};
