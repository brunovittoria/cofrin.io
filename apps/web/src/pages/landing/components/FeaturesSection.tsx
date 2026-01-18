import { motion } from "framer-motion";
import {
  TrendingUp,
  CreditCard,
  Calendar,
  PieChart,
  Wallet,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    title: "Painel Financeiro Unificado",
    description:
      "Visão em tempo real de receitas, despesas e saldo com cartões visuais de KPIs e indicadores de tendência.",
    icon: <Wallet className="size-5" />,
  },
  {
    title: "Gestão de Transações",
    description:
      "Rastreie todas as receitas e despesas com histórico completo, busca e categorização inteligente.",
    icon: <TrendingUp className="size-5" />,
  },
  {
    title: "Inteligência de Categorias",
    description:
      "Criação de categorias personalizadas com codificação de cores e gráfico de pizza dos padrões de gastos.",
    icon: <PieChart className="size-5" />,
  },
  {
    title: "Rastreamento de Pagamentos Futuros",
    description:
      "Agende contas futuras e receitas esperadas. Rastreie pagamentos pendentes vs. concluídos.",
    icon: <Calendar className="size-5" />,
  },
  {
    title: "Gestão de Cartões de Crédito",
    description:
      "Registre múltiplos cartões de crédito, rastreie limites e uso com visualização do cartão.",
    icon: <CreditCard className="size-5" />,
  },
  {
    title: "Visualizações Lindas",
    description:
      "Gráficos de barras de receita vs despesa, gráficos de pizza de categorias e gráficos de linha de evolução do saldo.",
    icon: <PieChart className="size-5" />,
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export const FeaturesSection = () => {
  return (
    <section id="features" className="w-full py-20 md:py-32">
      <div className="container px-4 md:px-6">
        <SectionHeader />
        <FeaturesGrid />
      </div>
    </section>
  );
};

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
      Recursos
    </Badge>
    <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
      Tudo Que Você Precisa, Um Painel
    </h2>
    <p className="max-w-[800px] text-pretty text-muted-foreground md:text-lg">
      Veja seu panorama financeiro completo rapidamente. Rastreie receitas,
      despesas e seu saldo atual com visualizações bonitas e intuitivas.
    </p>
  </motion.div>
);

const FeaturesGrid = () => (
  <motion.div
    variants={container}
    initial="hidden"
    whileInView="show"
    viewport={{ once: true }}
    className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
  >
    {features.map((feature, i) => (
      <FeatureCard key={i} feature={feature} />
    ))}
  </motion.div>
);

type FeatureCardProps = {
  feature: {
    title: string;
    description: string;
    icon: React.ReactNode;
  };
};

const FeatureCard = ({ feature }: FeatureCardProps) => (
  <motion.div variants={item}>
    <Card className="h-full overflow-hidden border-border/40 bg-gradient-to-b from-background to-muted/10 backdrop-blur transition-all hover:shadow-md">
      <CardContent className="flex h-full flex-col p-6">
        <div className="mb-4 flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary dark:bg-primary/20">
          {feature.icon}
        </div>
        <h3 className="mb-2 text-xl font-bold">{feature.title}</h3>
        <p className="text-muted-foreground">{feature.description}</p>
      </CardContent>
    </Card>
  </motion.div>
);

