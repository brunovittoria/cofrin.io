import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const CTASection = () => {
  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-br from-[#0A84FF] to-[#006FDB] py-20 text-white md:py-32">
      <GridBackground />
      <BlurEffects />
      <div className="container relative px-4 md:px-6">
        <CTAContent />
      </div>
    </section>
  );
};

const GridBackground = () => (
  <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:4rem_4rem]" />
);

const BlurEffects = () => (
  <>
    <div className="absolute -left-24 -top-24 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
    <div className="absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
  </>
);

const CTAContent = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5 }}
    className="mx-auto flex max-w-3xl flex-col items-center justify-center space-y-8 text-center"
  >
    <h2 className="text-balance text-3xl font-bold tracking-tight md:text-4xl">
      Pronto para Assumir o Controle de Suas Finanças?
    </h2>
    <p className="max-w-2xl text-pretty text-lg text-white/90 md:text-xl">
      Junte-se a milhares de pessoas que já estão rastreando seu dinheiro com
      mais inteligência com cofrin.io. Comece sua conta grátis hoje.
    </p>
    <CTAButtons />
  </motion.div>
);

const CTAButtons = () => (
  <div className="flex flex-col justify-center gap-4 sm:flex-row">
    <Link to="/register">
      <Button
        size="lg"
        variant="secondary"
        className="h-12 rounded-full bg-white px-8 text-base text-[#0A84FF] hover:bg-white/90"
      >
        Começar Grátis
        <ArrowRight className="ml-2 size-4" />
      </Button>
    </Link>
    <Button
      size="lg"
      variant="outline"
      className="h-12 rounded-full border-white/30 bg-transparent px-8 text-base text-white hover:bg-white/10"
    >
      Ver Demo
    </Button>
  </div>
);

