import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const HeroSection = () => {
  return (
    <section className="w-full overflow-hidden py-20 md:py-32 lg:py-40">
      <div className="container relative px-4 md:px-6">
        <GridBackground />
        <HeroContent />
        <DashboardPreview />
      </div>
    </section>
  );
};

const GridBackground = () => (
  <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] dark:bg-black dark:bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)]" />
);

const HeroContent = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="mx-auto mb-12 max-w-3xl text-center"
  >
    <Badge
      className="mb-4 rounded-full border-[#0A84FF]/20 bg-[#0A84FF]/10 px-4 py-1.5 text-sm font-medium text-[#0A84FF]"
      variant="secondary"
    >
      Suas Finanças, Cristalinas
    </Badge>
    <h1 className="mb-6 text-balance text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
      Domine Seu Dinheiro, Sem Esforço
    </h1>
    <p className="mx-auto mb-8 max-w-2xl text-pretty text-lg text-muted-foreground md:text-xl">
      Um painel bonito para rastrear receitas, despesas e aumentar suas
      economias — tudo em um só lugar. Pare de se perguntar para onde vai seu
      dinheiro. Comece a saber.
    </p>
    <HeroButtons />
    <HeroChecklist />
  </motion.div>
);

const HeroButtons = () => (
  <div className="flex flex-col justify-center gap-4 sm:flex-row">
    <Link to="/register">
      <Button
        size="lg"
        className="h-12 rounded-full bg-gradient-to-r from-[#0A84FF] to-[#006FDB] px-8 text-base shadow-[0px_20px_32px_-18px_rgba(10,132,255,0.6)] hover:opacity-90"
      >
        Comece a Rastrear Hoje
        <ArrowRight className="ml-2 size-4" />
      </Button>
    </Link>
    <Button
      size="lg"
      variant="outline"
      className="h-12 rounded-full bg-transparent px-8 text-base"
    >
      Veja Como Funciona
    </Button>
  </div>
);

const HeroChecklist = () => {
  const items = [
    "Grátis para começar",
    "Sem cartão de crédito",
    "Cancele a qualquer momento",
  ];

  return (
    <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
      {items.map((item) => (
        <div key={item} className="flex items-center gap-1">
          <Check className="mr-2 size-4 text-[#0A84FF]" />
          <span>{item}</span>
        </div>
      ))}
    </div>
  );
};

const DashboardPreview = () => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.7, delay: 0.2 }}
    className="relative mx-auto max-w-5xl"
  >
    <div className="overflow-hidden rounded-xl border border-border/40 bg-gradient-to-b from-background to-muted/20 shadow-[0px_24px_44px_-24px_rgba(15,23,42,0.18)]">
      <img
        src="/assets/login-dashboard.png"
        width={1280}
        height={720}
        alt="cofrin.io dashboard"
        className="h-auto w-full"
      />
      <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-black/10 dark:ring-white/10" />
    </div>
    <div className="absolute -bottom-6 -right-6 -z-10 h-[300px] w-[300px] rounded-full bg-gradient-to-br from-[#0A84FF]/30 to-[#7C3AED]/30 opacity-70 blur-3xl" />
    <div className="absolute -left-6 -top-6 -z-10 h-[300px] w-[300px] rounded-full bg-gradient-to-br from-[#16A34A]/30 to-[#0A84FF]/30 opacity-70 blur-3xl" />
  </motion.div>
);

