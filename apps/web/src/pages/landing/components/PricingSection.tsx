import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Plan = {
  name: string;
  price: string;
  description: string;
  features: string[];
  cta: string;
  popular?: boolean;
};

const monthlyPlans: Plan[] = [
  {
    name: "Grátis",
    price: "R$0",
    description: "Perfeito para começar com finanças pessoais.",
    features: [
      "Até 50 transações/mês",
      "Análises básicas",
      "3 categorias",
      "Suporte por email",
    ],
    cta: "Começar Grátis",
  },
  {
    name: "Premium",
    price: "R$19",
    description: "Ideal para rastreamento de finanças sério.",
    features: [
      "Transações ilimitadas",
      "Análises avançadas",
      "Categorias ilimitadas",
      "Suporte prioritário",
      "Gestão de cartão de crédito",
      "Rastreamento de pagamentos futuros",
    ],
    cta: "Iniciar Teste Grátis",
    popular: true,
  },
  {
    name: "Família",
    price: "R$39",
    description: "Para famílias gerenciando finanças juntas.",
    features: [
      "Tudo no Premium",
      "Até 5 membros da família",
      "Orçamentos compartilhados",
      "Relatórios familiares",
      "Suporte dedicado",
      "Opções de exportação personalizadas",
    ],
    cta: "Contatar Vendas",
  },
];

const annualPlans: Plan[] = [
  {
    name: "Grátis",
    price: "R$0",
    description: "Perfeito para começar com finanças pessoais.",
    features: [
      "Até 50 transações/mês",
      "Análises básicas",
      "3 categorias",
      "Suporte por email",
    ],
    cta: "Começar Grátis",
  },
  {
    name: "Premium",
    price: "R$15",
    description: "Ideal para rastreamento de finanças sério.",
    features: [
      "Transações ilimitadas",
      "Análises avançadas",
      "Categorias ilimitadas",
      "Suporte prioritário",
      "Gestão de cartão de crédito",
      "Rastreamento de pagamentos futuros",
    ],
    cta: "Iniciar Teste Grátis",
    popular: true,
  },
  {
    name: "Família",
    price: "R$31",
    description: "Para famílias gerenciando finanças juntas.",
    features: [
      "Tudo no Premium",
      "Até 5 membros da família",
      "Orçamentos compartilhados",
      "Relatórios familiares",
      "Suporte dedicado",
      "Opções de exportação personalizadas",
    ],
    cta: "Contatar Vendas",
  },
];

export const PricingSection = () => {
  return (
    <section
      id="pricing"
      className="relative w-full overflow-hidden bg-muted/30 py-20 md:py-32"
    >
      <GridBackground />
      <div className="container relative px-4 md:px-6">
        <SectionHeader />
        <PricingTabs />
      </div>
    </section>
  );
};

const GridBackground = () => (
  <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_40%,transparent_100%)] dark:bg-black dark:bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)]" />
);

const SectionHeader = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5 }}
    className="mb-12 flex flex-col items-center justify-center space-y-4 text-center"
  >
    <Badge
      className="rounded-full px-4 py-1.5 text-sm font-medium"
      variant="secondary"
    >
      Preços
    </Badge>
    <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
      Preços Simples e Transparentes
    </h2>
    <p className="max-w-[800px] text-pretty text-muted-foreground md:text-lg">
      Escolha o plano certo para você. Todos os planos incluem 14 dias de teste
      grátis.
    </p>
  </motion.div>
);

const PricingTabs = () => (
  <div className="mx-auto max-w-5xl">
    <Tabs defaultValue="monthly" className="w-full">
      <div className="mb-8 flex justify-center">
        <TabsList className="rounded-full p-1">
          <TabsTrigger value="monthly" className="rounded-full px-6">
            Mensal
          </TabsTrigger>
          <TabsTrigger value="annually" className="rounded-full px-6">
            Anual (Economize 20%)
          </TabsTrigger>
        </TabsList>
      </div>
      <TabsContent value="monthly">
        <PricingGrid plans={monthlyPlans} />
      </TabsContent>
      <TabsContent value="annually">
        <PricingGrid plans={annualPlans} />
      </TabsContent>
    </Tabs>
  </div>
);

type PricingGridProps = {
  plans: Plan[];
};

const PricingGrid = ({ plans }: PricingGridProps) => (
  <div className="grid gap-6 lg:grid-cols-3 lg:gap-8">
    {plans.map((plan, i) => (
      <PricingCard key={i} plan={plan} index={i} />
    ))}
  </div>
);

type PricingCardProps = {
  plan: Plan;
  index: number;
};

const PricingCard = ({ plan, index }: PricingCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
  >
    <Card
      className={`relative h-full overflow-hidden ${
        plan.popular
          ? "border-[#0A84FF] shadow-lg"
          : "border-border/40 shadow-md"
      } bg-gradient-to-b from-background to-muted/10 backdrop-blur`}
    >
      {plan.popular && (
        <div className="absolute right-0 top-0 rounded-bl-lg bg-[#0A84FF] px-3 py-1 text-xs font-medium text-white">
          Mais Popular
        </div>
      )}
      <CardContent className="flex h-full flex-col p-6">
        <h3 className="text-2xl font-bold">{plan.name}</h3>
        <div className="mt-4 flex items-baseline">
          <span className="text-4xl font-bold">{plan.price}</span>
          <span className="ml-1 text-muted-foreground">/mês</span>
        </div>
        <p className="mt-2 text-pretty text-muted-foreground">
          {plan.description}
        </p>
        <ul className="my-6 flex-grow space-y-3">
          {plan.features.map((feature, j) => (
            <li key={j} className="flex items-center">
              <Check className="mr-2 size-4 text-[#16A34A]" />
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>
        <Button
          className={`mt-auto w-full rounded-full ${
            plan.popular
              ? "bg-gradient-to-r from-[#0A84FF] to-[#006FDB] hover:opacity-90"
              : "bg-muted hover:bg-muted/80"
          }`}
          variant={plan.popular ? "default" : "outline"}
        >
          {plan.cta}
        </Button>
      </CardContent>
    </Card>
  </motion.div>
);

