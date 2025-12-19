import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

const steps = [
  {
    step: "01",
    title: "Criar Conta",
    description:
      "Cadastre-se com Google ou email em segundos. Nenhum cartão de crédito necessário para começar.",
  },
  {
    step: "02",
    title: "Adicionar Transações",
    description:
      "Registre rapidamente suas receitas e despesas. Crie categorias personalizadas para organizar seus gastos.",
  },
  {
    step: "03",
    title: "Rastrear e Melhorar",
    description:
      "Assista seu saldo crescer com gráficos visuais. Identifique padrões de gastos e economize com mais inteligência.",
  },
];

export const HowItWorksSection = () => {
  return (
    <section className="relative w-full overflow-hidden bg-muted/30 py-20 md:py-32">
      <GridBackground />
      <div className="container relative px-4 md:px-6">
        <SectionHeader />
        <StepsGrid />
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
    className="mb-16 flex flex-col items-center justify-center space-y-4 text-center"
  >
    <Badge
      className="rounded-full px-4 py-1.5 text-sm font-medium"
      variant="secondary"
    >
      Como Funciona
    </Badge>
    <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
      Processo Simples, Resultados Poderosos
    </h2>
    <p className="max-w-[800px] text-pretty text-muted-foreground md:text-lg">
      Comece em minutos e veja a diferença que nossa plataforma pode fazer para
      seu futuro financeiro.
    </p>
  </motion.div>
);

const StepsGrid = () => (
  <div className="relative grid gap-8 md:grid-cols-3 md:gap-12">
    <div className="absolute left-0 right-0 top-1/2 z-0 hidden h-0.5 -translate-y-1/2 bg-gradient-to-r from-transparent via-border to-transparent md:block" />
    {steps.map((stepItem, i) => (
      <StepCard key={i} stepItem={stepItem} index={i} />
    ))}
  </div>
);

type StepCardProps = {
  stepItem: {
    step: string;
    title: string;
    description: string;
  };
  index: number;
};

const StepCard = ({ stepItem, index }: StepCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    className="relative z-10 flex flex-col items-center space-y-4 text-center"
  >
    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#0A84FF] to-[#006FDB] text-xl font-bold text-white shadow-lg">
      {stepItem.step}
    </div>
    <h3 className="text-xl font-bold">{stepItem.title}</h3>
    <p className="text-pretty text-muted-foreground">{stepItem.description}</p>
  </motion.div>
);

