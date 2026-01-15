import { useState } from "react";
import { PricingCard } from "./PricingCard";
import { BillingHistory } from "./BillingHistory";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

type BillingCycle = "monthly" | "yearly";

export const SubscriptionTab = () => {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly");

  const handleUpgradeToPro = () => {
    // Mock: Would open payment flow
    toast.info("Funcionalidade de upgrade em desenvolvimento.");
    console.log("Upgrade to Pro clicked");
  };

  const handleContactSales = () => {
    // Mock: Would open contact form
    toast.info("Nossa equipe de vendas entrará em contato em breve.");
    console.log("Contact sales clicked");
  };

  return (
    <div className="animate-in fade-in space-y-8 duration-500">
      {/* Header */}
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h2 className="text-xl font-bold text-foreground">
            Planos e Assinatura
          </h2>
          <p className="mt-1 text-muted-foreground">
            Escolha o plano ideal para suas necessidades financeiras
          </p>
        </div>

        <div className="flex items-center rounded-lg bg-muted p-1">
          <button
            onClick={() => setBillingCycle("monthly")}
            className={`rounded-md px-4 py-2 text-sm font-medium transition-all ${
              billingCycle === "monthly"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
            aria-pressed={billingCycle === "monthly"}
          >
            Mensal
          </button>
          <button
            onClick={() => setBillingCycle("yearly")}
            className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all ${
              billingCycle === "yearly"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
            aria-pressed={billingCycle === "yearly"}
          >
            Anual
            <Badge variant="secondary" className="h-4 px-1.5 py-0 text-[10px]">
              Economize 20%
            </Badge>
          </button>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-3 lg:gap-8">
        <PricingCard
          title="Plano Básico"
          price={billingCycle === "monthly" ? "R$ 29,00" : "R$ 290,00"}
          period={billingCycle === "monthly" ? "/mês" : "/ano"}
          isCurrent
          buttonText="Plano Atual"
          features={[
            "Até 100 transações/mês",
            "3 metas simultâneas",
            "Relatórios básicos",
            "Suporte por email",
          ]}
          onButtonClick={() => {}}
        />

        <PricingCard
          title="Plano Pro"
          price={billingCycle === "monthly" ? "R$ 79,00" : "R$ 790,00"}
          period={billingCycle === "monthly" ? "/mês" : "/ano"}
          isPopular
          buttonText="Fazer Upgrade"
          features={[
            "Transações ilimitadas",
            "Metas ilimitadas",
            "Relatórios avançados",
            "Análise de gastos com IA",
            "Suporte prioritário",
          ]}
          onButtonClick={handleUpgradeToPro}
        />

        <PricingCard
          title="Plano Empresarial"
          price="Personalizado"
          isEnterprise
          buttonText="Falar com Vendas"
          features={[
            "Tudo do Pro",
            "Múltiplos usuários",
            "API de integração",
            "Gerente de conta dedicado",
            "SLA garantido",
          ]}
          onButtonClick={handleContactSales}
        />
      </div>

      {/* Billing History */}
      <div className="pt-8">
        <Separator className="mb-8" />
        <BillingHistory />
      </div>
    </div>
  );
};
